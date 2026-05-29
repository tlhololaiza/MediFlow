import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  setDoc,
  query,
  where
} from 'firebase/firestore';

// DOCTORS
export const getDoctors = async (): Promise<any[]> => {
  const querySnapshot = await getDocs(collection(db, 'doctors'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getDoctorById = async (docId: string) => {
  const docRef = doc(db, 'doctors', docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createDoctor = async (doctorData: any) => {
  const docRef = await addDoc(collection(db, 'doctors'), {
    ...doctorData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const updateDoctor = async (docId: string, data: any) => {
  const docRef = doc(db, 'doctors', docId);
  await updateDoc(docRef, { ...data, updatedAt: new Date() });
};

// USERS
export const createUserProfile = async (uid: string, userData: any): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    ...userData,
    createdAt: new Date()
  });
};

export const getUserProfile = async (uid: string): Promise<any> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserProfile = async (uid: string, data: any): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
};

// APPOINTMENTS
export const createAppointment = async (appointmentData: any): Promise<string> => {
  const docRef = await addDoc(collection(db, 'appointments'), {
    ...appointmentData,
    createdAt: new Date(),
    status: 'Booked'
  });
  return docRef.id;
};

export const getPatientAppointments = async (patientId: string): Promise<any[]> => {
  const q = query(
    collection(db, 'appointments'),
    where('patientId', '==', patientId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getDoctorAppointments = async (doctorId: string): Promise<any[]> => {
  const q = query(
    collection(db, 'appointments'),
    where('doctorId', '==', doctorId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
  const appRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appRef, { 
    status, 
    updatedAt: new Date() 
  });
};

// AVAILABILITY
export const getAvailability = async (doctorId: string, date: string) => {
  const q = query(
    collection(db, 'availability'),
    where('docId', '==', doctorId),
    where('date', '==', date)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
};

export const updateAvailability = async (doctorId: string, date: string, timeSlots: any[]) => {
  const q = query(
    collection(db, 'availability'),
    where('docId', '==', doctorId),
    where('date', '==', date)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.docs.length > 0) {
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { timeSlots });
  } else {
    await addDoc(collection(db, 'availability'), {
      docId: doctorId,
      date,
      timeSlots,
      createdAt: new Date()
    });
  }
};

// ADMIN FUNCTIONS
export const getAllUsers = async (): Promise<any[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getAllAppointments = async (): Promise<any[]> => {
  const querySnapshot = await getDocs(collection(db, 'appointments'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const deleteUser = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { deletedAt: new Date(), isActive: false });
};

export const deleteDoctor = async (docId: string) => {
  const docRef = doc(db, 'doctors', docId);
  await updateDoc(docRef, { deletedAt: new Date(), isActive: false });
};

export const deleteAppointment = async (appointmentId: string) => {
  const appRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appRef, { deletedAt: new Date() });
};