import CommaListField from './CommaListField';
import { LIST_ITEM_DEFAULTS } from '../../constants/contentListDefaults';
import { appendListItem, removeListItemAt } from '../../utils/listFieldHelpers';
import ProfilePhotoField from './ProfilePhotoField';
import ProjectImageField from './ProjectImageField';
import ResumeField from './ResumeField';
import { templateHasFeature } from '../../constants/templateFeatures';
import { ItemBlock, AddListItemButton, InlineListRow } from './ListFieldControls';
import { vscodeStudioContent } from '../../portfolio-templates/vscode-studio/vscode-studio.content';

function FieldGroup({ label, htmlFor, children }) {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function SocialLinkFields({ content, onChange }) {
  const links = content.links || {};
  const updateLink = (key, value) => onChange({ links: { ...links, [key]: value } });

  return (
    <ItemBlock title="Nav links">
      <ResumeField
        resume={links.resume || ''}
        onChange={(value) => updateLink('resume', value)}
        inputId="link-resume"
      />
      <FieldGroup label="LinkedIn URL" htmlFor="link-linkedin">
        <input
          id="link-linkedin"
          value={links.linkedin || ''}
          onChange={(e) => updateLink('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
      </FieldGroup>
      <FieldGroup label="GitHub URL" htmlFor="link-github">
        <input
          id="link-github"
          value={links.github || ''}
          onChange={(e) => updateLink('github', e.target.value)}
          placeholder="https://github.com/..."
        />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="link-email">
        <input
          id="link-email"
          value={links.email || ''}
          onChange={(e) => updateLink('email', e.target.value)}
          placeholder="hello@example.com"
        />
      </FieldGroup>
    </ItemBlock>
  );
}

function SawadHeroFields({ content, onChange, templateId }) {
  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Name" htmlFor="name">
        <input id="name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Headline" htmlFor="title">
        <input
          id="title"
          value={content.title || ''}
          onChange={(e) => onChange({ title: e.target.value.toUpperCase() })}
        />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="tagline">
        <textarea id="tagline" rows={3} value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Bio" htmlFor="bio">
        <textarea id="bio" rows={4} value={content.bio || ''} onChange={(e) => onChange({ bio: e.target.value })} />
      </FieldGroup>
      <SocialLinkFields content={content} onChange={onChange} />
      {content.stats?.map((stat, index) => (
        <ItemBlock
          key={index}
          title={`Stat ${index + 1}`}
          canRemove={(content.stats?.length || 0) > 1}
          onRemove={() =>
            onChange({ stats: removeListItemAt(content.stats, index, 1) })
          }
        >
          <FieldGroup label="Value" htmlFor={`stat-value-${index}`}>
            <input
              id={`stat-value-${index}`}
              value={stat.value}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) => (i === index ? { ...item, value: e.target.value } : item)),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`stat-label-${index}`}>
            <input
              id={`stat-label-${index}`}
              value={stat.label}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Sub label" htmlFor={`stat-sub-${index}`}>
            <input
              id={`stat-sub-${index}`}
              value={stat.sub}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) => (i === index ? { ...item, sub: e.target.value } : item)),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add stat"
        onClick={() => onChange({ stats: appendListItem(content.stats, LIST_ITEM_DEFAULTS.statWithSub) })}
      />
    </div>
  );
}

function VscodeHeroFields({ content, onChange, templateId }) {
  const roles = content.roles || [];

  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Workspace name" htmlFor="vsc-workspace">
        <input
          id="vsc-workspace"
          value={content.workspaceName || ''}
          onChange={(e) => onChange({ workspaceName: e.target.value })}
          placeholder="johndoe-portfolio"
        />
      </FieldGroup>
      <FieldGroup label="Site title" htmlFor="vsc-site-title">
        <input
          id="vsc-site-title"
          value={content.siteTitle || ''}
          onChange={(e) => onChange({ siteTitle: e.target.value })}
          placeholder="portfolio"
        />
      </FieldGroup>
      <FieldGroup label="First name" htmlFor="vsc-name">
        <input id="vsc-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Highlighted name" htmlFor="vsc-name-highlight">
        <input
          id="vsc-name-highlight"
          value={content.nameHighlight || ''}
          onChange={(e) => onChange({ nameHighlight: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Roles" htmlFor="vsc-roles-0">
        {roles.map((role, index) => (
          <InlineListRow
            key={index}
            canRemove={roles.length > 0}
            onRemove={() => onChange({ roles: removeListItemAt(roles, index, 0) })}
          >
            <input
              id={index === 0 ? 'vsc-roles-0' : undefined}
              value={role}
              placeholder="e.g. Backend Engineer"
              onChange={(e) =>
                onChange({
                  roles: roles.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton
          label="Add role"
          onClick={() => onChange({ roles: appendListItem(roles, 'New Role') })}
        />
      </FieldGroup>
      <FieldGroup label="Company / handle" htmlFor="vsc-company">
        <input
          id="vsc-company"
          value={content.company || ''}
          onChange={(e) => onChange({ company: e.target.value })}
          placeholder="@ Your Company"
        />
      </FieldGroup>
      <FieldGroup label="Welcome comment" htmlFor="vsc-welcome">
        <input
          id="vsc-welcome"
          value={content.welcomeComment || ''}
          onChange={(e) => onChange({ welcomeComment: e.target.value })}
          placeholder="// hello world !!"
        />
      </FieldGroup>
      <FieldGroup label="Typing line" htmlFor="vsc-typing">
        <input
          id="vsc-typing"
          value={content.typingLine || ''}
          onChange={(e) => onChange({ typingLine: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Bio" htmlFor="vsc-bio">
        <textarea id="vsc-bio" rows={4} value={content.bio || ''} onChange={(e) => onChange({ bio: e.target.value })} />
      </FieldGroup>
      <SocialLinkFields content={content} onChange={onChange} />
      {content.stats?.map((stat, index) => (
        <ItemBlock
          key={index}
          title={`Stat ${index + 1}`}
          canRemove={(content.stats?.length || 0) > 1}
          onRemove={() => onChange({ stats: removeListItemAt(content.stats, index, 1) })}
        >
          <FieldGroup label="Value" htmlFor={`vsc-stat-value-${index}`}>
            <input
              id={`vsc-stat-value-${index}`}
              value={stat.value}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) =>
                    i === index ? { ...item, value: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`vsc-stat-label-${index}`}>
            <input
              id={`vsc-stat-label-${index}`}
              value={stat.label}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) =>
                    i === index ? { ...item, label: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add stat"
        onClick={() => onChange({ stats: appendListItem(content.stats, LIST_ITEM_DEFAULTS.stat) })}
      />
      <FieldGroup label="Footer text" htmlFor="vsc-footer">
        <input id="vsc-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function resolveVscodeCopilot(content) {
  const defaults = vscodeStudioContent.copilot;
  return {
    ...defaults,
    ...content.copilot,
    faqs: content.copilot?.faqs?.length ? content.copilot.faqs : defaults.faqs,
  };
}

function VscodeCopilotFields({ content, onChange }) {
  const copilot = resolveVscodeCopilot(content);
  const faqs = copilot.faqs;

  const updateCopilot = (patch) => {
    onChange({
      copilot: { ...resolveVscodeCopilot(content), ...patch },
    });
  };

  const updateFaqs = (nextFaqs) => updateCopilot({ faqs: nextFaqs });

  return (
    <div className="builder-fields">
      <FieldGroup label="Copilot name" htmlFor="vsc-copilot">
        <input
          id="vsc-copilot"
          value={content.copilotName || ''}
          onChange={(e) => onChange({ copilotName: e.target.value })}
          placeholder={vscodeStudioContent.copilotName}
        />
      </FieldGroup>
      <FieldGroup label="Assistant title" htmlFor="vsc-copilot-assistant">
        <input
          id="vsc-copilot-assistant"
          value={copilot.assistantTitle || ''}
          onChange={(e) => updateCopilot({ assistantTitle: e.target.value })}
          placeholder="John's AI Assistant"
        />
      </FieldGroup>
      <FieldGroup label="Welcome title" htmlFor="vsc-copilot-welcome-title">
        <input
          id="vsc-copilot-welcome-title"
          value={copilot.welcomeTitle || ''}
          onChange={(e) => updateCopilot({ welcomeTitle: e.target.value })}
          placeholder="Hi! I'm John's Copilot 👋"
        />
      </FieldGroup>
      <FieldGroup label="Welcome subtitle" htmlFor="vsc-copilot-welcome-sub">
        <textarea
          id="vsc-copilot-welcome-sub"
          rows={2}
          value={copilot.welcomeSubtitle || ''}
          onChange={(e) => updateCopilot({ welcomeSubtitle: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Input placeholder" htmlFor="vsc-copilot-placeholder">
        <input
          id="vsc-copilot-placeholder"
          value={copilot.inputPlaceholder || ''}
          onChange={(e) => updateCopilot({ inputPlaceholder: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Disclaimer" htmlFor="vsc-copilot-disclaimer">
        <input
          id="vsc-copilot-disclaimer"
          value={copilot.disclaimer || ''}
          onChange={(e) => updateCopilot({ disclaimer: e.target.value })}
        />
      </FieldGroup>
      <p className="builder-item-block-title">Questions &amp; answers</p>
      {faqs.map((faq, index) => (
        <ItemBlock
          key={index}
          title={`Q&A ${index + 1}`}
          canRemove={faqs.length > 1}
          onRemove={() => updateFaqs(removeListItemAt(faqs, index, 1))}
        >
          <FieldGroup label="Question" htmlFor={`vsc-faq-q-${index}`}>
            <input
              id={`vsc-faq-q-${index}`}
              value={faq.question}
              placeholder="What shows on the suggestion chip"
              onChange={(e) =>
                updateFaqs(faqs.map((item, i) => (i === index ? { ...item, question: e.target.value } : item)))
              }
            />
          </FieldGroup>
          <FieldGroup label="Answer" htmlFor={`vsc-faq-a-${index}`}>
            <textarea
              id={`vsc-faq-a-${index}`}
              rows={4}
              value={faq.answer}
              placeholder="Reply when a visitor asks this question"
              onChange={(e) =>
                updateFaqs(faqs.map((item, i) => (i === index ? { ...item, answer: e.target.value } : item)))
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add question"
        onClick={() => updateFaqs(appendListItem(faqs, LIST_ITEM_DEFAULTS.copilotFaq))}
      />
    </div>
  );
}

function DevMinimalHeroFields({ content, onChange, templateId }) {
  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Site name" htmlFor="siteName">
        <input id="siteName" value={content.siteName || ''} onChange={(e) => onChange({ siteName: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Name" htmlFor="name">
        <input id="name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="tagline">
        <input id="tagline" value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Introduction" htmlFor="bio">
        <textarea id="bio" rows={4} value={content.bio || ''} onChange={(e) => onChange({ bio: e.target.value })} />
      </FieldGroup>
      <SocialLinkFields content={content} onChange={onChange} />
    </div>
  );
}

function AboutFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <FieldGroup label="About text" htmlFor="about">
        <textarea id="about" rows={6} value={content.about || ''} onChange={(e) => onChange({ about: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function SawadSkillsFields({ content, onChange }) {
  const renderSkillRow = (key, label, htmlFor) => {
    const skills = content[key] || [];

    return (
      <FieldGroup label={label} htmlFor={htmlFor}>
        {skills.map((skill, index) => (
          <InlineListRow
            key={`${key}-${index}`}
            canRemove={skills.length > 0}
            onRemove={() => onChange({ [key]: removeListItemAt(skills, index, 0) })}
          >
            <input
              id={index === 0 ? htmlFor : undefined}
              value={skill}
              placeholder="e.g. React"
              onChange={(e) =>
                onChange({
                  [key]: skills.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton
          label="Add skill"
          onClick={() => onChange({ [key]: appendListItem(skills, LIST_ITEM_DEFAULTS.skill) })}
        />
      </FieldGroup>
    );
  };

  return (
    <div className="builder-fields">
      <p className="builder-icon-hint">Skill names auto-match dev icons (React, Docker, Python, etc.).</p>
      {renderSkillRow('skillsRow1', 'Skills row 1', 'skills-row-1')}
      {renderSkillRow('skillsRow2', 'Skills row 2', 'skills-row-2')}
    </div>
  );
}

function DevMinimalSkillsFields({ content, onChange }) {
  const updateGroup = (groupIndex, patch) =>
    onChange({
      skillGroups: content.skillGroups.map((item, i) =>
        i === groupIndex ? { ...item, ...patch } : item
      ),
    });

  return (
    <div className="builder-fields">
      <p className="builder-icon-hint">Skill names auto-match dev icons (React, Docker, Python, etc.).</p>
      {content.skillGroups?.map((group, index) => (
        <ItemBlock
          key={index}
          title={`Group ${index + 1}`}
          canRemove={(content.skillGroups?.length || 0) > 1}
          onRemove={() =>
            onChange({ skillGroups: removeListItemAt(content.skillGroups, index, 1) })
          }
        >
          <FieldGroup label="Category" htmlFor={`skill-group-name-${index}`}>
            <input
              id={`skill-group-name-${index}`}
              value={group.name}
              onChange={(e) => updateGroup(index, { name: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Skills" htmlFor={`skill-group-items-${index}`}>
            {(group.items || []).map((skill, skillIndex) => (
              <InlineListRow
                key={skillIndex}
                canRemove={(group.items?.length || 0) > 0}
                onRemove={() =>
                  updateGroup(index, { items: removeListItemAt(group.items, skillIndex, 0) })
                }
              >
                <input
                  id={skillIndex === 0 ? `skill-group-items-${index}` : undefined}
                  value={skill}
                  placeholder="e.g. Tailwind CSS"
                  onChange={(e) =>
                    updateGroup(index, {
                      items: group.items.map((item, i) =>
                        i === skillIndex ? e.target.value : item
                      ),
                    })
                  }
                />
              </InlineListRow>
            ))}
            <AddListItemButton
              label="Add skill"
              onClick={() =>
                updateGroup(index, { items: appendListItem(group.items, LIST_ITEM_DEFAULTS.skill) })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add skill category"
        onClick={() =>
          onChange({ skillGroups: appendListItem(content.skillGroups, LIST_ITEM_DEFAULTS.skillGroup) })
        }
      />
    </div>
  );
}

function ProjectsFields({ content, onChange, withTech = false }) {
  return (
    <div className="builder-fields">
      {withTech && (
        <p className="builder-icon-hint">Tech stack names auto-match dev icons (React, Node.js, Docker, etc.).</p>
      )}
      {content.projects?.map((project, index) => (
        <ItemBlock
          key={index}
          title={`Project ${index + 1}`}
          canRemove={(content.projects?.length || 0) > 0}
          onRemove={() =>
            onChange({ projects: removeListItemAt(content.projects, index, 0) })
          }
        >
          <FieldGroup label="Title" htmlFor={`project-title-${index}`}>
            <input
              id={`project-title-${index}`}
              value={project.title}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Subtitle" htmlFor={`project-sub-${index}`}>
            <input
              id={`project-sub-${index}`}
              value={project.subtitle}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, subtitle: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <ProjectImageField
            image={project.image}
            title={project.title}
            onChange={(image) =>
              onChange({
                projects: content.projects.map((item, i) => (i === index ? { ...item, image } : item)),
              })
            }
          />
          {withTech && (
            <FieldGroup label="Tech stack" htmlFor={`project-tech-${index}`}>
              <CommaListField
                id={`project-tech-${index}`}
                value={project.tech}
                placeholder="React, TypeScript, Node.js"
                onChange={(tech) =>
                  onChange({
                    projects: content.projects.map((item, i) =>
                      i === index ? { ...item, tech } : item
                    ),
                  })
                }
              />
            </FieldGroup>
          )}
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add project"
        onClick={() =>
          onChange({
            projects: appendListItem(
              content.projects,
              withTech ? LIST_ITEM_DEFAULTS.projectWithTech : LIST_ITEM_DEFAULTS.project
            ),
          })
        }
      />
    </div>
  );
}

function ExperienceFields({ content, onChange, useDescription = false }) {
  return (
    <div className="builder-fields">
      {content.experience?.map((job, index) => (
        <ItemBlock
          key={index}
          title={`Experience ${index + 1}`}
          canRemove={(content.experience?.length || 0) > 0}
          onRemove={() =>
            onChange({ experience: removeListItemAt(content.experience, index, 0) })
          }
        >
          <FieldGroup label="Company" htmlFor={`exp-company-${index}`}>
            <input
              id={`exp-company-${index}`}
              value={job.company}
              onChange={(e) =>
                onChange({
                  experience: content.experience.map((item, i) =>
                    i === index ? { ...item, company: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Role" htmlFor={`exp-role-${index}`}>
            {useDescription ? (
              <input
                id={`exp-role-${index}`}
                value={job.role}
                onChange={(e) =>
                  onChange({
                    experience: content.experience.map((item, i) =>
                      i === index ? { ...item, role: e.target.value } : item
                    ),
                  })
                }
              />
            ) : (
              <textarea
                id={`exp-role-${index}`}
                rows={3}
                value={job.role}
                onChange={(e) =>
                  onChange({
                    experience: content.experience.map((item, i) =>
                      i === index ? { ...item, role: e.target.value } : item
                    ),
                  })
                }
              />
            )}
          </FieldGroup>
          {useDescription && (
            <FieldGroup label="Description" htmlFor={`exp-desc-${index}`}>
              <textarea
                id={`exp-desc-${index}`}
                rows={3}
                value={job.description}
                onChange={(e) =>
                  onChange({
                    experience: content.experience.map((item, i) =>
                      i === index ? { ...item, description: e.target.value } : item
                    ),
                  })
                }
              />
            </FieldGroup>
          )}
          <FieldGroup label="Period" htmlFor={`exp-period-${index}`}>
            <input
              id={`exp-period-${index}`}
              value={job.period}
              onChange={(e) =>
                onChange({
                  experience: content.experience.map((item, i) =>
                    i === index ? { ...item, period: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add experience"
        onClick={() =>
          onChange({
            experience: appendListItem(
              content.experience,
              useDescription ? LIST_ITEM_DEFAULTS.experienceDetailed : LIST_ITEM_DEFAULTS.experience
            ),
          })
        }
      />
    </div>
  );
}

function EducationFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      {content.education?.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Education ${index + 1}`}
          canRemove={(content.education?.length || 0) > 0}
          onRemove={() =>
            onChange({ education: removeListItemAt(content.education, index, 0) })
          }
        >
          <FieldGroup label="School" htmlFor={`edu-school-${index}`}>
            <input
              id={`edu-school-${index}`}
              value={item.school}
              onChange={(e) =>
                onChange({
                  education: content.education.map((entry, i) =>
                    i === index ? { ...entry, school: e.target.value } : entry
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Degree" htmlFor={`edu-degree-${index}`}>
            <input
              id={`edu-degree-${index}`}
              value={item.degree}
              onChange={(e) =>
                onChange({
                  education: content.education.map((entry, i) =>
                    i === index ? { ...entry, degree: e.target.value } : entry
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`edu-desc-${index}`}>
            <textarea
              id={`edu-desc-${index}`}
              rows={3}
              value={item.description}
              onChange={(e) =>
                onChange({
                  education: content.education.map((entry, i) =>
                    i === index ? { ...entry, description: e.target.value } : entry
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Period" htmlFor={`edu-period-${index}`}>
            <input
              id={`edu-period-${index}`}
              value={item.period}
              onChange={(e) =>
                onChange({
                  education: content.education.map((entry, i) =>
                    i === index ? { ...entry, period: e.target.value } : entry
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add education"
        onClick={() =>
          onChange({ education: appendListItem(content.education, LIST_ITEM_DEFAULTS.education) })
        }
      />
    </div>
  );
}

function StatsFields({ content, onChange, withSub = false }) {
  return (
    <div className="builder-fields">
      {content.stats?.map((stat, index) => (
        <ItemBlock
          key={index}
          title={`Stat ${index + 1}`}
          canRemove={(content.stats?.length || 0) > 1}
          onRemove={() =>
            onChange({ stats: removeListItemAt(content.stats, index, 1) })
          }
        >
          <FieldGroup label="Value" htmlFor={`dm-stat-value-${index}`}>
            <input
              id={`dm-stat-value-${index}`}
              value={stat.value}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) =>
                    i === index ? { ...item, value: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`dm-stat-label-${index}`}>
            <input
              id={`dm-stat-label-${index}`}
              value={stat.label}
              onChange={(e) =>
                onChange({
                  stats: content.stats.map((item, i) =>
                    i === index ? { ...item, label: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          {withSub && (
            <FieldGroup label="Sub label" htmlFor={`dm-stat-sub-${index}`}>
              <input
                id={`dm-stat-sub-${index}`}
                value={stat.sub}
                onChange={(e) =>
                  onChange({
                    stats: content.stats.map((item, i) =>
                      i === index ? { ...item, sub: e.target.value } : item
                    ),
                  })
                }
              />
            </FieldGroup>
          )}
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add stat"
        onClick={() =>
          onChange({
            stats: appendListItem(
              content.stats,
              withSub ? LIST_ITEM_DEFAULTS.statWithSub : LIST_ITEM_DEFAULTS.stat
            ),
          })
        }
      />
    </div>
  );
}

function ToolsFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <p className="builder-icon-hint">Tool names auto-match dev icons (VS Code, Docker, Python, React, etc.).</p>
      {content.tools?.map((tool, index) => (
        <ItemBlock
          key={index}
          title={`Tool ${index + 1}`}
          canRemove={(content.tools?.length || 0) > 0}
          onRemove={() =>
            onChange({ tools: removeListItemAt(content.tools, index, 0) })
          }
        >
          <FieldGroup label="Name" htmlFor={`tool-name-${index}`}>
            <input
              id={`tool-name-${index}`}
              value={tool.name}
              onChange={(e) =>
                onChange({
                  tools: content.tools.map((item, i) =>
                    i === index ? { ...item, name: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <label className="builder-checkbox" htmlFor={`tool-show-desc-${index}`}>
            <input
              id={`tool-show-desc-${index}`}
              type="checkbox"
              checked={tool.showDesc !== false}
              onChange={(e) =>
                onChange({
                  tools: content.tools.map((item, i) =>
                    i === index ? { ...item, showDesc: e.target.checked } : item
                  ),
                })
              }
            />
            Show description
          </label>
          {tool.showDesc !== false && (
            <FieldGroup label="Description" htmlFor={`tool-desc-${index}`}>
              <input
                id={`tool-desc-${index}`}
                value={tool.desc}
                onChange={(e) =>
                  onChange({
                    tools: content.tools.map((item, i) =>
                      i === index ? { ...item, desc: e.target.value } : item
                    ),
                  })
                }
              />
            </FieldGroup>
          )}
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add tool"
        onClick={() => onChange({ tools: appendListItem(content.tools, LIST_ITEM_DEFAULTS.tool) })}
      />
    </div>
  );
}

function ThoughtsFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      {content.thoughts?.map((post, index) => (
        <ItemBlock
          key={index}
          title={`Article ${index + 1}`}
          canRemove={(content.thoughts?.length || 0) > 0}
          onRemove={() =>
            onChange({ thoughts: removeListItemAt(content.thoughts, index, 0) })
          }
        >
          <FieldGroup label="Title" htmlFor={`thought-title-${index}`}>
            <input
              id={`thought-title-${index}`}
              value={post.title}
              onChange={(e) =>
                onChange({
                  thoughts: content.thoughts.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Excerpt" htmlFor={`thought-excerpt-${index}`}>
            <textarea
              id={`thought-excerpt-${index}`}
              rows={3}
              value={post.excerpt}
              onChange={(e) =>
                onChange({
                  thoughts: content.thoughts.map((item, i) =>
                    i === index ? { ...item, excerpt: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Date" htmlFor={`thought-date-${index}`}>
            <input
              id={`thought-date-${index}`}
              value={post.date}
              onChange={(e) =>
                onChange({
                  thoughts: content.thoughts.map((item, i) =>
                    i === index ? { ...item, date: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Read time" htmlFor={`thought-read-${index}`}>
            <input
              id={`thought-read-${index}`}
              value={post.read}
              onChange={(e) =>
                onChange({
                  thoughts: content.thoughts.map((item, i) =>
                    i === index ? { ...item, read: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add article"
        onClick={() =>
          onChange({ thoughts: appendListItem(content.thoughts, LIST_ITEM_DEFAULTS.thought) })
        }
      />
    </div>
  );
}

function SawadContactFields({ content, onChange }) {
  const contact = content.contact || {};
  const updateContact = (patch) => onChange({ contact: { ...content.contact, ...patch } });

  return (
    <div className="builder-fields">
      <FieldGroup label="Title line 1" htmlFor="contact-title-1">
        <input id="contact-title-1" value={contact.titleLine1 || ''} onChange={(e) => updateContact({ titleLine1: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Title line 2" htmlFor="contact-title-2">
        <input id="contact-title-2" value={contact.titleLine2 || ''} onChange={(e) => updateContact({ titleLine2: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Subtitle" htmlFor="contact-subtitle">
        <textarea id="contact-subtitle" rows={3} value={contact.subtitle || ''} onChange={(e) => updateContact({ subtitle: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="contact-email">
        <input id="contact-email" type="email" value={contact.email || ''} onChange={(e) => updateContact({ email: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Response note" htmlFor="contact-note">
        <input id="contact-note" value={contact.responseNote || ''} onChange={(e) => updateContact({ responseNote: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Button text" htmlFor="contact-button">
        <input id="contact-button" value={contact.buttonText || ''} onChange={(e) => updateContact({ buttonText: e.target.value })} />
      </FieldGroup>
      <label className="builder-checkbox" htmlFor="contact-budget">
        <input
          id="contact-budget"
          type="checkbox"
          checked={contact.showBudget !== false}
          onChange={(e) => updateContact({ showBudget: e.target.checked })}
        />
        Show budget field
      </label>
      <FieldGroup label="Footer text" htmlFor="footer">
        <input id="footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function DevMinimalContactFields({ content, onChange }) {
  const contact = content.contact || {};
  const updateContact = (patch) => onChange({ contact: { ...content.contact, ...patch } });

  return (
    <div className="builder-fields">
      <FieldGroup label="Title" htmlFor="dm-contact-title">
        <input id="dm-contact-title" value={contact.title || ''} onChange={(e) => updateContact({ title: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Subtitle" htmlFor="dm-contact-subtitle">
        <textarea id="dm-contact-subtitle" rows={3} value={contact.subtitle || ''} onChange={(e) => updateContact({ subtitle: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="dm-contact-email">
        <input id="dm-contact-email" type="email" value={contact.email || ''} onChange={(e) => updateContact({ email: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Button text" htmlFor="dm-contact-button">
        <input id="dm-contact-button" value={contact.buttonText || ''} onChange={(e) => updateContact({ buttonText: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Footer text" htmlFor="footer">
        <input id="footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function CreativeModernSocialFields({ content, onChange }) {
  const links = content.links || {};
  const updateLink = (key, value) => onChange({ links: { ...links, [key]: value } });

  return (
    <ItemBlock title="Links">
      <ResumeField
        resume={links.resume || ''}
        onChange={(value) => updateLink('resume', value)}
        inputId="cmod-link-resume"
      />
      <FieldGroup label="LinkedIn URL" htmlFor="cmod-link-linkedin">
        <input id="cmod-link-linkedin" value={links.linkedin || ''} onChange={(e) => updateLink('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
      </FieldGroup>
      <FieldGroup label="GitHub URL" htmlFor="cmod-link-github">
        <input id="cmod-link-github" value={links.github || ''} onChange={(e) => updateLink('github', e.target.value)} placeholder="https://github.com/..." />
      </FieldGroup>
      <FieldGroup label="Stack Overflow URL" htmlFor="cmod-link-so">
        <input id="cmod-link-so" value={links.stackoverflow || ''} onChange={(e) => updateLink('stackoverflow', e.target.value)} placeholder="https://stackoverflow.com/users/..." />
      </FieldGroup>
      <FieldGroup label="Instagram URL" htmlFor="cmod-link-ig">
        <input id="cmod-link-ig" value={links.instagram || ''} onChange={(e) => updateLink('instagram', e.target.value)} placeholder="https://instagram.com/..." />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="cmod-link-email">
        <input id="cmod-link-email" value={links.email || ''} onChange={(e) => updateLink('email', e.target.value)} placeholder="hello@example.com" />
      </FieldGroup>
    </ItemBlock>
  );
}

function CreativeModernHeroFields({ content, onChange, templateId }) {
  const roles = content.roles || [];

  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Brand tag" htmlFor="cmod-brand">
        <input id="cmod-brand" value={content.brandTag || ''} onChange={(e) => onChange({ brandTag: e.target.value })} placeholder="<John/>" />
      </FieldGroup>
      <FieldGroup label="Greeting" htmlFor="cmod-greeting">
        <input id="cmod-greeting" value={content.greeting || ''} onChange={(e) => onChange({ greeting: e.target.value })} placeholder="Hi, I am" />
      </FieldGroup>
      <FieldGroup label="Name" htmlFor="cmod-name">
        <input id="cmod-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Typing roles" htmlFor="cmod-roles-0">
        {roles.map((role, index) => (
          <InlineListRow
            key={index}
            canRemove={roles.length > 0}
            onRemove={() => onChange({ roles: removeListItemAt(roles, index, 0) })}
          >
            <input
              id={index === 0 ? 'cmod-roles-0' : undefined}
              value={role}
              placeholder="e.g. Full-Stack Developer"
              onChange={(e) =>
                onChange({
                  roles: roles.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton label="Add role" onClick={() => onChange({ roles: appendListItem(roles, 'New Role') })} />
      </FieldGroup>
      <FieldGroup label="Headline" htmlFor="cmod-headline">
        <textarea id="cmod-headline" rows={3} value={content.headline || ''} onChange={(e) => onChange({ headline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Availability" htmlFor="cmod-availability">
        <input id="cmod-availability" value={content.availability || ''} onChange={(e) => onChange({ availability: e.target.value })} placeholder="Available for freelance & full-time" />
      </FieldGroup>
      <FieldGroup label="Location" htmlFor="cmod-location">
        <input id="cmod-location" value={content.location || ''} onChange={(e) => onChange({ location: e.target.value })} placeholder="Based in Your City" />
      </FieldGroup>
      <FieldGroup label="Hero CTA label" htmlFor="cmod-hero-cta">
        <input id="cmod-hero-cta" value={content.heroCtaLabel || ''} onChange={(e) => onChange({ heroCtaLabel: e.target.value })} placeholder="Explore my work" />
      </FieldGroup>
      <CreativeModernSocialFields content={content} onChange={onChange} />
      <FieldGroup label="Footer text" htmlFor="cmod-footer">
        <input id="cmod-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function CreativeModernAboutFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <FieldGroup label="About block title" htmlFor="cmod-about-title">
        <input id="cmod-about-title" value={content.aboutTitle || ''} onChange={(e) => onChange({ aboutTitle: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="About text" htmlFor="cmod-about">
        <textarea id="cmod-about" rows={5} value={content.about || ''} onChange={(e) => onChange({ about: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Tools block title" htmlFor="cmod-tools-title">
        <input id="cmod-tools-title" value={content.toolsTitle || ''} onChange={(e) => onChange({ toolsTitle: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Tools intro" htmlFor="cmod-tools-intro">
        <textarea id="cmod-tools-intro" rows={3} value={content.toolsIntro || ''} onChange={(e) => onChange({ toolsIntro: e.target.value })} />
      </FieldGroup>
      <DevMinimalSkillsFields content={content} onChange={onChange} />
    </div>
  );
}

function CreativeModernServicesFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      {(content.services || []).map((service, index) => (
        <ItemBlock
          key={index}
          title={`Service ${index + 1}`}
          canRemove={(content.services?.length || 0) > 1}
          onRemove={() => onChange({ services: removeListItemAt(content.services, index, 1) })}
        >
          <FieldGroup label="Icon (emoji)" htmlFor={`cmod-service-icon-${index}`}>
            <input
              id={`cmod-service-icon-${index}`}
              value={service.icon || ''}
              onChange={(e) =>
                onChange({
                  services: content.services.map((item, i) =>
                    i === index ? { ...item, icon: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Name" htmlFor={`cmod-service-name-${index}`}>
            <input
              id={`cmod-service-name-${index}`}
              value={service.name}
              onChange={(e) =>
                onChange({
                  services: content.services.map((item, i) =>
                    i === index ? { ...item, name: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`cmod-service-desc-${index}`}>
            <textarea
              id={`cmod-service-desc-${index}`}
              rows={4}
              value={service.desc}
              onChange={(e) =>
                onChange({
                  services: content.services.map((item, i) =>
                    i === index ? { ...item, desc: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add service"
        onClick={() => onChange({ services: appendListItem(content.services, LIST_ITEM_DEFAULTS.service) })}
      />
    </div>
  );
}

function CreativeModernContactFields({ content, onChange }) {
  const contact = content.contact || {};
  const updateContact = (patch) => onChange({ contact: { ...content.contact, ...patch } });

  return (
    <div className="builder-fields">
      <FieldGroup label="Title" htmlFor="cmod-contact-title">
        <input id="cmod-contact-title" value={contact.title || ''} onChange={(e) => updateContact({ title: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Subtitle" htmlFor="cmod-contact-subtitle">
        <textarea id="cmod-contact-subtitle" rows={3} value={contact.subtitle || ''} onChange={(e) => updateContact({ subtitle: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="cmod-contact-email">
        <input id="cmod-contact-email" type="email" value={contact.email || ''} onChange={(e) => updateContact({ email: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Address" htmlFor="cmod-contact-address">
        <input id="cmod-contact-address" value={contact.address || ''} onChange={(e) => updateContact({ address: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Country" htmlFor="cmod-contact-country">
        <input id="cmod-contact-country" value={contact.country || ''} onChange={(e) => updateContact({ country: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Submit button" htmlFor="cmod-contact-button">
        <input id="cmod-contact-button" value={contact.buttonText || ''} onChange={(e) => updateContact({ buttonText: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Direct email label" htmlFor="cmod-contact-direct">
        <input id="cmod-contact-direct" value={contact.directEmailLabel || ''} onChange={(e) => updateContact({ directEmailLabel: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function DeveloperClassicHeroFields({ content, onChange, templateId }) {
  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Name" htmlFor="dcls-name">
        <input id="dcls-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Role / title" htmlFor="dcls-tagline">
        <input
          id="dcls-tagline"
          value={content.tagline || ''}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="Full Stack Engineer"
        />
      </FieldGroup>
      <FieldGroup label="Bio" htmlFor="dcls-hero-bio">
        <textarea
          id="dcls-hero-bio"
          rows={3}
          value={content.heroBio || ''}
          onChange={(e) => onChange({ heroBio: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Availability" htmlFor="dcls-availability">
        <input
          id="dcls-availability"
          value={content.availability || ''}
          onChange={(e) => onChange({ availability: e.target.value })}
          placeholder="Open to freelance & full-time"
        />
      </FieldGroup>
      <SocialLinkFields content={content} onChange={onChange} />
      <FieldGroup label="Footer text" htmlFor="dcls-footer">
        <input id="dcls-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function DeveloperClassicExpertiseFields({ content, onChange }) {
  const updateGroup = (groupIndex, patch) =>
    onChange({
      expertiseGroups: content.expertiseGroups.map((item, i) =>
        i === groupIndex ? { ...item, ...patch } : item
      ),
    });

  return (
    <div className="builder-fields">
      <p className="builder-icon-hint">Icon names auto-match dev icons (React, Docker, Python, etc.).</p>
      {content.expertiseGroups?.map((group, index) => (
        <ItemBlock
          key={index}
          title={`Expertise ${index + 1}`}
          canRemove={(content.expertiseGroups?.length || 0) > 1}
          onRemove={() =>
            onChange({ expertiseGroups: removeListItemAt(content.expertiseGroups, index, 1) })
          }
        >
          <FieldGroup label="Title" htmlFor={`dcls-exp-title-${index}`}>
            <input
              id={`dcls-exp-title-${index}`}
              value={group.title}
              onChange={(e) => updateGroup(index, { title: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`dcls-exp-desc-${index}`}>
            <textarea
              id={`dcls-exp-desc-${index}`}
              rows={4}
              value={group.description}
              onChange={(e) => updateGroup(index, { description: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Icon" htmlFor={`dcls-exp-icon-${index}`}>
            <input
              id={`dcls-exp-icon-${index}`}
              value={group.icon || ''}
              onChange={(e) => updateGroup(index, { icon: e.target.value })}
              placeholder="React"
            />
          </FieldGroup>
          <FieldGroup label="Tech stack" htmlFor={`dcls-exp-tech-${index}`}>
            <CommaListField
              id={`dcls-exp-tech-${index}`}
              value={group.tech}
              placeholder="React, Node.js, PostgreSQL"
              onChange={(tech) => updateGroup(index, { tech })}
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add expertise block"
        onClick={() =>
          onChange({
            expertiseGroups: appendListItem(content.expertiseGroups, LIST_ITEM_DEFAULTS.expertiseGroup),
          })
        }
      />
    </div>
  );
}

function DeveloperClassicExperienceFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      {content.experience?.map((job, index) => (
        <ItemBlock
          key={index}
          title={`Role ${index + 1}`}
          canRemove={(content.experience?.length || 0) > 0}
          onRemove={() =>
            onChange({ experience: removeListItemAt(content.experience, index, 0) })
          }
        >
          <FieldGroup label="Role" htmlFor={`dcls-role-${index}`}>
            <input
              id={`dcls-role-${index}`}
              value={job.role}
              onChange={(e) =>
                onChange({
                  experience: content.experience.map((item, i) =>
                    i === index ? { ...item, role: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Location" htmlFor={`dcls-location-${index}`}>
            <input
              id={`dcls-location-${index}`}
              value={job.location || ''}
              onChange={(e) =>
                onChange({
                  experience: content.experience.map((item, i) =>
                    i === index ? { ...item, location: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Period" htmlFor={`dcls-period-${index}`}>
            <input
              id={`dcls-period-${index}`}
              value={job.period}
              onChange={(e) =>
                onChange({
                  experience: content.experience.map((item, i) =>
                    i === index ? { ...item, period: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`dcls-job-desc-${index}`}>
            <textarea
              id={`dcls-job-desc-${index}`}
              rows={3}
              value={job.description || ''}
              onChange={(e) =>
                onChange({
                  experience: content.experience.map((item, i) =>
                    i === index ? { ...item, description: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add role"
        onClick={() =>
          onChange({
            experience: appendListItem(content.experience, LIST_ITEM_DEFAULTS.experienceClassic),
          })
        }
      />
    </div>
  );
}

function DeveloperClassicProjectsFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      {content.projects?.map((project, index) => (
        <ItemBlock
          key={index}
          title={`Project ${index + 1}`}
          canRemove={(content.projects?.length || 0) > 0}
          onRemove={() =>
            onChange({ projects: removeListItemAt(content.projects, index, 0) })
          }
        >
          <FieldGroup label="Title" htmlFor={`dcls-project-title-${index}`}>
            <input
              id={`dcls-project-title-${index}`}
              value={project.title}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`dcls-project-sub-${index}`}>
            <textarea
              id={`dcls-project-sub-${index}`}
              rows={3}
              value={project.subtitle}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, subtitle: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Link" htmlFor={`dcls-project-link-${index}`}>
            <input
              id={`dcls-project-link-${index}`}
              value={project.link || ''}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, link: e.target.value } : item
                  ),
                })
              }
              placeholder="https://"
            />
          </FieldGroup>
          <ProjectImageField
            image={project.image}
            title={project.title}
            onChange={(image) =>
              onChange({
                projects: content.projects.map((item, i) => (i === index ? { ...item, image } : item)),
              })
            }
          />
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add project"
        onClick={() =>
          onChange({
            projects: appendListItem(content.projects, LIST_ITEM_DEFAULTS.projectWithTech),
          })
        }
      />
    </div>
  );
}

function DeveloperClassicContactFields({ content, onChange }) {
  const contact = content.contact || {};
  const updateContact = (patch) => onChange({ contact: { ...content.contact, ...patch } });

  return (
    <div className="builder-fields">
      <FieldGroup label="Title" htmlFor="dcls-contact-title">
        <input
          id="dcls-contact-title"
          value={contact.title || ''}
          onChange={(e) => updateContact({ title: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Subtitle" htmlFor="dcls-contact-sub">
        <textarea
          id="dcls-contact-sub"
          rows={3}
          value={contact.subtitle || ''}
          onChange={(e) => updateContact({ subtitle: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Email" htmlFor="dcls-contact-email">
        <input
          id="dcls-contact-email"
          value={contact.email || ''}
          onChange={(e) => updateContact({ email: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Button text" htmlFor="dcls-contact-btn">
        <input
          id="dcls-contact-btn"
          value={contact.buttonText || ''}
          onChange={(e) => updateContact({ buttonText: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}

function AuroraFluxHeroFields({ content, onChange, templateId }) {
  const roles = content.typingRoles || [];
  const links = content.links || {};
  const updateLink = (key, value) => onChange({ links: { ...links, [key]: value } });

  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Brand tag" htmlFor="aflux-brand">
        <input id="aflux-brand" value={content.brandTag || ''} onChange={(e) => onChange({ brandTag: e.target.value })} placeholder="flux.dev" />
      </FieldGroup>
      <FieldGroup label="Greeting" htmlFor="aflux-greeting">
        <input id="aflux-greeting" value={content.greeting || ''} onChange={(e) => onChange({ greeting: e.target.value })} placeholder="Crafting" />
      </FieldGroup>
      <FieldGroup label="Name" htmlFor="aflux-name">
        <input id="aflux-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Accent phrase" htmlFor="aflux-accent-phrase">
        <input id="aflux-accent-phrase" value={content.headlineAccent || ''} onChange={(e) => onChange({ headlineAccent: e.target.value })} placeholder="digital auroras" />
      </FieldGroup>
      <FieldGroup label="Typing roles" htmlFor="aflux-roles-0">
        {roles.map((role, index) => (
          <InlineListRow
            key={index}
            canRemove={roles.length > 0}
            onRemove={() => onChange({ typingRoles: removeListItemAt(roles, index, 0) })}
          >
            <input
              id={index === 0 ? 'aflux-roles-0' : undefined}
              value={role}
              placeholder="e.g. Creative Developer"
              onChange={(e) =>
                onChange({
                  typingRoles: roles.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton label="Add role" onClick={() => onChange({ typingRoles: appendListItem(roles, 'New Role') })} />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="aflux-tagline">
        <textarea id="aflux-tagline" rows={3} value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Availability" htmlFor="aflux-availability">
        <input id="aflux-availability" value={content.availability || ''} onChange={(e) => onChange({ availability: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Location" htmlFor="aflux-location">
        <input id="aflux-location" value={content.location || ''} onChange={(e) => onChange({ location: e.target.value })} />
      </FieldGroup>
      <ItemBlock title="Links">
        <ResumeField resume={links.resume || ''} onChange={(value) => updateLink('resume', value)} inputId="aflux-link-resume" />
        <FieldGroup label="GitHub URL" htmlFor="aflux-link-github">
          <input id="aflux-link-github" value={links.github || ''} onChange={(e) => updateLink('github', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="LinkedIn URL" htmlFor="aflux-link-linkedin">
          <input id="aflux-link-linkedin" value={links.linkedin || ''} onChange={(e) => updateLink('linkedin', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Twitter / X URL" htmlFor="aflux-link-twitter">
          <input id="aflux-link-twitter" value={links.twitter || ''} onChange={(e) => updateLink('twitter', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Email" htmlFor="aflux-link-email">
          <input id="aflux-link-email" value={links.email || ''} onChange={(e) => updateLink('email', e.target.value)} />
        </FieldGroup>
      </ItemBlock>
      <FieldGroup label="Footer text" htmlFor="aflux-footer">
        <input id="aflux-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function AuroraFluxAboutFields({ content, onChange }) {
  const highlights = content.highlights || [];

  return (
    <div className="builder-fields">
      <FieldGroup label="About text" htmlFor="aflux-about">
        <textarea id="aflux-about" rows={5} value={content.about || ''} onChange={(e) => onChange({ about: e.target.value })} />
      </FieldGroup>
      {highlights.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Highlight ${index + 1}`}
          canRemove={highlights.length > 0}
          onRemove={() => onChange({ highlights: removeListItemAt(highlights, index, 0) })}
        >
          <FieldGroup label="Value" htmlFor={`aflux-hl-val-${index}`}>
            <input
              id={`aflux-hl-val-${index}`}
              value={item.value || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, value: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`aflux-hl-lbl-${index}`}>
            <input
              id={`aflux-hl-lbl-${index}`}
              value={item.label || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, label: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add highlight"
        onClick={() => onChange({ highlights: appendListItem(highlights, { value: '0', label: 'Label' }) })}
      />
    </div>
  );
}

function AuroraFluxProjectsFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <p className="builder-icon-hint">Tech stack names auto-match dev icons. Mark one project as featured for a larger bento card.</p>
      {content.projects?.map((project, index) => (
        <ItemBlock
          key={index}
          title={`Project ${index + 1}`}
          canRemove={(content.projects?.length || 0) > 0}
          onRemove={() => onChange({ projects: removeListItemAt(content.projects, index, 0) })}
        >
          <FieldGroup label="Title" htmlFor={`aflux-project-title-${index}`}>
            <input
              id={`aflux-project-title-${index}`}
              value={project.title}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`aflux-project-sub-${index}`}>
            <textarea
              id={`aflux-project-sub-${index}`}
              rows={3}
              value={project.subtitle}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, subtitle: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Project URL" htmlFor={`aflux-project-link-${index}`}>
            <input
              id={`aflux-project-link-${index}`}
              value={project.link || ''}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, link: e.target.value } : item
                  ),
                })
              }
              placeholder="https://..."
            />
          </FieldGroup>
          <FieldGroup label="Featured (large card)" htmlFor={`aflux-project-featured-${index}`}>
            <label className="builder-checkbox">
              <input
                id={`aflux-project-featured-${index}`}
                type="checkbox"
                checked={!!project.featured}
                onChange={(e) =>
                  onChange({
                    projects: content.projects.map((item, i) =>
                      i === index ? { ...item, featured: e.target.checked } : item
                    ),
                  })
                }
              />
              <span>Show as featured bento card</span>
            </label>
          </FieldGroup>
          <FieldGroup label="Tech stack" htmlFor={`aflux-project-tech-${index}`}>
            <CommaListField
              id={`aflux-project-tech-${index}`}
              value={project.tech}
              placeholder="React, TypeScript, Node.js"
              onChange={(tech) =>
                onChange({
                  projects: content.projects.map((item, i) => (i === index ? { ...item, tech } : item)),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add project"
        onClick={() =>
          onChange({
            projects: appendListItem(content.projects, LIST_ITEM_DEFAULTS.projectWithTech),
          })
        }
      />
    </div>
  );
}

function LumenBloomHeroFields({ content, onChange, templateId }) {
  const roles = content.flipRoles || [];
  const links = content.links || {};
  const updateLink = (key, value) => onChange({ links: { ...links, [key]: value } });

  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Brand tag" htmlFor="lbloom-brand">
        <input id="lbloom-brand" value={content.brandTag || ''} onChange={(e) => onChange({ brandTag: e.target.value })} placeholder="studio" />
      </FieldGroup>
      <FieldGroup label="Greeting" htmlFor="lbloom-greeting">
        <input id="lbloom-greeting" value={content.greeting || ''} onChange={(e) => onChange({ greeting: e.target.value })} placeholder="Hello, I craft" />
      </FieldGroup>
      <FieldGroup label="Name" htmlFor="lbloom-name">
        <input id="lbloom-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Accent phrase" htmlFor="lbloom-accent-phrase">
        <input id="lbloom-accent-phrase" value={content.headlineAccent || ''} onChange={(e) => onChange({ headlineAccent: e.target.value })} placeholder="thoughtful experiences" />
      </FieldGroup>
      <FieldGroup label="Rotating roles" htmlFor="lbloom-roles-0">
        {roles.map((role, index) => (
          <InlineListRow
            key={index}
            canRemove={roles.length > 0}
            onRemove={() => onChange({ flipRoles: removeListItemAt(roles, index, 0) })}
          >
            <input
              id={index === 0 ? 'lbloom-roles-0' : undefined}
              value={role}
              placeholder="e.g. Product Designer"
              onChange={(e) =>
                onChange({
                  flipRoles: roles.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton label="Add role" onClick={() => onChange({ flipRoles: appendListItem(roles, 'New Role') })} />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="lbloom-tagline">
        <textarea id="lbloom-tagline" rows={3} value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Primary button label" htmlFor="lbloom-hero-btn-primary-label">
        <input
          id="lbloom-hero-btn-primary-label"
          value={content.heroPrimaryButtonLabel || ''}
          onChange={(e) => onChange({ heroPrimaryButtonLabel: e.target.value })}
          placeholder="See selected work"
        />
      </FieldGroup>
      <FieldGroup label="Primary button link" htmlFor="lbloom-hero-btn-primary-href">
        <input
          id="lbloom-hero-btn-primary-href"
          value={content.heroPrimaryButtonHref || ''}
          onChange={(e) => onChange({ heroPrimaryButtonHref: e.target.value })}
          placeholder="#projects or https://..."
        />
      </FieldGroup>
      <FieldGroup label="Secondary button label" htmlFor="lbloom-hero-btn-secondary-label">
        <input
          id="lbloom-hero-btn-secondary-label"
          value={content.heroSecondaryButtonLabel || ''}
          onChange={(e) => onChange({ heroSecondaryButtonLabel: e.target.value })}
          placeholder="Start a conversation"
        />
      </FieldGroup>
      <FieldGroup label="Secondary button link" htmlFor="lbloom-hero-btn-secondary-href">
        <input
          id="lbloom-hero-btn-secondary-href"
          value={content.heroSecondaryButtonHref || ''}
          onChange={(e) => onChange({ heroSecondaryButtonHref: e.target.value })}
          placeholder="#contact or mailto:..."
        />
      </FieldGroup>
      <FieldGroup label="Availability" htmlFor="lbloom-availability">
        <input id="lbloom-availability" value={content.availability || ''} onChange={(e) => onChange({ availability: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Location" htmlFor="lbloom-location">
        <input id="lbloom-location" value={content.location || ''} onChange={(e) => onChange({ location: e.target.value })} />
      </FieldGroup>
      <ItemBlock title="Links">
        <ResumeField resume={links.resume || ''} onChange={(value) => updateLink('resume', value)} inputId="lbloom-link-resume" />
        <FieldGroup label="GitHub URL" htmlFor="lbloom-link-github">
          <input id="lbloom-link-github" value={links.github || ''} onChange={(e) => updateLink('github', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="LinkedIn URL" htmlFor="lbloom-link-linkedin">
          <input id="lbloom-link-linkedin" value={links.linkedin || ''} onChange={(e) => updateLink('linkedin', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Instagram URL" htmlFor="lbloom-link-instagram">
          <input id="lbloom-link-instagram" value={links.instagram || ''} onChange={(e) => updateLink('instagram', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Email" htmlFor="lbloom-link-email">
          <input id="lbloom-link-email" value={links.email || ''} onChange={(e) => updateLink('email', e.target.value)} />
        </FieldGroup>
      </ItemBlock>
      <FieldGroup label="Footer text" htmlFor="lbloom-footer">
        <input id="lbloom-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function LumenBloomAboutFields({ content, onChange }) {
  const highlights = content.highlights || [];

  return (
    <div className="builder-fields">
      <FieldGroup label="Pull quote" htmlFor="lbloom-pullquote">
        <textarea id="lbloom-pullquote" rows={3} value={content.pullQuote || ''} onChange={(e) => onChange({ pullQuote: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="About text" htmlFor="lbloom-about">
        <textarea id="lbloom-about" rows={5} value={content.about || ''} onChange={(e) => onChange({ about: e.target.value })} />
      </FieldGroup>
      {highlights.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Highlight ${index + 1}`}
          canRemove={highlights.length > 0}
          onRemove={() => onChange({ highlights: removeListItemAt(highlights, index, 0) })}
        >
          <FieldGroup label="Value" htmlFor={`lbloom-hl-val-${index}`}>
            <input
              id={`lbloom-hl-val-${index}`}
              value={item.value || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, value: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`lbloom-hl-lbl-${index}`}>
            <input
              id={`lbloom-hl-lbl-${index}`}
              value={item.label || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, label: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add highlight"
        onClick={() => onChange({ highlights: appendListItem(highlights, { value: '0', label: 'Label' }) })}
      />
    </div>
  );
}

function MidnightGoldHeroFields({ content, onChange, templateId }) {
  const links = content.links || {};
  const updateLink = (key, value) => onChange({ links: { ...links, [key]: value } });

  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Brand tag" htmlFor="mgold-brand">
        <input id="mgold-brand" value={content.brandTag || ''} onChange={(e) => onChange({ brandTag: e.target.value })} placeholder="ATELIER" />
      </FieldGroup>
      <FieldGroup label="Greeting" htmlFor="mgold-greeting">
        <input id="mgold-greeting" value={content.greeting || ''} onChange={(e) => onChange({ greeting: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Name" htmlFor="mgold-name">
        <input id="mgold-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Accent phrase" htmlFor="mgold-accent-phrase">
        <input id="mgold-accent-phrase" value={content.headlineAccent || ''} onChange={(e) => onChange({ headlineAccent: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Rotating roles" htmlFor="mgold-roles-0">
        {(content.flipRoles || []).map((role, index) => (
          <InlineListRow
            key={index}
            canRemove={(content.flipRoles || []).length > 0}
            onRemove={() =>
              onChange({ flipRoles: removeListItemAt(content.flipRoles || [], index, 0) })
            }
          >
            <input
              id={index === 0 ? 'mgold-roles-0' : undefined}
              value={role}
              placeholder="e.g. Senior Product Engineer"
              onChange={(e) =>
                onChange({
                  flipRoles: (content.flipRoles || []).map((item, i) =>
                    i === index ? e.target.value : item
                  ),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton
          label="Add role"
          onClick={() =>
            onChange({ flipRoles: appendListItem(content.flipRoles || [], 'New Role') })
          }
        />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="mgold-tagline">
        <textarea id="mgold-tagline" rows={3} value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Availability" htmlFor="mgold-availability">
        <input id="mgold-availability" value={content.availability || ''} onChange={(e) => onChange({ availability: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Location" htmlFor="mgold-location">
        <input id="mgold-location" value={content.location || ''} onChange={(e) => onChange({ location: e.target.value })} />
      </FieldGroup>
      <ItemBlock title="Links">
        <ResumeField resume={links.resume || ''} onChange={(value) => updateLink('resume', value)} inputId="mgold-link-resume" />
        <FieldGroup label="GitHub URL" htmlFor="mgold-link-github">
          <input id="mgold-link-github" value={links.github || ''} onChange={(e) => updateLink('github', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="LinkedIn URL" htmlFor="mgold-link-linkedin">
          <input id="mgold-link-linkedin" value={links.linkedin || ''} onChange={(e) => updateLink('linkedin', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Email" htmlFor="mgold-link-email">
          <input id="mgold-link-email" value={links.email || ''} onChange={(e) => updateLink('email', e.target.value)} />
        </FieldGroup>
      </ItemBlock>
      <FieldGroup label="Footer text" htmlFor="mgold-footer">
        <input id="mgold-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function MidnightGoldAboutFields({ content, onChange }) {
  const highlights = content.highlights || [];

  return (
    <div className="builder-fields">
      <FieldGroup label="About text" htmlFor="mgold-about">
        <textarea id="mgold-about" rows={5} value={content.about || ''} onChange={(e) => onChange({ about: e.target.value })} />
      </FieldGroup>
      {highlights.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Highlight ${index + 1}`}
          canRemove={highlights.length > 0}
          onRemove={() => onChange({ highlights: removeListItemAt(highlights, index, 0) })}
        >
          <FieldGroup label="Value" htmlFor={`mgold-hl-val-${index}`}>
            <input
              id={`mgold-hl-val-${index}`}
              value={item.value || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, value: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`mgold-hl-lbl-${index}`}>
            <input
              id={`mgold-hl-lbl-${index}`}
              value={item.label || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, label: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add highlight"
        onClick={() => onChange({ highlights: appendListItem(highlights, { value: '0', label: 'Label' }) })}
      />
    </div>
  );
}

function PrismDriftHeroFields({ content, onChange, templateId }) {
  const tags = content.roleTags || [];
  const links = content.links || {};
  const updateLink = (key, value) => onChange({ links: { ...links, [key]: value } });

  return (
    <div className="builder-fields">
      {templateHasFeature(templateId, 'profilePhoto') && (
        <ProfilePhotoField content={content} onChange={onChange} />
      )}
      <FieldGroup label="Brand tag" htmlFor="pdrift-brand">
        <input id="pdrift-brand" value={content.brandTag || ''} onChange={(e) => onChange({ brandTag: e.target.value })} placeholder="PRISM" />
      </FieldGroup>
      <FieldGroup label="Greeting" htmlFor="pdrift-greeting">
        <input id="pdrift-greeting" value={content.greeting || ''} onChange={(e) => onChange({ greeting: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Name" htmlFor="pdrift-name">
        <input id="pdrift-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Accent phrase" htmlFor="pdrift-accent-phrase">
        <input id="pdrift-accent-phrase" value={content.headlineAccent || ''} onChange={(e) => onChange({ headlineAccent: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Role tags" htmlFor="pdrift-tags-0">
        {tags.map((tag, index) => (
          <InlineListRow
            key={index}
            canRemove={tags.length > 0}
            onRemove={() => onChange({ roleTags: removeListItemAt(tags, index, 0) })}
          >
            <input
              id={index === 0 ? 'pdrift-tags-0' : undefined}
              value={tag}
              placeholder="e.g. UI Engineer"
              onChange={(e) =>
                onChange({
                  roleTags: tags.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton label="Add tag" onClick={() => onChange({ roleTags: appendListItem(tags, 'New Tag') })} />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="pdrift-tagline">
        <textarea id="pdrift-tagline" rows={3} value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Availability" htmlFor="pdrift-availability">
        <input id="pdrift-availability" value={content.availability || ''} onChange={(e) => onChange({ availability: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Location" htmlFor="pdrift-location">
        <input id="pdrift-location" value={content.location || ''} onChange={(e) => onChange({ location: e.target.value })} />
      </FieldGroup>
      <ItemBlock title="Links">
        <ResumeField resume={links.resume || ''} onChange={(value) => updateLink('resume', value)} inputId="pdrift-link-resume" />
        <FieldGroup label="GitHub URL" htmlFor="pdrift-link-github">
          <input id="pdrift-link-github" value={links.github || ''} onChange={(e) => updateLink('github', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="LinkedIn URL" htmlFor="pdrift-link-linkedin">
          <input id="pdrift-link-linkedin" value={links.linkedin || ''} onChange={(e) => updateLink('linkedin', e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Email" htmlFor="pdrift-link-email">
          <input id="pdrift-link-email" value={links.email || ''} onChange={(e) => updateLink('email', e.target.value)} />
        </FieldGroup>
      </ItemBlock>
      <FieldGroup label="Footer text" htmlFor="pdrift-footer">
        <input id="pdrift-footer" value={content.footer || ''} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

function PrismDriftAboutFields({ content, onChange }) {
  const highlights = content.highlights || [];

  return (
    <div className="builder-fields">
      <FieldGroup label="Pull quote" htmlFor="pdrift-pullquote">
        <textarea id="pdrift-pullquote" rows={3} value={content.pullQuote || ''} onChange={(e) => onChange({ pullQuote: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="About text" htmlFor="pdrift-about">
        <textarea id="pdrift-about" rows={5} value={content.about || ''} onChange={(e) => onChange({ about: e.target.value })} />
      </FieldGroup>
      {highlights.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Highlight ${index + 1}`}
          canRemove={highlights.length > 0}
          onRemove={() => onChange({ highlights: removeListItemAt(highlights, index, 0) })}
        >
          <FieldGroup label="Value" htmlFor={`pdrift-hl-val-${index}`}>
            <input
              id={`pdrift-hl-val-${index}`}
              value={item.value || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, value: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Label" htmlFor={`pdrift-hl-lbl-${index}`}>
            <input
              id={`pdrift-hl-lbl-${index}`}
              value={item.label || ''}
              onChange={(e) =>
                onChange({
                  highlights: highlights.map((h, i) => (i === index ? { ...h, label: e.target.value } : h)),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add highlight"
        onClick={() => onChange({ highlights: appendListItem(highlights, { value: '0', label: 'Label' }) })}
      />
    </div>
  );
}

function SoumyaClassicHeroFields({ content, onChange }) {
  const roles = content.typingRoles || [];
  const updateHomeIntro = (patch) =>
    onChange({ homeIntro: { ...content.homeIntro, ...patch } });
  const updateSocial = (patch) =>
    onChange({ socialSection: { ...content.socialSection, ...patch } });
  const updateFooter = (patch) =>
    onChange({ footer: { ...content.footer, ...patch } });

  return (
    <div className="builder-fields">
      <ItemBlock title="Header navigation">
        <FieldGroup label="Blog URL" htmlFor="smcls-blog">
          <input
            id="smcls-blog"
            value={content.links?.blog || ''}
            onChange={(e) => onChange({ links: { ...content.links, blog: e.target.value } })}
            placeholder="https://yourblog.com"
          />
        </FieldGroup>
        <FieldGroup label="Blog nav label" htmlFor="smcls-blog-label">
          <input
            id="smcls-blog-label"
            value={content.navBlogLabel || ''}
            onChange={(e) => onChange({ navBlogLabel: e.target.value })}
            placeholder="Blogs"
          />
        </FieldGroup>
        <FieldGroup label="Fork / star button URL" htmlFor="smcls-fork">
          <input
            id="smcls-fork"
            value={content.links?.fork || ''}
            onChange={(e) => onChange({ links: { ...content.links, fork: e.target.value } })}
            placeholder="https://github.com/yourname/portfolio"
          />
        </FieldGroup>
        <p className="builder-icon-hint">Leave Blog URL empty to hide the Blogs nav item. Leave fork URL empty to hide the star button.</p>
      </ItemBlock>
      <FieldGroup label="Name" htmlFor="smcls-name">
        <input id="smcls-name" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Header initials" htmlFor="smcls-initials">
        <input
          id="smcls-initials"
          value={content.initials || ''}
          onChange={(e) => onChange({ initials: e.target.value })}
          placeholder="AM"
        />
      </FieldGroup>
      <FieldGroup label="Greeting" htmlFor="smcls-greeting">
        <input id="smcls-greeting" value={content.greeting || ''} onChange={(e) => onChange({ greeting: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Wave emoji" htmlFor="smcls-wave">
        <input id="smcls-wave" value={content.wave || ''} onChange={(e) => onChange({ wave: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Typing roles" htmlFor="smcls-roles-0">
        {roles.map((role, index) => (
          <InlineListRow
            key={index}
            canRemove={roles.length > 0}
            onRemove={() => onChange({ typingRoles: removeListItemAt(roles, index, 0) })}
          >
            <input
              id={index === 0 ? 'smcls-roles-0' : undefined}
              value={role}
              onChange={(e) =>
                onChange({
                  typingRoles: roles.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton label="Add role" onClick={() => onChange({ typingRoles: appendListItem(roles, 'New Role') })} />
      </FieldGroup>
      <ItemBlock title="Home intro">
        <FieldGroup label="Title lead" htmlFor="smcls-intro-lead">
          <input
            id="smcls-intro-lead"
            value={content.homeIntro?.titleLead || ''}
            onChange={(e) => updateHomeIntro({ titleLead: e.target.value })}
          />
        </FieldGroup>
        <FieldGroup label="Title highlight" htmlFor="smcls-intro-highlight">
          <input
            id="smcls-intro-highlight"
            value={content.homeIntro?.titleHighlight || ''}
            onChange={(e) => updateHomeIntro({ titleHighlight: e.target.value })}
          />
        </FieldGroup>
        <FieldGroup label="Title tail" htmlFor="smcls-intro-tail">
          <input
            id="smcls-intro-tail"
            value={content.homeIntro?.titleTail || ''}
            onChange={(e) => updateHomeIntro({ titleTail: e.target.value })}
          />
        </FieldGroup>
        <FieldGroup label="Body" htmlFor="smcls-intro-body">
          <textarea
            id="smcls-intro-body"
            rows={6}
            value={content.homeIntro?.body || ''}
            onChange={(e) => updateHomeIntro({ body: e.target.value })}
          />
        </FieldGroup>
      </ItemBlock>
      <ItemBlock title="Social section">
        <FieldGroup label="Title" htmlFor="smcls-social-title">
          <input
            id="smcls-social-title"
            value={content.socialSection?.title || ''}
            onChange={(e) => updateSocial({ title: e.target.value })}
          />
        </FieldGroup>
        <FieldGroup label="Subtitle" htmlFor="smcls-social-sub">
          <input
            id="smcls-social-sub"
            value={content.socialSection?.subtitle || ''}
            onChange={(e) => updateSocial({ subtitle: e.target.value })}
          />
        </FieldGroup>
      </ItemBlock>
      <SocialLinkFields content={content} onChange={onChange} />
      <FieldGroup label="Twitter URL" htmlFor="smcls-twitter">
        <input
          id="smcls-twitter"
          value={content.links?.twitter || ''}
          onChange={(e) => onChange({ links: { ...content.links, twitter: e.target.value } })}
        />
      </FieldGroup>
      <FieldGroup label="Instagram URL" htmlFor="smcls-instagram">
        <input
          id="smcls-instagram"
          value={content.links?.instagram || ''}
          onChange={(e) => onChange({ links: { ...content.links, instagram: e.target.value } })}
        />
      </FieldGroup>
      <ItemBlock title="Footer">
        <FieldGroup label="Credit" htmlFor="smcls-footer-credit">
          <input
            id="smcls-footer-credit"
            value={content.footer?.credit || ''}
            onChange={(e) => updateFooter({ credit: e.target.value })}
          />
        </FieldGroup>
        <FieldGroup label="Copyright short" htmlFor="smcls-footer-copy">
          <input
            id="smcls-footer-copy"
            value={content.footer?.copyrightShort || ''}
            onChange={(e) => updateFooter({ copyrightShort: e.target.value })}
          />
        </FieldGroup>
      </ItemBlock>
    </div>
  );
}

function SoumyaClassicAboutFields({ content, onChange }) {
  const about = content.about || {};
  const activities = about.activities || [];
  const updateAbout = (patch) => onChange({ about: { ...about, ...patch } });

  return (
    <div className="builder-fields">
      <FieldGroup label="Heading lead" htmlFor="smcls-about-lead">
        <input
          id="smcls-about-lead"
          value={about.headingLead || ''}
          onChange={(e) => updateAbout({ headingLead: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Heading highlight" htmlFor="smcls-about-highlight">
        <input
          id="smcls-about-highlight"
          value={about.headingHighlight || ''}
          onChange={(e) => updateAbout({ headingHighlight: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="About card" htmlFor="smcls-about-card">
        <textarea
          id="smcls-about-card"
          rows={5}
          value={about.cardIntro || ''}
          onChange={(e) => updateAbout({ cardIntro: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Activities" htmlFor="smcls-activity-0">
        {activities.map((activity, index) => (
          <InlineListRow
            key={index}
            canRemove={activities.length > 0}
            onRemove={() => updateAbout({ activities: removeListItemAt(activities, index, 0) })}
          >
            <input
              id={index === 0 ? 'smcls-activity-0' : undefined}
              value={activity}
              onChange={(e) =>
                updateAbout({
                  activities: activities.map((item, i) => (i === index ? e.target.value : item)),
                })
              }
            />
          </InlineListRow>
        ))}
        <AddListItemButton
          label="Add activity"
          onClick={() => updateAbout({ activities: appendListItem(activities, 'New activity') })}
        />
      </FieldGroup>
      <FieldGroup label="Quote" htmlFor="smcls-quote">
        <input id="smcls-quote" value={about.quote || ''} onChange={(e) => updateAbout({ quote: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Quote author" htmlFor="smcls-quote-author">
        <input
          id="smcls-quote-author"
          value={about.quoteAuthor || ''}
          onChange={(e) => updateAbout({ quoteAuthor: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="GitHub username" htmlFor="smcls-github-user">
        <input
          id="smcls-github-user"
          value={about.githubUsername || ''}
          onChange={(e) => updateAbout({ githubUsername: e.target.value })}
          placeholder="username"
        />
      </FieldGroup>
      <FieldGroup label="Skillset title" htmlFor="smcls-skillset-title">
        <input
          id="smcls-skillset-title"
          value={content.skillsetTitle || ''}
          onChange={(e) => onChange({ skillsetTitle: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Skillset" htmlFor="smcls-skillset">
        <CommaListField
          id="smcls-skillset"
          value={content.skillset}
          placeholder="React.js, Node.js, Docker"
          onChange={(skillset) => onChange({ skillset })}
        />
      </FieldGroup>
      <FieldGroup label="Tools title" htmlFor="smcls-tools-title">
        <input
          id="smcls-tools-title"
          value={content.toolsTitle || ''}
          onChange={(e) => onChange({ toolsTitle: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Tools" htmlFor="smcls-tools">
        <CommaListField
          id="smcls-tools"
          value={content.tools}
          placeholder="VS Code, Git, Docker"
          onChange={(tools) => onChange({ tools })}
        />
      </FieldGroup>
    </div>
  );
}

function SoumyaClassicProjectsFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <FieldGroup label="Heading lead" htmlFor="smcls-projects-lead">
        <input
          id="smcls-projects-lead"
          value={content.projectsHeadingLead || ''}
          onChange={(e) => onChange({ projectsHeadingLead: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Heading highlight" htmlFor="smcls-projects-highlight">
        <input
          id="smcls-projects-highlight"
          value={content.projectsHeadingHighlight || ''}
          onChange={(e) => onChange({ projectsHeadingHighlight: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Subtitle" htmlFor="smcls-projects-sub">
        <input
          id="smcls-projects-sub"
          value={content.projectsSubtitle || ''}
          onChange={(e) => onChange({ projectsSubtitle: e.target.value })}
        />
      </FieldGroup>
      {content.projects?.map((project, index) => (
        <ItemBlock
          key={index}
          title={`Project ${index + 1}`}
          canRemove={(content.projects?.length || 0) > 0}
          onRemove={() => onChange({ projects: removeListItemAt(content.projects, index, 0) })}
        >
          <FieldGroup label="Title" htmlFor={`smcls-project-title-${index}`}>
            <input
              id={`smcls-project-title-${index}`}
              value={project.title}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`smcls-project-desc-${index}`}>
            <textarea
              id={`smcls-project-desc-${index}`}
              rows={4}
              value={project.description}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, description: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="GitHub URL" htmlFor={`smcls-project-gh-${index}`}>
            <input
              id={`smcls-project-gh-${index}`}
              value={project.github || ''}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, github: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Demo URL" htmlFor={`smcls-project-demo-${index}`}>
            <input
              id={`smcls-project-demo-${index}`}
              value={project.demo || ''}
              onChange={(e) =>
                onChange({
                  projects: content.projects.map((item, i) =>
                    i === index ? { ...item, demo: e.target.value } : item
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add project"
        onClick={() =>
          onChange({
            projects: appendListItem(content.projects, {
              title: 'New Project',
              description: '',
              github: '',
              demo: '',
            }),
          })
        }
      />
    </div>
  );
}

function SoumyaClassicResumeFields({ content, onChange }) {
  const resume = content.resume || {};
  const updateResume = (patch) => onChange({ resume: { ...resume, ...patch } });

  const updateEducation = (index, patch) =>
    updateResume({
      education: resume.education.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });

  const updateExperience = (index, patch) =>
    updateResume({
      experience: resume.experience.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });

  return (
    <div className="builder-fields">
      <ResumeField resume={content.links?.resume || ''} onChange={(value) => onChange({ links: { ...content.links, resume: value } })} />
      <FieldGroup label="Download label" htmlFor="smcls-resume-label">
        <input
          id="smcls-resume-label"
          value={resume.downloadLabel || ''}
          onChange={(e) => updateResume({ downloadLabel: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Education title" htmlFor="smcls-edu-title">
        <input
          id="smcls-edu-title"
          value={resume.educationTitle || ''}
          onChange={(e) => updateResume({ educationTitle: e.target.value })}
        />
      </FieldGroup>
      {resume.education?.map((item, index) => (
        <ItemBlock
          key={`edu-${index}`}
          title={`Education ${index + 1}`}
          canRemove={(resume.education?.length || 0) > 0}
          onRemove={() =>
            updateResume({ education: removeListItemAt(resume.education, index, 0) })
          }
        >
          <FieldGroup label="Degree" htmlFor={`smcls-edu-degree-${index}`}>
            <input
              id={`smcls-edu-degree-${index}`}
              value={item.degree}
              onChange={(e) => updateEducation(index, { degree: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="School" htmlFor={`smcls-edu-school-${index}`}>
            <input
              id={`smcls-edu-school-${index}`}
              value={item.school}
              onChange={(e) => updateEducation(index, { school: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Period" htmlFor={`smcls-edu-period-${index}`}>
            <input
              id={`smcls-edu-period-${index}`}
              value={item.period}
              onChange={(e) => updateEducation(index, { period: e.target.value })}
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add education"
        onClick={() =>
          updateResume({
            education: appendListItem(resume.education, {
              degree: 'Degree',
              school: 'School',
              period: 'Year',
              bullets: ['Detail'],
            }),
          })
        }
      />
      <FieldGroup label="Experience title" htmlFor="smcls-exp-title">
        <input
          id="smcls-exp-title"
          value={resume.experienceTitle || ''}
          onChange={(e) => updateResume({ experienceTitle: e.target.value })}
        />
      </FieldGroup>
      {resume.experience?.map((item, index) => (
        <ItemBlock
          key={`exp-${index}`}
          title={`Experience ${index + 1}`}
          canRemove={(resume.experience?.length || 0) > 0}
          onRemove={() =>
            updateResume({ experience: removeListItemAt(resume.experience, index, 0) })
          }
        >
          <FieldGroup label="Role" htmlFor={`smcls-exp-role-${index}`}>
            <input
              id={`smcls-exp-role-${index}`}
              value={item.role}
              onChange={(e) => updateExperience(index, { role: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Company" htmlFor={`smcls-exp-company-${index}`}>
            <input
              id={`smcls-exp-company-${index}`}
              value={item.company}
              onChange={(e) => updateExperience(index, { company: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup label="Period" htmlFor={`smcls-exp-period-${index}`}>
            <input
              id={`smcls-exp-period-${index}`}
              value={item.period}
              onChange={(e) => updateExperience(index, { period: e.target.value })}
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add experience"
        onClick={() =>
          updateResume({
            experience: appendListItem(resume.experience, {
              role: 'Role',
              company: 'Company',
              period: 'Year',
              bullets: ['Detail'],
            }),
          })
        }
      />
    </div>
  );
}

const BUILT_SECTION_FIELDS = {
  'dark-orange-pro': {
    hero: SawadHeroFields,
    skills: SawadSkillsFields,
    projects: (props) => <ProjectsFields {...props} />,
    experience: (props) => <ExperienceFields {...props} />,
    tools: ToolsFields,
    thoughts: ThoughtsFields,
    contact: SawadContactFields,
  },
  'dev-minimal': {
    hero: DevMinimalHeroFields,
    about: AboutFields,
    projects: (props) => <ProjectsFields {...props} withTech />,
    skills: DevMinimalSkillsFields,
    experience: (props) => <ExperienceFields {...props} useDescription />,
    education: EducationFields,
    contact: DevMinimalContactFields,
    stats: (props) => <StatsFields {...props} />,
  },
  'vscode-studio': {
    hero: VscodeHeroFields,
    copilot: VscodeCopilotFields,
    about: AboutFields,
    projects: (props) => <ProjectsFields {...props} withTech />,
    skills: DevMinimalSkillsFields,
    experience: (props) => <ExperienceFields {...props} useDescription />,
    contact: DevMinimalContactFields,
  },
  'creative-modern': {
    hero: CreativeModernHeroFields,
    about: CreativeModernAboutFields,
    services: CreativeModernServicesFields,
    projects: (props) => <ProjectsFields {...props} withTech />,
    contact: CreativeModernContactFields,
  },
  'developer-classic': {
    hero: DeveloperClassicHeroFields,
    expertise: DeveloperClassicExpertiseFields,
    experience: DeveloperClassicExperienceFields,
    projects: DeveloperClassicProjectsFields,
    contact: DeveloperClassicContactFields,
  },
  'soumya-classic': {
    hero: SoumyaClassicHeroFields,
    about: SoumyaClassicAboutFields,
    projects: SoumyaClassicProjectsFields,
    resume: SoumyaClassicResumeFields,
  },
  'aurora-flux': {
    hero: AuroraFluxHeroFields,
    about: AuroraFluxAboutFields,
    skills: DevMinimalSkillsFields,
    projects: AuroraFluxProjectsFields,
    experience: (props) => <ExperienceFields {...props} useDescription />,
    contact: DevMinimalContactFields,
  },
  'lumen-bloom': {
    hero: LumenBloomHeroFields,
    about: LumenBloomAboutFields,
    skills: DevMinimalSkillsFields,
    projects: AuroraFluxProjectsFields,
    experience: (props) => <ExperienceFields {...props} useDescription />,
    contact: DevMinimalContactFields,
  },
  'midnight-gold': {
    hero: MidnightGoldHeroFields,
    about: MidnightGoldAboutFields,
    skills: DevMinimalSkillsFields,
    projects: AuroraFluxProjectsFields,
    experience: (props) => <ExperienceFields {...props} useDescription />,
    contact: DevMinimalContactFields,
  },
  'prism-drift': {
    hero: PrismDriftHeroFields,
    about: PrismDriftAboutFields,
    skills: DevMinimalSkillsFields,
    projects: AuroraFluxProjectsFields,
    experience: (props) => <ExperienceFields {...props} useDescription />,
    contact: DevMinimalContactFields,
  },
};

function UniversalTechStackFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <FieldGroup label="Tech Stack" htmlFor="uni-tech-stack">
        <CommaListField
          id="uni-tech-stack"
          value={content.techStack || []}
          onChange={(techStack) => onChange({ techStack })}
        />
      </FieldGroup>
    </div>
  );
}

function UniversalServicesFields({ content, onChange }) {
  const services = content.services || [];
  return (
    <div className="builder-fields">
      {services.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Service ${index + 1}`}
          canRemove={services.length > 1}
          onRemove={() => onChange({ services: removeListItemAt(services, index, 1) })}
        >
          <FieldGroup label="Name" htmlFor={`uni-service-name-${index}`}>
            <input
              id={`uni-service-name-${index}`}
              value={item.name || ''}
              onChange={(e) =>
                onChange({
                  services: services.map((service, i) =>
                    i === index ? { ...service, name: e.target.value } : service
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Description" htmlFor={`uni-service-desc-${index}`}>
            <textarea
              id={`uni-service-desc-${index}`}
              rows={3}
              value={item.desc || ''}
              onChange={(e) =>
                onChange({
                  services: services.map((service, i) =>
                    i === index ? { ...service, desc: e.target.value } : service
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Icon" htmlFor={`uni-service-icon-${index}`}>
            <input
              id={`uni-service-icon-${index}`}
              value={item.icon || ''}
              onChange={(e) =>
                onChange({
                  services: services.map((service, i) =>
                    i === index ? { ...service, icon: e.target.value } : service
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add service"
        onClick={() =>
          onChange({
            services: appendListItem(services, { name: 'Service', desc: 'Description', icon: '◆' }),
          })
        }
      />
    </div>
  );
}

function UniversalTestimonialsFields({ content, onChange }) {
  const testimonials = content.testimonials || [];
  return (
    <div className="builder-fields">
      {testimonials.map((item, index) => (
        <ItemBlock
          key={index}
          title={`Testimonial ${index + 1}`}
          canRemove={testimonials.length > 1}
          onRemove={() => onChange({ testimonials: removeListItemAt(testimonials, index, 1) })}
        >
          <FieldGroup label="Quote" htmlFor={`uni-testimonial-quote-${index}`}>
            <textarea
              id={`uni-testimonial-quote-${index}`}
              rows={3}
              value={item.quote || ''}
              onChange={(e) =>
                onChange({
                  testimonials: testimonials.map((row, i) =>
                    i === index ? { ...row, quote: e.target.value } : row
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Author" htmlFor={`uni-testimonial-author-${index}`}>
            <input
              id={`uni-testimonial-author-${index}`}
              value={item.author || ''}
              onChange={(e) =>
                onChange({
                  testimonials: testimonials.map((row, i) =>
                    i === index ? { ...row, author: e.target.value } : row
                  ),
                })
              }
            />
          </FieldGroup>
          <FieldGroup label="Role" htmlFor={`uni-testimonial-role-${index}`}>
            <input
              id={`uni-testimonial-role-${index}`}
              value={item.role || ''}
              onChange={(e) =>
                onChange({
                  testimonials: testimonials.map((row, i) =>
                    i === index ? { ...row, role: e.target.value } : row
                  ),
                })
              }
            />
          </FieldGroup>
        </ItemBlock>
      ))}
      <AddListItemButton
        label="Add testimonial"
        onClick={() =>
          onChange({
            testimonials: appendListItem(testimonials, {
              quote: 'Great work and communication.',
              author: 'Client Name',
              role: 'Product Lead',
            }),
          })
        }
      />
    </div>
  );
}

function UniversalStatisticsFields({ content, onChange }) {
  return <StatsFields content={{ ...content, stats: content.statistics || [] }} onChange={(patch) => onChange({ statistics: patch.stats })} />;
}

function UniversalCtaFields({ content, onChange }) {
  const cta = content.cta || {};
  return (
    <div className="builder-fields">
      <FieldGroup label="Title" htmlFor="uni-cta-title">
        <input id="uni-cta-title" value={cta.title || ''} onChange={(e) => onChange({ cta: { ...cta, title: e.target.value } })} />
      </FieldGroup>
      <FieldGroup label="Subtitle" htmlFor="uni-cta-subtitle">
        <textarea id="uni-cta-subtitle" rows={3} value={cta.subtitle || ''} onChange={(e) => onChange({ cta: { ...cta, subtitle: e.target.value } })} />
      </FieldGroup>
      <FieldGroup label="Button text" htmlFor="uni-cta-button">
        <input id="uni-cta-button" value={cta.buttonText || ''} onChange={(e) => onChange({ cta: { ...cta, buttonText: e.target.value } })} />
      </FieldGroup>
      <FieldGroup label="Button link" htmlFor="uni-cta-link">
        <input id="uni-cta-link" value={cta.buttonHref || ''} onChange={(e) => onChange({ cta: { ...cta, buttonHref: e.target.value } })} />
      </FieldGroup>
    </div>
  );
}

function UniversalFooterFields({ content, onChange }) {
  const footerText = typeof content.footer === 'string' ? content.footer : content.footer?.credit || '';
  return (
    <div className="builder-fields">
      <FieldGroup label="Footer text" htmlFor="uni-footer-text">
        <input id="uni-footer-text" value={footerText} onChange={(e) => onChange({ footer: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

const UNIVERSAL_SECTION_FIELDS = {
  about: AboutFields,
  skills: DevMinimalSkillsFields,
  'tech-stack': UniversalTechStackFields,
  experience: (props) => <ExperienceFields {...props} useDescription />,
  education: EducationFields,
  projects: (props) => <ProjectsFields {...props} withTech />,
  services: UniversalServicesFields,
  testimonials: UniversalTestimonialsFields,
  statistics: UniversalStatisticsFields,
  contact: DevMinimalContactFields,
  cta: UniversalCtaFields,
  footer: UniversalFooterFields,
};

export function renderBuiltSectionFields({ templateId, activeSection, content, onChange }) {
  const templateFields = BUILT_SECTION_FIELDS[templateId];
  const FieldRenderer = templateFields?.[activeSection] || UNIVERSAL_SECTION_FIELDS[activeSection];
  if (!FieldRenderer) return null;
  return <FieldRenderer templateId={templateId} content={content} onChange={onChange} />;
}

export function GenericHeroFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <FieldGroup label="Name" htmlFor="headline">
        <input id="headline" value={content.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Role / Title" htmlFor="role">
        <input id="role" value={content.title || ''} onChange={(e) => onChange({ title: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Tagline" htmlFor="tagline">
        <input id="tagline" value={content.tagline || ''} onChange={(e) => onChange({ tagline: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

export function GenericAboutFields({ content, onChange }) {
  return (
    <div className="builder-fields">
      <FieldGroup label="Bio" htmlFor="bio">
        <textarea id="bio" rows={6} value={content.bio || ''} onChange={(e) => onChange({ bio: e.target.value })} />
      </FieldGroup>
    </div>
  );
}

export function GenericPlaceholderFields({ activeSection }) {
  return (
    <div className="builder-placeholder">
      <p>Customize your {activeSection} section here.</p>
      <p className="builder-placeholder-hint">More controls coming in the next update.</p>
    </div>
  );
}
