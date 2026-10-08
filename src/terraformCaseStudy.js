// Achievement: supplied resume. Architecture/security choices: illustrative examples.
// Documentation links support the technical explanations, not the resume outcome.
export const terraformCaseStudy = {
  eyebrow: 'FEATURED CASE STUDY / INFRASTRUCTURE AS CODE',
  title: 'From manual provisioning to repeatable infrastructure.',
  intro:
    'Designed and automated AWS infrastructure with Terraform for an enterprise OpenLiberty and Keycloak migration, reducing infrastructure provisioning effort by 45%. Explore the engineering concepts behind that work.',
  simulationNote:
    'Interactive architecture example based on my experience. Network topology, service choices, and security controls are illustrative; confidential client configuration is not shown.',
  buildNote:
    'This build simulation illustrates provisioning stages. Terraform uses resource references to build a dependency graph and can create independent resources in parallel. User requests follow a different path: load balancer → application runtime. Public and private subnets are separate network zones, not sequential traffic hops.',
  nodes: [
    {
      id: 'terraform',
      title: 'Terraform',
      subtitle: 'Define & provision',
      icon: 'blocks',
      what: 'Infrastructure definitions describe the AWS resources and their relationships. Terraform plans changes before applying them.',
      why: 'Versioned definitions make provisioning repeatable across environments and reduce repetitive manual setup.',
      security:
        'Illustrative controls: review plans, limit deployment permissions, and protect state access. Credentials and secrets stay out of committed configuration.',
      docs: 'https://developer.hashicorp.com/terraform/tutorials/configuration-language/dependencies',
      docsLabel: 'Terraform resource dependencies',
    },
    {
      id: 'vpc',
      title: 'Amazon VPC',
      subtitle: 'Network boundary',
      icon: 'network',
      what: 'A dedicated virtual network contains the example public and private subnets.',
      why: 'An explicit network boundary organizes addresses, routing, and application connectivity.',
      security:
        'Illustrative controls: choose non-overlapping addresses and review routes, security groups, and network access rules.',
      docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html',
      docsLabel: 'AWS VPC subnet concepts',
    },
    {
      id: 'public-subnets',
      title: 'Public Subnets',
      subtitle: 'Controlled entry',
      icon: 'globe',
      what: 'Example subnets in two Availability Zones have a route to an internet gateway.',
      why: 'They provide network placement for an internet-facing Application Load Balancer.',
      security:
        'A public route does not grant unrestricted access. Resource addressing and security-group rules still govern reachability.',
      docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html',
      docsLabel: 'Public and private subnet routing',
    },
    {
      id: 'private-subnets',
      title: 'Private Subnets',
      subtitle: 'Application zone',
      icon: 'shield',
      what: 'Application subnets have no direct route to an internet gateway.',
      why: 'Workloads can receive approved application traffic without direct public exposure.',
      security:
        'Illustrative controls: restrict inbound traffic to required sources. This networking snippet provides no internet egress; NAT or service endpoints require separate design.',
      docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html',
      docsLabel: 'AWS subnet routing and security',
    },
    {
      id: 'alb',
      title: 'Application Load Balancer',
      subtitle: 'Route requests',
      icon: 'route',
      what: 'An illustrative internet-facing ALB accepts application requests and forwards them to registered, healthy targets.',
      why: 'A shared entry point separates client access from application workload placement.',
      security:
        'Illustrative controls: use HTTPS, restrict listener access, and allow target application and health-check ports from the load balancer security group.',
      docs: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html',
      docsLabel: 'ALB and target security groups',
    },
    {
      id: 'runtime',
      title: 'EKS / ECS / EC2',
      subtitle: 'Runtime options',
      icon: 'server',
      what: 'EKS provides Kubernetes orchestration, ECS provides container orchestration, and EC2 provides virtual compute. EC2 can also supply capacity for EKS or ECS.',
      why: 'Choose a runtime that fits the application and operating model. These are conceptual options; the diagram does not claim every option was deployed for this migration.',
      security:
        'Illustrative controls: restrict workload access, use narrowly scoped IAM roles, and maintain runtime updates. Kubernetes deployments also need appropriate cluster access and workload policies.',
      docs: 'https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html',
      docsLabel: 'EKS control plane and compute',
    },
    {
      id: 'applications',
      title: 'OpenLiberty & Keycloak',
      subtitle: 'Migration workloads',
      icon: 'boxes',
      what: 'The application layer represents the enterprise OpenLiberty and Keycloak migration recorded in my resume.',
      why: 'Repeatable infrastructure supports consistent application environments and makes the migration foundation easier to provision.',
      security:
        'Illustrative controls: protect administrative and management endpoints, secure application secrets, and configure TLS and trusted proxy headers for the chosen deployment.',
      docs: 'https://www.keycloak.org/server/reverseproxy',
      docsLabel: 'Keycloak reverse proxy security',
    },
  ],
  responsibilities: [
    {
      title: 'Terraform automation',
      description:
        'Designed and automated AWS infrastructure with Terraform, reducing infrastructure provisioning effort by 45%.',
    },
    {
      title: 'Networking',
      description: 'Supported segmented AWS networking for the enterprise application migration.',
    },
    {
      title: 'Security considerations',
      description:
        'Network boundaries and controlled access guide the illustrative design. Exact client security policies are not shared.',
    },
    {
      title: 'Environment provisioning',
      description:
        'Supported Terraform-driven infrastructure provisioning across multiple environments.',
    },
    {
      title: 'Application migration',
      description: 'Supported the enterprise OpenLiberty and Keycloak migration to AWS.',
    },
  ],
  codeTitle: 'A small, repeatable network foundation.',
  codeNote:
    'Sanitized networking example with arbitrary sample addresses: one VPC, public and private subnets in two example Availability Zones, an internet gateway, and explicit route-table associations. It omits the ALB, runtime, IAM, security groups, egress, application configuration, and production state setup. This is a teaching excerpt, not the complete architecture or client source code.',
  terraformExample: `# Illustrative networking only; no credentials or client configuration.
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0, < 7.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  subnets = {
    public_a  = { az = "us-east-1a", index = 0, public = true }
    public_b  = { az = "us-east-1b", index = 1, public = true }
    private_a = { az = "us-east-1a", index = 16, public = false }
    private_b = { az = "us-east-1b", index = 17, public = false }
  }
}

resource "aws_vpc" "example" {
  cidr_block           = "10.0.0.0/16" # Arbitrary example range.
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = { Name = "portfolio-example" }
}

resource "aws_subnet" "example" {
  for_each                = local.subnets
  vpc_id                  = aws_vpc.example.id
  availability_zone       = each.value.az
  cidr_block              = cidrsubnet(aws_vpc.example.cidr_block, 8, each.value.index)
  map_public_ip_on_launch = false
  tags                    = { Name = each.key }
}

resource "aws_internet_gateway" "example" {
  vpc_id = aws_vpc.example.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.example.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.example.id
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.example.id
  # Only the automatic local VPC route; no internet egress.
}

resource "aws_route_table_association" "example" {
  for_each       = local.subnets
  subnet_id      = aws_subnet.example[each.key].id
  route_table_id = each.value.public ? aws_route_table.public.id : aws_route_table.private.id
}`,
};
