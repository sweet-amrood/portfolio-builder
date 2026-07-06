import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillStar,
  AiOutlineDownload,
  AiOutlineFundProjectionScreen,
  AiOutlineHome,
  AiOutlineTwitter,
  AiOutlineUser,
} from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { CgFileDocument, CgGitFork, CgWebsite } from 'react-icons/cg';
import { FaLinkedinIn } from 'react-icons/fa';
import { ImBlog, ImPointRight } from 'react-icons/im';
import EditableText from '../../components/builder/EditableText';
import DevToolIcon from '../../components/DevToolIcon';
import TemplateSortableBlock from '../../components/TemplateSortableBlock';
import { UniversalTemplateSection } from '../shared/universalSections';
import { soumyaClassicContent as defaultContent } from './soumya-classic.content';
import Preloader from './components/Preloader';
import ParticleField from './components/ParticleField';
import TypewriterRoles from './components/TypewriterRoles';
import homeMainSvg from './assets/home-main.svg';
import avatarSvg from './assets/avatar.svg';
import './soumya-classic.css';

const PAGES = ['hero', 'about', 'projects', 'resume'];

function deriveInitials(name, initials) {
  if (initials?.trim()) return initials.trim().slice(0, 3).toUpperCase();
  if (!name?.trim()) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function projectInitial(title) {
  if (!title?.trim()) return 'P';
  return title.trim().charAt(0).toUpperCase();
}

function SocialIconLinks({ links, className = 'smcls-social-links' }) {
  const items = [
    links?.github && { key: 'github', href: links.github, Icon: AiFillGithub },
    links?.twitter && { key: 'twitter', href: links.twitter, Icon: AiOutlineTwitter },
    links?.linkedin && { key: 'linkedin', href: links.linkedin, Icon: FaLinkedinIn },
    links?.instagram && { key: 'instagram', href: links.instagram, Icon: AiFillInstagram },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <ul className={className}>
      {items.map(({ key, href, Icon }) => (
        <li key={key}>
          <a href={href} className="smcls-social-icon" target="_blank" rel="noreferrer" aria-label={key}>
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}

function HomePage({ c }) {
  return (
    <div className="smcls-page">
      <section className="smcls-home-section" id="home">
        <div className="smcls-home-content">
          <div className="smcls-home-grid">
            <div className="smcls-home-header">
              <h1 className="smcls-heading">
                <EditableText field="greeting" section="hero" label="Greeting" as="span">
                  {c.greeting}
                </EditableText>{' '}
                <span className="smcls-wave" role="img" aria-label="wave">
                  <EditableText field="wave" section="hero" label="Wave emoji" as="span">
                    {c.wave}
                  </EditableText>
                </span>
              </h1>
              <h1 className="smcls-heading-name">
                I&apos;M
                <strong className="smcls-main-name">
                  {' '}
                  <EditableText field="name" section="hero" label="Name" as="span">
                    {c.name}
                  </EditableText>
                </strong>
              </h1>
              <div className="smcls-typewriter-wrap">
                <TypewriterRoles roles={c.typingRoles || []} />
              </div>
            </div>
            <div>
              <img src={homeMainSvg} alt="" className="smcls-home-illustration smcls-themed-illustration" />
            </div>
          </div>
        </div>
      </section>

      <section className="smcls-home-about-section" id="home-intro">
        <div className="smcls-home-about-inner">
          <div className="smcls-home-about-description">
            <h2>
              <EditableText field="homeIntro.titleLead" section="hero" label="Intro lead" as="span">
                {c.homeIntro?.titleLead}
              </EditableText>{' '}
              <span className="smcls-purple">
                <EditableText field="homeIntro.titleHighlight" section="hero" label="Intro highlight" as="span">
                  {c.homeIntro?.titleHighlight}
                </EditableText>
              </span>{' '}
              <EditableText field="homeIntro.titleTail" section="hero" label="Intro tail" as="span">
                {c.homeIntro?.titleTail}
              </EditableText>
            </h2>
            <p className="smcls-home-about-body">
              <EditableText field="homeIntro.body" section="hero" label="Home intro" multiline as="span">
                {c.homeIntro?.body}
              </EditableText>
            </p>
          </div>
          <div className="smcls-avatar-wrap">
            <img src={avatarSvg} alt="" className="smcls-home-illustration smcls-themed-illustration" />
          </div>
        </div>
      </section>

      <section className="smcls-social-section">
        <h2>
          <EditableText field="socialSection.title" section="hero" label="Social title" as="span">
            {c.socialSection?.title}
          </EditableText>
        </h2>
        <p>
          <EditableText field="socialSection.subtitle" section="hero" label="Social subtitle" as="span">
            {c.socialSection?.subtitle}
          </EditableText>{' '}
          <span className="smcls-purple">connect</span>
        </p>
        <SocialIconLinks links={c.links} />
      </section>
    </div>
  );
}

function AboutPage({ c, accentHex = 'c770f0' }) {
  const activities = c.about?.activities || [];

  return (
    <div className="smcls-page">
      <section className="smcls-about-section" id="about">
        <div className="smcls-section-inner">
          <div className="smcls-about-grid">
            <div>
              <h1 className="smcls-section-heading">
                <EditableText field="about.headingLead" section="about" label="About heading" as="span">
                  {c.about?.headingLead}
                </EditableText>{' '}
                <strong className="smcls-purple">
                  <EditableText field="about.headingHighlight" section="about" label="About highlight" as="span">
                    {c.about?.headingHighlight}
                  </EditableText>
                </strong>
              </h1>
              <div className="smcls-quote-card">
                <p>
                  <EditableText field="about.cardIntro" section="about" label="About card" multiline as="span">
                    {c.about?.cardIntro}
                  </EditableText>
                </p>
                <ul className="smcls-about-activity">
                  {activities.map((activity, index) => (
                    <li key={`${activity}-${index}`}>
                      <ImPointRight />{' '}
                      <EditableText
                        field={`about.activities.${index}`}
                        section="about"
                        label="Activity"
                        as="span"
                      >
                        {activity}
                      </EditableText>
                    </li>
                  ))}
                </ul>
                <p className="smcls-purple">
                  &quot;
                  <EditableText field="about.quote" section="about" label="Quote" as="span">
                    {c.about?.quote}
                  </EditableText>
                  &quot;
                </p>
                <footer className="smcls-blockquote-footer">
                  <EditableText field="about.quoteAuthor" section="about" label="Quote author" as="span">
                    {c.about?.quoteAuthor}
                  </EditableText>
                </footer>
              </div>
            </div>
            <div className="smcls-about-visual">
              <div className="smcls-laptop-mock" aria-hidden="true" />
            </div>
          </div>

          <h1 className="smcls-section-heading">
            <EditableText field="skillsetTitle" section="about" label="Skillset title" as="span">
              {c.skillsetTitle}
            </EditableText>{' '}
            <strong className="smcls-purple">Skillset</strong>
          </h1>
          <div className="smcls-tech-grid">
            {(c.skillset || []).map((skill, index) => (
              <span key={`${skill}-${index}`} className="smcls-tech-icon">
                <DevToolIcon name={skill} size={22} showFallback />
                <span>
                  <EditableText field={`skillset.${index}`} section="about" label="Skill" as="span">
                    {skill}
                  </EditableText>
                </span>
              </span>
            ))}
          </div>

          <h1 className="smcls-section-heading">
            <strong className="smcls-purple">
              <EditableText field="toolsTitle" section="about" label="Tools title" as="span">
                {c.toolsTitle}
              </EditableText>
            </strong>
          </h1>
          <div className="smcls-tech-grid">
            {(c.tools || []).map((tool, index) => (
              <span key={`${tool}-${index}`} className="smcls-tech-icon">
                <DevToolIcon name={tool} size={22} showFallback />
                <span>
                  <EditableText field={`tools.${index}`} section="about" label="Tool" as="span">
                    {tool}
                  </EditableText>
                </span>
              </span>
            ))}
          </div>

          {c.about?.githubUsername ? (
            <div className="smcls-github-block">
              <h1 className="smcls-section-heading">
                <EditableText field="githubHeadingLead" section="about" label="GitHub heading" as="span">
                  {c.githubHeadingLead}
                </EditableText>{' '}
                <strong className="smcls-purple">
                  <EditableText field="githubHeadingHighlight" section="about" label="GitHub highlight" as="span">
                    {c.githubHeadingHighlight}
                  </EditableText>
                </strong>
              </h1>
              <a
                href={`https://github.com/${c.about.githubUsername}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://ghchart.rshah.org/${accentHex}/${c.about.githubUsername}`}
                  alt="GitHub contribution chart"
                  className="smcls-github-chart"
                />
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ProjectsPage({ c }) {
  return (
    <div className="smcls-page">
      <section className="smcls-project-section" id="projects">
        <div className="smcls-section-inner">
          <h1 className="smcls-section-heading">
            <EditableText field="projectsHeadingLead" section="projects" label="Projects heading" as="span">
              {c.projectsHeadingLead}
            </EditableText>{' '}
            <strong className="smcls-purple">
              <EditableText field="projectsHeadingHighlight" section="projects" label="Projects highlight" as="span">
                {c.projectsHeadingHighlight}
              </EditableText>
            </strong>
          </h1>
          <p style={{ color: 'white' }}>
            <EditableText field="projectsSubtitle" section="projects" label="Projects subtitle" as="span">
              {c.projectsSubtitle}
            </EditableText>
          </p>
          <div className="smcls-projects-grid">
            {(c.projects || []).map((project, index) => (
              <article key={`${project.title}-${index}`} className="smcls-project-card">
                <div className="smcls-project-thumb">{projectInitial(project.title)}</div>
                <div className="smcls-project-body">
                  <h3 className="smcls-project-title">
                    <EditableText field={`projects.${index}.title`} section="projects" label="Title" as="span">
                      {project.title}
                    </EditableText>
                  </h3>
                  <p className="smcls-project-desc">
                    <EditableText
                      field={`projects.${index}.description`}
                      section="projects"
                      label="Description"
                      multiline
                      as="span"
                    >
                      {project.description}
                    </EditableText>
                  </p>
                  <div className="smcls-btn-row">
                    {project.github ? (
                      <a href={project.github} className="smcls-btn-primary" target="_blank" rel="noreferrer">
                        <BsGithub /> GitHub
                      </a>
                    ) : null}
                    {project.demo ? (
                      <a href={project.demo} className="smcls-btn-primary" target="_blank" rel="noreferrer">
                        <CgWebsite /> Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ResumePage({ c }) {
  const resume = c.resume || {};

  return (
    <div className="smcls-page">
      <section className="smcls-resume-section" id="resume">
        <div className="smcls-section-inner">
          {c.links?.resume ? (
            <div className="smcls-resume-actions">
              <a href={c.links.resume} className="smcls-btn-primary" target="_blank" rel="noreferrer">
                <AiOutlineDownload />{' '}
                <EditableText field="resume.downloadLabel" section="resume" label="Download label" as="span">
                  {resume.downloadLabel}
                </EditableText>
              </a>
            </div>
          ) : null}

          <div className="smcls-resume-grid">
            <div className="smcls-resume-col">
              <h2>
                <EditableText field="resume.educationTitle" section="resume" label="Education title" as="span">
                  {resume.educationTitle}
                </EditableText>
              </h2>
              {(resume.education || []).map((item, index) => (
                <div key={`edu-${index}`} className="smcls-resume-item">
                  <h3>
                    <EditableText field={`resume.education.${index}.degree`} section="resume" label="Degree" as="span">
                      {item.degree}
                    </EditableText>
                    {' — '}
                    <EditableText field={`resume.education.${index}.school`} section="resume" label="School" as="span">
                      {item.school}
                    </EditableText>
                    {' '}
                    <em>
                      <EditableText field={`resume.education.${index}.period`} section="resume" label="Period" as="span">
                        {item.period}
                      </EditableText>
                    </em>
                  </h3>
                  <ul>
                    {(item.bullets || []).map((bullet, bulletIndex) => (
                      <li key={`edu-${index}-${bulletIndex}`}>
                        <EditableText
                          field={`resume.education.${index}.bullets.${bulletIndex}`}
                          section="resume"
                          label="Bullet"
                          as="span"
                        >
                          {bullet}
                        </EditableText>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="smcls-resume-col">
              <h2>
                <EditableText field="resume.experienceTitle" section="resume" label="Experience title" as="span">
                  {resume.experienceTitle}
                </EditableText>
              </h2>
              {(resume.experience || []).map((item, index) => (
                <div key={`exp-${index}`} className="smcls-resume-item">
                  <h3>
                    <EditableText field={`resume.experience.${index}.role`} section="resume" label="Role" as="span">
                      {item.role}
                    </EditableText>
                    {' — '}
                    <EditableText field={`resume.experience.${index}.company`} section="resume" label="Company" as="span">
                      {item.company}
                    </EditableText>
                    {' '}
                    <em>
                      <EditableText field={`resume.experience.${index}.period`} section="resume" label="Period" as="span">
                        {item.period}
                      </EditableText>
                    </em>
                  </h3>
                  <ul>
                    {(item.bullets || []).map((bullet, bulletIndex) => (
                      <li key={`exp-${index}-${bulletIndex}`}>
                        <EditableText
                          field={`resume.experience.${index}.bullets.${bulletIndex}`}
                          section="resume"
                          label="Bullet"
                          as="span"
                        >
                          {bullet}
                        </EditableText>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {c.links?.resume ? (
            <div className="smcls-resume-actions">
              <a href={c.links.resume} className="smcls-btn-primary" target="_blank" rel="noreferrer">
                <AiOutlineDownload />{' '}
                <EditableText field="resume.downloadLabel" section="resume" label="Download label" as="span">
                  {resume.downloadLabel}
                </EditableText>
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Footer({ c }) {
  const year = new Date().getFullYear();

  return (
    <footer className="smcls-footer">
      <div className="smcls-footer-grid">
        <h3>
          <EditableText field="footer.credit" section="hero" label="Footer credit" as="span">
            {c.footer?.credit}
          </EditableText>
        </h3>
        <h3>
          Copyright © {year}{' '}
          <EditableText field="footer.copyrightShort" section="hero" label="Copyright short" as="span">
            {c.footer?.copyrightShort}
          </EditableText>
        </h3>
        <ul className="smcls-footer-icons">
          {c.links?.github ? (
            <li>
              <a href={c.links.github} className="smcls-social-icon" target="_blank" rel="noreferrer" aria-label="GitHub">
                <AiFillGithub />
              </a>
            </li>
          ) : null}
          {c.links?.twitter ? (
            <li>
              <a href={c.links.twitter} className="smcls-social-icon" target="_blank" rel="noreferrer" aria-label="Twitter">
                <AiOutlineTwitter />
              </a>
            </li>
          ) : null}
          {c.links?.linkedin ? (
            <li>
              <a href={c.links.linkedin} className="smcls-social-icon" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </li>
          ) : null}
          {c.links?.instagram ? (
            <li>
              <a href={c.links.instagram} className="smcls-social-icon" target="_blank" rel="noreferrer" aria-label="Instagram">
                <AiFillInstagram />
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </footer>
  );
}

export default function SoumyaClassicTemplate({
  preview = false,
  compact = false,
  editable = false,
  content,
  sectionOrder,
  theme,
  focusedSection,
  onFocusedSectionChange,
}) {
  const c = content || defaultContent;
  const [loading, setLoading] = useState(!editable);
  const [navOpen, setNavOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [activePage, setActivePage] = useState('hero');

  const initials = useMemo(() => deriveInitials(c.name, c.initials), [c.name, c.initials]);
  const accentHex = useMemo(
    () => (theme?.vars?.['--smcls-purple'] || '#c770f0').replace('#', ''),
    [theme]
  );

  useEffect(() => {
    if (editable) {
      setLoading(false);
      return undefined;
    }
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [editable]);

  useEffect(() => {
    if (focusedSection && PAGES.includes(focusedSection)) {
      setActivePage(focusedSection);
    }
  }, [focusedSection]);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToPage = useCallback(
    (page, event) => {
      event?.preventDefault();
      if (!PAGES.includes(page)) return;
      setActivePage(page);
      setNavOpen(false);
      onFocusedSectionChange?.(page);
      if (!editable) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [editable, onFocusedSectionChange]
  );

  const navItems = [
    { id: 'hero', label: 'Home', Icon: AiOutlineHome },
    { id: 'about', label: 'About', Icon: AiOutlineUser },
    { id: 'projects', label: 'Projects', Icon: AiOutlineFundProjectionScreen },
    { id: 'resume', label: 'Resume', Icon: CgFileDocument },
  ];

  const pageContent = {
    hero: <HomePage c={c} />,
    about: <AboutPage c={c} accentHex={accentHex} />,
    projects: <ProjectsPage c={c} />,
    resume: <ResumePage c={c} />,
  }[activePage];
  const sectionPageMap = c.sectionPageMap || {};
  const extraSectionOrder = (sectionOrder || []).filter((id) => !PAGES.includes(id));
  const visibleExtraSections = extraSectionOrder.filter(
    (sectionId) => (sectionPageMap[sectionId] || 'projects') === activePage
  );

  return (
    <div
      className={`smcls${loading ? ' smcls--loading' : ''}${preview ? ' smcls--preview' : ''}${compact ? ' smcls--compact' : ''}${editable ? ' smcls--editable' : ''}${theme ? ` smcls--theme-${theme.id}` : ''}`}
      style={theme?.vars}
    >
      <Preloader active={loading} />
      <ParticleField />
      <div className="smcls-shell">
        <header className={`smcls-nav${sticky ? ' smcls-nav--sticky' : ''}`}>
          <button type="button" className="smcls-nav-brand" onClick={(e) => goToPage('hero', e)} aria-label="Home">
            {initials}
          </button>
          <button
            type="button"
            className="smcls-nav-toggle"
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <ul className={`smcls-nav-links${navOpen ? ' smcls-nav-links--open' : ''}`}>
            {navItems.map(({ id, label, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  className={`smcls-nav-link${activePage === id ? ' smcls-nav-link--active' : ''}`}
                  onClick={(e) => goToPage(id, e)}
                >
                  <Icon style={{ marginBottom: '2px' }} /> {label}
                </button>
              </li>
            ))}
            {c.links?.blog ? (
              <li>
                <a href={c.links.blog} className="smcls-nav-link smcls-nav-link--external" target="_blank" rel="noreferrer">
                  <ImBlog style={{ marginBottom: '2px' }} />{' '}
                  {c.navBlogLabel || 'Blogs'}
                </a>
              </li>
            ) : null}
            {c.links?.fork ? (
              <li>
                <a href={c.links.fork} className="smcls-fork-btn" target="_blank" rel="noreferrer" aria-label="View source">
                  <CgGitFork style={{ fontSize: '1.2em' }} />
                  <AiFillStar style={{ fontSize: '1.1em' }} />
                </a>
              </li>
            ) : null}
          </ul>
        </header>

        <main className="smcls-main">
          {pageContent}
          {visibleExtraSections.map((sectionId) => (
            <TemplateSortableBlock key={sectionId} id={sectionId} editable={editable}>
              <UniversalTemplateSection sectionId={sectionId} c={c} preview={preview} />
            </TemplateSortableBlock>
          ))}
        </main>
        <Footer c={c} />
      </div>
    </div>
  );
}
