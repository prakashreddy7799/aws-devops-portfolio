import { useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Cloud,
  Code2,
  Globe,
  Layers,
  Maximize,
  Network,
  Pause,
  Play,
  RotateCcw,
  Route,
  Server,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { environmentCaseStudy as data } from '../environmentCaseStudy';
import { CaseStudyShell, InterviewDeepDive } from './EngineeringCaseStudy';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import '../styles/environment-case-study.css';

const icons = {
  network: Network,
  code: Code2,
  globe: Globe,
  layers: Layers,
  route: Route,
  shield: ShieldCheck,
  server: Server,
  activity: Activity,
};

export default function EnvironmentCaseStudy() {
  const [environment, setEnvironment] = useState('dev');
  const [selected, setSelected] = useState('vpc');
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null);
  const { stopMotion } = useMotionPreferences();
  const current = data.environments.find((item) => item.id === environment);
  const compute = data.resources.find((item) => item.id === 'compute');
  const runtimeDetails = {
    ec2: {
      ...compute,
      title: 'Amazon EC2',
      purpose:
        'Virtual machines provide compute capacity. EC2 can host applications or supply capacity for EKS or ECS.',
    },
    eks: {
      ...compute,
      title: 'Amazon EKS',
      purpose:
        'Managed Kubernetes control planes orchestrate workloads on suitable compute capacity.',
    },
    ecs: {
      ...compute,
      title: 'Amazon ECS',
      purpose:
        'Task definitions describe containers; ECS services maintain desired running tasks and integrate with suitable load-balancer targets.',
    },
    ecr: {
      title: 'Amazon ECR',
      purpose: 'A container registry stores versioned application images for deployment.',
      location:
        'An AWS service outside the subnet boundary, reached through approved service connectivity.',
      security:
        'Use narrowly scoped push and pull permissions and review the approved image reference.',
      troubleshooting:
        'Check authentication, IAM permissions, image references, and registry connectivity.',
      responsibility:
        'Published Docker images to ECR through Jenkins delivery pipelines as recorded in my resume.',
    },
  };
  const service =
    runtimeDetails[selected] ||
    data.resources.find((item) => item.id === selected) ||
    data.resources[0];
  const fit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const reset = () => {
    fit();
    setSelected('vpc');
    setPlaying(false);
  };
  const node = (id, label) => {
    const resource = data.resources.find((item) => item.id === id);
    const Icon = icons[resource?.icon] || Network;
    return (
      <button
        type="button"
        className={`env-node ${selected === id ? 'is-selected' : ''}`}
        onClick={() => setSelected(id)}
        aria-pressed={selected === id}
        aria-controls="environment-resource-detail"
      >
        <Icon size={17} aria-hidden="true" />
        {label || resource?.title}
      </button>
    );
  };
  return (
    <CaseStudyShell
      id="environment-case-study"
      kicker="02 / INFRASTRUCTURE ACROSS ENVIRONMENTS"
      title={data.title}
      summary={data.summary}
    >
      <div className="env-controls" role="group" aria-label="Environment selector">
        {data.environments.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={environment === item.id}
            onClick={() => setEnvironment(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="env-context" key={environment}>
        <h4>{current.name}</h4>
        <p>{current.focus}</p>
        <dl>
          <div>
            <dt>Configuration</dt>
            <dd>{current.config}</dd>
          </div>
          <div>
            <dt>Deployment validation</dt>
            <dd>{current.gate}</dd>
          </div>
        </dl>
      </div>
      <p className="env-note">{data.note}</p>
      <div className="env-toolbar" role="group" aria-label="Architecture diagram controls">
        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(1.6, value + 0.15))}
          aria-label="Zoom in architecture"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))}
          aria-label="Zoom out architecture"
        >
          <ZoomOut size={16} />
        </button>
        <button type="button" onClick={fit}>
          <Maximize size={16} />
          Fit to View
        </button>
        <button type="button" onClick={reset}>
          <RotateCcw size={16} />
          Reset Diagram
        </button>
        <button type="button" onClick={() => setPlaying((value) => !value)}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? 'Pause Traffic' : 'Play Request Flow'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            requestAnimationFrame(() => setPlaying(true));
          }}
        >
          Replay Flow
        </button>
      </div>
      <p className="env-pan-hint">
        Drag with a mouse to pan, or focus the canvas and use arrow keys. Fit to View restores the
        diagram.{' '}
        {stopMotion
          ? 'Motion is disabled; arrows show the request path.'
          : 'Packets illustrate requests, not live traffic.'}
      </p>
      <div
        className="env-viewport"
        tabIndex={0}
        role="group"
        aria-label="AWS architecture canvas"
        onKeyDown={(event) => {
          const delta = {
            ArrowLeft: [-25, 0],
            ArrowRight: [25, 0],
            ArrowUp: [0, -25],
            ArrowDown: [0, 25],
          }[event.key];
          if (delta && event.target === event.currentTarget) {
            event.preventDefault();
            setPan((value) => ({ x: value.x + delta[0], y: value.y + delta[1] }));
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' || event.target.closest('button')) return;
          drag.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current)
            setPan({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className={`env-map ${playing && !stopMotion ? 'is-flowing' : ''}`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <p className="env-note" aria-live="polite">
            {current.label} / representative multi-AZ architecture
          </p>
          <div className="env-provisioning-path">
            {node('terraform')}
            <ArrowDown size={17} aria-hidden="true" />
            <span>Provisions the infrastructure · separate from request traffic</span>
          </div>
          <div className="env-map-top">
            {node('vpc')}
            {node('igw')}
            {node('alb')}
          </div>
          <div className="env-request-path">
            <span>HTTPS request → ALB → private application targets</span>
            <i aria-hidden="true" />
            <ArrowDown size={17} aria-hidden="true" />
          </div>
          <div className="env-zones">
            {['A', 'B'].map((zone) => (
              <div className="env-zone" key={zone}>
                <h5>
                  Availability Zone {zone} <span>CONCEPTUAL</span>
                </h5>
                <div className="env-public">
                  <span>PUBLIC ENTRY / OUTBOUND NAT</span>
                  {node('public', `Public Subnet ${zone}`)}
                  {node('nat')}
                  <p>Public route → Internet Gateway</p>
                </div>
                <div className="env-ingress-arrow">
                  <ArrowDown size={18} aria-hidden="true" />
                  <span>ALB → application targets</span>
                </div>
                <div className="env-private">
                  <span>PRIVATE APPLICATION ZONE</span>
                  {node('private', `Private Subnet ${zone}`)}
                  <div className="env-compute">
                    {['EC2', 'EKS', 'ECS'].map((runtime) => (
                      <button
                        type="button"
                        key={runtime}
                        onClick={() => setSelected(runtime.toLowerCase())}
                        aria-label={`Inspect ${runtime} compute`}
                        aria-pressed={selected === runtime.toLowerCase()}
                        aria-controls="environment-resource-detail"
                      >
                        {runtime}
                      </button>
                    ))}
                  </div>
                  <p>Runtime alternatives; not all are required.</p>
                  {node('sg')}
                  {node('health')}
                </div>
              </div>
            ))}
          </div>
          <div className="env-map-bottom">
            {node('routes')}
            {node('cloudwatch')}
            <button
              type="button"
              className={`env-node ${selected === 'ecr' ? 'is-selected' : ''}`}
              onClick={() => setSelected('ecr')}
              aria-pressed={selected === 'ecr'}
              aria-controls="environment-resource-detail"
            >
              <Cloud size={17} aria-hidden="true" />
              Amazon ECR · image source
            </button>
          </div>
          <p className="env-egress">
            Outbound path: private workload → zonal NAT Gateway → Internet Gateway. NAT does not
            receive incoming application requests.
          </p>
        </div>
      </div>
      <section
        className="env-detail"
        id="environment-resource-detail"
        aria-label="AWS resource information"
      >
        <h4 aria-live="polite">{service.title}</h4>
        <dl>
          {[
            ['Service purpose', service.purpose],
            ['Architecture placement', service.location],
            ['Security considerations', service.security],
            ['Troubleshooting scenarios', service.troubleshooting],
            ['My engineering responsibilities', service.responsibility],
          ].map(([title, value]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="env-business-impact">
        <ShieldCheck size={18} aria-hidden="true" />
        {data.businessImpact}
      </p>
      <InterviewDeepDive {...data.deepDive} />
    </CaseStudyShell>
  );
}
