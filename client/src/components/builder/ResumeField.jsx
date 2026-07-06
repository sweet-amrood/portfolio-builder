import { useRef, useState } from 'react';
import { readResumeFile, isUploadedResume } from '../../utils/resumeFile';

export default function ResumeField({ resume, onChange, inputId = 'link-resume' }) {
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const uploaded = isUploadedResume(resume);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const dataUrl = await readResumeFile(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="builder-resume-field">
      <p className="builder-item-block-title">Resume</p>

      <div className="builder-resume-row">
        <div className={`builder-resume-preview${uploaded ? ' builder-resume-preview--ready' : ''}`}>
          <span className="builder-resume-icon" aria-hidden="true">PDF</span>
          <span className="builder-resume-status">
            {uploaded ? 'Resume.pdf uploaded' : 'No resume uploaded'}
          </span>
        </div>

        <div className="builder-profile-photo-actions">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="builder-profile-photo-input"
            onChange={handleFile}
          />
          <button
            type="button"
            className="btn-secondary builder-profile-photo-btn"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
          {resume && (
            <button type="button" className="btn-ghost builder-profile-photo-btn" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${inputId}-url`}>Or paste resume URL</label>
        <input
          id={`${inputId}-url`}
          value={uploaded ? '' : resume || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://drive.google.com/... or https://yoursite.com/resume.pdf"
        />
      </div>

      {error && <p className="builder-profile-photo-error">{error}</p>}
    </div>
  );
}
