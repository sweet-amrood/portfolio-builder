export const vscodeStudioContent = {
  workspaceName: 'johndoe-portfolio',
  siteTitle: 'portfolio',
  name: 'John',
  nameHighlight: 'Doe',
  roles: ['Backend Engineer', 'AI / ML Dev', 'Data Scientist'],
  company: '@ Your Company',
  typingLine: 'Building intelligent backend systems 🚀',
  welcomeComment: '// hello world !! Welcome to my portfolio',
  bio: 'I live at the crossroads of backend engineering, AI/ML, and data science. I build systems that are genuinely intelligent and scalable.',
  about:
    'I am a software engineer focused on scalable backends, machine learning pipelines, and clean architecture. I enjoy turning complex problems into reliable, production-ready systems.',
  profileImage: null,
  copilotName: "John's Copilot",
  copilot: {
    assistantTitle: "John's AI Assistant",
    welcomeTitle: "Hi! I'm John's Copilot 👋",
    welcomeSubtitle:
      'Ask me anything about my projects, skills, experience, or achievements.',
    inputPlaceholder: "Ask about John's projects, experience, skills...",
    disclaimer: 'AI can make mistakes · Contact John directly for important info',
    faqs: [
      {
        question: 'Tell me about John?',
        answer:
          "John is a backend engineer and AI/ML developer who builds scalable APIs, data pipelines, and production-ready intelligent systems.",
      },
      {
        question: 'What projects has John built?',
        answer:
          'Top builds include Project Alpha (real-time API + ML analytics), Project Beta (large-scale data pipeline), and Project Gamma (automated dev tooling with CI/CD).',
      },
      {
        question: 'Tell me about work experience',
        answer:
          'Software Engineer at Company 1 (2022–Present) and Backend Developer at Company 2 (2019–2021), building APIs, microservices, and ML pipelines.',
      },
      {
        question: "What's the tech stack?",
        answer:
          'Node.js, Python, Go, TensorFlow, PyTorch, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, and Git.',
      },
      {
        question: 'How can I contact John?',
        answer:
          'Reach out via the contact tab or email hello@example.com — open to collaborations, freelance work, and full-time opportunities.',
      },
      {
        question: 'How can I support John?',
        answer:
          'Star projects on GitHub, share the portfolio, refer opportunities, or connect on LinkedIn — every bit helps.',
      },
    ],
  },
  navFiles: [
    { filename: 'home.tsx', section: 'hero', label: 'home.tsx' },
    { filename: 'about.html', section: 'about', label: 'about.html' },
    { filename: 'projects.js', section: 'projects', label: 'projects.js' },
    { filename: 'skills.json', section: 'skills', label: 'skills.json' },
    { filename: 'experience.ts', section: 'experience', label: 'experience.ts' },
    { filename: 'contact.css', section: 'contact', label: 'contact.css' },
    { filename: 'README.md', section: 'about', label: 'README.md' },
  ],
  heroActions: [
    { label: 'Projects', section: 'projects', icon: '📁' },
    { label: 'About Me', section: 'about', icon: '👤' },
    { label: 'Contact', section: 'contact', icon: '✉' },
  ],
  links: {
    resume: '#',
    linkedin: '#',
    github: '#',
    email: 'hello@example.com',
  },
  stats: [
    { value: '3+', label: 'Years' },
    { value: '10+', label: 'Projects' },
    { value: '∞', label: 'Curiosity' },
    { value: '↑', label: 'Always Learning' },
  ],
  projects: [
    {
      title: 'Project Alpha',
      subtitle: 'Full-stack API platform with real-time analytics and ML inference.',
      tech: ['Node.js', 'Python', 'Docker'],
    },
    {
      title: 'Project Beta',
      subtitle: 'Data pipeline for processing and visualizing large-scale datasets.',
      tech: ['TypeScript', 'MongoDB', 'React'],
    },
    {
      title: 'Project Gamma',
      subtitle: 'Developer tooling suite with automated testing and deployment.',
      tech: ['Go', 'Kubernetes', 'Git'],
    },
  ],
  skillGroups: [
    { name: 'Backend', items: ['Node.js', 'Python', 'Go', 'REST APIs'] },
    { name: 'AI / ML', items: ['TensorFlow', 'PyTorch', 'scikit-learn', 'OpenAI'] },
    { name: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Pandas'] },
    { name: 'Tools', items: ['Docker', 'Git', 'VS Code', 'Linux'] },
  ],
  experience: [
    {
      company: 'Company 1',
      role: 'Software Engineer',
      description: 'Built and shipped backend services, ML integrations, and data pipelines at scale.',
      period: 'Jan 2022 - Present',
    },
    {
      company: 'Company 2',
      role: 'Backend Developer',
      description: 'Developed APIs and microservices for high-traffic production applications.',
      period: 'Jun 2019 - Dec 2021',
    },
  ],
  contact: {
    title: 'Contact',
    subtitle: 'Have a project in mind? Send a message and I will get back to you soon.',
    email: 'hello@example.com',
    buttonText: 'Send Message',
  },
  footer: 'Built and Developed by PortfolioForge',
};
