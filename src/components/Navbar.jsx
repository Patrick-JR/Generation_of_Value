import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, ShoppingBag, Home, Info, Users, Calendar, Mail } from 'lucide-react';
import './Navbar.css';

import pccLogo from '../images/PCC_Logo.png';

const SpeakIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <text x="12" y="15" fontSize="12" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">S</text>
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Events', path: '/events' },
    { name: 'Speak', path: '/voice' },
    { name: 'Contact', path: '/contact' }
  ];

  const bottomNavLinks = [
    { name: 'Home', path: '/', Icon: Home },
    { name: 'About', path: '/about', Icon: Info },
    { name: 'Leadership', path: '/leadership', Icon: Users },
    { name: 'Events', path: '/events', Icon: Calendar },
    { name: 'Contact', path: '/contact', Icon: Mail },
  ];

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <img src={pccLogo} alt="PCC Logo" className="logo-icon-img" />
            </div>
            <div className="logo-text">
              <span className="logo-main">GOV</span>
              <span className="logo-sub">Generation of Value</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link to="/shop" className="shop-btn">
              <ShoppingBag size={18} />
              Shop
            </Link>

            {/* Mobile top-right: voice + theme + shop */}
            <div className="mobile-top-actions">
              <Link to="/voice" className="mobile-voice-icon-btn" aria-label="Speak">
                <SpeakIcon size={20} />
              </Link>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <Link to="/shop" className="mobile-shop-icon-btn with-text" aria-label="Shop">
                <ShoppingBag size={18} />
                <span className="mobile-shop-text">Shop</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {bottomNavLinks.map(({ name, path, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              aria-label={name}
            >
              <span className="bottom-nav-icon">
                <Icon size={22} />
                {isActive && <span className="bottom-nav-dot" />}
              </span>
              <span className="bottom-nav-label">{name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
