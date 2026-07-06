import { Router } from 'express';
import multer from 'multer';
import { createRequire } from 'module';
import { protect } from '../middleware/auth.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { parseResumeText } from '../utils/resumeParser.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname?.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
      return;
    }
    cb(new Error('Only PDF files are allowed'));
  },
});

const emptyProfile = (userId) => ({
  user: userId,
  personal: {
    name: '',
    headline: '',
    tagline: '',
    bio: '',
    about: '',
    greeting: '',
    location: '',
    availability: '',
    phone: '',
    brandTag: '',
    siteName: '',
  },
  profileImage: null,
  resume: null,
  links: {
    email: '',
    github: '',
    linkedin: '',
    website: '',
    twitter: '',
    instagram: '',
    resume: '',
  },
  skillGroups: [],
  experience: [],
  education: [],
  projects: [],
  highlights: [],
  stats: [],
});

async function getOrCreateProfile(userId) {
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = await Profile.create(emptyProfile(userId));
  }
  return profile;
}

router.get('/', protect, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    if (!profile.personal?.name && req.user.name) {
      profile.personal.name = req.user.name;
    }
    if (!profile.links?.email && req.user.email) {
      profile.links.email = req.user.email;
    }
    res.json({ profile: profile.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load profile' });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const payload = req.body?.profile;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Profile data is required' });
    }

    const profile = await getOrCreateProfile(req.user._id);

    if (payload.personal) profile.personal = { ...profile.personal.toObject?.() || profile.personal, ...payload.personal };
    if (payload.links) profile.links = { ...profile.links.toObject?.() || profile.links, ...payload.links };
    if (payload.skillGroups !== undefined) profile.skillGroups = payload.skillGroups;
    if (payload.experience !== undefined) profile.experience = payload.experience;
    if (payload.education !== undefined) profile.education = payload.education;
    if (payload.projects !== undefined) profile.projects = payload.projects;
    if (payload.highlights !== undefined) profile.highlights = payload.highlights;
    if (payload.stats !== undefined) profile.stats = payload.stats;
    if (payload.profileImage !== undefined) profile.profileImage = payload.profileImage;
    if (payload.resume !== undefined) profile.resume = payload.resume;

    await profile.save();

    if (payload.personal?.name && payload.personal.name !== req.user.name) {
      await User.findByIdAndUpdate(req.user._id, { name: payload.personal.name });
    }

    res.json({ profile: profile.toObject(), message: 'Profile saved' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to save profile' });
  }
});

router.post('/resume/parse', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file?.buffer?.length) {
      return res.status(400).json({ message: 'PDF resume file is required' });
    }

    const parsed = await pdfParse(req.file.buffer);
    const text = parsed.text || '';
    if (!text.trim()) {
      return res.status(422).json({ message: 'Could not extract text from this PDF. Try a text-based resume.' });
    }

    const extracted = parseResumeText(text);
    const resumeDataUrl = `data:application/pdf;base64,${req.file.buffer.toString('base64')}`;

    res.json({
      extracted,
      resumeDataUrl,
      textPreview: text.slice(0, 1200),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to parse resume' });
  }
});

export default router;
