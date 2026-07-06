import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { recordAnalyticsEvent, getAnalyticsSummary, getAnalyticsEvents } from '../utils/analytics.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

async function getOwnerBySlug(slug) {
  return User.findOne({ portfolioSlug: slug }).select('_id portfolioSlug');
}

router.get('/summary', protect, async (req, res) => {
  try {
    const summary = await getAnalyticsSummary(req.user._id);
    return res.json(summary);
  } catch (error) {
    console.error('Analytics summary error:', error.message);
    return res.status(500).json({ message: 'Could not load analytics' });
  }
});

router.get('/events', protect, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const result = await getAnalyticsEvents(req.user._id, { page, limit });
    return res.json(result);
  } catch (error) {
    console.error('Analytics events error:', error.message);
    return res.status(500).json({ message: 'Could not load analytics events' });
  }
});

router.post(
  '/track/:slug',
  [
    body('type').isIn(['visit', 'click', 'message']),
    body('label').optional().isString().isLength({ max: 200 }),
    body('visitorId').optional().isString().isLength({ max: 80 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const slug = String(req.params.slug || '').trim().toLowerCase();
      const owner = await getOwnerBySlug(slug);

      if (!owner) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      const result = await recordAnalyticsEvent({
        ownerId: owner._id,
        slug,
        type: req.body.type,
        label: req.body.label || '',
        visitorId: req.body.visitorId || '',
      });

      if (result?.deduped) {
        return res.json({ tracked: false, deduped: true });
      }

      return res.status(201).json({ tracked: true, event: result.event });
    } catch (error) {
      console.error('Analytics track error:', error.message);
      return res.status(500).json({ message: 'Could not track analytics' });
    }
  }
);

export default router;
