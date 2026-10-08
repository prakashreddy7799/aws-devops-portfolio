// Professional achievement: supplied resume. Every dashboard sample and incident below is fictional.
export const observabilityCaseStudy = {
  kicker: 'PROJECT 03 / OBSERVABILITY & OPERATIONS',
  title: 'Signals into answers. Incidents into recovery.',
  summary:
    'Implemented CloudWatch metrics, centralized logs, dashboards, and alarms for infrastructure and application workloads, reducing MTTR by 35%. Bringing these signals together helped teams investigate issues and restore service. Explore an educational incident below.',
  impact: {
    value: '35%',
    label: 'reported MTTR reduction',
    context:
      'Outcome from the resume. The fictional dashboard below does not represent the measurement period or evidence for this achievement.',
  },
  demoNote:
    'DEMO DATA · Deterministic local samples and fictional logs. No real incident, measurement period, customer system, or AWS connection is represented.',
  stages: [
    {
      id: 'healthy',
      title: 'Healthy baseline',
      description:
        'The sample application is serving normally. Start an incident or explore the dashboard tabs.',
    },
    {
      id: 'errors',
      title: 'Errors rising',
      description:
        'Synthetic request failures and latency increase. The first breaching sample alone does not satisfy the example alarm evaluation.',
    },
    {
      id: 'alarm',
      title: 'Alarm triggered',
      description:
        'The example error-rate alarm changes from OK to ALARM after two of three breaching demo samples.',
    },
    {
      id: 'clue',
      title: 'Log clue available',
      description:
        'Fictional application logs suggest connection-pool exhaustion. Investigate to correlate the clue with other signals.',
    },
    {
      id: 'investigated',
      title: 'Investigation complete',
      description:
        'Demo configuration history shows a lower connection-pool limit. The evidence supports this fictional cause; real investigations require independent validation.',
    },
    {
      id: 'recovering',
      title: 'Corrective action',
      description:
        'The demo restores its previous connection-pool configuration and validates readiness, latency, and error signals.',
    },
    {
      id: 'recovered',
      title: 'Service recovered',
      description:
        'The sample application is healthy and alarms are OK. Document the investigation and review the alert and configuration safeguards.',
    },
  ],
  metrics: [
    {
      id: 'cpu',
      title: 'CPU utilization',
      unit: '%',
      max: 100,
      source: 'Example EC2 CPUUtilization',
      healthy: [29, 32, 30, 34, 31, 33, 35, 32, 36, 34, 33, 35],
      incident: [29, 32, 30, 34, 31, 42, 51, 63, 72, 76, 73, 78],
      recovered: [72, 76, 73, 78, 67, 54, 42, 36, 34, 35, 32, 33],
    },
    {
      id: 'memory',
      title: 'Memory utilization',
      unit: '%',
      max: 100,
      source: 'Agent / Container Insights / custom metric',
      healthy: [47, 48, 48, 49, 48, 50, 49, 50, 49, 48, 50, 49],
      incident: [47, 48, 48, 49, 48, 50, 52, 51, 53, 52, 54, 53],
      recovered: [52, 54, 53, 53, 52, 51, 50, 49, 50, 49, 49, 48],
    },
    {
      id: 'requests',
      title: 'Request count',
      unit: '',
      max: 1200,
      source: 'Example ALB RequestCount · per demo interval',
      healthy: [820, 850, 830, 870, 860, 880, 850, 890, 875, 860, 870, 880],
      incident: [820, 850, 830, 870, 860, 880, 875, 890, 885, 875, 890, 880],
      recovered: [875, 890, 880, 885, 890, 880, 895, 885, 890, 880, 890, 885],
    },
    {
      id: 'latency',
      title: 'Response latency',
      unit: 'ms',
      max: 1500,
      source: 'Example ALB TargetResponseTime · p95 in ms',
      healthy: [110, 120, 118, 130, 123, 125, 140, 128, 135, 122, 130, 125],
      incident: [110, 120, 118, 130, 123, 250, 390, 650, 880, 1020, 1180, 1250],
      recovered: [1020, 1180, 1250, 850, 620, 390, 250, 180, 145, 135, 128, 125],
    },
    {
      id: 'errors',
      title: 'Application error rate',
      unit: '%',
      max: 20,
      source: 'Example 100 × target 5XX / request count',
      healthy: [0.1, 0.2, 0.1, 0.3, 0.2, 0.2, 0.1, 0.2, 0.3, 0.2, 0.1, 0.2],
      incident: [0.1, 0.2, 0.1, 0.3, 0.2, 1.2, 3.4, 6.2, 9.5, 12.8, 14.2, 16.4],
      recovered: [12.8, 14.2, 16.4, 10.2, 6.4, 3.2, 1.4, 0.7, 0.4, 0.3, 0.2, 0.2],
    },
    {
      id: 'health',
      title: 'Healthy containers',
      unit: '/4',
      max: 4,
      source: 'Illustrative application readiness signal',
      healthy: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      incident: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2, 2, 2],
      recovered: [2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4],
    },
  ],
  logs: [
    {
      step: 0,
      offset: 'S00',
      level: 'INFO',
      message: 'demo-service: readiness healthy; requests served normally.',
    },
    {
      step: 1,
      offset: 'S01',
      level: 'WARN',
      message: 'demo-service: upstream response time increased; retry count rising.',
    },
    {
      step: 1,
      offset: 'S02',
      level: 'ERROR',
      message: 'demo-service: request failed while waiting for an available connection.',
    },
    {
      step: 2,
      offset: 'S03',
      level: 'WARN',
      message: 'demo-alarm: error-rate entered ALARM; two of three samples exceed 5%.',
    },
    {
      step: 3,
      offset: 'S04',
      level: 'ERROR',
      message: 'demo-service: connection pool exhausted; acquisition timeout; active=4, limit=4.',
    },
    {
      step: 3,
      offset: 'S05',
      level: 'WARN',
      message:
        'demo-service: request concurrency=16; inspect connection-pool configuration history.',
    },
    {
      step: 4,
      offset: 'S06',
      level: 'INFO',
      message: 'demo-investigation: CPU elevated, memory steady, request volume broadly stable.',
    },
    {
      step: 4,
      offset: 'S07',
      level: 'INFO',
      message:
        'demo-investigation: sample configuration comparison found pool limit changed from 16 to 4.',
    },
    {
      step: 5,
      offset: 'S08',
      level: 'WARN',
      message:
        'demo-recovery: restore prior configuration; validate readiness and application requests.',
    },
    {
      step: 6,
      offset: 'S09',
      level: 'INFO',
      message: 'demo-recovery: readiness 4/4; errors and latency back within demo thresholds.',
    },
    {
      step: 6,
      offset: 'S10',
      level: 'INFO',
      message: 'demo-alarm: returned to OK after synthetic healthy evaluation samples.',
    },
  ],
  observations: [
    {
      title: 'Establish impact',
      description:
        'The demo shows higher errors and p95 latency, with only two of four containers ready. Scope the affected service before choosing a corrective action.',
    },
    {
      title: 'Correlate signals',
      description:
        'Request volume stays broadly stable and memory changes little. The connection-pool timeout is a useful lead; no single metric proves the cause.',
    },
    {
      title: 'Compare recent changes',
      description:
        'The fictional configuration history reduces the pool limit from 16 to 4. Validate the change against concurrency and dependency capacity.',
    },
    {
      title: 'Restore and verify',
      description:
        'Restore the previous demo configuration, check readiness and application requests, then confirm that error and latency samples recover.',
    },
  ],
  metricNote:
    'EC2 CPU metrics are available through CloudWatch. Memory utilization needs additional collection, such as the CloudWatch agent, Container Insights for supported container workloads, or custom metrics. The container-health card is an illustrative readiness signal, not a claim that running containers are automatically healthy.',
  alarmNote:
    'Example thresholds and evaluation windows are chosen for this demo. Real CloudWatch alarms evaluate a metric or expression across configured periods and can be OK, ALARM, or INSUFFICIENT_DATA. Missing telemetry requires separate handling.',
  challenge:
    'Infrastructure metrics and application logs need to be easy to correlate during an incident. An alert identifies symptoms; operators still need context to determine impact, test a cause, and verify recovery.',
  responsibilities: [
    'Implemented CloudWatch metrics for infrastructure and application workloads.',
    'Centralized application and infrastructure logs for investigation.',
    'Built dashboards and alarms to improve operational visibility.',
    'Supported incident investigation and recovery; the resume reports a 35% reduction in MTTR.',
  ],
  implementation:
    'Connected infrastructure and application signals through CloudWatch metrics, centralized logs, dashboards, and alarms. The local walkthrough demonstrates correlation using invented CPU, memory, traffic, latency, error, and readiness samples; it does not reproduce a client dashboard or incident.',
  decision:
    'Combine user-facing symptoms, such as errors and latency, with resource metrics and logs. Choose metric dimensions, statistics, thresholds, evaluation windows, and missing-data handling for the workload. Collection for memory and container readiness must be configured explicitly.',
  troubleshooting:
    'Confirm impact and telemetry freshness, correlate signals, inspect application errors, compare recent changes, and test a hypothesis. Use an approved corrective action or rollback, validate both readiness and user requests, and review alert coverage after recovery. The connection-pool scenario here is fictional.',
  interview:
    'I implemented CloudWatch metrics, centralized logs, dashboards, and alarms so infrastructure and application signals were available together during operations. That work reduced MTTR by 35%, as reported in my resume. I would explain the actual monitoring scope and recovery process separately from this fictional connection-pool example.',
  questions: [
    'How would you collect memory metrics for EC2 and container workloads?',
    'How do you choose alarm thresholds and handle missing data?',
    'How would you distinguish a load increase from a connection-pool bottleneck?',
    'What proves that a recovery is complete beyond a green health check?',
    'How was the reported MTTR improvement measured, and what were its limits?',
  ],
  query: `# Illustrative CloudWatch Logs Insights QL; fields assume JSON application logs.
fields @timestamp, level, message
| filter level in ["ERROR", "WARN"]
| filter message like /connection|timeout/
| sort @timestamp desc
| limit 50`,
  docs: [
    {
      title: 'EC2 metrics',
      url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html',
    },
    {
      title: 'Memory collection',
      url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html',
    },
    {
      title: 'CloudWatch alarms',
      url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html',
    },
    {
      title: 'Logs Insights',
      url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html',
    },
  ],
};
