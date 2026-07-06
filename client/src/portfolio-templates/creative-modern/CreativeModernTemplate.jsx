import { useState, useEffect } from 'react';
import { creativeModernContent as defaultContent } from './creative-modern.content';
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
import HeroScene from './components/HeroScene';
import './creative-modern.css';

const DEFAULT_ORDER = ['about', 'services', 'projects', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function TypingRoles({ roles, active }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active || !roles?.length) return undefined;
    const current = roles[index % roles.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 70);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex((value) => (value + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, roles, active]);

  return (
    <span className="cmod-typing">
      {text}
      <span className="cmod-typing-cursor" aria-hidden="true">|</span>
    </span>
  );
}

function ParticleField() {
  return (
    <div className="cmod-particles" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <span key={i} className="cmod-particle" style={{ '--i': i }} />
      ))}
    </div>
  );
}

function SectionHeading({ children, subtitle }) {
  return (
    <div className="cmod-section-head">
      <MotionTitle className="cmod-section-title" as="h2">
        {children}
      </MotionTitle>
      {subtitle ? (
        <MotionReveal className="cmod-section-sub" as="p" delay={0.06}>
          {subtitle}
        </MotionReveal>
      ) : null}
    </div>
  );
}

function SocialLinks({ links, className = '' }) {
  const items = [
    links?.github && { key: 'github', href: links.github, label: 'GitHub' },
    links?.linkedin && { key: 'linkedin', href: links.linkedin, label: 'LinkedIn' },
    links?.stackoverflow && { key: 'stackoverflow', href: links.stackoverflow, label: 'Stack Overflow' },
    links?.instagram && { key: 'instagram', href: links.instagram, label: 'Instagram' },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className={`cmod-socials ${className}`.trim()}>
      {items.map((item) => (
        <MotionPressable
          key={item.key}
          as="a"
          href={item.href}
          className="cmod-social-btn tpl-motion-btn"
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          title={item.label}
        >
          <SocialBrandIcon name={item.key} />
        </MotionPressable>
      ))}
    </div>
  );
}

function AboutSection({ c }) {
  const skills = c.skillGroups?.flatMap((group) => group.items) || [];

  return (
    <section className="cmod-section" id="about">
      <SectionHeading subtitle={c.aboutTitle}>About Me</SectionHeading>
      <div className="cmod-about-grid">
        <MotionCard className="cmod-about-block" delay={0}>
          <h3>
            <EditableText field="aboutTitle" section="about" label="About title" as="span">
              {c.aboutTitle}
            </EditableText>
          </h3>
          <p>
            <EditableText field="about" section="about" label="About text" multiline as="span">
              {c.about}
            </EditableText>
          </p>
        </MotionCard>
        <MotionCard className="cmod-about-block" delay={0.08}>
          <h3>
            <EditableText field="toolsTitle" section="about" label="Tools title" as="span">
              {c.toolsTitle}
            </EditableText>
          </h3>
          <p>
            <EditableText field="toolsIntro" section="about" label="Tools intro" multiline as="span">
              {c.toolsIntro}
            </EditableText>
          </p>
        </MotionCard>
      </div>
      {skills.length > 0 && (
        <MotionStagger className="cmod-skill-grid">
          {skills.map((item, index) => (
            <MotionStaggerItem key={`${item}-${index}`}>
              <div className="cmod-skill-chip">
                <TechBadge name={item} className="cmod-skill-badge" />
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      )}
    </section>
  );
}

function ServicesSection({ c }) {
  return (
    <section className="cmod-section" id="services">
      <SectionHeading subtitle="What I Provide">Services</SectionHeading>
      <div className="cmod-services-grid">
        {c.services?.map((service, index) => (
          <MotionCard
            key={`${service.name}-${index}`}
            className="cmod-service-card tpl-interactive-card"
            delay={index * 0.08}
          >
            <span className="cmod-service-icon" aria-hidden="true">{service.icon}</span>
            <h3>
              <EditableText field={`services.${index}.name`} section="services" label="Service name" as="span">
                {service.name}
              </EditableText>
            </h3>
            <p>
              <EditableText field={`services.${index}.desc`} section="services" label="Description" multiline as="span">
                {service.desc}
              </EditableText>
            </p>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ c }) {
  const [expanded, setExpanded] = useState(false);
  const projects = c.projects || [];
  const visible = expanded ? projects : projects.slice(0, 3);

  return (
    <section className="cmod-section" id="projects">
      <SectionHeading subtitle="What I Built">Projects</SectionHeading>
      <div className="cmod-projects-grid">
        {visible.map((project, index) => (
          <MotionCard
            key={`${project.title}-${index}`}
            className="cmod-project-card tpl-interactive-card"
            delay={index * 0.06}
          >
            <div className="cmod-project-visual">
              <ProjectCover
                image={project.image}
                imageClassName="cmod-project-visual-img"
                placeholderClassName="cmod-project-visual-placeholder"
                alt={project.title}
              />
            </div>
            <div className="cmod-project-body">
              <h3>
                <EditableText field={`projects.${index}.title`} section="projects" label="Title" as="span">
                  {project.title}
                </EditableText>
              </h3>
              <p>
                <EditableText field={`projects.${index}.subtitle`} section="projects" label="Subtitle" multiline as="span">
                  {project.subtitle}
                </EditableText>
              </p>
              {project.tech?.length > 0 && (
                <div className="cmod-project-tech">
                  {project.tech.map((item) => (
                    <TechBadge key={item} name={item} className="cmod-tech-chip" />
                  ))}
                </div>
              )}
              {project.link && project.link !== '#' && (
                <a href={project.link} className="cmod-project-link tpl-motion-link" target="_blank" rel="noreferrer">
                  View project ↗
                </a>
              )}
            </div>
          </MotionCard>
        ))}
      </div>
      {projects.length > 3 && !expanded && (
        <MotionPressable type="button" className="cmod-btn cmod-btn--outline cmod-show-more tpl-motion-btn" onClick={() => setExpanded(true)}>
          <EditableText field="projectsShowMore" section="projects" label="Show more label" as="span">
            {c.projectsShowMore || 'Show More'}
          </EditableText>
        </MotionPressable>
      )}
    </section>
  );
}

function ContactSection({ c, preview }) {
  const contact = { ...defaultContent.contact, ...c.contact };

  return (
    <section className="cmod-section cmod-contact" id="contact">
      <SectionHeading subtitle="Connect with me">
        <EditableText field="contact.title" section="contact" label="Title" as="span">
          {contact.title}
        </EditableText>
      </SectionHeading>
      <MotionReveal className="cmod-contact-intro" as="p">
        <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
          {contact.subtitle}
        </EditableText>
      </MotionReveal>
      <div className="cmod-contact-grid">
        <MotionReveal className="cmod-form" delay={0.08}>
          <form onSubmit={(e) => e.preventDefault()}>
          <Field label="Name">
            <input type="text" placeholder="Your name" readOnly={preview} />
          </Field>
          <Field label="Email">
            <input type="email" placeholder="you@example.com" readOnly={preview} />
          </Field>
          <Field label="Message">
            <textarea rows={4} placeholder="Your message..." readOnly={preview} />
          </Field>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="cmod-btn cmod-btn--ghost cmod-direct-email tpl-motion-link">
              <EditableText field="contact.directEmailLabel" section="contact" label="Direct email label" as="span">
                {contact.directEmailLabel || 'Send me email directly'}
              </EditableText>
            </a>
          )}
          <MotionPressable type="submit" className="cmod-btn cmod-btn--primary tpl-motion-btn">
            <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
              {contact.buttonText || 'Submit'}
            </EditableText>
          </MotionPressable>
          </form>
        </MotionReveal>
        <MotionReveal className="cmod-contact-info" delay={0.12} as="aside">
          {contact.email && (
            <div className="cmod-info-block">
              <span className="cmod-info-label">Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          )}
          {(contact.address || contact.country) && (
            <div className="cmod-info-block">
              <span className="cmod-info-label">Address</span>
              <p>
                <EditableText field="contact.address" section="contact" label="Address" multiline as="span">
                  {contact.address}
                </EditableText>
                {contact.address && contact.country ? <br /> : null}
                <EditableText field="contact.country" section="contact" label="Country" as="span">
                  {contact.country}
                </EditableText>
              </p>
            </div>
          )}
          <div className="cmod-info-block">
            <span className="cmod-info-label">Social</span>
            <SocialLinks links={c.links} />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="cmod-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

const SECTION_RENDERERS = {
  about: AboutSection,
  services: ServicesSection,
  projects: ProjectsSection,
  contact: ContactSection,
};

export default function CreativeModernTemplate({
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

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
    <div
      className={`cmod${preview ? ' cmod--preview' : ''}${compact ? ' cmod--compact' : ''}${editable ? ' cmod--editable' : ''}${theme ? ` cmod--theme-${theme.id}` : ''}`}
      style={theme?.vars}
    >
      <ParticleField />
      <div className="cmod-cloud cmod-cloud--1" aria-hidden="true" />
      <div className="cmod-cloud cmod-cloud--2" aria-hidden="true" />

      <header className="cmod-header">
        <TemplateMobileNav
          variant="cmod"
          brand={c.brandTag || c.name}
          brandHref="#hero"
          onBrandClick={(e) => handleSectionNav(e, 'hero')}
          sectionLinks={sectionLinks}
          preview={preview}
          trailing={
            c.links?.resume ? (
              <a href={c.links.resume} className="cmod-nav-resume" target="_blank" rel="noreferrer">
                Resume
              </a>
            ) : null
          }
        >
          <div className="cmod-header-inner">
            <a href="#hero" className="cmod-brand" onClick={(e) => handleSectionNav(e, 'hero')}>
              <EditableText field="brandTag" section="hero" label="Brand" as="span">
                {c.brandTag || c.name}
              </EditableText>
            </a>
            <nav className="cmod-nav" aria-label="Main navigation">
              {visibleNav.map((item) => (
                <a
                  key={item.section}
                  href={`#${item.section}`}
                  className="cmod-nav-link"
                  onClick={(e) => handleSectionNav(e, item.section)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {c.links?.resume && (
              <a href={c.links.resume} className="cmod-nav-resume cmod-nav-resume--desktop" target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
          </div>
        </TemplateMobileNav>
      </header>

      <main className="cmod-main">
        <section className="cmod-hero" id="hero">
          <div className="cmod-hero-content">
            <MotionHero className="cmod-hero-top">
              <ProfilePhoto
                image={c.profileImage}
                name={c.name}
                className="cmod-avatar"
                emptyClassName="cmod-avatar--empty"
                initialsClassName="cmod-avatar-initials"
              />
              <div className="cmod-hero-meta">
                {c.availability && (
                  <span className="cmod-availability">
                    <span className="cmod-availability-dot" aria-hidden="true" />
                    <EditableText field="availability" section="hero" label="Availability" as="span">
                      {c.availability}
                    </EditableText>
                  </span>
                )}
                {c.location && (
                  <span className="cmod-location">
                    <EditableText field="location" section="hero" label="Location" as="span">
                      {c.location}
                    </EditableText>
                  </span>
                )}
              </div>
            </MotionHero>

            <MotionHero className="cmod-greeting" as="p" delay={0.06}>
              <EditableText field="greeting" section="hero" label="Greeting" as="span">
                {c.greeting}
              </EditableText>{' '}
              <span className="cmod-hero-name">
                <EditableText field="name" section="hero" label="Name" as="span">
                  {c.name}
                </EditableText>
              </span>
            </MotionHero>

            <MotionHero className="cmod-hero-typing-wrap" delay={0.1}>
              {editable ? (
                <span className="cmod-typing">
                  {c.roles?.map((role, roleIndex) => (
                    <span key={roleIndex} className="cmod-role-editable">
                      <EditableText field={`roles.${roleIndex}`} section="hero" label={`Role ${roleIndex + 1}`} as="span">
                        {role}
                      </EditableText>
                      {roleIndex < (c.roles?.length || 0) - 1 ? ', ' : null}
                    </span>
                  ))}
                </span>
              ) : (
                <TypingRoles roles={c.roles} active={!preview && !editable || preview} />
              )}
            </MotionHero>

            <MotionHero className="cmod-hero-headline" as="p" delay={0.16}>
              <EditableText field="headline" section="hero" label="Headline" multiline as="span">
                {c.headline}
              </EditableText>
            </MotionHero>

            <MotionHero className="cmod-hero-actions" delay={0.22}>
              <SocialLinks links={c.links} />
              {c.heroCtaLabel && (
                <MotionPressable
                  as="a"
                  href="#projects"
                  className="cmod-btn cmod-btn--outline tpl-motion-btn"
                  onClick={(e) => handleSectionNav(e, 'projects')}
                >
                  <EditableText field="heroCtaLabel" section="hero" label="CTA label" as="span">
                    {c.heroCtaLabel}
                  </EditableText>
                </MotionPressable>
              )}
              {c.links?.resume && (
                <MotionPressable as="a" href={c.links.resume} className="cmod-btn cmod-btn--primary tpl-motion-btn" target="_blank" rel="noreferrer">
                  Resume
                </MotionPressable>
              )}
            </MotionHero>
          </div>

          <MotionHero className="cmod-hero-visual" delay={0.12}>
            <HeroScene animate={!preview && !editable} />
          </MotionHero>

          <a
            href="#about"
            className="cmod-hero-scroll"
            onClick={(e) => handleSectionNav(e, order[0] || 'about')}
            aria-label="Scroll to content"
          >
            <span className="cmod-hero-scroll-icon" aria-hidden="true" />
          </a>
        </section>

        {showFull && (
          <>
            <SectionStack
              order={order}
              renderers={SECTION_RENDERERS}
              content={c}
              preview={preview}
              editable={editable}
            />
            <footer className="cmod-footer">
              <p>
                <EditableText field="footer" section="hero" label="Footer" as="span">
                  {c.footer}
                </EditableText>
              </p>
            </footer>
          </>
        )}

        {!showFull && <AboutSection c={c} />}
      </main>
    </div>
    </TemplateMotionProvider>
  );
}
