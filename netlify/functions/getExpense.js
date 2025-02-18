const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const expenses = [];
    const querySnapshot = await db.collection('expenses')
      .where('userId', '==', userId)
      .get();

    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });

    return { statusCode: 200, body: JSON.stringify(expenses) };
  } catch (error) {
    console.error('Error getting expenses:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get expenses' }) };
  }
};