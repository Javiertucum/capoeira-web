const admin = require('firebase-admin');

async function testPush() {
  try {
    // 1. Initialize Firebase Admin
    const serviceAccount = require('./service-account.json');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();
    
    // 2. Get all users with FCM tokens
    const usersSnap = await db.collection('users').get();
    const tokens = [];
    usersSnap.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) {
        tokens.push({ uid: doc.id, token: data.fcmToken });
      }
    });

    console.log(`Found ${tokens.length} users with push tokens.`);

    if (tokens.length === 0) {
      console.log('No tokens found to test.');
      process.exit(0);
    }

    // 3. Send test notification to Expo
    const messages = tokens.map(t => ({
      to: t.token,
      title: "Test Script",
      body: "Testing FCM Configuration",
    }));

    console.log('Sending to Expo Push API...');
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Expo Response:');
    console.log(JSON.stringify(result, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
}

testPush();
