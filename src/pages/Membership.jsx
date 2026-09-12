import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Heart, Users, CheckCircle, Send, Loader } from 'lucide-react';
import { churchInfo, ministries } from '../data/content';
import './Membership.css';
import heroImg from '../images/House_of_miracles.jpg';

const Membership = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    ageRange: '',
    location: '',
    ministryInterest: '',
    hearAboutUs: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const ageRanges = ['13-17', '18-24', '25-30', '31-35', '36+'];
  const hearOptions = ['Sunday Service', 'Social Media', 'Friend/Family', 'Outreach Event', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.ageRange) newErrors.ageRange = 'Please select your age range';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Store in localStorage for demo
    const submissions = JSON.parse(localStorage.getItem('gov_submissions') || '[]');
    submissions.push({ ...formData, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem('gov_submissions', JSON.stringify(submissions));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      ageRange: '',
      location: '',
      ministryInterest: '',
      hearAboutUs: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="membership-page">
      <Helmet>
        <title>Join GOV – Membership | Generation of Value Praise Christian Centre Matero</title>
        <meta name="description" content="Register to become a member of Generation of Value (GOV). Join the youth ministry of Praise Christian Centre Matero and discover your purpose in Christ." />
      </Helmet>
      {/* Hero */}
      <section className="membership-hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img src={heroImg} alt="Community" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Join Us</span>
            <h1>Become a Member</h1>
            <p>Take the step to join the Generation of Value family</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section membership-content">
        <div className="container">
          <div className="membership-grid">
            {/* Form */}
            <motion.div
              className="form-container"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {isSubmitted ? (
                <div className="success-message">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle size={80} />
                  </motion.div>
                  <h2>Welcome to GOV!</h2>
                  <p>Your membership application has been submitted successfully. Our leadership team will be in touch with you soon.</p>
                  <div className="success-details">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                  </div>
                  <button className="btn btn-primary" onClick={resetForm}>
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-header">
                    <Users size={32} className="form-icon" />
                    <h2>Membership Registration</h2>
                    <p>Fill out the form below to become an official member of Generation of Value</p>
                  </div>

                  <form onSubmit={handleSubmit} className="membership-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <User size={16} />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                      </div>

                      <div className="form-group">
                        <label>
                          <Phone size={16} />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+260 XXX XXX XXX"
                          className={errors.phone ? 'error' : ''}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <Heart size={16} />
                          Age Range *
                        </label>
                        <select
                          name="ageRange"
                          value={formData.ageRange}
                          onChange={handleChange}
                          className={errors.ageRange ? 'error' : ''}
                        >
                          <option value="">Select age range</option>
                          {ageRanges.map(age => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                        {errors.ageRange && <span className="error-text">{errors.ageRange}</span>}
                      </div>

                      <div className="form-group">
                        <label>
                          <MapPin size={16} />
                          Area / Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g., Matero, Lusaka"
                          className={errors.location ? 'error' : ''}
                        />
                        {errors.location && <span className="error-text">{errors.location}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Department Interest</label>
                      <select
                        name="ministryInterest"
                        value={formData.ministryInterest}
                        onChange={handleChange}
                      >
                        <option value="">Select a department (optional)</option>
                        {ministries.map((ministry, index) => (
                          <option key={index} value={ministry.name}>{ministry.name}</option>
                        ))}
                        <option value="No preference">No preference</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>How did you hear about GOV?</label>
                      <select
                        name="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={handleChange}
                      >
                        <option value="">Select an option</option>
                        {hearOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Message (Optional)</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us a bit about yourself or any questions you have..."
                        rows={4}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader size={18} className="spinner-icon" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Application
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="membership-sidebar"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="sidebar-card">
                <h3>Why Join GOV?</h3>
                <ul className="benefits-list">
                  <li>
                    <CheckCircle size={20} />
                    <span>Spiritual growth and discipleship</span>
                  </li>
                  <li>
                    <CheckCircle size={20} />
                    <span>Leadership development opportunities</span>
                  </li>
                  <li>
                    <CheckCircle size={20} />
                    <span>Fellowship with other young people</span>
                  </li>
                  <li>
                    <CheckCircle size={20} />
                    <span>Serve in various departments</span>
                  </li>
                  <li>
                    <CheckCircle size={20} />
                    <span>Access to events and programs</span>
                  </li>
                  <li>
                    <CheckCircle size={20} />
                    <span>Be part of soul-winning mission</span>
                  </li>
                </ul>
              </div>

              <div className="sidebar-card contact-card">
                <h3>Contact Us</h3>
                <p>Have questions? Reach out to us:</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={18} />
                    <span>{churchInfo.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={18} />
                    <span>{churchInfo.phone}</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={18} />
                    <span>{churchInfo.name}</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card verse-card">
                <blockquote>
                  "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future."
                </blockquote>
                <cite>, Jeremiah 29:11</cite>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
