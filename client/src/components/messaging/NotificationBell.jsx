import { useEffect, useRef, useState } from 'react';
import { HiBell } from 'react-icons/hi2';
import { useMessaging } from '../../context/MessagingContext';
import { formatSavedAt } from '../../utils/builderPreviewDraft';

export default function NotificationBell() {
  const { unreadCount, conversations, refreshConversations, openMessenger } = useMessaging();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) refreshConversations();
  }, [open, refreshConversations]);

  useEffect(() => {
    const handleClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const recent = conversations.slice(0, 5);

  const handleOpenConversation = (conversationId) => {
    setOpen(false);
    openMessenger(conversationId);
  };

  const handleOpenMessenger = () => {
    setOpen(false);
    openMessenger();
  };

  return (
    <div className="nav-notifications" ref={panelRef}>
      <button
        type="button"
        className="nav-notifications-btn"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
      >
        <HiBell size={20} />
        {unreadCount > 0 ? <span className="nav-notifications-badge">{unreadCount}</span> : null}
      </button>

      {open ? (
        <div className="nav-notifications-panel">
          <div className="nav-notifications-head">
            <strong>Messages</strong>
            {unreadCount > 0 ? <span>{unreadCount} unread</span> : null}
          </div>

          {recent.length ? (
            <div className="nav-notifications-list">
              {recent.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className="nav-notifications-item"
                  onClick={() => handleOpenConversation(conversation.id)}
                >
                  <strong>{conversation.visitorName}</strong>
                  <p>{conversation.lastMessage}</p>
                  <small>{formatSavedAt(conversation.lastMessageAt)}</small>
                  {conversation.unreadByOwner > 0 ? (
                    <span className="nav-notifications-item-badge">{conversation.unreadByOwner}</span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <p className="nav-notifications-empty">No messages yet.</p>
          )}

          <button type="button" className="nav-notifications-footer" onClick={handleOpenMessenger}>
            Open messaging
          </button>
        </div>
      ) : null}
    </div>
  );
}
