import { HiChatBubbleLeftRight, HiChevronDown, HiXMark } from 'react-icons/hi2';
import { useMessaging } from '../../context/MessagingContext';
import MessengerPanel from './MessengerPanel';

export default function FloatingMessenger() {
  const {
    unreadCount,
    conversationCount,
    messengerOpen,
    messengerMinimized,
    openMessenger,
    closeMessenger,
    minimizeMessenger,
    toggleMessenger,
  } = useMessaging();

  if (!messengerOpen && messengerMinimized) {
    return (
      <div className="floating-messenger floating-messenger--dock">
        <button
          type="button"
          className="floating-messenger-launcher"
          onClick={() => openMessenger()}
          aria-label="Open messaging"
        >
          <HiChatBubbleLeftRight size={22} />
          <span>Messaging</span>
          {unreadCount > 0 ? <em>{unreadCount}</em> : null}
        </button>
      </div>
    );
  }

  if (messengerMinimized) {
    return (
      <div className="floating-messenger floating-messenger--dock">
        <button
          type="button"
          className="floating-messenger-launcher"
          onClick={toggleMessenger}
          aria-label="Expand messaging"
        >
          <HiChatBubbleLeftRight size={22} />
          <span>Messaging</span>
          {unreadCount > 0 ? <em>{unreadCount}</em> : null}
        </button>
      </div>
    );
  }

  return (
    <div className="floating-messenger floating-messenger--open">
      <header className="floating-messenger-head">
        <div>
          <strong>Messaging</strong>
          <small>{conversationCount} conversation{conversationCount !== 1 ? 's' : ''}</small>
        </div>
        <div className="floating-messenger-actions">
          <button type="button" onClick={minimizeMessenger} aria-label="Minimize messaging">
            <HiChevronDown size={18} />
          </button>
          <button type="button" onClick={closeMessenger} aria-label="Close messaging">
            <HiXMark size={18} />
          </button>
        </div>
      </header>
      <MessengerPanel compact />
    </div>
  );
}
