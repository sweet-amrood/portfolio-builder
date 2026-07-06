import { midnightGoldContent as defaultContent } from './midnight-gold.content';
import SectionStack from '../shared/SectionStack';
import ProfilePhoto from '../shared/ProfilePhoto';
import TemplateMobileNav from '../shared/TemplateMobileNav';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import {
  TemplateMotionProvider,
  MotionTitle,
  MotionCard,
  MotionReveal,
  MotionHero,
  MotionPressable,
} from '../shared/TemplateMotion';
import { TechBadge } from '../../components/DevToolIcon';
import EditableText from '../../components/builder/EditableText';
import { scrollToSection } from '../../utils/scrollToSection';
import GoldDust from './components/GoldDust';
import FlipRoles from './components/FlipRoles';
import './midnight-gold.css';

const DEFAULT_ORDER = ['about', 'skills', 'projects', 'experience', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function SocialLinks({ links }) {
  const items = [
    links?.github && { key: 'github', href: links.github },
    links?.linkedin && { key: 'linkedin', href: links.linkedin },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="mgold-social">
      {items.map((item) => (
        <MotionPressable
          key={item.key}
          as="a"
          href={item.href}
          className="mgold-social-btn tpl-motion-btn"
          target="_blank"
          rel="noreferrer"
          aria-label={item.key}
        >
          <SocialBrandIcon name={item.key} />
        </MotionPressable>
      ))}
    </div>
  );
}

function AboutSection({ c }) {
  return (
    <section className="mgold-section" id="about">
      <div className="mgold-section-intro">
        <MotionTitle className="mgold-kicker" as="p">
          01 — Profile
        </MotionTitle>
        <MotionTitle className="mgold-section-title" as="h2">
          Refined by detail
        </MotionTitle>
      </div>
      <div className="mgold-about-layout">
        <MotionCard className="mgold-panel mgold-panel--about tpl-interactive-card">
          <p className="mgold-about-text">
            <EditableText field="about" section="about" label="About" multiline as="span">
              {c.about}
            </EditableText>
          </p>
        </MotionCard>
        <div className="mgold-metrics">
          {(c.highlights || []).map((item, index) => (
            <MotionCard
              key={`${item.label}-${index}`}
              className="mgold-metric tpl-interactive-card"
              delay={index * 0.08}
            >
              <span className="mgold-metric-value">
                <EditableText field={`highlights.${index}.value`} section="about" label="Stat value" as="span">
                  {item.value}
                </EditableText>
              </span>
              <span className="mgold-metric-label">
                <EditableText field={`highlights.${index}.label`} section="about" label="Stat label" as="span">
                  {item.label}
                </EditableText>
              </span>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ c }) {
  return (
    <section className="mgold-section" id="skills">
      <div className="mgold-section-intro">
        <MotionTitle className="mgold-kicker" as="p">
          02 — Expertise
        </MotionTitle>
        <MotionTitle className="mgold-section-title" as="h2">
          Capabilities
        </MotionTitle>
      </div>
      <div className="mgold-skill-grid">
        {(c.skillGroups || []).map((group, index) => (
          <MotionCard
            key={`${group.name}-${index}`}
            className="mgold-skill-block tpl-interactive-card"
            delay={index * 0.1}
          >
            <h3 className="mgold-skill-title">{group.name}</h3>
            <div className="mgold-skill-tags">
              {group.items?.map((skill) => (
                <span key={`${group.name}-${skill}`} className="mgold-skill-tag">
                  <TechBadge name={skill} />
                </span>
              ))}
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ c }) {
  return (
    <section className="mgold-section" id="projects">
      <div className="mgold-section-intro">
        <MotionTitle className="mgold-kicker" as="p">
          03 — Portfolio
        </MotionTitle>
        <MotionTitle className="mgold-section-title" as="h2">
          Selected engagements
        </MotionTitle>
      </div>
      <div className="mgold-project-grid">
        {c.projects?.map((project, index) => (
          <MotionCard
            key={`${project.title}-${index}`}
            className={`mgold-project tpl-interactive-card${project.featured ? ' mgold-project--featured' : ''}`}
            delay={index * 0.07}
          >
            <div className="mgold-project-frame" aria-hidden="true" />
            <span className="mgold-project-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>
              <EditableText field={`projects.${index}.title`} section="projects" label="Title" as="span">
                {project.title}
              </EditableText>
            </h3>
            <p>
              <EditableText
                field={`projects.${index}.subtitle`}
                section="projects"
                label="Description"
                multiline
                as="span"
              >
                {project.subtitle}
              </EditableText>
            </p>
            {project.tech?.length > 0 && (
              <div className="mgold-project-tech">
                {project.tech.map((tech) => (
                  <TechBadge key={`${project.title}-${tech}`} name={tech} />
                ))}
              </div>
            )}
            {project.link && (
              <a href={project.link} className="mgold-project-link" target="_blank" rel="noreferrer">
                View case study
              </a>
            )}
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="mgold-section" id="experience">
      <div className="mgold-section-intro">
        <MotionTitle className="mgold-kicker" as="p">
          04 — Career
        </MotionTitle>
        <MotionTitle className="mgold-section-title" as="h2">
          Professional journey
        </MotionTitle>
      </div>
      <div className="mgold-career">
        {c.experience?.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="mgold-career-row" delay={index * 0.1}>
            <div className="mgold-career-marker" aria-hidden="true" />
            <div className="mgold-career-card tpl-interactive-card">
              <div className="mgold-career-top">
                <h3>
                  <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                    {job.role}
                  </EditableText>
                </h3>
                <span className="mgold-career-period">
                  <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                    {job.period}
                  </EditableText>
                </span>
              </div>
              <p className="mgold-career-company">
                <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                  {job.company}
                </EditableText>
              </p>
              <p className="mgold-career-desc">
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

function ContactSection({ c }) {
  const contact = c.contact || {};

  return (
    <section className="mgold-section mgold-section--contact" id="contact">
      <MotionCard className="mgold-contact tpl-interactive-card">
        <div className="mgold-contact-glow" aria-hidden="true" />
        <MotionTitle className="mgold-kicker" as="p">
          05 — Contact
        </MotionTitle>
        <h2 className="mgold-contact-title">
          <EditableText field="contact.title" section="contact" label="Title" as="span">
            {contact.title}
          </EditableText>
        </h2>
        <p className="mgold-contact-sub">
          <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
            {contact.subtitle}
          </EditableText>
        </p>
        <div className="mgold-contact-actions">
          <MotionPressable
            as="a"
            href={`mailto:${contact.email || c.links?.email || ''}`}
            className="mgold-btn mgold-btn--gold tpl-motion-btn"
          >
            <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
              {contact.buttonText}
            </EditableText>
          </MotionPressable>
          {c.links?.resume && (
            <a href={c.links.resume} className="mgold-btn mgold-btn--outline" target="_blank" rel="noreferrer">
              Download CV
            </a>
          )}
        </div>
      </MotionCard>
    </section>
  );
}

const SECTION_RENDERERS = {
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  contact: ContactSection,
};

export default function MidnightGoldTemplate({
  preview = false,
  compact = false,
  editable = false,
  content: contentProp,
  sectionOrder,
  theme,
}) {
  const c = contentProp || defaultContent;
  const order = sectionOrder?.length ? sectionOrder : DEFAULT_ORDER;
  const visibleNav = (c.nav || []).filter((item) => order.includes(item.section));

  const sectionLinks = visibleNav.map((item) => ({
    label: item.label,
    href: `#${item.section}`,
    onClick: (event) => handleSectionNav(event, item.section),
  }));

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
      <div
        className={`mgold${preview ? ' mgold--preview' : ''}${compact ? ' mgold--compact' : ''}${editable ? ' mgold--editable' : ''}${theme ? ` mgold--theme-${theme.id}` : ''}`}
        style={theme?.vars}
      >
        <GoldDust />
        <div className="mgold-vignette" aria-hidden="true" />

        <header className="mgold-header">
          <TemplateMobileNav
            variant="mgold"
            brand={c.brandTag}
            brandHref="#hero"
            onBrandClick={(e) => handleSectionNav(e, 'hero')}
            sectionLinks={sectionLinks}
            preview={preview}
          >
            <nav className="mgold-nav" aria-label="Main navigation">
              <a href="#hero" className="mgold-nav-brand" onClick={(e) => handleSectionNav(e, 'hero')}>
                <span className="mgold-nav-mark" aria-hidden="true" />
                <EditableText field="brandTag" section="hero" label="Brand" as="span">
                  {c.brandTag}
                </EditableText>
              </a>
              <div className="mgold-nav-links">
                {visibleNav.map((item) => (
                  <a
                    key={item.section}
                    href={`#${item.section}`}
                    className="mgold-nav-link"
                    onClick={(e) => handleSectionNav(e, item.section)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </TemplateMobileNav>
        </header>

        <main className="mgold-main">
          <section className="mgold-hero" id="hero">
            <div className="mgold-hero-grid">
              <div className="mgold-hero-copy">
                <MotionHero className="mgold-hero-meta" as="div">
                  {c.availability && (
                    <span className="mgold-stamp">
                      <EditableText field="availability" section="hero" label="Availability" as="span">
                        {c.availability}
                      </EditableText>
                    </span>
                  )}
                  {c.location && (
                    <span className="mgold-pill mgold-pill--muted">
                      <EditableText field="location" section="hero" label="Location" as="span">
                        {c.location}
                      </EditableText>
                    </span>
                  )}
                </MotionHero>

                <MotionHero as="p" className="mgold-hero-greeting" delay={0.05}>
                  <EditableText field="greeting" section="hero" label="Greeting" as="span">
                    {c.greeting}
                  </EditableText>
                </MotionHero>

                <MotionHero as="h1" className="mgold-hero-title" delay={0.1}>
                  <EditableText field="name" section="hero" label="Name" as="span">
                    {c.name}
                  </EditableText>
                  <span className="mgold-hero-accent">
                    {' '}
                    <EditableText field="headlineAccent" section="hero" label="Accent phrase" as="span">
                      {c.headlineAccent}
                    </EditableText>
                  </span>
                </MotionHero>

                <MotionHero className="mgold-hero-roles" delay={0.16}>
                  <span className="mgold-hero-roles-label">Specializing as</span>
                  <FlipRoles roles={c.flipRoles} active={!preview} />
                </MotionHero>

                <MotionHero as="p" className="mgold-hero-tagline" delay={0.22}>
                  <EditableText field="tagline" section="hero" label="Tagline" multiline as="span">
                    {c.tagline}
                  </EditableText>
                </MotionHero>

                <MotionHero className="mgold-hero-actions" delay={0.28}>
                  <MotionPressable
                    as="a"
                    href="#projects"
                    className="mgold-btn mgold-btn--gold mgold-btn--pill tpl-motion-btn"
                    onClick={(e) => handleSectionNav(e, 'projects')}
                  >
                    View portfolio
                  </MotionPressable>
                  <MotionPressable
                    as="a"
                    href="#contact"
                    className="mgold-btn mgold-btn--outline mgold-btn--pill tpl-motion-btn"
                    onClick={(e) => handleSectionNav(e, 'contact')}
                  >
                    Get in touch
                  </MotionPressable>
                </MotionHero>

                <MotionHero delay={0.34}>
                  <SocialLinks links={c.links} />
                </MotionHero>
              </div>

              <MotionHero className="mgold-hero-visual" delay={0.12}>
                <div className="mgold-showcase">
                  <span className="mgold-showcase-monogram" aria-hidden="true">
                    {(c.name || 'Y').charAt(0)}
                  </span>
                  <span className="mgold-showcase-accent" aria-hidden="true" />
                  <div className="mgold-showcase-photo-wrap">
                    <ProfilePhoto
                      image={c.profileImage}
                      name={c.name}
                      className="mgold-showcase-photo"
                      emptyClassName="mgold-showcase-photo--empty"
                      initialsClassName="mgold-showcase-initials"
                    />
                  </div>
                  {(c.highlights || []).length > 0 && (
                    <div className="mgold-showcase-stats">
                      {c.highlights.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="mgold-showcase-stat">
                          <span className="mgold-showcase-stat-value">
                            <EditableText
                              field={`highlights.${index}.value`}
                              section="about"
                              label="Stat value"
                              as="span"
                            >
                              {item.value}
                            </EditableText>
                          </span>
                          <span className="mgold-showcase-stat-label">
                            <EditableText
                              field={`highlights.${index}.label`}
                              section="about"
                              label="Stat label"
                              as="span"
                            >
                              {item.label}
                            </EditableText>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </MotionHero>
            </div>
          </section>

          <SectionStack order={order} renderers={SECTION_RENDERERS} content={c} preview={preview} editable={editable} />
        </main>

        <footer className="mgold-footer">
          <EditableText field="footer" section="hero" label="Footer" as="span">
            {c.footer}
          </EditableText>
        </footer>
      </div>
    </TemplateMotionProvider>
  );
}
