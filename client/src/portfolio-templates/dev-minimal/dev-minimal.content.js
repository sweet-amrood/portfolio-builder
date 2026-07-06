export const devMinimalContent = {
  siteName: 'johndoe.dev',
  name: 'John Doe',
  tagline: 'A coder by day, problem-solver by night!',
  bio: 'I am a dedicated Software Engineer specializing in full-stack application development. I enjoy crafting responsive web solutions using modern technologies while delivering high-quality, user-centric software.',
  about:
    'I build clean, performant web applications with a focus on clarity and maintainability. My work spans product design, frontend architecture, and backend APIs — always with an eye toward thoughtful user experience.',
  profileImage: null,
  nav: [
    { label: 'Introduction', section: 'hero' },
    { label: 'About Me', section: 'about' },
    { label: 'Projects', section: 'projects' },
    { label: 'Skills & Tools', section: 'skills' },
    { label: 'Experience', section: 'experience' },
    { label: 'Education', section: 'education' },
    { label: 'Contact', section: 'contact' },
    { label: 'Stats', section: 'stats' },
  ],
  links: {
    resume: '#',
    linkedin: '#',
    email: 'hello@example.com',
    github: '#',
  },
  projects: [
    {
      title: 'Flowboard',
      subtitle: 'Full-stack web application with modern UI and API integration.',
      tech: ['React', 'Node.js'],
    },
    {
      title: 'Metric One',
      subtitle: 'Dashboard for tracking metrics and team workflows.',
      tech: ['TypeScript', 'Tailwind'],
    },
    {
      title: 'PortfolioForge',
      subtitle: 'Mobile-first portfolio builder with live preview.',
      tech: ['Vite', 'MongoDB'],
    },
  ],
  skillGroups: [
    { name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
    { name: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
    { name: 'Tools', items: ['Git', 'Figma', 'Docker', 'Vercel'] },
  ],
  experience: [
    {
      company: 'Company 1',
      role: 'Software Engineer',
      description: 'Built and shipped full-stack features across web products, improving performance and developer experience.',
      period: 'Jan 2022 - Present',
    },
    {
      company: 'Company 2',
      role: 'Frontend Developer',
      description: 'Developed responsive interfaces and design systems for client-facing applications.',
      period: 'Jun 2019 - Dec 2021',
    },
  ],
  education: [
    {
      school: 'University 1',
      degree: 'B.S. Computer Science',
      description: 'Coursework in algorithms, software engineering, and human-computer interaction.',
      period: '2015 - 2019',
    },
  ],
  stats: [
    { label: 'Projects', value: '24+' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Technologies', value: '12+' },
    { label: 'Happy Clients', value: '8+' },
  ],
  contact: {
    title: 'Contact',
    subtitle: 'Have a project in mind? Send a message and I will get back to you soon.',
    email: 'hello@example.com',
    buttonText: 'Send Message',
  },
  footer: 'Built and Developed by PortfolioForge',
};
