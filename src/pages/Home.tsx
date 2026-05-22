import React from 'react'

const Home = () => {
  return (
    <div>
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
    </div>
  )
}

export default Home
