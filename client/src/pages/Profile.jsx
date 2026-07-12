import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiLink,
  FiCpu,
  FiBriefcase,
  FiBookOpen,
  FiFolder,
  FiBarChart2,
  FiSave,
  FiLayout,
  FiCamera,
  FiUpload,
  FiFileText,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiMapPin,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { createEmptyMasterProfile } from '../constants/masterProfile';
import { mergeExtractedIntoProfile } from '../utils/masterProfileMerge';
import {
  fetchMasterProfile,
  saveMasterProfile,
  parseResumeFile,
  saveLocalMasterProfile,
} from '../utils/masterProfileStorage';
import { commitListFields, listDraftsFromProfile, parseCommaList } from '../utils/profileListFields';
import { readProfileImage } from '../utils/profileImage';
import { readResumeFile } from '../utils/resumeFile';
import { countSkillItems } from '../utils/profileSkillUtils';
import '../styles/profile.css';

const TABS = [
  { id: 'personal', label: 'Personal', icon: FiUser },
  { id: 'links', label: 'Links & Resume', icon: FiLink },
  { id: 'skills', label: 'Skills', icon: FiCpu },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'education', label: 'Education', icon: FiBookOpen },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'highlights', label: 'Stats', icon: FiBarChart2 },
];

function Field({ label, children, hint, wide }) {
  return (
    <div className={`profile-field${wide ? ' profile-field--wide' : ''}`}>
      <label>{label}</label>
      {children}
      {hint ? <span className="profile-field-hint">{hint}</span> : null}
    </div>
  );
}

function ListBlock({ title, subtitle, onRemove, children }) {
  return (
    <div className="profile-list-block">
      <div className="profile-list-block-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {onRemove ? (
          <button type="button" className="profile-btn-icon" onClick={onRemove} aria-label="Remove">
            <FiTrash2 />
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, actionLabel, onAction }) {
  return (
    <div className="profile-empty">
      <div className="profile-empty-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && onAction ? (
        <button type="button" className="profile-btn-secondary" onClick={onAction}>
          <FiPlus />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function initialsFrom(name) {
  return (name || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('personal');
  const [profile, setProfile] = useState(createEmptyMasterProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [extractPreview, setExtractPreview] = useState(null);
  const [skillDrafts, setSkillDrafts] = useState([]);
  const [techDrafts, setTechDrafts] = useState([]);
  const [dirty, setDirty] = useState(false);

  const applyProfileState = useCallback((dataOrFn) => {
    if (typeof dataOrFn === 'function') {
      setProfile((prev) => {
        const data = dataOrFn(prev);
        const drafts = listDraftsFromProfile(data);
        setSkillDrafts(drafts.skillDrafts);
        setTechDrafts(drafts.techDrafts);
        return data;
      });
      return;
    }
    setProfile(dataOrFn);
    const drafts = listDraftsFromProfile(dataOrFn);
    setSkillDrafts(drafts.skillDrafts);
    setTechDrafts(drafts.techDrafts);
  }, []);

  const markDirty = useCallback((updater) => {
    setDirty(true);
    setProfile(updater);
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMasterProfile(user?.id);
      applyProfileState({
        ...data,
        personal: {
          ...data.personal,
          name: data.personal.name || user?.name || '',
        },
        links: {
          ...data.links,
          email: data.links.email || user?.email || '',
        },
      });
      setDirty(false);
    } catch {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  }, [user, applyProfileState]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(profile.personal?.name),
      Boolean(profile.personal?.headline || profile.personal?.tagline),
      Boolean(profile.personal?.bio || profile.personal?.about),
      Boolean(profile.links?.email),
      Boolean(profile.links?.github || profile.links?.linkedin || profile.links?.website),
      Boolean(profile.profileImage),
      Boolean(profile.resume || profile.links?.resume),
      countSkillItems(profile) > 0,
      (profile.experience || []).some((j) => j.role || j.company),
      (profile.education || []).some((e) => e.school || e.degree),
      (profile.projects || []).some((p) => p.title),
      (profile.highlights || []).some((h) => h.value || h.label),
    ];
    const done = checks.filter(Boolean).length;
    return {
      done,
      total: checks.length,
      percent: Math.round((done / checks.length) * 100),
    };
  }, [profile]);

  const tabMeta = useMemo(() => {
    const skills = countSkillItems(profile);
    return {
      personal: profile.personal?.name ? 1 : 0,
      links: [profile.links?.email, profile.links?.github, profile.links?.linkedin, profile.resume].filter(Boolean)
        .length,
      skills,
      experience: profile.experience?.length || 0,
      education: profile.education?.length || 0,
      projects: profile.projects?.length || 0,
      highlights: profile.highlights?.length || 0,
    };
  }, [profile]);

  const updatePersonal = (patch) => {
    setDirty(true);
    setProfile((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }));
  };

  const updateLinks = (patch) => {
    setDirty(true);
    setProfile((prev) => ({ ...prev, links: { ...prev.links, ...patch } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = commitListFields(profile, skillDrafts, techDrafts);
      const saved = await saveMasterProfile(user?.id, payload);
      applyProfileState(saved);
      setDirty(false);
      toast.success('Profile saved');
    } catch (err) {
      if (err.response) {
        toast.error(err.response?.data?.message || 'Save failed — kept locally');
      } else {
        setDirty(false);
        toast.success('Saved locally — server unavailable');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleOpenBuilder = () => {
    const payload = commitListFields(profile, skillDrafts, techDrafts);
    applyProfileState(payload);
    saveLocalMasterProfile(user?.id, payload);
    navigate('/templates');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await readProfileImage(file);
      markDirty((prev) => ({ ...prev, profileImage: dataUrl }));
      toast.success('Photo added — save to keep');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePhotoRemove = () => {
    markDirty((prev) => ({ ...prev, profileImage: null }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setParsing(true);
    try {
      const { extracted, resumeDataUrl, textPreview } = await parseResumeFile(file);
      setExtractPreview({ extracted, textPreview });
      setDirty(true);
      applyProfileState((prev) => ({
        ...mergeExtractedIntoProfile(prev, extracted, { replaceLists: true }),
        resume: resumeDataUrl,
        links: {
          ...prev.links,
          resume: resumeDataUrl,
        },
      }));
      toast.success('Resume parsed — review fields and save');
    } catch (err) {
      try {
        const dataUrl = await readResumeFile(file);
        setDirty(true);
        setProfile((prev) => ({
          ...prev,
          resume: dataUrl,
          links: { ...prev.links, resume: dataUrl },
        }));
        toast.success('Resume stored (text extraction unavailable)');
      } catch (readErr) {
        toast.error(err.response?.data?.message || readErr.message || 'Resume upload failed');
      }
    } finally {
      setParsing(false);
    }
  };

  const applyExtracted = () => {
    if (!extractPreview?.extracted) return;
    setDirty(true);
    applyProfileState((prev) =>
      mergeExtractedIntoProfile(prev, extractPreview.extracted, { replaceLists: true })
    );
    setExtractPreview(null);
    toast.success('Extracted data applied');
  };

  const activeTab = TABS.find((item) => item.id === tab) || TABS[0];
  const ActiveIcon = activeTab.icon;

  if (loading) {
    return (
      <div className="profile-page profile-page--loading">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <motion.header
        className="profile-hero"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="profile-hero-copy">
          <p className="profile-hero-kicker">Master profile</p>
          <h1>Build once. Reuse everywhere.</h1>
          <p>
            Keep your identity, skills, and story in one place — every template pulls from this
            profile when you open the builder.
          </p>
          <div className="profile-hero-meta">
            {profile.personal.location ? (
              <span>
                <FiMapPin />
                {profile.personal.location}
              </span>
            ) : null}
            {dirty ? <span className="profile-hero-pill profile-hero-pill--warn">Unsaved changes</span> : null}
            {!dirty && completion.percent >= 70 ? (
              <span className="profile-hero-pill profile-hero-pill--ok">
                <FiCheck />
                Looking solid
              </span>
            ) : null}
          </div>
        </div>

        <div className="profile-hero-side">
          <div className="profile-completeness" role="status" aria-label={`Profile ${completion.percent}% complete`}>
            <div
              className="profile-completeness-ring"
              style={{ '--pct': completion.percent }}
            >
              <div className="profile-completeness-ring-inner">
                <strong>{completion.percent}%</strong>
                <span>complete</span>
              </div>
            </div>
            <div className="profile-completeness-copy">
              <strong>
                {completion.done}/{completion.total} essentials
              </strong>
              <p>Fill more fields to strengthen every published portfolio.</p>
            </div>
          </div>
          <div className="profile-header-actions">
            <button type="button" className="profile-btn-ghost" onClick={handleOpenBuilder}>
              <FiLayout />
              Open templates
            </button>
            <button type="button" className="profile-btn-primary" onClick={handleSave} disabled={saving}>
              <FiSave />
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>
      </motion.header>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-identity">
            <div className={`profile-avatar${profile.profileImage ? '' : ' profile-avatar--empty'}`}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="" />
              ) : (
                <span>{initialsFrom(profile.personal.name || user?.name)}</span>
              )}
            </div>
            <div className="profile-identity-text">
              <strong>{profile.personal.name || user?.name || 'Your name'}</strong>
              <span>{profile.personal.headline || profile.personal.tagline || 'Add a headline'}</span>
            </div>
            <div className="profile-identity-actions">
              <label className="profile-btn-secondary profile-upload-label">
                <FiCamera />
                {profile.profileImage ? 'Change photo' : 'Upload photo'}
                <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
              </label>
              {profile.profileImage ? (
                <button type="button" className="profile-btn-ghost profile-btn-ghost--sm" onClick={handlePhotoRemove}>
                  Remove
                </button>
              ) : null}
            </div>
          </div>

          <nav className="profile-tabs" aria-label="Profile sections">
            {TABS.map((item) => {
              const Icon = item.icon;
              const count = tabMeta[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`profile-tab${tab === item.id ? ' profile-tab--active' : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  <Icon className="profile-tab-icon" />
                  <span className="profile-tab-label">{item.label}</span>
                  {count > 0 && item.id !== 'personal' ? (
                    <span className="profile-tab-count">{count}</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="profile-panel">
          <div className="profile-panel-head">
            <div className="profile-panel-title">
              <ActiveIcon />
              <div>
                <h2>{activeTab.label}</h2>
                <p>
                  {tab === 'personal' && 'Core identity used across heroes and about sections.'}
                  {tab === 'links' && 'Contact links and resume used in CTAs and footers.'}
                  {tab === 'skills' && 'Grouped skills that power skill grids and tags.'}
                  {tab === 'experience' && 'Roles and companies for timeline sections.'}
                  {tab === 'education' && 'Schools and degrees for education blocks.'}
                  {tab === 'projects' && 'Featured work shown in project galleries.'}
                  {tab === 'highlights' && 'Short stats for hero and about metric rows.'}
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {tab === 'personal' && (
                <section className="profile-section">
                  <div className="profile-grid">
                    <Field label="Full name">
                      <input
                        value={profile.personal.name}
                        onChange={(e) => updatePersonal({ name: e.target.value })}
                        placeholder="Alex Rivera"
                      />
                    </Field>
                    <Field label="Headline / role">
                      <input
                        value={profile.personal.headline}
                        onChange={(e) => updatePersonal({ headline: e.target.value })}
                        placeholder="Senior Software Engineer"
                      />
                    </Field>
                    <Field label="Tagline">
                      <input
                        value={profile.personal.tagline}
                        onChange={(e) => updatePersonal({ tagline: e.target.value })}
                        placeholder="Building products people love"
                      />
                    </Field>
                    <Field label="Greeting">
                      <input
                        value={profile.personal.greeting}
                        onChange={(e) => updatePersonal({ greeting: e.target.value })}
                        placeholder="Hi, I'm Alex"
                      />
                    </Field>
                    <Field label="Location">
                      <input
                        value={profile.personal.location}
                        onChange={(e) => updatePersonal({ location: e.target.value })}
                        placeholder="San Francisco, CA"
                      />
                    </Field>
                    <Field label="Availability">
                      <input
                        value={profile.personal.availability}
                        onChange={(e) => updatePersonal({ availability: e.target.value })}
                        placeholder="Open to opportunities"
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        value={profile.personal.phone}
                        onChange={(e) => updatePersonal({ phone: e.target.value })}
                        placeholder="+1 555 000 0000"
                      />
                    </Field>
                    <Field label="Brand tag">
                      <input
                        value={profile.personal.brandTag}
                        onChange={(e) => updatePersonal({ brandTag: e.target.value })}
                        placeholder="alex.dev"
                      />
                    </Field>
                    <Field label="Site name" wide>
                      <input
                        value={profile.personal.siteName}
                        onChange={(e) => updatePersonal({ siteName: e.target.value })}
                        placeholder="yoursite.dev"
                      />
                    </Field>
                  </div>
                  <Field
                    label="Short bio"
                    hint={`${(profile.personal.bio || '').length} characters · great for hero subtitles`}
                  >
                    <textarea
                      rows={3}
                      value={profile.personal.bio}
                      onChange={(e) => updatePersonal({ bio: e.target.value })}
                      placeholder="A crisp one-liner about what you do."
                    />
                  </Field>
                  <Field
                    label="About (longer)"
                    hint={`${(profile.personal.about || '').length} characters · used in about sections`}
                  >
                    <textarea
                      rows={5}
                      value={profile.personal.about}
                      onChange={(e) => updatePersonal({ about: e.target.value })}
                      placeholder="Tell your story — background, focus areas, and what you're aiming for next."
                    />
                  </Field>
                </section>
              )}

              {tab === 'links' && (
                <section className="profile-section">
                  <div className="profile-grid">
                    <Field label="Email">
                      <input
                        type="email"
                        value={profile.links.email}
                        onChange={(e) => updateLinks({ email: e.target.value })}
                        placeholder="you@example.com"
                      />
                    </Field>
                    <Field label="GitHub">
                      <input
                        value={profile.links.github}
                        onChange={(e) => updateLinks({ github: e.target.value })}
                        placeholder="https://github.com/you"
                      />
                    </Field>
                    <Field label="LinkedIn">
                      <input
                        value={profile.links.linkedin}
                        onChange={(e) => updateLinks({ linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/you"
                      />
                    </Field>
                    <Field label="Website">
                      <input
                        value={profile.links.website}
                        onChange={(e) => updateLinks({ website: e.target.value })}
                        placeholder="https://yoursite.dev"
                      />
                    </Field>
                    <Field label="Twitter / X">
                      <input
                        value={profile.links.twitter}
                        onChange={(e) => updateLinks({ twitter: e.target.value })}
                        placeholder="https://x.com/you"
                      />
                    </Field>
                    <Field label="Instagram">
                      <input
                        value={profile.links.instagram}
                        onChange={(e) => updateLinks({ instagram: e.target.value })}
                        placeholder="https://instagram.com/you"
                      />
                    </Field>
                  </div>

                  <div className={`profile-resume-box${profile.resume ? ' profile-resume-box--ready' : ''}`}>
                    <div className="profile-resume-icon">
                      <FiFileText />
                    </div>
                    <div className="profile-resume-copy">
                      <h3>Resume (PDF)</h3>
                      <p>
                        Upload a PDF to extract skills, experience, education, projects, and contact
                        links automatically.
                      </p>
                      {profile.resume ? (
                        <p className="profile-resume-status">
                          <FiCheck />
                          Resume attached — available in portfolio download links
                        </p>
                      ) : null}
                    </div>
                    <label
                      className={`profile-btn-primary profile-upload-label${parsing ? ' profile-upload-label--busy' : ''}`}
                    >
                      <FiUpload />
                      {parsing ? 'Parsing…' : profile.resume ? 'Replace PDF' : 'Upload & extract'}
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        hidden
                        onChange={handleResumeUpload}
                        disabled={parsing}
                      />
                    </label>
                  </div>

                  {extractPreview ? (
                    <div className="profile-extract-preview">
                      <h3>Extracted from resume</h3>
                      <ul>
                        {extractPreview.extracted.personal?.name ? (
                          <li>Name: {extractPreview.extracted.personal.name}</li>
                        ) : null}
                        {extractPreview.extracted.links?.email ? (
                          <li>Email: {extractPreview.extracted.links.email}</li>
                        ) : null}
                        {extractPreview.extracted.experience?.length > 0 ? (
                          <li>{extractPreview.extracted.experience.length} experience entries</li>
                        ) : null}
                        {extractPreview.extracted.education?.length > 0 ? (
                          <li>{extractPreview.extracted.education.length} education entries</li>
                        ) : null}
                        {extractPreview.extracted.skillGroups?.[0]?.items?.length > 0 ? (
                          <li>{extractPreview.extracted.skillGroups[0].items.length}+ skills detected</li>
                        ) : null}
                      </ul>
                      <div className="profile-extract-actions">
                        <button type="button" className="profile-btn-secondary" onClick={applyExtracted}>
                          Apply to profile
                        </button>
                        <button
                          type="button"
                          className="profile-btn-ghost"
                          onClick={() => setExtractPreview(null)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ) : null}
                </section>
              )}

              {tab === 'skills' && (
                <section className="profile-section">
                  {profile.skillGroups.length === 0 ? (
                    <EmptyState
                      icon={FiCpu}
                      title="No skill groups yet"
                      text="Group your stack so templates can render clean skill grids."
                      actionLabel="Add skill group"
                      onAction={() => {
                        setDirty(true);
                        setProfile((prev) => ({
                          ...prev,
                          skillGroups: [...prev.skillGroups, { name: 'Skills', items: [] }],
                        }));
                        setSkillDrafts((prev) => [...prev, '']);
                      }}
                    />
                  ) : (
                    <>
                      {profile.skillGroups.map((group, gi) => (
                        <ListBlock
                          key={gi}
                          title={group.name || 'Skills'}
                          subtitle={`${(group.items || []).length} skills`}
                          onRemove={
                            profile.skillGroups.length > 1
                              ? () => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    skillGroups: prev.skillGroups.filter((_, i) => i !== gi),
                                  }));
                                  setSkillDrafts((prev) => prev.filter((_, i) => i !== gi));
                                }
                              : null
                          }
                        >
                          <Field label="Group name">
                            <input
                              value={group.name}
                              onChange={(e) => {
                                setDirty(true);
                                setProfile((prev) => ({
                                  ...prev,
                                  skillGroups: prev.skillGroups.map((g, i) =>
                                    i === gi ? { ...g, name: e.target.value } : g
                                  ),
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Skills (comma-separated)">
                            <textarea
                              rows={3}
                              value={skillDrafts[gi] ?? (group.items || []).join(', ')}
                              onChange={(e) => {
                                setDirty(true);
                                setSkillDrafts((prev) => {
                                  const next = [...prev];
                                  next[gi] = e.target.value;
                                  return next;
                                });
                              }}
                              onBlur={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  skillGroups: prev.skillGroups.map((g, i) =>
                                    i === gi ? { ...g, items: parseCommaList(e.target.value) } : g
                                  ),
                                }))
                              }
                              placeholder="React, TypeScript, Node.js"
                            />
                          </Field>
                        </ListBlock>
                      ))}
                      <button
                        type="button"
                        className="profile-btn-secondary"
                        onClick={() => {
                          setDirty(true);
                          setProfile((prev) => ({
                            ...prev,
                            skillGroups: [...prev.skillGroups, { name: 'Skills', items: [] }],
                          }));
                          setSkillDrafts((prev) => [...prev, '']);
                        }}
                      >
                        <FiPlus />
                        Add skill group
                      </button>
                    </>
                  )}
                </section>
              )}

              {tab === 'experience' && (
                <section className="profile-section">
                  {profile.experience.length === 0 ? (
                    <EmptyState
                      icon={FiBriefcase}
                      title="No experience yet"
                      text="Add roles so templates can build your career timeline."
                      actionLabel="Add experience"
                      onAction={() => {
                        setDirty(true);
                        setProfile((prev) => ({
                          ...prev,
                          experience: [
                            ...prev.experience,
                            { role: '', company: '', period: '', description: '' },
                          ],
                        }));
                      }}
                    />
                  ) : (
                    <>
                      {profile.experience.map((job, index) => (
                        <ListBlock
                          key={index}
                          title={job.role || `Role ${index + 1}`}
                          subtitle={[job.company, job.period].filter(Boolean).join(' · ')}
                          onRemove={() => {
                            setDirty(true);
                            setProfile((prev) => ({
                              ...prev,
                              experience: prev.experience.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <div className="profile-grid">
                            <Field label="Role">
                              <input
                                value={job.role}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    experience: prev.experience.map((item, i) =>
                                      i === index ? { ...item, role: e.target.value } : item
                                    ),
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Company">
                              <input
                                value={job.company}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    experience: prev.experience.map((item, i) =>
                                      i === index ? { ...item, company: e.target.value } : item
                                    ),
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Period" wide>
                              <input
                                value={job.period}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    experience: prev.experience.map((item, i) =>
                                      i === index ? { ...item, period: e.target.value } : item
                                    ),
                                  }));
                                }}
                                placeholder="2021 – Present"
                              />
                            </Field>
                          </div>
                          <Field label="Description">
                            <textarea
                              rows={3}
                              value={job.description}
                              onChange={(e) => {
                                setDirty(true);
                                setProfile((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((item, i) =>
                                    i === index ? { ...item, description: e.target.value } : item
                                  ),
                                }));
                              }}
                            />
                          </Field>
                        </ListBlock>
                      ))}
                      <button
                        type="button"
                        className="profile-btn-secondary"
                        onClick={() => {
                          setDirty(true);
                          setProfile((prev) => ({
                            ...prev,
                            experience: [
                              ...prev.experience,
                              { role: '', company: '', period: '', description: '' },
                            ],
                          }));
                        }}
                      >
                        <FiPlus />
                        Add experience
                      </button>
                    </>
                  )}
                </section>
              )}

              {tab === 'education' && (
                <section className="profile-section">
                  {profile.education.length === 0 ? (
                    <EmptyState
                      icon={FiBookOpen}
                      title="No education yet"
                      text="Add schools and degrees for education sections."
                      actionLabel="Add education"
                      onAction={() => {
                        setDirty(true);
                        setProfile((prev) => ({
                          ...prev,
                          education: [
                            ...prev.education,
                            { school: '', degree: '', period: '', description: '' },
                          ],
                        }));
                      }}
                    />
                  ) : (
                    <>
                      {profile.education.map((edu, index) => (
                        <ListBlock
                          key={index}
                          title={edu.school || `Education ${index + 1}`}
                          subtitle={[edu.degree, edu.period].filter(Boolean).join(' · ')}
                          onRemove={() => {
                            setDirty(true);
                            setProfile((prev) => ({
                              ...prev,
                              education: prev.education.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <div className="profile-grid">
                            <Field label="School">
                              <input
                                value={edu.school}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    education: prev.education.map((item, i) =>
                                      i === index ? { ...item, school: e.target.value } : item
                                    ),
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Degree">
                              <input
                                value={edu.degree}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    education: prev.education.map((item, i) =>
                                      i === index ? { ...item, degree: e.target.value } : item
                                    ),
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Period" wide>
                              <input
                                value={edu.period}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    education: prev.education.map((item, i) =>
                                      i === index ? { ...item, period: e.target.value } : item
                                    ),
                                  }));
                                }}
                              />
                            </Field>
                          </div>
                        </ListBlock>
                      ))}
                      <button
                        type="button"
                        className="profile-btn-secondary"
                        onClick={() => {
                          setDirty(true);
                          setProfile((prev) => ({
                            ...prev,
                            education: [
                              ...prev.education,
                              { school: '', degree: '', period: '', description: '' },
                            ],
                          }));
                        }}
                      >
                        <FiPlus />
                        Add education
                      </button>
                    </>
                  )}
                </section>
              )}

              {tab === 'projects' && (
                <section className="profile-section">
                  {profile.projects.length === 0 ? (
                    <EmptyState
                      icon={FiFolder}
                      title="No projects yet"
                      text="Showcase work that templates can feature in project galleries."
                      actionLabel="Add project"
                      onAction={() => {
                        setDirty(true);
                        setProfile((prev) => ({
                          ...prev,
                          projects: [
                            ...prev.projects,
                            { title: '', subtitle: '', tech: [], link: '', featured: false },
                          ],
                        }));
                        setTechDrafts((prev) => [...prev, '']);
                      }}
                    />
                  ) : (
                    <>
                      {profile.projects.map((project, index) => (
                        <ListBlock
                          key={index}
                          title={project.title || `Project ${index + 1}`}
                          subtitle={(project.tech || []).slice(0, 4).join(' · ')}
                          onRemove={() => {
                            setDirty(true);
                            setProfile((prev) => ({
                              ...prev,
                              projects: prev.projects.filter((_, i) => i !== index),
                            }));
                            setTechDrafts((prev) => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <Field label="Title">
                            <input
                              value={project.title}
                              onChange={(e) => {
                                setDirty(true);
                                setProfile((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((item, i) =>
                                    i === index ? { ...item, title: e.target.value } : item
                                  ),
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Description">
                            <textarea
                              rows={3}
                              value={project.subtitle}
                              onChange={(e) => {
                                setDirty(true);
                                setProfile((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((item, i) =>
                                    i === index ? { ...item, subtitle: e.target.value } : item
                                  ),
                                }));
                              }}
                            />
                          </Field>
                          <div className="profile-grid">
                            <Field label="Tech (comma-separated)">
                              <input
                                value={techDrafts[index] ?? (project.tech || []).join(', ')}
                                onChange={(e) => {
                                  setDirty(true);
                                  setTechDrafts((prev) => {
                                    const next = [...prev];
                                    next[index] = e.target.value;
                                    return next;
                                  });
                                }}
                                onBlur={(e) =>
                                  setProfile((prev) => ({
                                    ...prev,
                                    projects: prev.projects.map((item, i) =>
                                      i === index ? { ...item, tech: parseCommaList(e.target.value) } : item
                                    ),
                                  }))
                                }
                              />
                            </Field>
                            <Field label="Link">
                              <input
                                value={project.link || ''}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    projects: prev.projects.map((item, i) =>
                                      i === index ? { ...item, link: e.target.value } : item
                                    ),
                                  }));
                                }}
                                placeholder="https://"
                              />
                            </Field>
                          </div>
                        </ListBlock>
                      ))}
                      <button
                        type="button"
                        className="profile-btn-secondary"
                        onClick={() => {
                          setDirty(true);
                          setProfile((prev) => ({
                            ...prev,
                            projects: [
                              ...prev.projects,
                              { title: '', subtitle: '', tech: [], link: '', featured: false },
                            ],
                          }));
                          setTechDrafts((prev) => [...prev, '']);
                        }}
                      >
                        <FiPlus />
                        Add project
                      </button>
                    </>
                  )}
                </section>
              )}

              {tab === 'highlights' && (
                <section className="profile-section">
                  <p className="profile-section-lead">
                    Used in about sections and hero stat blocks across templates.
                  </p>
                  {profile.highlights.length === 0 ? (
                    <EmptyState
                      icon={FiBarChart2}
                      title="No highlights yet"
                      text="Add a few punchy stats like years of experience or projects shipped."
                      actionLabel="Add highlight"
                      onAction={() => {
                        setDirty(true);
                        setProfile((prev) => ({
                          ...prev,
                          highlights: [...prev.highlights, { value: '', label: '' }],
                        }));
                      }}
                    />
                  ) : (
                    <>
                      {profile.highlights.map((item, index) => (
                        <ListBlock
                          key={`h-${index}`}
                          title={item.label || `Highlight ${index + 1}`}
                          subtitle={item.value || undefined}
                          onRemove={() => {
                            setDirty(true);
                            setProfile((prev) => ({
                              ...prev,
                              highlights: prev.highlights.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <div className="profile-grid">
                            <Field label="Value">
                              <input
                                value={item.value}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    highlights: prev.highlights.map((h, i) =>
                                      i === index ? { ...h, value: e.target.value } : h
                                    ),
                                  }));
                                }}
                                placeholder="5+"
                              />
                            </Field>
                            <Field label="Label">
                              <input
                                value={item.label}
                                onChange={(e) => {
                                  setDirty(true);
                                  setProfile((prev) => ({
                                    ...prev,
                                    highlights: prev.highlights.map((h, i) =>
                                      i === index ? { ...h, label: e.target.value } : h
                                    ),
                                  }));
                                }}
                                placeholder="Years experience"
                              />
                            </Field>
                          </div>
                        </ListBlock>
                      ))}
                      <button
                        type="button"
                        className="profile-btn-secondary"
                        onClick={() => {
                          setDirty(true);
                          setProfile((prev) => ({
                            ...prev,
                            highlights: [...prev.highlights, { value: '', label: '' }],
                          }));
                        }}
                      >
                        <FiPlus />
                        Add highlight
                      </button>
                    </>
                  )}
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {dirty ? (
        <div className="profile-sticky-bar">
          <span>You have unsaved changes</span>
          <button type="button" className="profile-btn-primary" onClick={handleSave} disabled={saving}>
            <FiSave />
            {saving ? 'Saving…' : 'Save now'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
