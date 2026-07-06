import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateThumbnail from './TemplateThumbnail';
import { getTemplatePreviewPath } from '../pages/TemplatePreview';

export default function TemplateActionModal({ template, onClose }) {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    setPreviewUrl(`${window.location.origin}${getTemplatePreviewPath(template.id)}`);
  }, [template.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleEdit = () => {
    navigate('/builder', { state: { templateId: template.id } });
  };

  const handlePreview = () => {
    window.open(getTemplatePreviewPath(template.id), '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="tpl-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`tpl-modal${template.built ? ' tpl-modal--built' : ''}`}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="tpl-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          <div className="tpl-modal-preview">
            <TemplateThumbnail template={template} size="large" />
          </div>

          <div className="tpl-modal-info">
            <div className="tpl-modal-tags">
              {template.tags.map((tag) => (
                <span key={tag} className="tpl-tag">{tag}</span>
              ))}
            </div>
            <h2>{template.name}</h2>
            <p>{template.description}</p>
            {previewUrl && (
              <p className="tpl-preview-link">
                Preview URL:{' '}
                <a href={previewUrl} target="_blank" rel="noreferrer">
                  {previewUrl}
                </a>
              </p>
            )}
            <div className="tpl-modal-actions">
              <button type="button" className="btn-secondary tpl-modal-btn" onClick={handlePreview}>
                Preview
              </button>
              <button type="button" className="btn-primary tpl-modal-btn" onClick={handleEdit}>
                Edit Template
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
