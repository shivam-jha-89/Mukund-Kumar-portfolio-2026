/**
 * START HERE. This is the one file that holds your contact details.
 *
 * - Anything left as `null` shows up as a clearly marked "pending" placeholder
 *   (hero, contact, footer) instead of a dead link.
 * - Optional items (`leetcode`, `resume`) are simply hidden while they are `null`.
 * - `email` is a plain address, not a mailto: link.
 */
export const profile = {
  name: 'Shivam Kumar',
  brand: 'Shivam.K',
  links: {
    github: 'https://github.com/shivam-jha-89',
    linkedin: 'https://www.linkedin.com/in/shivam-kumar-426a86385/',
    email: 'shivam45jha@gmail.com', 
    leetcode: 'https://leetcode.com/u/qLA3eFJYA4/', // optional, e.g. 'https://leetcode.com/u/your-handle'
    resume: 'https://drive.google.com/file/d/17qQ-M0dFB0fzL2mZmnJUVinLf3oVQBk1/view?usp=sharing', // optional, e.g. '/resume.pdf' (put the file in /public) or a Drive link
  },
}

export const mailto = (email) => (email ? `mailto:${email}` : null)

/** Short, readable form of a URL for display: https://github.com/x/ -> github.com/x */
export const display = (url) => (url ? url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null)
