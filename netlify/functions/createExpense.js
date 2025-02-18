require("dotenv").config();

const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    // Verify Auth
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Interact with Firestore via UserID
    const expenseData = JSON.parse(event.body);
    expenseData.userId = userId;
    const newExpense = await db.collection('expenses').add(expenseData);

    return { statusCode: 201, body: JSON.stringify({ id: newExpense.id }) };
  } catch (error) {
    console.error('Error creating expense:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create expense' }) };
  }
};
