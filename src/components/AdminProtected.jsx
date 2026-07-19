import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, Loader } from 'lucide-react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminProtected = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('gov_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('gov_admin_token');
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return children;
};

const LoginPage = ({ onLogin }) => {
  const [step, setStep] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [forgotData, setForgotData] = useState({ email: '' });
  const [resetData, setResetData] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('gov_admin_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Unable to connect to server. Please start the backend server.');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Reset code sent! Check your email.');
        setResetData(prev => ({ ...prev, email: forgotData.email }));
        setTimeout(() => {
          setStep('reset');
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Failed to send reset code');
      }
    } catch (err) {
      setError('Unable to connect to server. Please start the backend server.');
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (resetData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetData.email,
          code: resetData.code,
          newPassword: resetData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successful! You can now login.');
        setStep('login');
        setLoginData(prev => ({ ...prev, username: 'admin' }));
        setResetData({ email: '', code: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.error || 'Invalid or expired code');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg"></div>
      <div className="login-container">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="login-logo">
            <div className="logo-icon">G</div>
            <h1>GOV Admin</h1>
            <p>Generation of Value Management</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'login' && (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2>Welcome Back</h2>
                <p className="form-subtitle">Sign in to access your dashboard</p>

                {error && (
                  <div className="alert error">
                    <XCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label>Username</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader size={20} className="spinner" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-forgot"
                  onClick={() => { setStep('forgot'); setError(''); setSuccess(''); }}
                >
                  Forgot Password?
                </button>

                <div className="demo-credentials">
                  <p>Default credentials:</p>
                  <code>admin / 1234</code>
                </div>
              </motion.form>
            )}

            {step === 'forgot' && (
              <motion.form
                key="forgot"
                onSubmit={handleForgotPassword}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2>Reset Password</h2>
                <p className="form-subtitle">Enter your email to receive a reset code</p>

                {error && (
                  <div className="alert error">
                    <XCircle size={18} />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert success">
                    <CheckCircle size={18} />
                    {success}
                  </div>
                )}

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="email"
                      placeholder="Enter your admin email"
                      value={forgotData.email}
                      onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader size={20} className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-forgot"
                  onClick={() => { setStep('login'); setError(''); setSuccess(''); }}
                >
                  Back to Login
                </button>
              </motion.form>
            )}

            {step === 'reset' && (
              <motion.form
                key="reset"
                onSubmit={handleResetPassword}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2>Enter Reset Code</h2>
                <p className="form-subtitle">Check your email for the 6-digit code</p>

                {error && (
                  <div className="alert error">
                    <XCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label>Reset Code</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={resetData.code}
                      onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={resetData.confirmPassword}
                      onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader size={20} className="spinner" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-forgot"
                  onClick={() => { setStep('login'); setError(''); setSuccess(''); }}
                >
                  Back to Login
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Generation of Value. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProtected;
