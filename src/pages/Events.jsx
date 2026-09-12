import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Heart, Filter, ChevronRight, Image as ImageIcon, Star, Moon, Sun, X } from 'lucide-react';
import './Events.css';
import heroImg from '../images/Bible_1.JPG';
import img1 from '../images/Bible_1.JPG';
import img2 from '../images/Praise1.jpg';
import img3 from '../images/Praise2.jpg';
import img4 from '../images/Rooted.jpg';
import img5 from '../images/House_of_miracles.jpg';
import img6 from '../images/behind_church.jpg';
import img7 from '../images/behind_church.jpg';
import img8 from '../images/open_bible.JPG';

const galleryImgs = [img1, img2, img3, img4, img5, img6, img7, img8];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: "Youth Worship Night",
      date: "July 31, 2026",
      time: "20:00 to 05:00",
      location: "Praise Christian Centre Matero",
      description: "Join us for an night of powerful worship, praise, and intimate fellowship with God. A night dedicated to seeking His presence.",
      category: "Special",
      highlight: false,
      isPast: true
    },
    {
      id: 2,
      title: "August Month of Prayer",
      date: "August 1-30, 2026",
      time: "17:00 to 19:00",
      location: "Praise Christian Centre Matero",
      description: "A dedicated month of intense prayer and intercession. Every Monday to Friday, we gather to seek God's face for our nation, community, and generation.",
      category: "Monthly",
      highlight: false,
      isPast: true
    },
    {
      id: 3,
      title: "Youth Sunday",
      date: "September 13, 2026",
      time: "08:00 to 13:00",
      location: "Praise Christian Centre Matero",
      description: "THE BIGGEST EVENT OF THE YEAR! A special Sunday dedicated to the youth. Full youth service with worship, word, and celebration. Don't miss it!",
      category: "Special",
      highlight: true,
      hasDetails: true,
      theme: "Be Exceptional",
      dressCode: "Vintage Excellence",
      themeScripture: "1 Timothy 4:12",
      activities: ["Drama", "Poetry", "Dance", "Debate", "Praise and Worship", "Mystery Box"]
    },
    {
      id: 4,
      title: "Generation of Value Tour",
      date: "October (Date TBC)",
      time: "To be communicated",
      location: "To be communicated",
      description: "Join us for the highly anticipated Generation of Value Tour! Get ready for an impactful time of fellowship, ministry, and spreading the message of purpose across different locations. More details coming soon.",
      category: "Special",
      highlight: false
    },
    {
      id: 5,
      title: "Transformed Youth Camp",
      date: "December (Date TBC)",
      time: "To be communicated",
      location: "To be communicated",
      description: "An inter-church youth camp aimed at transforming lives. Fees and exact location to be communicated soon. Don't miss this life-changing experience!",
      category: "Special",
      highlight: false
    }
  ];

  const categories = ['All', 'Special', 'Monthly'];

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(event => event.category === activeCategory);

  return (
    <div className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img src={heroImg} alt="Events" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">What's Happening</span>
            <h1>Events & Programs</h1>
            <p>Join us at our upcoming gatherings and activities</p>
          </motion.div>
        </div>
      </section>

      {/* Events Calendar */}
      <section className="section events-calendar">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Upcoming</span>
            <h2>Our Events Schedule</h2>
            <p className="section-subtitle">Mark your calendar and join us</p>
          </motion.div>

          <div className="filter-bar">
            <Filter size={18} />
            <span>Filter by:</span>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            className="events-grid"
            layout
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className={`event-card ${event.highlight ? 'highlight' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                layout
              >
                {event.highlight && (
                  <div className="highlight-badge">
                    <Star size={14} />
                    Biggest Event of the Year
                  </div>
                )}
                
                <div className="event-card-header">
                  <div className="event-date-display">
                    <Calendar size={18} />
                    <span>{event.date}</span>
                  </div>
                  <span className="event-category-badge">{event.category}</span>
                </div>

                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <Clock size={15} />
                    <span>{event.time}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={15} />
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.isPast ? (
                  <button className="event-cta past-event" disabled>
                    Already Passed
                  </button>
                ) : event.hasDetails ? (
                  <button className="event-cta" onClick={() => setSelectedEvent(event)}>
                    Learn More
                    <ChevronRight size={16} />
                  </button>
                ) : null}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Event Icons Section */}
      <section className="section event-icons-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Event Types</span>
            <h2>Types of Events</h2>
          </motion.div>

          <div className="event-types-grid">
            {[
              { icon: Heart, title: 'Youth Worship', desc: 'Spiritual growth and praise' },
              { icon: Moon, title: 'Night Vigils', desc: 'Extended prayer sessions' },
              { icon: Sun, title: 'Sunday Services', desc: 'Weekly worship gatherings' },
              { icon: Calendar, title: 'Month of Prayer', desc: 'Dedicated intercession' }
            ].map((type, index) => (
              <motion.div
                key={index}
                className="event-type-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="type-icon">
                  <type.icon size={22} />
                </div>
                <h3>{type.title}</h3>
                <p>{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="section stats-banner">
        <div className="container">
          <motion.div
            className="stats-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">People Reached</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Ministries</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100K</span>
              <span className="stat-label">Souls to Win</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section gallery-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Moments</span>
            <h2>Photo Gallery</h2>
            <p className="section-subtitle">Capturing moments of worship, fellowship, and impact</p>
          </motion.div>

          <motion.div
            className="gallery-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {galleryImgs.map((img, index) => (
              <motion.div
                key={index}
                className={`gallery-item ${index === 0 || index === 4 ? 'wide' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <img src={img} alt={`Gallery image ${index + 1}`} />
                <div className="gallery-overlay">
                  <ImageIcon size={22} />
                  <span>Event {index + 1}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
            <motion.div 
              className="event-modal-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>
                <X size={24} />
              </button>
              
              <div className="modal-header">
                <span className="event-category-badge">{selectedEvent.category}</span>
                <h2>{selectedEvent.title}</h2>
                <p className="modal-date">{selectedEvent.date}</p>
              </div>
              
              <div className="modal-body">
                <p className="modal-desc">{selectedEvent.description}</p>
                
                {selectedEvent.theme && (
                  <div className="modal-detail-group">
                    <h4>Theme</h4>
                    <p>"{selectedEvent.theme}"</p>
                  </div>
                )}
                
                {selectedEvent.themeScripture && (
                  <div className="modal-detail-group">
                    <h4>Theme Scripture</h4>
                    <p>{selectedEvent.themeScripture}</p>
                  </div>
                )}
                
                {selectedEvent.dressCode && (
                  <div className="modal-detail-group">
                    <h4>Dress Code</h4>
                    <p>{selectedEvent.dressCode}</p>
                  </div>
                )}
                
                {selectedEvent.activities && (
                  <div className="modal-detail-group">
                    <h4>Activities Include</h4>
                    <ul className="modal-activities-list">
                      {selectedEvent.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
