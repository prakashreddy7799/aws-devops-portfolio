import { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Boxes,
  Check,
  CheckCheck,
  ChevronDown,
  Code2,
  Copy,
  Globe2,
  Layers3,
  Network,
  Pause,
  Play,
  RotateCcw,
  Route,
  Server,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { terraformCaseStudy } from '../terraformCaseStudy';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import '../styles/terraform-case-study.css';

const iconMap = {
  blocks: Blocks,
  network: Network,
  globe: Globe2,
  shield: ShieldCheck,
  route: Route,
  server: Server,
  boxes: Boxes,
};

function HighlightedCode({ code }) {
  return code.split('\n').map((line, index) => (
    <span className="tf-code-line" key={index}>
      {line
        .split(
          /("(?:[^"\\]|\\.)*"|#[^\n]*|\b(?:resource|variable|module|output|locals|provider|terraform|data|true|false)\b|\b\d+\b)/g,
        )
        .map((token, part) => {
          let className = '';
          if (token.startsWith('#')) className = 'tf-token-comment';
          else if (token.startsWith('"')) className = 'tf-token-string';
          else if (/^(resource|variable|module|output|locals|provider|terraform|data)$/.test(token))
            className = 'tf-token-keyword';
          else if (/^(true|false|\d+)$/.test(token)) className = 'tf-token-value';
          return (
            <span className={className} key={part}>
              {token}
            </span>
          );
        })}
      {index < code.split('\n').length - 1 ? '\n' : ''}
    </span>
  ));
}

export default function TerraformCaseStudy({ project }) {
  const data = terraformCaseStudy;
  const { reduced, paused, stopMotion } = useMotionPreferences();
  const id = useId().replace(/:/g, '');
  const detailId = `tf-explanation-${id}`;
  const [build, setBuild] = useState({ count: 1, mode: 'idle' });
  const [selectedId, setSelectedId] = useState(data.nodes[0].id);
  const [copyStatus, setCopyStatus] = useState('idle');
  const manualCode = useRef(null);
  const code = data.terraformExample.trim();
  const selected = data.nodes.find((node) => node.id === selectedId) || data.nodes[0];
  const SelectedIcon = iconMap[selected.icon] || Blocks;
  const complete = build.count === data.nodes.length;
  const playing = build.mode === 'running' && !stopMotion;

  useEffect(() => {
    if (build.mode !== 'running' || stopMotion || build.count >= data.nodes.length)
      return undefined;
    const timer = window.setTimeout(() => {
      setBuild((current) => {
        if (current.mode !== 'running') return current;
        const nextCount = Math.min(current.count + 1, data.nodes.length);
        return { count: nextCount, mode: nextCount === data.nodes.length ? 'complete' : 'running' };
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [build.count, build.mode, stopMotion, data.nodes.length]);

  useEffect(() => {
    if (copyStatus === 'failed') {
      manualCode.current?.focus();
      manualCode.current?.select();
    }
  }, [copyStatus]);

  function controlBuild() {
    if (complete) return;
    if (reduced) {
      setBuild({ count: data.nodes.length, mode: 'complete' });
      return;
    }
    if (paused) {
      setBuild((current) => {
        const nextCount = Math.min(current.count + 1, data.nodes.length);
        return { count: nextCount, mode: nextCount === data.nodes.length ? 'complete' : 'paused' };
      });
      return;
    }
    setBuild((current) => ({
      ...current,
      mode: current.mode === 'running' ? 'paused' : 'running',
    }));
  }

  function resetBuild() {
    setBuild({ count: 1, mode: 'idle' });
    setSelectedId(data.nodes[0].id);
  }

  async function copyCode() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  const actionLabel = complete
    ? 'Build Complete'
    : reduced
      ? 'Play Infrastructure Build'
      : paused
        ? 'Reveal Next Step'
        : build.mode === 'running'
          ? 'Pause Build'
          : build.mode === 'paused'
            ? 'Resume Build'
            : 'Play Infrastructure Build';
  const statusText = complete
    ? `Simulation complete. All ${data.nodes.length} stages available.${reduced ? ' Shown instantly for reduced motion.' : ''}`
    : playing
      ? `Building simulation. ${build.count} of ${data.nodes.length} stages available.`
      : paused && build.mode !== 'idle'
        ? `Simulation paused by page motion preference. ${build.count} of ${data.nodes.length} stages available.`
        : build.mode === 'paused'
          ? `Simulation paused. ${build.count} of ${data.nodes.length} stages available.`
          : `Ready to explore. ${build.count} of ${data.nodes.length} stages available.`;

  return (
    <article
      id="terraform-case-study"
      className="tf-case-study"
      aria-label="Terraform infrastructure case study"
    >
      <div className="tf-project-meta">
        <span>{data.eyebrow}</span>
        <span>
          {project.category} <span aria-hidden="true">/</span> {project.number}
        </span>
      </div>
      <div className="tf-project-heading">
        <div>
          <p className="tf-project-kind">
            {project.type}
            <span aria-hidden="true"> / </span>
            {project.engagement}
          </p>
          <h3>{project.title}</h3>
          <p className="tf-project-description">{project.description}</p>
          <div
            className="tf-project-stack"
            role="group"
            aria-label={`Technologies for ${project.title}`}
          >
            {project.stack.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
        <div className="tf-outcome">
          <span className="tf-outcome-eyebrow">RECORDED OUTCOME</span>
          <strong>{project.highlight}</strong>
          <span>{project.highlightLabel}</span>
          <ArrowUpRight size={23} aria-hidden="true" />
        </div>
      </div>

      <div className="tf-build-workspace">
        <div className="tf-workspace-heading">
          <div>
            <span className="tf-eyebrow">
              <Layers3 size={14} aria-hidden="true" /> THE INFRASTRUCTURE, EXPLAINED
            </span>
            <h4>{data.title}</h4>
          </div>
          <span className="tf-simulation-badge">
            <span aria-hidden="true" /> EDUCATIONAL SIMULATION
          </span>
        </div>
        <p className="tf-simulation-note">Simulation — no connection to production AWS.</p>
        <p className="tf-simulation-context">{data.simulationNote}</p>

        <div className="tf-build-toolbar">
          <div className="tf-build-controls">
            <button
              type="button"
              className="tf-play-button"
              onClick={controlBuild}
              disabled={complete}
            >
              {complete ? (
                <CheckCheck size={15} aria-hidden="true" />
              ) : playing ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {actionLabel}
            </button>
            <button
              type="button"
              className="tf-reset-button"
              onClick={resetBuild}
              aria-label="Reset Build"
            >
              <RotateCcw size={15} aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
          <div
            className="tf-build-progress"
            role="status"
            aria-label="Infrastructure build status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              className={`tf-build-indicator ${playing ? 'is-playing' : ''}`}
              aria-hidden="true"
            />
            <span>{statusText}</span>
          </div>
        </div>

        <div
          className={`tf-diagram-board ${playing ? 'is-building' : ''}`}
          role="group"
          aria-label="Terraform infrastructure stages"
        >
          <svg
            className="tf-diagram-connections"
            viewBox="0 0 1000 348"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id={`tf-arrow-${id}`}
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0 0L5 2.5L0 5" fill="#6BA9CF" />
              </marker>
            </defs>
            <path
              className={build.count >= 2 ? 'is-revealed' : ''}
              d="M195 174H218"
              markerEnd={`url(#tf-arrow-${id})`}
            />
            <path
              className={build.count >= 3 ? 'is-revealed' : ''}
              d="M305 132V66H412"
              markerEnd={`url(#tf-arrow-${id})`}
            />
            <path
              className={build.count >= 4 ? 'is-revealed' : ''}
              d="M305 216V282H412"
              markerEnd={`url(#tf-arrow-${id})`}
            />
            <path
              className={build.count >= 5 ? 'is-revealed' : ''}
              d="M586 66H608"
              markerEnd={`url(#tf-arrow-${id})`}
            />
            <path
              className={build.count >= 6 ? 'is-revealed' : ''}
              d="M586 282H608"
              markerEnd={`url(#tf-arrow-${id})`}
            />
            <path
              className={`tf-request-route ${build.count >= 6 ? 'is-revealed' : ''}`}
              d="M695 108V238"
              markerEnd={`url(#tf-arrow-${id})`}
            />
            <path
              className={build.count >= 7 ? 'is-revealed' : ''}
              d="M780 282H799V174H802"
              markerEnd={`url(#tf-arrow-${id})`}
            />
          </svg>
          <span className="tf-request-label" aria-hidden="true">
            APPLICATION TRAFFIC
            <ArrowDown size={12} />
          </span>
          {data.nodes.map((node, index) => {
            const Icon = iconMap[node.icon] || Blocks;
            const available = index < build.count;
            return (
              <button
                type="button"
                key={node.id}
                className={`tf-infra-node tf-node-${node.id} ${available ? 'is-available' : ''} ${selected.id === node.id ? 'is-selected' : ''}`}
                disabled={!available}
                onClick={() => setSelectedId(node.id)}
                aria-label={`Inspect ${node.title}`}
                aria-pressed={selected.id === node.id}
                aria-controls={detailId}
              >
                <span className="tf-node-top">
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span>
                    {available ? (
                      <Check size={11} aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                </span>
                <strong>{node.title}</strong>
                <span className="tf-node-subtitle">{node.subtitle}</span>
              </button>
            );
          })}
        </div>
        <p className="tf-build-note">
          <Network size={14} aria-hidden="true" />
          {data.buildNote}
        </p>

        <div
          id={detailId}
          className="tf-node-explanation"
          role="region"
          aria-label="Terraform component explanation"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="tf-explanation-heading">
            <span className="tf-explanation-icon">
              <SelectedIcon size={21} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <span className="tf-eyebrow">SELECTED COMPONENT</span>
              <h4>{selected.title}</h4>
            </div>
          </div>
          <div className="tf-explanation-grid">
            <div>
              <h5>What it does</h5>
              <p>{selected.what}</p>
            </div>
            <div>
              <h5>Why this choice</h5>
              <p>{selected.why}</p>
            </div>
            <div>
              <h5>
                <ShieldCheck size={12} aria-hidden="true" />
                Security considerations
              </h5>
              <p>{selected.security}</p>
            </div>
          </div>
          {selected.docs && (
            <a className="tf-docs-link" href={selected.docs} target="_blank" rel="noreferrer">
              {selected.docsLabel || 'Read the documentation'}
              <ArrowUpRight size={12} aria-hidden="true" />
              <span className="tf-sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>

      <div className="tf-engineering-details">
        <div className="tf-responsibilities">
          <span className="tf-eyebrow">MY CONTRIBUTION</span>
          <h4>My Responsibilities</h4>
          <ul>
            {data.responsibilities.map((responsibility) => (
              <li key={responsibility.title}>
                <Check size={13} aria-hidden="true" />
                <div>
                  <h5>{responsibility.title}</h5>
                  <p>{responsibility.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="tf-code-card">
          <div className="tf-code-card-heading">
            <Code2 size={19} aria-hidden="true" />
            <div>
              <span className="tf-eyebrow">A CLOSER LOOK</span>
              <h4>{data.codeTitle}</h4>
            </div>
          </div>
          <p>{data.codeNote}</p>
          <details className="tf-code-disclosure">
            <summary>
              View sanitized Terraform example
              <ChevronDown size={14} aria-hidden="true" />
            </summary>
            <div className="tf-code-window">
              <div className="tf-code-toolbar">
                <span>
                  <Terminal size={12} aria-hidden="true" />
                  example.tf
                </span>
                <button type="button" onClick={copyCode} aria-label="Copy Terraform Code">
                  {copyStatus === 'copied' ? (
                    <CheckCheck size={13} aria-hidden="true" />
                  ) : (
                    <Copy size={13} aria-hidden="true" />
                  )}
                  {copyStatus === 'copied' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div
                className="tf-code-scroll"
                tabIndex={0}
                role="region"
                aria-label="Sanitized Terraform source"
              >
                <pre>
                  <code>
                    <HighlightedCode code={code} />
                  </code>
                </pre>
              </div>
            </div>
            <p className="tf-copy-status" role="status" aria-live="polite">
              {copyStatus === 'copied'
                ? 'Terraform code copied.'
                : copyStatus === 'failed'
                  ? 'Copy failed. Use the selected code below and copy it manually.'
                  : ''}
            </p>
            {copyStatus === 'failed' && (
              <div className="tf-manual-copy">
                <textarea
                  ref={manualCode}
                  readOnly
                  value={code}
                  aria-label="Terraform code for manual copy"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => {
                    manualCode.current?.focus();
                    manualCode.current?.select();
                  }}
                >
                  Select Terraform Code
                </button>
                <span>Press Ctrl+C, or Command+C on Mac.</span>
              </div>
            )}
          </details>
        </div>
      </div>
      <details className="tf-project-details">
        <summary>
          Explore the case study
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="tf-project-details-body">
          <div>
            <h4>Engineering challenge</h4>
            <p>{project.challenge}</p>
          </div>
          <div>
            <h4>The approach</h4>
            <p>{project.solution}</p>
          </div>
          <div>
            <h4>Recorded outcome</h4>
            <p>{project.impact}</p>
          </div>
        </div>
      </details>
    </article>
  );
}
