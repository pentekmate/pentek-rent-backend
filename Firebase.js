// firebase.js

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');


const serviceAccount = require('./accountKey.json');

const initializeFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
};

initializeFirebase(); // Firebase inicializálása

const getDatabase = () => {
    return getFirestore();
};

const db = getDatabase(); // Firestore adatbázis objektum inicializálása

module.exports = { db }; // db objektum exportálása
