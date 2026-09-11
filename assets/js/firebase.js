// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9_X-DULVSJSPMvlEbRYHhE25HydPuLd8",
  authDomain: "sky-trinity.firebaseapp.com",
  projectId: "sky-trinity",
  storageBucket: "sky-trinity.firebasestorage.app",
  messagingSenderId: "366633250349",
  appId: "1:366633250349:web:0b34dd35f37d156de352a4",
  measurementId: "G-N596V0S4SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);