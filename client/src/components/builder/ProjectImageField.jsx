import { useRef, useState } from 'react';
import { readProjectImage } from '../../utils/profileImage';

export default function ProjectImageField({ image, title, onChange }) {
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const dataUrl = await readProjectImage(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="builder-profile-photo builder-project-image">
      <p className="builder-item-block-title">Project image</p>

      <div className="builder-profile-photo-row">
        <div className={`builder-profile-photo-preview builder-project-image-preview${image ? '' : ' builder-profile-photo-preview--empty'}`}>
          {image ? (
            <img src={image} alt={title || 'Project preview'} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="builder-profile-photo-actions">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="builder-profile-photo-input"
            onChange={handleFile}
          />
          <button
            type="button"
            className="btn-secondary builder-profile-photo-btn"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload image'}
          </button>
          {image && (
            <button type="button" className="btn-ghost builder-profile-photo-btn" onClick={() => onChange(null)}>
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`project-image-url-${title || 'item'}`}>Image URL</label>
        <input
          id={`project-image-url-${title || 'item'}`}
          value={image?.startsWith('data:') ? '' : image || ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://..."
        />
      </div>

      {error && <p className="builder-profile-photo-error">{error}</p>}
    </div>
  );
}
