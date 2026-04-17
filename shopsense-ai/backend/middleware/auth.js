let adminApp = null;

function getAdmin() {
  if (adminApp) return adminApp;
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;

      if (serviceAccount) {
        adminApp = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      } else {
        adminApp = admin.initializeApp({ credential: admin.credential.applicationDefault() });
      }
    } else {
      adminApp = admin.apps[0];
    }
    return adminApp;
  } catch (err) {
    console.error('Firebase Admin init failed:', err.message);
    return null;
  }
}

async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — missing token' });
  }

  const token = header.slice(7);

  try {
    const admin = require('firebase-admin');
    getAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized — invalid token' });
  }
}

module.exports = { verifyToken };
