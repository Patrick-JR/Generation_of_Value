import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Cross, ShoppingBag } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Cross size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-main">GOV</span>
            <span className="logo-sub">Generation of Value</span>
          </div>
        </Link>

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

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/shop" className="shop-btn">
            <ShoppingBag size={18} />
            Shop
          </Link>
          <Link to="/shop" className="mobile-shop-btn">
            <ShoppingBag size={24} />
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/shop" className="mobile-nav-link shop-link">
            <ShoppingBag size={18} />
            Shop
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
