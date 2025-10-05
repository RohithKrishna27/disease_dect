import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBML8u0K9x3q6wjoLDIdm2YGqxSQZFZP_s",
  authDomain: "disese-dect.firebaseapp.com",
  projectId: "disese-dect",
  storageBucket: "disese-dect.firebasestorage.app",
  messagingSenderId: "1071520126561",
  appId: "1:1071520126561:web:3ff0d170738e2f6fa97c20"
};


const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export { app };