import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Boxes,
  ChevronDown,
  Cloud,
  Network,
  Package,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react';
import { projects, sectionCopy } from '../content';
import ScrollReveal from './ScrollReveal';
import TerraformCaseStudy from './TerraformCaseStudy';
import EngineeringJourney from './EngineeringJourney';
import ProjectShowcase from './ProjectShowcase';
import { Fragment, lazy, Suspense } from 'react';
const EnvironmentCaseStudy = lazy(() => import('./EnvironmentCaseStudy'));
const JenkinsCaseStudy = lazy(() => import('./JenkinsCaseStudy'));
const ObservabilityCaseStudy = lazy(() => import('./ObservabilityCaseStudy'));
const MigrationCaseStudy = lazy(() => import('./MigrationCaseStudy'));
import '../styles/work.css';

const diagramIcons = {
  activity: Activity,
  blocks: Blocks,
  containers: Boxes,
  cloud: Cloud,
  network: Network,
  package: Package,
  server: Server,
  shield: ShieldCheck,
  terminal: Terminal,
  workflow: Workflow,
};

function ProjectDiagram({ nodes, number }) {
  return (
    <div
      className="project-diagram"
      role="img"
      aria-label={`Conceptual architecture: ${nodes.map((node) => node.label).join(' → ')}`}
    >
      <span className="project-diagram-label">
        {sectionCopy.projects.flowLabel}
        <span>/{number}</span>
      </span>
      <div className="project-diagram-flow">
        {nodes.map((node, index) => {
          const Icon = diagramIcons[node.icon] || Server;
          return (
            <div className="project-diagram-stage" key={node.label}>
              <div className="project-diagram-node">
                <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                <span>{node.label}</span>
              </div>
              {index < nodes.length - 1 && (
                <span className="project-diagram-connector" aria-hidden="true">
                  <ArrowRight size={13} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Projects() {
  const copy = sectionCopy.projects;
  return (
    <section
      id="projects"
      className="section project-section"
      tabIndex={-1}
      aria-labelledby="projects-heading"
    >
      <div className="container">
        <div className="work-section-heading">
          <ScrollReveal>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="projects-heading">
              {copy.title}
              <br />
              <span className="text-muted">{copy.accent}</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal className="work-heading-description">
            <p className="body-copy">{copy.description}</p>
          </ScrollReveal>
        </div>
        <ProjectShowcase />
        <EngineeringJourney />
        <div className="project-grid">
          {projects.map((project, index) =>
            project.number === '01' ? (
              <Fragment key={project.number}>
                <ScrollReveal
                  key={project.number}
                  className="project-reveal terraform-project-reveal"
                >
                  <TerraformCaseStudy project={project} />
                </ScrollReveal>
                <Suspense fallback={<p className="body-copy">Loading engineering experiences…</p>}>
                  {[
                    EnvironmentCaseStudy,
                    JenkinsCaseStudy,
                    ObservabilityCaseStudy,
                    MigrationCaseStudy,
                  ].map((Component, index) => (
                    <div className="ej-project-reveal" key={index}>
                      <Component />
                    </div>
                  ))}
                </Suspense>
              </Fragment>
            ) : (
              <ScrollReveal
                key={project.number}
                delay={(index % 2) * 0.08}
                className="project-reveal"
              >
                <article className="project-card">
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>{project.number.padStart(2, '0')}</span>
                  </div>
                  <ProjectDiagram nodes={project.diagram} number={project.number} />
                  <div className="project-card-body">
                    <p className="project-kind">
                      {project.type}
                      <span aria-hidden="true"> · </span>
                      {project.engagement}
                    </p>
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div
                      className="work-tags"
                      role="group"
                      aria-label={`Technologies for ${project.title}`}
                    >
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <div className="project-impact">
                      <strong>{project.highlight}</strong>
                      <span>{project.highlightLabel}</span>
                      <ArrowUpRight size={19} aria-hidden="true" />
                    </div>
                    <details className="project-details">
                      <summary>
                        {copy.detailsLabel}
                        <ChevronDown size={16} aria-hidden="true" />
                      </summary>
                      <div className="project-details-body">
                        <h4>{copy.challengeLabel}</h4>
                        <p>{project.challenge}</p>
                        <h4>{copy.solutionLabel}</h4>
                        <p>{project.solution}</p>
                        <h4>{copy.impactLabel}</h4>
                        <p>{project.impact}</p>
                      </div>
                    </details>
                  </div>
                </article>
              </ScrollReveal>
            ),
          )}
        </div>
        <ScrollReveal className="project-footnote">
          <p>{copy.note}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
