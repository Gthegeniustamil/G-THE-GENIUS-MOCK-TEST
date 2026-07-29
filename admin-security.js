// =========================
// G THE GENIUS ADMIN SECURITY
// PART 1
// =========================


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";








// =========================
// CHECK ADMIN ACCESS
// =========================


onAuthStateChanged(

auth,

async(user)=>{



if(!user){



window.location.href =

"admin-login.html";



return;


}


// =========================
// ADMIN PROFILE + LOGOUT
// PART 2
// =========================


import {

signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";








// =========================
// LOAD ADMIN DETAILS
// =========================


async function loadAdminDetails(){



const user =

auth.currentUser;



if(!user) return;






try{



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



let data = snap.data();






let nameBox =

document.getElementById(
"adminName"
);






let roleBox =

document.getElementById(
"adminRole"
);






if(nameBox){



nameBox.innerHTML =

data.name || "Admin";



}






if(roleBox){



roleBox.innerHTML =

data.role || "Administrator";



}



}



}



catch(error){



console.log(

"Admin Data Error",

error

);



}



}








// =========================
// ADMIN LOGOUT
// =========================


const logoutBtn =

document.getElementById(
"adminLogoutBtn"
);





if(logoutBtn){



logoutBtn.onclick = async ()=>{



try{



await signOut(auth);




localStorage.removeItem(

"isAdmin"

);






window.location.href =

"admin-login.html";



}



catch(error){



console.log(

"Logout Error",

error

);



}



};



}








// =========================
// SESSION STATUS
// =========================


function showAdminStatus(){



let status =

document.getElementById(
"adminStatus"
);





if(status){



status.innerHTML =

"🟢 Admin Session Active";



}



}








// =========================
// START
// =========================


auth.onAuthStateChanged(

(user)=>{



if(user){



loadAdminDetails();



showAdminStatus();



}



});






console.log(

"✅ Admin Security Final Ready"

);
  



try{



const adminRef =

doc(

db,

"admins",

user.uid

);






const adminSnap =

await getDoc(adminRef);






if(

!adminSnap.exists()

){



alert(

"❌ Admin Access Denied"

);



await auth.signOut();





window.location.href =

"index.html";



return;



}





console.log(

"✅ Admin Verified"

);



}



catch(error){



console.log(

"Security Error",

error

);



window.location.href =

"index.html";



}



});
