const admin = require('../config/firebaseAdmin');

// Verifies the Firebase ID token sent as `Authorization: Bearer <token>`.
// On success, attaches { uid, email } to req.user for downstream
// handlers/middleware to use. This is the only source of truth for
// "who is making this request" — never trust an email/userId the
// client puts in the request body for anything security-sensitive.
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
