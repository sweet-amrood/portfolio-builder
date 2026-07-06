export function getChatBubbleClass(senderType, viewerRole) {
  const isMine = senderType === viewerRole;
  return `chat-bubble chat-bubble--${isMine ? 'mine' : 'theirs'}`;
}
