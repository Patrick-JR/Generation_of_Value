import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { churchInfo } from '../data/content';
import './Contact.css';
import heroImg from '../images/behind_church.jpg';
import churchImg from '../images/House_of_miracles.jpg';

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img src={heroImg} alt="Contact" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Get In Touch</span>
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Reach out anytime!</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section contact-info-section">
        <div className="container">
          <div className="contact-grid">
            <motion.div
              className="contact-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="contact-icon">
                <Mail size={28} />
              </div>
              <h3>Email</h3>
              <p>{churchInfo.email}</p>
            </motion.div>

            <motion.div
              className="contact-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="contact-icon">
                <Phone size={28} />
              </div>
              <h3>Phone / Mobile Money</h3>
              <p>{churchInfo.phone}</p>
            </motion.div>

            <motion.div
              className="contact-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="contact-icon">
                <MapPin size={28} />
              </div>
              <h3>Location</h3>
              <p>Praise Christian Centre Matero, Zambia</p>
            </motion.div>

            <motion.div
              className="contact-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="contact-icon">
                <Clock size={28} />
              </div>
              <h3>Service Times</h3>
              <p>Sundays: 09:00 AM - 12:00 PM</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Church Details */}
      <section className="section church-details-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Join Us</span>
            <h2>Church Location & Times</h2>
            <p className="section-subtitle">We welcome you to House of Miracles</p>
          </motion.div>

          <div className="church-details-grid">
            <motion.div
              className="church-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-content">
                  <h4>Church Name</h4>
                  <p>Praise Christian Center - Matero Branch</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-content">
                  <h4>Location</h4>
                  <p>Off Chitanda Road, opposite Hillside Primary School</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={24} />
                </div>
                <div className="info-content">
                  <h4>Service Time</h4>
                  <p>09:00 AM to 12:00 PM</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <MessageCircle size={24} />
                </div>
                <div className="info-content">
                  <h4>Theme</h4>
                  <p>House of Miracles</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="church-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={churchImg} alt="Praise Christian Centre" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section contact-form-section">
        <div className="container">
          <motion.div
            className="form-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="form-header">
              <Send size={32} className="form-icon" />
              <h2>Send Us a Message</h2>
              <p>Have questions or want to get involved? We'd love to hear from you!</p>
            </div>

            <form className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="What is this about?" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={5} placeholder="Your message..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
