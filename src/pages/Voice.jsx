import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, MessageCircle, Send, CheckCircle, AlertCircle, Flame, Star, X, Shield } from 'lucide-react';
import { submitMysteryNote, submitFeedback } from '../services/api';
import './Voice.css';

const Voice = () => {
  const [modal, setModal] = useState(null); // null | 'mystery' | 'feedback'
  const [mysteryMsg, setMysteryMsg] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [mysteryStatus, setMysteryStatus] = useState('idle');
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');

  const openModal = (type) => {
    setModal(type);
    setErrorText('');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModal(null);
    document.body.style.overflow = '';
    // Reset success states after closing so modal is fresh on next open
    setTimeout(() => {
      setMysteryStatus('idle');
      setFeedbackStatus('idle');
      setMysteryMsg('');
      setFeedbackMsg('');
    }, 300);
  };

  const handleMysterySubmit = async (e) => {
    e.preventDefault();
    if (!mysteryMsg.trim()) return;
    setMysteryStatus('sending');
    setErrorText('');
    try {
      await submitMysteryNote(mysteryMsg);
      setMysteryStatus('success');
    } catch (err) {
      setErrorText(err.message);
      setMysteryStatus('error');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setFeedbackStatus('sending');
    setErrorText('');
    try {
      await submitFeedback(feedbackMsg);
      setFeedbackStatus('success');
    } catch (err) {
      setErrorText(err.message);
      setFeedbackStatus('error');
    }
  };

  return (
    <div className="voice-page">

      {/* ── Hero ── */}
      <section className="voice-hero">
        <div className="voice-hero-bg" />
        <div className="container">
          <motion.div
            className="voice-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="voice-hero-badge">
              <Flame size={14} />
              Your Voice Matters
            </span>
            <h1>Speak <span className="text-gold">Freely</span></h1>
            <p>
              Whether you carry a hidden burden, have something to confess,
              or want to help GOV grow, this is your safe space. We are listening.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Two Tap-to-Open Cards ── */}
      <section className="voice-cards-section">
        <div className="container">
          <div className="voice-cards-grid">

            {/* Mystery Card */}
            <motion.button
              className="voice-feature-card mystery-card"
              onClick={() => openModal('mystery')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="feature-card-glow mystery-glow" />
              <div className="feature-card-inner">
                <div className="feature-icon-ring mystery-ring">
                  <Lock size={32} />
                </div>
                <h2>Mystery Note</h2>
                <p>
                  Write anything on your heart, anonymously. A burden, a prayer
                  request, a confession. No one will ever know it was you.
                </p>
                <div className="feature-card-tags">
                  <span>🔒 Anonymous</span>
                  <span>🙏 Private</span>
                  <span>💌 Read by Leaders</span>
                </div>
                <div className="feature-card-cta mystery-cta">
                  Open Mystery Box
                </div>
              </div>
            </motion.button>

            {/* Feedback Card */}
            <motion.button
              className="voice-feature-card feedback-card"
              onClick={() => openModal('feedback')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="feature-card-glow feedback-glow" />
              <div className="feature-card-inner">
                <div className="feature-icon-ring feedback-ring">
                  <MessageCircle size={32} />
                </div>
                <h2>Feedback Box</h2>
                <p>
                  Tell us how we can do better. Your thoughts, from parents,
                  youths, or visitors, directly shape how GOV grows and serves.
                </p>
                <div className="feature-card-tags">
                  <span>💬 Open</span>
                  <span>📈 Shapes Ministry</span>
                  <span>🙌 Valued</span>
                </div>
                <div className="feature-card-cta feedback-cta">
                  Share Your Thoughts
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── Assurance Strip ── */}
      <section className="voice-assurance">
        <div className="container">
          <div className="assurance-grid">
            <div className="assurance-item">
              <div className="assurance-icon"><Lock size={20} /></div>
              <div>
                <h4>Completely Anonymous</h4>
                <p>Mystery notes never reveal your identity, ever.</p>
              </div>
            </div>
            <div className="assurance-item">
              <div className="assurance-icon"><Star size={20} /></div>
              <div>
                <h4>Handled with Care</h4>
                <p>Leadership reads every message with prayer and discretion.</p>
              </div>
            </div>
            <div className="assurance-item">
              <div className="assurance-icon"><Flame size={20} /></div>
              <div>
                <h4>Shapes Our Ministry</h4>
                <p>Your feedback directly influences how GOV grows.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modals ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="voice-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Modal Panel */}
            <motion.div
              className={`voice-modal ${modal === 'mystery' ? 'mystery-modal' : 'feedback-modal'}`}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="modal-header">
                <div className={`modal-icon ${modal === 'mystery' ? 'mystery-icon-bg' : 'feedback-icon-bg'}`}>
                  {modal === 'mystery' ? <Lock size={22} /> : <MessageCircle size={22} />}
                </div>
                <div className="modal-title-wrap">
                  <h2>{modal === 'mystery' ? 'Your Mystery Note' : 'Feedback Box'}</h2>
                  <p>
                    {modal === 'mystery'
                      ? '100% anonymous, no personal data is ever collected'
                      : 'Sent directly to GOV leadership'}
                  </p>
                </div>
                <button className="modal-close" onClick={closeModal} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              {/* Anonymous guarantee bar (mystery only) */}
              {modal === 'mystery' && (
                <div className="mystery-guarantee">
                  <Shield size={14} />
                  <span>Your identity is completely protected. We do not track who sends this.</span>
                </div>
              )}

              {/* Feedback chips (feedback only) */}
              {modal === 'feedback' && (
                <div className="feedback-chips">
                  {['Praise & Worship', 'Events', 'Leadership', 'Communication', 'Other'].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      className="feedback-chip"
                      onClick={() => setFeedbackMsg(prev => prev ? `${prev}\n[${chip}]: ` : `[${chip}]: `)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Status banners */}
              <AnimatePresence>
                {(modal === 'mystery' ? mysteryStatus : feedbackStatus) === 'success' && (
                  <motion.div
                    className="form-success-banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckCircle size={20} />
                    <div>
                      <strong>{modal === 'mystery' ? 'Note sent anonymously!' : 'Feedback received!'}</strong>
                      <span>{modal === 'mystery'
                        ? 'Our leadership will read it with prayer. You are not alone. 🙏'
                        : 'Thank you for helping GOV grow. Every word is valued. 🙌'}</span>
                    </div>
                  </motion.div>
                )}
                {(modal === 'mystery' ? mysteryStatus : feedbackStatus) === 'error' && (
                  <motion.div
                    className="form-error-banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0 }}
                  >
                    <AlertCircle size={20} />
                    <span>{errorText || 'Something went wrong. Please try again.'}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              {modal === 'mystery' ? (
                <form onSubmit={handleMysterySubmit} className="modal-form">
                  <div className="form-field">
                    <label htmlFor="modal-mystery-text">Your message</label>
                    <textarea
                      id="modal-mystery-text"
                      className="mystery-textarea"
                      placeholder="Type whatever is on your heart... this is just between you and God."
                      value={mysteryMsg}
                      onChange={e => setMysteryMsg(e.target.value)}
                      rows={7}
                      required
                      disabled={mysteryStatus === 'success'}
                    />
                    <span className="char-count">{mysteryMsg.length} characters</span>
                  </div>
                  {mysteryStatus === 'success' ? (
                    <button type="button" className="voice-submit-btn mystery-btn success" onClick={closeModal}>
                      <CheckCircle size={18} /> Close
                    </button>
                  ) : (
                    <button
                      type="submit"
                      id="mystery-submit-btn"
                      className={`voice-submit-btn mystery-btn ${mysteryStatus}`}
                      disabled={mysteryStatus === 'sending'}
                    >
                      {mysteryStatus === 'sending'
                        ? <><span className="spinner-ring" /> Sending Anonymously...</>
                        : <><Lock size={18} /> Send Mysteriously</>}
                    </button>
                  )}
                </form>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="modal-form">
                  <div className="form-field">
                    <label htmlFor="modal-feedback-text">Your feedback</label>
                    <textarea
                      id="modal-feedback-text"
                      className="feedback-textarea"
                      placeholder="Share your thoughts, ideas, suggestions, or encouragement..."
                      value={feedbackMsg}
                      onChange={e => setFeedbackMsg(e.target.value)}
                      rows={7}
                      required
                      disabled={feedbackStatus === 'success'}
                    />
                    <span className="char-count">{feedbackMsg.length} characters</span>
                  </div>
                  {feedbackStatus === 'success' ? (
                    <button type="button" className="voice-submit-btn feedback-btn success" onClick={closeModal}>
                      <CheckCircle size={18} /> Close
                    </button>
                  ) : (
                    <button
                      type="submit"
                      id="feedback-submit-btn"
                      className={`voice-submit-btn feedback-btn ${feedbackStatus}`}
                      disabled={feedbackStatus === 'sending'}
                    >
                      {feedbackStatus === 'sending'
                        ? <><span className="spinner-ring" /> Sending...</>
                        : <><Send size={18} /> Submit Feedback</>}
                    </button>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Voice;
