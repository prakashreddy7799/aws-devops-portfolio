import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import CloudArchitecture from './components/CloudArchitecture';
import { sectionCopy } from './content';
import DevOpsPlayground from './components/DevOpsPlayground';
import { useMotionPreferences } from './hooks/useMotionPreferences';

function Architecture() {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '300px 0px' });
  const frame = useRef();
  const { stopMotion } = useMotionPreferences();
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  function trackCursor(event) {
    if (stopMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left,
      y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty('--architecture-pointer-x', `${x}px`);
      ref.current?.style.setProperty('--architecture-pointer-y', `${y}px`);
    });
  }
  return (
    <section
      ref={ref}
      id="architecture"
      className="section architecture-section"
      aria-labelledby="architecture-heading"
      onPointerMove={trackCursor}
      data-motion-enabled={!stopMotion}
    >
      <div className="container">
        <ScrollReveal className="section-heading">
          <div>
            <p className="eyebrow">{sectionCopy.architecture.eyebrow}</p>
            <h2 id="architecture-heading">
              {sectionCopy.architecture.title}
              <br />
              <span className="text-muted">{sectionCopy.architecture.accent}</span>
            </h2>
          </div>
          <p>{sectionCopy.architecture.description}</p>
        </ScrollReveal>
        <div className="architecture-slot">{visible && <CloudArchitecture />}</div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Architecture />
        <Experience />
        <DevOpsPlayground />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
