import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscClose, VscEdit, VscHubot, VscSend } from 'react-icons/vsc';
import { vscodeStudioContent } from '../vscode-studio.content';

const DEFAULT_COPILOT = vscodeStudioContent.copilot;

function normalizeText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function findFaqMatch(query, faqs) {
  const normalized = normalizeText(query);
  if (!normalized) return null;

  const exact = faqs.find((item) => normalizeText(item.question) === normalized);
  if (exact) return exact;

  const partial = faqs.find((item) => {
    const q = normalizeText(item.question);
    return q.includes(normalized) || normalized.includes(q);
  });
  if (partial) return partial;

  const keyword = faqs.find((item) => {
    const q = normalizeText(item.question);
    const words = normalized.split(' ').filter((word) => word.length > 3);
    return words.some((word) => q.includes(word));
  });
  return keyword || null;
}

export function mergeCopilotConfig(copilot, displayName) {
  const fullName = displayName || 'John Doe';
  return {
    ...DEFAULT_COPILOT,
    ...copilot,
    assistantTitle: copilot?.assistantTitle || `${fullName.split(' ')[0]}'s AI Assistant`,
    welcomeTitle: copilot?.welcomeTitle || `Hi! I'm ${fullName.split(' ')[0]}'s Copilot 👋`,
    welcomeSubtitle:
      copilot?.welcomeSubtitle ||
      'Ask me anything about my projects, skills, experience, or achievements.',
    inputPlaceholder:
      copilot?.inputPlaceholder ||
      `Ask about ${fullName.split(' ')[0]}'s projects, experience, skills...`,
    disclaimer:
      copilot?.disclaimer ||
      `AI can make mistakes · Contact ${fullName.split(' ')[0]} directly for important info`,
    faqs: copilot?.faqs?.length ? copilot.faqs : DEFAULT_COPILOT.faqs,
  };
}

export default function CopilotPanel({
  copilot,
  copilotName,
  name,
  nameHighlight,
  workspaceName,
  siteTitle,
}) {
  const displayName = [name, nameHighlight].filter(Boolean).join(' ').trim() || 'John Doe';
  const config = useMemo(() => mergeCopilotConfig(copilot, displayName), [copilot, displayName]);
  const faqs = config.faqs;
  const firstName = displayName.split(' ')[0];

  const configKey = useMemo(
    () =>
      `${config.assistantTitle}::${config.welcomeTitle}::${faqs.map((item) => item.question).join('|')}`,
    [config.assistantTitle, config.welcomeTitle, faqs]
  );

  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [draft, setDraft] = useState('');
  const chatRef = useRef(null);
  const lastConfigKey = useRef(configKey);

  const workspaceLabel = `${siteTitle || 'portfolio'} • ${workspaceName || 'portfolio'}`;
  const canSend = draft.trim().length > 0;

  useEffect(() => {
    if (lastConfigKey.current === configKey) return;
    lastConfigKey.current = configKey;
    setMessages([]);
    setChatStarted(false);
    setDraft('');
  }, [configKey]);

  useEffect(() => {
    const node = chatRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, chatStarted]);

  const pushExchange = (question, answer) => {
    setChatStarted(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: answer },
    ]);
    setDraft('');
  };

  const handleAsk = (faq) => {
    pushExchange(faq.question, faq.answer);
  };

  const handleReset = () => {
    setMessages([]);
    setChatStarted(false);
    setDraft('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = draft.trim();
    if (!query) return;

    const match = findFaqMatch(query, faqs);
    if (match) {
      pushExchange(match.question, match.answer);
      return;
    }

    setChatStarted(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: query },
      {
        role: 'assistant',
        text: `Pick a suggested question to learn about ${firstName}'s projects, skills, experience, and contact info.`,
      },
    ]);
    setDraft('');
  };

  return (
    <aside className="vsc-copilot vsc-desktop-only" aria-label="Copilot">
      <div className="vsc-copilot-topbar">
        <div className="vsc-copilot-topbar-title">
          <span className="vsc-copilot-topbar-icon" aria-hidden="true">
            <VscHubot size={15} />
          </span>
          <span>{config.assistantTitle || copilotName || 'AI Assistant'}</span>
        </div>
        <div className="vsc-copilot-topbar-actions">
          <button type="button" className="vsc-copilot-icon-btn" aria-label="Edit" onClick={handleReset}>
            <VscEdit size={14} />
          </button>
          <button type="button" className="vsc-copilot-icon-btn" aria-label="Close" onClick={handleReset}>
            <VscClose size={14} />
          </button>
        </div>
      </div>

      <div className="vsc-copilot-workspace">
        <span className="vsc-copilot-workspace-label">WORKSPACE</span>
        <span className="vsc-copilot-workspace-pill">{workspaceLabel}</span>
      </div>

      <div className="vsc-copilot-body" ref={chatRef}>
        {!chatStarted ? (
          <div className="vsc-copilot-welcome">
            <div className="vsc-copilot-avatar" aria-hidden="true">
              <span className="vsc-copilot-avatar-face">☺</span>
            </div>
            <h3 className="vsc-copilot-welcome-title">{config.welcomeTitle}</h3>
            <p className="vsc-copilot-welcome-sub">{config.welcomeSubtitle}</p>
            <div className="vsc-copilot-grid">
              {faqs.map((faq) => (
                <button
                  key={faq.question}
                  type="button"
                  className="vsc-copilot-grid-chip"
                  onClick={() => handleAsk(faq)}
                >
                  <span className="vsc-copilot-grid-chip-icon" aria-hidden="true">
                    ✦
                  </span>
                  <span>{faq.question}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="vsc-copilot-thread">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}-${message.text.slice(0, 16)}`}
                  className={`vsc-copilot-bubble vsc-copilot-bubble--${message.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {message.role === 'assistant' && (
                    <span className="vsc-copilot-bubble-label">✦ Copilot</span>
                  )}
                  <p>{message.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <form className="vsc-copilot-foot" onSubmit={handleSubmit}>
        <div className="vsc-copilot-compose">
          <input
            type="text"
            className="vsc-copilot-input-field"
            placeholder={config.inputPlaceholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Ask Copilot"
          />
          <button
            type="submit"
            className="vsc-copilot-send"
            disabled={!canSend}
            aria-label="Send message"
          >
            <VscSend size={14} />
          </button>
        </div>
        <p className="vsc-copilot-disclaimer">{config.disclaimer}</p>
      </form>
    </aside>
  );
}
