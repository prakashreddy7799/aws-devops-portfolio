import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Code2, Copy } from 'lucide-react';
import '../styles/engineering-case-studies.css';

export function CaseStudyShell({ id, kicker, title, summary, impact, children }) {
  return (
    <article id={id} className="ej-case-study" tabIndex={-1} aria-labelledby={`${id}-heading`}>
      <div className="ej-case-header">
        <div>
          <p className="ej-eyebrow">{kicker}</p>
          <h3 id={`${id}-heading`}>{title}</h3>
          <span className="ej-summary-label">RECRUITER SUMMARY</span>
          <p className="ej-summary">{summary}</p>
        </div>
        {impact && (
          <aside className="ej-impact" aria-label="Reported professional impact">
            <span className="ej-eyebrow">RESUME ACHIEVEMENT</span>
            <strong>{impact.value}</strong>
            <span>{impact.label}</span>
            {(impact.context || impact.note) && <p>{impact.context || impact.note}</p>}
          </aside>
        )}
      </div>
      <p className="ej-demo-note">
        Educational simulation · local demo data. No connection to production services.
      </p>
      <div className="ej-walkthrough">{children}</div>
    </article>
  );
}

export function InterviewDeepDive({
  challenge,
  responsibilities = [],
  implementation,
  decision,
  troubleshooting,
  interview,
  questions = [],
}) {
  return (
    <details className="ej-deep-dive">
      <summary>
        Interview deep dive <ChevronDown size={17} aria-hidden="true" />
      </summary>
      <div className="ej-deep-grid">
        <div>
          <h4>The engineering challenge</h4>
          <p>{challenge}</p>
        </div>
        <div>
          <h4>My responsibilities</h4>
          <ul>
            {responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Technical implementation</h4>
          <p>{implementation}</p>
        </div>
        <div>
          <h4>Why this architecture</h4>
          <p>{decision}</p>
        </div>
        <div>
          <h4>Troubleshooting and validation</h4>
          <p>{troubleshooting}</p>
        </div>
        <div>
          <h4>How I explain it in an interview</h4>
          <p>{interview}</p>
        </div>
      </div>
      {questions.length > 0 && (
        <div className="ej-interview-questions">
          <h4>Questions to explore</h4>
          <ul>
            {questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}

export function CodeExample({ title, filename, code, note }) {
  const [copyState, setCopyState] = useState('idle');
  const manual = useRef(null);
  useEffect(() => {
    if (copyState === 'failed') {
      manual.current?.focus();
      manual.current?.select();
    }
  }, [copyState]);
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }
  return (
    <details className="ej-code-example">
      <summary>
        <span>
          <Code2 size={16} aria-hidden="true" />
          {title}
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      {note && <p className="ej-code-note">{note}</p>}
      <div className="ej-code-window">
        <div className="ej-code-toolbar">
          <span>{filename}</span>
          <button type="button" aria-label={`Copy ${filename}`} onClick={copy}>
            {copyState === 'copied' ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            {copyState === 'copied' ? 'Copied' : 'Copy code'}
          </button>
        </div>
        <div
          className="ej-code-scroll"
          tabIndex={0}
          role="region"
          aria-label={`${filename} source`}
        >
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </div>
      <p className="ej-copy-status" role="status">
        {copyState === 'copied'
          ? `${filename} copied.`
          : copyState === 'failed'
            ? 'Clipboard unavailable. Select and copy the example below.'
            : ''}
      </p>
      {copyState === 'failed' && (
        <div className="ej-manual-copy">
          <textarea
            ref={manual}
            readOnly
            value={code}
            aria-label={`${filename} for manual copy`}
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => {
              manual.current?.focus();
              manual.current?.select();
            }}
          >
            Select code
          </button>
        </div>
      )}
    </details>
  );
}

export function DocumentationLink({ href, children }) {
  return (
    <a className="ej-documentation" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={13} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
