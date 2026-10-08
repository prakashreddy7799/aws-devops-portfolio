import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download, Menu, Moon, Pause, Play, Sun, X } from 'lucide-react';
import { m, useScroll } from 'motion/react';
import { useTheme } from '../hooks/useTheme';
import { navigation, profile } from '../content';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export function Brand({ onClick }) {
  return (
    <a
      className="brand"
      href="#home"
      onClick={onClick}
      aria-label={`${profile.name}, back to home`}
    >
      <span className="brand-mark">
        cp<span>.</span>
      </span>
      <span className="brand-name">
        {profile.name}
        <span className="brand-roles">
          {profile.headerRoles.map((role, index) => (
            <span key={role}>
              {index > 0 && (
                <span className="brand-role-divider" aria-hidden="true">
                  |
                </span>
              )}
              {role}
            </span>
          ))}
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const toggle = useRef(null);
  const menu = useRef(null);
  const { paused, reduced, togglePaused } = useMotionPreferences();
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const sectionId = (label) => label.toLowerCase().replace(/\s+/g, '-');
  useEffect(() => {
    let queued = false;
    let frame;
    const update = () => {
      const position = window.scrollY + Math.min(window.innerHeight * 0.35, 260);
      setScrolled(window.scrollY > 40);
      const section = navigation
        .map((label) => document.getElementById(sectionId(label)))
        .filter(Boolean)
        .sort((a, b) => b.offsetTop - a.offsetTop)
        .find((element) => element.offsetTop <= position);
      if (section) setActive(section.id);
      queued = false;
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        frame = window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const background = [...document.querySelectorAll('main, footer')];
    const previousInert = background.map((element) => element.inert);
    document.body.style.overflow = 'hidden';
    background.forEach((element) => {
      element.inert = true;
    });
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const links = Array.from(menu.current.querySelectorAll('a'));
        const first = toggle.current;
        const last = links.at(-1);
        if (!event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          links[0].focus();
        } else if (event.shiftKey && document.activeElement === links[0]) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1200) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);
  function followAnchor(event, id) {
    setOpen(false);
    setActive(id);
    if (open) {
      event.preventDefault();
      window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ behavior: reduced || paused ? 'instant' : 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
      });
    }
  }
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="header-inner container">
        <Brand onClick={(event) => followAnchor(event, 'home')} />
        <nav
          ref={menu}
          id="primary-navigation"
          className={`navigation ${open ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          {navigation.map((label) => (
            <a
              key={label}
              href={`#${sectionId(label)}`}
              aria-current={active === sectionId(label) ? 'location' : undefined}
              onClick={(event) => followAnchor(event, sectionId(label))}
            >
              {label}
              {label === 'Contact' && <ArrowUpRight size={13} />}
            </a>
          ))}
          <a className="mobile-resume-download" href={profile.resume} download>
            Download Resume
          </a>
        </nav>
        <div className="header-tools">
          <a
            className="icon-button header-resume-download"
            href={profile.resume}
            download
            aria-label="Download resume"
          >
            <Download size={16} />
          </a>
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="icon-button motion-toggle"
            type="button"
            onClick={togglePaused}
            disabled={!!reduced}
            aria-label={
              reduced
                ? 'Animation disabled by system preference'
                : paused
                  ? 'Resume animations'
                  : 'Pause animations'
            }
            title={
              reduced ? 'Reduced motion enabled' : paused ? 'Resume animations' : 'Pause animations'
            }
          >
            {paused || reduced ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            ref={toggle}
            className="icon-button menu-toggle"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-controls="primary-navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <m.div
        className="site-scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </header>
  );
}
