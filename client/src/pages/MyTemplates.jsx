import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTemplateById } from '../data/templates';
import TemplateThumbnail from '../components/TemplateThumbnail';
import {
  listSavedPortfolioDrafts,
  removeSavedPortfolioDraft,
  formatSavedAt,
  getSavedTemplatePath,
} from '../utils/builderPreviewDraft';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function MyTemplates() {
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [location.key]);

  const savedTemplates = useMemo(() => listSavedPortfolioDrafts(), [refreshKey]);

  const handleDelete = (templateId, templateName) => {
    removeSavedPortfolioDraft(templateId);
    toast.success(`Removed ${templateName}`);
    setRefreshKey((k) => k + 1);
  };

  if (!savedTemplates.length) {
    return (
      <div className="my-templates-page">
        <div className="my-templates-header">
          <h1>My Templates</h1>
          <p>Every template you customize and save appears here.</p>
        </div>
        <div className="my-portfolio-empty">
          <h2>No saved templates yet</h2>
          <p>Choose a template, edit it in the builder, and click Save. Each template you save will show up in this list.</p>
          <div className="my-portfolio-empty-actions">
            <Link to="/templates" className="btn-primary">
              Browse Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-templates-page">
      <div className="my-templates-header">
        <h1>My Templates</h1>
        <p>
          {savedTemplates.length} saved template{savedTemplates.length !== 1 ? 's' : ''} with your
          customizations.
        </p>
      </div>

      <div className="my-templates-grid">
        {savedTemplates.map(({ templateId, draft }, index) => {
          const template = getTemplateById(templateId);
          const title = draft.content?.name || template?.name || 'Untitled';
          const subtitle = template?.name || templateId;

          return (
            <motion.article
              key={templateId}
              className="my-template-card"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link to={getSavedTemplatePath(templateId)} className="my-template-card-preview">
                {template ? (
                  <TemplateThumbnail template={template} />
                ) : (
                  <div className="my-template-card-placeholder" style={{ background: '#111' }} />
                )}
                <span className="my-template-card-overlay">View</span>
              </Link>

              <div className="my-template-card-body">
                <div className="my-template-card-meta">
                  <h3>{title}</h3>
                  <p>{subtitle}</p>
                  <span className="my-template-card-date">{formatSavedAt(draft.savedAt)}</span>
                </div>
                <div className="my-template-card-actions">
                  <Link to={getSavedTemplatePath(templateId)} className="btn-ghost my-template-card-btn">
                    View
                  </Link>
                  <button
                    type="button"
                    className="btn-ghost my-template-card-btn"
                    onClick={() => navigate('/builder', { state: { templateId } })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-ghost my-template-card-btn my-template-card-btn--danger"
                    onClick={() => handleDelete(templateId, subtitle)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
