import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { metrics, principles, profile, sectionCopy } from '../content';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import ScrollReveal from './ScrollReveal';

function Metric({ metric, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const { stopMotion } = useMotionPreferences();
  const target = parseInt(metric.value, 10);
  const [number, setNumber] = useState(target);
  useEffect(() => {
    if (!inView || stopMotion) {
      setNumber(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      setNumber(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, stopMotion, target]);
  return (
    <ScrollReveal delay={index * 0.08} className="metric-card">
      <div ref={ref}>
        <div className="metric-number" aria-hidden="true">
          {number}
          <span>{metric.value.replace(/^\d+/, '')}</span>
        </div>
        <span className="sr-only">{metric.value}</span>
        <h3>{metric.label}</h3>
        <p>{metric.context}</p>
      </div>
    </ScrollReveal>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="section about-section"
      tabIndex={-1}
      aria-labelledby="about-heading"
    >
      <div className="container">
        <div className="about-grid">
          <ScrollReveal className="about-sticky">
            <p className="eyebrow">{sectionCopy.about.eyebrow}</p>
            <h2 id="about-heading">
              {sectionCopy.about.title}
              <br />
              <span className="text-muted">{sectionCopy.about.accent}</span>
            </h2>
            <a className="text-link" href="#experience">
              The experience behind the work <ArrowUpRight size={16} />
            </a>
          </ScrollReveal>
          <div className="about-story">
            <ScrollReveal>
              <p className="lead-copy">{sectionCopy.about.description}</p>
              <p className="body-copy">{profile.about}</p>
            </ScrollReveal>
            <div className="principles">
              {principles.map((principle, index) => (
                <ScrollReveal key={principle.title} delay={index * 0.08} className="principle">
                  <span className="principle-number">0{index + 1}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <Metric key={metric.label} metric={metric} index={index} />
          ))}
        </div>
        <p className="metric-note">
          Selected outcomes from professional engagements. Context accompanies each metric.
        </p>
      </div>
    </section>
  );
}
