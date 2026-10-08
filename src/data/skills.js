export const skillGroups = [
  { label: 'languages', items: ['JavaScript', 'Python', 'C++', 'SQL'] },
  { label: 'frontend', items: ['React', 'HTML', 'CSS', 'Tailwind'] },
  { label: 'backend', items: ['Node.js', 'Express', 'FastAPI', 'REST', 'JWT', 'Socket.IO'] },
  { label: 'database', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { label: 'ai / ml', items: ['GenAI', 'LLM APIs', 'spaCy', 'Scikit-learn', 'Statsmodels', 'XGBoost'] },
  { label: 'tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'Vercel', 'Render'] },
]
/** Skill name in the stack list -> names used inside project tech lists. */
export const techAliases = {
  'LLM APIs': ['LLMs', 'Groq'],
  GenAI: ['LLMs', 'Groq'],
}
export const capabilities = [
  {
    title: 'Full-stack systems',
    body: 'React, Node.js, Express, REST APIs, authentication and real-time applications.',
    tags: ['React', 'Node.js', 'Express', 'REST', 'Auth', 'Socket.IO'],
  },
  {
    title: 'AI applications',
    body: 'LLM integration, GenAI workflows, AI-powered product features and intelligent automation.',
    tags: ['LLM APIs', 'GenAI', 'Automation'],
  },
  {
    title: 'Backend engineering',
    body: 'API architecture, PostgreSQL, MongoDB, Redis, queues, authentication and deployment.',
    tags: ['PostgreSQL', 'MongoDB', 'Redis', 'Queues', 'Deployment'],
  },
  {
    title: 'Data and ML',
    body: 'Data processing, feature engineering, forecasting, classical machine learning and applied AI.',
    tags: ['Pandas', 'Scikit-learn', 'Statsmodels', 'XGBoost'],
  },
]
export const focus = [
  { id: 'dsa', cmd: 'dsa', lines: ['practice: LeetCode, 280+ problems solved', 'languages: C++, Python'] },
  {
    id: 'backend',
    cmd: 'backend',
    lines: [
      'interfaces: REST APIs, JWT authentication',
      'stores: PostgreSQL, MongoDB, Redis',
      'queues: BullMQ',
    ],
  },
  {
    id: 'agents',
    cmd: 'agents',
    lines: ['LLM integration and GenAI workflows', 'AI-powered product features', 'intelligent automation'],
  },
  {
    id: 'data',
    cmd: 'data',
    lines: ['pandas, scikit-learn, statsmodels, XGBoost', 'feature engineering and forecasting'],
  },
]
