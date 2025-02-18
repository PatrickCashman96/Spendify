const admin = require("firebase-admin");

exports.handler = async(event, context)=>{
    if (!admin.apps.length){
        admin.initializeApp({
            credential: admin.credential.cert({
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    }
    const db = admin.firestore();

    try{
        const snapshot = await db.collection("incomes").get();
        let data = [];
        snapshot.forEach(doc => data.push({id:doc.id, ...doc.data()}));

        return{
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch(error){
        return{
            statusCode: 500,
            body: JSON.stringify({error: error.message})
        }
    }
}