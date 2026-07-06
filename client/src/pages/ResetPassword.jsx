import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  return errors;
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const passwordErrors = password ? validatePassword(password) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordErrors.length > 0) {
      toast.error('Password does not meet requirements');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ token, password });
      setAuth(data.token, data.user);
      toast.success('Password reset successfully!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="verify-state">
        <div className="verify-icon error">✕</div>
        <h2 className="auth-title">Invalid link</h2>
        <p className="auth-subtitle">This password reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="btn-primary btn-link">Request new link</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="auth-title">Set new password</h2>
      <p className="auth-subtitle">Choose a strong password for your account</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <PasswordInput
          label="New Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
        />

        {password.length > 0 && (
          <div className="password-strength">
            {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((rule) => {
              const passed = !passwordErrors.includes(rule);
              return (
                <span key={rule} className={`strength-rule ${passed ? 'passed' : ''}`}>
                  {passed ? '✓' : '○'} {rule}
                </span>
              );
            })}
          </div>
        )}

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  );
}
