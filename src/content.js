// Portfolio content personalized from the supplied October 2026 resume.
// Review every public claim and link before publishing.
export const profile = {
  name: 'Chandra Prakash Reddy',
  initials: 'CPR',
  title: 'AWS DevOps Engineer | Terraform | EKS/ECS | CI/CD | Cloud Migration',
  location: 'Hyderabad, Telangana, India',
  experience: '6+ years',
  availability: 'Open to AWS DevOps & Cloud Engineering opportunities',
  heroLine: 'Automating infrastructure. Accelerating delivery. Improving reliability.',
  intro: 'AWS DevOps Engineer with 6+ years of experience designing, automating, migrating, and supporting cloud infrastructure across banking, telecom, retail, and publishing.',
  about: 'I specialize in AWS, Terraform, Jenkins, GitHub Actions, Docker, Kubernetes, EKS/ECS and production operations. I build reusable infrastructure, CI/CD automation, observability and resilient cloud platforms. My experience spans enterprise application migrations and multi-environment cloud delivery.',
  email: 'dodlaprakashreddy@gmail.com',
  github: 'https://github.com/prakashreddy7799',
  linkedin: 'https://www.linkedin.com/in/chandra-prakash-reddy-921260218/',
  resume: '/resume.pdf',
};

export const metrics = [
  { value: '6+', label: 'Years of experience' },
  { value: '45%', label: 'Less provisioning effort' },
  { value: '35%', label: 'Faster incident recovery' },
  { value: '18%', label: 'Lower AWS spend' },
];

export const skillGroups = [
  { title: 'AWS Cloud & Networking', icon: 'cloud', items: ['EC2', 'VPC', 'EKS', 'ECS', 'ECR', 'S3', 'RDS', 'IAM', 'ALB', 'Route 53', 'CloudFront', 'Auto Scaling', 'NAT Gateway'] },
  { title: 'Infrastructure & Configuration', icon: 'blocks', items: ['Terraform', 'Reusable Terraform Modules', 'Ansible', 'Git', 'Shell scripting', 'Python', 'VPC Modules'] },
  { title: 'Containers & CI/CD', icon: 'workflow', items: ['Docker', 'Kubernetes', 'Helm', 'Jenkins', 'GitHub Actions', 'Maven', 'SonarQube', 'Release Automation'] },
  { title: 'Observability & Security', icon: 'shield', items: ['CloudWatch', 'Prometheus', 'Grafana', 'IAM', 'Security Groups', 'VPNs', 'Firewalls', 'Cost Explorer', 'AWS Budgets'] },
];

// These are summarized work examples from the supplied resume, not links to private client source code.
export const projects = [
  { number: '01', category: 'AWS · MIGRATION', title: 'Enterprise Application Cloud Migration', description: 'Automated AWS infrastructure using Terraform for OpenLiberty and Keycloak application migration. Supported segmented networking, EKS/ECS deployments, and monitoring across multiple environments; reduced provisioning effort by 45%.', stack: ['Terraform', 'AWS VPC', 'EKS', 'ECS', 'CloudWatch'], type: 'Professional case study', link: '' },
  { number: '02', category: 'CI/CD · TELECOM', title: 'BSS Deployment Automation', description: 'Designed Jenkins pipelines for telecom Business Support System applications and automated delivery workflows, reducing manual deployment effort by 50%.', stack: ['Jenkins', 'Terraform', 'Ansible', 'Linux'], type: 'Professional case study', link: '' },
  { number: '03', category: 'RELEASES · BANKING', title: 'Hybrid Release Automation', description: 'Built a Jenkins workflow across Windows and Linux to package WAR/ZIP artifacts and deliver releases by SFTP, reducing manual release steps by 35%.', stack: ['Jenkins', 'Linux', 'Windows', 'SFTP', 'Shell'], type: 'Professional case study', link: '' },
  { number: '04', category: 'AWS · COST', title: 'Cloud Infrastructure Optimization', description: 'Implemented AWS infrastructure automation and monitoring, then used Cost Explorer and AWS Budgets to identify optimization opportunities that reduced monthly AWS spend by 18%.', stack: ['AWS', 'Terraform', 'CloudWatch', 'Cost Explorer'], type: 'Professional case study', link: '' },
];

export const experience = [
  { role: 'AWS DevOps Engineer — US Bank', organization: 'OTSI | Client engagement', period: 'Jul 2025 – Present', details: 'Terraform-driven AWS infrastructure and OpenLiberty/Keycloak migration; Jenkins container pipelines to Amazon ECR, EKS and ECS; observability improvements that reduced MTTR by 35%.' },
  { role: 'AWS DevOps Engineer — FiberZ ISP', organization: 'OTSI | Client engagement', period: 'Jul 2024 – Jul 2025', details: 'BSS CI/CD automation with Jenkins, Terraform and Ansible; Prometheus/Grafana monitoring. Delivered concurrently with Bank of Maharashtra work.' },
  { role: 'AWS DevOps Engineer — Bank of Maharashtra', organization: 'OTSI | Client engagement', period: 'Aug 2024 – Jul 2025', details: 'Hybrid Windows/Linux release pipeline, secure file transfer, Cron and Rsync backups, shell automation and on-premises connectivity support.' },
  { role: 'AWS DevOps Engineer — Kalamandir', organization: 'OTSI | Client engagement', period: 'Oct 2022 – Jul 2024', details: 'Terraform-managed AWS environments, GitHub Actions automation, Docker/ECS/Kubernetes deployments, security controls and cost optimization.' },
  { role: 'DevOps Engineer — Oxford University Press', organization: 'Earlier client experience', period: 'Jun 2021 – Dec 2021', details: 'AWS provisioning, Jenkins/Maven/SonarQube pipelines, Python onboarding automation, Kubernetes and reusable Terraform VPC modules.' },
];

export const certificationPlan = [
  { title: 'AWS Certified DevOps Engineer – Professional', state: 'In preparation' },
];
