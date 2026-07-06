import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [showGoogleField, setShowGoogleField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { email };
      if (showGoogleField) payload.googleEmail = googleEmail;

      await authAPI.forgotPassword(payload);
      setSent(true);
      toast.success('Check your email for reset instructions');
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresGoogleEmail) {
        setShowGoogleField(true);
        toast.error('Please enter your Google email for confirmation');
      } else {
        toast.error(data?.message || 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="verify-state">
        <div className="verify-icon">✉</div>
        <h2 className="auth-title">Check your email</h2>
        <p className="auth-subtitle">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
        </p>
        <Link to="/login" className="btn-primary btn-link">Back to Sign In</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="auth-title">Forgot password?</h2>
      <p className="auth-subtitle">
        Enter your account email. If you signed up with email, we&apos;ll also ask for your Google email to confirm your identity.
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Account Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        {showGoogleField && (
          <motion.div
            className="form-group"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <label htmlFor="googleEmail">Google Email (for confirmation)</label>
            <input
              id="googleEmail"
              type="email"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="your@gmail.com"
              required
              autoComplete="email"
            />
            <span className="field-hint">
              Required for accounts created with email &amp; password
            </span>
          </motion.div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="auth-footer">
        Remember your password? <Link to="/login">Sign in</Link>
      </p>
    </motion.div>
  );
}
