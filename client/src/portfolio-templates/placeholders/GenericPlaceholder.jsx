export default function GenericPlaceholder({ template, preview = false }) {
  return (
    <div className={`generic-placeholder${preview ? ' generic-placeholder--preview' : ''}`}>
      <div className="generic-placeholder-nav" />
      <div className="generic-placeholder-hero" style={{ background: template?.accent || '#6366f1' }} />
      <div className="generic-placeholder-lines">
        <span /><span /><span />
      </div>
      <div className="generic-placeholder-grid">
        <span /><span /><span />
      </div>
      <p className="generic-placeholder-label">{template?.name || 'Template'} — coming soon</p>
    </div>
  );
}
