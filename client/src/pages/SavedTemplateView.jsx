import { useMemo } from 'react';
import { useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom';
import { getTemplateById } from '../data/templates';
import TemplateRenderer from '../portfolio-templates/TemplateRenderer';
import { getThemeById } from '../constants/templateThemes';
import { loadSavedPortfolioDraft, getMyTemplatesPath } from '../utils/builderPreviewDraft';

export default function SavedTemplateView() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cleanView = searchParams.get('clean') === '1';

  const saved = useMemo(() => {
    if (!templateId) return null;
    return loadSavedPortfolioDraft(templateId);
  }, [templateId]);

  if (!templateId) {
    return <Navigate to={getMyTemplatesPath()} replace />;
  }

  const template = getTemplateById(templateId);

  if (!template) {
    return <Navigate to={getMyTemplatesPath()} replace />;
  }

  if (!saved?.draft?.content) {
    if (cleanView) {
      return (
        <div className="template-preview-page">
          <div className="template-preview-empty">
            <p>No saved version found for this template.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="template-preview-page">
        <header className="template-preview-bar">
          <button type="button" className="btn-ghost" onClick={() => navigate(getMyTemplatesPath())}>
            Back to My Templates
          </button>
          <span className="template-preview-title">{template.name}</span>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/builder', { state: { templateId } })}
          >
            Edit in Builder
          </button>
        </header>
        <div className="template-preview-empty">
          <p>No saved version found for this template. Open the builder, make your changes, and save.</p>
        </div>
      </div>
    );
  }

  const { draft } = saved;
  const theme = draft.themeId ? getThemeById(templateId, draft.themeId) : undefined;
  const displayName = draft.content?.name || template.name;

  if (cleanView) {
    return (
      <div className="template-preview-page template-preview-page--clean">
        <div className="template-preview-canvas template-preview-canvas--clean">
          <TemplateRenderer
            templateId={templateId}
            preview
            content={draft.content}
            sectionOrder={draft.sectionOrder}
            theme={theme}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="template-preview-page">
      <header className="template-preview-bar">
        <button type="button" className="btn-ghost" onClick={() => navigate(getMyTemplatesPath())}>
          Back to My Templates
        </button>
        <span className="template-preview-title">{displayName}</span>
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate('/builder', { state: { templateId } })}
        >
          Edit Template
        </button>
      </header>
      <div className="template-preview-canvas">
        <TemplateRenderer
          templateId={templateId}
          preview
          content={draft.content}
          sectionOrder={draft.sectionOrder}
          theme={theme}
        />
      </div>
    </div>
  );
}
