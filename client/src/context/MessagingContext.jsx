import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { messagesAPI } from '../services/api';
import { getSocketUrl } from '../utils/socketUrl';
import {
  ensureNotificationPermission,
  notifyIncomingMessage,
  shouldNotifyIncoming,
} from '../utils/pushNotifications';

const MessagingContext = createContext(null);

export function MessagingProvider({ children }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [lastIncomingMessage, setLastIncomingMessage] = useState(null);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [messengerMinimized, setMessengerMinimized] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const socketRef = useRef(null);
  const messengerMinimizedRef = useRef(true);
  const messengerOpenRef = useRef(false);
  const openMessengerRef = useRef(null);

  const refreshStats = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await messagesAPI.getStats();
      setUnreadCount(data.unreadCount || 0);
      setConversationCount(data.conversationCount || 0);
    } catch {
    }
  }, [user]);

  const refreshConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const { data } = await messagesAPI.list();
      setConversations(data.conversations || []);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setConversationCount(0);
      setConversations([]);
      setMessengerOpen(false);
      setMessengerMinimized(true);
      setActiveConversationId(null);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return undefined;
    }

    refreshStats();
    refreshConversations();
    ensureNotificationPermission();

    const token = localStorage.getItem('token');
    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('inbox:stats', ({ unreadCount: nextUnread }) => {
      setUnreadCount(nextUnread || 0);
    });

    socket.on('message:new', ({ conversation, message }) => {
      if (message?.senderType === 'visitor') {
        const isChatActive = messengerOpenRef.current && !messengerMinimizedRef.current;
        notifyIncomingMessage({
          title: `Message from ${conversation?.visitorName || 'a visitor'}`,
          body: message.body,
          isChatActive,
          dedupeKey: message.id,
          onClick: () => openMessengerRef.current?.(conversation?.id),
        });
        if (shouldNotifyIncoming({ isChatActive })) {
          toast.success(`New message from ${conversation?.visitorName || 'a visitor'}`);
        }
      }
      setLastIncomingMessage({ conversation, message, at: Date.now() });
      setConversations((current) => {
        const existing = current.find((item) => item.id === conversation?.id);
        const next = existing
          ? current.map((item) => (item.id === conversation.id ? { ...item, ...conversation } : item))
          : [conversation, ...current];
        return [...next].sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      });
      refreshStats();
    });

    socket.on('conversation:updated', ({ conversation }) => {
      if (!conversation?.id) return;
      setConversations((current) => {
        const existing = current.find((item) => item.id === conversation.id);
        const next = existing
          ? current.map((item) => (item.id === conversation.id ? { ...item, ...conversation } : item))
          : [conversation, ...current];
        return [...next].sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      });
      refreshStats();
    });

    socket.on('conversation:read', ({ conversationId }) => {
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId ? { ...item, unreadByOwner: 0 } : item
        )
      );
      refreshStats();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, refreshStats, refreshConversations]);

  const joinConversation = useCallback((conversationId) => {
    socketRef.current?.emit('conversation:join', { conversationId });
  }, []);

  const openMessenger = useCallback((conversationId = null) => {
    setMessengerOpen(true);
    setMessengerMinimized(false);
    if (conversationId) setActiveConversationId(conversationId);
  }, []);

  openMessengerRef.current = openMessenger;
  messengerMinimizedRef.current = messengerMinimized;
  messengerOpenRef.current = messengerOpen;

  const closeMessenger = useCallback(() => {
    setMessengerOpen(false);
    setMessengerMinimized(true);
    setActiveConversationId(null);
  }, []);

  const minimizeMessenger = useCallback(() => {
    setMessengerMinimized(true);
  }, []);

  const toggleMessenger = useCallback(() => {
    if (messengerOpen && !messengerMinimized) {
      setMessengerMinimized(true);
      return;
    }
    setMessengerOpen(true);
    setMessengerMinimized(false);
  }, [messengerOpen, messengerMinimized]);

  const value = useMemo(
    () => ({
      unreadCount,
      conversationCount,
      conversations,
      loadingConversations,
      lastIncomingMessage,
      messengerOpen,
      messengerMinimized,
      activeConversationId,
      refreshStats,
      refreshConversations,
      joinConversation,
      openMessenger,
      closeMessenger,
      minimizeMessenger,
      toggleMessenger,
      setActiveConversationId,
    }),
    [
      unreadCount,
      conversationCount,
      conversations,
      loadingConversations,
      lastIncomingMessage,
      messengerOpen,
      messengerMinimized,
      activeConversationId,
      refreshStats,
      refreshConversations,
      joinConversation,
      openMessenger,
      closeMessenger,
      minimizeMessenger,
      toggleMessenger,
    ]
  );

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context) throw new Error('useMessaging must be used within MessagingProvider');
  return context;
}
