import { useCallback, useEffect, useRef, useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { messagesAPI } from '../../services/api';
import { useMessaging } from '../../context/MessagingContext';
import { formatSavedAt } from '../../utils/builderPreviewDraft';
import { getChatBubbleClass } from '../../utils/chatBubble';

function formatTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessengerPanel({ compact = false }) {
  const {
    conversations,
    loadingConversations,
    refreshConversations,
    joinConversation,
    lastIncomingMessage,
    activeConversationId,
    setActiveConversationId,
  } = useMessaging();

  const [messages, setMessages] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [showList, setShowList] = useState(true);
  const threadRef = useRef(null);

  const activeId = activeConversationId;

  const scrollToBottom = useCallback(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, []);

  const loadConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      setLoadingThread(true);
      try {
        const { data } = await messagesAPI.getConversation(conversationId);
        setMessages(data.messages || []);
        joinConversation(conversationId);
        await refreshConversations();
      } catch {
        toast.error('Could not load conversation');
      } finally {
        setLoadingThread(false);
      }
    },
    [joinConversation, refreshConversations]
  );

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    if (activeId) {
      loadConversation(activeId);
      if (compact) setShowList(false);
    }
  }, [activeId, loadConversation, compact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!lastIncomingMessage?.message || !activeId) return;
    if (lastIncomingMessage.conversation?.id !== activeId) return;
    setMessages((current) => {
      if (current.some((item) => item.id === lastIncomingMessage.message.id)) return current;
      return [...current, lastIncomingMessage.message];
    });
  }, [lastIncomingMessage, activeId]);

  const handleSelect = (conversationId) => {
    setActiveConversationId(conversationId);
    setMessages([]);
    if (compact) setShowList(false);
  };

  const handleBack = () => {
    setShowList(true);
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleReply = async (event) => {
    event.preventDefault();
    if (!activeId || !reply.trim()) return;

    setSending(true);
    try {
      const { data } = await messagesAPI.reply(activeId, reply.trim());
      setMessages((current) => {
        if (current.some((item) => item.id === data.message.id)) return current;
        return [...current, data.message];
      });
      setReply('');
      await refreshConversations();
    } catch {
      toast.error('Could not send reply');
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((item) => item.id === activeId);

  if (compact && !showList && activeId) {
    return (
      <div className="messenger-panel messenger-panel--thread-only">
        <header className="messenger-panel-thread-head">
          <button type="button" className="messenger-panel-back" onClick={handleBack}>
            ←
          </button>
          <div>
            <strong>{activeConversation?.visitorName}</strong>
            <span>{activeConversation?.visitorEmail}</span>
          </div>
        </header>

        {loadingThread ? (
          <div className="dashboard-chat-empty dashboard-chat-empty--thread">Loading messages…</div>
        ) : (
          <>
            <div className="dashboard-chat-messages chat-thread" ref={threadRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={getChatBubbleClass(message.senderType, 'owner')}
                >
                  <p>{message.body}</p>
                  <small>{formatTime(message.createdAt)}</small>
                </div>
              ))}
            </div>

            <form className="dashboard-chat-compose" onSubmit={handleReply}>
              <input
                type="text"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Type your reply…"
                disabled={sending}
              />
              <button type="submit" disabled={sending || !reply.trim()} aria-label="Send reply">
                <HiPaperAirplane size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="messenger-panel messenger-panel--list-only">
        {loadingConversations ? (
          <p className="dashboard-chat-empty">Loading conversations…</p>
        ) : conversations.length ? (
          <div className="dashboard-chat-items">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`dashboard-chat-item${activeId === conversation.id ? ' dashboard-chat-item--active' : ''}`}
                onClick={() => handleSelect(conversation.id)}
              >
                <div className="dashboard-chat-item-top">
                  <strong>{conversation.visitorName}</strong>
                  {conversation.unreadByOwner > 0 ? (
                    <span className="dashboard-chat-unread">{conversation.unreadByOwner}</span>
                  ) : null}
                </div>
                <span className="dashboard-chat-item-email">{conversation.visitorEmail}</span>
                <p>{conversation.lastMessage}</p>
                <small>{formatSavedAt(conversation.lastMessageAt)}</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="dashboard-chat-empty">No messages yet. Visitors can message you from your live portfolio.</p>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-chat">
      <aside className="dashboard-chat-list">
        <div className="dashboard-chat-list-head">
          <strong>Conversations</strong>
          <span>{conversations.length}</span>
        </div>

        {loadingConversations ? (
          <p className="dashboard-chat-empty">Loading conversations…</p>
        ) : conversations.length ? (
          <div className="dashboard-chat-items">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`dashboard-chat-item${activeId === conversation.id ? ' dashboard-chat-item--active' : ''}`}
                onClick={() => handleSelect(conversation.id)}
              >
                <div className="dashboard-chat-item-top">
                  <strong>{conversation.visitorName}</strong>
                  {conversation.unreadByOwner > 0 ? (
                    <span className="dashboard-chat-unread">{conversation.unreadByOwner}</span>
                  ) : null}
                </div>
                <span className="dashboard-chat-item-email">{conversation.visitorEmail}</span>
                <p>{conversation.lastMessage}</p>
                <small>{formatSavedAt(conversation.lastMessageAt)}</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="dashboard-chat-empty">No messages yet. Visitors can message you from your live portfolio.</p>
        )}
      </aside>

      <section className="dashboard-chat-thread">
        {!activeId ? (
          <div className="dashboard-chat-empty dashboard-chat-empty--thread">
            Select a conversation to start chatting.
          </div>
        ) : loadingThread ? (
          <div className="dashboard-chat-empty dashboard-chat-empty--thread">Loading messages…</div>
        ) : (
          <>
            <header className="dashboard-chat-thread-head">
              <div>
                <strong>{activeConversation?.visitorName}</strong>
                <span>{activeConversation?.visitorEmail}</span>
              </div>
              <small>Last active {formatTime(activeConversation?.lastMessageAt)}</small>
            </header>

            <div className="dashboard-chat-messages chat-thread" ref={threadRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={getChatBubbleClass(message.senderType, 'owner')}
                >
                  <p>{message.body}</p>
                  <small>{formatTime(message.createdAt)}</small>
                </div>
              ))}
            </div>

            <form className="dashboard-chat-compose" onSubmit={handleReply}>
              <input
                type="text"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Type your reply…"
                disabled={sending}
              />
              <button type="submit" disabled={sending || !reply.trim()} aria-label="Send reply">
                <HiPaperAirplane size={18} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
