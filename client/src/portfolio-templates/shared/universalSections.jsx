import EditableText from '../../components/builder/EditableText';
import { TechBadge } from '../../components/DevToolIcon';

export const UNIVERSAL_SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'tech-stack',
  'experience',
  'education',
  'projects',
  'services',
  'testimonials',
  'statistics',
  'contact',
  'cta',
  'footer',
];

export const UNIVERSAL_SECTION_META = {
  hero: { label: 'Hero', icon: '⬡' },
  about: { label: 'About', icon: '◎' },
  skills: { label: 'Skills', icon: '◈' },
  'tech-stack': { label: 'Tech Stack', icon: '⚙' },
  experience: { label: 'Experience', icon: '▣' },
  education: { label: 'Education', icon: '▤' },
  projects: { label: 'Projects', icon: '▦' },
  services: { label: 'Services', icon: '◆' },
  testimonials: { label: 'Testimonials', icon: '❝' },
  statistics: { label: 'Statistics', icon: '◉' },
  contact: { label: 'Contact', icon: '✉' },
  cta: { label: 'Call to Action', icon: '▶' },
  footer: { label: 'Footer', icon: '▁' },
};

export const UNIVERSAL_DEFAULTS = {
  services: [
    { name: 'Web Development', desc: 'Build modern apps with clean UX.', icon: '🌐' },
    { name: 'API Integration', desc: 'Connect data and automate workflows.', icon: '🔌' },
  ],
  testimonials: [
    { quote: 'Great collaboration and high quality delivery.', author: 'Client Name', role: 'Product Lead' },
  ],
  statistics: [
    { value: '25+', label: 'Projects Delivered' },
    { value: '5+', label: 'Years Experience' },
  ],
  cta: {
    title: 'Let us build something great together',
    subtitle: 'Available for freelance and full-time opportunities.',
    buttonText: 'Get in touch',
    buttonHref: '#contact',
  },
};

export function ensureUniversalContent(content = {}) {
  return {
    ...content,
    techStack: content.techStack?.length
      ? content.techStack
      : content.skillGroups?.flatMap((group) => group.items || []).slice(0, 12) || [],
    services: content.services?.length ? content.services : UNIVERSAL_DEFAULTS.services,
    testimonials: content.testimonials?.length ? content.testimonials : UNIVERSAL_DEFAULTS.testimonials,
    statistics: content.statistics?.length ? content.statistics : content.stats?.length ? content.stats : UNIVERSAL_DEFAULTS.statistics,
    cta: { ...UNIVERSAL_DEFAULTS.cta, ...(content.cta || {}) },
  };
}

export function UniversalTemplateSection({ sectionId, c }) {
  const content = ensureUniversalContent(c);

  if (sectionId === 'about') {
    return (
      <section className="uni-section" id="about">
        <h2 className="uni-title">About</h2>
        <div className="uni-card">
          <p>
            <EditableText field="about" section="about" label="About" multiline as="span">
              {content.about || content.bio || ''}
            </EditableText>
          </p>
        </div>
      </section>
    );
  }

  if (sectionId === 'skills') {
    return (
      <section className="uni-section" id="skills">
        <h2 className="uni-title">Skills</h2>
        <div className="uni-grid">
          {(content.skillGroups || []).map((group, index) => (
            <article key={`${group.name}-${index}`} className="uni-card">
              <h3>
                <EditableText field={`skillGroups.${index}.name`} section="skills" label="Group name" as="span">
                  {group.name}
                </EditableText>
              </h3>
              <div className="uni-chip-wrap">
                {(group.items || []).map((item, itemIndex) => (
                  <TechBadge key={`${group.name}-${item}-${itemIndex}`} name={item} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'tech-stack') {
    return (
      <section className="uni-section" id="tech-stack">
        <h2 className="uni-title">Tech Stack</h2>
        <div className="uni-chip-wrap">
          {(content.techStack || []).map((item, index) => (
            <TechBadge key={`${item}-${index}`} name={item} />
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'experience') {
    return (
      <section className="uni-section" id="experience">
        <h2 className="uni-title">Experience</h2>
        <div className="uni-grid">
          {(content.experience || []).map((item, index) => (
            <article key={`${item.company}-${index}`} className="uni-card">
              <h3>
                <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                  {item.role}
                </EditableText>
              </h3>
              <p>
                <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                  {item.company}
                </EditableText>
              </p>
              <small>
                <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                  {item.period}
                </EditableText>
              </small>
              <p>
                <EditableText field={`experience.${index}.description`} section="experience" label="Description" multiline as="span">
                  {item.description}
                </EditableText>
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'education') {
    return (
      <section className="uni-section" id="education">
        <h2 className="uni-title">Education</h2>
        <div className="uni-grid">
          {(content.education || []).map((item, index) => (
            <article key={`${item.school}-${index}`} className="uni-card">
              <h3>
                <EditableText field={`education.${index}.degree`} section="education" label="Degree" as="span">
                  {item.degree}
                </EditableText>
              </h3>
              <p>
                <EditableText field={`education.${index}.school`} section="education" label="School" as="span">
                  {item.school}
                </EditableText>
              </p>
              <small>
                <EditableText field={`education.${index}.period`} section="education" label="Period" as="span">
                  {item.period}
                </EditableText>
              </small>
              <p>
                <EditableText field={`education.${index}.description`} section="education" label="Description" multiline as="span">
                  {item.description}
                </EditableText>
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'projects') {
    return (
      <section className="uni-section" id="projects">
        <h2 className="uni-title">Projects</h2>
        <div className="uni-grid">
          {(content.projects || []).map((item, index) => (
            <article key={`${item.title}-${index}`} className="uni-card">
              <h3>
                <EditableText field={`projects.${index}.title`} section="projects" label="Title" as="span">
                  {item.title}
                </EditableText>
              </h3>
              <p>
                <EditableText field={`projects.${index}.subtitle`} section="projects" label="Subtitle" multiline as="span">
                  {item.subtitle}
                </EditableText>
              </p>
              <div className="uni-chip-wrap">
                {(item.tech || []).map((tech, techIndex) => (
                  <TechBadge key={`${item.title}-${tech}-${techIndex}`} name={tech} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'services') {
    return (
      <section className="uni-section" id="services">
        <h2 className="uni-title">Services</h2>
        <div className="uni-grid">
          {(content.services || []).map((service, index) => (
            <article key={`${service.name}-${index}`} className="uni-card">
              <span className="uni-icon">{service.icon || '◆'}</span>
              <h3>
                <EditableText field={`services.${index}.name`} section="services" label="Service name" as="span">
                  {service.name}
                </EditableText>
              </h3>
              <p>
                <EditableText field={`services.${index}.desc`} section="services" label="Service description" multiline as="span">
                  {service.desc}
                </EditableText>
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'testimonials') {
    return (
      <section className="uni-section" id="testimonials">
        <h2 className="uni-title">Testimonials</h2>
        <div className="uni-grid">
          {(content.testimonials || []).map((item, index) => (
            <article key={`${item.author}-${index}`} className="uni-card">
              <p>
                <EditableText field={`testimonials.${index}.quote`} section="testimonials" label="Quote" multiline as="span">
                  {item.quote}
                </EditableText>
              </p>
              <h3>
                <EditableText field={`testimonials.${index}.author`} section="testimonials" label="Author" as="span">
                  {item.author}
                </EditableText>
              </h3>
              <small>
                <EditableText field={`testimonials.${index}.role`} section="testimonials" label="Role" as="span">
                  {item.role}
                </EditableText>
              </small>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'statistics') {
    return (
      <section className="uni-section" id="statistics">
        <h2 className="uni-title">Statistics</h2>
        <div className="uni-grid uni-grid--stats">
          {(content.statistics || []).map((item, index) => (
            <article key={`${item.label}-${index}`} className="uni-card">
              <strong>
                <EditableText field={`statistics.${index}.value`} section="statistics" label="Value" as="span">
                  {item.value}
                </EditableText>
              </strong>
              <p>
                <EditableText field={`statistics.${index}.label`} section="statistics" label="Label" as="span">
                  {item.label}
                </EditableText>
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (sectionId === 'contact') {
    return (
      <section className="uni-section" id="contact">
        <h2 className="uni-title">
          <EditableText field="contact.title" section="contact" label="Contact title" as="span">
            {content.contact?.title || 'Contact'}
          </EditableText>
        </h2>
        <div className="uni-card">
          <p>
            <EditableText field="contact.subtitle" section="contact" label="Contact subtitle" multiline as="span">
              {content.contact?.subtitle || ''}
            </EditableText>
          </p>
          <p>
            <EditableText field="contact.email" section="contact" label="Contact email" as="span">
              {content.contact?.email || content.links?.email || ''}
            </EditableText>
          </p>
        </div>
      </section>
    );
  }

  if (sectionId === 'cta') {
    return (
      <section className="uni-section uni-cta" id="cta">
        <h2>
          <EditableText field="cta.title" section="cta" label="CTA title" as="span">
            {content.cta?.title}
          </EditableText>
        </h2>
        <p>
          <EditableText field="cta.subtitle" section="cta" label="CTA subtitle" multiline as="span">
            {content.cta?.subtitle}
          </EditableText>
        </p>
        <a className="uni-btn" href={content.cta?.buttonHref || '#contact'}>
          <EditableText field="cta.buttonText" section="cta" label="CTA button text" as="span">
            {content.cta?.buttonText}
          </EditableText>
        </a>
      </section>
    );
  }

  if (sectionId === 'footer') {
    return (
      <footer className="uni-section uni-footer" id="footer">
        <EditableText field="footer" section="footer" label="Footer text" as="span">
          {typeof content.footer === 'string' ? content.footer : content.footer?.credit || 'Built with PortfolioForge'}
        </EditableText>
      </footer>
    );
  }

  return null;
}
