// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js
// import { initializeApp, credential, firestore } from "firebase-admin";
import firebase from 'firebase-admin';
// If keys are lost:
// 1) Need to generate new ones from firebase console -> Project settings -> Service accounts
// 2) Delete old ones from GCP IAM & Admin page -> Service accounts -> firebase-adminsdk -> Keys
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