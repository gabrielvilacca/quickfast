import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Colocar o firebaseConfig do seu app aqui abaixo
const firebaseConfig = {
  apiKey: "AIzaSyCXG6qvG-DjGETyzWKT1sJD8EIhTF0JgI4",
  authDomain: "amazing-app-4bd76.firebaseapp.com",
  projectId: "amazing-app-4bd76",
  storageBucket: "amazing-app-4bd76.appspot.com",
  messagingSenderId: "848381787394",
  appId: "1:848381787394:web:de1323d670225f6205961b",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const db = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Timestamp
const timestamp = serverTimestamp();

// Google Sign In
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, timestamp, googleProvider };
