import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { submitContactMessage } from '../services/api';
import './JoinModal.css';

const JoinModal = ({ isOpen, onClose, department }) => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus('error');
      setErrorMsg('Name and phone number are required.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      await submitContactMessage({
        name: formData.name,
        email: 'no-reply@gov.com', // Required by some backends, dummy value
        phone: formData.phone,
        subject: `Joining ${department} Department`,
        message: `${formData.name} wants to join the ${department} department.\nPhone: ${formData.phone}`
      });
      setStatus('success');
      setFormData({ name: '', phone: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send message.');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setFormData({ name: '', phone: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="join-modal"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-x" onClick={handleClose}>
            <X size={20} />
          </button>

          {status === 'success' ? (
            <motion.div
              className="join-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="success-icon">
                <CheckCircle size={56} />
              </div>
              <h2>Request Sent! 🎉</h2>
              <p>Your request to join the <strong>{department}</strong> department has been sent to our leadership team. We will get in touch with you shortly.</p>
              <button className="btn btn-primary" onClick={handleClose}>
                Close
              </button>
            </motion.div>
          ) : (
            <>
              <div className="join-modal-header">
                <h2>Join a Department</h2>
                <p>You are applying to join the <strong>{department}</strong> department.</p>
              </div>

              <form onSubmit={handleSubmit} className="join-form" noValidate>
                <div className="form-group">
                  <label htmlFor="join-name">
                    <User size={14} /> Full Name *
                  </label>
                  <input
                    id="join-name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setStatus('idle'); }}
                    className={status === 'error' && !formData.name ? 'input-error' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="join-phone">
                    <User size={14} /> Phone Number *
                  </label>
                  <input
                    id="join-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setStatus('idle'); }}
                    className={status === 'error' && !formData.phone ? 'input-error' : ''}
                  />
                </div>

                {status === 'error' && (
                  <div className="field-error" style={{ textAlign: 'center', margin: '0.5rem 0', color: '#ef4444' }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-step-actions-row">
                  <button type="submit" className="btn btn-primary submit-join-btn flex-1" disabled={status === 'submitting'}>
                    <Send size={18} />
                    {status === 'submitting' ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
                <p className="join-note">
                  This message will be sent to the GOV leadership team.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JoinModal;
