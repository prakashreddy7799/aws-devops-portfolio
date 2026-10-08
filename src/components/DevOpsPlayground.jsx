import { useRef, useState } from 'react';
import { ArrowRight, Boxes, Terminal } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
const experiences = [
  {
    label: 'Terraform Infrastructure',
    target: 'terraform-case-study',
    flow: ['Terraform', 'VPC', 'Subnets', 'ALB', 'Compute'],
    description:
      'Explore infrastructure dependencies, network boundaries, and the reported 45% reduction in provisioning effort.',
    output: 'Illustrative resources only. No terraform apply is executed.',
  },
  {
    label: 'CI/CD Pipeline',
    target: 'jenkins-case-study',
    flow: ['Git', 'Jenkins', 'Maven', 'Docker', 'ECR', 'Deploy'],
    description:
      'Build and inspect a sample delivery pipeline, compare EKS and ECS, and practice recovering an unhealthy rollout.',
    output: 'Sample Jenkins logs and local stage transitions. No job is submitted.',
  },
  {
    label: 'Kubernetes & Containers',
    target: 'jenkins-deployment',
    flow: ['Image', 'ECR', 'EKS / ECS', 'Health'],
    description:
      'Compare Kubernetes rollout validation with ECS service deployment and health checks.',
    output: 'Runtime alternatives and a simulated recovery. No cluster connection.',
  },
  {
    label: 'CloudWatch Monitoring',
    target: 'observability-case-study',
    flow: ['Workloads', 'Metrics', 'Logs', 'Alarms'],
    description:
      'Read synthetic metrics, logs, and alarms while keeping the reported 35% MTTR achievement separate from demo values.',
    output: 'DEMO DATA: fictional samples, not production telemetry.',
  },
  {
    label: 'Incident Response',
    target: 'observability-case-study',
    flow: ['Errors', 'Alarm', 'Investigate', 'Recover'],
    description:
      'Trigger a fictional incident, correlate signals, investigate a hypothesis, and validate a corrective action.',
    output: 'A local teaching scenario. No real incident record or remediation.',
  },
  {
    label: 'Migration Journey',
    target: 'migration-case-study',
    flow: ['Assess', 'Plan', 'Provision', 'Validate', 'Cutover'],
    description:
      'Walk through twelve migration stages, cross-team checks, cutover planning, and rollback readiness.',
    output: 'An anonymized reference runbook. Legacy hosting remains unspecified.',
  },
];
export default function DevOpsPlayground() {
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  const experience = experiences[selected];
  function keyDown(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % experiences.length;
    if (event.key === 'ArrowLeft') next = (index + experiences.length - 1) % experiences.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = experiences.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setSelected(next);
      refs.current[next]?.focus();
    }
  }
  return (
    <section
      id="devops-playground"
      className="section playground-section"
      tabIndex={-1}
      aria-labelledby="playground-heading"
    >
      <div className="container">
        <ScrollReveal>
          <p className="eyebrow">LEARN THE ENGINEERING DECISIONS</p>
          <h2 id="playground-heading">
            DevOps Engineering
            <br />
            <span className="text-muted">Playground</span>
          </h2>
        </ScrollReveal>
        <div className="playground-control-panel">
          <div role="tablist" aria-label="DevOps playground experiences">
            {experiences.map((item, index) => (
              <button
                type="button"
                role="tab"
                id={`playground-tab-${index}`}
                aria-selected={selected === index}
                aria-controls="playground-active-panel"
                tabIndex={selected === index ? 0 : -1}
                ref={(element) => {
                  refs.current[index] = element;
                }}
                key={item.label}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => keyDown(event, index)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            id="playground-active-panel"
            role="tabpanel"
            aria-labelledby={`playground-tab-${selected}`}
            tabIndex={0}
          >
            <p className="eyebrow">EDUCATIONAL SIMULATION / LOCAL DEMO DATA</p>
            <h3>{experience.label}</h3>
            <p>{experience.description}</p>
            <div className="playground-flow" aria-label="Conceptual learning flow">
              {experience.flow.map((label, index) => (
                <span key={label}>
                  <Boxes size={19} aria-hidden="true" />
                  <strong>{label}</strong>
                  {index < experience.flow.length - 1 && (
                    <ArrowRight size={14} aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
            <div className="playground-output">
              <Terminal size={17} aria-hidden="true" />
              <span>{experience.output}</span>
            </div>
            <a className="button button-primary" href={`#${experience.target}`}>
              Open interactive walkthrough
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
