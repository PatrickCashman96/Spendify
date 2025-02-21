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
        const userId = decodedToken.uid; // Get the user ID from the token (important!)

        const data = JSON.parse(event.body);
        const incomeId = data.id; // Get the income ID from the request body
        const updatedIncomeData = { ...data }; // All updated fields
        delete updatedIncomeData.id; // Remove ID to prevent it from being written to Firestore.
        updatedIncomeData.userId = userId; // Ensure userId is always updated (important!)

        // Update the existing income document
        await db.collection('incomes').doc(incomeId).update(updatedIncomeData);

        return { statusCode: 200}; // 200 OK for update

    } catch (error) {
        console.error('Error updating income:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
    }
};