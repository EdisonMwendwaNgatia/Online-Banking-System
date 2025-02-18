// src/firebase/firebaseService.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, signInWithEmailAndPassword, createUserWithEmailAndPassword };
