import { useEffect, useId, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Check,
  CheckCircle2,
  CircleAlert,
  FileSearch,
  HeartPulse,
  Pause,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { observabilityCaseStudy as data } from '../observabilityCaseStudy';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { CaseStudyShell, InterviewDeepDive, CodeExample } from './EngineeringCaseStudy';
import '../styles/observability-case-study.css';

const tabs = ['Overview', 'Metrics', 'Logs', 'Alarms', 'Incident Response'];
const autoSteps = { 1: 2, 2: 3, 5: 6 };

function MetricChart({ metric, mode, activeIncident }) {
  const chartId = useId().replace(/:/g, '');
  const samples = metric[mode];
  const value = samples.at(-1);
  const points = samples.map((point, index) => [
    10 + index * (280 / (samples.length - 1)),
    88 - (point / metric.max) * 72,
  ]);
  const path = points
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  const danger = activeIncident && ['errors', 'latency', 'health'].includes(metric.id);
  return (
    <article className={`obs-metric${danger ? ' obs-metric-affected' : ''}`}>
      <div className="obs-metric-heading">
        <h5>{metric.title}</h5>
        <span className="obs-demo-label">DEMO DATA</span>
      </div>
      <p className="obs-metric-value">
        {value}
        <span>{metric.unit}</span>
      </p>
      <svg
        className="obs-chart"
        viewBox="0 0 300 108"
        role="img"
        aria-labelledby={`obs-chart-title-${chartId} obs-chart-description-${chartId}`}
      >
        <title id={`obs-chart-title-${chartId}`}>{metric.title} — DEMO DATA</title>
        <desc id={`obs-chart-description-${chartId}`}>
          Twelve synthetic samples. First {samples[0]}
          {metric.unit}, latest {value}
          {metric.unit}. Chart scale zero to {metric.max}
          {metric.unit}. These are fictional values.
        </desc>
        <defs>
          <linearGradient id={`obs-fill-${chartId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[16, 52, 88].map((y) => (
          <line key={y} x1="10" x2="290" y1={y} y2={y} className="obs-chart-grid" />
        ))}
        <path d={`${path} L290,88 L10,88 Z`} fill={`url(#obs-fill-${chartId})`} />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="290" cy={points.at(-1)[1]} r="3" fill="currentColor" />
        <text x="10" y="105">
          Sample 01
        </text>
        <text x="290" y="105" textAnchor="end">
          Sample 12
        </text>
      </svg>
      <p className="obs-metric-source">{metric.source}</p>
    </article>
  );
}

function LogViewer({ step }) {
  const [level, setLevel] = useState('ALL');
  const [query, setQuery] = useState('');
  const entries = data.logs.filter(
    (log) =>
      log.step <= step &&
      (level === 'ALL' || log.level === level) &&
      log.message.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="obs-log-card">
      <div className="obs-card-heading">
        <div>
          <p className="obs-eyebrow">CENTRALIZED LOGS</p>
          <h4>Follow the evidence.</h4>
        </div>
        <span className="obs-demo-label">DEMO DATA</span>
      </div>
      <div className="obs-log-filters">
        <label>
          Severity
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="ALL">All levels</option>
            <option>ERROR</option>
            <option>WARN</option>
            <option>INFO</option>
          </select>
        </label>
        <label className="obs-log-search">
          <Search size={14} aria-hidden="true" />
          <span className="obs-sr-only">Search fictional log messages</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search demo logs"
            type="search"
          />
        </label>
      </div>
      <div
        className="obs-log-entries"
        role="region"
        aria-label="Fictional centralized log entries"
        tabIndex={0}
      >
        {entries.length ? (
          entries.map((log) => (
            <div className="obs-log-entry" key={log.offset}>
              <span className="obs-log-offset">{log.offset}</span>
              <span className={`obs-log-level obs-level-${log.level.toLowerCase()}`}>
                {log.level}
              </span>
              <span>{log.message}</span>
            </div>
          ))
        ) : (
          <p className="obs-empty">No demo messages match these filters.</p>
        )}
      </div>
      <p className="obs-small-note">
        DEMO DATA · S00–S10 are synthetic sequence markers, not production timestamps.
      </p>
    </div>
  );
}

function AlarmPanel({ step, compact = false }) {
  const triggered = step >= 2 && step < 6;
  const alarmRows = [
    { title: 'Application error rate', rule: '> 5% · 2 of 3 demo intervals' },
    { title: 'Response latency', rule: 'p95 > 600 ms · example evaluation' },
  ];
  return (
    <div className="obs-alarm-card">
      <div className="obs-card-heading">
        <div>
          <p className="obs-eyebrow">CLOUDWATCH-STYLE ALARMS</p>
          <h4>{triggered ? 'A signal to investigate.' : 'Within demo thresholds.'}</h4>
        </div>
        <span className="obs-demo-label">DEMO DATA</span>
      </div>
      {alarmRows.map((alarm) => (
        <div className="obs-alarm-row" key={alarm.title}>
          <BellRing size={17} aria-hidden="true" />
          <div>
            <h5>{alarm.title}</h5>
            <p>{alarm.rule}</p>
          </div>
          <span className={`obs-state ${triggered ? 'obs-state-alarm' : 'obs-state-ok'}`}>
            {triggered ? 'ALARM' : 'OK'}
          </span>
        </div>
      ))}
      {step === 1 && (
        <p className="obs-small-note">
          First breach observed. Waiting for the example evaluation window.
        </p>
      )}
      {!compact && <p className="obs-small-note">{data.alarmNote}</p>}
    </div>
  );
}

function ContainerHealth({ affected }) {
  return (
    <div className="obs-health-card">
      <div className="obs-card-heading">
        <div>
          <p className="obs-eyebrow">APPLICATION READINESS</p>
          <h4>Container health</h4>
        </div>
        <span className="obs-demo-label">DEMO DATA</span>
      </div>
      <div className="obs-container-grid">
        {[1, 2, 3, 4].map((container) => {
          const ready = !affected || container < 3;
          return (
            <div
              className={`obs-container ${ready ? '' : 'obs-container-unhealthy'}`}
              key={container}
            >
              {ready ? (
                <CheckCircle2 size={19} aria-hidden="true" />
              ) : (
                <CircleAlert size={19} aria-hidden="true" />
              )}
              <span>Container {container}</span>
              <strong>{ready ? 'Ready' : 'Not ready'}</strong>
            </div>
          );
        })}
      </div>
      <p className="obs-small-note">
        Fictional application checks. A running process alone does not establish readiness.
      </p>
    </div>
  );
}

function Investigation({ step }) {
  return (
    <div className="obs-investigation">
      <div className="obs-card-heading">
        <div>
          <p className="obs-eyebrow">INCIDENT RESPONSE / DEMO DATA</p>
          <h4>
            {step >= 4
              ? 'A hypothesis, supported by signals.'
              : 'From symptom to a tested hypothesis.'}
          </h4>
        </div>
        <FileSearch size={23} aria-hidden="true" />
      </div>
      <p className="obs-investigation-intro">
        {step < 4
          ? 'Play the fictional incident, then select Investigate after the alarm and log clue appear. The steps below outline the approach before any animation runs.'
          : 'Investigation observations for this fictional incident. These are teaching examples, separate from my reported professional outcome.'}
      </p>
      <ol className="obs-observation-list">
        {data.observations.map((observation, index) => (
          <li className={step >= 4 ? 'is-observed' : ''} key={observation.title}>
            <span>{step >= 4 ? <Check size={14} aria-hidden="true" /> : `0${index + 1}`}</span>
            <div>
              <h5>{observation.title}</h5>
              <p>{observation.description}</p>
            </div>
          </li>
        ))}
      </ol>
      {step >= 4 && (
        <div className="obs-cause">
          <ShieldCheck size={18} aria-hidden="true" />
          <p>
            <strong>Fictional root cause:</strong> a configuration change reduced connection
            capacity below the demo workload’s concurrency. Recovery restores the previous demo
            setting and validates application behavior.
          </p>
        </div>
      )}
      {step === 6 && (
        <div className="obs-recovery-confirmation">
          <CheckCircle2 size={20} aria-hidden="true" />
          <div>
            <h5>Recovery verified in the simulation.</h5>
            <p>
              All four containers are ready; synthetic error and latency samples return within
              thresholds. A real incident would also require user-impact checks, an observation
              window, and a documented review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ObservabilityCaseStudy() {
  const { stopMotion } = useMotionPreferences();
  const widgetId = useId().replace(/:/g, '');
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const canAdvance = Object.hasOwn(autoSteps, step);
  const affected = step > 0 && step < 6;
  const mode = step === 6 ? 'recovered' : affected ? 'incident' : 'healthy';
  const stage = data.stages[step];

  useEffect(() => {
    if (!running || stopMotion || !Object.hasOwn(autoSteps, step)) return undefined;
    const timer = window.setTimeout(() => {
      const next = autoSteps[step];
      setStep(next);
      if (next === 3 || next === 6) setRunning(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [running, step, stopMotion]);

  function advance() {
    if (!canAdvance) return;
    const next = autoSteps[step];
    setStep(next);
    if (next === 3 || next === 6) setRunning(false);
  }
  function handleTabs(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <CaseStudyShell
      id="observability-case-study"
      kicker={data.kicker}
      title={data.title}
      summary={data.summary}
      impact={data.impact}
    >
      <div className="obs-dashboard">
        <div className="obs-dashboard-heading">
          <div>
            <span className="obs-eyebrow">
              <Activity size={15} aria-hidden="true" /> CLOUDWATCH-INSPIRED / LOCAL SIMULATION
            </span>
            <h3>See the signal. Understand the story.</h3>
          </div>
          <span className={`obs-service-state ${affected ? 'obs-service-degraded' : ''}`}>
            <HeartPulse size={15} aria-hidden="true" />
            {affected ? 'Demo degraded' : 'Demo healthy'}
          </span>
        </div>
        <p className="obs-demo-note">{data.demoNote}</p>
        <div
          className="obs-controls"
          role="group"
          aria-label="Fictional incident simulation controls"
        >
          <button
            type="button"
            className="obs-button obs-primary"
            disabled={step > 0 && step < 6}
            onClick={() => {
              setStep(1);
              setRunning(!stopMotion);
            }}
          >
            <Play size={15} aria-hidden="true" />
            Play Incident
          </button>
          <button
            type="button"
            className="obs-button"
            disabled={step !== 3}
            onClick={() => {
              setStep(4);
              setRunning(false);
              setActiveTab(4);
            }}
          >
            <Search size={15} aria-hidden="true" />
            Investigate
          </button>
          <button
            type="button"
            className="obs-button"
            disabled={step !== 4}
            onClick={() => {
              setStep(5);
              setRunning(!stopMotion);
            }}
          >
            <Wrench size={15} aria-hidden="true" />
            Recover
          </button>
          <button
            type="button"
            className="obs-button obs-reset"
            onClick={() => {
              setStep(0);
              setRunning(false);
              setActiveTab(0);
            }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
          {canAdvance && (
            <button type="button" className="obs-button obs-step" onClick={advance}>
              <ArrowRight size={15} aria-hidden="true" />
              Next Demo Step
            </button>
          )}
          {canAdvance && !stopMotion && (
            <button
              type="button"
              className="obs-button obs-pause"
              onClick={() => setRunning((value) => !value)}
            >
              {running ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {running ? 'Pause' : 'Resume'}
            </button>
          )}
        </div>
        <div className="obs-incident-status" role="status" aria-live="polite" aria-atomic="true">
          <span
            className={`obs-status-dot ${affected ? 'obs-dot-warning' : ''}`}
            aria-hidden="true"
          />
          <p>
            <strong>{stage.title}</strong> {stage.description}
            {stopMotion && canAdvance ? ' Motion is disabled. Use Next Demo Step to continue.' : ''}
          </p>
        </div>
        <div className="obs-tablist" role="tablist" aria-label="Observability dashboard views">
          {tabs.map((tab, index) => (
            <button
              type="button"
              key={tab}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              id={`obs-tab-${widgetId}-${index}`}
              aria-selected={activeTab === index}
              aria-controls={`obs-panel-${widgetId}-${index}`}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(event) => handleTabs(event, index)}
            >
              {tab}
            </button>
          ))}
        </div>
        {tabs.map((tab, index) => (
          <div
            key={tab}
            id={`obs-panel-${widgetId}-${index}`}
            role="tabpanel"
            aria-labelledby={`obs-tab-${widgetId}-${index}`}
            tabIndex={0}
            hidden={activeTab !== index}
            className="obs-tabpanel"
          >
            {(index === 0 || index === 1) && (
              <>
                <div className="obs-metric-grid">
                  {data.metrics.map((metric) => (
                    <MetricChart
                      metric={metric}
                      mode={mode}
                      activeIncident={affected}
                      key={metric.id}
                    />
                  ))}
                </div>
                <p className="obs-metric-note">{data.metricNote}</p>
                {index === 0 && (
                  <div className="obs-overview-details">
                    <ContainerHealth affected={affected} />
                    <AlarmPanel step={step} compact />
                  </div>
                )}
                {index === 1 && (
                  <p className="obs-small-note">
                    DEMO DATA · Each chart contains twelve invented samples with fixed scales.
                    Request count uses a synthetic interval; latency is shown in milliseconds. The
                    error-rate expression is illustrative and requires a valid request-count
                    denominator.
                  </p>
                )}
              </>
            )}
            {index === 2 && (
              <>
                <LogViewer step={step} />
                <CodeExample
                  title="Find the useful error context."
                  filename="incident-query.logsinsights"
                  code={data.query}
                  note="Illustrative query for JSON logs containing level and message fields. These fields and the connection-pool incident are fictional. Running a real query requires selecting appropriate log groups and a time range."
                />
              </>
            )}
            {index === 3 && <AlarmPanel step={step} />}
            {index === 4 && (
              <>
                <Investigation step={step} />
                <LogViewer step={step} />
              </>
            )}
          </div>
        ))}
        <div className="obs-docs">
          <span>Technical references</span>
          {data.docs.map((doc) => (
            <a href={doc.url} target="_blank" rel="noreferrer" key={doc.url}>
              {doc.title}
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <InterviewDeepDive
        challenge={data.challenge}
        responsibilities={data.responsibilities}
        implementation={data.implementation}
        decision={data.decision}
        troubleshooting={data.troubleshooting}
        interview={data.interview}
        questions={data.questions}
      />
    </CaseStudyShell>
  );
}
