import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TEMPLATE_TAGS, TEMPLATES } from '../data/templates';
import TemplateThumbnail from '../components/TemplateThumbnail';
import TemplateActionModal from '../components/TemplateActionModal';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function Templates() {
  const [activeTag, setActiveTag] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filtered =
    activeTag === 'All'
      ? TEMPLATES.filter((t) => !t.ai)
      : TEMPLATES.filter((t) => !t.ai && t.tags.includes(activeTag));

  return (
    <div className="templates-page">
      <div className="templates-header">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Choose a Template</h1>
          <p>Pick a starting point for your portfolio. Preview any template or jump straight into the editor.</p>
          <Link to="/create" className="templates-ai-cta">
            Or build with AI →
          </Link>
        </motion.div>
      </div>

      <div className="templates-tags">
        {TEMPLATE_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag-filter${activeTag === tag ? ' tag-filter--active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="templates-count">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</p>

      <div className="templates-grid">
        {filtered.map((template, i) => (
          <motion.button
            key={template.id}
            type="button"
            className="template-card-item"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="template-card-preview">
              <TemplateThumbnail template={template} />
              <div className="template-card-overlay">
                <span>View options</span>
              </div>
            </div>
            <div className="template-card-meta">
              <h3>{template.name}</h3>
              <div className="template-card-tags">
                {template.tags.map((tag) => (
                  <span key={tag} className="tpl-tag tpl-tag--sm">{tag}</span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedTemplate && (
        <TemplateActionModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}
