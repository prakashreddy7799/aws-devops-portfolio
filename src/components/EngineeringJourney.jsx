import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/engineering-case-studies.css';

const stages = [
  { id: 'terraform-case-study', label: 'Terraform' },
  { id: 'environment-case-study', label: 'Environments' },
  { id: 'jenkins-case-study', label: 'CI/CD' },
  { id: 'jenkins-deployment', label: 'AWS Deployment' },
  { id: 'observability-case-study', label: 'Observability' },
  { id: 'migration-case-study', label: 'Migration & Readiness' },
];

export default function EngineeringJourney() {
  const [active, setActive] = useState(stages[0].id);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = undefined;
      const position = window.scrollY + 220;
      const current = [...stages].reverse().find(({ id }) => {
        const element = document.getElementById(id);
        return element && element.getBoundingClientRect().top + window.scrollY <= position;
      });
      setActive(current?.id || stages[0].id);
    };
    const schedule = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return (
    <nav className="ej-journey" aria-label="Engineering journey">
      <div className="ej-journey-intro">
        <span>THE ENGINEERING JOURNEY</span>
        <p>Connected learning stages. Architecture choices vary by deployment.</p>
      </div>
      <ol>
        {stages.map((stage, index) => (
          <li key={stage.id}>
            <a
              href={`#${stage.id}`}
              aria-current={active === stage.id ? 'step' : undefined}
              onClick={() => setActive(stage.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {stage.label}
            </a>
            {index < stages.length - 1 && <ArrowRight size={13} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
