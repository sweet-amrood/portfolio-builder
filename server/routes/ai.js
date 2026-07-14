import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Profile from '../models/Profile.js';
import {
  assertAiProviderConfigured,
  generateAiPortfolio,
  getActiveAiProvider,
} from '../utils/aiGenerate.js';

const router = Router();

function profilePayload(doc) {
  if (!doc) return null;
  return {
    personal: doc.personal || {},
    links: doc.links || {},
    skillGroups: doc.skillGroups || [],
    experience: doc.experience || [],
    education: doc.education || [],
    projects: doc.projects || [],
    highlights: doc.highlights || [],
    profileImage: doc.profileImage || null,
  };
}

router.get('/provider', protect, (req, res) => {
  const provider = getActiveAiProvider();
  const configured =
    provider === 'mistral'
      ? Boolean(process.env.MISTRAL_API_KEY)
      : Boolean(process.env.GEMINI_API_KEY);
  return res.json({ provider, configured });
});

router.post(
  '/generate',
  protect,
  body('prompt').trim().isLength({ min: 8, max: 2000 }).withMessage('Prompt must be 8–2000 characters'),
  body('useProfile').optional().isBoolean(),
  body('preferences').optional().isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      assertAiProviderConfigured();
    } catch (error) {
      return res.status(503).json({ message: error.message || 'AI generation is not configured' });
    }

    try {
      let profile = null;
      if (req.body.useProfile !== false) {
        const doc = await Profile.findOne({ user: req.user._id }).lean();
        profile = profilePayload(doc);
      }

      const generated = await generateAiPortfolio({
        prompt: req.body.prompt,
        profile,
        preferences: req.body.preferences || {},
      });

      return res.json({
        message: 'Portfolio generated',
        ...generated,
      });
    } catch (error) {
      console.error('AI generate failed:', error?.message || error);
      return res.status(502).json({
        message: error?.message || 'AI generation failed. Try again.',
      });
    }
  }
);

export default router;
