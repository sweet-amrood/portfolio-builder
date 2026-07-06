import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { signToken } from '../utils/jwt.js';
import { generateToken, hashToken } from '../utils/tokens.js';
import { verifyGoogleToken } from '../utils/google.js';
import {
  sendAccountCreatedEmail,
  sendPasswordResetEmail,
} from '../utils/email.js';

const router = express.Router();

const passwordRules = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const sendAuthResponse = (res, user, message) => {
  const token = signToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message,
    token,
    user: user.toSafeObject(),
  });
};

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    passwordRules,
    body('name').optional().trim().isLength({ max: 100 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, name } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const displayName = name || email.split('@')[0];

      const user = await User.create({
        email,
        password: hashedPassword,
        name: displayName,
        authProvider: 'local',
        isEmailVerified: true,
      });

      try {
        await sendAccountCreatedEmail(email, displayName);
      } catch (err) {
        console.error('Account created email error:', err.message);
      }

      return sendAuthResponse(res, user, 'Account created successfully');
    } catch (error) {
      return res.status(500).json({ message: 'Server error during signup' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return sendAuthResponse(res, user, 'Login successful');
    } catch {
      return res.status(500).json({ message: 'Server error during login' });
    }
  }
);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const payload = await verifyGoogleToken(credential);
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.googleEmail = email;
        user.authProvider = user.password ? 'both' : 'google';
        user.isEmailVerified = true;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        email,
        googleId,
        googleEmail: email,
        name: name || email.split('@')[0],
        avatar: picture || '',
        authProvider: 'google',
        isEmailVerified: true,
      });
    }

    return sendAuthResponse(res, user, 'Google login successful');
  } catch {
    return res.status(401).json({ message: 'Google authentication failed' });
  }
});

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('googleEmail').optional().isEmail().normalizeEmail(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, googleEmail } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.json({
          message: 'If an account exists, a password reset link has been sent',
        });
      }

      if (user.authProvider === 'google' && !user.password) {
        return res.status(400).json({
          message: 'This account uses Google sign-in. Please log in with Google.',
        });
      }

      if (user.authProvider === 'local' || user.authProvider === 'both') {
        if (!googleEmail) {
          return res.status(400).json({
            message: 'Google email is required for password reset confirmation',
            requiresGoogleEmail: true,
          });
        }

        if (user.googleEmail && user.googleEmail !== googleEmail) {
          return res.status(400).json({
            message: 'Google email does not match our records',
          });
        }

        if (!user.googleEmail) {
          user.googleEmail = googleEmail;
          await user.save();
        }
      }

      const resetToken = generateToken();
      user.resetPasswordToken = hashToken(resetToken);
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      await sendPasswordResetEmail(user.email, resetToken);

      return res.json({
        message: 'If an account exists, a password reset link has been sent',
      });
    } catch {
      return res.status(500).json({ message: 'Failed to process password reset request' });
    }
  }
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    passwordRules,
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { token, password } = req.body;
      const hashed = hashToken(token);

      const user = await User.findOne({
        resetPasswordToken: hashed,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset link' });
      }

      user.password = await bcrypt.hash(password, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      if (user.authProvider === 'google') {
        user.authProvider = 'both';
      }
      await user.save();

      return sendAuthResponse(res, user, 'Password reset successful');
    } catch {
      return res.status(500).json({ message: 'Failed to reset password' });
    }
  }
);

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;
