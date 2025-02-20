require("dotenv").config();

const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT);

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

    const incomes = [];
    const querySnapshot = await db.collection('incomes')
      .where('userId', '==', userId)
      .get();

    querySnapshot.forEach((doc) => {
      incomes.push({ id: doc.id, ...doc.data() });
    });

    return { statusCode: 200, body: JSON.stringify(incomes) };
  } catch (error) {
    console.error('Error getting incomes:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get incomes' }) };
  }
};