import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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
import '../styles/profile.css';

const TABS = [
  { id: 'personal', label: 'Personal' },
  { id: 'links', label: 'Links & Resume' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'highlights', label: 'Stats' },
];

function Field({ label, children, hint }) {
  return (
    <div className="profile-field">
      <label>{label}</label>
      {children}
      {hint && <span className="profile-field-hint">{hint}</span>}
    </div>
  );
}

function ListBlock({ title, onRemove, children }) {
  return (
    <div className="profile-list-block">
      <div className="profile-list-block-head">
        <h3>{title}</h3>
        {onRemove && (
          <button type="button" className="profile-btn-ghost" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
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
    } catch {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  }, [user, applyProfileState]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updatePersonal = (patch) => {
    setProfile((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }));
  };

  const updateLinks = (patch) => {
    setProfile((prev) => ({ ...prev, links: { ...prev.links, ...patch } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = commitListFields(profile, skillDrafts, techDrafts);
      const saved = await saveMasterProfile(user?.id, payload);
      applyProfileState(saved);
      toast.success('Profile saved');
    } catch (err) {
      if (err.response) {
        toast.error(err.response?.data?.message || 'Save failed — kept locally');
      } else {
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
      setProfile((prev) => ({ ...prev, profileImage: dataUrl }));
      toast.success('Photo added — save to keep');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setParsing(true);
    try {
      const { extracted, resumeDataUrl, textPreview } = await parseResumeFile(file);
      setExtractPreview({ extracted, textPreview });
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
    applyProfileState((prev) =>
      mergeExtractedIntoProfile(prev, extractPreview.extracted, { replaceLists: true })
    );
    setExtractPreview(null);
    toast.success('Extracted data applied');
  };

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
        className="profile-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Profile</h1>
          <p>
            Fill in your details once — use them across every portfolio template. Upload a resume to
            auto-fill experience, skills, education, and more.
          </p>
        </div>
        <div className="profile-header-actions">
          <button type="button" className="profile-btn-ghost" onClick={handleOpenBuilder}>
            Open builder
          </button>
          <button type="button" className="profile-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </motion.header>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar-block">
            <div className={`profile-avatar${profile.profileImage ? '' : ' profile-avatar--empty'}`}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="" />
              ) : (
                <span>
                  {(profile.personal.name || 'U')
                    .split(/\s+/)
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <label className="profile-btn-secondary profile-upload-label">
              Change photo
              <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
            </label>
          </div>

          <nav className="profile-tabs">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`profile-tab${tab === item.id ? ' profile-tab--active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="profile-panel">
          {tab === 'personal' && (
            <section className="profile-section">
              <h2>Personal information</h2>
              <div className="profile-grid">
                <Field label="Full name">
                  <input
                    value={profile.personal.name}
                    onChange={(e) => updatePersonal({ name: e.target.value })}
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
                  />
                </Field>
                <Field label="Greeting">
                  <input
                    value={profile.personal.greeting}
                    onChange={(e) => updatePersonal({ greeting: e.target.value })}
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={profile.personal.location}
                    onChange={(e) => updatePersonal({ location: e.target.value })}
                  />
                </Field>
                <Field label="Availability">
                  <input
                    value={profile.personal.availability}
                    onChange={(e) => updatePersonal({ availability: e.target.value })}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={profile.personal.phone}
                    onChange={(e) => updatePersonal({ phone: e.target.value })}
                  />
                </Field>
                <Field label="Brand tag">
                  <input
                    value={profile.personal.brandTag}
                    onChange={(e) => updatePersonal({ brandTag: e.target.value })}
                  />
                </Field>
                <Field label="Site name">
                  <input
                    value={profile.personal.siteName}
                    onChange={(e) => updatePersonal({ siteName: e.target.value })}
                    placeholder="yoursite.dev"
                  />
                </Field>
              </div>
              <Field label="Short bio">
                <textarea
                  rows={3}
                  value={profile.personal.bio}
                  onChange={(e) => updatePersonal({ bio: e.target.value })}
                />
              </Field>
              <Field label="About (longer)">
                <textarea
                  rows={5}
                  value={profile.personal.about}
                  onChange={(e) => updatePersonal({ about: e.target.value })}
                />
              </Field>
            </section>
          )}

          {tab === 'links' && (
            <section className="profile-section">
              <h2>Links & resume</h2>
              <div className="profile-grid">
                <Field label="Email">
                  <input
                    type="email"
                    value={profile.links.email}
                    onChange={(e) => updateLinks({ email: e.target.value })}
                  />
                </Field>
                <Field label="GitHub">
                  <input
                    value={profile.links.github}
                    onChange={(e) => updateLinks({ github: e.target.value })}
                  />
                </Field>
                <Field label="LinkedIn">
                  <input
                    value={profile.links.linkedin}
                    onChange={(e) => updateLinks({ linkedin: e.target.value })}
                  />
                </Field>
                <Field label="Website">
                  <input
                    value={profile.links.website}
                    onChange={(e) => updateLinks({ website: e.target.value })}
                  />
                </Field>
                <Field label="Twitter / X">
                  <input
                    value={profile.links.twitter}
                    onChange={(e) => updateLinks({ twitter: e.target.value })}
                  />
                </Field>
                <Field label="Instagram">
                  <input
                    value={profile.links.instagram}
                    onChange={(e) => updateLinks({ instagram: e.target.value })}
                  />
                </Field>
              </div>

              <div className="profile-resume-box">
                <h3>Resume (PDF)</h3>
                <p>Upload a PDF to extract skills, experience, education, projects, and contact links.</p>
                <label className={`profile-btn-primary profile-upload-label${parsing ? ' profile-upload-label--busy' : ''}`}>
                  {parsing ? 'Parsing resume…' : profile.resume ? 'Replace resume' : 'Upload & extract resume'}
                  <input type="file" accept="application/pdf,.pdf" hidden onChange={handleResumeUpload} disabled={parsing} />
                </label>
                {profile.resume && (
                  <p className="profile-resume-status">Resume attached — will appear in portfolio download links.</p>
                )}
              </div>

              {extractPreview && (
                <div className="profile-extract-preview">
                  <h3>Extracted from resume</h3>
                  <ul>
                    {extractPreview.extracted.personal?.name && (
                      <li>Name: {extractPreview.extracted.personal.name}</li>
                    )}
                    {extractPreview.extracted.links?.email && (
                      <li>Email: {extractPreview.extracted.links.email}</li>
                    )}
                    {extractPreview.extracted.experience?.length > 0 && (
                      <li>{extractPreview.extracted.experience.length} experience entries</li>
                    )}
                    {extractPreview.extracted.education?.length > 0 && (
                      <li>{extractPreview.extracted.education.length} education entries</li>
                    )}
                    {extractPreview.extracted.skillGroups?.[0]?.items?.length > 0 && (
                      <li>{extractPreview.extracted.skillGroups[0].items.length}+ skills detected</li>
                    )}
                  </ul>
                  <div className="profile-extract-actions">
                    <button type="button" className="profile-btn-secondary" onClick={applyExtracted}>
                      Apply to profile
                    </button>
                    <button type="button" className="profile-btn-ghost" onClick={() => setExtractPreview(null)}>
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {tab === 'skills' && (
            <section className="profile-section">
              <h2>Skills</h2>
              {profile.skillGroups.map((group, gi) => (
                <ListBlock
                  key={gi}
                  title={`Group: ${group.name || 'Skills'}`}
                  onRemove={
                    profile.skillGroups.length > 1
                      ? () => {
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
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          skillGroups: prev.skillGroups.map((g, i) =>
                            i === gi ? { ...g, name: e.target.value } : g
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Skills (comma-separated)">
                    <textarea
                      rows={3}
                      value={skillDrafts[gi] ?? (group.items || []).join(', ')}
                      onChange={(e) =>
                        setSkillDrafts((prev) => {
                          const next = [...prev];
                          next[gi] = e.target.value;
                          return next;
                        })
                      }
                      onBlur={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          skillGroups: prev.skillGroups.map((g, i) =>
                            i === gi ? { ...g, items: parseCommaList(e.target.value) } : g
                          ),
                        }))
                      }
                    />
                  </Field>
                </ListBlock>
              ))}
              <button
                type="button"
                className="profile-btn-secondary"
                onClick={() => {
                  setProfile((prev) => ({
                    ...prev,
                    skillGroups: [...prev.skillGroups, { name: 'Skills', items: [] }],
                  }));
                  setSkillDrafts((prev) => [...prev, '']);
                }}
              >
                Add skill group
              </button>
            </section>
          )}

          {tab === 'experience' && (
            <section className="profile-section">
              <h2>Experience</h2>
              {profile.experience.map((job, index) => (
                <ListBlock
                  key={index}
                  title={`Role ${index + 1}`}
                  onRemove={() =>
                    setProfile((prev) => ({
                      ...prev,
                      experience: prev.experience.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <div className="profile-grid">
                    <Field label="Role">
                      <input
                        value={job.role}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item, i) =>
                              i === index ? { ...item, role: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Company">
                      <input
                        value={job.company}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item, i) =>
                              i === index ? { ...item, company: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Period">
                      <input
                        value={job.period}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item, i) =>
                              i === index ? { ...item, period: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="2021 – Present"
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={job.description}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item, i) =>
                            i === index ? { ...item, description: e.target.value } : item
                          ),
                        }))
                      }
                    />
                  </Field>
                </ListBlock>
              ))}
              <button
                type="button"
                className="profile-btn-secondary"
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    experience: [
                      ...prev.experience,
                      { role: '', company: '', period: '', description: '' },
                    ],
                  }))
                }
              >
                Add experience
              </button>
            </section>
          )}

          {tab === 'education' && (
            <section className="profile-section">
              <h2>Education</h2>
              {profile.education.map((edu, index) => (
                <ListBlock
                  key={index}
                  title={`Education ${index + 1}`}
                  onRemove={() =>
                    setProfile((prev) => ({
                      ...prev,
                      education: prev.education.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <div className="profile-grid">
                    <Field label="School">
                      <input
                        value={edu.school}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            education: prev.education.map((item, i) =>
                              i === index ? { ...item, school: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Degree">
                      <input
                        value={edu.degree}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            education: prev.education.map((item, i) =>
                              i === index ? { ...item, degree: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Period">
                      <input
                        value={edu.period}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            education: prev.education.map((item, i) =>
                              i === index ? { ...item, period: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </Field>
                  </div>
                </ListBlock>
              ))}
              <button
                type="button"
                className="profile-btn-secondary"
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    education: [...prev.education, { school: '', degree: '', period: '', description: '' }],
                  }))
                }
              >
                Add education
              </button>
            </section>
          )}

          {tab === 'projects' && (
            <section className="profile-section">
              <h2>Projects</h2>
              {profile.projects.map((project, index) => (
                <ListBlock
                  key={index}
                  title={project.title || `Project ${index + 1}`}
                  onRemove={() => {
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
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          projects: prev.projects.map((item, i) =>
                            i === index ? { ...item, title: e.target.value } : item
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={project.subtitle}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          projects: prev.projects.map((item, i) =>
                            i === index ? { ...item, subtitle: e.target.value } : item
                          ),
                        }))
                      }
                    />
                  </Field>
                  <div className="profile-grid">
                    <Field label="Tech (comma-separated)">
                      <input
                        value={techDrafts[index] ?? (project.tech || []).join(', ')}
                        onChange={(e) =>
                          setTechDrafts((prev) => {
                            const next = [...prev];
                            next[index] = e.target.value;
                            return next;
                          })
                        }
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
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            projects: prev.projects.map((item, i) =>
                              i === index ? { ...item, link: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </Field>
                  </div>
                </ListBlock>
              ))}
              <button
                type="button"
                className="profile-btn-secondary"
                onClick={() => {
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
                Add project
              </button>
            </section>
          )}

          {tab === 'highlights' && (
            <section className="profile-section">
              <h2>Stats & highlights</h2>
              <p className="profile-section-lead">Used in about sections and hero stat blocks across templates.</p>
              {profile.highlights.map((item, index) => (
                <ListBlock
                  key={`h-${index}`}
                  title={`Highlight ${index + 1}`}
                  onRemove={() =>
                    setProfile((prev) => ({
                      ...prev,
                      highlights: prev.highlights.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <div className="profile-grid">
                    <Field label="Value">
                      <input
                        value={item.value}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            highlights: prev.highlights.map((h, i) =>
                              i === index ? { ...h, value: e.target.value } : h
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Label">
                      <input
                        value={item.label}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            highlights: prev.highlights.map((h, i) =>
                              i === index ? { ...h, label: e.target.value } : h
                            ),
                          }))
                        }
                      />
                    </Field>
                  </div>
                </ListBlock>
              ))}
              <button
                type="button"
                className="profile-btn-secondary"
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    highlights: [...prev.highlights, { value: '', label: '' }],
                  }))
                }
              >
                Add highlight
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
