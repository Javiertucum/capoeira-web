const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

async function checkTokens() {
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    process.exit(1);
  }

  const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) acc[match[1]] = match[2].replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    return acc;
  }, {});

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY
      })
    });
  }

  const db = getFirestore();
  const snap = await db.collection('users').get();
  
  console.log('--- TOKENS IN FIRESTORE ---');
  snap.forEach(doc => {
    const data = doc.data();
    if (data.fcmToken) {
      console.log(`User: ${data.displayName || doc.id} | Token: ${data.fcmToken.substring(0, 30)}... | Updated: ${data.updatedAt ? data.updatedAt.toDate() : 'unknown'}`);
    }
  });
  console.log('---------------------------');
}

checkTokens().catch(console.error);
