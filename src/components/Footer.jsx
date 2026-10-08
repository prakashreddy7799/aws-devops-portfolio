import { ArrowUp, Linkedin, Mail } from 'lucide-react';
import { profile } from '../content';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <a className="footer-name" href="#home">
            {profile.name}
            <span className="brand-dot">.</span>
          </a>
          <p>{profile.roles[0]}</p>
        </div>
        <div className="footer-middle">
          <span>
            © {new Date().getFullYear()} {profile.name}.
          </span>
          <div>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>
        <a className="back-top" href="#home">
          Back to top <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  );
}
