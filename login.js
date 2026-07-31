// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// LOGIN JS
// PART 1 / 2
// ==========================================



// Firebase Config

import {

auth,
db

} from "./firebase-config.js";







// Firebase Auth Functions

import {

signInWithEmailAndPassword,
sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";







// Firestore Functions

import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";









// Login Form

const loginForm =
document.getElementById("loginForm");



const message =
document.getElementById("loginMessage");









// Login Submit


loginForm.addEventListener("submit", async(e)=>{


e.preventDefault();






// Get Values


const email =
document.getElementById("email").value.trim();



const password =
document.getElementById("password").value;









if(!email || !password){


message.innerHTML =
"Please enter email and password";


return;


}








message.innerHTML =
"Checking Login...";








try{


// Firebase Login


const userCredential =

await signInWithEmailAndPassword(

auth,

email,

password

);





const user =
userCredential.user;

  // ==========================================
// LOGIN SUCCESS + FORGOT PASSWORD
// PART 2 / 2
// ==========================================





// Get Student Data From Firestore


const studentRef = doc(

db,

"students",

user.uid

);



const studentSnap = await getDoc(studentRef);






if(studentSnap.exists()){


const studentData = studentSnap.data();



// Save Login User Data


localStorage.setItem(

"student",

JSON.stringify({

uid:user.uid,

name:studentData.name,

district:studentData.district,

email:studentData.email,

role:studentData.role


})

);






message.innerHTML =

"Login Successful 🎉";






setTimeout(()=>{


window.location.href="dashboard.html";


},1000);




}

else{


message.innerHTML =

"Student Profile Not Found";


}




}





catch(error){



console.error(error);




if(error.code === "auth/invalid-credential"){


message.innerHTML =

"Invalid Email or Password";


}



else if(error.code === "auth/user-not-found"){


message.innerHTML =

"User Not Found";


}



else{


message.innerHTML =

"Login Failed. Try Again";


}




}




});










// ==========================================
// FORGOT PASSWORD
// ==========================================


const forgotPassword =

document.getElementById("forgotPassword");






forgotPassword.addEventListener("click", async(e)=>{


e.preventDefault();




const email =

document.getElementById("email").value.trim();






if(!email){


message.innerHTML =

"Enter your email first";


return;


}






try{


await sendPasswordResetEmail(

auth,

email

);





message.innerHTML =

"Password reset email sent 📩";





}



catch(error){


console.error(error);


message.innerHTML =

"Reset failed. Check email";


}



});
