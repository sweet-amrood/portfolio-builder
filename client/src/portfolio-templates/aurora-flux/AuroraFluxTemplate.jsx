import { auroraFluxContent as defaultContent } from './aurora-flux.content';
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
  MotionStagger,
  MotionStaggerItem,
} from '../shared/TemplateMotion';
import { TechBadge } from '../../components/DevToolIcon';
import EditableText from '../../components/builder/EditableText';
import { scrollToSection } from '../../utils/scrollToSection';
import AuroraBackground from './components/AuroraBackground';
import TypingRoles from './components/TypingRoles';
import './aurora-flux.css';

const DEFAULT_ORDER = ['about', 'skills', 'projects', 'experience', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function SocialDock({ links }) {
  const items = [
    links?.github && { key: 'github', href: links.github },
    links?.linkedin && { key: 'linkedin', href: links.linkedin },
    links?.twitter && { key: 'twitter', href: links.twitter },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="aflux-social-dock">
      {items.map((item) => (
        <MotionPressable
          key={item.key}
          as="a"
          href={item.href}
          className="aflux-social-btn tpl-motion-btn"
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
    <section className="aflux-section" id="about">
      <MotionTitle className="aflux-section-label" as="p">
        01 — About
      </MotionTitle>
      <div className="aflux-bento">
        <MotionCard className="aflux-bento-card aflux-bento-card--bio tpl-interactive-card">
          <h2 className="aflux-bento-title">The story</h2>
          <p className="aflux-bento-text">
            <EditableText field="about" section="about" label="About" multiline as="span">
              {c.about}
            </EditableText>
          </p>
        </MotionCard>
        {(c.highlights || []).map((item, index) => (
          <MotionCard
            key={`${item.label}-${index}`}
            className="aflux-bento-card aflux-bento-card--stat tpl-interactive-card"
            delay={index * 0.08}
          >
            <span className="aflux-stat-value">
              <EditableText field={`highlights.${index}.value`} section="about" label="Stat value" as="span">
                {item.value}
              </EditableText>
            </span>
            <span className="aflux-stat-label">
              <EditableText field={`highlights.${index}.label`} section="about" label="Stat label" as="span">
                {item.label}
              </EditableText>
            </span>
          </MotionCard>
        ))}
        <MotionCard className="aflux-bento-card aflux-bento-card--glow tpl-interactive-card" delay={0.12}>
          <div className="aflux-orbit-mini" aria-hidden="true">
            <span className="aflux-orbit-mini-ring" />
            <span className="aflux-orbit-mini-core" />
          </div>
          <p className="aflux-bento-quote">
            Design is intelligence made visible — motion is its heartbeat.
          </p>
        </MotionCard>
      </div>
    </section>
  );
}

function SkillsSection({ c }) {
  const skills = c.skillGroups?.flatMap((group) => group.items) || [];
  const track = [...skills, ...skills];

  return (
    <section className="aflux-section" id="skills">
      <MotionTitle className="aflux-section-label" as="p">
        02 — Skills
      </MotionTitle>
      <MotionReveal className="aflux-marquee-wrap">
        <div className="aflux-marquee aflux-marquee--forward">
          {track.map((skill, index) => (
            <span key={`fwd-${skill}-${index}`} className="aflux-skill-pill">
              <TechBadge name={skill} />
            </span>
          ))}
        </div>
        <div className="aflux-marquee aflux-marquee--reverse">
          {[...track].reverse().map((skill, index) => (
            <span key={`rev-${skill}-${index}`} className="aflux-skill-pill aflux-skill-pill--alt">
              <TechBadge name={skill} />
            </span>
          ))}
        </div>
      </MotionReveal>
    </section>
  );
}

function ProjectsSection({ c }) {
  return (
    <section className="aflux-section" id="projects">
      <MotionTitle className="aflux-section-label" as="p">
        03 — Selected work
      </MotionTitle>
      <div className="aflux-projects-bento">
        {c.projects?.map((project, index) => (
          <MotionCard
            key={`${project.title}-${index}`}
            className={`aflux-project-card tpl-interactive-card${project.featured ? ' aflux-project-card--featured' : ''}`}
            delay={index * 0.07}
          >
            <div className="aflux-project-glow" aria-hidden="true" />
            <div className="aflux-project-inner">
              <span className="aflux-project-index">0{index + 1}</span>
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
                <div className="aflux-project-tech">
                  {project.tech.map((tech) => (
                    <TechBadge key={`${project.title}-${tech}`} name={tech} />
                  ))}
                </div>
              )}
              {project.link && (
                <a href={project.link} className="aflux-project-link" target="_blank" rel="noreferrer">
                  View project →
                </a>
              )}
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="aflux-section" id="experience">
      <MotionTitle className="aflux-section-label" as="p">
        04 — Journey
      </MotionTitle>
      <div className="aflux-timeline">
        {c.experience?.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="aflux-timeline-item" delay={index * 0.1}>
            <div className="aflux-timeline-dot" aria-hidden="true" />
            <div className="aflux-timeline-card tpl-interactive-card">
              <div className="aflux-timeline-head">
                <h3>
                  <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                    {job.role}
                  </EditableText>
                </h3>
                <span className="aflux-timeline-period">
                  <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                    {job.period}
                  </EditableText>
                </span>
              </div>
              <p className="aflux-timeline-company">
                <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                  {job.company}
                </EditableText>
              </p>
              <p className="aflux-timeline-desc">
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
    <section className="aflux-section aflux-section--contact" id="contact">
      <MotionCard className="aflux-contact-card tpl-interactive-card">
        <div className="aflux-contact-border" aria-hidden="true" />
        <MotionTitle className="aflux-section-label" as="p">
          05 — Contact
        </MotionTitle>
        <h2 className="aflux-contact-title">
          <EditableText field="contact.title" section="contact" label="Title" as="span">
            {contact.title}
          </EditableText>
        </h2>
        <p className="aflux-contact-sub">
          <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
            {contact.subtitle}
          </EditableText>
        </p>
        <div className="aflux-contact-actions">
          <MotionPressable
            as="a"
            href={`mailto:${contact.email || c.links?.email || ''}`}
            className="aflux-btn aflux-btn--primary tpl-motion-btn"
          >
            <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
              {contact.buttonText}
            </EditableText>
          </MotionPressable>
          {c.links?.resume && (
            <a href={c.links.resume} className="aflux-btn aflux-btn--ghost" target="_blank" rel="noreferrer">
              Resume
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

export default function AuroraFluxTemplate({
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
        className={`aflux${preview ? ' aflux--preview' : ''}${compact ? ' aflux--compact' : ''}${editable ? ' aflux--editable' : ''}${theme ? ` aflux--theme-${theme.id}` : ''}`}
        style={theme?.vars}
      >
        <AuroraBackground />

        <header className="aflux-header">
          <TemplateMobileNav
            variant="aflux"
            brand={c.brandTag || c.name}
            brandHref="#hero"
            onBrandClick={(e) => handleSectionNav(e, 'hero')}
            sectionLinks={sectionLinks}
            preview={preview}
          >
            <nav className="aflux-dock" aria-label="Main navigation">
              <a href="#hero" className="aflux-dock-brand" onClick={(e) => handleSectionNav(e, 'hero')}>
                <span className="aflux-dock-brand-dot" aria-hidden="true" />
                <EditableText field="brandTag" section="hero" label="Brand" as="span">
                  {c.brandTag}
                </EditableText>
              </a>
              <div className="aflux-dock-links">
                {visibleNav.map((item) => (
                  <a
                    key={item.section}
                    href={`#${item.section}`}
                    className="aflux-dock-link"
                    onClick={(e) => handleSectionNav(e, item.section)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </TemplateMobileNav>
        </header>

        <main className="aflux-main">
          <section className="aflux-hero" id="hero">
            <div className="aflux-hero-layout">
              <div className="aflux-hero-copy">
                <MotionHero className="aflux-hero-badge-row" as="div">
                  {c.availability && (
                    <span className="aflux-pill">
                      <span className="aflux-pill-dot" aria-hidden="true" />
                      <EditableText field="availability" section="hero" label="Availability" as="span">
                        {c.availability}
                      </EditableText>
                    </span>
                  )}
                  {c.location && (
                    <span className="aflux-pill aflux-pill--muted">
                      <EditableText field="location" section="hero" label="Location" as="span">
                        {c.location}
                      </EditableText>
                    </span>
                  )}
                </MotionHero>

                <MotionHero as="p" className="aflux-hero-greeting" delay={0.05}>
                  <EditableText field="greeting" section="hero" label="Greeting" as="span">
                    {c.greeting}
                  </EditableText>
                </MotionHero>

                <MotionHero as="h1" className="aflux-hero-title" delay={0.1}>
                  <EditableText field="name" section="hero" label="Name" as="span">
                    {c.name}
                  </EditableText>
                  <span className="aflux-hero-accent">
                    {' '}
                    <EditableText field="headlineAccent" section="hero" label="Accent phrase" as="span">
                      {c.headlineAccent}
                    </EditableText>
                  </span>
                </MotionHero>

                <MotionHero className="aflux-hero-roles" delay={0.16}>
                  <TypingRoles roles={c.typingRoles} active={!preview} />
                </MotionHero>

                <MotionHero as="p" className="aflux-hero-tagline" delay={0.22}>
                  <EditableText field="tagline" section="hero" label="Tagline" multiline as="span">
                    {c.tagline}
                  </EditableText>
                </MotionHero>

                <MotionHero className="aflux-hero-ctas" delay={0.28}>
                  <MotionPressable
                    as="a"
                    href="#projects"
                    className="aflux-btn aflux-btn--primary tpl-motion-btn"
                    onClick={(e) => handleSectionNav(e, 'projects')}
                  >
                    See my work
                  </MotionPressable>
                  <MotionPressable
                    as="a"
                    href="#contact"
                    className="aflux-btn aflux-btn--ghost tpl-motion-btn"
                    onClick={(e) => handleSectionNav(e, 'contact')}
                  >
                    Let&apos;s talk
                  </MotionPressable>
                </MotionHero>

                <MotionHero delay={0.34}>
                  <SocialDock links={c.links} />
                </MotionHero>
              </div>

              <MotionHero className="aflux-hero-visual" delay={0.12}>
                <div className="aflux-orbit-scene" aria-hidden="true">
                  <span className="aflux-orbit-ring aflux-orbit-ring--1" />
                  <span className="aflux-orbit-ring aflux-orbit-ring--2" />
                  <span className="aflux-orbit-ring aflux-orbit-ring--3" />
                  <span className="aflux-orbit-sat aflux-orbit-sat--1" />
                  <span className="aflux-orbit-sat aflux-orbit-sat--2" />
                </div>
                <ProfilePhoto
                  image={c.profileImage}
                  name={c.name}
                  className="aflux-hero-avatar"
                  emptyClassName="aflux-hero-avatar--empty"
                  initialsClassName="aflux-hero-avatar-initials"
                />
              </MotionHero>
            </div>
          </section>

          <SectionStack order={order} renderers={SECTION_RENDERERS} content={c} preview={preview} editable={editable} />
        </main>

        <footer className="aflux-footer">
          <EditableText field="footer" section="hero" label="Footer" as="span">
            {c.footer}
          </EditableText>
        </footer>
      </div>
    </TemplateMotionProvider>
  );
}
