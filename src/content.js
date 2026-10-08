// Central portfolio content. Professional claims come from the supplied resume.
// Public repositories must be verified before adding a project link.
export const profile = {
  name: 'Chandra Prakash Reddy',
  initials: 'CPR',
  headerRoles: ['Senior DevOps Engineer', 'Cloud Engineer', 'Platform Engineer'],
  title: 'Senior DevOps Engineer | Cloud Engineer | Platform Engineer',
  location: 'Hyderabad, Telangana, India',
  shortLocation: 'Hyderabad, India',
  experience: '6+ years',
  availability: 'Open to DevOps, Cloud & Platform Engineering opportunities',
  heroHeadline: 'Engineering Reliable Cloud Infrastructure at Scale.',
  heroLines: ['Engineering Reliable', 'Cloud Infrastructure', 'at Scale.'],
  heroLine: 'Automating infrastructure. Accelerating delivery. Improving reliability.',
  heroIntro:
    '6+ years of experience designing AWS infrastructure, automating CI/CD pipelines, orchestrating containerized applications, and supporting enterprise cloud migrations.',
  roles: [
    'DevOps Engineer',
    'Senior DevOps Engineer',
    'DevSecOps Engineer',
    'Site Reliability Engineer (SRE)',
    'Cloud/DevOps Engineer',
    'Platform Engineer',
  ],
  intro:
    'AWS DevOps Engineer with 6+ years of experience designing, automating, migrating, and supporting cloud infrastructure across banking, telecom, retail, and publishing.',
  about:
    'I specialize in AWS, Terraform, Jenkins, GitHub Actions, Docker, Kubernetes, EKS/ECS and production operations. I build reusable infrastructure, CI/CD automation, observability and resilient cloud platforms. My experience spans enterprise application migrations and multi-environment cloud delivery.',
  email: 'dodlaprakashreddy@gmail.com',
  photo: '/portrait.jpg',
  linkedin: 'https://www.linkedin.com/in/chandra-prakash-reddy-921260218/',
  resume: '/resume.pdf',
};
export const navigation = [
  'Home',
  'About',
  'Skills',
  'Experience',
  'Projects',
  'DevOps Playground',
  'Resume',
  'Contact',
];
export const sectionCopy = {
  about: {
    eyebrow: '01 / THE ENGINEERING MINDSET',
    title: 'Building Reliable Infrastructure.',
    accent: 'Automating Everything Possible.',
    description:
      'Reliable infrastructure starts with thoughtful engineering: repeatable delivery, clear visibility, and systems that teams can operate with confidence.',
  },
  skills: {
    eyebrow: '02 / TECHNICAL CAPABILITIES',
    title: 'A connected toolkit.',
    accent: 'End-to-end capability.',
    description:
      'From the first Terraform module to a healthy production deployment. The tools I use to bring infrastructure, delivery, and operations together.',
  },
  architecture: {
    eyebrow: '03 / FROM COMMIT TO CLOUD',
    title: 'One change.',
    accent: 'An entire ecosystem.',
    description:
      'Explore a representative delivery flow: versioned code becomes a containerized application, supported by infrastructure as code, observability, and cloud security.',
  },
  experience: {
    eyebrow: '04 / PROFESSIONAL EXPERIENCE',
    title: 'The work behind',
    accent: 'the systems.',
    description:
      'Banking, telecom, retail, and publishing. A closer look at the engagements that shaped my approach to cloud engineering.',
    employer: 'OTSI',
    employerRole: 'AWS DevOps Engineer',
    employerPeriod: 'Oct 2022 – Present',
    overlapNote:
      'FiberZ ISP and Bank of Maharashtra engagements overlapped, as recorded in my resume.',
    learningEyebrow: 'CONTINUOUS LEARNING',
    learningTitle: 'The next milestone.',
    learningDescription: 'Professional development in progress.',
    projectsLabel: 'Selected engineering outcomes',
    currentLabel: 'Current',
  },
  projects: {
    eyebrow: '05 / SELECTED ENGINEERING',
    title: 'Built for the',
    accent: 'real world.',
    description:
      'Selected professional case studies in infrastructure automation, application delivery, and cloud operations. Each outcome is tied to its engagement.',
    note: 'Professional work summarized from my resume. Diagrams are conceptual; client source code and private infrastructure details are not shared.',
    detailsLabel: 'Explore the case study',
    challengeLabel: 'Engineering challenge',
    solutionLabel: 'The approach',
    impactLabel: 'Recorded outcome',
    flowLabel: 'CONCEPTUAL FLOW',
  },
  resume: {
    eyebrow: '06 / THE FULL PICTURE',
    title: 'Experience, on paper.',
    description:
      'A closer look at my professional experience, technical skills, and selected cloud engineering outcomes.',
  },
  contact: {
    eyebrow: '07 / WHAT COMES NEXT',
    title: "Let's Engineer Something",
    accent: 'Reliable.',
    description:
      'Open to opportunities across DevOps, cloud, security, and reliability engineering.',
    platformScope:
      'Platform Engineer roles focused on DevOps, Kubernetes, and cloud infrastructure.',
  },
};
export const principles = [
  {
    number: '01',
    title: 'Automate the repeatable.',
    description:
      'Make infrastructure and deployments predictable, maintainable, and version controlled.',
  },
  {
    number: '02',
    title: 'Design for resilience.',
    description:
      'Build observable systems with practical security controls and recoverable operations.',
  },
  {
    number: '03',
    title: 'Deliver continuously.',
    description:
      'Connect software changes to reliable releases through useful, repeatable CI/CD workflows.',
  },
];
export const metrics = [
  {
    value: '6+',
    label: 'Years of experience',
    context: 'Across cloud infrastructure, delivery automation, and production operations.',
    source: 'Professional summary in supplied resume',
  },
  {
    value: '45%',
    label: 'Less provisioning effort',
    context: 'Terraform infrastructure automation for the US Bank cloud migration engagement.',
    source: 'US Bank engagement in supplied resume',
  },
  {
    value: '35%',
    label: 'Faster incident recovery',
    context: 'Reduced mean time to recovery through observability improvements at US Bank.',
    source: 'US Bank engagement in supplied resume',
  },
  {
    value: '18%',
    label: 'Lower AWS spend',
    context: 'Monthly AWS cost reduction during the Kalamandir engagement.',
    source: 'Kalamandir engagement in supplied resume',
  },
];
export const skillGroups = [
  {
    title: 'Cloud Infrastructure',
    icon: 'cloud',
    description: 'Compute, storage, and scalable cloud services.',
    items: ['AWS', 'EC2', 'S3', 'RDS', 'ALB', 'Route 53', 'CloudFront', 'Auto Scaling'],
  },
  {
    title: 'Infrastructure as Code',
    icon: 'blocks',
    description: 'Repeatable environments, defined in code.',
    items: ['Terraform', 'Reusable Terraform Modules', 'Ansible', 'VPC Modules'],
  },
  {
    title: 'CI/CD Automation',
    icon: 'workflow',
    description: 'From source control to reliable releases.',
    items: ['Jenkins', 'GitHub Actions', 'Git', 'Maven', 'SonarQube', 'Release Automation'],
  },
  {
    title: 'Containers & Kubernetes',
    icon: 'containers',
    description: 'Build, package, and orchestrate applications.',
    items: ['Docker', 'Kubernetes', 'EKS', 'ECS', 'ECR', 'Helm'],
  },
  {
    title: 'Monitoring & Observability',
    icon: 'activity',
    description: 'Visibility into health, incidents, and cost.',
    items: ['CloudWatch', 'Prometheus', 'Grafana', 'Cost Explorer', 'AWS Budgets'],
  },
  {
    title: 'Security & Networking',
    icon: 'shield',
    description: 'Practical controls for connected infrastructure.',
    items: ['IAM', 'VPC', 'Security Groups', 'VPNs', 'Firewalls', 'NAT Gateway'],
  },
  {
    title: 'Linux & Automation',
    icon: 'terminal',
    description: 'Automation across everyday operations.',
    items: ['Python', 'Bash', 'Shell scripting', 'Linux', 'Windows', 'Cron', 'Rsync'],
  },
];
// Conceptual architecture, not a diagram of a private client system.
export const architecture = {
  label: 'A representative AWS delivery workflow',
  title: 'From commit to cloud',
  description: 'Illustrative architecture based on the cloud delivery technologies in my toolkit.',
  steps: [
    {
      id: 'developer',
      title: 'Developer',
      subtitle: 'Code',
      description: 'Application and infrastructure changes begin as versioned code.',
      icon: 'code',
    },
    {
      id: 'github',
      title: 'GitHub',
      subtitle: 'Source',
      description: 'Git repositories track changes and connect source code to automated delivery.',
      icon: 'github',
    },
    {
      id: 'pipeline',
      title: 'CI/CD Pipeline',
      subtitle: 'Build + test',
      description:
        'Jenkins or GitHub Actions automate build, validation, and deployment workflows.',
      icon: 'workflow',
    },
    {
      id: 'docker',
      title: 'Docker',
      subtitle: 'Image',
      description: 'Container images package applications and runtime dependencies consistently.',
      icon: 'container',
    },
    {
      id: 'ecr',
      title: 'Amazon ECR',
      subtitle: 'Registry',
      description: 'Amazon ECR stores container images for deployment into AWS environments.',
      icon: 'package',
    },
    {
      id: 'runtime',
      title: 'Amazon EKS / ECS',
      subtitle: 'Orchestrate',
      description:
        'EKS or ECS runs containerized workloads; the appropriate runtime depends on the application.',
      icon: 'boxes',
    },
    {
      id: 'alb',
      title: 'Load Balancer',
      subtitle: 'Route',
      description: 'An Application Load Balancer routes application traffic to healthy targets.',
      icon: 'network',
    },
    {
      id: 'users',
      title: 'End Users',
      subtitle: 'Experience',
      description: 'Application delivery reaches the people who depend on the service.',
      icon: 'users',
    },
  ],
  supports: [
    {
      id: 'terraform',
      title: 'Terraform',
      subtitle: 'Provision',
      description:
        'Versioned infrastructure definitions make AWS environment provisioning repeatable.',
      icon: 'blocks',
    },
    {
      id: 'monitoring',
      title: 'CloudWatch',
      subtitle: 'Observe',
      description: 'Metrics, logs, and alerts support application and infrastructure operations.',
      icon: 'activity',
    },
    {
      id: 'iam',
      title: 'IAM',
      subtitle: 'Authorize',
      description: 'IAM roles and policies control access to AWS services and resources.',
      icon: 'shield',
    },
    {
      id: 'vpc',
      title: 'VPC',
      subtitle: 'Connect',
      description: 'Subnets, routing, and security controls define the cloud network boundaries.',
      icon: 'globe',
    },
  ],
};
// Resume-based professional case studies. Never substitute sample repositories for client source.
export const projects = [
  {
    number: '01',
    category: 'AWS / MIGRATION',
    title: 'Enterprise Application Cloud Migration',
    description:
      'Terraform-driven AWS infrastructure for OpenLiberty and Keycloak application migration, with container delivery and observability across environments.',
    stack: ['Terraform', 'AWS VPC', 'EKS', 'ECS', 'CloudWatch'],
    type: 'Professional case study',
    engagement: 'US Bank',
    link: '',
    challenge:
      'Support enterprise application migration with consistent infrastructure, segmented networking, and container deployment across multiple environments.',
    solution:
      'Automated AWS provisioning with Terraform and connected Jenkins container pipelines to Amazon ECR, EKS, and ECS. Improved operational visibility with monitoring.',
    impact: '45% less infrastructure provisioning effort; 35% reduction in mean time to recovery.',
    highlight: '45%',
    highlightLabel: 'less provisioning effort',
    diagram: [
      { label: 'Terraform', icon: 'blocks' },
      { label: 'AWS VPC', icon: 'network' },
      { label: 'EKS / ECS', icon: 'containers' },
    ],
  },
  {
    number: '02',
    category: 'CI/CD / TELECOM',
    title: 'BSS Deployment Automation',
    description:
      'Jenkins pipelines and infrastructure automation for telecom Business Support System applications, supported by service monitoring.',
    stack: ['Jenkins', 'Terraform', 'Ansible', 'Linux', 'Prometheus', 'Grafana'],
    type: 'Professional case study',
    engagement: 'FiberZ ISP',
    link: '',
    challenge:
      'Reduce manual deployment work for BSS applications and improve visibility into application issues.',
    solution:
      'Designed Jenkins delivery workflows with Terraform and Ansible automation. Used Prometheus and Grafana for monitoring.',
    impact: '50% less manual deployment effort; 30% improvement in issue detection time.',
    highlight: '50%',
    highlightLabel: 'less manual deployment effort',
    diagram: [
      { label: 'Jenkins', icon: 'workflow' },
      { label: 'Ansible', icon: 'terminal' },
      { label: 'BSS Apps', icon: 'server' },
    ],
  },
  {
    number: '03',
    category: 'RELEASES / BANKING',
    title: 'Hybrid Release Automation',
    description:
      'A Jenkins release workflow bridging Windows and Linux to package WAR/ZIP artifacts and deliver releases through secure file transfer.',
    stack: ['Jenkins', 'Linux', 'Windows', 'SFTP', 'Shell'],
    type: 'Professional case study',
    engagement: 'Bank of Maharashtra',
    link: '',
    challenge:
      'Coordinate application packaging, secure release delivery, and operational tasks across a hybrid Windows and Linux environment.',
    solution:
      'Built Jenkins automation for WAR/ZIP artifacts and SFTP delivery, supported by shell scripts and Cron/Rsync backup workflows.',
    impact: '35% fewer manual release steps; 40% reduction in operational effort.',
    highlight: '35%',
    highlightLabel: 'fewer manual release steps',
    diagram: [
      { label: 'Jenkins', icon: 'workflow' },
      { label: 'WAR / ZIP', icon: 'package' },
      { label: 'SFTP', icon: 'shield' },
    ],
  },
  {
    number: '04',
    category: 'AWS / OPTIMIZATION',
    title: 'Cloud Infrastructure Optimization',
    description:
      'Infrastructure automation, delivery workflows, and cost visibility for AWS environments during the Kalamandir engagement.',
    stack: ['AWS', 'Terraform', 'GitHub Actions', 'CloudWatch', 'Cost Explorer'],
    type: 'Professional case study',
    engagement: 'Kalamandir',
    link: '',
    challenge:
      'Operate AWS environments with repeatable delivery, useful monitoring, and visibility into monthly cloud spend.',
    solution:
      'Managed AWS infrastructure with Terraform, automated delivery with GitHub Actions, and used Cost Explorer and AWS Budgets to identify cost optimization opportunities.',
    impact: '18% reduction in monthly AWS spend.',
    highlight: '18%',
    highlightLabel: 'lower monthly AWS spend',
    diagram: [
      { label: 'Terraform', icon: 'blocks' },
      { label: 'AWS', icon: 'cloud' },
      { label: 'Cost Explorer', icon: 'activity' },
    ],
  },
];
export const experience = [
  {
    role: 'AWS DevOps Engineer — US Bank',
    organization: 'OTSI | Client engagement',
    client: 'US Bank',
    period: 'Jul 2025 – Present',
    details:
      'Terraform-driven AWS infrastructure and OpenLiberty/Keycloak migration; Jenkins container pipelines to Amazon ECR, EKS and ECS; observability improvements that reduced MTTR by 35%.',
    responsibilities: [
      'Automated AWS infrastructure with Terraform for OpenLiberty and Keycloak application migration.',
      'Supported segmented networking, multi-environment container deployments, and Jenkins pipelines for ECR, EKS, and ECS.',
      'Improved observability and reduced mean time to recovery by 35%; reduced provisioning effort by 45%.',
    ],
    stack: ['Terraform', 'Jenkins', 'ECR', 'EKS', 'ECS', 'CloudWatch'],
    current: true,
  },
  {
    role: 'AWS DevOps Engineer — FiberZ ISP',
    organization: 'OTSI | Client engagement',
    client: 'FiberZ ISP',
    period: 'Jul 2024 – Jul 2025',
    details:
      'BSS CI/CD automation with Jenkins, Terraform and Ansible; Prometheus/Grafana monitoring. Delivered concurrently with Bank of Maharashtra work.',
    responsibilities: [
      'Designed Jenkins pipelines for telecom BSS applications with Terraform and Ansible automation.',
      'Reduced manual deployment effort by 50%.',
      'Implemented Prometheus and Grafana monitoring, improving issue detection time by 30%.',
    ],
    stack: ['Jenkins', 'Terraform', 'Ansible', 'Linux', 'Prometheus', 'Grafana'],
    concurrent: true,
  },
  {
    role: 'AWS DevOps Engineer — Bank of Maharashtra',
    organization: 'OTSI | Client engagement',
    client: 'Bank of Maharashtra',
    period: 'Aug 2024 – Jul 2025',
    details:
      'Hybrid Windows/Linux release pipeline, secure file transfer, Cron and Rsync backups, shell automation and on-premises connectivity support.',
    responsibilities: [
      'Built a Jenkins workflow across Windows and Linux for WAR/ZIP packaging and SFTP release delivery.',
      'Automated backup and operational workflows with Cron, Rsync, and shell scripts.',
      'Reduced manual release steps by 35% and operational effort by 40%.',
    ],
    stack: ['Jenkins', 'Linux', 'Windows', 'SFTP', 'Shell', 'Rsync'],
    concurrent: true,
  },
  {
    role: 'AWS DevOps Engineer — Kalamandir',
    organization: 'OTSI | Client engagement',
    client: 'Kalamandir',
    period: 'Oct 2022 – Jul 2024',
    details:
      'Terraform-managed AWS environments, GitHub Actions automation, Docker/ECS/Kubernetes deployments, security controls and cost optimization.',
    responsibilities: [
      'Managed AWS environments with Terraform and automated delivery with GitHub Actions.',
      'Supported Docker, ECS, and Kubernetes deployments with cloud monitoring and security controls.',
      'Used Cost Explorer and AWS Budgets to reduce monthly AWS spend by 18%.',
    ],
    stack: ['AWS', 'Terraform', 'GitHub Actions', 'Docker', 'ECS', 'Kubernetes'],
  },
  {
    role: 'DevOps Engineer — Oxford University Press',
    organization: 'Earlier client experience',
    client: 'Oxford University Press',
    period: 'Jun 2021 – Dec 2021',
    details:
      'AWS provisioning, Jenkins/Maven/SonarQube pipelines, Python onboarding automation, Kubernetes and reusable Terraform VPC modules.',
    responsibilities: [
      'Supported AWS provisioning and Jenkins, Maven, and SonarQube delivery pipelines.',
      'Built Python onboarding automation that reduced setup time by 60%.',
      'Worked with Kubernetes and reusable Terraform VPC modules.',
    ],
    stack: ['AWS', 'Jenkins', 'Maven', 'SonarQube', 'Python', 'Terraform'],
    earlier: true,
  },
];
// A learning roadmap only; this is not an awarded certification.
export const certificationPlan = [
  { title: 'AWS Certified DevOps Engineer – Professional', state: 'In preparation' },
];
