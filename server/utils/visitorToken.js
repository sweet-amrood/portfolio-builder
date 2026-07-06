import jwt from 'jsonwebtoken';

export function signVisitorToken(conversationId) {
  return jwt.sign(
    { conversationId: String(conversationId), role: 'visitor' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyVisitorToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== 'visitor' || !decoded.conversationId) {
    throw new Error('Invalid visitor token');
  }
  return decoded;
}
