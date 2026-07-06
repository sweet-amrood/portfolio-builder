import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { getTemplateById } from '../data/templates';
import TemplateRenderer from '../portfolio-templates/TemplateRenderer';
import { getThemeById } from '../constants/templateThemes';
import { loadBuilderPreviewDraft } from '../utils/builderPreviewDraft';

export default function TemplatePreview() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDraftPreview = searchParams.get('draft') === '1';
  const template = templateId ? getTemplateById(templateId) : null;
  const pageRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const draft = useMemo(() => {
    if (!isDraftPreview || !templateId) return null;
    return loadBuilderPreviewDraft(templateId);
  }, [isDraftPreview, templateId]);

  const syncFullscreen = useCallback(() => {
    setIsFullscreen(document.fullscreenElement === pageRef.current);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, [syncFullscreen]);

  if (!templateId || !template) {
    return <Navigate to="/templates" replace />;
  }

  const hasDraft = Boolean(draft?.content);
  const previewContent = hasDraft ? draft.content : undefined;
  const previewSectionOrder = hasDraft ? draft.sectionOrder : undefined;
  const previewTheme = hasDraft && draft.themeId
    ? getThemeById(templateId, draft.themeId)
    : undefined;

  const handleBack = () => {
    if (isDraftPreview) {
      navigate('/builder', { state: { templateId: template.id } });
      return;
    }
    navigate('/templates');
  };

  const handleEdit = () => {
    navigate('/builder', { state: { templateId: template.id } });
  };

  const toggleFullscreen = async () => {
    const node = pageRef.current;
    if (!node) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await node.requestFullscreen();
      }
    } catch {
      setIsFullscreen((value) => !value);
    }
  };

  const immersive = isFullscreen;

  return (
    <div
      ref={pageRef}
      className={`template-preview-page${immersive ? ' template-preview-page--fullscreen' : ''}`}
    >
      <header className="template-preview-bar">
        <button type="button" className="btn-ghost" onClick={handleBack}>
          {isDraftPreview ? 'Back to Builder' : 'Back to Templates'}
        </button>
        <span className="template-preview-title">
          {isDraftPreview ? 'Your Portfolio' : template.name} — Preview
        </span>
        <div className="template-preview-actions">
          <button type="button" className="btn-ghost" onClick={toggleFullscreen}>
            {immersive ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button type="button" className="btn-primary" onClick={handleEdit}>
            {isDraftPreview ? 'Continue Editing' : 'Edit Template'}
          </button>
        </div>
      </header>
      <div className="template-preview-canvas">
        {isDraftPreview && !hasDraft ? (
          <div className="template-preview-empty">
            <p>No saved draft found. Go back to the builder, save your work, then preview again.</p>
          </div>
        ) : (
          <TemplateRenderer
            templateId={template.id}
            preview
            content={previewContent}
            sectionOrder={previewSectionOrder}
            theme={previewTheme}
          />
        )}
      </div>
    </div>
  );
}

export function getTemplatePreviewPath(templateId) {
  return `/templates/${templateId}/preview`;
}
