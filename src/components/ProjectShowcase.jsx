import { ArrowRight, ArrowUpRight } from 'lucide-react';
const work = [
  [
    'Terraform AWS Infrastructure Automation',
    'terraform-case-study',
    ['Terraform', 'VPC', 'ALB'],
    'Automated the infrastructure foundation for enterprise OpenLiberty and Keycloak migration.',
    'Terraform automation, segmented networking, environment provisioning.',
    '45% less provisioning effort.',
  ],
  [
    'Enterprise Multi-Environment AWS Management',
    'environment-case-study',
    ['AWS', 'Networking', 'Security Groups'],
    'Delivered infrastructure across Dev, IT, UAT, and Production with environment-aware configuration.',
    'Environment inputs, networking, infrastructure delivery, validation.',
    'Repeatable configuration and clearer release readiness.',
  ],
  [
    'Jenkins CI/CD and EKS/ECS Deployment',
    'jenkins-case-study',
    ['Jenkins', 'Docker', 'ECR', 'EKS / ECS'],
    'Connected application builds, container images, and deployment workflows.',
    'OpenLiberty builds, image publishing, container delivery.',
    'Repeatable application delivery through CI/CD.',
  ],
  [
    'CloudWatch Monitoring and Incident Response',
    'observability-case-study',
    ['CloudWatch', 'Logs', 'Alarms'],
    'Connected metrics, centralized logs, dashboards, and alarms to improve operational visibility.',
    'Monitoring, log delivery, dashboards, alarms, incident investigation.',
    '35% reported reduction in MTTR.',
  ],
  [
    'OpenLiberty and Keycloak Enterprise Migration',
    'migration-case-study',
    ['OpenLiberty', 'Keycloak', 'AWS', 'Terraform'],
    'Prepared cloud infrastructure and coordinated environment cutover readiness.',
    'Migration runbooks, architecture documentation, deployment procedures.',
    'A coordinated migration with validation and rollback planning.',
  ],
];
export default function ProjectShowcase() {
  return (
    <div className="showcase-grid">
      {work.map(([title, id, stack, summary, responsibilities, impact], index) => (
        <article className="showcase-card" key={id}>
          <span className="eyebrow">
            {String(index + 1).padStart(2, '0')} / ENGINEERING CASE STUDY
          </span>
          <h3>{title}</h3>
          <p>{summary}</p>
          <div className="tags">
            {stack.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
          <p>
            <strong>My responsibilities</strong>
            <br />
            {responsibilities}
          </p>
          <p className="showcase-impact">{impact}</p>
          <div className="showcase-actions">
            <a href={`#${id}`}>
              Explore Architecture
              <ArrowUpRight size={14} />
            </a>
            <a href={`#${id}`}>
              Technical Walkthrough
              <ArrowRight size={14} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
