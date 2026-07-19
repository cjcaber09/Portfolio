export interface Profile {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
}

export interface ExperienceEntry {
  title: string
  company: string
  dates: string
  bullets: string[]
}

export interface SkillItem {
  name: string
  level: number // filled segments out of 10
}

export interface SkillGroup {
  category: string
  items: SkillItem[]
}

export interface Project {
  title: string
  description: string
  tech: string[]
  link?: string
  linkLabel?: string
}

export interface EducationEntry {
  level: string
  school: string
  dates: string
  degree?: string
  location?: string
}

export const profile: Profile = {
  name: 'Carl John E. Caber',
  title: 'Full-Stack Web Developer',
  tagline:
    'Building scalable, user-friendly web applications with 5+ years of experience across JavaScript, React, Vue, and Laravel.',
  email: 'cjcaber09@gmail.com',
  phone: '+63 977 792 6148',
  location: 'Kabankalan City, Negros Island, Philippines',
  linkedin: 'https://linkedin.com/in/carljohn09',
  github: 'https://github.com/cjcaber09',
}

export const summary =
  'Web Developer with 5+ years of experience building and maintaining scalable web applications. Skilled in JavaScript, PHP/Laravel, Node.js, Vue.js, and React.js. Experienced in API integrations, frontend UI implementation, and database management. Proficient in translating Figma and Adobe design assets into responsive web interfaces. Adept at working in Linux environments, maintaining production systems, and providing IT support. Strong problem solver with a track record of modernizing legacy systems and delivering user-friendly solutions.'

export const coreCompetencies: string[] = [
  'Full-Stack Web Development',
  'API Integration',
  'UI Implementation',
  'Responsive Design',
  'System Maintenance',
  'Technical Troubleshooting',
  'Legacy System Modernization',
]

export const experience: ExperienceEntry[] = [
  {
    title: 'Web Developer / IT Specialist',
    company: 'Profound Logic',
    dates: '2022 — 2026',
    bullets: [
      'Provide IT support including technical assistance, troubleshooting, and maintenance of internal IBM i systems.',
      'Transitioned to UI development, modernizing legacy IBM i applications using JavaScript, React.js, and modern web technologies.',
      'Design and implement responsive, user-friendly web interfaces integrated with backend IBM i services.',
      'Identify and resolve bugs efficiently through a ticketing system, ensuring system stability and smooth user experience.',
    ],
  },
  {
    title: 'Freelance Web Developer',
    company: 'Self-Employed',
    dates: '2020 — 2022',
    bullets: [
      'Developed and maintained custom web applications for diverse clients using JavaScript, React.js, PHP, and Laravel.',
      'Built responsive user interfaces from Figma and Adobe design prototypes, ensuring pixel-perfect implementation.',
    ],
  },
  {
    title: 'Web Developer / IT Support',
    company: 'Seahaven Business Solutions',
    dates: '2018 — 2020',
    bullets: [
      'Contributed to development of an inventory management system with integrations for Amazon MWS, eBay API, Newegg API, Walmart API, and other marketplace platforms.',
      'Built and maintained web applications using PHP, Laravel, JavaScript, and MySQL.',
      'Developed and customized WordPress websites for clients.',
      'Provided technical support including hardware troubleshooting, software installation, and system maintenance.',
      'Assisted the IT Head in improving internal company systems and processes.',
      'Managed client websites, emails, and system maintenance as part of senior development responsibilities.',
    ],
  },
]

// Levels are on a 0-10 scale (filled segments out of 10).
export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: [
      { name: 'JavaScript (ES6+)', level: 8 },
      { name: 'TypeScript', level: 8 },
      { name: 'PHP', level: 7 },
      { name: 'C++ (basic)', level: 5 },
      { name: 'SQL', level: 7 },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React.js', level: 7 },
      { name: 'Vue.js (Router, Vuex, Pinia)', level: 8 },
      { name: 'HTML5', level: 8 },
      { name: 'CSS3', level: 6 },
      { name: 'Sass', level: 6 },
      { name: 'Responsive Web Design', level: 6 },
      { name: 'UI Implementation', level: 7 },
      { name: 'Zod', level: 6 },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 7 },
      { name: 'Express.js', level: 7 },
      { name: 'Laravel', level: 6 },
      { name: 'CodeIgniter', level: 6 },
      { name: 'REST API Development', level: 7 },
      { name: 'Third-Party API Integration', level: 7 },
      { name: 'MySQL', level: 7 },
      { name: 'PostgreSQL', level: 8 },
    ],
  },
  {
    category: 'Tools & Platforms',
    items: [
      { name: 'Git', level: 7 },
      { name: 'Chrome DevTools', level: 8 },
      { name: 'Linux/Bash', level: 5 },
      { name: 'Apache Server', level: 5 },
      { name: 'npm', level: 7 },
      { name: 'Postman', level: 8 },
      { name: 'Vite', level: 7 },
      { name: 'VS Code', level: 8 },
      { name: 'Slack', level: 7 },
      { name: 'Jira', level: 7 },
    ],
  },
  {
    category: 'Design',
    items: [
      { name: 'Figma', level: 8 },
      { name: 'Adobe Photoshop', level: 7 },
      { name: 'Adobe Illustrator', level: 6 },
      { name: 'UI/UX Design', level: 7 },
    ],
  },
  {
    category: 'AI Tools',
    items: [
      { name: 'Claude', level: 7 },
      { name: 'ChatGPT', level: 7 },
      { name: 'GitHub Copilot', level: 7 },
    ],
  },
  {
    category: 'Other',
    items: [
      { name: 'Microsoft Office', level: 7 },
      { name: 'WordPress', level: 7 },
    ],
  },
]

export const projects: Project[] = [
  // TODO: replace with real project details, links, and screenshots
  {
    title: 'Legacy IBM i Modernization',
    description:
      'Modernized legacy IBM i applications by building a responsive React.js front end integrated with existing IBM i backend services, improving usability while preserving core business logic.',
    tech: ['React.js', 'JavaScript', 'IBM i'],
  },
  // TODO: replace with real project details, links, and screenshots
  {
    title: 'Multi-Marketplace Inventory Integration',
    description:
      'Contributed to an inventory management system integrating Amazon MWS, eBay, Newegg, and Walmart marketplace APIs for unified order and stock tracking.',
    tech: ['PHP', 'Laravel', 'MySQL'],
  },
  // TODO: replace with real project details, links, and screenshots
  {
    title: 'Freelance Client Web Applications',
    description:
      'Built custom, responsive web applications for freelance clients, translating Figma and Adobe design prototypes into pixel-perfect interfaces.',
    tech: ['React.js', 'PHP', 'Laravel'],
  },
  {
    title: 'Multi-Tenant Hotel Booking SaaS',
    description:
      'Building a multi-tenant hotel reservations platform with a Node.js/Express + Prisma API and a React/Vite frontend for both guest booking and hotel admin workflows. Postgres (Supabase) enforces tenant isolation via Row-Level Security and a database-level exclusion constraint that prevents double-booking a room, with Zod schemas shared between API validation and frontend forms.',
    tech: ['React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Zod'],
    link: 'https://app.supademo.com/demo/cmrmhhh940dyqqm57eawx9chv?utm_source=link',
  },
  {
    title: 'Team Task Management App',
    description:
      'A Trello/Jira-style project and task tracker with a Vue 3 + Pinia frontend and an Express + TypeScript API on Supabase Postgres. Supports JWT authentication, per-company project boards, task comments, notifications, and file uploads, with Zod-validated forms on both client and server.',
    tech: ['Vue.js', 'Pinia', 'Express', 'TypeScript', 'Supabase', 'Zod'],
    link: 'https://github.com/cjcaber09/task-management',
    linkLabel: 'View Source',
  },
  {
    title: 'Messaging App',
    description:
      'A conversations-and-messaging application with a React + Redux Toolkit frontend and an Express + TypeScript REST API backed by PostgreSQL. Handles user conversations and threaded messages with JWT-based authentication and validated forms on both ends.',
    tech: ['React', 'Redux Toolkit', 'Express', 'TypeScript', 'PostgreSQL'],
    link: 'https://github.com/cjcaber09/messaging-app',
    linkLabel: 'View Source',
  },
]

export const education: EducationEntry[] = [
  {
    level: 'Elementary',
    school: 'Esteban R. Abada Memorial School - EAST',
    dates: '2002 — 2008',
  },
  {
    level: 'Highschool',
    school: 'Southland College',
    dates: '2008 — 2012',
  },
  {
    level: 'College',
    school: 'Southland College',
    degree: 'Bachelor of Science in Information Technology',
    dates: '2014 — 2018',
    location: 'Kabankalan City, Negros Island, Philippines',
  },
]
