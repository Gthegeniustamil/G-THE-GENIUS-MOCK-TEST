// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm0H6zoQ-ogjS7buDPqQKIhc29cqXVmew",
  authDomain: "g-the-genius.firebaseapp.com",
  projectId: "g-the-genius",
  storageBucket: "g-the-genius.firebasestorage.app",
  messagingSenderId: "472076249930",
  appId: "1:472076249930:web:f96a883b2560e65f866fb3",
  measurementId: "G-3VJ996095J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
