import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Cross, Target, Star, ArrowRight, Calendar, Heart, Sparkles, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { churchInfo, bishopsDeclaration, aboutContent, leadership, ministries, faqData } from '../data/content';
import './Home.css';
import heroImg1 from '../images/Praise1.jpg';
import heroImg2 from '../images/Praise2.jpg';
import heroImg3 from '../images/behind_church.jpg';
import youthWorshipImg from '../images/Luckson.jpg';
import bishopDeclImg from '../images/Mr_and_Mrs_Bishop.jpg';
import bishopKarongaImg from '../images/Bishop_Karonga.jpg';
import churchImg from '../images/behind_church.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Generation of Value",
      subtitle: "",
      description: "Welcome to the official youth ministry of Praise Christian Centre Matero",
      primaryBtn: { text: "Explore our Shop", link: "/shop" },
      secondaryBtn: { text: "Join us this Sunday", link: "/about#church-details" }
    },
    {
      title: "2026 - Year of Gratitude",
      subtitle: "Giving Thanks to God in All Things",
      description: "This year, we focus on acknowledging God's faithfulness and developing a lifestyle of gratitude",
      primaryBtn: { text: "See Our Products", link: "/shop" },
      secondaryBtn: { text: "Discover More", link: "/about" }
    },
    {
      title: "Winning 100,000 Souls",
      subtitle: "Our Mission",
      description: "We are committed to soul-winning and spreading the Gospel to impact nations for Christ",
      primaryBtn: { text: "Get Involved", link: "/#ministries" },
      secondaryBtn: { text: "Declaration", link: "/#declaration" }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const stats = [
    { icon: Users, value: "200+", label: "Youth Reached" },
    { icon: Cross, value: "8", label: "Ministries" },
    { icon: Target, value: "100M", label: "Souls to Win" },
    { icon: Star, value: "2026", label: "Year of Gratitude" }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-carousel">
          <AnimatePresence>
            <motion.div
              key={currentSlide}
              className="hero-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div className="hero-image-bg" style={{
                backgroundImage: `url(${currentSlide === 0 ? heroImg1 : currentSlide === 1 ? heroImg2 : heroImg3})`
              }}></div>
              <div className="hero-content">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <span className="hero-badge">Welcome to GOV</span>
                  <h1>{slides[currentSlide].title}</h1>
                  {slides[currentSlide].subtitle && <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>}
                  <p className="hero-description">{slides[currentSlide].description}</p>
                  <div className="hero-actions">
                    <Link to={slides[currentSlide].primaryBtn.link} className="btn btn-primary">
                      {slides[currentSlide].primaryBtn.text}
                    </Link>
                    <Link to={slides[currentSlide].secondaryBtn.link} className="btn btn-secondary">
                      {slides[currentSlide].secondaryBtn.text}
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className="carousel-btn prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="hero-stats">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="stat-icon-wrapper">
                    <stat.icon size={18} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section about-preview">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="image-frame">
                <img src={youthWorshipImg} alt="Youth Worship" />
                <div className="image-decoration"></div>
              </div>
              <div className="year-badge">2026</div>
            </motion.div>

            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">About Us</span>
              <h2 className="section-title">{churchInfo.youthMinistry}</h2>
              <p className="about-text">{aboutContent.intro}</p>
              
              <div className="word-of-year">
                <Sparkles className="sparkle-icon" size={20} />
                <div>
                  <h4>Word of the Year</h4>
                  <p>{aboutContent.wordOfYear}</p>
                </div>
              </div>

              <Link to="/about" className="btn btn-primary">
                Learn More About Us
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Declaration Section */}
      <section className="section declaration-section" id="declaration">
        <div className="container">
          <div className="declaration-grid">
            <motion.div
              className="about-image declaration-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="image-frame">
                <img src={bishopDeclImg} alt="Bishop Paul Karonga and Wife" style={{ objectPosition: 'top center' }} />
                <div className="image-decoration"></div>
              </div>
            </motion.div>

            <motion.div
              className="declaration-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Bishop's Declaration</span>
              <div className="declaration-box">
                <Sparkles className="sparkle-icon" size={28} />
                <div>
                  <h2 className="section-title declaration-title" style={{ color: 'var(--white)' }}>The Word from Our Bishop</h2>
                  <blockquote className="declaration-quote" style={{ color: 'var(--white)' }}>
                    "{bishopsDeclaration.quote}"
                  </blockquote>
                  <cite className="declaration-cite">— {bishopsDeclaration.speaker}</cite>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide Generation of Value</p>
          </motion.div>

          <div className="values-grid">
            {aboutContent.coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="value-number">{String(index + 1).padStart(2, '0')}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="section leadership-preview">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Our Leaders</span>
            <h2 className="section-title">Leadership Team</h2>
            <p className="section-subtitle">Meet those guiding the Generation of Value</p>
          </motion.div>

          <div className="leadership-preview-grid">
            <motion.div
              className="bishop-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="bishop-image">
                <img src={bishopKarongaImg} alt="Bishop Paul Karonga" />
              </div>
              <h3>{leadership.bishop.name}</h3>
              <p className="bishop-role">{leadership.bishop.role}</p>
              <p className="bishop-church">{churchInfo.name}</p>
            </motion.div>

            <div className="executive-grid">
              {[...leadership.executives, ...leadership.heads.slice(0, 3)].map((person, index) => (
                <motion.div
                  key={index}
                  className="leader-mini-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="leader-avatar">
                    <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=100`} alt={person.name} />
                  </div>
                  <span className="leader-name">{person.name}</span>
                  <span className="leader-role">{person.role}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/leadership" className="btn btn-secondary">
              View Full Leadership
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="section ministries-preview" id="ministries">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Serve With Us</span>
            <h2 className="section-title">Our Ministries</h2>
            <p className="section-subtitle">Find your place to serve and grow</p>
          </motion.div>

          <div className="ministries-grid">
            {ministries.map((ministry, index) => (
              <motion.div
                key={index}
                className="ministry-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ministry-icon">
                  <Heart size={22} />
                </div>
                <h3>{ministry.name}</h3>
                <p>{ministry.description}</p>
                <a href="/contact" className="ministry-join-btn">
                  Join <ArrowUpRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Church Details Section */}
      <section className="section church-home-section" id="church-details">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Join Us</span>
            <h2 className="section-title">Church Location & Times</h2>
            <p className="section-subtitle">Welcome to the House of Miracles</p>
          </motion.div>

          <div className="church-home-grid">
            <motion.div
              className="church-home-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-text">
                  <h4>Church Name</h4>
                  <p>Praise Christian Center - Matero Branch</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-text">
                  <h4>Location</h4>
                  <p>Off Chitanda Road, opposite Hillside Primary School</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <Clock size={20} />
                </div>
                <div className="info-text">
                  <h4>Service Time</h4>
                  <p>09:00 AM to 12:00 PM</p>
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary mt-3">
                <Calendar size={18} />
                Plan Your Visit
              </Link>
            </motion.div>

            <motion.div
              className="church-home-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={churchImg} alt="Praise Christian Centre" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find answers to common questions</p>
          </motion.div>
          <div className="faq-grid">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <details className="faq-details">
                  <summary className="faq-summary">
                    {faq.question}
                    <span className="faq-icon">+</span>
                  </summary>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="cta-icon" size={36} />
            <h2>Ready to Be Part of Something Bigger?</h2>
            <p>Join Generation of Value and discover your purpose in Christ. Together, we can impact nations for God's kingdom.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                <Users size={18} />
                Get In Touch
              </Link>
              <Link to="/shop" className="btn btn-secondary">
                Shop GOV Merchandise
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
