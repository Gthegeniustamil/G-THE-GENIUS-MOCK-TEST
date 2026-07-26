// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBm0H6zoQ-ogjS7buDPqQKIhc29cqXVmew",
  authDomain: "g-the-genius.firebaseapp.com",
  projectId: "g-the-genius",
  storageBucket: "g-the-genius.firebasestorage.app",
  messagingSenderId: "472076249930",
  appId: "1:472076249930:web:f96a883b2560e65f866fb3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
