import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { sendContactEmails } from '../utils/email.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0]?.msg || 'Invalid form data',
      errors: errors.array(),
    });
  }
  next();
};

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const companyEmail = process.env.COMPANY_EMAIL;
      if (!companyEmail) {
        return res.status(503).json({ message: 'Contact email is not configured on the server' });
      }

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(503).json({ message: 'Email service is not configured' });
      }

      const { name, email, subject, message } = req.body;

      await sendContactEmails({
        name,
        email,
        subject,
        message,
        companyEmail,
      });

      res.status(200).json({ message: 'Your message has been sent successfully' });
    } catch (error) {
      console.error('Contact form error:', error.message);
      res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
    }
  }
);

export default router;
