import { useEffect, useId, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  Circle,
  Cloud,
  Code2,
  Container,
  Flag,
  GitBranch,
  Package,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  TriangleAlert,
  Workflow,
} from 'lucide-react';
import { CaseStudyShell, CodeExample, InterviewDeepDive } from './EngineeringCaseStudy';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { jenkinsCaseStudy as data, sampleDockerfile, sampleJenkinsfile } from '../jenkinsCaseStudy';
import '../styles/jenkins-case-study.css';

const icons = {
  git: GitBranch,
  workflow: Workflow,
  code: Code2,
  check: ShieldCheck,
  container: Container,
  package: Package,
  cloud: Cloud,
  activity: Activity,
  flag: Flag,
};
const initialDemo = { mode: 'idle', index: -1, selected: 0, recoveryStep: 0, recovered: false };

function advance(current) {
  if (current.index >= data.stages.length - 1) return { ...current, mode: 'complete' };
  const index = current.index + 1;
  return { ...current, index, selected: index };
}

export default function JenkinsCaseStudy() {
  const { stopMotion } = useMotionPreferences();
  const id = useId().replace(/:/g, '');
  const [target, setTarget] = useState('EKS');
  const [demo, setDemo] = useState(initialDemo);
  const running = demo.mode === 'running' && !stopMotion;
  const activeTarget = data.targets[target];
  const selected = data.stages[demo.selected];
  const SelectedIcon = icons[selected.icon];
  const failure = demo.mode === 'failed' || demo.mode === 'recovering';

  useEffect(() => {
    if (demo.mode !== 'running' || stopMotion) return undefined;
    const timer = window.setTimeout(
      () => setDemo((current) => (current.mode === 'running' ? advance(current) : current)),
      1100,
    );
    return () => window.clearTimeout(timer);
  }, [demo.mode, demo.index, stopMotion]);

  function run() {
    setDemo({ ...initialDemo, mode: stopMotion ? 'manual' : 'running', index: 0 });
  }

  function simulateFailure() {
    setDemo({ ...initialDemo, mode: 'failed', index: 7, selected: 7 });
  }

  function recover() {
    setDemo((current) => {
      if (current.mode === 'failed') return { ...current, mode: 'recovering', recoveryStep: 0 };
      const next = current.recoveryStep + 1;
      return next >= data.recovery.length
        ? {
            ...current,
            mode: 'complete',
            index: 8,
            selected: 8,
            recoveryStep: next,
            recovered: true,
          }
        : { ...current, recoveryStep: next };
    });
  }

  function stageStatus(index) {
    if (demo.mode === 'complete') return 'complete';
    if (failure && index === 7) return 'failed';
    if (index < demo.index) return 'complete';
    if (index === demo.index) return 'active';
    return 'pending';
  }

  const stateLabel =
    demo.mode === 'complete'
      ? demo.recovered
        ? 'Recovered — sample release healthy.'
        : 'Complete — sample release healthy.'
      : failure
        ? demo.mode === 'recovering'
          ? 'Recovery walkthrough in progress.'
          : 'Unhealthy deployment — sample health check failed.'
        : demo.mode === 'paused' || (demo.mode === 'running' && stopMotion)
          ? 'Pipeline paused. No sample stages are advancing.'
          : demo.mode === 'manual'
            ? 'Manual playback — use Next Stage to advance.'
            : running
              ? `Running sample stage ${demo.index + 1} of 9: ${data.stages[demo.index].title}.`
              : 'Ready — nine sample stages, no external connection.';
  const sampleLogs =
    demo.index < 0
      ? ['[Demo] Ready. Choose EKS or ECS, then Run Pipeline.']
      : data.stages.slice(0, demo.mode === 'complete' ? 9 : demo.index + 1).map((stage, index) => {
          if (index === 6) return activeTarget.deploymentLog;
          if (index === 7) return failure ? activeTarget.failureLog : activeTarget.healthLog;
          return stage.log;
        });

  return (
    <CaseStudyShell
      id="jenkins-case-study"
      kicker={data.kicker}
      title={data.title}
      summary={data.summary}
    >
      <div className="ci-simulation-note">
        <Terminal size={16} aria-hidden="true" />
        <p>{data.simulation}</p>
      </div>
      <div className="ci-workspace">
        <div className="ci-control-bar">
          <div className="ci-run-controls">
            <button
              type="button"
              className="ci-button ci-primary"
              onClick={run}
              disabled={demo.mode !== 'idle'}
            >
              <Play size={15} aria-hidden="true" />
              Run Pipeline
            </button>
            {demo.mode === 'running' && !stopMotion && (
              <button
                type="button"
                className="ci-button"
                onClick={() => setDemo((current) => ({ ...current, mode: 'paused' }))}
              >
                <Pause size={15} aria-hidden="true" />
                Pause
              </button>
            )}
            {demo.mode === 'paused' && !stopMotion && (
              <button
                type="button"
                className="ci-button"
                onClick={() => setDemo((current) => ({ ...current, mode: 'running' }))}
              >
                <Play size={15} aria-hidden="true" />
                Resume
              </button>
            )}
            {(demo.mode === 'manual' ||
              (stopMotion && ['running', 'paused'].includes(demo.mode))) && (
              <button
                type="button"
                className="ci-button"
                onClick={() => setDemo((current) => advance({ ...current, mode: 'manual' }))}
              >
                <ArrowRight size={15} aria-hidden="true" />
                Next Stage
              </button>
            )}
            <button type="button" className="ci-button" onClick={run}>
              <RotateCcw size={15} aria-hidden="true" />
              Replay
            </button>
            <button
              type="button"
              className="ci-button ci-failure-button"
              onClick={simulateFailure}
              disabled={failure}
            >
              <TriangleAlert size={15} aria-hidden="true" />
              Simulate Failure
            </button>
          </div>
          <label className="ci-target-label" htmlFor={`ci-target-${id}`}>
            Deployment target
            <select
              id={`ci-target-${id}`}
              aria-label="Jenkins deployment target"
              value={target}
              onChange={(event) => {
                setTarget(event.target.value);
                setDemo(initialDemo);
              }}
            >
              <option value="EKS">Amazon EKS</option>
              <option value="ECS">Amazon ECS</option>
            </select>
          </label>
        </div>
        <div
          className="ci-status"
          role="status"
          aria-label="Pipeline simulation status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={`ci-state-dot ci-state-${demo.mode}`} aria-hidden="true" />
          {stateLabel}
        </div>
        <p className="ci-playback-note">
          {stopMotion
            ? 'Motion is paused or reduced. Pipeline playback advances only when you choose Next Stage.'
            : 'Each stage advances automatically during playback. Pause to inspect a stage.'}{' '}
          Simulate Failure jumps to a sample unhealthy rollout.
        </p>

        <div
          className={`ci-pipeline ${running ? 'is-running' : ''}`}
          role="group"
          aria-label="Jenkins pipeline stages"
        >
          {data.stages.map((stage, index) => {
            const Icon = icons[stage.icon];
            const status = stageStatus(index);
            return (
              <div className="ci-stage-wrap" key={stage.id}>
                <button
                  type="button"
                  className={`ci-stage ci-stage-${status} ${demo.selected === index ? 'is-selected' : ''}`}
                  aria-label={`Inspect ${stage.title}`}
                  aria-pressed={demo.selected === index}
                  aria-controls={`ci-stage-detail-${id}`}
                  onClick={() => setDemo((current) => ({ ...current, selected: index }))}
                >
                  <span className="ci-stage-top">
                    <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </span>
                  <strong>{index === 6 ? `Amazon ${target}` : stage.title}</strong>
                  <span className="ci-stage-status">
                    {status === 'complete' ? (
                      <Check size={11} aria-hidden="true" />
                    ) : status === 'failed' ? (
                      <TriangleAlert size={11} aria-hidden="true" />
                    ) : (
                      <Circle size={8} aria-hidden="true" />
                    )}
                    {status}
                  </span>
                </button>
                {index < 8 && (
                  <span
                    className={`ci-connector ${demo.index === index && running ? 'is-active' : ''}`}
                    aria-hidden="true"
                  >
                    <ArrowRight size={14} />
                    <ArrowDown size={14} />
                    <i />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="ci-inspection-grid">
          <div
            id={`ci-stage-detail-${id}`}
            className="ci-stage-detail"
            role="region"
            aria-label="Pipeline stage explanation"
            aria-live="polite"
          >
            <span className="ci-panel-label">
              STAGE {String(demo.selected + 1).padStart(2, '0')} / {selected.short}
            </span>
            <h4>
              <SelectedIcon size={20} aria-hidden="true" />
              {selected.title}
            </h4>
            <p>{demo.selected === 6 ? activeTarget.description : selected.description}</p>
            <div className="ci-sample-command">
              <span>SAMPLE CONSOLE LINE</span>
              <code>{demo.selected === 6 ? activeTarget.deploymentLog : selected.log}</code>
            </div>
          </div>
          <div className="ci-console" role="region" aria-label="Sample Jenkins console logs">
            <div className="ci-console-heading">
              <span>
                <Terminal size={14} aria-hidden="true" />
                Jenkins console
              </span>
              <span>DEMO DATA</span>
            </div>
            <div className="ci-console-body" tabIndex={0}>
              {sampleLogs.map((line, index) => (
                <p
                  className={failure && index === 7 ? 'ci-log-failed' : ''}
                  key={`${target}-${index}`}
                >
                  {line}
                </p>
              ))}
              {demo.recovered && (
                <p className="ci-log-recovered">
                  [Recovery] Previous verified configuration restored in this simulation. Health
                  checks passed.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="ci-target-explanation" id="jenkins-deployment">
          <Cloud size={21} aria-hidden="true" />
          <div>
            <h4>{activeTarget.title}</h4>
            <p>{activeTarget.description}</p>
            <span>EKS and ECS are alternative deployment models in this teaching flow.</span>
          </div>
        </div>

        {(failure || demo.recovered) && (
          <div
            className={`ci-recovery ${demo.recovered ? 'is-recovered' : ''}`}
            role="region"
            aria-label="Unhealthy deployment recovery walkthrough"
          >
            <div className="ci-recovery-heading">
              <div>
                <span className="ci-panel-label">ILLUSTRATIVE INCIDENT / {target}</span>
                <h4>
                  {demo.recovered
                    ? 'Recovery validated.'
                    : 'A container started. The application is unhealthy.'}
                </h4>
              </div>
              {demo.recovered ? (
                <CheckCheck size={25} aria-hidden="true" />
              ) : (
                <TriangleAlert size={25} aria-hidden="true" />
              )}
            </div>
            <p>{activeTarget.recovery}</p>
            <ol>
              {data.recovery.map((step, index) => (
                <li
                  className={`${demo.recovered || index < demo.recoveryStep ? 'is-complete' : ''} ${demo.mode === 'recovering' && index === demo.recoveryStep ? 'is-current' : ''}`}
                  key={step.title}
                >
                  <span>
                    {demo.recovered || index < demo.recoveryStep ? (
                      <Check size={13} aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <h5>{step.title}</h5>
                    <p>{step.action}</p>
                    {(demo.recovered ||
                      (demo.mode === 'recovering' && index <= demo.recoveryStep)) && (
                      <p className="ci-recovery-observation">{step.observation}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {!demo.recovered && (
              <button type="button" className="ci-button ci-primary" onClick={recover}>
                {demo.mode === 'failed'
                  ? 'Recover Deployment'
                  : demo.recoveryStep === 2
                    ? 'Validate Recovery'
                    : 'Next Recovery Step'}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            )}
            <p className="ci-recovery-disclaimer">
              Recovery is a local walkthrough. This page never submits a deployment or rollback.
            </p>
          </div>
        )}
      </div>

      <div className="ci-technology-explanations">
        <h4>The tools behind the workflow.</h4>
        <div>
          {data.explanations.map((explanation) => (
            <details key={explanation.title}>
              <summary>
                {explanation.title}
                <ChevronDown size={15} aria-hidden="true" />
              </summary>
              <p>{explanation.description}</p>
              <a href={explanation.url} target="_blank" rel="noreferrer">
                Official documentation
                <ArrowUpRight size={13} aria-hidden="true" />
                <span className="ci-sr-only"> for {explanation.title} (opens in a new tab)</span>
              </a>
            </details>
          ))}
        </div>
      </div>
      <div className="ci-code-examples">
        <CodeExample
          title="Sanitized Jenkinsfile"
          filename="Jenkinsfile"
          code={sampleJenkinsfile}
          note="Teaching example requiring configured build tools, scoped agent IAM, reviewed ECR settings, and environment-specific deployment scripts. Those scripts are intentionally excluded; this is not an executable production release configuration."
        />
        <CodeExample
          title="Sanitized Dockerfile"
          filename="Dockerfile"
          code={sampleDockerfile}
          note="Example OpenLiberty WAR packaging. Review the supported base image, pin its digest, and provide the matching server.xml and artifact before real use. No secrets or customer configuration are included."
        />
      </div>
      <InterviewDeepDive {...data.deepDive} />
    </CaseStudyShell>
  );
}
