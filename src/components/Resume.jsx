import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { certificationPlan, profile, sectionCopy } from '../content';
import ScrollReveal from './ScrollReveal';

export default function Resume() {
  return (
    <section
      id="resume"
      className="section resume-section container"
      tabIndex={-1}
      aria-labelledby="resume-heading"
    >
      <ScrollReveal className="resume-panel">
        <div className="resume-document" aria-hidden="true">
          <FileText size={48} strokeWidth={1} />
          <span>CPR</span>
          <i />
          <i />
          <i />
        </div>
        <div className="resume-copy">
          <p className="eyebrow">{sectionCopy.resume.eyebrow}</p>
          <h2 id="resume-heading">{sectionCopy.resume.title}</h2>
          <p>{sectionCopy.resume.description}</p>
          <div className="resume-learning">
            {certificationPlan.map((item) => (
              <span key={item.title}>
                {item.title}
                <strong>{item.state}</strong>
              </span>
            ))}
          </div>
        </div>
        <div className="resume-actions">
          <a href={profile.resume} className="button button-primary" download>
            Download Resume <Download size={16} />
          </a>
          <a href={profile.resume} className="text-link" target="_blank" rel="noreferrer">
            Preview PDF <ArrowUpRight size={14} />
          </a>
          <span>PDF DOCUMENT</span>
        </div>
      </ScrollReveal>
    </section>
  );
}
