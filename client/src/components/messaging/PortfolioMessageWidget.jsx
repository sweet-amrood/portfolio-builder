import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { HiChatBubbleLeftRight, HiPaperAirplane, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { messagesAPI, analyticsAPI } from '../../services/api';
import { getVisitorId } from '../../utils/portfolioAnalytics';
import { getChatBubbleClass } from '../../utils/chatBubble';
import { getSocketUrl } from '../../utils/socketUrl';
import {
  saveVisitorSession,
  loadVisitorSession,
  clearVisitorSession,
} from '../../utils/visitorSession';
import {
  ensureNotificationPermission,
  notifyIncomingMessage,
} from '../../utils/pushNotifications';

function formatTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PortfolioMessageWidget({ slug, ownerName }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [visitorToken, setVisitorToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  const [reply, setReply] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const threadRef = useRef(null);
  const socketRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  const scrollToBottom = useCallback(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, []);

  const applyThread = useCallback((data) => {
    setVisitorToken(data.visitorToken);
    setMessages(data.messages || []);
    setName(data.conversation?.visitorName || '');
    setEmail(data.conversation?.visitorEmail || '');
    setUnreadCount(data.conversation?.unreadByVisitor || 0);
    saveVisitorSession(slug, {
      token: data.visitorToken,
      name: data.conversation?.visitorName,
      email: data.conversation?.visitorEmail,
    });
  }, [slug]);

  const loadThread = useCallback(
    async (token, { silent = false } = {}) => {
      if (!token) return false;
      if (!silent) setLoading(true);
      try {
        const { data } = await messagesAPI.getVisitorThread(token);
        applyThread(data);
        return true;
      } catch {
        clearVisitorSession(slug);
        setVisitorToken('');
        setMessages([]);
        setUnreadCount(0);
        return false;
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [slug, applyThread]
  );

  const resumeByEmail = useCallback(
    async (visitorEmail) => {
      if (!visitorEmail?.trim()) return false;
      setLoading(true);
      try {
        const { data } = await messagesAPI.resumePublic({ slug, email: visitorEmail.trim() });
        applyThread(data);
        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [slug, applyThread]
  );

  useEffect(() => {
    let active = true;

    const restore = async () => {
      const { token, profile } = loadVisitorSession(slug);
      if (profile?.name) setName(profile.name);
      if (profile?.email) setEmail(profile.email);

      if (token) {
        const ok = await loadThread(token);
        if (!active) return;
        if (ok) return;
      }

      if (profile?.email) {
        await resumeByEmail(profile.email);
      }
    };

    restore();
    return () => {
      active = false;
    };
  }, [slug, loadThread, resumeByEmail]);

  useEffect(() => {
    if (!visitorToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return undefined;
    }

    const socket = io(getSocketUrl(), {
      auth: { visitorToken },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    const onMessage = ({ message, conversation }) => {
      if (!message || message.senderType !== 'owner') return;
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
      const isChatActive = openRef.current;
      if (!openRef.current) {
        setUnreadCount((count) => count + 1);
      } else {
        setUnreadCount(0);
      }
      if (conversation?.unreadByVisitor !== undefined) {
        setUnreadCount(openRef.current ? 0 : conversation.unreadByVisitor);
      }
      notifyIncomingMessage({
        title: ownerName ? `Reply from ${ownerName.split(' ')[0]}` : 'New reply',
        body: message.body,
        isChatActive,
        dedupeKey: message.id,
        onClick: () => setOpen(true),
      });
    };

    socket.on('message:new', onMessage);

    return () => {
      socket.off('message:new', onMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [visitorToken, ownerName]);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [messages, open, scrollToBottom]);

  const handleStartChat = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    await ensureNotificationPermission();
    setSending(true);
    try {
      const { data } = await messagesAPI.sendPublic(slug, {
        name: name.trim(),
        email: email.trim(),
        message: draft.trim(),
        visitorToken: visitorToken || undefined,
      });

      saveVisitorSession(slug, {
        token: data.visitorToken,
        name: name.trim(),
        email: email.trim(),
      });

      applyThread({
        visitorToken: data.visitorToken,
        messages: data.message ? [data.message] : [],
        conversation: data.conversation,
      });
      setDraft('');
      toast.success('Message sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    if (!reply.trim() || !visitorToken) return;

    const body = reply.trim();
    setSending(true);
    try {
      const { data } = await messagesAPI.replyPublic({
        visitorToken,
        message: body,
      });
      const sent = data?.message;
      if (sent) {
        setMessages((current) => {
          if (current.some((item) => item.id === sent.id)) return current;
          return [...current, sent];
        });
      } else {
        await loadThread(visitorToken, { silent: true });
      }
      setReply('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const title = ownerName ? `Message ${ownerName.split(' ')[0]}` : 'Send a message';

  return (
    <div className="portfolio-message-widget">
      {open ? (
        <div className="portfolio-message-panel">
          <header className="portfolio-message-panel-head">
            <div>
              <strong>{title}</strong>
              <small>Real-time chat with the portfolio owner</small>
            </div>
            <button type="button" className="portfolio-message-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <HiXMark size={18} />
            </button>
          </header>

          {loading ? (
            <div className="portfolio-message-empty">Loading conversation…</div>
          ) : messages.length ? (
            <>
              <div className="portfolio-message-thread chat-thread" ref={threadRef}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={getChatBubbleClass(message.senderType, 'visitor')}
                  >
                    <p>{message.body}</p>
                    <small>{formatTime(message.createdAt)}</small>
                  </div>
                ))}
              </div>
              <form className="portfolio-message-compose" onSubmit={handleReply}>
                <input
                  type="text"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a reply…"
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !reply.trim()} aria-label="Send reply">
                  <HiPaperAirplane size={18} />
                </button>
              </form>
            </>
          ) : (
            <form className="portfolio-message-start" onSubmit={handleStartChat}>
              <label>
                <span>Your name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  disabled={sending}
                />
              </label>
              <label>
                <span>Your email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={sending}
                />
              </label>
              <label>
                <span>Message</span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  required
                  disabled={sending}
                />
              </label>
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? 'Sending…' : 'Start conversation'}
              </button>
            </form>
          )}
        </div>
      ) : null}

      <button
        type="button"
        className="portfolio-message-fab"
        onClick={async () => {
          await ensureNotificationPermission();
          setOpen((value) => {
            const next = !value;
            if (next) {
              setUnreadCount(0);
              analyticsAPI.track(slug, {
                type: 'click',
                label: 'message-fab',
                visitorId: getVisitorId(),
              }).catch(() => {});
            }
            return next;
          });
        }}
        aria-label="Open messages"
      >
        <HiChatBubbleLeftRight size={22} />
        <span>Message</span>
        {unreadCount > 0 ? <em className="portfolio-message-fab-badge">{unreadCount}</em> : null}
      </button>
    </div>
  );
}
