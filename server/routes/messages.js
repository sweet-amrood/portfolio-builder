import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';
import { signVisitorToken, verifyVisitorToken } from '../utils/visitorToken.js';
import { emitToOwner, emitToConversation } from '../socket.js';
import { recordAnalyticsEvent } from '../utils/analytics.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

async function getOwnerBySlug(slug) {
  return User.findOne({ portfolioSlug: slug }).select('_id name portfolioSlug');
}

async function getOwnerUnreadCount(ownerId) {
  const result = await Conversation.aggregate([
    { $match: { owner: ownerId } },
    { $group: { _id: null, total: { $sum: '$unreadByOwner' } } },
  ]);
  return result[0]?.total || 0;
}

function emitInboxStats(ownerId) {
  getOwnerUnreadCount(ownerId).then((unreadCount) => {
    emitToOwner(String(ownerId), 'inbox:stats', { unreadCount });
  });
}

router.get('/stats', protect, async (req, res) => {
  try {
    const unreadCount = await getOwnerUnreadCount(req.user._id);
    const conversationCount = await Conversation.countDocuments({ owner: req.user._id });
    return res.json({ unreadCount, conversationCount });
  } catch (error) {
    console.error('Message stats error:', error.message);
    return res.status(500).json({ message: 'Could not load message stats' });
  }
});

router.get('/public/thread', async (req, res) => {
  try {
    const visitorToken = String(req.query.visitorToken || '');
    const decoded = verifyVisitorToken(visitorToken);

    const conversation = await Conversation.findById(decoded.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(200);

    if (conversation.unreadByVisitor > 0) {
      conversation.unreadByVisitor = 0;
      await conversation.save();
    }

    return res.json({
      conversation: conversation.toListObject(),
      messages: messages.map((item) => item.toChatObject()),
      visitorToken,
    });
  } catch {
    return res.status(401).json({ message: 'Invalid visitor session' });
  }
});

router.post(
  '/public/resume',
  [
    body('slug').trim().notEmpty(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const slug = String(req.body.slug || '').trim().toLowerCase();
      const email = String(req.body.email || '').trim().toLowerCase();
      const owner = await getOwnerBySlug(slug);

      if (!owner) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      const conversation = await Conversation.findOne({
        owner: owner._id,
        slug,
        visitorEmail: email,
      });

      if (!conversation) {
        return res.status(404).json({ message: 'No conversation found for this email' });
      }

      const messages = await Message.find({ conversation: conversation._id })
        .sort({ createdAt: 1 })
        .limit(200);

      if (conversation.unreadByVisitor > 0) {
        conversation.unreadByVisitor = 0;
        await conversation.save();
      }

      const visitorToken = signVisitorToken(conversation._id);

      return res.json({
        conversation: conversation.toListObject(),
        messages: messages.map((item) => item.toChatObject()),
        visitorToken,
      });
    } catch (error) {
      console.error('Resume conversation error:', error.message);
      return res.status(500).json({ message: 'Could not resume conversation' });
    }
  }
);

router.post(
  '/public/reply',
  [
    body('visitorToken').isString(),
    body('message').trim().isLength({ min: 1, max: 2000 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const decoded = verifyVisitorToken(req.body.visitorToken);
      const conversation = await Conversation.findById(decoded.conversationId);

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      const message = await Message.create({
        conversation: conversation._id,
        senderType: 'visitor',
        body: req.body.message.trim(),
      });

      conversation.lastMessage = message.body;
      conversation.lastMessageAt = message.createdAt;
      conversation.unreadByOwner += 1;
      await conversation.save();

      const payload = {
        conversation: conversation.toListObject(),
        message: message.toChatObject(),
        visitorToken: req.body.visitorToken,
      };

      emitToOwner(String(conversation.owner), 'message:new', payload);
      emitToOwner(String(conversation.owner), 'conversation:updated', payload);
      emitInboxStats(conversation.owner);
      emitToConversation(String(conversation._id), 'message:new', payload);

      await recordAnalyticsEvent({
        ownerId: conversation.owner,
        slug: conversation.slug,
        type: 'message',
        label: 'visitor-reply',
        visitorId: conversation.visitorEmail,
      });

      return res.status(201).json(payload);
    } catch (error) {
      console.error('Visitor reply error:', error.message);
      return res.status(500).json({ message: 'Could not send message' });
    }
  }
);

router.post(
  '/public/:slug',
  [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().isLength({ min: 1, max: 2000 }),
    body('visitorToken').optional().isString(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const slug = String(req.params.slug || '').trim().toLowerCase();
      const owner = await getOwnerBySlug(slug);

      if (!owner) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      const { name, email, message } = req.body;
      let conversation = null;

      if (req.body.visitorToken) {
        try {
          const decoded = verifyVisitorToken(req.body.visitorToken);
          conversation = await Conversation.findOne({
            _id: decoded.conversationId,
            slug,
            visitorEmail: email,
          });
        } catch {
          conversation = null;
        }
      }

      if (!conversation) {
        conversation = await Conversation.findOne({
          owner: owner._id,
          slug,
          visitorEmail: email,
        });
      }

      if (!conversation) {
        conversation = await Conversation.create({
          owner: owner._id,
          slug,
          visitorName: name,
          visitorEmail: email,
          lastMessage: message,
          lastMessageAt: new Date(),
          unreadByOwner: 1,
        });
      } else {
        conversation.visitorName = name;
        conversation.lastMessage = message;
        conversation.lastMessageAt = new Date();
        conversation.unreadByOwner += 1;
        await conversation.save();
      }

      const createdMessage = await Message.create({
        conversation: conversation._id,
        senderType: 'visitor',
        body: message,
      });

      const visitorToken = signVisitorToken(conversation._id);
      const payload = {
        conversation: conversation.toListObject(),
        message: createdMessage.toChatObject(),
        visitorToken,
      };

      emitToOwner(String(owner._id), 'message:new', payload);
      emitToOwner(String(owner._id), 'conversation:updated', payload);
      emitToConversation(String(conversation._id), 'message:new', payload);
      emitInboxStats(owner._id);

      await recordAnalyticsEvent({
        ownerId: owner._id,
        slug,
        type: 'message',
        label: 'visitor-message',
        visitorId: email,
      });

      return res.status(201).json(payload);
    } catch (error) {
      console.error('Public message error:', error.message);
      return res.status(500).json({ message: 'Could not send message' });
    }
  }
);

router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ owner: req.user._id })
      .sort({ lastMessageAt: -1 })
      .limit(100);

    return res.json({
      conversations: conversations.map((item) => item.toListObject()),
    });
  } catch (error) {
    console.error('List conversations error:', error.message);
    return res.status(500).json({ message: 'Could not load conversations' });
  }
});

router.get('/:conversationId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      owner: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(200);

    if (conversation.unreadByOwner > 0) {
      conversation.unreadByOwner = 0;
      await conversation.save();
      emitInboxStats(req.user._id);
      emitToOwner(String(req.user._id), 'conversation:read', {
        conversationId: String(conversation._id),
      });
    }

    return res.json({
      conversation: conversation.toListObject(),
      messages: messages.map((item) => item.toChatObject()),
    });
  } catch (error) {
    console.error('Get conversation error:', error.message);
    return res.status(500).json({ message: 'Could not load conversation' });
  }
});

router.post(
  '/:conversationId/reply',
  protect,
  [body('message').trim().isLength({ min: 1, max: 2000 })],
  handleValidation,
  async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        _id: req.params.conversationId,
        owner: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      const message = await Message.create({
        conversation: conversation._id,
        senderType: 'owner',
        body: req.body.message.trim(),
      });

      conversation.lastMessage = message.body;
      conversation.lastMessageAt = message.createdAt;
      conversation.unreadByVisitor += 1;
      await conversation.save();

      const payload = {
        conversation: conversation.toListObject(),
        message: message.toChatObject(),
      };

      emitToConversation(String(conversation._id), 'message:new', payload);
      emitToOwner(String(req.user._id), 'conversation:updated', payload);

      return res.status(201).json(payload);
    } catch (error) {
      console.error('Owner reply error:', error.message);
      return res.status(500).json({ message: 'Could not send reply' });
    }
  }
);

export default router;
