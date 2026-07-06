import { lumenBloomContent as defaultContent } from './lumen-bloom.content';
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
import PaperBackdrop from './components/PaperBackdrop';
import FlipRoles from './components/FlipRoles';
import './lumen-bloom.css';

const DEFAULT_ORDER = ['about', 'skills', 'projects', 'experience', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function isHashLink(value) {
  return typeof value === 'string' && value.startsWith('#');
}

function SocialRow({ links }) {
  const items = [
    links?.github && { key: 'github', href: links.github },
    links?.linkedin && { key: 'linkedin', href: links.linkedin },
    links?.instagram && { key: 'instagram', href: links.instagram },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="lbloom-social">
      {items.map((item) => (
        <MotionPressable
          key={item.key}
          as="a"
          href={item.href}
          className="lbloom-social-link tpl-motion-btn"
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
    <section className="lbloom-section" id="about">
      <div className="lbloom-section-head">
        <MotionTitle className="lbloom-eyebrow" as="p">
          About
        </MotionTitle>
        <MotionTitle className="lbloom-section-title" as="h2">
          A little more context
        </MotionTitle>
      </div>
      <div className="lbloom-about-grid">
        <MotionCard className="lbloom-about-main tpl-interactive-card">
          <blockquote className="lbloom-pullquote">
            <EditableText field="pullQuote" section="about" label="Pull quote" multiline as="span">
              {c.pullQuote}
            </EditableText>
          </blockquote>
          <p className="lbloom-about-text">
            <EditableText field="about" section="about" label="About" multiline as="span">
              {c.about}
            </EditableText>
          </p>
        </MotionCard>
        <div className="lbloom-stat-stack">
          {(c.highlights || []).map((item, index) => (
            <MotionCard
              key={`${item.label}-${index}`}
              className="lbloom-stat-card tpl-interactive-card"
              delay={index * 0.08}
            >
              <span className="lbloom-stat-value">
                <EditableText field={`highlights.${index}.value`} section="about" label="Stat value" as="span">
                  {item.value}
                </EditableText>
              </span>
              <span className="lbloom-stat-label">
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
    <section className="lbloom-section" id="skills">
      <div className="lbloom-section-head">
        <MotionTitle className="lbloom-eyebrow" as="p">
          Skills
        </MotionTitle>
        <MotionTitle className="lbloom-section-title" as="h2">
          Tools I reach for
        </MotionTitle>
      </div>
      <div className="lbloom-skill-mosaic">
        {(c.skillGroups || []).map((group, groupIndex) => (
          <MotionCard
            key={`${group.name}-${groupIndex}`}
            className="lbloom-skill-column tpl-interactive-card"
            delay={groupIndex * 0.1}
          >
            <h3 className="lbloom-skill-heading">{group.name}</h3>
            <div className="lbloom-skill-chips">
              {group.items?.map((skill) => (
                <span key={`${group.name}-${skill}`} className="lbloom-skill-chip">
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
    <section className="lbloom-section lbloom-section--projects" id="projects">
      <div className="lbloom-section-head lbloom-section-head--row">
        <div>
          <MotionTitle className="lbloom-eyebrow" as="p">
            Selected work
          </MotionTitle>
          <MotionTitle className="lbloom-section-title" as="h2">
            Case studies & launches
          </MotionTitle>
        </div>
        <span className="lbloom-scroll-hint">Scroll →</span>
      </div>
      <MotionReveal className="lbloom-project-track-wrap">
        <div className="lbloom-project-track">
          {c.projects?.map((project, index) => (
            <MotionCard
              key={`${project.title}-${index}`}
              className={`lbloom-project-card tpl-interactive-card${project.featured ? ' lbloom-project-card--featured' : ''}`}
              delay={index * 0.07}
            >
              <span className="lbloom-project-num">0{index + 1}</span>
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
                <div className="lbloom-project-tech">
                  {project.tech.map((tech) => (
                    <TechBadge key={`${project.title}-${tech}`} name={tech} />
                  ))}
                </div>
              )}
              {project.link && (
                <a href={project.link} className="lbloom-project-link" target="_blank" rel="noreferrer">
                  View case study
                </a>
              )}
            </MotionCard>
          ))}
        </div>
      </MotionReveal>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="lbloom-section" id="experience">
      <div className="lbloom-section-head">
        <MotionTitle className="lbloom-eyebrow" as="p">
          Journey
        </MotionTitle>
        <MotionTitle className="lbloom-section-title" as="h2">
          Where I&apos;ve been
        </MotionTitle>
      </div>
      <div className="lbloom-story-list">
        {c.experience?.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="lbloom-story-item" delay={index * 0.1}>
            <div className="lbloom-story-marker" aria-hidden="true" />
            <div className="lbloom-story-card tpl-interactive-card">
              <div className="lbloom-story-top">
                <h3>
                  <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                    {job.role}
                  </EditableText>
                </h3>
                <span className="lbloom-story-period">
                  <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                    {job.period}
                  </EditableText>
                </span>
              </div>
              <p className="lbloom-story-company">
                <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                  {job.company}
                </EditableText>
              </p>
              <p className="lbloom-story-desc">
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
    <section className="lbloom-section lbloom-section--contact" id="contact">
      <MotionCard className="lbloom-contact-card tpl-interactive-card">
        <MotionTitle className="lbloom-eyebrow" as="p">
          Contact
        </MotionTitle>
        <h2 className="lbloom-contact-title">
          <EditableText field="contact.title" section="contact" label="Title" as="span">
            {contact.title}
          </EditableText>
        </h2>
        <p className="lbloom-contact-sub">
          <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
            {contact.subtitle}
          </EditableText>
        </p>
        <div className="lbloom-contact-actions">
          <MotionPressable
            as="a"
            href={`mailto:${contact.email || c.links?.email || ''}`}
            className="lbloom-btn lbloom-btn--primary tpl-motion-btn"
          >
            <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
              {contact.buttonText}
            </EditableText>
          </MotionPressable>
          {c.links?.resume && (
            <a href={c.links.resume} className="lbloom-btn lbloom-btn--soft" target="_blank" rel="noreferrer">
              Download resume
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

export default function LumenBloomTemplate({
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
        className={`lbloom${preview ? ' lbloom--preview' : ''}${compact ? ' lbloom--compact' : ''}${editable ? ' lbloom--editable' : ''}${theme ? ` lbloom--theme-${theme.id}` : ''}`}
        style={theme?.vars}
      >
        <PaperBackdrop />

        <header className="lbloom-header">
          <TemplateMobileNav
            variant="lbloom"
            brand={c.brandTag || c.name}
            brandHref="#hero"
            onBrandClick={(e) => handleSectionNav(e, 'hero')}
            sectionLinks={sectionLinks}
            preview={preview}
          >
            <nav className="lbloom-ribbon" aria-label="Main navigation">
              <a href="#hero" className="lbloom-ribbon-brand" onClick={(e) => handleSectionNav(e, 'hero')}>
                <EditableText field="brandTag" section="hero" label="Brand" as="span">
                  {c.brandTag}
                </EditableText>
              </a>
              <div className="lbloom-ribbon-tabs">
                {visibleNav.map((item) => (
                  <a
                    key={item.section}
                    href={`#${item.section}`}
                    className="lbloom-ribbon-tab"
                    onClick={(e) => handleSectionNav(e, item.section)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </TemplateMobileNav>
        </header>

        <main className="lbloom-main">
          <section className="lbloom-hero" id="hero">
            <div className="lbloom-hero-grid">
              <div className="lbloom-hero-copy">
                <MotionHero className="lbloom-hero-meta" as="div">
                  {c.availability && (
                    <span className="lbloom-stamp">
                      <EditableText field="availability" section="hero" label="Availability" as="span">
                        {c.availability}
                      </EditableText>
                    </span>
                  )}
                  {c.location && (
                    <span className="lbloom-location">
                      <EditableText field="location" section="hero" label="Location" as="span">
                        {c.location}
                      </EditableText>
                    </span>
                  )}
                </MotionHero>

                <MotionHero as="p" className="lbloom-hero-greeting" delay={0.05}>
                  <EditableText field="greeting" section="hero" label="Greeting" as="span">
                    {c.greeting}
                  </EditableText>
                </MotionHero>

                <MotionHero as="h1" className="lbloom-hero-title" delay={0.1}>
                  <EditableText field="name" section="hero" label="Name" as="span">
                    {c.name}
                  </EditableText>
                  <span className="lbloom-hero-accent">
                    {' '}
                    <EditableText field="headlineAccent" section="hero" label="Accent phrase" as="span">
                      {c.headlineAccent}
                    </EditableText>
                  </span>
                </MotionHero>

                <MotionHero className="lbloom-hero-roles" delay={0.16}>
                  <span className="lbloom-hero-roles-label">Currently a</span>
                  <FlipRoles roles={c.flipRoles} active={!preview} />
                </MotionHero>

                <MotionHero as="p" className="lbloom-hero-tagline" delay={0.22}>
                  <EditableText field="tagline" section="hero" label="Tagline" multiline as="span">
                    {c.tagline}
                  </EditableText>
                </MotionHero>

                <MotionHero className="lbloom-hero-actions" delay={0.28}>
                  {(() => {
                    const primaryHref = c.heroPrimaryButtonHref || '#projects';
                    const primaryLabel = c.heroPrimaryButtonLabel || 'See selected work';
                    return (
                  <MotionPressable
                    as="a"
                    href={primaryHref}
                    className="lbloom-btn lbloom-btn--primary tpl-motion-btn"
                    onClick={isHashLink(primaryHref) ? (e) => handleSectionNav(e, primaryHref.slice(1)) : undefined}
                    target={isHashLink(primaryHref) ? undefined : '_blank'}
                    rel={isHashLink(primaryHref) ? undefined : 'noreferrer'}
                  >
                    {primaryLabel}
                  </MotionPressable>
                    );
                  })()}
                  {(() => {
                    const secondaryHref = c.heroSecondaryButtonHref || '#contact';
                    const secondaryLabel = c.heroSecondaryButtonLabel || 'Start a conversation';
                    return (
                  <MotionPressable
                    as="a"
                    href={secondaryHref}
                    className="lbloom-btn lbloom-btn--soft tpl-motion-btn"
                    onClick={isHashLink(secondaryHref) ? (e) => handleSectionNav(e, secondaryHref.slice(1)) : undefined}
                    target={isHashLink(secondaryHref) ? undefined : '_blank'}
                    rel={isHashLink(secondaryHref) ? undefined : 'noreferrer'}
                  >
                    {secondaryLabel}
                  </MotionPressable>
                    );
                  })()}
                </MotionHero>

                <MotionHero delay={0.34}>
                  <SocialRow links={c.links} />
                </MotionHero>
              </div>

              <MotionHero className="lbloom-hero-visual" delay={0.12}>
                <div className="lbloom-polaroid">
                  <div className="lbloom-polaroid-tape" aria-hidden="true" />
                  <ProfilePhoto
                    image={c.profileImage}
                    name={c.name}
                    className="lbloom-polaroid-photo"
                    emptyClassName="lbloom-polaroid-photo--empty"
                    initialsClassName="lbloom-polaroid-initials"
                  />
                  <p className="lbloom-polaroid-caption">
                    <EditableText field="name" section="hero" label="Name" as="span">
                      {c.name}
                    </EditableText>
                  </p>
                </div>
              </MotionHero>
            </div>
          </section>

          <SectionStack order={order} renderers={SECTION_RENDERERS} content={c} preview={preview} editable={editable} />
        </main>

        <footer className="lbloom-footer">
          <EditableText field="footer" section="hero" label="Footer" as="span">
            {c.footer}
          </EditableText>
        </footer>
      </div>
    </TemplateMotionProvider>
  );
}
