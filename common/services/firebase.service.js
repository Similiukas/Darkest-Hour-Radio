// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js
const admin = require("firebase-admin");

const serviceAccount = require("../../config/firebaseAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = {
    db,
    FieldValue
};