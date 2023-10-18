import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// TODO: Colocar o firebaseConfig do seu app aqui abaixo
const firebaseConfig = {
  apiKey: "AIzaSyAGHixNK8LcQsQVlq0ahKE8lkKWI9KzN5M",
  authDomain: "projeto-teste-405b3.firebaseapp.com",
  projectId: "projeto-teste-405b3",
  storageBucket: "projeto-teste-405b3.appspot.com",
  messagingSenderId: "306468732119",
  appId: "1:306468732119:web:148ed7ea0bfe3495828492",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// TODO: Descomentar código abaixo após ativar o App Check

// const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaV3Provider("abcdefghijklmnopqrstuvwxy-1234567890abcd"), // TODO: Colocar a chave do seu reCAPTCHA v3
//   isTokenAutoRefreshEnabled: true,
// });

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
