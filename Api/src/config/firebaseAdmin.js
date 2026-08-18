const admin = require('firebase-admin');

// Two ways to supply the service account, pick whichever fits your
// deployment:
//
//  1) FIREBASE_SERVICE_ACCOUNT_JSON — the whole service account JSON
//     pasted as a single-line string env var. Easiest on platforms
//     like Railway where you can't commit a file but can set env vars.
//
//  2) FIREBASE_SERVICE_ACCOUNT_PATH — a path to the JSON file on disk,
//     for local development (keep the file out of git — see .gitignore).
//
// Get this file from: Firebase Console → Project Settings →
// Service Accounts → Generate new private key.
// NEVER commit this file or paste its contents anywhere public — it
// grants full admin access to your Firebase project.

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  }
  return null;
}

const serviceAccount = loadServiceAccount();

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.warn(
    '[firebaseAdmin] No FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH set. ' +
      'Token verification will fail on every request until this is configured. ' +
      'See src/config/firebaseAdmin.js for setup instructions.',
  );
}

module.exports = admin;
