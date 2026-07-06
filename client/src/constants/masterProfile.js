export const DEFAULT_MASTER_PROFILE = {
  personal: {
    name: '',
    headline: '',
    tagline: '',
    bio: '',
    about: '',
    greeting: 'Hello, I am',
    location: '',
    availability: 'Open to opportunities',
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
  skillGroups: [
    { name: 'Frontend', items: [] },
    { name: 'Backend', items: [] },
    { name: 'Tools', items: [] },
  ],
  experience: [],
  education: [],
  projects: [],
  highlights: [],
  stats: [],
};

export function createEmptyMasterProfile() {
  return structuredClone(DEFAULT_MASTER_PROFILE);
}
