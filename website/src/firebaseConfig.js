// All the docs for transitioning: https://firebase.google.com/docs/build
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Initialize Firebase
const firebaseApp = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
getAnalytics(firebaseApp);

export {
    auth,
    signInAnonymously,
    onAuthStateChanged,
    updateProfile,
    firestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    Timestamp,
}