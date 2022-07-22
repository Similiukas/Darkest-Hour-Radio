// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js
// import { initializeApp, credential, firestore } from "firebase-admin";
import firebase from 'firebase-admin';

import serviceAccount from "../../config/firebaseAccountKey.json" assert { type: "json" };

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();
const FieldValue = firebase.firestore.FieldValue;

export {
    db,
    FieldValue
};