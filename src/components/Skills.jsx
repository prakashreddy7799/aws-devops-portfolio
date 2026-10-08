import {
  Activity,
  ArrowUpRight,
  Boxes,
  Cloud,
  Container,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from 'lucide-react';
import { skillGroups, sectionCopy } from '../content';
import ScrollReveal from './ScrollReveal';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { useState } from 'react';

const icons = {
  cloud: Cloud,
  blocks: Boxes,
  workflow: Workflow,
  containers: Container,
  activity: Activity,
  shield: ShieldCheck,
  terminal: TerminalSquare,
};

export default function Skills() {
  const { stopMotion } = useMotionPreferences();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = skillGroups.filter(
    (group) =>
      (category === 'All' || category === group.title) &&
      `${group.title} ${group.description} ${group.items.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <section
      id="skills"
      className="section skills-section"
      tabIndex={-1}
      aria-labelledby="skills-heading"
    >
      <div className="container">
        <ScrollReveal className="section-heading">
          <div>
            <p className="eyebrow">{sectionCopy.skills.eyebrow}</p>
            <h2 id="skills-heading">
              {sectionCopy.skills.title}
              <br />
              <span className="text-muted">{sectionCopy.skills.accent}</span>
            </h2>
          </div>
          <p>{sectionCopy.skills.description}</p>
        </ScrollReveal>
        <div className="skills-explorer-controls">
          <label htmlFor="skill-search">
            Find a skill or use case
            <input
              id="skill-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AWS, Terraform, Kubernetes…"
            />
          </label>
          <label htmlFor="skill-category">
            Category
            <select
              id="skill-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {skillGroups.map((group) => (
                <option key={group.title}>{group.title}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="skills-result-count" role="status">
          {filtered.length} skill categories match. Evidence appears in the engineering case studies
          below.
        </p>
        <div className="skills-grid">
          {filtered.map((group, index) => {
            const Icon = icons[group.icon] || Boxes;
            return (
              <ScrollReveal
                key={group.title}
                delay={(index % 3) * 0.07}
                className={`skill-card skill-card-${index}`}
                whileHover={stopMotion ? undefined : { y: -4 }}
              >
                <div className="skill-card-top">
                  <span className="skill-icon">
                    <Icon size={24} strokeWidth={1.4} />
                  </span>
                  <span className="skill-index">0{index + 1}</span>
                </div>
                <h3>{group.title}</h3>
                {group.description && <p>{group.description}</p>}
                <div className="tags">
                  {group.items.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="body-copy">
            No matching skills. Try a technology name or choose All categories.
          </p>
        )}
        <ScrollReveal className="skills-footnote">
          <span>Infrastructure. Delivery. Operations.</span>
          <a className="text-link" href="#architecture">
            See how it connects <ArrowUpRight size={15} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
