// =========================
// G THE GENIUS ADMIN LOGIN JS
// =========================


import { auth, db } from "./firebase-config.js";


import {

signInWithEmailAndPassword,
onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// =========================
// ADMIN LOGIN
// =========================


const loginBtn =

document.getElementById(
"adminLoginBtn"
);





if(loginBtn){



loginBtn.onclick = async ()=>{



let email =

document.getElementById(
"adminEmail"
).value;





let password =

document.getElementById(
"adminPassword"
).value;





let errorBox =

document.getElementById(
"loginError"
);






try{



errorBox.innerHTML="";





const result =

await signInWithEmailAndPassword(

auth,

email,

password

);






const user =

result.user;






// CHECK ADMIN DATA


const adminRef =

doc(

db,

"admins",

user.uid

);






const adminSnap =

await getDoc(adminRef);







if(

adminSnap.exists()

){



localStorage.setItem(

"isAdmin",

"true"

);



window.location.href =

"admin.html";



}

else{



errorBox.innerHTML =

"❌ You are not an Admin";



auth.signOut();



}



}





catch(error){



console.log(

error

);



errorBox.innerHTML =

"❌ Invalid Email or Password";



}



};



}








// =========================
// AUTO CHECK
// =========================


onAuthStateChanged(

auth,

async(user)=>{



if(!user) return;






const adminRef =

doc(

db,

"admins",

user.uid

);






const snap =

await getDoc(adminRef);





if(

snap.exists()

){



console.log(

"Admin Verified"

);



}



});







console.log(

"✅ Admin Login System Ready"

);
