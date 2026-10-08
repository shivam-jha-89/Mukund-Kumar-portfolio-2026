import { profile, mailto } from '../data/profile'
import { Action } from './Action'
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{profile.brand}</p>
          <p className="footer-line">
            Built with React, curiosity,
            <br />
            and an unreasonable number of commits.
          </p>
        </div>
        <ul className="footer-links">
          <li>
            <Action variant="text" icon="github" href={profile.links.github}>
              GitHub
            </Action>
          </li>
          <li>
            <Action variant="text" icon="linkedin" href={profile.links.linkedin}>
              LinkedIn
            </Action>
          </li>
          <li>
            <Action variant="text" icon="mail" href={mailto(profile.links.email)}>
              Email
            </Action>
          </li>
        </ul>
      </div>
      <div className="container footer-base">
        <p>© 2026 {profile.name}</p>
        <p className="mono">{'// end of page'}</p>
      </div>
    </footer>
  )
}
