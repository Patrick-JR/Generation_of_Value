import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cross, Target, Eye, Heart, Sparkles, Quote, ArrowRight, Users, BookOpen, MapPin, Clock, Calendar } from 'lucide-react';
import { churchInfo, bishopsDeclaration, aboutContent } from '../data/content';
import './About.css';
import heroImg from '../images/Praise1.jpg';
import fellowshipImg from '../images/House_of_miracles.jpg';
import churchImg from '../images/behind_church.jpg';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img src={heroImg} alt="Youth Worship" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">About Us</span>
            <h1>Generation of Value</h1>
            <p>The official youth ministry of {churchInfo.name}</p>
          </motion.div>
        </div>
      </section>

      {/* Bishop's Declaration */}
      <section className="section declaration-section">
        <div className="container">
          <motion.div
            className="declaration-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="declaration-icon">
              <Quote size={36} />
            </div>
            <blockquote>"{bishopsDeclaration.quote}"</blockquote>
            <cite>— {bishopsDeclaration.speaker}</cite>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section intro-section">
        <div className="container">
          <div className="intro-grid">
            <motion.div
              className="intro-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Who We Are</span>
              <h2>About Generation of Value</h2>
              <p>{aboutContent.intro}</p>
              <p>{aboutContent.nameOrigin}</p>
            </motion.div>

            <motion.div
              className="intro-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="visual-card">
                <img src={fellowshipImg} alt="Youth Fellowship" />
              </div>
              <div className="visual-stats">
                <div className="visual-stat">
                  <Cross size={20} />
                  <span className="stat-number">200+</span>
                  <span className="stat-text">Youth Reached</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What GOV Represents */}
      <section className="section represents-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Our Identity</span>
            <h2>What "Generation of Value" Represents</h2>
          </motion.div>

          <motion.div
            className="represents-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {aboutContent.nameRepresents.map((item, index) => (
              <motion.div key={index} className="represent-item" variants={itemVariants}>
                <div className="represent-icon">
                  <Sparkles size={20} />
                </div>
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section vm-section">
        <div className="container">
          <div className="vm-grid">
            <motion.div
              className="vm-card vision"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="vm-icon">
                <Eye size={28} />
              </div>
              <h3>Our Vision</h3>
              <p className="vm-quote">"{aboutContent.vision}"</p>
            </motion.div>

            <motion.div
              className="vm-card mission"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="vm-icon">
                <Target size={28} />
              </div>
              <h3>Our Mission</h3>
              <p className="vm-quote">{aboutContent.mission}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Word of the Year */}
      <section className="section word-section">
        <div className="container">
          <motion.div
            className="word-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="word-header">
              <Sparkles className="sparkle" size={24} />
              <span className="year-badge">{churchInfo.year}</span>
              <Sparkles className="sparkle" size={24} />
            </div>
            <h2>{aboutContent.wordOfYear}</h2>
            <p className="word-subtitle">Focus Areas</p>
            
            <div className="focus-wrapper-card">
              <div className="focus-grid">
                {aboutContent.wordOfYearFocus.map((focus, index) => (
                  <motion.div
                    key={index}
                    className="focus-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="focus-number">{index + 1}</div>
                    <span>{focus}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section values-full-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Our Foundation</span>
            <h2>Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </motion.div>

          <div className="values-full-grid">
            {aboutContent.coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="value-full-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="value-icon">
                  {index === 0 && <Heart size={24} />}
                  {index === 1 && <Users size={24} />}
                  {index === 2 && <Sparkles size={24} />}
                  {index === 3 && <Target size={24} />}
                  {index === 4 && <BookOpen size={24} />}
                  {index === 5 && <Cross size={24} />}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Church Details Section */}
      <section className="section church-details-section" id="church-details">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Join Us</span>
            <h2>Church Location & Times</h2>
            <p className="section-subtitle">Welcome to the House of Miracles</p>
          </motion.div>

          <div className="church-details-grid">
            <motion.div
              className="church-details-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={22} />
                </div>
                <div className="info-content">
                  <h4>Church Name</h4>
                  <p>Praise Christian Center - Matero Branch</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={22} />
                </div>
                <div className="info-content">
                  <h4>Location</h4>
                  <p>Off Chitanda Road, opposite Hillside Primary School</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={22} />
                </div>
                <div className="info-content">
                  <h4>Service Time</h4>
                  <p>09:00 AM to 12:00 PM</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={22} />
                </div>
                <div className="info-content">
                  <h4>Theme</h4>
                  <p>House of Miracles</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="church-details-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={churchImg} alt="Praise Christian Centre" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section about-cta">
        <div className="container">
          <motion.div
            className="cta-box"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Join the Movement?</h2>
            <p>Become part of Generation of Value and discover your purpose in Christ.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                <Users size={18} />
                Get In Touch
              </Link>
              <Link to="/leadership" className="btn btn-secondary">
                Meet Our Leaders
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
