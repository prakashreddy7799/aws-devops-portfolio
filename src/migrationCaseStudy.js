// Resume-backed scope; detailed steps are an illustrative, anonymized walkthrough.
export const migrationCaseStudy = {
  title: 'Enterprise OpenLiberty & Keycloak Migration',
  summary:
    'I automated AWS infrastructure for an enterprise OpenLiberty and Keycloak migration and prepared the runbooks and deployment procedures for environment cutovers. The value was repeatable infrastructure and a coordinated path from application preparation to operational readiness.',
  businessImpact:
    'Repeatable provisioning, documented validation, and clear ownership made infrastructure delivery and cutover preparation more consistent. No separate migration duration, downtime, or cost saving is claimed here.',
  note: 'Conceptual journey based on my resume. The original hosting platform, application dependencies, and customer configuration are intentionally unspecified. The detailed checks below are examples, not a reproduction of a client runbook.',
  steps: [
    {
      id: 'assessment',
      title: 'Architecture assessment',
      objective: 'Understand the application boundaries and the dependencies a move could affect.',
      tools: ['Architecture documentation', 'Dependency inventory'],
      responsibility:
        'Prepare architecture documentation and coordinate application and infrastructure inputs.',
      validation:
        'Confirm application owners, integration points, configuration sources, and acceptance criteria with the development team.',
      risk: 'An undocumented dependency can appear only after traffic moves.',
      rollback:
        'Record the existing baseline and retain the agreed source-side recovery path before making a change.',
    },
    {
      id: 'planning',
      title: 'Infrastructure planning',
      objective: 'Translate application requirements into an AWS infrastructure plan.',
      tools: ['AWS VPC', 'ALB', 'EKS / ECS', 'Terraform'],
      responsibility: 'Design AWS infrastructure for the OpenLiberty and Keycloak migration.',
      validation:
        'Review networking, runtime requirements, access boundaries, and environment differences before provisioning.',
      risk: 'A generic template can miss an application-specific requirement.',
      rollback:
        'Review the infrastructure plan and agree on corrective changes before applying it.',
    },
    {
      id: 'terraform',
      title: 'Terraform provisioning',
      objective: 'Create repeatable infrastructure from version-controlled definitions.',
      tools: ['Terraform', 'AWS infrastructure'],
      responsibility: 'Automate AWS infrastructure provisioning across the migration environments.',
      validation:
        'Validate configuration and review the plan against the approved environment and resource scope.',
      risk: 'Incorrect inputs or state selection can affect the wrong environment.',
      rollback:
        'Use a reviewed corrective plan; do not assume that restoring old state reverses infrastructure changes.',
    },
    {
      id: 'network',
      title: 'Network and security configuration',
      objective: 'Give workloads the connectivity they need within defined access boundaries.',
      tools: ['VPC', 'Subnets', 'Security Groups', 'IAM'],
      responsibility:
        'Coordinate with networking and security teams on segmented AWS infrastructure.',
      validation:
        'Check routes, allowed application paths, name resolution, and service permissions.',
      risk: 'An overly broad rule exposes workloads; a missing rule blocks dependencies.',
      rollback:
        'Retain reviewed rule and route baselines and restore only the approved changes if validation fails.',
    },
    {
      id: 'packaging',
      title: 'OpenLiberty application packaging',
      objective: 'Package the application with the runtime configuration it requires.',
      tools: ['OpenLiberty', 'Application artifacts', 'Jenkins'],
      responsibility:
        'Support OpenLiberty compilation and container delivery through Jenkins pipelines.',
      validation:
        'Check required Liberty features, application startup, external configuration, and dependency connectivity.',
      risk: 'An artifact can build successfully but fail with a different runtime configuration.',
      rollback: 'Keep the previous approved artifact and configuration available for redeployment.',
    },
    {
      id: 'identity',
      title: 'Keycloak integration considerations',
      objective: 'Validate identity behavior when application endpoints and routing change.',
      tools: ['Keycloak', 'TLS', 'Reverse proxy configuration'],
      responsibility: 'Coordinate infrastructure readiness for the Keycloak application migration.',
      validation:
        'Illustrative checks: issuer and redirect settings, trusted proxy headers, certificates, and login/logout behavior.',
      risk: 'Incorrect hostnames or untrusted forwarded headers can cause broken or unsafe authentication.',
      rollback:
        'Restore the approved identity and routing configuration together; coordinate any identity data changes with its owner.',
    },
    {
      id: 'images',
      title: 'Docker image preparation',
      objective: 'Produce a consistent, identifiable container image for delivery.',
      tools: ['Docker', 'Amazon ECR', 'Jenkins'],
      responsibility:
        'Build container images and publish them to Amazon ECR through delivery pipelines.',
      validation:
        'Check the image reference, startup behavior, runtime configuration, and access to the image registry.',
      risk: 'A mutable or incorrect image reference makes a release hard to reproduce.',
      rollback: 'Retain the previous approved image reference and deployment specification.',
    },
    {
      id: 'deployment',
      title: 'Deployment to AWS',
      objective: 'Deploy application workloads to the selected AWS container platform.',
      tools: ['Amazon EKS / ECS', 'Amazon ECR', 'ALB'],
      responsibility:
        'Support containerized deployments to EKS and ECS; platform choice depends on the workload.',
      validation:
        'Check image retrieval, task or pod readiness, target registration, and application configuration.',
      risk: 'A running container can still be unreachable or unable to serve requests.',
      rollback:
        'Return to the approved workload version and verify target health before restoring traffic.',
    },
    {
      id: 'validation',
      title: 'Environment validation',
      objective:
        'Prove that the target environment meets application and operational acceptance criteria.',
      tools: ['Application checks', 'ALB target health', 'CloudWatch'],
      responsibility:
        'Prepare deployment procedures and coordinate validation across environment owners.',
      validation:
        'Run functional, integration, identity, and connectivity checks; capture evidence for each acceptance gate.',
      risk: 'Infrastructure health alone does not prove the business flow works.',
      rollback:
        'Hold promotion when a gate fails and correct the configuration in the appropriate environment.',
    },
    {
      id: 'cutover',
      title: 'Cutover planning',
      objective: 'Agree on the sequence, owners, go/no-go criteria, and recovery decision.',
      tools: ['Migration runbook', 'Change checklist', 'Routing plan'],
      responsibility:
        'Prepare migration runbooks and coordinate development, network, security, and operations teams.',
      validation:
        'Rehearse the sequence and confirm dependency readiness, approvers, and the handling of stateful changes.',
      risk: 'Unclear ownership or irreversible writes can undermine a rollback.',
      rollback:
        'Define a decision owner and checkpoints; reconcile changed data before any return to the source environment.',
    },
    {
      id: 'smoke',
      title: 'Smoke tests and health checks',
      objective: 'Confirm essential application behavior after the planned change.',
      tools: ['Application smoke tests', 'ALB health checks', 'CloudWatch logs'],
      responsibility:
        'Support cutover procedures and coordinate the application validation handoff.',
      validation:
        'Check application access, key user journeys, identity flows, and target health against agreed expectations.',
      risk: 'A shallow endpoint check can miss authentication or integration failures.',
      rollback:
        'Stop further promotion and follow the agreed recovery decision if essential checks fail.',
    },
    {
      id: 'readiness',
      title: 'Monitoring and rollback readiness',
      objective: 'Make the migrated workload observable and supportable after cutover.',
      tools: ['CloudWatch', 'Dashboards', 'Alarms', 'Operational runbook'],
      responsibility:
        'Implement monitoring and document deployment and migration procedures for operational support.',
      validation:
        'Verify log visibility, relevant alarms, support ownership, and recovery prerequisites.',
      risk: 'A deployment can look healthy while failures remain invisible to the support team.',
      rollback:
        'Maintain the approved recovery path and explicit data-handling criteria through the agreed validation period.',
    },
  ],
  teams: [
    {
      title: 'Development',
      responsibility:
        'Application packaging, dependency confirmation, identity flows, and functional acceptance.',
    },
    {
      title: 'Networking',
      responsibility:
        'Routing, name resolution, connectivity validation, and reviewed traffic changes.',
    },
    {
      title: 'Security',
      responsibility:
        'Access boundaries, IAM, certificate handling, and identity configuration review.',
    },
    {
      title: 'Operations',
      responsibility:
        'Monitoring readiness, support handoff, change coordination, and recovery ownership.',
    },
  ],
  runbook: `# EXAMPLE ONLY — anonymized migration readiness checklist
# No account IDs, private endpoints, credentials, or executable cutover commands.
migration: openliberty-keycloak-example
environment: <approved-environment>
change_owner: <assigned-owner>

before_change:
  - confirm dependency inventory and application acceptance criteria
  - review Terraform plan and selected environment
  - record approved artifact, image, and configuration references
  - confirm identity configuration and integration checks
  - agree recovery checkpoints and stateful-data handling

go_no_go:
  development: <functional-validation-evidence>
  networking: <connectivity-validation-evidence>
  security: <access-and-identity-review>
  operations: <monitoring-and-recovery-readiness>
  approver: <named-decision-owner>

after_change:
  - validate workload readiness and load-balancer target health
  - run application and authentication smoke tests
  - inspect logs, metrics, and alarm coverage
  - record acceptance or invoke the approved recovery decision

recovery:
  trigger: <agreed-failure-criteria>
  previous_release: <approved-image-and-configuration>
  traffic_restore: <reviewed-routing-procedure>
  stateful_data: <owner-approved-reconciliation-plan>`,
  deepDive: {
    challenge:
      'Move enterprise application infrastructure toward AWS while keeping application dependencies, identity integration, and operational acceptance visible throughout the change.',
    responsibilities: [
      'Designed and automated AWS infrastructure with Terraform for OpenLiberty and Keycloak migration.',
      'Supported Jenkins container delivery to Amazon ECR, EKS, and ECS.',
      'Prepared architecture documentation, migration runbooks, and deployment procedures.',
      'Coordinated with development, network, security, and operations teams for environment cutovers.',
    ],
    implementation:
      'The walkthrough connects infrastructure planning, application packaging, AWS deployment, validation, and cutover readiness. The exact legacy platform and customer settings are not supplied, so the diagram and checklist remain conceptual.',
    decision:
      'Repeatable infrastructure and versioned artifacts make environment preparation easier to review. Explicit validation and recovery checkpoints keep the migration decision tied to application behavior rather than resource creation alone.',
    troubleshooting:
      'In an interview scenario, I would separate workload startup, dependency connectivity, load-balancer health, and identity behavior. I would use application logs and monitoring evidence before changing routing or attempting recovery.',
    interview:
      'I designed and automated AWS infrastructure for OpenLiberty and Keycloak migration, then documented how environments would be deployed and validated. I coordinated readiness with the application, networking, security, and operations teams. This interactive example explains the checks I would discuss without publishing customer configuration.',
    questions: [
      'How do you discover application dependencies before a migration?',
      'Why can a healthy container still fail an authentication flow?',
      'What evidence should determine a cutover go/no-go?',
      'How does new application data change the rollback decision?',
    ],
  },
  sources: [
    {
      title: 'AWS cutover planning',
      url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/pre-cutover-stage.html',
    },
    {
      title: 'AWS cutover and rollback',
      url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/cutover-stage.html',
    },
    {
      title: 'Open Liberty container images',
      url: 'https://openliberty.io/docs/latest/container-images.html',
    },
    {
      title: 'Keycloak reverse proxy considerations',
      url: 'https://www.keycloak.org/server/reverseproxy',
    },
  ],
};
