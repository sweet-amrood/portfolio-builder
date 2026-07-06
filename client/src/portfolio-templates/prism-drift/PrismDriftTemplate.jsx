import { prismDriftContent as defaultContent } from './prism-drift.content';
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
import MeshStripes from './components/MeshStripes';
import PrismShard from './components/PrismShard';
import './prism-drift.css';

const DEFAULT_ORDER = ['about', 'skills', 'projects', 'experience', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

function SocialLinks({ links, className = '' }) {
  const items = [
    links?.github && { key: 'github', href: links.github },
    links?.linkedin && { key: 'linkedin', href: links.linkedin },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className={`pdrift-social${className ? ` ${className}` : ''}`}>
      {items.map((item) => (
        <MotionPressable
          key={item.key}
          as="a"
          href={item.href}
          className="pdrift-social-btn tpl-motion-btn"
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
    <section className="pdrift-chapter pdrift-chapter--about" id="about">
      <header className="pdrift-chapter-head">
        <span className="pdrift-chapter-num">01</span>
        <h2 className="pdrift-chapter-title">About</h2>
      </header>
      <div className="pdrift-about-mag">
        <MotionCard className="pdrift-about-quote tpl-interactive-card">
          <p>
            <EditableText field="pullQuote" section="about" label="Pull quote" multiline as="span">
              {c.pullQuote}
            </EditableText>
          </p>
        </MotionCard>
        <div className="pdrift-about-main">
          <MotionCard className="pdrift-about-text tpl-interactive-card" delay={0.08}>
            <EditableText field="about" section="about" label="About" multiline as="span">
              {c.about}
            </EditableText>
          </MotionCard>
          <div className="pdrift-about-stats">
            {(c.highlights || []).map((item, index) => (
              <MotionCard
                key={`${item.label}-${index}`}
                className="pdrift-stat-cell tpl-interactive-card"
                delay={index * 0.06}
              >
                <span className="pdrift-stat-value">
                  <EditableText field={`highlights.${index}.value`} section="about" label="Stat value" as="span">
                    {item.value}
                  </EditableText>
                </span>
                <span className="pdrift-stat-label">
                  <EditableText field={`highlights.${index}.label`} section="about" label="Stat label" as="span">
                    {item.label}
                  </EditableText>
                </span>
              </MotionCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ c }) {
  return (
    <section className="pdrift-chapter pdrift-chapter--skills" id="skills">
      <header className="pdrift-chapter-head">
        <span className="pdrift-chapter-num">02</span>
        <h2 className="pdrift-chapter-title">Skills</h2>
      </header>
      <div className="pdrift-skill-scroll">
        {(c.skillGroups || []).map((group, groupIndex) => (
          <MotionCard
            key={`${group.name}-${groupIndex}`}
            className="pdrift-skill-block tpl-interactive-card"
            delay={groupIndex * 0.08}
          >
            <h3>{group.name}</h3>
            <ul>
              {group.items?.map((skill, index) => (
                <li key={`${group.name}-${skill}`}>
                  <TechBadge name={skill} />
                  <span className="pdrift-skill-meter">
                    <span
                      className="pdrift-skill-meter-fill"
                      style={{ '--pdrift-fill': `${55 + ((groupIndex * 5 + index * 9) % 40)}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ c }) {
  const projects = c.projects || [];
  if (!projects.length) {
    return (
      <section className="pdrift-chapter pdrift-chapter--projects" id="projects">
        <header className="pdrift-chapter-head">
          <span className="pdrift-chapter-num">03</span>
          <h2 className="pdrift-chapter-title">Work</h2>
        </header>
      </section>
    );
  }

  const featuredIndex = projects.findIndex((p) => p.featured);
  const leadIndex = featuredIndex >= 0 ? featuredIndex : 0;
  const featured = projects[leadIndex];
  const rest = projects.filter((_, index) => index !== leadIndex);

  return (
    <section className="pdrift-chapter pdrift-chapter--projects" id="projects">
      <header className="pdrift-chapter-head">
        <span className="pdrift-chapter-num">03</span>
        <h2 className="pdrift-chapter-title">Work</h2>
      </header>
      <div className="pdrift-project-masonry">
        {featured && (
          <MotionCard className="pdrift-project pdrift-project--lead tpl-interactive-card">
            {renderProject(featured, leadIndex)}
          </MotionCard>
        )}
        <div className="pdrift-project-side">
          {rest.map((project) => {
            const index = projects.indexOf(project);
            return (
              <MotionCard
                key={`${project.title}-${index}`}
                className="pdrift-project tpl-interactive-card"
                delay={index * 0.07}
              >
                {renderProject(project, index)}
              </MotionCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function renderProject(project, index) {
  return (
    <>
      <span className="pdrift-project-index">{String(index + 1).padStart(2, '0')}</span>
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
        <div className="pdrift-project-tech">
          {project.tech.map((tech) => (
            <TechBadge key={`${project.title}-${tech}`} name={tech} />
          ))}
        </div>
      )}
      {project.link && (
        <a href={project.link} className="pdrift-project-link" target="_blank" rel="noreferrer">
          Open →
        </a>
      )}
    </>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="pdrift-chapter pdrift-chapter--experience" id="experience">
      <header className="pdrift-chapter-head">
        <span className="pdrift-chapter-num">04</span>
        <h2 className="pdrift-chapter-title">Path</h2>
      </header>
      <div className="pdrift-exp-spine">
        {c.experience?.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="pdrift-exp-step" delay={index * 0.1}>
            <span className="pdrift-exp-dot" aria-hidden="true" />
            <div className="pdrift-exp-panel tpl-interactive-card">
              <div className="pdrift-exp-meta">
                <span className="pdrift-exp-period">
                  <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                    {job.period}
                  </EditableText>
                </span>
                <span className="pdrift-exp-company">
                  <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                    {job.company}
                  </EditableText>
                </span>
              </div>
              <h3>
                <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                  {job.role}
                </EditableText>
              </h3>
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
    <section className="pdrift-chapter pdrift-chapter--contact" id="contact">
      <div className="pdrift-contact-band tpl-interactive-card">
        <div className="pdrift-contact-band-copy">
          <span className="pdrift-chapter-num">05</span>
          <h2 className="pdrift-contact-band-title">
            <EditableText field="contact.title" section="contact" label="Title" as="span">
              {contact.title}
            </EditableText>
          </h2>
          <p>
            <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
              {contact.subtitle}
            </EditableText>
          </p>
        </div>
        <div className="pdrift-contact-band-action">
          <a href={`mailto:${contact.email || c.links?.email || ''}`} className="pdrift-contact-band-email">
            <EditableText field="contact.email" section="contact" label="Email" as="span">
              {contact.email || c.links?.email}
            </EditableText>
          </a>
          <div className="pdrift-contact-band-btns">
            <MotionPressable
              as="a"
              href={`mailto:${contact.email || c.links?.email || ''}`}
              className="pdrift-btn pdrift-btn--dark tpl-motion-btn"
            >
              <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
                {contact.buttonText}
              </EditableText>
            </MotionPressable>
            {c.links?.resume && (
              <a href={c.links.resume} className="pdrift-btn pdrift-btn--dark-ghost" target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
          </div>
        </div>
      </div>
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

export default function PrismDriftTemplate({
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

  const sectionLinks = [
    { label: 'Intro', href: '#hero', onClick: (event) => handleSectionNav(event, 'hero') },
    ...visibleNav.map((item) => ({
      label: item.label,
      href: `#${item.section}`,
      onClick: (event) => handleSectionNav(event, item.section),
    })),
  ];

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
      <div
        className={`pdrift${preview ? ' pdrift--preview' : ''}${compact ? ' pdrift--compact' : ''}${editable ? ' pdrift--editable' : ''}${theme ? ` pdrift--theme-${theme.id}` : ''}`}
        style={theme?.vars}
      >
        <MeshStripes />

        <div className="pdrift-shell">
          <aside className="pdrift-rail" aria-label="Site navigation">
            <a href="#hero" className="pdrift-rail-brand" onClick={(e) => handleSectionNav(e, 'hero')}>
              <span className="pdrift-rail-mark" aria-hidden="true" />
              <EditableText field="brandTag" section="hero" label="Brand" as="span">
                {c.brandTag}
              </EditableText>
            </a>

            <div className="pdrift-rail-identity">
              <ProfilePhoto
                image={c.profileImage}
                name={c.name}
                className="pdrift-rail-avatar"
                emptyClassName="pdrift-rail-avatar--empty"
                initialsClassName="pdrift-rail-initials"
              />
              <p className="pdrift-rail-name">
                <EditableText field="name" section="hero" label="Name" as="span">
                  {c.name}
                </EditableText>
              </p>
            </div>

            <nav className="pdrift-rail-nav">
              <a href="#hero" className="pdrift-rail-link" onClick={(e) => handleSectionNav(e, 'hero')}>
                <span className="pdrift-rail-link-num">—</span>
                Intro
              </a>
              {visibleNav.map((item, index) => (
                <a
                  key={item.section}
                  href={`#${item.section}`}
                  className="pdrift-rail-link"
                  onClick={(e) => handleSectionNav(e, item.section)}
                >
                  <span className="pdrift-rail-link-num">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pdrift-rail-foot">
              {c.availability && (
                <p className="pdrift-rail-status">
                  <span className="pdrift-status-dot" aria-hidden="true" />
                  <EditableText field="availability" section="hero" label="Availability" as="span">
                    {c.availability}
                  </EditableText>
                </p>
              )}
              {c.location && (
                <p className="pdrift-rail-location">
                  <EditableText field="location" section="hero" label="Location" as="span">
                    {c.location}
                  </EditableText>
                </p>
              )}
              <SocialLinks links={c.links} className="pdrift-social--rail" />
            </div>
          </aside>

          <div className="pdrift-canvas">
            <header className="pdrift-mobile-head">
              <TemplateMobileNav
                variant="pdrift"
                brand={c.brandTag}
                brandHref="#hero"
                onBrandClick={(e) => handleSectionNav(e, 'hero')}
                sectionLinks={sectionLinks}
                preview={preview}
              >
                <span className="pdrift-mobile-brand">
                  <EditableText field="brandTag" section="hero" label="Brand" as="span">
                    {c.brandTag}
                  </EditableText>
                </span>
              </TemplateMobileNav>
            </header>

            <section className="pdrift-intro" id="hero">
              <MotionHero as="p" className="pdrift-intro-greeting" delay={0.04}>
                <EditableText field="greeting" section="hero" label="Greeting" as="span">
                  {c.greeting}
                </EditableText>
              </MotionHero>

              <MotionHero as="h1" className="pdrift-intro-title" delay={0.1}>
                <EditableText field="name" section="hero" label="Name" as="span">
                  {c.name}
                </EditableText>
              </MotionHero>

              <MotionHero as="p" className="pdrift-intro-accent" delay={0.14}>
                <EditableText field="headlineAccent" section="hero" label="Accent phrase" as="span">
                  {c.headlineAccent}
                </EditableText>
              </MotionHero>

              <MotionHero delay={0.18}>
                <PrismShard />
              </MotionHero>

              <MotionHero className="pdrift-intro-tags" delay={0.22}>
                {(c.roleTags || []).map((tag, index) => (
                  <span key={`${tag}-${index}`} className="pdrift-intro-tag">
                    {tag}
                  </span>
                ))}
              </MotionHero>

              <MotionHero as="p" className="pdrift-intro-tagline" delay={0.26}>
                <EditableText field="tagline" section="hero" label="Tagline" multiline as="span">
                  {c.tagline}
                </EditableText>
              </MotionHero>

              <MotionHero className="pdrift-intro-actions" delay={0.3}>
                <MotionPressable
                  as="a"
                  href="#projects"
                  className="pdrift-btn pdrift-btn--glow tpl-motion-btn"
                  onClick={(e) => handleSectionNav(e, 'projects')}
                >
                  See my work
                </MotionPressable>
                <MotionPressable
                  as="a"
                  href="#contact"
                  className="pdrift-btn pdrift-btn--ghost tpl-motion-btn"
                  onClick={(e) => handleSectionNav(e, 'contact')}
                >
                  Contact me
                </MotionPressable>
              </MotionHero>
            </section>

            <SectionStack
              order={order}
              renderers={SECTION_RENDERERS}
              content={c}
              preview={preview}
              editable={editable}
            />

            <footer className="pdrift-canvas-footer">
              <EditableText field="footer" section="hero" label="Footer" as="span">
                {c.footer}
              </EditableText>
            </footer>
          </div>
        </div>
      </div>
    </TemplateMotionProvider>
  );
}
