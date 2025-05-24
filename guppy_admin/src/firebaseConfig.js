// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Add this for Firebase Storage

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5TTP44cA6gNHoin-zACjWXFDLQEncx-k",
  authDomain: "fish-85648.firebaseapp.com",
  projectId: "fish-85648",
  storageBucket: "fish-85648.appspot.com",  // ✅ Corrected
  messagingSenderId: "205393549602",
  appId: "1:205393549602:web:67a1b6332928437a8f6d7b",
  measurementId: "G-L07C43HFL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // ✅ Add this for Firebase Storage

// Export Firebase instances
export { auth, db, storage };
