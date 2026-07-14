import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiArrowRight, FiCpu, FiLoader, FiStar, FiZap } from 'react-icons/fi';
import { aiAPI } from '../services/api';
import { saveBuilderPreviewDraft } from '../utils/builderPreviewDraft';
import '../styles/ai-create.css';

const EXAMPLES = [
  'Dark cybersec portfolio with neon cyan accents, timeline experience, and case-study projects',
  'Clean light portfolio for a junior frontend developer who loves minimal design',
  'Bold creative portfolio for a product designer with strong typography and project storytelling',
];

export default function AiCreate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [useProfile, setUseProfile] = useState(true);
  const [mode, setMode] = useState('dark');
  const [generating, setGenerating] = useState(false);
  const [provider, setProvider] = useState('gemini');

  useEffect(() => {
    let active = true;
    aiAPI
      .getProvider()
      .then(({ data }) => {
        if (active && data?.provider) setProvider(data.provider);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (trimmed.length < 8) {
      toast.error('Write a bit more detail (at least 8 characters)');
      return;
    }

    setGenerating(true);
    try {
      const { data } = await aiAPI.generate({
        prompt: trimmed,
        useProfile,
        preferences: { mode },
      });

      saveBuilderPreviewDraft({
        templateId: data.templateId || 'ai-dynamic',
        content: data.content,
        sectionOrder: data.sectionOrder || [],
        themeId: data.themeId || (mode === 'light' ? 'ai-light' : 'ai-dark'),
      });

      toast.success(
        `Portfolio generated with ${data.provider || provider} — opening builder`
      );
      navigate('/builder', {
        state: {
          templateId: data.templateId || 'ai-dynamic',
          aiGenerated: true,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="ai-create-page">
      <motion.header
        className="ai-create-hero"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="ai-create-kicker">
          <FiStar /> Build with AI
        </p>
        <h1>Describe your portfolio. We’ll build it inside system limits.</h1>
        <p>
          Your prompt drives style and story. A fixed system prompt keeps every result editable in
          PortfolioForge. Active provider:{' '}
          <strong>{provider === 'mistral' ? 'Mistral (Devstral)' : 'Gemini'}</strong>
        </p>
      </motion.header>

      <div className="ai-create-layout">
        <section className="ai-create-panel">
          <label className="ai-create-label" htmlFor="ai-prompt">
            Your prompt
          </label>
          <textarea
            id="ai-prompt"
            rows={8}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Dark neon portfolio for a cybersecurity analyst with experience timeline, skill groups, and case-study projects…"
            disabled={generating}
          />

          <div className="ai-create-examples">
            <span>Try:</span>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                disabled={generating}
                onClick={() => setPrompt(example)}
              >
                {example}
              </button>
            ))}
          </div>

          <div className="ai-create-options">
            <label className="ai-create-check">
              <input
                type="checkbox"
                checked={useProfile}
                onChange={(e) => setUseProfile(e.target.checked)}
                disabled={generating}
              />
              Use my master profile data
            </label>

            <div className="ai-create-mode">
              <span>Theme bias</span>
              <div className="ai-create-mode-tabs">
                {['dark', 'light'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={mode === item ? 'is-active' : ''}
                    onClick={() => setMode(item)}
                    disabled={generating}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="ai-create-actions">
            <button
              type="button"
              className="ai-create-btn ai-create-btn--primary"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? <FiLoader className="ai-create-spin" /> : <FiZap />}
              {generating ? 'Generating…' : 'Generate portfolio'}
            </button>
            <Link to="/templates" className="ai-create-btn">
              Browse classic templates
            </Link>
          </div>
        </section>

        <aside className="ai-create-side">
          <div className="ai-create-card">
            <FiCpu />
            <h2>System-locked generation</h2>
            <p>
              A fixed system prompt forces Gemini to output only PortfolioForge-compatible JSON:
              allowed sections, split-hero layout, theme tokens, and builder-ready content fields.
            </p>
          </div>
          <div className="ai-create-card">
            <FiArrowRight />
            <h2>What happens next</h2>
            <ol>
              <li>AI generates your template data</li>
              <li>Opens in the builder for edits</li>
              <li>Publish with your normal live slug flow</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
