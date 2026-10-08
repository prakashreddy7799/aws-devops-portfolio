import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useInView, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Download, Linkedin, MapPin } from 'lucide-react';
import { profile } from '../content';
import { useMotionPreferences } from '../hooks/useMotionPreferences';

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref);
  const { stopMotion } = useMotionPreferences();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = profile.roles;
  const longestRole = roles.reduce(
    (longest, role) => (role.length > longest.length ? role : longest),
    '',
  );
  useEffect(() => {
    if (stopMotion || !inView) return undefined;
    const timer = window.setInterval(
      () => setRoleIndex((value) => (value + 1) % roles.length),
      3400,
    );
    return () => window.clearInterval(timer);
  }, [inView, stopMotion, roles.length]);
  const enter = (delay) => ({
    initial: stopMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay: stopMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });
  return (
    <section ref={ref} id="home" className="hero" tabIndex={-1} aria-labelledby="hero-heading">
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-grid container">
        <div className="hero-copy">
          <m.div {...enter(0.05)} className="availability">
            <span className="status-dot" />
            OPEN TO OPPORTUNITIES
          </m.div>
          <m.p {...enter(0.15)} className="hero-kicker">
            {profile.name.toUpperCase()}
            <span className="kicker-line" />
          </m.p>
          <h1 id="hero-heading">
            {profile.heroLines.map((line, index) => (
              <m.span
                {...enter(0.23 + index * 0.11)}
                key={line}
                className={index === profile.heroLines.length - 1 ? 'gradient-text' : undefined}
              >
                {line}
                {index < profile.heroLines.length - 1 ? ' ' : ''}
              </m.span>
            ))}
          </h1>
          <m.div {...enter(0.56)} className="hero-role">
            <span className="role-prefix" aria-hidden="true">
              &gt;_
            </span>
            <span className="sr-only">Roles of interest: {roles.join(', ')}.</span>
            <span className="role-window" aria-hidden="true">
              <span className="role-sizer">{longestRole}</span>
              <AnimatePresence mode="wait">
                <m.span
                  key={roleIndex}
                  initial={stopMotion ? false : { opacity: 0, y: 9 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -9 }}
                  transition={{ duration: stopMotion ? 0 : 0.25 }}
                >
                  {roles[roleIndex]}
                </m.span>
              </AnimatePresence>
            </span>
            <span className="role-cursor" aria-hidden="true" />
          </m.div>
          <p className="hero-professional-title">Senior AWS DevOps &amp; Cloud Engineer</p>
          <m.p {...enter(0.66)} className="hero-description">
            {profile.heroIntro}
          </m.p>
          <m.div {...enter(0.76)} className="hero-actions">
            <a className="button button-primary" href="#projects">
              Explore My Work <ArrowUpRight size={17} />
            </a>
            <a className="button button-secondary" href={profile.resume} download>
              Download Resume <Download size={16} />
            </a>
            <a className="button button-secondary" href="#contact">
              Contact Me <ArrowUpRight size={16} />
            </a>
          </m.div>
          <m.div {...enter(0.86)} className="hero-meta">
            <span>
              <MapPin size={13} />
              {profile.shortLocation}
            </span>
            <span className="meta-divider" />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={17} />
            </a>
          </m.div>
        </div>
        <m.div {...enter(0.5)} style={{ y: stopMotion ? 0 : visualY }} className="hero-visual">
          <figure className="hero-portrait">
            <img
              src={profile.photo}
              alt={profile.name}
              width="900"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              <span>{profile.roles[0]}</span>
              <strong>{profile.name}</strong>
              <span>{profile.experience} of cloud engineering experience</span>
            </figcaption>
          </figure>
        </m.div>
      </div>
      <div className="hero-bottom container">
        <a href="#about" className="scroll-hint">
          <span className="scroll-hint-icon">
            <ArrowDown size={14} />
          </span>
          SCROLL TO DISCOVER
        </a>
        <span className="hero-bottom-note">BUILT FOR RELIABILITY. DESIGNED TO SCALE.</span>
      </div>
    </section>
  );
}
