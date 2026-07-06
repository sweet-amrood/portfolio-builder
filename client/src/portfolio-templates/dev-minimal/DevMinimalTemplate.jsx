import { devMinimalContent as defaultContent } from './dev-minimal.content';
import SectionStack from '../shared/SectionStack';
import ProfilePhoto from '../shared/ProfilePhoto';
import ProjectCover from '../shared/ProjectCover';
import TemplateMobileNav from '../shared/TemplateMobileNav';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import {
  TemplateMotionProvider,
  MotionTitle,
  MotionCard,
  MotionReveal,
  MotionHero,
  MotionPressable,
  MotionStagger,
  MotionStaggerItem,
} from '../shared/TemplateMotion';
import { TechBadge } from '../../components/DevToolIcon';
import EditableText from '../../components/builder/EditableText';
import { scrollToSection } from '../../utils/scrollToSection';
import './dev-minimal.css';

const DEFAULT_ORDER = ['about', 'projects', 'skills', 'experience', 'education', 'contact', 'stats'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function AboutSection({ c }) {
  return (
    <section className="devmin-section" id="about">
      <MotionTitle className="devmin-section-title">About Me</MotionTitle>
      <MotionReveal className="devmin-section-text" delay={0.08}>
        <EditableText field="about" section="about" label="About" multiline as="span">
          {c.about}
        </EditableText>
      </MotionReveal>
    </section>
  );
}

function ProjectsSection({ c }) {
  return (
    <section className="devmin-section" id="projects">
      <MotionTitle className="devmin-section-title">Projects</MotionTitle>
      <div className="devmin-projects">
        {c.projects.map((project, index) => (
          <MotionCard
            key={`${project.title}-${index}`}
            className="devmin-project-card tpl-interactive-card"
            delay={index * 0.07}
          >
            <div className="devmin-project-visual">
              <ProjectCover
                image={project.image}
                imageClassName="devmin-project-visual-img"
                placeholderClassName="devmin-project-visual-placeholder"
                alt={project.title}
              />
            </div>
            <div className="devmin-project-body">
              <div className="devmin-project-head">
                <h3>
                  <EditableText field={`projects.${index}.title`} section="projects" label="Title" as="span">
                    {project.title}
                  </EditableText>
                </h3>
                {project.tech?.length > 0 && (
                  <div className="devmin-project-tech">
                    {project.tech.map((item) => (
                      <TechBadge key={item} name={item} className="devmin-tech-chip" />
                    ))}
                  </div>
                )}
              </div>
              <p>
                <EditableText field={`projects.${index}.subtitle`} section="projects" label="Subtitle" multiline as="span">
                  {project.subtitle}
                </EditableText>
              </p>
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ c }) {
  return (
    <section className="devmin-section" id="skills">
      <MotionTitle className="devmin-section-title">Skills &amp; Tools</MotionTitle>
      <div className="devmin-skill-groups">
        {c.skillGroups.map((group, index) => (
          <MotionCard key={`${group.name}-${index}`} className="devmin-skill-group" delay={index * 0.06}>
            <h3>
              <EditableText field={`skillGroups.${index}.name`} section="skills" label="Group name" as="span">
                {group.name}
              </EditableText>
            </h3>
            <div className="devmin-skill-badges">
              {group.items.map((item) => (
                <TechBadge key={item} name={item} className="devmin-skill-badge" />
              ))}
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="devmin-section" id="experience">
      <MotionTitle className="devmin-section-title">Experience</MotionTitle>
      <div className="devmin-timeline">
        {c.experience.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="devmin-timeline-item" delay={index * 0.08}>
            <div className="devmin-timeline-marker" />
            <div>
              <div className="devmin-timeline-head">
                <h3>
                  <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                    {job.company}
                  </EditableText>
                </h3>
                <span>
                  <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                    {job.period}
                  </EditableText>
                </span>
              </div>
              <p className="devmin-timeline-role">
                <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                  {job.role}
                </EditableText>
              </p>
              <p className="devmin-timeline-desc">
                <EditableText
                  field={`experience.${index}.description`}
                  section="experience"
                  label="Description"
                  multiline
                  as="span"
                >
                  {job.description}
                </EditableText>
              </p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ c }) {
  return (
    <section className="devmin-section" id="education">
      <MotionTitle className="devmin-section-title">Education</MotionTitle>
      <div className="devmin-timeline">
        {c.education.map((item, index) => (
          <MotionReveal key={`${item.school}-${index}`} className="devmin-timeline-item" delay={index * 0.08}>
            <div className="devmin-timeline-marker" />
            <div>
              <div className="devmin-timeline-head">
                <h3>
                  <EditableText field={`education.${index}.school`} section="education" label="School" as="span">
                    {item.school}
                  </EditableText>
                </h3>
                <span>
                  <EditableText field={`education.${index}.period`} section="education" label="Period" as="span">
                    {item.period}
                  </EditableText>
                </span>
              </div>
              <p className="devmin-timeline-role">
                <EditableText field={`education.${index}.degree`} section="education" label="Degree" as="span">
                  {item.degree}
                </EditableText>
              </p>
              <p className="devmin-timeline-desc">
                <EditableText
                  field={`education.${index}.description`}
                  section="education"
                  label="Description"
                  multiline
                  as="span"
                >
                  {item.description}
                </EditableText>
              </p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ c, preview }) {
  const contact = { ...defaultContent.contact, ...c.contact };

  return (
    <section className="devmin-section devmin-contact" id="contact">
      <MotionTitle className="devmin-section-title">
        <EditableText field="contact.title" section="contact" label="Title" as="span">
          {contact.title}
        </EditableText>
      </MotionTitle>
      <MotionReveal className="devmin-section-text" delay={0.06}>
        <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
          {contact.subtitle}
        </EditableText>
      </MotionReveal>
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="devmin-contact-email tpl-motion-link">
          {contact.email}
        </a>
      )}
      <form className="devmin-form" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Name" readOnly={preview} />
        <input type="email" placeholder="Email" readOnly={preview} />
        <textarea placeholder="Your message..." rows={4} readOnly={preview} />
        <MotionPressable as="button" type="submit" className="devmin-btn devmin-btn--primary tpl-motion-btn">
          <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
            {contact.buttonText || 'Send Message'}
          </EditableText>
        </MotionPressable>
      </form>
    </section>
  );
}

function StatsSection({ c }) {
  return (
    <section className="devmin-section" id="stats">
      <MotionTitle className="devmin-section-title">Stats</MotionTitle>
      <MotionStagger className="devmin-stats-grid">
        {c.stats.map((stat, index) => (
          <MotionStaggerItem key={`${stat.label}-${index}`}>
            <div className="devmin-stat-card">
              <span className="devmin-stat-value">
                <EditableText field={`stats.${index}.value`} section="stats" label="Value" as="span">
                  {stat.value}
                </EditableText>
              </span>
              <span className="devmin-stat-label">
                <EditableText field={`stats.${index}.label`} section="stats" label="Label" as="span">
                  {stat.label}
                </EditableText>
              </span>
            </div>
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </section>
  );
}

const SECTION_RENDERERS = {
  about: AboutSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  education: EducationSection,
  contact: ContactSection,
  stats: StatsSection,
};

export default function DevMinimalTemplate({
  preview = false,
  compact = false,
  editable = false,
  sectionOrder = DEFAULT_ORDER,
  content: contentProp,
  theme,
}) {
  const c = contentProp || defaultContent;
  const showFull = !compact;
  const order = sectionOrder.length ? sectionOrder : DEFAULT_ORDER;

  const visibleNav = c.nav.filter((item) => {
    if (item.section === 'hero') return true;
    return order.includes(item.section);
  });

  const sectionLinks = visibleNav.map((item) => ({
    label: item.label,
    href: `#${item.section}`,
    onClick: (event) => handleSectionNav(event, item.section),
  }));

  const externalLinks = [
    c.links?.linkedin && { label: 'LinkedIn', href: c.links.linkedin },
    c.links?.resume && { label: 'Resume', href: c.links.resume },
  ].filter(Boolean);

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
    <div
      className={`devmin${preview ? ' devmin--preview' : ''}${compact ? ' devmin--compact' : ''}${editable ? ' devmin--editable' : ''}${theme ? ` devmin--theme-${theme.id}` : ''}`}
      style={theme?.vars}
    >
      <header className="devmin-header">
        <TemplateMobileNav
          variant="devmin"
          brand={c.siteName}
          brandHref="#hero"
          onBrandClick={(e) => handleSectionNav(e, 'hero')}
          sectionLinks={sectionLinks}
          externalLinks={externalLinks}
          preview={preview}
          trailing={
            c.links?.github ? (
              <a
                href={c.links.github}
                className="devmin-header-icon-btn tpl-motion-link"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <SocialBrandIcon name="github" />
              </a>
            ) : null
          }
        >
          <div className="devmin-header-left">
            <a href="#hero" className="devmin-brand" onClick={(e) => handleSectionNav(e, 'hero')}>
              <EditableText field="siteName" section="hero" label="Site name" as="span">
                {c.siteName}
              </EditableText>
            </a>
            <nav className="devmin-header-nav" aria-label="Main navigation">
              <a
                href="#hero"
                className="devmin-header-nav-link devmin-header-nav-link--active"
                onClick={(e) => handleSectionNav(e, 'hero')}
              >
                Home
              </a>
              {c.links?.linkedin && (
                <a
                  href={c.links.linkedin}
                  className="devmin-header-nav-link devmin-header-nav-link--external"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                  <span className="devmin-external-icon" aria-hidden="true">↗</span>
                </a>
              )}
              {c.links?.resume && (
                <a
                  href={c.links.resume}
                  className="devmin-header-nav-link devmin-header-nav-link--external"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                  <span className="devmin-external-icon" aria-hidden="true">↗</span>
                </a>
              )}
            </nav>
          </div>
          <div className="devmin-header-actions">
            <span className="devmin-clock" aria-hidden="true">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
            {c.links?.github && (
              <a
                href={c.links.github}
                className="devmin-header-icon-btn tpl-motion-link"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <SocialBrandIcon name="github" />
              </a>
            )}
            <span className="devmin-theme-dot" aria-hidden="true" />
          </div>
        </TemplateMobileNav>
      </header>

      <div className="devmin-layout">
        <aside className="devmin-sidebar">
          <p className="devmin-sidebar-label">Sections</p>
          <nav className="devmin-sidebar-nav">
            {visibleNav.map((item) => (
              <a
                key={item.section}
                href={`#${item.section}`}
                className="devmin-sidebar-link"
                onClick={(e) => handleSectionNav(e, item.section)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="devmin-main">
          <section className="devmin-hero" id="hero">
            <MotionHero className="devmin-hero-profile">
              <ProfilePhoto
                image={c.profileImage}
                name={c.name}
                className="devmin-avatar"
                emptyClassName="devmin-avatar--empty"
              />
            </MotionHero>

            <MotionHero as="h1" delay={0.05}>
              <EditableText field="name" section="hero" label="Name" as="span">
                {c.name}
              </EditableText>
            </MotionHero>

            <MotionHero className="devmin-hero-tagline" as="p" delay={0.1}>
              <EditableText field="tagline" section="hero" label="Tagline" as="span">
                {c.tagline}
              </EditableText>
            </MotionHero>

            <MotionHero className="devmin-hero-bio" as="p" delay={0.18}>
              <EditableText field="bio" section="hero" label="Bio" multiline as="span">
                {c.bio}
              </EditableText>
            </MotionHero>

            <MotionHero className="devmin-hero-actions" delay={0.25}>
              {c.links?.resume && (
                <MotionPressable as="a" href={c.links.resume} className="devmin-btn devmin-btn--primary tpl-motion-btn" target="_blank" rel="noreferrer">
                  Get Resume
                </MotionPressable>
              )}
              {c.links?.email && (
                <MotionPressable as="a" href={`mailto:${c.links.email}`} className="devmin-btn devmin-btn--ghost tpl-motion-btn">
                  Send Mail
                </MotionPressable>
              )}
            </MotionHero>
          </section>

          {showFull && (
            <>
              <div className="devmin-sections-stack">
                <SectionStack
                  order={order}
                  renderers={SECTION_RENDERERS}
                  content={c}
                  preview={preview}
                  editable={editable}
                />
              </div>
              <footer className="devmin-footer">
                <p>
                  <EditableText field="footer" section="hero" label="Footer" as="span">
                    {c.footer}
                  </EditableText>
                </p>
              </footer>
            </>
          )}

          {!showFull && <SkillsSection c={c} />}
        </main>
      </div>
    </div>
    </TemplateMotionProvider>
  );
}
