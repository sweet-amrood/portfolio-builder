import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getTemplateById } from '../data/templates';
import TemplateRenderer from '../portfolio-templates/TemplateRenderer';
import BuilderToolbar from '../components/builder/BuilderToolbar';
import BuilderSidebar from '../components/builder/BuilderSidebar';
import BuilderCanvasBar from '../components/builder/BuilderCanvasBar';
import BuilderInspector from '../components/builder/BuilderInspector';
import { getDefaultContent } from '../constants/defaultTemplateContent';
import { getDefaultThemeId, getThemeById } from '../constants/templateThemes';
import {
  getSectionsForTemplate,
  getDefaultSectionOrder,
  getAvailableSectionsToAdd,
} from '../constants/templateSections';
import {
  openBuilderPreview,
  saveBuilderPreviewDraft,
  buildDraftSnapshot,
  loadBuilderPreviewDraft,
  getMyTemplatesPath,
  publishPortfolioDraft,
} from '../utils/builderPreviewDraft';
import {
  resetSectionContent,
  resetAllContent,
  resetSectionOrder,
} from '../utils/builderSectionReset';
import { useBuilderHistory } from '../hooks/useBuilderHistory';
import { useBuilderAutosave } from '../hooks/useBuilderAutosave';
import { BuilderEditProvider } from '../components/builder/BuilderEditContext';
import BuilderLiveEditLayer from '../components/builder/BuilderLiveEditLayer';
import PublishModal from '../components/builder/PublishModal';
import { patchContentField } from '../utils/builderFieldUtils';
import { patchFieldStyle, resetFieldStyle, resetSectionFieldStyles } from '../utils/fieldStyleUtils';
import { loadFontsFromContent } from '../utils/loadPortfolioFont';
import { getTemplateBodyFont, getTemplateHeadingFont } from '../constants/portfolioFonts';
import { fetchMasterProfile } from '../utils/masterProfileStorage';
import { applyProfileToTemplate, profileHasSkillData } from '../utils/applyProfileToTemplate';
import { ensureUniversalContent } from '../portfolio-templates/shared/universalSections';
import {
  remapIndexedFieldPath,
  swapAdjacentListItem,
} from '../utils/builderListFieldUtils';
import toast from 'react-hot-toast';
import { slugFromName, getPublicPortfolioPath } from '../utils/portfolioSlug';
import '../styles/builder.css';

function buildInitialState(templateId, isBuilt) {
  const savedDraft = loadBuilderPreviewDraft(templateId);
  const defaultOrder = getDefaultSectionOrder(templateId, isBuilt).filter(
    (id) => !getSectionsForTemplate(templateId, isBuilt).find((s) => s.id === id)?.fixed
  );

  return {
    content: ensureUniversalContent(savedDraft?.content || getDefaultContent(templateId)),
    sectionOrder: savedDraft?.sectionOrder?.length ? savedDraft.sectionOrder : defaultOrder,
    activeThemeId: savedDraft?.themeId || getDefaultThemeId(templateId),
  };
}

export default function PortfolioBuilder() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const templateId = location.state?.templateId;
  const resolvedId = templateId || 'dark-orange-pro';
  const aiGenerated = Boolean(location.state?.aiGenerated);

  const currentTemplate = getTemplateById(resolvedId);
  const isBuiltTemplate = currentTemplate?.built;

  const initialState = useMemo(
    () => buildInitialState(resolvedId, isBuiltTemplate),
    [resolvedId, isBuiltTemplate, aiGenerated]
  );

  const {
    state: builderState,
    setState: setBuilderState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useBuilderHistory(initialState);

  useEffect(() => {
    if (!aiGenerated) return;
    resetHistory(initialState);
    setSaveStatus('saved');
    setActiveSection('hero');
  }, [aiGenerated, initialState, resetHistory]);

  const { content, sectionOrder, activeThemeId } = builderState;

  const [activeSection, setActiveSection] = useState('hero');
  const [device, setDevice] = useState('desktop');
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState(() =>
    loadBuilderPreviewDraft(resolvedId)?.content ? 'saved' : 'unsaved'
  );
  const [selectedField, setSelectedField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const canvasRef = useRef(null);

  const activeTemplate = currentTemplate.id;
  const activeTheme = useMemo(
    () => getThemeById(activeTemplate, activeThemeId),
    [activeTemplate, activeThemeId]
  );
  const sections = useMemo(
    () => getSectionsForTemplate(activeTemplate, isBuiltTemplate),
    [activeTemplate, isBuiltTemplate]
  );
  const fixedSectionIds = useMemo(
    () => sections.filter((s) => s.fixed).map((s) => s.id),
    [sections]
  );
  const reorderableSections = sections.filter((s) => !s.fixed);
  const reorderableIds = sectionOrder.filter((id) => reorderableSections.some((s) => s.id === id));
  const sectionsToAdd = getAvailableSectionsToAdd(activeTemplate, isBuiltTemplate, reorderableIds);
  const activeSectionMeta = sections.find((s) => s.id === activeSection);
  const previewSubdomain = useMemo(() => {
    if (user?.portfolioSlug) return user.portfolioSlug;
    const firstName = user?.name?.trim().split(/\s+/)[0] || '';
    const slug = slugFromName(firstName);
    return slug || 'yourname';
  }, [user?.portfolioSlug, user?.name]);

  const previewPortfolioPath = useMemo(
    () => (user?.portfolioSlug ? getPublicPortfolioPath(user.portfolioSlug) : `/${previewSubdomain}`),
    [user?.portfolioSlug, previewSubdomain]
  );

  const canvasSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getDraftSnapshot = useCallback(
    () =>
      buildDraftSnapshot({
        templateId: activeTemplate,
        content,
        sectionOrder: reorderableIds,
        themeId: activeThemeId,
      }),
    [activeTemplate, content, reorderableIds, activeThemeId]
  );

  const persistDraft = useCallback(
    (silent = false) => {
      setSaveStatus('saving');
      saveBuilderPreviewDraft(getDraftSnapshot());
      setSaveStatus(silent ? 'autosaved' : 'saved');
      if (!silent) toast.success('Portfolio saved');
    },
    [getDraftSnapshot]
  );

  useBuilderAutosave({
    enabled: Boolean(templateId),
    isDirty: saveStatus === 'unsaved',
    onAutosave: () => persistDraft(true),
    delay: 2800,
  });

  const markDirty = useCallback(() => {
    setSaveStatus((status) => (status === 'unsaved' ? status : 'unsaved'));
  }, []);

  const handleContentChange = useCallback(
    (patch) => {
      setBuilderState((prev) => ({
        ...prev,
        content: { ...prev.content, ...patch },
      }));
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleFieldChange = useCallback(
    (path, value) => {
      setBuilderState((prev) => ({
        ...prev,
        content: patchContentField(prev.content, path, value),
      }));
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleFieldStyleChange = useCallback(
    (section, field, stylePatch) => {
      setBuilderState((prev) => ({
        ...prev,
        content: patchFieldStyle(prev.content, section, field, stylePatch),
      }));
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleResetFieldStyle = useCallback(
    (section, field) => {
      setBuilderState((prev) => ({
        ...prev,
        content: resetFieldStyle(prev.content, section, field),
      }));
      markDirty();
      toast.success('Field styles reset');
    },
    [setBuilderState, markDirty]
  );

  const handleListItemMove = useCallback(
    (arrayPath, index, direction) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      setBuilderState((prev) => ({
        ...prev,
        content: swapAdjacentListItem(prev.content, arrayPath, index, direction),
      }));
      setSelectedField((current) => {
        if (!current?.field) return current;
        return {
          ...current,
          field: remapIndexedFieldPath(current.field, index, targetIndex),
        };
      });
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleSectionReorder = useCallback(
    (order) => {
      setBuilderState((prev) => ({ ...prev, sectionOrder: order }));
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleThemeSelect = useCallback(
    (themeId) => {
      setBuilderState((prev) => ({ ...prev, activeThemeId: themeId }));
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleTemplateBodyFontSelect = useCallback(
    (fontValue) => {
      setBuilderState((prev) => {
        const nextContent = { ...prev.content };
        if (fontValue) nextContent.templateBodyFont = fontValue;
        else delete nextContent.templateBodyFont;
        delete nextContent.templateFont;
        return { ...prev, content: nextContent };
      });
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  const handleTemplateHeadingFontSelect = useCallback(
    (fontValue) => {
      setBuilderState((prev) => {
        const nextContent = { ...prev.content };
        if (fontValue) nextContent.templateHeadingFont = fontValue;
        else delete nextContent.templateHeadingFont;
        return { ...prev, content: nextContent };
      });
      markDirty();
    },
    [setBuilderState, markDirty]
  );

  useEffect(() => {
    loadFontsFromContent(content);
  }, [content?.templateBodyFont, content?.templateFont, content?.templateHeadingFont, content?.fieldStyles]);

  const handleSectionSelect = useCallback(
    (sectionId) => {
      setActiveSection(sectionId);
      if (!isBuiltTemplate) return;
      requestAnimationFrame(() => {
        const scrollContainer = document.querySelector('.builder-v2-canvas-wrap');
        const target = document.getElementById(sectionId);
        if (!scrollContainer || !target) return;
        const offset = target.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top;
        scrollContainer.scrollBy({ top: offset - 24, behavior: 'smooth' });
      });
    },
    [isBuiltTemplate]
  );

  const handleSelectField = useCallback((fieldMeta) => {
    setSelectedField((prev) => {
      if (prev?.field === fieldMeta.field && prev?.section === fieldMeta.section) return prev;
      return fieldMeta;
    });
  }, []);

  const handleStartFieldEdit = useCallback((fieldMeta) => {
    setSelectedField(fieldMeta);
    setEditingField(fieldMeta);
  }, []);

  const handleEndFieldEdit = useCallback(
    (fieldPath, value) => {
      setEditingField(null);
      handleFieldChange(fieldPath, value);
    },
    [handleFieldChange]
  );

  const handleCancelFieldEdit = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleCanvasDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    handleSectionReorder(arrayMove(sectionOrder, oldIndex, newIndex));
  };

  const handleRemoveSection = useCallback(
    (sectionId) => {
      setBuilderState((prev) => ({
        ...prev,
        sectionOrder: prev.sectionOrder.filter((id) => id !== sectionId),
        content:
          activeTemplate === 'soumya-classic'
            ? {
                ...prev.content,
                sectionPageMap: Object.fromEntries(
                  Object.entries(prev.content?.sectionPageMap || {}).filter(([id]) => id !== sectionId)
                ),
              }
            : prev.content,
      }));
      markDirty();
      setActiveSection((current) => {
        if (current !== sectionId) return current;
        return fixedSectionIds[0] || 'hero';
      });
      toast.success('Section removed');
    },
    [setBuilderState, markDirty, fixedSectionIds, activeTemplate]
  );

  const handleAddSection = useCallback(
    (sectionId) => {
      setBuilderState((prev) => {
        if (activeTemplate !== 'soumya-classic') {
          return {
            ...prev,
            sectionOrder: [...prev.sectionOrder, sectionId],
          };
        }

        const pageMap = prev.content?.sectionPageMap || {};
        const currentPageIds = new Set(['hero', 'about', 'projects', 'resume']);
        const ownerPage = currentPageIds.has(activeSection)
          ? activeSection
          : pageMap[activeSection] || 'projects';

        return {
          ...prev,
          sectionOrder: [...prev.sectionOrder, sectionId],
          content: {
            ...prev.content,
            sectionPageMap: {
              ...pageMap,
              [sectionId]: ownerPage,
            },
          },
        };
      });
      setActiveSection(sectionId);
      markDirty();
      toast.success('Section added');
    },
    [setBuilderState, markDirty, activeTemplate, activeSection]
  );

  const handleResetSection = useCallback(() => {
    setBuilderState((prev) => ({
      ...prev,
      content: resetSectionFieldStyles(
        resetSectionContent(activeTemplate, activeSection, prev.content),
        activeSection
      ),
    }));
    setSelectedField((current) => (current?.section === activeSection ? null : current));
    markDirty();
    toast.success('Section reset to defaults');
  }, [activeTemplate, activeSection, setBuilderState, markDirty]);

  const handleResetPortfolio = useCallback(() => {
    if (!window.confirm('Reset entire portfolio to template defaults? This cannot be undone.')) return;
    const next = {
      content: resetAllContent(activeTemplate),
      sectionOrder: resetSectionOrder(activeTemplate, isBuiltTemplate),
      activeThemeId: getDefaultThemeId(activeTemplate),
    };
    setBuilderState(next);
    resetHistory(next);
    setActiveSection('hero');
    markDirty();
    toast.success('Portfolio reset to defaults');
  }, [activeTemplate, isBuiltTemplate, setBuilderState, resetHistory, markDirty]);

  const handleSave = () => persistDraft(false);
  const handlePublish = () => {
    const snapshot = getDraftSnapshot();
    saveBuilderPreviewDraft(snapshot);
    setSaveStatus('saved');
    setPublishModalOpen(true);
  };

  const handlePublished = (result) => {
    const snapshot = getDraftSnapshot();
    saveBuilderPreviewDraft(snapshot);
    publishPortfolioDraft(snapshot);
    setSaveStatus('saved');
    if (result?.slug) {
      updateUser({ portfolioSlug: result.slug });
    }
  };

  const handlePreview = () => {
    if (saveStatus === 'unsaved') {
      saveBuilderPreviewDraft(getDraftSnapshot());
      setSaveStatus('saved');
    }
    openBuilderPreview(getDraftSnapshot());
  };

  const handleMyTemplates = () => {
    if (saveStatus === 'unsaved') {
      saveBuilderPreviewDraft(getDraftSnapshot());
      setSaveStatus('saved');
    }
    navigate(getMyTemplatesPath());
  };

  const handleImportProfile = useCallback(async () => {
    try {
      const profile = await fetchMasterProfile(user?.id);
      const hasData =
        profile.personal?.name ||
        profile.personal?.headline ||
        profile.experience?.length ||
        profile.projects?.length ||
        profileHasSkillData(profile);

      if (!hasData) {
        toast.error('Profile is empty — fill in your details first');
        navigate('/profile');
        return;
      }

      setBuilderState((prev) => ({
        ...prev,
        content: applyProfileToTemplate(activeTemplate, prev.content, profile),
      }));
      markDirty();
      toast.success('Profile imported into portfolio');
    } catch {
      toast.error('Could not import profile');
    }
  }, [user?.id, activeTemplate, setBuilderState, markDirty, navigate]);

  const workspaceClass = useMemo(() => {
    if (leftPanelOpen && rightPanelOpen) return 'builder-v2-workspace--lr';
    if (leftPanelOpen) return 'builder-v2-workspace--l';
    if (rightPanelOpen) return 'builder-v2-workspace--r';
    return 'builder-v2-workspace--canvas';
  }, [leftPanelOpen, rightPanelOpen]);

  const builderEditValue = useMemo(
    () => ({
      editable: Boolean(isBuiltTemplate),
      canvasRef,
      onFieldChange: handleFieldChange,
      onSectionSelect: handleSectionSelect,
      onSelectField: handleSelectField,
      onStartFieldEdit: handleStartFieldEdit,
      onEndFieldEdit: handleEndFieldEdit,
      onCancelFieldEdit: handleCancelFieldEdit,
      selectedField,
      editingField,
    }),
    [
      isBuiltTemplate,
      handleFieldChange,
      handleSectionSelect,
      handleSelectField,
      handleStartFieldEdit,
      handleEndFieldEdit,
      handleCancelFieldEdit,
      selectedField,
      editingField,
    ]
  );

  const handleUndo = useCallback(() => {
    undo();
    markDirty();
  }, [undo, markDirty]);

  const handleRedo = useCallback(() => {
    redo();
    markDirty();
  }, [redo, markDirty]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      }
      if ((event.key === 'z' && event.shiftKey) || event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
      if (event.key === 's') {
        event.preventDefault();
        persistDraft(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo, persistDraft]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isBuiltTemplate) return undefined;

    const onClick = (event) => {
      if (event.target.closest('[data-pf-field]')) return;
      setSelectedField(null);
      setEditingField(null);
      const section = event.target.closest('section[id]');
      if (!section?.id || event.target.closest('.template-section-drag')) return;
      handleSectionSelect(section.id);
    };

    canvas.addEventListener('click', onClick);
    return () => canvas.removeEventListener('click', onClick);
  }, [isBuiltTemplate, handleSectionSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isBuiltTemplate) return;
    canvas.querySelectorAll('section[id]').forEach((el) => {
      el.classList.toggle('builder-canvas-section--active', el.id === activeSection);
    });
  }, [activeSection, content, sectionOrder, isBuiltTemplate]);

  if (!templateId) {
    return <Navigate to="/templates" replace />;
  }

  return (
    <div className="builder-page">
      <BuilderToolbar
        templateName={currentTemplate.name}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onMyTemplates={handleMyTemplates}
        onImportProfile={handleImportProfile}
      />

      <div className={`builder-v2-workspace ${workspaceClass}`}>
        {leftPanelOpen && (
          <BuilderSidebar
            sections={sections}
            order={reorderableIds}
            activeSection={activeSection}
            fixedSectionIds={fixedSectionIds}
            sectionsToAdd={sectionsToAdd}
            templateId={activeTemplate}
            activeThemeId={activeThemeId}
            templateBodyFont={getTemplateBodyFont(content)}
            templateHeadingFont={getTemplateHeadingFont(content)}
            canvasZoom={canvasZoom}
            onSectionSelect={handleSectionSelect}
            onSectionReorder={handleSectionReorder}
            onSectionRemove={handleRemoveSection}
            onSectionAdd={handleAddSection}
            onThemeSelect={handleThemeSelect}
            onTemplateBodyFontSelect={handleTemplateBodyFontSelect}
            onTemplateHeadingFontSelect={handleTemplateHeadingFontSelect}
            onZoomChange={setCanvasZoom}
            onResetPortfolio={handleResetPortfolio}
            isBuiltTemplate={isBuiltTemplate}
          />
        )}

        <div className="builder-v2-canvas-zone">
          <BuilderCanvasBar
            device={device}
            onDeviceChange={setDevice}
            canvasZoom={canvasZoom}
            leftPanelOpen={leftPanelOpen}
            rightPanelOpen={rightPanelOpen}
            onToggleLeftPanel={() => setLeftPanelOpen((v) => !v)}
            onToggleRightPanel={() => setRightPanelOpen((v) => !v)}
          />

          <div className="builder-v2-canvas-wrap">
            <div
              className="builder-v2-canvas-scaler"
              style={{ transform: `scale(${canvasZoom / 100})` }}
            >
              <motion.div
                className={`builder-v2-canvas builder-v2-canvas--${device}`}
                layout
                transition={{ duration: 0.3 }}
              >
                <div className="canvas-browser-bar">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="canvas-url">
                    {typeof window !== 'undefined' ? window.location.host : 'portfolioforge.app'}
                    {previewPortfolioPath}
                  </span>
                </div>

                {isBuiltTemplate ? (
                  <div className="builder-template-canvas builder-template-canvas--live-edit" ref={canvasRef}>
                    <BuilderEditProvider value={builderEditValue}>
                      <BuilderLiveEditLayer />
                      <DndContext
                        sensors={canvasSensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleCanvasDragEnd}
                      >
                        <SortableContext items={reorderableIds} strategy={verticalListSortingStrategy}>
                          <TemplateRenderer
                            templateId={activeTemplate}
                            editable
                            sectionOrder={reorderableIds}
                            content={content}
                            theme={activeTheme}
                            focusedSection={activeSection}
                            onFocusedSectionChange={handleSectionSelect}
                          />
                        </SortableContext>
                      </DndContext>
                    </BuilderEditProvider>
                  </div>
                ) : (
                  <div className={`canvas-preview canvas-preview--${activeTemplate}`}>
                    <header className="canvas-nav">
                      <span className="canvas-logo">{(content.name || 'John').split(' ')[0]}</span>
                      <nav>
                        <span>Work</span>
                        <span>About</span>
                        <span>Contact</span>
                      </nav>
                    </header>

                    {activeSection === 'hero' && (
                      <section className="canvas-hero">
                        <h2>{content.name || 'John Doe'}</h2>
                        <p className="canvas-role">{content.title || 'Creative Professional'}</p>
                        <p className="canvas-tagline">{content.tagline}</p>
                        <button type="button" className="canvas-cta">View My Work</button>
                      </section>
                    )}

                    {activeSection === 'about' && (
                      <section className="canvas-about">
                        <h3>About Me</h3>
                        <p>{content.bio}</p>
                      </section>
                    )}

                    {activeSection === 'projects' && (
                      <section className="canvas-projects">
                        <h3>Featured Projects</h3>
                        <div className="canvas-project-grid">
                          {(content.projects || []).map((p) => (
                            <div key={p.title} className="canvas-project-card">
                              <div className="canvas-project-img" />
                              <h4>{p.title}</h4>
                              <p>{p.subtitle}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {activeSection === 'skills' && (
                      <section className="canvas-skills">
                        <h3>Skills</h3>
                        <div className="canvas-skill-tags">
                          {[...(content.skillsRow1 || []), ...(content.skillsRow2 || [])].map((s) => (
                            <span key={s}>{s}</span>
                          ))}
                        </div>
                      </section>
                    )}

                    {activeSection === 'contact' && (
                      <section className="canvas-contact">
                        <h3>Get in Touch</h3>
                        <p>Let&apos;s build something great together.</p>
                        <span className="canvas-email">{user?.email || 'hello@example.com'}</span>
                      </section>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {rightPanelOpen && (
          <BuilderInspector
            templateId={activeTemplate}
            activeSection={activeSection}
            activeSectionMeta={activeSectionMeta}
            content={content}
            onChange={handleContentChange}
            isBuiltTemplate={isBuiltTemplate}
            onResetSection={handleResetSection}
            selectedField={selectedField}
            onFieldStyleChange={handleFieldStyleChange}
            onResetFieldStyle={handleResetFieldStyle}
            onListItemMove={handleListItemMove}
          />
        )}
      </div>

      <PublishModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublished={handlePublished}
        templateId={activeTemplate}
        getSnapshot={getDraftSnapshot}
        user={user}
      />
    </div>
  );
}
