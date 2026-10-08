// Resume achievement and illustrative teaching material are intentionally separate.
export const jenkinsCaseStudy = {
  kicker: '02 / CONTINUOUS DELIVERY',
  title: 'From a commit to a confident release.',
  summary:
    'Built Jenkins CI/CD pipelines to compile OpenLiberty applications, create Docker images, publish to Amazon ECR, and deploy containerized workloads to Amazon EKS and ECS. Repeatable delivery connected application packaging with deployment and operational checks; this example explains the workflow without exposing client configuration.',
  simulation:
    'LOCAL SIMULATION — no connection to Jenkins or AWS. All console output, health checks, failures, and recovery actions are sample data.',
  stages: [
    {
      id: 'git',
      title: 'Git Repository',
      short: 'Source',
      icon: 'git',
      description:
        'Check out a reviewed application revision. Trace the release back to its source commit rather than building an untracked local copy.',
      log: '[SCM] Checked out sample revision demo-a1b2c3.',
    },
    {
      id: 'jenkins',
      title: 'Jenkins Pipeline',
      short: 'Orchestrate',
      icon: 'workflow',
      description:
        'A versioned Jenkinsfile coordinates build, test, image publication, and deployment. A build agent provides the required tools; deployment permissions are scoped to the target.',
      log: '[Pipeline] Allocated sample build agent. Jenkinsfile loaded.',
    },
    {
      id: 'maven',
      title: 'Maven Build',
      short: 'Compile',
      icon: 'code',
      description:
        'Maven compiles Java sources using the project POM. Packaging follows successful validation and tests; a production pipeline should preserve the resulting artifact and reports.',
      log: '[Maven] compile completed for the sample OpenLiberty application.',
    },
    {
      id: 'tests',
      title: 'Automated Testing',
      short: 'Validate',
      icon: 'check',
      description:
        'Run the project’s configured tests before publishing an image. A failed test exits the pipeline; publishing a test report does not by itself make a failing build safe to deploy.',
      log: '[Tests] Sample test suite passed. Reports retained for review.',
    },
    {
      id: 'docker',
      title: 'Docker Image Build',
      short: 'Package',
      icon: 'container',
      description:
        'Package the verified application artifact with its OpenLiberty runtime configuration. Use a distinct release tag, and promote a verified image digest when available.',
      log: '[Docker] Built sample application image tagged demo-a1b2c3.',
    },
    {
      id: 'ecr',
      title: 'Amazon ECR',
      short: 'Publish',
      icon: 'package',
      description:
        'Authenticate to a private ECR registry, tag the image for its repository, and push it. Registry authentication and repository permissions are separate from runtime permissions.',
      log: '[ECR] Sample image publication accepted. Digest recorded (demo).',
    },
    {
      id: 'deploy',
      title: 'Amazon EKS / ECS',
      short: 'Deploy',
      icon: 'cloud',
      description:
        'Deploy the verified image through the selected runtime’s deployment model. EKS changes a Kubernetes workload; ECS updates a service to a task-definition revision.',
      log: '[Deploy] Submitted sample deployment to the selected runtime.',
    },
    {
      id: 'health',
      title: 'Application Health Checks',
      short: 'Observe',
      icon: 'activity',
      description:
        'Check workload readiness, rollout progress, and application behavior. Container startup alone does not prove the application can serve requests correctly.',
      log: '[Health] Sample readiness and application checks passed.',
    },
    {
      id: 'complete',
      title: 'Deployment Complete',
      short: 'Release',
      icon: 'flag',
      description:
        'Record the source revision, image reference, deployment result, and validation evidence. Keep the previous known-good revision available for an approved rollback.',
      log: '[Release] Sample deployment validated. Release evidence retained.',
    },
  ],
  targets: {
    EKS: {
      title: 'Kubernetes deployment on Amazon EKS',
      description:
        'Update the container image in a Kubernetes Deployment and watch rollout status. Readiness probes decide whether Pods are ready to receive traffic; an application smoke test remains a separate validation.',
      deploymentLog: '[EKS] Sample Deployment image updated; watching rollout status.',
      healthLog: '[EKS] Sample Pods Ready. Application smoke test passed.',
      failureLog:
        '[EKS] Sample Pod readiness failed: configured application port does not match the listener.',
      recovery:
        'Review the Pod events, readiness probe, and container listener. Restore the previous verified Deployment revision or correct the configuration through a reviewed release.',
    },
    ECS: {
      title: 'Service deployment on Amazon ECS',
      description:
        'Register a task-definition revision that references the verified image, then update the ECS service. Service stability, container health, and any configured load-balancer target health contribute to deployment validation.',
      deploymentLog: '[ECS] Sample service updated to a new task-definition revision.',
      healthLog: '[ECS] Sample service stable. Application smoke test passed.',
      failureLog:
        '[ECS] Sample target failed health checks: configured application port does not match the listener.',
      recovery:
        'Inspect stopped-task reasons, container logs, and target-group health. Restore the previous verified task-definition revision or publish a reviewed correction. An ECS rolling-deployment circuit breaker can roll back only when configured and a previous completed deployment is available.',
    },
  },
  recovery: [
    {
      title: 'Inspect the failed health check',
      action:
        'Compare the application listener, container port, and readiness or target-health configuration.',
      observation:
        'Demo finding: the sample health check is using a different port from the application listener. This is an illustrative cause, not a production incident record.',
    },
    {
      title: 'Restore a verified revision',
      action:
        'Choose the previous known-good image and deployment configuration, or review a corrected port mapping before a new release.',
      observation:
        'Demo action: restore the previous verified configuration. No deployment command is executed by this portfolio.',
    },
    {
      title: 'Validate recovery',
      action:
        'Confirm runtime readiness, application health, and a representative smoke test before declaring recovery.',
      observation:
        'Demo result: health checks pass and the sample application is serving requests. Real recovery requires evidence and an authorized release process.',
    },
  ],
  explanations: [
    {
      title: 'Maven',
      description:
        'Maven’s default lifecycle includes compile, test, package, and verify. Invoking a later phase runs earlier phases in order. The example separates compile from verify to make the teaching stages visible; verify can include integration checks when the project configures them.',
      url: 'https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html',
    },
    {
      title: 'Docker',
      description:
        'A Dockerfile turns a packaged application and its runtime configuration into an image. Keep secrets out of build layers, use a reviewed base-image version or digest, and verify the runtime user and exposed application ports.',
      url: 'https://docs.docker.com/build/building/best-practices/',
    },
    {
      title: 'Amazon ECR',
      description:
        'ECR stores versioned container images in a private registry. Use authorized registry login and repository access, retain the image digest, and apply the image-scanning and retention controls selected for the environment.',
      url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html',
    },
    {
      title: 'Amazon EKS',
      description:
        'EKS runs a managed Kubernetes control plane. Kubernetes Deployments manage rolling updates of replicated Pods; workload access, image-pull permissions, scheduling, probes, and rollout validation still require deliberate configuration.',
      url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    },
    {
      title: 'Amazon ECS',
      description:
        'An ECS service maintains the desired task count and deploys task-definition revisions. For the rolling deployment type, the optional deployment circuit breaker can detect failed deployments and, when configured, attempt rollback to a previously completed deployment.',
      url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html',
    },
  ],
  deepDive: {
    challenge:
      'Connect OpenLiberty application compilation, image publication, and EKS/ECS delivery through a repeatable Jenkins workflow while maintaining visibility into failed builds and unhealthy deployments.',
    responsibilities: [
      'Built Jenkins CI/CD pipelines for application compilation and container delivery.',
      'Created Docker images and published application artifacts to Amazon ECR.',
      'Connected container deployment workflows to Amazon EKS and ECS.',
      'Supported deployment validation and operational troubleshooting. The sample rollback design shown here is illustrative.',
    ],
    implementation:
      'The workflow starts with a source revision, compiles and tests the Maven application, builds a Docker image, pushes it to ECR, and updates the selected runtime. Runtime rollout status and application checks provide separate release evidence. The browser simulation performs none of these external operations.',
    decision:
      'Versioned pipeline definitions make delivery reviewable. An image registry separates building an application from deploying it. EKS and ECS remain alternative deployment targets with different operational models; this diagram does not imply both serve every release.',
    troubleshooting:
      'Identify the failing stage first. For build errors, inspect compiler and test output. For image-pull errors, check image references and permissions. For unhealthy rollouts, inspect readiness, container logs, runtime events, and listener or target-group configuration before choosing correction or rollback.',
    interview:
      'I built Jenkins pipelines that took OpenLiberty application code through compilation, container image creation, ECR publication, and deployment to EKS or ECS. I would walk through the artifact and permissions at each boundary, explain how I validated the selected runtime, and describe how I isolated failures. The business value was repeatable application delivery; I would not attach the separate FiberZ 50% deployment-effort metric to this migration work.',
    questions: [
      'How do you ensure the image deployed is the image that passed validation?',
      'How do Kubernetes Deployment updates differ from ECS service deployments?',
      'What would you inspect when a container starts but fails application health checks?',
      'How would you protect Jenkins deployment credentials and prevent concurrent conflicting releases?',
      'What evidence would justify rollback rather than a forward correction?',
    ],
  },
};

export const sampleJenkinsfile = `// Sanitized teaching example; not client source or a ready-to-run job.
// Requires reviewed project files, configured tools, and scoped agent IAM.
pipeline {
  agent { label 'reviewed-container-build-agent' }
  options { skipDefaultCheckout(true); disableConcurrentBuilds() }
  parameters { choice(name: 'TARGET', choices: ['EKS', 'ECS']) }
  environment {
    // Configure these through reviewed Jenkins job settings, not secrets in Git.
    APP_NAME = 'sample-openliberty-app'
  }
  stages {
    stage('Source') { steps { checkout scm } }
    stage('Compile') { steps { sh 'mvn -B clean compile' } }
    stage('Test and package') {
      steps { sh 'mvn -B verify' }
      post { always { junit allowEmptyResults: false,
        testResults: '**/target/surefire-reports/*.xml' } }
    }
    stage('Build image') {
      steps {
        sh '''
          set -eu
          : "\${ECR_REGISTRY:?Configure the reviewed registry}"
          : "\${ECR_REPOSITORY:?Configure the reviewed repository}"
          git rev-parse HEAD > .release-revision
          docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY:$(cat .release-revision)" .
        '''
      }
    }
    stage('Publish image') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          : "\${AWS_REGION:?Configure the reviewed region}"
          aws ecr get-login-password --region "$AWS_REGION" |
            docker login --username AWS --password-stdin "$ECR_REGISTRY"
          docker push "$ECR_REGISTRY/$ECR_REPOSITORY:$(cat .release-revision)"
        '''
      }
    }
    stage('Deploy and validate') {
      steps {
        // Deliberate handoff: scripts are environment-specific and reviewed.
        // EKS: set image, watch rollout, verify probes and smoke tests.
        // ECS: register task definition, update service, verify health.
        sh './ci/deploy-reviewed.sh "$TARGET" "$(cat .release-revision)"'
        sh './ci/verify-reviewed.sh "$TARGET"'
      }
    }
  }
  post { always { archiveArtifacts artifacts: '.release-revision',
    allowEmptyArchive: true } }
}`;

export const sampleDockerfile = `# Sanitized example: requires a packaged WAR and reviewed server.xml.
# Resolve and pin a supported OpenLiberty image digest before real use.
FROM icr.io/appcafe/open-liberty:full-java17-openj9-ubi

COPY --chown=1001:0 src/main/liberty/config/server.xml /config/
COPY --chown=1001:0 target/sample-app.war /config/apps/

# Configure server.xml to load the WAR and enable only required features.
# Build helpers supplied by the OpenLiberty image prepare the server.
RUN features.sh && configure.sh
USER 1001
EXPOSE 9080
# Deployment health checks must match the configured listener and app path.
# Provide secrets at runtime; never bake credentials into this image.`;
