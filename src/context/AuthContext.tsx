// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string, userType?: 'patient' | 'doctor' | 'admin') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  userType: 'patient' | 'doctor' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'patient' | 'doctor' | 'admin' | null>(null);

  const signup = async (email: string, password: string, userType: 'patient' | 'doctor' | 'admin' = 'patient') => {
  try {
    setError(null);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    const profileData: any = {
      uid: userCredential.user.uid,
      email,
      userType,
      fullName: '',
      phone: '',
      createdAt: new Date()
    };

    // Add doctor-specific fields if doctor
    if (userType === 'doctor') {
      profileData.specialization = '';
      profileData.qualifications = '';
      profileData.experience = '';
      profileData.consultationFee = 0;
      profileData.bio = '';
      profileData.available = false;
    }

    await setDoc(doc(db, 'users', userCredential.user.uid), profileData);
    setUserType(userType);
  } catch (err: any) {
    setError(err.message);
    throw err;
  }
};

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user type from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserType(userData.userType || 'patient');
          }
        } catch (err) {
          console.error('Error fetching user type:', err);
          setUserType('patient');
        }
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, signup, login, logout, loading, error, userType };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};