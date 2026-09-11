import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9_X-DULVSJSPMvlEbRYHhE25HydPuLd8",
  authDomain: "sky-trinity.firebaseapp.com",
  projectId: "sky-trinity",
  storageBucket: "sky-trinity.firebasestorage.app",
  messagingSenderId: "366633250349",
  appId: "1:366633250349:web:0b34dd05f37d156b351a4",
  measurementId: "G-N596V8S4SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore DB එක මෙතැනින් export කලා
export const googleProvider = new GoogleAuthProvider();