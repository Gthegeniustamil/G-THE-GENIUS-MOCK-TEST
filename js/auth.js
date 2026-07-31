// ===========================================================
// G THE GENIUS
// AUTH.JS
// PART 1
// ===========================================================

import { auth, db } from "./firebase-config.js";
import {

signInWithEmailAndPassword,

createUserWithEmailAndPassword,

onAuthStateChanged,

sendPasswordResetEmail,

setPersistence,

browserLocalPersistence,

browserSessionPersistence

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

doc,

setDoc,

serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===========================================================
// DOM
// ===========================================================

const email=document.getElementById("email");

const password=document.getElementById("password");

const loginForm=document.getElementById("loginForm");

const loginBtn=document.getElementById("loginBtn");

const rememberMe=document.getElementById("rememberMe");

const showPassword=document.getElementById("showPassword");



// ===========================================================
// AUTO LOGIN
// ===========================================================

onAuthStateChanged(auth,(user)=>{

if(user){

window.location.href="dashboard.html";

}

});



// ===========================================================
// SHOW PASSWORD
// ===========================================================

if(showPassword){

showPassword.addEventListener("change",()=>{

password.type=

showPassword.checked

?

"text"

:

"password";

});

}



// ===========================================================
// LOGIN
// ===========================================================

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

loginBtn.disabled=true;

loginBtn.innerHTML="Please Wait...";

try{

await setPersistence(

auth,

rememberMe.checked

?

browserLocalPersistence

:

browserLocalPersistence

);

await signInWithEmailAndPassword(

auth,

email.value.trim(),

password.value

);

alert("Login Successful");

window.location.href="dashboard.html";

}

catch(error){

alert(error.message);

}

finally{

loginBtn.disabled=false;

loginBtn.innerHTML="🔐 Login";

}

});

// ===========================================================
// AUTH.JS
// PART 2
// ===========================================================


// ===========================================================
// EMAIL VALIDATION
// ===========================================================

function isValidEmail(emailAddress){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailAddress
    );

}



// ===========================================================
// LOGIN VALIDATION
// ===========================================================

function validateLogin(){

    if(email.value.trim()===""){

        alert("Enter Email Address");

        email.focus();

        return false;

    }

    if(!isValidEmail(email.value.trim())){

        alert("Enter Valid Email");

        email.focus();

        return false;

    }

    if(password.value.trim()===""){

        alert("Enter Password");

        password.focus();

        return false;

    }

    if(password.value.length<6){

        alert("Password must be at least 6 characters");

        password.focus();

        return false;

    }

    return true;

}



// ===========================================================
// FORGOT PASSWORD
// ===========================================================

const forgotLink=

document.querySelector(
'a[href="forgot-password.html"]'
);

if(forgotLink){

forgotLink.addEventListener("click",async(e)=>{

e.preventDefault();

const mail=prompt(

"Enter your registered Email"

);

if(!mail) return;

try{

await sendPasswordResetEmail(

auth,

mail.trim()

);

alert(

"Password reset email sent successfully."

);

}

catch(error){

alert(error.message);

}

});

}



// ===========================================================
// ENTER KEY SUPPORT
// ===========================================================

password.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

loginForm.requestSubmit();

}

});



// ===========================================================
// AUTO FOCUS
// ===========================================================

window.addEventListener("load",()=>{

email.focus();

});



// ===========================================================
// CONNECTION CHECK
// ===========================================================

if(!navigator.onLine){

alert(

"No Internet Connection"

);

  }

// ===========================================================
// AUTH.JS
// PART 3 (FINAL)
// ===========================================================


// ===========================================================
// REMEMBER ME PERSISTENCE
// ===========================================================

async function applyPersistence(){

    if(rememberMe.checked){

        await setPersistence(

            auth,

            browserLocalPersistence

        );

    }

    else{

        await setPersistence(

            auth,

            browserSessionPersistence

        );

    }

}



// ===========================================================
// LOGIN BUTTON OVERRIDE
// ===========================================================

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(!validateLogin()) return;

    try{

        loginBtn.disabled=true;

        loginBtn.textContent="Signing In...";

        await applyPersistence();

        await signInWithEmailAndPassword(

            auth,

            email.value.trim(),

            password.value

        );

        window.location.replace("dashboard.html");

    }

    catch(error){

        let message="Login Failed";

        switch(error.code){

            case "auth/invalid-credential":
                message="Invalid Email or Password";
                break;

            case "auth/user-not-found":
                message="Account not found";
                break;

            case "auth/wrong-password":
                message="Wrong Password";
                break;

            case "auth/too-many-requests":
                message="Too many attempts. Try again later.";
                break;

            case "auth/network-request-failed":
                message="No Internet Connection";
                break;
        }

        alert(message);

    }

    finally{

        loginBtn.disabled=false;

        loginBtn.innerHTML="🔐 Login";

    }

});



// ===========================================================
// PREVENT BACK AFTER LOGIN
// ===========================================================

history.pushState(null,null,location.href);

window.onpopstate=function(){

    history.go(1);

};



// ===========================================================
// APP READY
// ===========================================================

console.log("AUTH MODULE LOADED");

// ===========================================================
// REGISTER FUNCTION
// ===========================================================


const registerForm =
document.getElementById("registerForm");


if(registerForm){


registerForm.addEventListener("submit",async(e)=>{


e.preventDefault();



const name =
document.getElementById("name").value.trim();


const district =
document.getElementById("district").value;


const regEmail =
document.getElementById("email").value.trim();


const regPassword =
document.getElementById("password").value;


const confirmPassword =
document.getElementById("confirmPassword").value;


const message =
document.getElementById("registerMessage");



if(regPassword !== confirmPassword){

message.innerHTML="❌ Password mismatch";

return;

}



try{


const userCredential =

await createUserWithEmailAndPassword(

auth,

regEmail,

regPassword

);



const user =
userCredential.user;



await setDoc(

doc(db,"students",user.uid),

{

uid:user.uid,

name:name,

district:district,

email:regEmail,

xp:0,

level:1,

testsAttempted:0,

totalScore:0,

joinedAt:serverTimestamp()

}

);



message.innerHTML=

"✅ Registration Successful";


setTimeout(()=>{

window.location.href="login.html";

},2000);



}


catch(error){

message.innerHTML=

"❌ "+error.message;

}


});


}

