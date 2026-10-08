import { useId, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Blocks,
  Boxes,
  Check,
  Cloud,
  Code2,
  Container,
  GitBranch,
  Github,
  Globe2,
  Network,
  Package,
  ShieldCheck,
  Terminal,
  Users,
  Workflow,
} from 'lucide-react';
import { architecture } from '../content';
import '../styles/architecture.css';

const icons = {
  code: Code2,
  github: Github,
  workflow: Workflow,
  container: Container,
  package: Package,
  boxes: Boxes,
  network: Network,
  users: Users,
  blocks: Blocks,
  activity: Activity,
  shield: ShieldCheck,
  globe: Globe2,
};

const previewNodes = [
  { id: 'github', className: 'arch-node-source' },
  { id: 'terraform', className: 'arch-node-infra' },
  { id: 'docker', className: 'arch-node-image' },
  { id: 'monitoring', className: 'arch-node-monitor' },
  { id: 'runtime', className: 'arch-node-runtime' },
  { id: 'iam', className: 'arch-node-security' },
];

function ServiceIcon({ service, ...props }) {
  const Icon = icons[service.icon] || Cloud;
  return <Icon aria-hidden="true" strokeWidth={1.6} {...props} />;
}

function ArchitecturePreview({ selected, onSelect, panelId }) {
  const allServices = [...architecture.steps, ...architecture.supports];

  return (
    <div className="arch-preview" role="group" aria-label="Interactive cloud architecture preview">
      <div className="arch-preview-scene">
        <div className="arch-preview-grid" aria-hidden="true" />
        <div className="arch-orbit-label" aria-hidden="true">
          <span className="arch-tiny-square" /> CLOUD INFRASTRUCTURE
        </div>
        <svg className="arch-orbit-svg" viewBox="0 0 560 530" fill="none" aria-hidden="true">
          <defs>
            <linearGradient
              id={`${panelId}-orbit`}
              x1="80"
              y1="70"
              x2="490"
              y2="450"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#61E0FF" stopOpacity=".65" />
              <stop offset=".48" stopColor="#4795FF" stopOpacity=".12" />
              <stop offset="1" stopColor="#79A5FF" stopOpacity=".5" />
            </linearGradient>
            <radialGradient id={`${panelId}-glow`}>
              <stop stopColor="#2D8EFF" stopOpacity=".21" />
              <stop offset="1" stopColor="#2D8EFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="280" cy="242" r="212" fill={`url(#${panelId}-glow)`} />
          <ellipse
            cx="280"
            cy="242"
            rx="190"
            ry="178"
            stroke={`url(#${panelId}-orbit)`}
            strokeWidth="1"
          />
          <ellipse
            cx="280"
            cy="242"
            rx="226"
            ry="105"
            transform="rotate(-30 280 242)"
            stroke={`url(#${panelId}-orbit)`}
            strokeWidth="1"
          />
          <ellipse
            cx="280"
            cy="242"
            rx="226"
            ry="105"
            transform="rotate(30 280 242)"
            stroke="#508BDF"
            strokeOpacity=".22"
            strokeWidth="1"
          />
          <circle
            cx="280"
            cy="242"
            r="124"
            stroke="#6AA8FF"
            strokeOpacity=".1"
            strokeDasharray="2 7"
          />
          <path
            d="M280 64V155M121 138L218 207M439 138L342 207M87 307L212 264M473 307L348 264M280 420V328"
            stroke="#74BEFF"
            strokeOpacity=".23"
            strokeDasharray="3 6"
          />
          <g className="arch-orbit-signal" transform="translate(280 242) scale(1 .93684)">
            <g className="arch-signal-orbit">
              <circle cx="190" r="3" fill="#A6F0FF" />
            </g>
          </g>
          <g
            className="arch-orbit-signal"
            transform="translate(280 242) rotate(-30) scale(1 .4646)"
          >
            <g className="arch-signal-orbit arch-signal-orbit-secondary">
              <circle cx="226" r="3.5" fill="#6DABFF" />
            </g>
          </g>
          <g fill="#A6DEFF">
            <circle cx="143" cy="365" r="2" opacity=".8" />
            <circle cx="437" cy="365" r="2" opacity=".6" />
            <circle cx="366" cy="79" r="2" opacity=".7" />
            <circle cx="191" cy="84" r="1.5" opacity=".5" />
          </g>
        </svg>

        <div className="arch-cloud-core" aria-hidden="true">
          <div className="arch-core-ring" />
          <div className="arch-core-disc">
            <Cloud className="arch-cloud-icon" strokeWidth={1.2} />
            <span className="arch-core-brand">
              aws
              <span className="arch-core-smile" />
            </span>
            <span className="arch-core-caption">BUILT TO SCALE</span>
          </div>
        </div>

        {previewNodes.map((node) => {
          const service = allServices.find((item) => item.id === node.id);
          if (!service) return null;
          const isSelected = selected.id === service.id;
          return (
            <button
              key={service.id}
              type="button"
              className={`arch-orbit-node ${node.className} ${isSelected ? 'is-selected' : ''}`}
              aria-label={`Explore ${service.title}`}
              aria-pressed={isSelected}
              aria-controls={panelId}
              onClick={() => onSelect(service)}
            >
              <span className="arch-orbit-node-icon">
                <ServiceIcon service={service} size={22} />
              </span>
              <span>{service.title}</span>
            </button>
          );
        })}
      </div>

      <div className="arch-preview-terminal" id={panelId} aria-live="polite" aria-atomic="true">
        <div className="arch-terminal-bar">
          <span className="arch-terminal-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>architecture.preview</span>
          <Terminal size={12} aria-hidden="true" />
        </div>
        <div className="arch-terminal-body">
          <span className="arch-terminal-command">
            <span aria-hidden="true">{'>'}</span> explore <strong>{selected.title}</strong>
          </span>
          <p>{selected.description}</p>
        </div>
      </div>
      <span className="arch-preview-caption">
        <GitBranch size={12} aria-hidden="true" /> An illustrative delivery architecture
      </span>
    </div>
  );
}

export default function CloudArchitecture({ compact = false }) {
  const panelId = `architecture-${useId().replace(/:/g, '')}`;
  const [selected, setSelected] = useState(
    compact
      ? architecture.steps.find((step) => step.id === 'runtime') || architecture.steps[0]
      : architecture.steps[0],
  );

  if (compact) {
    return <ArchitecturePreview selected={selected} onSelect={setSelected} panelId={panelId} />;
  }

  const selectedStep = architecture.steps.findIndex((step) => step.id === selected.id);

  return (
    <div className="arch-full" role="region" aria-label="Cloud delivery architecture">
      <div className="arch-full-topline">
        <span className="arch-eyebrow">
          <span className="arch-tiny-square" /> DELIVERY PIPELINE
        </span>
        <span className="arch-explore-note">Select a stage to explore</span>
      </div>
      <div className="arch-pipeline" role="group" aria-label="Delivery pipeline stages">
        {architecture.steps.map((step, index) => (
          <div className="arch-stage-wrap" key={step.id}>
            <button
              type="button"
              className={`arch-stage ${selected.id === step.id ? 'is-selected' : ''}`}
              aria-pressed={selected.id === step.id}
              aria-controls={panelId}
              onClick={() => setSelected(step)}
            >
              <span className="arch-stage-top">
                <span className="arch-stage-number">{String(index + 1).padStart(2, '0')}</span>
                <ServiceIcon service={step} size={24} />
              </span>
              <span className="arch-stage-title">{step.title}</span>
              <span className="arch-stage-subtitle">{step.subtitle}</span>
              <span className="arch-stage-selection" aria-hidden="true">
                {selected.id === step.id ? <Check size={11} /> : null}
              </span>
            </button>
            {index < architecture.steps.length - 1 && (
              <span className="arch-stage-arrow" aria-hidden="true">
                <ArrowRight size={15} />
                <ArrowDown size={15} />
                <i className="arch-flow-signal" style={{ animationDelay: `${index * 1.05}s` }} />
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="arch-foundation">
        <span className="arch-foundation-label">THE FOUNDATION</span>
        <div className="arch-supports" role="group" aria-label="Supporting infrastructure services">
          {architecture.supports.map((service) => (
            <button
              key={service.id}
              type="button"
              className={`arch-support ${selected.id === service.id ? 'is-selected' : ''}`}
              aria-pressed={selected.id === service.id}
              aria-controls={panelId}
              onClick={() => setSelected(service)}
            >
              <ServiceIcon service={service} size={17} />
              <span>{service.title}</span>
              <span className="arch-support-subtitle">{service.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="arch-detail"
        id={panelId}
        role="region"
        aria-label="Selected architecture stage"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="arch-detail-icon">
          <ServiceIcon service={selected} size={26} />
        </div>
        <div className="arch-detail-copy">
          <span className="arch-detail-kicker">
            {selectedStep >= 0
              ? `STAGE ${String(selectedStep + 1).padStart(2, '0')}`
              : 'SUPPORTING LAYER'}{' '}
            <span aria-hidden="true">/</span> {selected.subtitle}
          </span>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
        </div>
        <span className="arch-detail-mark" aria-hidden="true">
          <Network size={55} strokeWidth={0.8} />
        </span>
      </div>
    </div>
  );
}
