require("dotenv").config();

const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT);
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
    const incomeData = JSON.parse(event.body);
    incomeData.userId = userId;

    const newIncomeRef = await db.collection('incomes').add(incomeData); // Get DocumentReference
    const newIncomeDoc = await newIncomeRef.get(); // Get DocumentSnapshot
    const newIncome = { id: newIncomeDoc.id, ...newIncomeDoc.data() }; // Combine id and data

    return { statusCode: 201, body: JSON.stringify(newIncome) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
  }
};