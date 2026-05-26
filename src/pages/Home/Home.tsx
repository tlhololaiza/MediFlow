import './Home.css'
import Specialties from '../../components/Specialties/Specialties'
import DoctorCard from '../../components/DoctorCard/DoctorCard'
import Footer from '../../components/Footer/Footer'
import header from '../../assets/header_img.png'

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Simple appointments, <span className="hero-highlight">better care</span></h1>
            <p>Book appointments with trusted doctors, manage your schedule, and get the care you deserve.</p>
            
            <div className="hero-buttons">
              <button className="btn-primary"><i className="bx bx-calendar"></i> Book an Appointment</button>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon"><i className="bx bx-check"></i></span>
                <div>
                  <h4>Verified Doctors</h4>
                  <p>Trusted & Experienced</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon"><i className="bx bx-time"></i></span>
                <div>
                  <h4>Quick Booking</h4>
                  <p>Save Time & Effort</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon"><i className="bx bx-lock"></i></span>
                <div>
                  <h4>Secure & Private</h4>
                  <p>Your Data is Safe</p>
                </div>
              </div>
            </div>
          </div>

          <img src={header} alt="Doctor image" className="hero-img" />
          
        </div>
      </div>

      {/* Why Choose MediFlow Section */}
      <section className="why-choose-section">
        <h2>Why Choose <span className="highlight">MediFlow</span>?</h2>
        <div className="why-choose-grid">
          <div className="why-card">
            <div className="why-icon"><i className="bx bx-user-circle"></i></div>
            <h3>Expert Doctors</h3>
            <p>Connect with verified and experienced doctors.</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><i className="bx bx-calendar"></i></div>
            <h3>Easy Booking</h3>
            <p>Book appointments in just a few simple steps.</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><i className="bx bx-credit-card"></i></div>
            <h3>Multiple Payments</h3>
            <p>Choose from secure and convenient payment options.</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><i className="bx bx-bell"></i></div>
            <h3>Smart Reminders</h3>
            <p>Get reminders and never miss an appointment.</p>
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
            <DoctorCard />
          </div>
          <button className="more-btn">More</button>
        </div>
      </section>

      <Footer />

    </div>
  )
}

export default Home
