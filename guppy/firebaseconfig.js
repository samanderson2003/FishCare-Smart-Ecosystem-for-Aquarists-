// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5TTP44cA6gNHoin-zACjWXFDLQEncx-k",
  authDomain: "fish-85648.firebaseapp.com",
  projectId: "fish-85648",
  storageBucket: "fish-85648.appspot.com",
  messagingSenderId: "205393549602",
  appId: "1:205393549602:web:67a1b6332928437a8f6d7b",
  measurementId: "G-L07C43HFL7"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with React Native Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase instances
export { auth, db, storage };