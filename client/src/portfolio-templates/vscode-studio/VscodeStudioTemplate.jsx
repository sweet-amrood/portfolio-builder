import { useState, useRef, useCallback, useEffect } from 'react';
import {
  VscExtensions,
  VscFiles,
  VscMail,
  VscPerson,
  VscFolder,
  VscSearch,
  VscSourceControl,
  VscTerminal,
  VscVscode,
  VscJson,
  VscFileCode,
} from 'react-icons/vsc';
import { vscodeStudioContent as defaultContent } from './vscode-studio.content';
import SectionStack from '../shared/SectionStack';
import ProfilePhoto from '../shared/ProfilePhoto';
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
import { TechBadge } from '../../components/DevToolIcon';
import EditableText from '../../components/builder/EditableText';
import IdeCustomCursor from './components/IdeCustomCursor';
import CopilotPanel from './components/CopilotPanel';
import ExplorerFileIcon from './components/ExplorerFileIcon';
import './vscode-studio.css';

const DEFAULT_ORDER = ['about', 'projects', 'skills', 'experience', 'contact'];

const HERO_SECTION_ICONS = {
  projects: VscFolder,
  about: VscPerson,
  contact: VscMail,
  hero: VscFileCode,
  skills: VscJson,
  experience: VscFileCode,
};

function sectionForFilename(filename, navFiles) {
  return navFiles.find((file) => file.filename === filename)?.section || 'hero';
}

function filenameForSection(sectionId, navFiles) {
  if (sectionId === 'hero') return 'home.tsx';
  const preferred = navFiles.find((file) => file.section === sectionId && file.filename !== 'README.md');
  return preferred?.filename || navFiles.find((file) => file.section === sectionId)?.filename || 'home.tsx';
}

const SECTION_RENDERERS = {
  about: AboutSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  contact: ContactSection,
};

function AboutSection({ c }) {
  return (
    <section className="vsc-section" id="about">
      <div className="vsc-section-codehead">
        <span className="vsc-kw">const</span> <span className="vsc-id">about</span> = (
      </div>
      <MotionReveal className="vsc-section-text" as="p">
        <EditableText field="about" section="about" label="About" multiline as="span">
          {c.about}
        </EditableText>
      </MotionReveal>
      <div className="vsc-section-codehead vsc-section-codehead--end">);</div>
    </section>
  );
}

function ProjectsSection({ c }) {
  return (
    <section className="vsc-section" id="projects">
      <div className="vsc-section-codehead">
        <span className="vsc-kw">export const</span> <span className="vsc-id">projects</span> = [
      </div>
      <div className="vsc-projects">
        {c.projects.map((project, index) => (
          <MotionCard key={`${project.title}-${index}`} className="vsc-project-card tpl-interactive-card" delay={index * 0.07}>
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
              <div className="vsc-project-tech">
                {project.tech.map((item, techIndex) => (
                  <TechBadge key={`${techIndex}-${item}`} name={item} className="vsc-tech-chip" />
                ))}
              </div>
            )}
          </MotionCard>
        ))}
      </div>
      <div className="vsc-section-codehead vsc-section-codehead--end">];</div>
    </section>
  );
}

function SkillsSection({ c }) {
  return (
    <section className="vsc-section" id="skills">
      <div className="vsc-section-codehead">
        <span className="vsc-kw">export const</span> <span className="vsc-id">skills</span> = {'{'}
      </div>
      <div className="vsc-skill-groups">
        {c.skillGroups.map((group, index) => (
          <MotionCard key={`${group.name}-${index}`} className="vsc-skill-group" delay={index * 0.06}>
            <h3>
              <EditableText field={`skillGroups.${index}.name`} section="skills" label="Group name" as="span">
                {group.name}
              </EditableText>
            </h3>
            <div className="vsc-skill-badges">
              {group.items.map((item, itemIndex) => (
                <TechBadge key={`${itemIndex}-${item}`} name={item} className="vsc-skill-badge" />
              ))}
            </div>
          </MotionCard>
        ))}
      </div>
      <div className="vsc-section-codehead vsc-section-codehead--end">{'}'};</div>
    </section>
  );
}

function ExperienceSection({ c }) {
  return (
    <section className="vsc-section" id="experience">
      <div className="vsc-section-codehead">
        <span className="vsc-kw">const</span> <span className="vsc-id">experience</span>: Job[] = [
      </div>
      <div className="vsc-timeline">
        {c.experience.map((job, index) => (
          <MotionReveal key={`${job.company}-${index}`} className="vsc-timeline-item" delay={index * 0.08}>
            <h3>
              <EditableText field={`experience.${index}.company`} section="experience" label="Company" as="span">
                {job.company}
              </EditableText>
            </h3>
            <p className="vsc-timeline-role">
              <EditableText field={`experience.${index}.role`} section="experience" label="Role" as="span">
                {job.role}
              </EditableText>
            </p>
            <p className="vsc-timeline-desc">
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
            <span className="vsc-timeline-period">
              <EditableText field={`experience.${index}.period`} section="experience" label="Period" as="span">
                {job.period}
              </EditableText>
            </span>
          </MotionReveal>
        ))}
      </div>
      <div className="vsc-section-codehead vsc-section-codehead--end">];</div>
    </section>
  );
}

function ContactSection({ c, preview }) {
  const contact = { ...defaultContent.contact, ...c.contact };

  return (
    <section className="vsc-section vsc-section--contact" id="contact">
      <div className="vsc-section-codehead">
        <span className="vsc-kw">async function</span> <span className="vsc-id">contact</span>() {'{'}
      </div>
      <MotionTitle className="vsc-contact-title" as="h2">
        <EditableText field="contact.title" section="contact" label="Title" as="span">
          {contact.title}
        </EditableText>
      </MotionTitle>
      <MotionReveal className="vsc-section-text" as="p" delay={0.06}>
        <EditableText field="contact.subtitle" section="contact" label="Subtitle" multiline as="span">
          {contact.subtitle}
        </EditableText>
      </MotionReveal>
      {contact.email && (
        <MotionReveal delay={0.1}>
          <a href={`mailto:${contact.email}`} className="vsc-contact-email tpl-motion-link">
            {contact.email}
          </a>
        </MotionReveal>
      )}
      <MotionReveal delay={0.12}>
        <form className="vsc-form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Name" readOnly={preview} />
          <input type="email" placeholder="Email" readOnly={preview} />
          <textarea placeholder="Your message..." rows={4} readOnly={preview} />
          <MotionPressable type="submit" className="tpl-motion-btn">
            <EditableText field="contact.buttonText" section="contact" label="Button text" as="span">
              {contact.buttonText || 'Send Message'}
            </EditableText>
          </MotionPressable>
        </form>
      </MotionReveal>
      <div className="vsc-section-codehead vsc-section-codehead--end">{'}'}</div>
    </section>
  );
}

function HeroEditor({ c, preview, onNavigate }) {
  return (
    <section className="vsc-hero" id="hero">
      <p className="vsc-code-comment">
        <EditableText field="welcomeComment" section="hero" label="Welcome comment" as="span">
          {c.welcomeComment}
        </EditableText>
      </p>

      <MotionHero className="vsc-hero-name" as="h1">
        <EditableText field="name" section="hero" label="Name" as="span">
          {c.name}
        </EditableText>
        <span className="vsc-hero-name-accent">
          <EditableText field="nameHighlight" section="hero" label="Name highlight" as="span">
            {c.nameHighlight}
          </EditableText>
        </span>
      </MotionHero>

      <MotionHero className="vsc-roles" delay={0.08}>
        {c.roles?.map((role, roleIndex) => (
          <span key={role} className="vsc-role-pill">
            <EditableText field={`roles.${roleIndex}`} section="hero" label={`Role ${roleIndex + 1}`} as="span">
              {role}
            </EditableText>
          </span>
        ))}
      </MotionHero>

      {c.company && (
        <p className="vsc-company">
          <EditableText field="company" section="hero" label="Company" as="span">
            {c.company}
          </EditableText>
        </p>
      )}

      <MotionHero className="vsc-typing-line" as="p" delay={0.16}>
        <EditableText field="typingLine" section="hero" label="Typing line" as="span">
          {c.typingLine}
        </EditableText>
        <span className="vsc-typing-cursor" aria-hidden="true" />
      </MotionHero>

      <MotionHero className="vsc-hero-bio" as="p" delay={0.22}>
        <EditableText field="bio" section="hero" label="Bio" multiline as="span">
          {c.bio}
        </EditableText>
      </MotionHero>

      <MotionHero className="vsc-hero-actions" delay={0.28}>
        {c.heroActions?.map((action, actionIndex) => {
          const ActionIcon = HERO_SECTION_ICONS[action.section] || VscFileCode;
          return (
            <MotionPressable
              key={action.label}
              as="a"
              href={`#${action.section}`}
              className="vsc-hero-btn tpl-motion-btn"
              onClick={(e) => onNavigate(e, action.section)}
            >
              <ActionIcon size={16} className="vsc-hero-btn-icon" aria-hidden="true" />
              <EditableText field={`heroActions.${actionIndex}.label`} section="hero" label="Action label" as="span">
                {action.label}
              </EditableText>
            </MotionPressable>
          );
        })}
      </MotionHero>

      <MotionStagger className="vsc-stats">
        {c.stats?.map((stat, index) => (
          <MotionStaggerItem key={`${stat.label}-${index}`}>
            <div className="vsc-stat">
              <span className="vsc-stat-value">
                <EditableText field={`stats.${index}.value`} section="hero" label="Stat value" as="span">
                  {stat.value}
                </EditableText>
              </span>
              <span className="vsc-stat-label">
                <EditableText field={`stats.${index}.label`} section="hero" label="Stat label" as="span">
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

function getSectionFingerprint(sectionId, c) {
  switch (sectionId) {
    case 'skills':
      return JSON.stringify(c.skillGroups ?? []);
    case 'projects':
      return JSON.stringify(c.projects ?? []);
    case 'experience':
      return JSON.stringify(c.experience ?? []);
    case 'about':
      return c.about ?? '';
    case 'contact':
      return JSON.stringify(c.contact ?? {});
    case 'hero':
      return JSON.stringify({
        name: c.name,
        bio: c.bio,
        roles: c.roles,
        stats: c.stats,
        heroActions: c.heroActions,
        welcomeComment: c.welcomeComment,
        typingLine: c.typingLine,
      });
    default:
      return sectionId;
  }
}

function renderTabPanel(filename, sectionId, { c, preview, onNavigate, fingerprint }) {
  if (sectionId === 'hero') {
    return <HeroEditor key={fingerprint} c={c} preview={preview} onNavigate={onNavigate} />;
  }
  const Renderer = SECTION_RENDERERS[sectionId];
  if (!Renderer) return null;
  return <Renderer key={fingerprint} c={c} preview={preview} />;
}

export default function VscodeStudioTemplate({
  preview = false,
  compact = false,
  editable = false,
  sectionOrder = DEFAULT_ORDER,
  content: contentProp,
  theme,
  focusedSection,
  onFocusedSectionChange,
}) {
  const c = contentProp || defaultContent;
  const showFull = !compact;
  const order = sectionOrder.length ? sectionOrder : DEFAULT_ORDER;
  const cursorActive = !editable;
  const useTabView = showFull;
  const rootRef = useRef(null);
  const [openTabs, setOpenTabs] = useState(['home.tsx']);
  const [activeTab, setActiveTab] = useState('home.tsx');

  const visibleFiles = (c.navFiles || defaultContent.navFiles).filter((file) => {
    if (file.section === 'hero') return true;
    return order.includes(file.section);
  });

  useEffect(() => {
    if (!editable || !focusedSection || !showFull) return;
    const filename = filenameForSection(focusedSection, visibleFiles);
    if (!visibleFiles.some((file) => file.filename === filename)) return;
    setOpenTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]));
    setActiveTab(filename);
  }, [editable, focusedSection, showFull, visibleFiles]);

  const openFileTab = useCallback(
    (event, filename, sectionId) => {
      if (event) event.preventDefault();
      if (!visibleFiles.some((file) => file.filename === filename)) return;
      setOpenTabs((prev) => (prev.includes(filename) ? prev : [...prev, filename]));
      setActiveTab(filename);
      if (sectionId && onFocusedSectionChange) onFocusedSectionChange(sectionId);
    },
    [visibleFiles, onFocusedSectionChange]
  );

  const closeFileTab = useCallback(
    (event, filename) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenTabs((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((tab) => tab !== filename);
        if (activeTab === filename) {
          setActiveTab(next[next.length - 1]);
        }
        return next;
      });
    },
    [activeTab]
  );

  const switchFileTab = useCallback((event, filename) => {
    if (event) event.preventDefault();
    setActiveTab(filename);
  }, []);

  const sectionLinks = visibleFiles.map((file) => ({
    label: file.label || file.filename,
    href: `#${file.section}`,
    icon: <ExplorerFileIcon filename={file.filename} size={16} />,
    onClick: (event) => openFileTab(event, file.filename, file.section),
  }));

  const externalLinks = [
    c.links?.resume && { label: 'Resume PDF', href: c.links.resume },
    c.links?.linkedin && { label: 'LinkedIn', href: c.links.linkedin },
    c.links?.github && { label: 'GitHub', href: c.links.github },
  ].filter(Boolean);

  const onNavigate = (event, sectionId) => {
    const filename = filenameForSection(sectionId, visibleFiles);
    openFileTab(event, filename, sectionId);
  };

  const activeSection = sectionForFilename(activeTab, visibleFiles);

  const menuItems = ['File', 'Edit', 'View', 'Go', 'Run', 'Terminal', 'Help'];

  return (
    <TemplateMotionProvider preview={preview} editable={editable}>
    <div
      ref={rootRef}
      className={`vsc-studio${preview ? ' vsc-studio--preview' : ''}${compact ? ' vsc-studio--compact' : ''}${editable ? ' vsc-studio--editable' : ''}${theme ? ` vsc-studio--theme-${theme.id}` : ''}${cursorActive ? ' vsc-studio--custom-cursor' : ''}`}
      style={theme?.vars}
    >
      <IdeCustomCursor active={cursorActive} rootRef={rootRef} />

      <div className="vsc-window">
        <header className="vsc-titlebar">
          <div className="vsc-titlebar-traffic">
            <span className="vsc-dot vsc-dot--close" />
            <span className="vsc-dot vsc-dot--min" />
            <span className="vsc-dot vsc-dot--max" />
          </div>
          <div className="vsc-titlebar-search">
            <VscSearch size={14} />
            <span>
              <EditableText field="workspaceName" section="hero" label="Workspace" as="span">
                {c.workspaceName}
              </EditableText>
              {' : '}
              <EditableText field="siteTitle" section="hero" label="Site title" as="span">
                {c.siteTitle}
              </EditableText>
            </span>
          </div>
          <div className="vsc-titlebar-actions">
            <button type="button" className="vsc-titlebar-btn" aria-label="Layout">
              ⤢
            </button>
          </div>
        </header>

        <div className="vsc-menubar vsc-desktop-only">
          {menuItems.map((item) => (
            <span key={item} className="vsc-menu-item">
              {item}
            </span>
          ))}
        </div>

        <div className="vsc-workbench">
          <aside className="vsc-activitybar vsc-desktop-only" aria-label="Activity bar">
            <span className="vsc-activity-item vsc-activity-item--active" title="Explorer">
              <VscFiles size={22} />
            </span>
            <span className="vsc-activity-item" title="Search">
              <VscSearch size={22} />
            </span>
            <span className="vsc-activity-item" title="Source Control">
              <VscSourceControl size={22} />
            </span>
            <span className="vsc-activity-item" title="Extensions">
              <VscExtensions size={22} />
            </span>
            <span className="vsc-activity-item vsc-activity-item--bottom" title="Account">
              <ProfilePhoto
                image={c.profileImage}
                name={c.name}
                className="vsc-activity-avatar"
                emptyClassName="vsc-activity-avatar--empty"
              />
            </span>
          </aside>

          <aside className="vsc-sidebar vsc-desktop-only">
            <p className="vsc-sidebar-title">Portfolio</p>
            <nav className="vsc-explorer">
              {visibleFiles.map((file) => (
                  <a
                    key={file.filename}
                    href={`#${file.section}`}
                    className={`vsc-explorer-item${openTabs.includes(file.filename) && activeTab === file.filename ? ' vsc-explorer-item--active' : ''}${openTabs.includes(file.filename) ? ' vsc-explorer-item--open' : ''}`}
                    onClick={(e) => openFileTab(e, file.filename, file.section)}
                  >
                    <ExplorerFileIcon filename={file.filename} size={16} />
                    <span>{file.filename}</span>
                  </a>
              ))}
              {c.links?.resume && (
                <a
                  href={c.links.resume}
                  className="vsc-explorer-item vsc-explorer-item--external"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExplorerFileIcon filename="Resume.pdf" size={16} />
                  <span>Resume.pdf</span>
                </a>
              )}
            </nav>
          </aside>

          <div className="vsc-editor-area">
            <div className="vsc-mobile-header">
              <TemplateMobileNav
                variant="vsc"
                brand={`${c.workspaceName}`}
                brandHref="#hero"
                onBrandClick={(e) => onNavigate(e, 'hero')}
                sectionLinks={sectionLinks}
                externalLinks={externalLinks}
                preview={preview}
                trailing={
                  <span className="vsc-mobile-vscode" aria-hidden="true">
                    <VscVscode size={18} />
                  </span>
                }
              />
            </div>

            <div className="vsc-tabs vsc-desktop-only">
              {openTabs.map((filename) => {
                const section = sectionForFilename(filename, visibleFiles);
                return (
                  <a
                    key={filename}
                    href={`#${section}`}
                    className={`vsc-tab${activeTab === filename ? ' vsc-tab--active' : ''}`}
                    onClick={(e) => switchFileTab(e, filename)}
                  >
                    <ExplorerFileIcon filename={filename} size={14} />
                    {filename}
                    <span
                      className="vsc-tab-close"
                      role="button"
                      tabIndex={0}
                      aria-label={`Close ${filename}`}
                      onClick={(e) => closeFileTab(e, filename)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') closeFileTab(e, filename);
                      }}
                    >
                      ×
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="vsc-breadcrumb vsc-desktop-only">
              <span>{c.workspaceName}</span>
              <span>›</span>
              <span>src</span>
              <span>›</span>
              <span className="vsc-breadcrumb-active">{activeTab}</span>
            </div>

            <main className="vsc-editor-main">
              <div className="vsc-editor-gutter vsc-desktop-only" aria-hidden="true">
                {Array.from({ length: 28 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <div className="vsc-editor-content">
              {useTabView ? (
                <>
                  {renderTabPanel(activeTab, activeSection, {
                    c,
                    preview,
                    onNavigate,
                    fingerprint: getSectionFingerprint(activeSection, c),
                  })}
                  {activeSection === 'hero' && (
                    <footer className="vsc-footer">
                      <p>
                        <EditableText field="footer" section="hero" label="Footer" as="span">
                          {c.footer}
                        </EditableText>
                      </p>
                    </footer>
                  )}
                </>
              ) : (
                <>
              <HeroEditor c={c} preview={preview} onNavigate={onNavigate} />

              {showFull && (
                <>
                  <div className="vsc-sections-stack">
                    <SectionStack
                      order={order}
                      renderers={SECTION_RENDERERS}
                      content={c}
                      preview={preview}
                      editable={editable}
                    />
                  </div>
                  <footer className="vsc-footer">
                    <p>{c.footer}</p>
                  </footer>
                </>
              )}
                </>
              )}
              </div>
            </main>
          </div>

          <CopilotPanel
            copilot={c.copilot}
            copilotName={c.copilotName}
            name={c.name}
            nameHighlight={c.nameHighlight}
            workspaceName={c.workspaceName}
            siteTitle={c.siteTitle}
          />
        </div>

        <footer className="vsc-statusbar">
          <div className="vsc-status-left">
            <span>
              <VscSourceControl size={13} /> main
            </span>
            <span>⚠ 0</span>
            <span>⊗ 0</span>
          </div>
          <div className="vsc-status-right">
            <span>TypeScript React</span>
            <span>UTF-8</span>
            <span>Prettier</span>
            <span className="vsc-status-theme">💜 {theme?.name || 'Aahana Dark'}</span>
            <span>
              <VscTerminal size={13} /> {c.name}&apos;s Portfolio
            </span>
          </div>
        </footer>
      </div>
    </div>
    </TemplateMotionProvider>
  );
}
