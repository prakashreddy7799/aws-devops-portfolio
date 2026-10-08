import { useId, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Cloud,
  FileCheck2,
  Network,
  Server,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { migrationCaseStudy as data } from '../migrationCaseStudy';
import { CaseStudyShell, CodeExample, InterviewDeepDive } from './EngineeringCaseStudy';
import '../styles/migration-case-study.css';

const afterNodes = [
  { title: 'AWS networking', detail: 'VPC and defined access paths', icon: Network },
  { title: 'Load balancing', detail: 'Application entry and health', icon: Cloud },
  { title: 'Container workloads', detail: 'OpenLiberty and Keycloak', icon: Boxes },
  { title: 'Automated delivery', detail: 'Versioned application releases', icon: FileCheck2 },
  { title: 'Monitoring', detail: 'Logs, metrics, and alarms', icon: Cloud },
  { title: 'Access boundaries', detail: 'Reviewed security controls', icon: ShieldCheck },
];

export default function MigrationCaseStudy() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const detailId = `migration-detail-${useId().replace(/:/g, '')}`;
  const step = data.steps[selectedIndex];
  const fields = [
    ['Objective', step.objective],
    ['AWS tools and services involved', step.tools.join(' · ')],
    ['My engineering responsibilities', step.responsibility],
    ['Dependencies and validation checks', step.validation],
    ['Potential migration risks', step.risk],
    ['Mitigation and rollback considerations', step.rollback],
  ];

  return (
    <CaseStudyShell
      id="migration-case-study"
      kicker="04 / MIGRATION & OPERATIONAL READINESS"
      title={data.title}
      summary={data.summary}
    >
      <div className="mig-workspace">
        <p className="mig-note">{data.note}</p>
        <div
          className="mig-before-after"
          role="group"
          aria-label="Conceptual migration before and after architecture"
        >
          <div className="mig-before">
            <span className="mig-label">BEFORE / PLATFORM UNSPECIFIED</span>
            <Server size={28} aria-hidden="true" />
            <h4>Existing enterprise hosting</h4>
            <p>Applications, identity, and their dependencies in the existing environment.</p>
            <span className="mig-before-caption">No legacy platform is assumed.</span>
          </div>
          <div className="mig-transition" aria-hidden="true">
            <ArrowRight size={23} />
            <ArrowDown size={23} />
          </div>
          <div className="mig-after">
            <span className="mig-label">AFTER / REPRESENTATIVE AWS PATTERN</span>
            <div className="mig-target-nodes">
              {afterNodes.map(({ title, detail, icon: Icon }) => (
                <div className="mig-target-node" key={title}>
                  <Icon size={20} aria-hidden="true" />
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mig-walkthrough-heading">
          <div>
            <span className="mig-label">TECHNICAL WALKTHROUGH</span>
            <h4>Twelve steps. One coordinated change.</h4>
          </div>
          <p>Select a step to explore the engineering checks.</p>
        </div>
        <ol className="mig-journey" aria-label="Migration journey steps">
          {data.steps.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selectedIndex === index}
                aria-controls={detailId}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="mig-step-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.title}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <section className="mig-detail" id={detailId} aria-label="Migration step details">
          <div className="mig-detail-heading">
            <span className="mig-label">
              STEP {String(selectedIndex + 1).padStart(2, '0')} / 12
            </span>
            <h4 aria-live="polite" aria-atomic="true">
              {step.title}
            </h4>
          </div>
          <dl className="mig-detail-fields">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mig-step-controls">
            <button
              type="button"
              onClick={() => setSelectedIndex((index) => index - 1)}
              disabled={selectedIndex === 0}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Previous Step
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((index) => index + 1)}
              disabled={selectedIndex === data.steps.length - 1}
            >
              Next Step
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="mig-coordination" aria-labelledby="migration-coordination-heading">
          <div className="mig-coordination-heading">
            <Users size={21} aria-hidden="true" />
            <h4 id="migration-coordination-heading">A shared readiness decision.</h4>
          </div>
          <p>
            Illustrative coordination responsibilities. My role connected infrastructure delivery
            and deployment documentation with each team’s acceptance evidence.
          </p>
          <div className="mig-team-grid">
            {data.teams.map((team) => (
              <div key={team.title}>
                <h5>{team.title}</h5>
                <p>{team.responsibility}</p>
              </div>
            ))}
          </div>
        </section>
        <CodeExample
          title="Example migration runbook"
          filename="migration-runbook.example.yaml"
          code={data.runbook}
          note="An editable example checklist, not an executable migration or a customer change record. Owners, evidence, and recovery decisions must be defined for the actual application."
        />
        <section className="mig-impact">
          <h4>Business impact</h4>
          <p>{data.businessImpact}</p>
        </section>
        <InterviewDeepDive {...data.deepDive} />
        <nav className="mig-references" aria-label="Migration technical references">
          <span>Technical references</span>
          {data.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.title}
              <ArrowRight size={12} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </CaseStudyShell>
  );
}
