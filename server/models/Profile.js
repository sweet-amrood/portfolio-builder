import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    personal: {
      name: { type: String, default: '' },
      headline: { type: String, default: '' },
      tagline: { type: String, default: '' },
      bio: { type: String, default: '' },
      about: { type: String, default: '' },
      greeting: { type: String, default: '' },
      location: { type: String, default: '' },
      availability: { type: String, default: '' },
      phone: { type: String, default: '' },
      brandTag: { type: String, default: '' },
      siteName: { type: String, default: '' },
    },
    profileImage: { type: String, default: null },
    resume: { type: String, default: null },
    links: {
      email: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      resume: { type: String, default: '' },
    },
    skillGroups: {
      type: [
        {
          name: String,
          items: [String],
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          company: String,
          role: String,
          period: String,
          description: String,
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          school: String,
          degree: String,
          period: String,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          subtitle: String,
          tech: [String],
          link: String,
          featured: Boolean,
        },
      ],
      default: [],
    },
    highlights: {
      type: [
        {
          value: String,
          label: String,
        },
      ],
      default: [],
    },
    stats: {
      type: [
        {
          value: String,
          label: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
