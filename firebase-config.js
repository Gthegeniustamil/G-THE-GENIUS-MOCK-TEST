// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// FIREBASE CONFIGURATION
// ==========================================


// Firebase App

import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



// Firestore Database

import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// Firebase Authentication

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





// Firebase Project Configuration

const firebaseConfig = {


    apiKey: "AIzaSyBm0H6zoQ-ogjS7buDPqQKIhc29cqXVmew",


    authDomain: "g-the-genius.firebaseapp.com",


    projectId: "g-the-genius",


    storageBucket: "g-the-genius.firebasestorage.app",


    messagingSenderId: "472076249930",


    appId: "1:472076249930:web:79f3af16e5ca078e866fb3"


};






// Initialize Firebase

const app = initializeApp(firebaseConfig);






// Export Services

export const db = getFirestore(app);


export const auth = getAuth(app);





console.log(
"G THE GENIUS Firebase v5.0 Connected"
);
