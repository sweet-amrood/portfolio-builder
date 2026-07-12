let audioContext = null;
let permissionRequested = false;
let lastAlertKey = '';
let lastAlertAt = 0;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.26);
  } catch {
  }
}

export async function ensureNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  if (permissionRequested) return false;
  permissionRequested = true;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

export function shouldNotifyIncoming({ isChatActive }) {
  if (typeof document !== 'undefined' && document.hidden) return true;
  return !isChatActive;
}

export function showSystemNotification({ title, body, onClick }) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!document.hidden) return;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/logo.png',
      tag: 'portfolioforge-message',
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
      onClick?.();
    };
  } catch {
  }
}

export function notifyIncomingMessage({
  title,
  body,
  isChatActive = false,
  onClick,
  dedupeKey = '',
}) {
  if (!shouldNotifyIncoming({ isChatActive })) return;

  const key = dedupeKey || `${title}:${body}`;
  const now = Date.now();
  if (key === lastAlertKey && now - lastAlertAt < 1500) return;
  lastAlertKey = key;
  lastAlertAt = now;

  playNotificationSound();
  showSystemNotification({ title, body, onClick });
}
