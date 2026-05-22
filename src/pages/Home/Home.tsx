import React from 'react'
import './Home.css'
import Specialties from '../../components/Specialties/Specialties'
import DoctorCard from '../../components/DoctorCard/DoctorCard'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Book Appointment<br />With Trusted Doctors</h1>
            <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <button className="book-btn">Book appointment →</button>
          </div>
          <div className="hero-image">
            <img src="src/assets/header_img.png" alt="MediFlow Hero Image" />
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <Specialties/>

      {/* Featured Doctors Section */}
      <section className="featured-doctors-section">
        <div className="featured-doctors-content">
          <h2>Featured Doctors</h2>
          <div className="doctor-cards-container">
            <DoctorCard />
            <DoctorCard />
            <DoctorCard />
          </div>
        </div>
      </section>

      {/* Book Now Section */}
      <section className="book-now-section">
        <div className="book-now-content">
          <div className="book-now-text">
            <h2>Book Appointment</h2>
            <h3>With 100+ Trusted Doctors</h3>
            <button className="create-account-btn">Create account</button>
          </div>
          <div className="book-now-image">
            <img src="src/assets/appointment_img.png" alt="Doctor" />
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
