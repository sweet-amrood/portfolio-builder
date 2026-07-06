import express from 'express';
import User from '../models/User.js';
import PublishedPortfolio from '../models/PublishedPortfolio.js';
import { protect } from '../middleware/auth.js';
import {
  normalizeSlug,
  validateSlug,
  slugFromName,
  buildSlugSuggestions,
  getPublicPortfolioUrl,
} from '../utils/slug.js';

const router = express.Router();

async function isSlugAvailable(slug, userId) {
  const owner = await User.findOne({ portfolioSlug: slug }).select('_id');
  if (!owner) return { available: true, owned: false };
  if (owner._id.equals(userId)) return { available: true, owned: true };
  return { available: false, owned: false };
}

async function getAvailableSuggestions(base, user) {
  const candidates = buildSlugSuggestions({
    base,
    name: user.name,
    email: user.email,
  });

  const suggestions = [];
  for (const slug of candidates) {
    const status = await isSlugAvailable(slug, user._id);
    if (status.available && !status.owned) {
      suggestions.push(slug);
    }
    if (suggestions.length >= 5) break;
  }
  return suggestions;
}

router.get('/slug/check/:slug', protect, async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    const validation = validateSlug(slug);
    if (!validation.valid) {
      return res.json({
        slug,
        available: false,
        owned: false,
        reason: validation.reason,
        suggestions: await getAvailableSuggestions(slug, req.user),
      });
    }

    const status = await isSlugAvailable(slug, req.user._id);
    const suggestions =
      status.available && !status.owned
        ? []
        : await getAvailableSuggestions(slug, req.user);

    return res.json({
      slug,
      available: status.available,
      owned: status.owned,
      reason: status.available ? null : 'This portfolio name is already taken',
      suggestions,
    });
  } catch (error) {
    console.error('Slug check error:', error.message);
    return res.status(500).json({ message: 'Could not check portfolio name' });
  }
});

router.get('/slug/suggestions', protect, async (req, res) => {
  try {
    const base = normalizeSlug(req.query.base) || slugFromName(req.user.name);
    const suggestions = await getAvailableSuggestions(base, req.user);
    return res.json({ suggestions });
  } catch (error) {
    console.error('Slug suggestions error:', error.message);
    return res.status(500).json({ message: 'Could not load suggestions' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const records = await PublishedPortfolio.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });

    const live = records.find((record) => record.status === 'live') || null;
    const archived = records
      .filter((record) => record.status === 'archived')
      .map((record) => record.toOwnerObject());

    return res.json({
      slug: req.user.portfolioSlug || null,
      publicUrl: req.user.portfolioSlug ? getPublicPortfolioUrl(req.user.portfolioSlug) : null,
      live: live ? live.toOwnerObject() : null,
      archived,
    });
  } catch (error) {
    console.error('Portfolio me error:', error.message);
    return res.status(500).json({ message: 'Could not load portfolio status' });
  }
});

router.post('/publish', protect, async (req, res) => {
  try {
    const { templateId, content, sectionOrder, themeId } = req.body;
    const slug = normalizeSlug(req.body.slug);

    if (!templateId || !content) {
      return res.status(400).json({ message: 'Template and content are required' });
    }

    const validation = validateSlug(slug);
    if (!validation.valid) {
      const suggestions = await getAvailableSuggestions(slug, req.user);
      return res.status(400).json({
        message: validation.reason,
        suggestions,
      });
    }

    const status = await isSlugAvailable(slug, req.user._id);
    if (!status.available) {
      const suggestions = await getAvailableSuggestions(slug, req.user);
      return res.status(409).json({
        message: 'This portfolio name is already taken',
        suggestions,
      });
    }

    const now = new Date();
    let previousLiveTemplateId = null;

    const currentLive = await PublishedPortfolio.findOne({
      user: req.user._id,
      status: 'live',
    });

    if (currentLive && currentLive.templateId !== templateId) {
      previousLiveTemplateId = currentLive.templateId;
      currentLive.status = 'archived';
      currentLive.archivedAt = now;
      await currentLive.save();
    } else if (currentLive && currentLive.templateId === templateId) {
      currentLive.content = content;
      currentLive.sectionOrder = sectionOrder || [];
      currentLive.themeId = themeId || '';
      currentLive.publishedAt = now;
      currentLive.archivedAt = null;
      await currentLive.save();

      if (req.user.portfolioSlug !== slug) {
        req.user.portfolioSlug = slug;
        await req.user.save();
      }

      return res.json({
        slug,
        publicUrl: getPublicPortfolioUrl(slug),
        live: currentLive.toOwnerObject(),
        previousLiveTemplateId: null,
      });
    }

    const portfolio = await PublishedPortfolio.findOneAndUpdate(
      { user: req.user._id, templateId },
      {
        user: req.user._id,
        templateId,
        content,
        sectionOrder: sectionOrder || [],
        themeId: themeId || '',
        status: 'live',
        publishedAt: now,
        archivedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (req.user.portfolioSlug !== slug) {
      req.user.portfolioSlug = slug;
      await req.user.save();
    }

    return res.json({
      slug,
      publicUrl: getPublicPortfolioUrl(slug),
      live: portfolio.toOwnerObject(),
      previousLiveTemplateId,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Only one live portfolio is allowed at a time' });
    }
    console.error('Publish error:', error.message);
    return res.status(500).json({ message: 'Could not publish portfolio' });
  }
});

router.post('/unpublish', protect, async (req, res) => {
  try {
    const live = await PublishedPortfolio.findOne({
      user: req.user._id,
      status: 'live',
    });

    if (!live) {
      return res.status(404).json({ message: 'No live portfolio found' });
    }

    live.status = 'archived';
    live.archivedAt = new Date();
    await live.save();

    return res.json({ message: 'Portfolio unpublished', archived: live.toOwnerObject() });
  } catch (error) {
    console.error('Unpublish error:', error.message);
    return res.status(500).json({ message: 'Could not unpublish portfolio' });
  }
});

router.get('/public/:slug', async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    const validation = validateSlug(slug);
    if (!validation.valid) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const owner = await User.findOne({ portfolioSlug: slug }).select('name portfolioSlug');
    if (!owner) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const live = await PublishedPortfolio.findOne({
      user: owner._id,
      status: 'live',
    });

    if (!live) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    return res.json({
      slug: owner.portfolioSlug,
      ownerName: owner.name || '',
      ...live.toPublicObject(),
    });
  } catch (error) {
    console.error('Public portfolio error:', error.message);
    return res.status(500).json({ message: 'Could not load portfolio' });
  }
});

export default router;
