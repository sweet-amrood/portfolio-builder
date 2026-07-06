import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaBriefcase } from 'react-icons/fa';
import { developerClassicContent as defaultContent } from './developer-classic.content';
import SectionStack from '../shared/SectionStack';
import ProfilePhoto from '../shared/ProfilePhoto';
import ProjectCover from '../shared/ProjectCover';
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
import { ToolIconTile } from '../../components/DevToolIcon';
import { resolveDevToolIcon } from '../../constants/devToolIcons';
import EditableText from '../../components/builder/EditableText';
import { scrollToSection } from '../../utils/scrollToSection';
import './developer-classic.css';

const DEFAULT_ORDER = ['expertise', 'experience', 'projects', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function SocialRow({ links, className = '' }) {
  const items = [
    links?.github && { key: 'github', href: links.github },
    links?.linkedin && { key: 'linkedin', href: links.linkedin },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className={`dcls-socials ${className}`.trim()}>
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className="dcls-social-link tpl-motion-link"
          target="_blank"
          rel="noreferrer"
          aria-label={item.key}
        >
          <SocialBrandIcon name={item.key} />
        </a>
      ))}
    </div>
  );
}

function HeroSection({ c, onNavigate }) {
  return (
    <section className="dcls-hero" id="hero">
      <div className="dcls-hero-layers" aria-hidden="true">
        <div className="dcls-hero-parallax" />
        <div className="dcls-hero-overlay" />
        <span className="dcls-hero-orb dcls-hero-orb--1" />
        <span className="dcls-hero-orb dcls-hero-orb--2" />
        <span className="dcls-hero-grid" />
      </div>
      <div className="dcls-hero-inner">
        <MotionHero className="dcls-hero-profile">
          <ProfilePhoto
            image={c.profileImage}
            name={c.name}
            className="dcls-avatar"
            emptyClassName="dcls-avatar--empty"
            initialsClassName="dcls-avatar-initials"
          />
          {c.availability && (
            <span className="dcls-hero-badge">
              <span className="dcls-hero-badge-dot" aria-hidden="true" />
              <EditableText field="availability" section="hero" label="Availability" as="span">
                {c.availability}
              </EditableText>
            </span>
          )}
        </MotionHero>
        <div className="dcls-hero-content">
          <MotionHero className="dcls-hero-socials dcls-hero-socials--desktop" delay={0.04}>
            <SocialRow links={c.links} />
          </MotionHero>
          <MotionHero as="h1" delay={0.08}>
            <EditableText field="name" section="hero" label="Name" as="span">
              {c.name}
            </EditableText>
          </MotionHero>
          <MotionHero className="dcls-hero-role" as="p" delay={0.12}>
            <EditableText field="tagline" section="hero" label="Tagline" as="span">
              {c.tagline}
            </EditableText>
          </MotionHero>
          {c.heroBio && (
            <MotionHero className="dcls-hero-bio" as="p" delay={0.16}>
              <EditableText field="heroBio" section="hero" label="Bio" multiline as="span">
                {c.heroBio}
              </EditableText>
            </MotionHero>
          )}
          <MotionHero className="dcls-hero-actions" delay={0.2}>
            <MotionPressable
              as="a"
              href="#projects"
              className="dcls-btn dcls-btn--primary dcls-btn--hero tpl-motion-btn"
              onClick={(e) => onNavigate(e, 'projects')}
            >
              View Projects
            </MotionPressable>
            <MotionPressable
              as="a"
              href="#contact"
              className="dcls-btn dcls-btn--ghost dcls-btn--hero tpl-motion-btn"
              onClick={(e) => onNavigate(e, 'contact')}
            >
              Contact Me
            </MotionPressable>
            {c.links?.resume && (
              <MotionPressable
                as="a"
                href={c.links.resume}
                className="dcls-btn dcls-btn--outline dcls-btn--hero tpl-motion-btn"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </MotionPressable>
            )}
          </MotionHero>
          <MotionHero className="dcls-hero-socials dcls-hero-socials--mobile" delay={0.24}>
            <SocialRow links={c.links} />
          </MotionHero>
        </div>
      </div>
    </section>
  );
}

function TechStackIcon({ name }) {
  const hasIcon = Boolean(resolveDevToolIcon(name));

  if (hasIcon) {
    return (
      <span className="dcls-tech-icon" title={name} aria-label={name}>
        <ToolIconTile name={name} size={18} />
      </span>
    );
  }

  return (
    <span className="dcls-tech-icon dcls-tech-icon--fallback" title={name} aria-label={name}>
      <span>{name.trim().charAt(0).toUpperCase()}</span>
    </span>
  );
}

function ExpertiseSection({ c }) {
  return (
    <section className="dcls-section" id="expertise">
      <div className="dcls-section-inner">
        <MotionTitle className="dcls-section-title" as="h2">
          Expertise
        </MotionTitle>
        <div className="dcls-expertise-grid">
          {c.expertiseGroups?.map((group, index) => (
            <MotionCard key={`${group.title}-${index}`} className="dcls-expertise-card" delay={index * 0.08}>
              <div className="dcls-icon-round dcls-icon-round--lg">
                <ToolIconTile name={group.icon || group.tech?.[0] || 'Code'} size={28} className="dcls-expertise-icon" />
              </div>
              <h3>
                <EditableText field={`expertiseGroups.${index}.title`} section="expertise" label="Group title" as="span">
                  {group.title}
                </EditableText>
              </h3>
              <p>
                <EditableText
                  field={`expertiseGroups.${index}.description`}
                  section="expertise"
                  label="Description"
                  multiline
                  as="span"
                >
                  {group.description}
                </EditableText>
              </p>
              {group.tech?.length > 0 && (
                <div className="dcls-tech-stack">
                  <span className="dcls-chips-label">Tech stack:</span>
                  <div className="dcls-tech-icons">
                    {group.tech.map((item) => (
                      <TechStackIcon key={item} name={item} />
                    ))}
                  </div>
                </div>
              )}
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="dcls-section dcls-section--timeline" id="experience">
      <div className="dcls-section-inner">
        <MotionTitle className="dcls-section-title" as="h2">
          Career History
        </MotionTitle>
        <div className="dcls-timeline">
          {c.experience?.map((job, index) => (
            <MotionReveal
              key={`${job.role}-${index}`}
              className={`dcls-timeline-item${index % 2 === 0 ? ' dcls-timeline-item--left' : ' dcls-timeline-item--right'}`}
              delay={index * 0.08}
            >
              <div className="dcls-timeline-marker" aria-hidden="true">
                <FaBriefcase size={14} />
              </div>
              <article className="dcls-timeline-card tpl-interactive-card">
                <span className="dcls-timeline-date">
                  <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                    {job.period}
                  </EditableText>
                </span>
                <h3>
                  <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                    {job.role}
                  </EditableText>
                </h3>
                {job.location && (
                  <h4>
                    <EditableText field={`experience.${index}.location`} section="experience" label="Location" as="span">
                      {job.location}
                    </EditableText>
                  </h4>
                )}
                <p>
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
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ c }) {
  return (
    <section className="dcls-section" id="projects">
      <div className="dcls-section-inner">
        <MotionTitle className="dcls-section-title" as="h2">
          Personal Projects
        </MotionTitle>
        <MotionStagger className="dcls-projects-grid">
          {c.projects?.map((project, index) => (
            <MotionStaggerItem key={`${project.title}-${index}`}>
              <article className="dcls-project-card tpl-interactive-card">
                <a
                  href={project.link || '#'}
                  className="dcls-project-visual"
                  target={project.link && project.link !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  onClick={project.link === '#' ? (e) => e.preventDefault() : undefined}
                >
                  <ProjectCover
                    image={project.image}
                    imageClassName="dcls-project-img"
                    placeholderClassName="dcls-project-placeholder"
                    alt={project.title}
                  />
                  <span className="dcls-project-overlay" aria-hidden="true">
                    View project
                  </span>
                </a>
                <a
                  href={project.link || '#'}
                  className="dcls-project-title-link tpl-motion-link"
                  target={project.link && project.link !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  onClick={project.link === '#' ? (e) => e.preventDefault() : undefined}
                >
                  <h3>
                    <EditableText field={`projects.${index}.title`} section="projects" label="Title" as="span">
                      {project.title}
                    </EditableText>
                  </h3>
                </a>
                <p>
                  <EditableText field={`projects.${index}.subtitle`} section="projects" label="Subtitle" multiline as="span">
                    {project.subtitle}
                  </EditableText>
                </p>
              </article>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}

function ContactSection({ c, preview }) {
  const contact = { ...defaultContent.contact, ...c.contact };

  return (
    <section className="dcls-section" id="contact">
      <div className="dcls-section-inner">
        <div className="dcls-contact-wrap">
          <MotionTitle className="dcls-section-title" as="h2">
            <EditableText field="contact.title" section="contact" label="Title" as="span">
              {contact.title}
            </EditableText>
          </MotionTitle>
          <MotionReveal className="dcls-contact-sub" as="p" delay={0.06}>
            <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
              {contact.subtitle}
            </EditableText>
          </MotionReveal>
          <MotionReveal className="dcls-form" delay={0.1}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="dcls-form-row">
                <label className="dcls-field">
                  <span>Your Name</span>
                  <input type="text" placeholder="What's your name?" readOnly={preview} />
                </label>
                <label className="dcls-field">
                  <span>Email / Phone</span>
                  <input type="text" placeholder="How can I reach you?" readOnly={preview} />
                </label>
              </div>
              <label className="dcls-field dcls-field--full">
                <span>Message</span>
                <textarea rows={8} placeholder="Send me any inquiries or questions" readOnly={preview} />
              </label>
              <MotionPressable type="submit" className="dcls-btn dcls-btn--primary tpl-motion-btn">
                <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
                  {contact.buttonText || 'Send'}
                </EditableText>
              </MotionPressable>
            </form>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

const SECTION_RENDERERS = {
  expertise: ExpertiseSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  contact: ContactSection,
};

function DeveloperClassicNav({ c, order, onNavigate }) {
  const [open, setOpen] = useState(false);

  const visibleNav = c.nav.filter((item) => {
    if (item.section === 'hero') return true;
    return order.includes(item.section);
  });

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [open]);

  return (
    <header className="dcls-nav">
      <div className="dcls-nav-bar">
        <button
          type="button"
          className="dcls-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
        <nav className="dcls-nav-links" aria-label="Main navigation">
          {visibleNav.map((item) => (
            <a
              key={item.section}
              href={`#${item.section}`}
              className="dcls-nav-link"
              onClick={(e) => {
                onNavigate(e, item.section);
                setOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {open && (
        <div className="dcls-nav-drawer">
          <p className="dcls-nav-drawer-title">
            <HiMenu size={18} aria-hidden="true" />
            Menu
          </p>
          <nav aria-label="Mobile navigation">
            {visibleNav.map((item) => (
              <a
                key={item.section}
                href={`#${item.section}`}
                className="dcls-nav-drawer-link"
                onClick={(e) => {
                  onNavigate(e, item.section);
                  setOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
      {open && <button type="button" className="dcls-nav-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </header>
  );
}

export default function DeveloperClassicTemplate({
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

  const onNavigate = (event, sectionId) => handleSectionNav(event, sectionId);

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
      <div
        className={`dcls${preview ? ' dcls--preview' : ''}${compact ? ' dcls--compact' : ''}${editable ? ' dcls--editable' : ''}${theme ? ` dcls--theme-${theme.id}` : ''}`}
        style={theme?.vars}
      >
        <DeveloperClassicNav c={c} order={order} onNavigate={onNavigate} />
        <HeroSection c={c} onNavigate={onNavigate} />
        {showFull && (
          <>
            <SectionStack
              order={order}
              renderers={SECTION_RENDERERS}
              content={c}
              preview={preview}
              editable={editable}
            />
            <footer className="dcls-footer">
              <SocialRow links={c.links} className="dcls-footer-socials" />
              <p>
                <EditableText field="footer" section="hero" label="Footer" as="span">
                  {c.footer}
                </EditableText>
              </p>
            </footer>
          </>
        )}
        {!showFull && <ExpertiseSection c={c} />}
      </div>
    </TemplateMotionProvider>
  );
}
