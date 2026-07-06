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

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Project {
  title: string
  description: string
  tech: string[]
}

export interface EducationEntry {
  degree: string
  school: string
  dates: string
  location: string
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

export const skills: SkillGroup[] = [
  { category: 'Languages', items: ['JavaScript (ES6+)', 'PHP', 'SQL'] },
  {
    category: 'Frontend',
    items: [
      'React.js',
      'Vue.js (Router, Vuex)',
      'HTML5',
      'CSS3',
      'Sass',
      'Responsive Web Design',
      'UI Implementation',
    ],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'Laravel', 'CodeIgniter', 'REST API Development', 'MySQL'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Git', 'Chrome DevTools', 'Linux/Bash', 'Apache Server', 'npm', 'Postman', 'Vite', 'VS Code'],
  },
  { category: 'Design', items: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator'] },
  { category: 'Other', items: ['Microsoft Office', 'WordPress'] },
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
]

export const education: EducationEntry = {
  degree: 'Bachelor of Science in Information Technology',
  school: 'Southland College',
  dates: '2014 — 2018',
  location: 'Kabankalan City, Negros Island, Philippines',
}
