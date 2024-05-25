import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1aQTKdftg5j7jLASTQ1DhmK-vREzmrKA",
  authDomain: "final-app-81a23.firebaseapp.com",
  projectId: "final-app-81a23",
  storageBucket: "final-app-81a23.appspot.com",
  messagingSenderId: "750600929408",
  appId: "1:750600929408:web:cb57b1379222e609dca665",
  measurementId: "G-0V49TRRQX9",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services with custom names
export const FIREBASE_AUTH = auth;
export const FIRESTORE_DB = firestore;
export const STORAGE = storage;
