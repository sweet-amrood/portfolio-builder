import { aiDynamicContent as defaultContent } from './ai-dynamic.content';
import EditableText from '../../components/builder/EditableText';
import ProfilePhoto from '../shared/ProfilePhoto';
import './ai-dynamic.css';

const DEFAULT_ORDER = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];

function Nav({ order, name }) {
  return (
    <header className="ai-dyn-nav">
      <a href="#hero" className="ai-dyn-brand">
        {name || 'Portfolio'}
      </a>
      <nav className="ai-dyn-nav-links">
        {order.map((id) => (
          <a key={id} href={`#${id}`}>
            {id}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default function AiDynamicTemplate({
  content,
  sectionOrder,
  theme,
  compact = false,
}) {
  const c = content || defaultContent;
  const spec = c._aiSpec || defaultContent._aiSpec;
  const themeTokens = spec?.theme || defaultContent._aiSpec.theme;
  const order = (sectionOrder?.length ? sectionOrder : DEFAULT_ORDER).filter((id) => id !== 'hero');
  const modeFromBuilder =
    theme?.id === 'ai-light' ? 'light' : theme?.id === 'ai-dark' ? 'dark' : null;
  const mode = modeFromBuilder || (themeTokens.mode === 'light' ? 'light' : 'dark');

  const style = {
    '--ai-accent': theme?.vars?.['--accent'] || themeTokens.accent || '#6366f1',
    '--ai-font-heading': themeTokens.fontHeading || 'Space Grotesk',
    '--ai-font-body': themeTokens.fontBody || 'DM Sans',
  };

  return (
    <div className={`ai-dyn ai-dyn--${mode}${compact ? ' ai-dyn--compact' : ''}`} style={style}>
      <Nav order={order} name={c.personal?.name} />

      <section id="hero" className="ai-dyn-hero">
        <div className="ai-dyn-hero-copy">
          <p className="ai-dyn-kicker">
            <EditableText field="greeting" section="hero" as="span">
              {c.personal?.greeting || 'Hi, I’m'}
            </EditableText>
          </p>
          <h1>
            <EditableText field="name" section="hero" as="span">
              {c.personal?.name || 'Your Name'}
            </EditableText>
          </h1>
          <h2>
            <EditableText field="headline" section="hero" as="span">
              {c.personal?.headline || 'Software Developer'}
            </EditableText>
          </h2>
          <p className="ai-dyn-lead">
            <EditableText field="bio" section="hero" as="span" multiline>
              {c.personal?.bio || ''}
            </EditableText>
          </p>
          <div className="ai-dyn-hero-meta">
            {c.personal?.location ? (
              <span>
                <EditableText field="location" section="hero" as="span">
                  {c.personal.location}
                </EditableText>
              </span>
            ) : null}
            {c.personal?.availability ? (
              <span>
                <EditableText field="availability" section="hero" as="span">
                  {c.personal.availability}
                </EditableText>
              </span>
            ) : null}
          </div>
          <div className="ai-dyn-actions">
            <a className="ai-dyn-btn ai-dyn-btn--primary" href="#projects">
              View work
            </a>
            <a className="ai-dyn-btn" href="#contact">
              Contact
            </a>
          </div>
        </div>
        <div className="ai-dyn-hero-visual">
          <ProfilePhoto image={c.profileImage} name={c.personal?.name} className="ai-dyn-photo" />
          {c.highlights?.length ? (
            <div className="ai-dyn-highlights">
              {c.highlights.slice(0, 3).map((item, index) => (
                <div key={`${item.label}-${index}`} className="ai-dyn-highlight">
                  <strong>
                    <EditableText
                      field={`highlights.${index}.value`}
                      section="hero"
                      as="span"
                     
                    >
                      {item.value}
                    </EditableText>
                  </strong>
                  <span>
                    <EditableText
                      field={`highlights.${index}.label`}
                      section="hero"
                      as="span"
                     
                    >
                      {item.label}
                    </EditableText>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {order.includes('about') ? (
        <section id="about" className="ai-dyn-section">
          <p className="ai-dyn-section-label">About</p>
          <h3>My story</h3>
          <p>
            <EditableText field="about" section="about" as="span" multiline>
              {c.personal?.about || c.personal?.bio || ''}
            </EditableText>
          </p>
        </section>
      ) : null}

      {order.includes('skills') ? (
        <section id="skills" className="ai-dyn-section">
          <p className="ai-dyn-section-label">Skills</p>
          <h3>What I work with</h3>
          <div className="ai-dyn-skill-grid">
            {(c.skillGroups || []).map((group, gi) => (
              <article key={`${group.name}-${gi}`} className="ai-dyn-skill-card">
                <h4>
                  <EditableText
                    field={`skillGroups.${gi}.name`}
                    section="skills"
                    as="span"
                   
                  >
                    {group.name}
                  </EditableText>
                </h4>
                <div className="ai-dyn-tags">
                  {(group.items || []).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {order.includes('projects') ? (
        <section id="projects" className="ai-dyn-section">
          <p className="ai-dyn-section-label">Projects</p>
          <h3>Selected work</h3>
          <div className="ai-dyn-project-grid">
            {(c.projects || []).map((project, index) => (
              <article key={`${project.title}-${index}`} className="ai-dyn-project-card">
                <h4>
                  <EditableText
                    field={`projects.${index}.title`}
                    section="projects"
                    as="span"
                   
                  >
                    {project.title}
                  </EditableText>
                </h4>
                <p>
                  <EditableText
                    field={`projects.${index}.subtitle`}
                    section="projects"
                    as="span"
                    multiline
                   
                  >
                    {project.subtitle}
                  </EditableText>
                </p>
                <div className="ai-dyn-tags">
                  {(project.tech || []).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer">
                    View project
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {order.includes('experience') && c.experience?.length ? (
        <section id="experience" className="ai-dyn-section">
          <p className="ai-dyn-section-label">Experience</p>
          <h3>Where I’ve built</h3>
          <div className="ai-dyn-timeline">
            {c.experience.map((job, index) => (
              <article key={`${job.company}-${index}`} className="ai-dyn-timeline-item">
                <div className="ai-dyn-timeline-head">
                  <h4>
                    <EditableText
                      field={`experience.${index}.role`}
                      section="experience"
                      as="span"
                     
                    >
                      {job.role}
                    </EditableText>
                  </h4>
                  <span>
                    <EditableText
                      field={`experience.${index}.period`}
                      section="experience"
                      as="span"
                     
                    >
                      {job.period}
                    </EditableText>
                  </span>
                </div>
                <p className="ai-dyn-company">
                  <EditableText
                    field={`experience.${index}.company`}
                    section="experience"
                    as="span"
                   
                  >
                    {job.company}
                  </EditableText>
                </p>
                <p>
                  <EditableText
                    field={`experience.${index}.description`}
                    section="experience"
                    as="span"
                    multiline
                   
                  >
                    {job.description}
                  </EditableText>
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {order.includes('education') && c.education?.length ? (
        <section id="education" className="ai-dyn-section">
          <p className="ai-dyn-section-label">Education</p>
          <h3>Learning path</h3>
          <div className="ai-dyn-timeline">
            {c.education.map((edu, index) => (
              <article key={`${edu.school}-${index}`} className="ai-dyn-timeline-item">
                <div className="ai-dyn-timeline-head">
                  <h4>
                    <EditableText
                      field={`education.${index}.school`}
                      section="education"
                      as="span"
                     
                    >
                      {edu.school}
                    </EditableText>
                  </h4>
                  <span>
                    <EditableText
                      field={`education.${index}.period`}
                      section="education"
                      as="span"
                     
                    >
                      {edu.period}
                    </EditableText>
                  </span>
                </div>
                <p className="ai-dyn-company">
                  <EditableText
                    field={`education.${index}.degree`}
                    section="education"
                    as="span"
                   
                  >
                    {edu.degree}
                  </EditableText>
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {order.includes('contact') ? (
        <section id="contact" className="ai-dyn-section ai-dyn-contact">
          <p className="ai-dyn-section-label">Contact</p>
          <h3>
            <EditableText field="heading" section="contact" as="span">
              {c.contact?.heading || 'Let’s work together'}
            </EditableText>
          </h3>
          <p>
            <EditableText field="subheading" section="contact" as="span" multiline>
              {c.contact?.subheading || ''}
            </EditableText>
          </p>
          <div className="ai-dyn-contact-links">
            {c.links?.email ? <a href={`mailto:${c.links.email}`}>{c.links.email}</a> : null}
            {c.links?.github ? (
              <a href={c.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
            {c.links?.linkedin ? (
              <a href={c.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            ) : null}
            {c.links?.website ? (
              <a href={c.links.website} target="_blank" rel="noreferrer">
                Website
              </a>
            ) : null}
          </div>
          {c.links?.email ? (
            <a className="ai-dyn-btn ai-dyn-btn--primary" href={`mailto:${c.links.email}`}>
              <EditableText field="ctaLabel" section="contact" as="span">
                {c.contact?.ctaLabel || 'Get in touch'}
              </EditableText>
            </a>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
