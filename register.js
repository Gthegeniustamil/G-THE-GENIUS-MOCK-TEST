// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// REGISTER JS
// PART 1 / 2
// ==========================================



// Firebase Config

import { 
    auth, 
    db 
} from "./firebase-config.js";





// Firebase Auth Functions

import {

createUserWithEmailAndPassword,
updateProfile

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





// Firestore Functions

import {

doc,
setDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";








// Register Form

const registerForm = document.getElementById("registerForm");



const message = document.getElementById("registerMessage");









registerForm.addEventListener("submit", async (e)=>{


e.preventDefault();






// Get Values


const name = document.getElementById("name").value.trim();


const district = document.getElementById("district").value;


const email = document.getElementById("email").value.trim();


const password = document.getElementById("password").value;


const confirmPassword = document.getElementById("confirmPassword").value;








// Empty Check


if(
!name ||
!district ||
!email ||
!password ||
!confirmPassword
){


message.innerHTML =
"Please fill all details";


return;


}







// Password Check


if(password !== confirmPassword){


message.innerHTML =
"Password does not match";


return;


}







// Password Strength


if(password.length < 6){


message.innerHTML =
"Password minimum 6 characters";


return;


}







message.innerHTML =
"Creating Account...";

// ==========================================
// REGISTER FIREBASE CREATE
// PART 2 / 2
// ==========================================


try{


// Create Firebase Authentication User


const userCredential = await createUserWithEmailAndPassword(

auth,

email,

password

);



const user = userCredential.user;







// Update User Display Name


await updateProfile(user,{

displayName:name

});









// Save Student Data In Firestore


await setDoc(

doc(
db,
"students",
user.uid
),

{


uid:user.uid,


name:name,


district:district,


email:email,


role:"student",


totalMarks:0,


rank:0,


testsCompleted:0,


createdAt:serverTimestamp()



}

);









// Success Message


message.innerHTML =

"Account Created Successfully 🎉";






// Redirect To Login


setTimeout(()=>{


window.location.href="login.html";


},1500);









}



catch(error){



console.error(error);





if(error.code === "auth/email-already-in-use"){


message.innerHTML =
"Email already registered";


}



else if(error.code === "auth/invalid-email"){


message.innerHTML =
"Invalid Email Address";


}



else if(error.code === "auth/weak-password"){


message.innerHTML =
"Password is too weak";


}



else{


message.innerHTML =
"Registration Failed. Try Again";


}



}



});                              
