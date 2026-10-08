import { ArrowUpRight, Linkedin, Mail, MapPin } from 'lucide-react';
import { profile, sectionCopy } from '../content';
import ScrollReveal from './ScrollReveal';

export default function Contact() {
  return (
    <section
      id="contact"
      className="section contact-section"
      tabIndex={-1}
      aria-labelledby="contact-heading"
    >
      <div className="contact-ambient" aria-hidden="true" />
      <div className="container">
        <ScrollReveal>
          <p className="eyebrow">{sectionCopy.contact.eyebrow}</p>
          <span className="contact-orbit" aria-hidden="true">
            <Mail size={30} strokeWidth={1.25} />
          </span>
          <h2 id="contact-heading">
            {sectionCopy.contact.title}
            <br />
            <span className="gradient-text">{sectionCopy.contact.accent}</span>
          </h2>
          <p className="contact-description">{sectionCopy.contact.description}</p>
          <ul className="contact-roles" aria-label="Roles of interest">
            {profile.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <p className="contact-role-note">{sectionCopy.contact.platformScope}</p>
          <a className="button button-primary contact-cta" href={`mailto:${profile.email}`}>
            Get In Touch <ArrowUpRight size={18} />
          </a>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="contact-socials">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} />
              LinkedIn <ArrowUpRight size={13} />
            </a>
          </div>
          <p className="contact-location">
            <MapPin size={13} />
            {profile.location}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
