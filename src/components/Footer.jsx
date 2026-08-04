import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { churchInfo } from '../data/content';
import './Footer.css';
import pccLogo from '../images/PCC_Logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <div className="logo-icon">
                  <img src={pccLogo} alt="PCC Logo" className="logo-icon-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="logo-text">
                  <span className="logo-main">GOV</span>
                  <span className="logo-sub">Generation of Value</span>
                </div>
              </Link>
              <p className="footer-about">
                The official youth ministry of Praise Christian Centre Matero. Raising young people who understand their purpose and bring value to society through Christ.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-link" aria-label="Facebook">F</a>
                <a href="#" className="social-link" aria-label="Instagram">I</a>
                <a href="#" className="social-link" aria-label="YouTube">Y</a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/leadership">Leadership</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/shop">Shop</Link></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Our Ministries</h4>
              <ul className="footer-links">
                <li><Link to="/leadership">Praise & Worship</Link></li>
                <li><Link to="/leadership">Creative Arts</Link></li>
                <li><Link to="/leadership">Media Ministry</Link></li>
                <li><Link to="/leadership">Intercessory Prayer</Link></li>
                <li><Link to="/leadership">Sports & Recreation</Link></li>
                <li><Link to="/leadership">Logistics</Link></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Contact Us</h4>
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
                <span>Praise Christian Centre Matero, Zambia</span>
              </div>
              <Link to="/admin" className="admin-link-footer">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} {churchInfo.youthMinistry}. All rights reserved.</p>
            <p className="footer-verse">
              "{churchInfo.mission}" — Our Mission
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
