import Footer from '../../components/Footer/Footer'
import './About.css'
import aboutImage from '../../assets/about_image.png'

const About = () => {
  
  const values = [
    { title: 'Patient-Centric Care', description: 'We prioritize patient well-being and satisfaction in every decision we make.' },
    { title: 'Medical Excellence', description: 'We maintain the highest standards of medical practice and continuous education.' },
    { title: 'Accessibility', description: 'We believe quality healthcare should be accessible to everyone, everywhere.' },
    { title: 'Innovation', description: 'We leverage technology to improve healthcare delivery and patient outcomes.' },
  ]

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>About MediFlow</h1>
          <p>Connecting Patients with Quality Healthcare</p>
        </div>
        <div className="hero-image">
          <img src={aboutImage} alt="About MediFlow" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At MediFlow, we're committed to revolutionizing healthcare accessibility. Our platform bridges the gap 
              between patients and qualified healthcare professionals, making it easier to find and connect with doctors 
              who understand your needs. We believe that quality healthcare should be just a click away.
            </p>
          </div>
          <div className="mission-vision">
            <h2>Our Vision</h2>
            <p>
              To create a world where everyone has access to quality healthcare, regardless of their location or 
              circumstances. We envision a future where healthcare is more personalized, efficient, and patient-focused.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          {values.map((value) => (
            <div key={value.title} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      

      <div className="about-footer">
        <Footer />
      </div>
    </div>
  )
}

export default About
