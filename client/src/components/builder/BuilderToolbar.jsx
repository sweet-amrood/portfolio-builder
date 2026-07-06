import { Link } from 'react-router-dom';
import {
  HiArrowLeft,
  HiArrowUturnLeft,
  HiArrowUturnRight,
  HiCloudArrowUp,
  HiEye,
  HiFolderOpen,
} from 'react-icons/hi2';

export default function BuilderToolbar({
  templateName,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onPreview,
  onPublish,
  onMyTemplates,
  onImportProfile,
}) {
  const statusLabel =
    saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'saved'
        ? 'All changes saved'
        : saveStatus === 'autosaved'
          ? 'Auto-saved'
          : 'Unsaved changes';

  const statusClass =
    saveStatus === 'unsaved'
      ? 'builder-v2-status--warn'
      : saveStatus === 'saving'
        ? 'builder-v2-status--busy'
        : 'builder-v2-status--ok';

  return (
    <header className="builder-v2-toolbar">
      <div className="builder-v2-toolbar-start">
        <Link to="/templates" className="builder-v2-back" title="Back to templates">
          <HiArrowLeft size={18} />
        </Link>
        <div className="builder-v2-brand">
          <span className="builder-v2-brand-label">Portfolio Builder</span>
          <span className="builder-v2-brand-template">{templateName}</span>
        </div>
        <span className={`builder-v2-status ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="builder-v2-toolbar-center">
        <div className="builder-v2-history">
          <button
            type="button"
            className="builder-v2-icon-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <HiArrowUturnLeft size={18} />
          </button>
          <button
            type="button"
            className="builder-v2-icon-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <HiArrowUturnRight size={18} />
          </button>
        </div>
      </div>

      <div className="builder-v2-toolbar-end">
        <button type="button" className="builder-v2-btn builder-v2-btn--ghost" onClick={onImportProfile}>
          <span>Import profile</span>
        </button>
        <button type="button" className="builder-v2-btn builder-v2-btn--ghost" onClick={onMyTemplates}>
          <HiFolderOpen size={17} />
          <span>My Templates</span>
        </button>
        <button type="button" className="builder-v2-btn builder-v2-btn--ghost" onClick={onPreview}>
          <HiEye size={17} />
          <span>Preview</span>
        </button>
        <button type="button" className="builder-v2-btn builder-v2-btn--ghost" onClick={onSave}>
          <HiCloudArrowUp size={17} />
          <span>Save</span>
        </button>
        <button type="button" className="builder-v2-btn builder-v2-btn--primary" onClick={onPublish}>
          Publish
        </button>
      </div>
    </header>
  );
}
