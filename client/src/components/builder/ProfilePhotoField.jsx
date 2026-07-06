import { useRef, useState } from 'react';
import { readProfileImage } from '../../utils/profileImage';

export default function ProfilePhotoField({ content, onChange }) {
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
      const dataUrl = await readProfileImage(file);
      onChange({ profileImage: dataUrl });
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="builder-profile-photo">
      <p className="builder-item-block-title">Profile photo</p>

      <div className="builder-profile-photo-row">
        <div className={`builder-profile-photo-preview${content.profileImage ? '' : ' builder-profile-photo-preview--empty'}`}>
          {content.profileImage ? (
            <img src={content.profileImage} alt={content.name || 'Profile preview'} />
          ) : (
            <span>{(content.name || 'JD').trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()}</span>
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
          {content.profileImage && (
            <button
              type="button"
              className="btn-ghost builder-profile-photo-btn"
              onClick={() => onChange({ profileImage: null })}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="profile-image-url">Image URL</label>
        <input
          id="profile-image-url"
          value={content.profileImage?.startsWith('data:') ? '' : content.profileImage || ''}
          onChange={(e) => onChange({ profileImage: e.target.value || null })}
          placeholder="https://..."
        />
      </div>

      {error && <p className="builder-profile-photo-error">{error}</p>}
    </div>
  );
}
