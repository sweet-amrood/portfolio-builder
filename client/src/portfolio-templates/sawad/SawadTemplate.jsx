import { sawadContent as defaultContent } from './sawad.content';
import TemplateSortableBlock from '../../components/TemplateSortableBlock';
import ProfilePhoto from '../shared/ProfilePhoto';
import ProjectCover from '../shared/ProjectCover';
import TemplateMobileNav from '../shared/TemplateMobileNav';
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
import { scrollToSection } from '../../utils/scrollToSection';
import { TechBadge, ToolIconTile } from '../../components/DevToolIcon';
import EditableText from '../../components/builder/EditableText';
import { UniversalTemplateSection } from '../shared/universalSections';
import './sawad.css';

const DEFAULT_ORDER = ['skills', 'projects', 'experience', 'tools', 'thoughts', 'contact'];

function handleSectionNav(event, sectionId) {
  event.preventDefault();
  scrollToSection(sectionId);
}

const NAV_TARGETS = {
  Home: 'hero',
  Projects: 'projects',
  Experience: 'experience',
  Tools: 'tools',
  Thoughts: 'thoughts',
  Contact: 'contact',
};

function SkillsSection({ c }) {
  return (
    <div id="skills">
      <div className="sawad-marquee-wrap">
        <div className="sawad-marquee sawad-marquee--row1">
          {[...c.skillsRow1, ...c.skillsRow1].map((skill, i) => (
            <TechBadge key={`r1-${skill}-${i}`} name={skill} className="sawad-skill-tag" />
          ))}
        </div>
      </div>
      <div className="sawad-marquee-wrap sawad-marquee-wrap--second">
        <div className="sawad-marquee sawad-marquee--row2">
          {[...c.skillsRow2, ...c.skillsRow2].map((skill, i) => (
            <TechBadge key={`r2-${skill}-${i}`} name={skill} className="sawad-skill-tag" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ c, preview }) {
  return (
    <section className="sawad-section" id="projects">
      <MotionTitle className="sawad-section-title" as="h2">
        RECENT
        <br />
        PROJECTS
      </MotionTitle>
      <div className="sawad-projects">
        {c.projects.map((project, index) => (
          <MotionCard key={project.title} className="sawad-project-card tpl-interactive-card" delay={index * 0.07}>
            <div className="sawad-project-img">
              <ProjectCover
                image={project.image}
                imageClassName="sawad-project-img-cover"
                placeholderClassName="sawad-project-img-placeholder"
                alt={project.title}
              />
            </div>
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
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="sawad-section" id="experience">
      <MotionTitle className="sawad-section-title" as="h2">
        YEARS OF
        <br />
        EXPERIENCE
      </MotionTitle>
      <div className="sawad-timeline">
        {c.experience.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="sawad-timeline-item" delay={index * 0.08}>
            <div className="sawad-timeline-dot" />
            <div>
              <h3>
                <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                  {job.company}
                </EditableText>
              </h3>
              <p>
                <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                  {job.role}
                </EditableText>
              </p>
              <span>
                <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                  {job.period}
                </EditableText>
              </span>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function ToolsSection({ c }) {
  return (
    <section className="sawad-section" id="tools">
      <MotionTitle className="sawad-section-title" as="h2">
        PREMIUM
        <br />
        TOOLS
      </MotionTitle>
      <div className="sawad-tools">
        {c.tools.map((tool, index) => (
          <MotionCard key={`${tool.name}-${index}`} className="sawad-tool-card tpl-interactive-card" delay={index * 0.06}>
            <ToolIconTile name={tool.name} size={22} className="sawad-tool-icon" />
            <h3>
              <EditableText field={`tools.${index}.name`} section="tools" label="Tool name" as="span">
                {tool.name}
              </EditableText>
            </h3>
            {tool.showDesc !== false && tool.desc ? (
              <p>
                <EditableText field={`tools.${index}.desc`} section="tools" label="Description" multiline as="span">
                  {tool.desc}
                </EditableText>
              </p>
            ) : null}
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ThoughtsSection({ c }) {
  return (
    <section className="sawad-section" id="thoughts">
      <MotionTitle className="sawad-section-title" as="h2">
        DESIGN
        <br />
        THOUGHTS
      </MotionTitle>
      <div className="sawad-thoughts">
        {c.thoughts.map((post, index) => (
          <MotionCard key={`${post.title}-${index}`} className="sawad-thought-card tpl-interactive-card" delay={index * 0.07}>
            <h3>
              <EditableText field={`thoughts.${index}.title`} section="thoughts" label="Title" as="span">
                {post.title}
              </EditableText>
            </h3>
            <p>
              <EditableText field={`thoughts.${index}.excerpt`} section="thoughts" label="Excerpt" multiline as="span">
                {post.excerpt}
              </EditableText>
            </p>
            <div className="sawad-thought-meta">
              <span>
                <EditableText field={`thoughts.${index}.date`} section="thoughts" label="Date" as="span">
                  {post.date}
                </EditableText>
              </span>
              <span>
                <EditableText field={`thoughts.${index}.read`} section="thoughts" label="Read time" as="span">
                  {post.read}
                </EditableText>
              </span>
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ c, preview }) {
  const contact = { ...defaultContent.contact, ...c.contact };

  return (
    <section className="sawad-section sawad-contact" id="contact">
      <div className="sawad-contact-bg" aria-hidden="true">
        <span className="sawad-contact-orb" />
        <span className="sawad-contact-grid" />
      </div>
      <div className="sawad-contact-inner">
        <div className="sawad-contact-info">
          <MotionTitle className="sawad-section-title sawad-contact-title" as="h2">
            <EditableText field="contact.titleLine1" section="contact" label="Title line 1" as="span">
              {contact.titleLine1}
            </EditableText>
            <br />
            <EditableText field="contact.titleLine2" section="contact" label="Title line 2" as="span">
              {contact.titleLine2}
            </EditableText>
          </MotionTitle>
          <MotionReveal className="sawad-contact-subtitle" as="p" delay={0.06}>
            <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
              {contact.subtitle}
            </EditableText>
          </MotionReveal>
          {contact.email && (
            <MotionReveal delay={0.1}>
              <a href={`mailto:${contact.email}`} className="sawad-contact-email tpl-motion-link">
                {contact.email}
              </a>
            </MotionReveal>
          )}
          {contact.responseNote && (
            <MotionReveal delay={0.14}>
              <span className="sawad-contact-badge">
                <EditableText field="contact.responseNote" section="contact" label="Response note" as="span">
                  {contact.responseNote}
                </EditableText>
              </span>
            </MotionReveal>
          )}
        </div>
        <MotionReveal className="sawad-contact-form-wrap" delay={0.12}>
          <form className="sawad-form" onSubmit={(e) => e.preventDefault()}>
            <div className="sawad-form-row">
              <input type="text" placeholder="Name" readOnly={preview} />
              <input type="email" placeholder="Email" readOnly={preview} />
            </div>
            {contact.showBudget !== false && (
              <select disabled={preview} defaultValue="">
                <option value="" disabled>
                  Budget range
                </option>
                <option>&lt;$3k</option>
                <option>$3k - $5k</option>
                <option>$5k - $10k</option>
                <option>&gt;$10k</option>
              </select>
            )}
            <textarea placeholder="Tell me about your project..." rows={4} readOnly={preview} />
            <MotionPressable type="submit" className="tpl-motion-btn">
              <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
                {contact.buttonText || 'Send Message'}
              </EditableText>
            </MotionPressable>
          </form>
        </MotionReveal>
      </div>
    </section>
  );
}

const SECTION_RENDERERS = {
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  tools: ToolsSection,
  thoughts: ThoughtsSection,
  contact: ContactSection,
};

export default function SawadTemplate({
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
    const target = NAV_TARGETS[item];
    if (!target || target === 'hero') return true;
    return order.includes(target);
  });

  const sectionLinks = visibleNav.map((item) => {
    const target = NAV_TARGETS[item] || item.toLowerCase();
    return {
      label: item,
      href: `#${target}`,
      onClick: (event) => handleSectionNav(event, target),
    };
  });

  const externalLinks = [
    c.links?.resume && { label: 'Resume', href: c.links.resume },
    c.links?.linkedin && { label: 'LinkedIn', href: c.links.linkedin },
  ].filter(Boolean);

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
    <div
      className={`sawad${preview ? ' sawad--preview' : ''}${compact ? ' sawad--compact' : ''}${editable ? ' sawad--editable' : ''}${theme ? ` sawad--theme-${theme.id}` : ''}`}
      style={theme?.vars}
    >
      <header className="sawad-nav">
        <TemplateMobileNav
          variant="sawad"
          brand={c.name}
          brandHref="#hero"
          onBrandClick={(e) => handleSectionNav(e, 'hero')}
          sectionLinks={sectionLinks}
          externalLinks={externalLinks}
          preview={preview}
        >
          <div className="sawad-nav-links">
            {visibleNav.map((item) => {
              const target = NAV_TARGETS[item] || item.toLowerCase();
              return (
                <a
                  key={item}
                  href={`#${target}`}
                  className="sawad-nav-link"
                  onClick={(e) => handleSectionNav(e, target)}
                >
                  {item}
                </a>
              );
            })}
          </div>
          <div className="sawad-nav-actions">
            {c.links?.resume && (
              <a href={c.links.resume} className="sawad-nav-external" target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
            {c.links?.linkedin && (
              <a href={c.links.linkedin} className="sawad-nav-external" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </TemplateMobileNav>
      </header>

      <section className="sawad-hero" id="hero">
        <div className="sawad-hero-bg" aria-hidden="true">
          <span className="sawad-hero-orb sawad-hero-orb--1" />
          <span className="sawad-hero-orb sawad-hero-orb--2" />
          <span className="sawad-hero-orb sawad-hero-orb--3" />
          <span className="sawad-hero-grid" />
          <span className="sawad-hero-line sawad-hero-line--1" />
          <span className="sawad-hero-line sawad-hero-line--2" />
        </div>

        <MotionHero className="sawad-profile">
          <ProfilePhoto
            image={c.profileImage}
            name={c.name}
            className="sawad-profile-photo"
            emptyClassName="sawad-profile-photo--empty"
            initialsClassName="sawad-profile-initials"
          />
          <div className="sawad-profile-text">
            <p className="sawad-name">
              <EditableText field="name" section="hero" label="Name" as="span">
                {c.name}
              </EditableText>
            </p>
            <p className="sawad-tagline">
              <EditableText field="tagline" section="hero" label="Tagline" as="span">
                {c.tagline}
              </EditableText>
            </p>
          </div>
        </MotionHero>

        <MotionHero className="sawad-title" as="h1" delay={0.1}>
          <EditableText field="title" section="hero" label="Headline" as="span">
            {c.title}
          </EditableText>
        </MotionHero>

        <MotionHero className="sawad-bio" as="p" delay={0.2}>
          <EditableText field="bio" section="hero" label="Bio" multiline as="span">
            {c.bio}
          </EditableText>
        </MotionHero>

        <MotionStagger className="sawad-stats">
          {c.stats.map((stat, i) => (
            <MotionStaggerItem key={`${stat.label}-${i}`}>
              <div className="sawad-stat">
                <span className="sawad-stat-value">
                  <EditableText field={`stats.${i}.value`} section="hero" label="Stat value" as="span">
                    {stat.value}
                  </EditableText>
                </span>
                <span className="sawad-stat-label">
                  <EditableText field={`stats.${i}.label`} section="hero" label="Stat label" as="span">
                    {stat.label}
                  </EditableText>
                </span>
                <span className="sawad-stat-sub">
                  <EditableText field={`stats.${i}.sub`} section="hero" label="Stat sub" as="span">
                    {stat.sub}
                  </EditableText>
                </span>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>

      {showFull && (
        <>
          <div className="sawad-sections-stack">
            {order.map((sectionId) => {
              const Section = SECTION_RENDERERS[sectionId];
              if (!Section) {
                return (
                  <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
                    <UniversalTemplateSection sectionId={sectionId} c={c} preview={preview} />
                  </TemplateSortableBlock>
                );
              }
              if (sectionId === 'skills') {
                return (
                  <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
                    <SkillsSection c={c} />
                  </TemplateSortableBlock>
                );
              }
              if (sectionId === 'contact') {
                return (
                  <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
                    <ContactSection c={c} preview={preview} />
                  </TemplateSortableBlock>
                );
              }
              return (
                <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
                  <Section c={c} preview={preview} />
                </TemplateSortableBlock>
              );
            })}
          </div>

          <footer className="sawad-footer">
            <p>
              <EditableText field="footer" section="hero" label="Footer" as="span">
                {c.footer}
              </EditableText>
            </p>
          </footer>
        </>
      )}

      {!showFull && <SkillsSection c={c} />}
    </div>
    </TemplateMotionProvider>
  );
}
