// =====================================
// G THE GENIUS
// PROFILE JS
// PART 1
// =====================================


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged,
signOut

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =====================================
// DOM ELEMENTS
// =====================================


const userName =
document.getElementById("userName");


const userDistrict =
document.getElementById("userDistrict");


const userEmail =
document.getElementById("userEmail");


const userXP =
document.getElementById("userXP");


const userLevel =
document.getElementById("userLevel");


const userTests =
document.getElementById("userTests");


const userScore =
document.getElementById("userScore");




// =====================================
// LOAD PROFILE DATA
// =====================================


onAuthStateChanged(auth, async(user)=>{


if(!user){


window.location.href="login.html";

return;


}



try{


const userRef =

doc(

db,

"students",

user.uid

);



const userSnap =

await getDoc(userRef);



if(userSnap.exists()){


const data = userSnap.data();



userName.innerHTML =
data.name || "Student";


userDistrict.innerHTML =
"📍 " + (data.district || "");


userEmail.innerHTML =
"📧 " + user.email;



userXP.innerHTML =
data.xp || 0;



userLevel.innerHTML =
data.level || 1;



userTests.innerHTML =
data.testsAttempted || 0;



userScore.innerHTML =
data.totalScore || 0;



}



}

catch(error){


console.log(

"Profile Load Error",

error

);


}



});

// =====================================
// G THE GENIUS
// PROFILE JS
// PART 2 FINAL
// =====================================



// =====================================
// LOGOUT
// =====================================


const logoutBtn =

document.getElementById("logoutBtn");



if(logoutBtn){


logoutBtn.addEventListener("click",async()=>{


try{


await signOut(auth);


window.location.href="login.html";


}


catch(error){


alert(

"Logout Failed"

);


}


});


}




// =====================================
// TEST HISTORY PLACEHOLDER
// =====================================


const historyBox =

document.getElementById("testHistory");



if(historyBox){


historyBox.innerHTML = `

<div class="history-item">

<p>📝 No test history available</p>

<p>Start your first mock test!</p>

</div>

`;



}




// =====================================
// PROFILE READY
// =====================================


console.log(

"G THE GENIUS PROFILE LOADED"

);

