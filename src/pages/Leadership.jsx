import { motion } from 'framer-motion';
import { Crown, Shield, User, Users, Music, Palette, Video, Megaphone, Heart, Trophy, Truck } from 'lucide-react';
import { leadership, ministries, churchInfo } from '../data/content';
import './Leadership.css';
import heroImg from '../images/behind_church.jpg';
import bishopDeclImg from '../images/Mr_and_Mrs_Bishop.jpg';

const iconMap = {
  music: Music,
  palette: Palette,
  video: Video,
  megaphone: Megaphone,
  users: Users,
  heart: Heart,
  trophy: Trophy,
  truck: Truck
};

const Leadership = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="leadership-page">
      {/* Hero */}
      <section className="leadership-hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img src={heroImg} alt="Leadership" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Our Team</span>
            <h1>Leadership Structure</h1>
            <p>Meet the leaders guiding Generation of Value</p>
          </motion.div>
        </div>
      </section>

      {/* Bishop */}
      <section className="section bishop-section">
        <div className="container">
          <motion.div
            className="bishop-profile"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="leadership-bishop-image">
              <img src={bishopDeclImg} alt="Bishop Paul Karonga and Wife" style={{ objectPosition: 'center 15%' }} />
            </div>
            <div className="bishop-info">
              <div className="role-badge">
                <Crown size={20} />
                <span>{churchInfo.bishop}</span>
              </div>
              <h2>{leadership.bishop.name}</h2>
              <p className="bishop-title">{leadership.bishop.role}</p>
              <p className="bishop-description">{leadership.bishop.description}</p>
              <p className="bishop-church">{churchInfo.name}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elders & Deacons */}
      <section className="section elders-section">
        <div className="container">
          <div className="leadership-row">
            <motion.div
              className="leadership-category"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="category-header">
                <Shield className="category-icon" size={28} />
                <h3>Youth Elders</h3>
              </div>
              <div className="people-grid">
                {leadership.elders.map((person, index) => (
                  <motion.div
                    key={index}
                    className="person-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="person-avatar">
                      <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=150`} alt={person.name} />
                    </div>
                    <h4>{person.name}</h4>
                    <p className="person-role">{person.role}</p>
                    <p className="person-desc">{person.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="leadership-category"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="category-header">
                <User className="category-icon" size={28} />
                <h3>Youth Deacons</h3>
              </div>
              <div className="people-grid">
                {leadership.deacons.map((person, index) => (
                  <motion.div
                    key={index}
                    className="person-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="person-avatar">
                      <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=150`} alt={person.name} />
                    </div>
                    <h4>{person.name}</h4>
                    <p className="person-role">{person.role}</p>
                    <p className="person-desc">{person.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Youth Coordinators */}
      <section className="section coordinators-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Coordinators</span>
            <h2 className="title-nowrap">Youth Coordinators</h2>
          </motion.div>

          <motion.div
            className="coordinators-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {leadership.coordinators.map((person, index) => (
              <motion.div
                key={index}
                className="person-card"
                variants={itemVariants}
              >
                <div className="person-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=200`} alt={person.name} />
                </div>
                <h4>{person.name}</h4>
                <p className="person-role">{person.role}</p>
                <p className="person-desc">{person.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="section executive-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Core Team</span>
            <h2 className="title-nowrap">Youth Executive Leadership</h2>
          </motion.div>

          <motion.div
            className="executive-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {leadership.executives.map((person, index) => (
              <motion.div
                key={index}
                className="executive-card"
                variants={itemVariants}
              >
                <div className="executive-badge">{index === 0 ? 'Chairperson' : 'Vice Chairperson'}</div>
                <div className="executive-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=200`} alt={person.name} />
                </div>
                <h3>{person.name}</h3>
                <p className="executive-role">{person.role}</p>
                <p className="executive-desc">{person.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Secretariat */}
      <section className="section secretariat-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Communication</span>
            <h2 className="title-nowrap">Secretariat & Communication</h2>
          </motion.div>

          <motion.div
            className="secretariat-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {leadership.secretariat.map((person, index) => (
              <motion.div
                key={index}
                className="secretariat-card"
                variants={itemVariants}
              >
                <div className="secretariat-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=150`} alt={person.name} />
                </div>
                <h3>{person.name}</h3>
                <p className="secretariat-role">{person.role}</p>
                <p className="secretariat-desc">{person.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Department Heads */}
      <section className="section heads-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Departments</span>
            <h2 className="title-nowrap">Heads of Departments</h2>
          </motion.div>

          <motion.div
            className="heads-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {leadership.heads.map((person, index) => (
              <motion.div
                key={index}
                className="head-card"
                variants={itemVariants}
              >
                <div className="head-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=150`} alt={person.name} />
                </div>
                <div className="head-info">
                  <h3>{person.name}</h3>
                  <p className="head-role">{person.role}</p>
                  <span className="head-dept">{person.department}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vice Heads */}
      <section className="section vice-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Support</span>
            <h2 className="title-nowrap">Vice Heads of Departments</h2>
          </motion.div>

          <motion.div
            className="vice-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {leadership.viceHeads.map((person, index) => (
              <motion.div
                key={index}
                className="vice-card"
                variants={itemVariants}
              >
                <div className="vice-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=D4AF37&color=000&size=150`} alt={person.name} />
                </div>
                <h3>{person.name}</h3>
                <p className="vice-role">{person.role}</p>
                <span className="vice-dept">{person.department}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ministries */}
      <section className="section ministries-full-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Serve With Us</span>
            <h2>Our Ministries & Departments</h2>
            <p className="section-subtitle">Find where you can serve and grow</p>
          </motion.div>

          <motion.div
            className="ministries-full-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {ministries.map((ministry, index) => {
              const IconComponent = iconMap[ministry.icon] || Heart;
              return (
                <motion.div
                  key={index}
                  className="ministry-full-card"
                  variants={itemVariants}
                >
                  <div className="ministry-full-icon">
                    <IconComponent size={32} />
                  </div>
                  <h3>{ministry.name}</h3>
                  <p>{ministry.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
