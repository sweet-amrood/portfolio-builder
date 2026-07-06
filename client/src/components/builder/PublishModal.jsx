import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { portfolioAPI } from '../../services/api';
import { normalizeSlug, slugFromName, getPublicPortfolioUrl } from '../../utils/portfolioSlug';
import '../../styles/publish-modal.css';

export default function PublishModal({ open, onClose, onPublished, templateId, getSnapshot, user }) {
  const defaultSlug = useMemo(
    () => user?.portfolioSlug || slugFromName(user?.name) || 'portfolio',
    [user?.portfolioSlug, user?.name]
  );

  const [slugInput, setSlugInput] = useState(defaultSlug);
  const [checking, setChecking] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [publishedUrl, setPublishedUrl] = useState('');

  const normalizedSlug = useMemo(() => normalizeSlug(slugInput), [slugInput]);
  const previewUrl = normalizedSlug ? getPublicPortfolioUrl(normalizedSlug) : '';

  const checkSlug = useCallback(async (slug) => {
    const normalized = normalizeSlug(slug);
    if (!normalized) {
      setAvailability({ available: false, reason: 'Portfolio name is required' });
      setSuggestions([]);
      return;
    }

    setChecking(true);
    try {
      const { data } = await portfolioAPI.checkSlug(normalized);
      setAvailability({
        available: data.available,
        owned: data.owned,
        reason: data.reason,
      });
      setSuggestions(data.suggestions || []);
    } catch {
      setAvailability({ available: false, reason: 'Could not verify availability' });
      setSuggestions([]);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setSlugInput(defaultSlug);
    setPublishedUrl('');
    setAvailability(null);
    setSuggestions([]);
    return undefined;
  }, [open, defaultSlug]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => {
      checkSlug(slugInput);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [open, slugInput, checkSlug]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && !publishing) onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, publishing]);

  const handlePublish = async () => {
    const snapshot = getSnapshot();
    if (!snapshot?.content) {
      toast.error('Nothing to publish');
      return;
    }

    setPublishing(true);
    try {
      const { data } = await portfolioAPI.publish({
        slug: normalizedSlug,
        templateId: snapshot.templateId || templateId,
        content: snapshot.content,
        sectionOrder: snapshot.sectionOrder,
        themeId: snapshot.themeId,
      });

      setPublishedUrl(data.publicUrl);
      toast.success('Portfolio published');
      onPublished?.(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Could not publish portfolio';
      const nextSuggestions = error.response?.data?.suggestions;
      if (nextSuggestions?.length) {
        setSuggestions(nextSuggestions);
      }
      toast.error(message);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };

  if (!open) return null;

  const canPublish =
    Boolean(normalizedSlug) &&
    availability?.available &&
    !checking &&
    !publishing &&
    !publishedUrl;

  return (
    <AnimatePresence>
      <motion.div
        className="publish-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !publishing && onClose()}
      >
        <motion.div
          className="publish-modal"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="publish-modal-close"
            onClick={onClose}
            disabled={publishing}
            aria-label="Close"
          >
            ×
          </button>

          <h2>Publish Portfolio</h2>
          <p className="publish-modal-lead">
            Choose your public portfolio name. Only one template can be live at a time.
          </p>

          {publishedUrl ? (
            <div className="publish-modal-success">
              <span className="publish-modal-success-label">Your portfolio is live</span>
              <a href={publishedUrl} target="_blank" rel="noreferrer" className="publish-modal-url">
                {publishedUrl}
              </a>
              <div className="publish-modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCopy}>
                  Copy Link
                </button>
                <a href={publishedUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  View Live
                </a>
              </div>
            </div>
          ) : (
            <>
              <label className="publish-modal-field">
                <span>Portfolio name</span>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(event) => setSlugInput(event.target.value)}
                  placeholder="your-name"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>

              <div className="publish-modal-preview">
                <span>Public URL</span>
                <code>{previewUrl || '—'}</code>
              </div>

              <div
                className={[
                  'publish-modal-status',
                  checking ? 'publish-modal-status--checking' : '',
                  availability?.available ? 'publish-modal-status--ok' : availability ? 'publish-modal-status--bad' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {checking
                  ? 'Checking availability…'
                  : availability?.available
                    ? availability.owned
                      ? 'This is your current portfolio name'
                      : 'Name is available'
                    : availability?.reason || 'Enter a portfolio name'}
              </div>

              {suggestions.length ? (
                <div className="publish-modal-suggestions">
                  <span>Suggested names</span>
                  <div className="publish-modal-suggestion-list">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="publish-modal-suggestion"
                        onClick={() => setSlugInput(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="publish-modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={publishing}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePublish}
                  disabled={!canPublish}
                >
                  {publishing ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
