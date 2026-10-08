import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { MotionPreferencesProvider, useMotionPreferences } from '../src/hooks/useMotionPreferences';
import DevOpsPlayground from '../src/components/DevOpsPlayground';
import ProjectShowcase from '../src/components/ProjectShowcase';
import EngineeringJourney from '../src/components/EngineeringJourney';
import TerraformCaseStudy from '../src/components/TerraformCaseStudy';
import EnvironmentCaseStudy from '../src/components/EnvironmentCaseStudy';
import JenkinsCaseStudy from '../src/components/JenkinsCaseStudy';
import ObservabilityCaseStudy from '../src/components/ObservabilityCaseStudy';
import MigrationCaseStudy from '../src/components/MigrationCaseStudy';
import { projects } from '../src/content';
import '../src/styles/themes.css';
import './standalone-v6-widgets.css';

function MotionControl() {
  const { paused, reduced, togglePaused } = useMotionPreferences();
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('portfolio-motionchange', { detail: { paused, reduced: !!reduced } }));
  }, [paused, reduced]);
  const label = reduced ? 'Animation disabled by system preference' : paused ? 'Resume animations' : 'Pause animations';
  return <div className="v6-motion-controls container">
    <p>Explore the engineering decisions. Every walkthrough runs locally.</p>
    <button type="button" onClick={togglePaused} disabled={!!reduced} aria-label={label}>
      {paused || reduced ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
      {reduced ? 'Reduced motion enabled' : paused ? 'Resume animations' : 'Pause animations'}
    </button>
  </div>;
}

function EngineeringExperiences() {
  return <>
    <MotionControl />
    <DevOpsPlayground />
    <section id="engineering-case-studies" className="section" aria-labelledby="engineering-cases-heading" tabIndex={-1}>
      <div className="container">
        <div className="v6-engineering-heading">
          <p className="eyebrow">AWS / DELIVERY / RELIABILITY</p>
          <h2 id="engineering-cases-heading">The decisions behind<br /><span className="text-muted">reliable infrastructure.</span></h2>
          <p className="body-copy">Five engineering walkthroughs connect infrastructure automation, environment delivery, application releases, observability, and migration readiness. Demonstrations use sanitized examples and fictional operational data.</p>
        </div>
        <ProjectShowcase />
        <EngineeringJourney />
        <div className="v6-case-stack">
          <TerraformCaseStudy project={projects[0]} />
          <EnvironmentCaseStudy />
          <JenkinsCaseStudy />
          <ObservabilityCaseStudy />
          <MigrationCaseStudy />
        </div>
      </div>
    </section>
  </>;
}

createRoot(document.getElementById('engineering-experiences')).render(
  <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion="user">
      <MotionPreferencesProvider><EngineeringExperiences /></MotionPreferencesProvider>
    </MotionConfig>
  </LazyMotion>,
);
