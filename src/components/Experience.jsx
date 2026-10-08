import { ArrowDownRight, BookOpen, BriefcaseBusiness, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { m, useScroll, useSpring } from 'motion/react';
import { certificationPlan, experience, sectionCopy } from '../content';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import ScrollReveal from './ScrollReveal';
import '../styles/work.css';

export default function Experience() {
  const copy = sectionCopy.experience;
  const timeline = useRef(null);
  const { stopMotion } = useMotionPreferences();
  const { scrollYProgress } = useScroll({ target: timeline, offset: ['start 80%', 'end 70%'] });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <section
      id="experience"
      className="section work-section"
      tabIndex={-1}
      aria-labelledby="experience-heading"
    >
      <div className="container work-layout">
        <ScrollReveal className="work-intro">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="experience-heading">
            {copy.title}
            <br />
            <span className="text-muted">{copy.accent}</span>
          </h2>
          <p className="body-copy">{copy.description}</p>
          <a className="text-link" href="#projects">
            {copy.projectsLabel}
            <ArrowDownRight size={16} />
          </a>
          <div className="work-employer">
            <BriefcaseBusiness size={19} aria-hidden="true" />
            <div>
              <strong>{copy.employer}</strong>
              <span>{copy.employerRole}</span>
              <small>{copy.employerPeriod}</small>
            </div>
          </div>
          <p className="work-overlap-note">{copy.overlapNote}</p>
        </ScrollReveal>
        <div className="timeline-list" ref={timeline}>
          <m.span
            className="timeline-progress"
            style={{ scaleY: stopMotion ? 1 : lineProgress }}
            aria-hidden="true"
          />
          {experience.map((item, index) => (
            <ScrollReveal key={item.client} delay={index * 0.04} className="timeline-entry">
              <span
                className={`timeline-marker${item.current ? ' timeline-marker-current' : ''}`}
                aria-hidden="true"
              />
              <div className="timeline-date">
                <span>{item.period}</span>
                {item.current && <span className="timeline-current">{copy.currentLabel}</span>}
              </div>
              <details className="timeline-card" open={index === 0}>
                <summary>
                  <span className="timeline-summary-text">
                    <span className="timeline-organization">{item.organization}</span>
                    <span className="timeline-client">{item.client}</span>
                    <span className="timeline-role">{item.role.split(' — ')[0]}</span>
                  </span>
                  <ChevronDown className="timeline-chevron" size={19} aria-hidden="true" />
                </summary>
                <div className="timeline-content">
                  <p>{item.details}</p>
                  <ul>
                    {item.responsibilities.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  <div
                    className="work-tags"
                    role="group"
                    aria-label={`Technologies used at ${item.client}`}
                  >
                    {item.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </details>
            </ScrollReveal>
          ))}
          <ScrollReveal className="work-learning">
            <BookOpen size={20} aria-hidden="true" />
            <div>
              <p className="work-learning-label">{copy.learningEyebrow}</p>
              <h3>{copy.learningTitle}</h3>
              <p>{copy.learningDescription}</p>
              {certificationPlan.map((item) => (
                <div className="work-learning-item" key={item.title}>
                  <span>{item.title}</span>
                  <strong>{item.state}</strong>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
