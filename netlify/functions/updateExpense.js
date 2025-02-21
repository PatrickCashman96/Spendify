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

        const data = JSON.parse(event.body);
        const expenseId = data.id;
        const updatedExpenseData = { ...data };
        delete updatedExpenseData.id;
        updatedExpenseData.userId = userId;

        await db.collection('expenses').doc(expenseId).update(updatedExpenseData);

        return { statusCode: 200 }; // Or return { statusCode: 200, body: JSON.stringify({ id: expenseId }) }; if needed

    } catch (error) {
        console.error('Error updating expense:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
    }
};
