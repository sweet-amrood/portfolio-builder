import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../services/api';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await contactAPI.send(form);
      setSent(true);
      toast.success(data.message || 'Message sent successfully');
      setForm((prev) => ({ ...prev, subject: '', message: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1>Contact Us</h1>
        <p>Have a question or need help? Send us a message and we will get back to you soon.</p>
      </motion.div>

      <div className="contact-layout">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <h2>Get in touch</h2>
          <p>
            Whether you need support with templates, billing, or a custom portfolio setup, our team
            is here to help.
          </p>
          <ul className="contact-info-list">
            <li>We typically reply within one business day</li>
            <li>You will receive a confirmation email after sending</li>
            <li>Include as much detail as possible for faster support</li>
          </ul>
        </motion.div>

        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {sent ? (
            <div className="contact-success">
              <h3>Message sent</h3>
              <p>
                Thank you for reaching out. A confirmation has been sent to your email address,
                and our team has been notified.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSent(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={updateField('subject')}
                  placeholder="How can we help?"
                  required
                  maxLength={150}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows={6}
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder="Tell us more about your request..."
                  required
                  maxLength={5000}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
