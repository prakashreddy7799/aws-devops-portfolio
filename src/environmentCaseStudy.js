// Environment practices and diagram values are representative examples, not client inventory.
export const environmentCaseStudy = {
  title: 'AWS Multi-Environment Explorer',
  summary:
    'I owned AWS infrastructure delivery across Dev, IT, UAT, and Production using VPCs, subnets, load balancers, NAT gateways, compute platforms, and security groups. Keeping infrastructure configuration and deployment validation consistent helped teams prepare changes for the right environment.',
  note: 'Representative two-AZ pattern. The selector changes the example validation priorities, not a live AWS environment. It does not imply every illustrated service or topology was deployed in every environment.',
  businessImpact:
    'Environment-aware infrastructure delivery supports controlled promotion, repeatable configuration, and clearer operational ownership. No environment-specific availability, capacity, or cost metric is claimed.',
  environments: [
    {
      id: 'dev',
      label: 'DEV',
      name: 'Development',
      focus: 'Fast feedback with controlled configuration.',
      gate: 'Validate infrastructure syntax and plans, application startup, and developer smoke tests.',
      config:
        'Use development-specific inputs and isolated secrets; keep shared module interfaces consistent.',
    },
    {
      id: 'it',
      label: 'IT',
      name: 'Integration testing',
      focus: 'Prove that application dependencies work together.',
      gate: 'Validate connectivity, service integration, identity flows, and release compatibility.',
      config:
        'Review integration-specific endpoints and permissions without promoting development values.',
    },
    {
      id: 'uat',
      label: 'UAT',
      name: 'User acceptance testing',
      focus: 'Validate business behavior before a production change.',
      gate: 'Capture agreed user journeys, acceptance evidence, and application-owner approval.',
      config:
        'Keep release configuration representative while protecting test data and access boundaries.',
    },
    {
      id: 'production',
      label: 'PRODUCTION',
      name: 'Production',
      focus: 'Reviewed changes with operational readiness.',
      gate: 'Confirm approved configuration, health checks, monitoring, recovery readiness, and change ownership.',
      config:
        'Use production-scoped access and inputs; review the change plan and retain the approved release reference.',
    },
  ],
  resources: [
    {
      id: 'terraform',
      title: 'Terraform',
      icon: 'code',
      purpose: 'Declare infrastructure as code and review resource changes before provisioning.',
      location:
        'Runs from an approved workstation or automation runner; it is not an application traffic hop.',
      security:
        'Use scoped AWS permissions and protect remote state and environment-specific inputs. Never embed credentials in configuration.',
      troubleshooting:
        'Inspect the plan, dependencies, provider configuration, and state before applying a change.',
      responsibility:
        'Automated AWS infrastructure for OpenLiberty and Keycloak migration, reducing provisioning effort by 45% as reported in my resume.',
    },
    {
      id: 'vpc',
      title: 'Amazon VPC',
      icon: 'network',
      purpose: 'Provide the logical network boundary for the example application.',
      location: 'Contains the two Availability Zone subnet groups.',
      security:
        'Define intentional routes and access boundaries; a VPC alone is not an access-control policy.',
      troubleshooting:
        'Check address planning, DNS configuration, subnet associations, and connectivity requirements.',
      responsibility: 'Delivered AWS VPC infrastructure as part of environment preparation.',
    },
    {
      id: 'igw',
      title: 'Internet Gateway',
      icon: 'globe',
      purpose: 'Provide the VPC connection used by internet-facing resources.',
      location: 'Attached to the VPC; referenced by the public subnet route tables.',
      security:
        'A route to this gateway does not automatically make every workload publicly reachable.',
      troubleshooting:
        'Check gateway attachment, public route association, and the resource addressing and security rules.',
      responsibility:
        'Supported the network configuration required for public and private AWS infrastructure.',
    },
    {
      id: 'public',
      title: 'Public Subnet',
      icon: 'route',
      purpose: 'Host the internet-facing entry layer and the illustrated public NAT gateway.',
      location: 'One example public subnet in each Availability Zone.',
      security:
        'Public means its route table has a route to the Internet Gateway; it is not permission to expose application workloads.',
      troubleshooting: 'Check the subnet route table and the allowed listener and outbound paths.',
      responsibility: 'Delivered public and private subnet layouts within the AWS environments.',
    },
    {
      id: 'private',
      title: 'Private Subnet',
      icon: 'shield',
      purpose: 'Place application compute behind controlled access paths.',
      location: 'One example private subnet in each Availability Zone.',
      security:
        'No direct route to the Internet Gateway in this pattern. Application ingress is permitted from the load-balancer security group.',
      troubleshooting:
        'Check load-balancer reachability and the required outbound route or private service endpoint.',
      responsibility: 'Supported segmented networking and workload placement across environments.',
    },
    {
      id: 'routes',
      title: 'Route Tables',
      icon: 'route',
      purpose: 'Choose a destination-specific network path for each subnet.',
      location: 'Associated with the public and private subnets.',
      security:
        'The example public default route uses the Internet Gateway; the private outbound default route uses a NAT gateway.',
      troubleshooting:
        'Inspect the actual subnet association and the most specific matching route before changing rules.',
      responsibility:
        'Supported routing and subnet configuration as part of AWS infrastructure delivery.',
    },
    {
      id: 'nat',
      title: 'NAT Gateway',
      icon: 'network',
      purpose:
        'Allow private workloads to initiate outbound IPv4 internet connections in this example.',
      location: 'An illustrative zonal public NAT gateway in each public subnet.',
      security:
        'It is an outbound path, not an inbound path for application requests. Required service access can also use suitable VPC endpoints.',
      troubleshooting:
        'Check private routes, NAT availability, the public subnet route, and the required destination.',
      responsibility: 'Delivered NAT gateway infrastructure where required by an environment.',
    },
    {
      id: 'alb',
      title: 'Application Load Balancer',
      icon: 'layers',
      purpose: 'Receive application requests and route them toward registered targets.',
      location: 'The illustrated internet-facing ALB spans the two public subnets.',
      security:
        'Restrict listeners and allow only the required application and health-check traffic toward target security groups.',
      troubleshooting:
        'Inspect listener rules, target registration, target health, and security-group reachability.',
      responsibility:
        'Delivered load-balancing infrastructure supporting AWS application environments.',
    },
    {
      id: 'sg',
      title: 'Security Groups',
      icon: 'shield',
      purpose: 'Apply stateful traffic rules to supported resources and interfaces.',
      location: 'Associated with the ALB and application workload resources.',
      security:
        'Permit application ingress from the ALB security group on the required ports rather than opening the workload to the internet.',
      troubleshooting:
        'Check both the ALB outbound path and target inbound rules, including health-check ports.',
      responsibility: 'Supported Security Group configuration and segmented application access.',
    },
    {
      id: 'compute',
      title: 'Application Compute',
      icon: 'server',
      purpose: 'Run the application on the compute platform selected for the workload.',
      location: 'Private application subnets in the representative diagram.',
      security:
        'Use appropriate service roles, controlled workload ingress, and environment-scoped configuration.',
      troubleshooting:
        'Check image or artifact startup, runtime readiness, permissions, and dependency connectivity.',
      responsibility:
        'Delivered EC2 and EKS infrastructure; the broader resume also records ECS container deployments. This example does not assert all platforms in every environment.',
    },
    {
      id: 'health',
      title: 'Health Checks',
      icon: 'activity',
      purpose: 'Evaluate whether registered application targets can handle requests.',
      location: 'Configured on the ALB target groups and evaluated against the workload.',
      security:
        'Allow the health-check path from the ALB and avoid exposing sensitive application information.',
      troubleshooting:
        'Check protocol, port, path, response matching, and readiness. ALB can fail open if all registered targets are unhealthy.',
      responsibility:
        'Supported deployment validation and infrastructure operations; these checks illustrate an engineering validation approach.',
    },
    {
      id: 'cloudwatch',
      title: 'Amazon CloudWatch',
      icon: 'activity',
      purpose: 'Collect operational metrics and logs and support dashboards and alarms.',
      location:
        'Observes infrastructure and application workloads; shown beside the network boundary.',
      security:
        'Control log and metric access and avoid placing credentials or sensitive payloads in logs.',
      troubleshooting:
        'Check log delivery, time ranges, dimensions, and alarm configuration before interpreting missing data.',
      responsibility:
        'Implemented CloudWatch metrics, centralized logs, dashboards, and alarms for infrastructure and applications.',
    },
  ],
  deepDive: {
    challenge:
      'Deliver AWS infrastructure across multiple environments while keeping access, configuration, and validation appropriate to each release stage.',
    responsibilities: [
      'Owned infrastructure delivery across Dev, IT, UAT, and Production.',
      'Worked with VPCs, public and private subnets, ALBs, NAT gateways, EC2, EKS, and Security Groups.',
      'Supported environment-specific infrastructure configuration, deployment procedures, and monitoring readiness.',
    ],
    implementation:
      'The explorer uses a common two-AZ reference pattern to explain network boundaries, application ingress, private workload placement, and outbound connectivity. The selected environment changes the illustrative configuration focus and validation gate; it does not query an AWS account.',
    decision:
      'Shared infrastructure definitions can preserve consistent structure while environment-specific inputs, access, secrets, and approvals keep changes appropriately separated. Private workload placement reduces direct exposure while an ALB provides a defined application entry path.',
    troubleshooting:
      'For a failed request, I would inspect the ALB listener and target health, then workload readiness, security-group rules, and relevant routes. For an outbound failure, I would separately check the private route and NAT or endpoint path instead of treating NAT as inbound application routing.',
    interview:
      'I owned AWS infrastructure delivery across Dev, IT, UAT, and Production. I explain consistency as shared infrastructure patterns with controlled environment inputs and separate validation. I would trace an incoming request from the load balancer to the private application, then inspect health, access, and logs at the failing boundary.',
    questions: [
      'What makes a subnet public or private?',
      'Why is a NAT gateway outside the incoming ALB request path?',
      'How do environment inputs stay separate while Terraform modules remain consistent?',
      'What would you check when an ALB reports unhealthy targets?',
    ],
  },
  sources: [
    {
      title: 'AWS two-AZ private workload example',
      url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-example-private-subnets-nat.html',
    },
    {
      title: 'AWS subnet route tables',
      url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html',
    },
    {
      title: 'AWS NAT gateways',
      url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html',
    },
    {
      title: 'ALB security groups',
      url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html',
    },
    {
      title: 'ALB target health checks',
      url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html',
    },
    {
      title: 'Amazon CloudWatch overview',
      url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
    },
  ],
};
