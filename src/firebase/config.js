import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// TODO: Colocar o firebaseConfig do seu app aqui abaixo
const firebaseConfig = {
  apiKey: "AIzaSyApW1MC8AmfPJKlLVlcC7UIQ6DgLmiDo2c",
  authDomain: "despesa-simples-9dd5c.firebaseapp.com",
  projectId: "despesa-simples-9dd5c",
  storageBucket: "despesa-simples-9dd5c.appspot.com",
  messagingSenderId: "973196288735",
  appId: "1:973196288735:web:4804ee9537eaed084abf6a",
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
