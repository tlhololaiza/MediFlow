import React from 'react'

const App = () => {
  return (
    <div>
      <ul>
        <img src="src/assets/navbar_logo.png" alt="MediFlow Logo" />
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button>Create Account</button>
      <h1>Welcome to MediFlow</h1>
      <p>Your personal health management app.</p>

      <img src="src/assets/header_img.png" alt="MediFlow Hero Image" /> 

      <h3>Doctor Types</h3>
      <ul>
        <img src="src/assets/General_physician.svg" alt="General Practitioner" />
        <li>General Practitioner</li>

        <img src="src/assets/Gynecologist.svg" alt="Gynecologist" />
        <li>Gynecologist</li>

        <img src="src/assets/Gastroenterologist.svg" alt="Gastroenterologist" />
        <li>Gastroenterologist</li>

        <img src="src/assets/Neurologist.svg" alt="Neurologist" />
        <li>Neurologist</li>

        <img src="src/assets/Pediatricians.svg" alt="Pediatriician" />
        <li>Pediatrician</li>

        
      </ul>

      <footer>
        <img src="src/assets/navbar_logo.png" alt="MediFlow Footer Logo" />
        <p>&copy; 2023 MediFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
