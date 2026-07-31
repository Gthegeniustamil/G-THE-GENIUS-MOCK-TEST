// =====================================
// G THE GENIUS
// DASHBOARD JS
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


const studentName =
document.getElementById("studentName");


const profileName =
document.getElementById("profileName");


const profileDistrict =
document.getElementById("profileDistrict");


const xpText =
document.getElementById("xp");


const levelText =
document.getElementById("level");


const testsText =
document.getElementById("testsAttempted");


const scoreText =
document.getElementById("totalScore");


const xpProgress =
document.getElementById("xpProgress");




// =====================================
// AUTH CHECK + LOAD PROFILE
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



studentName.innerHTML =
data.name;


profileName.innerHTML =
data.name;


profileDistrict.innerHTML =
"📍 "+data.district;


xpText.innerHTML =
data.xp || 0;


levelText.innerHTML =
data.level || 1;


testsText.innerHTML =
data.testsAttempted || 0;


scoreText.innerHTML =
data.totalScore || 0;



}


}



catch(error){


console.log(
"Dashboard Load Error:",
error
);


}



});

// =====================================
// DASHBOARD JS
// PART 2
// =====================================



// =====================================
// XP PROGRESS BAR
// =====================================


function updateXPProgress(xp){


let currentXP = xp || 0;


let nextLevelXP = 100;



let percentage =

(currentXP / nextLevelXP) * 100;



if(percentage > 100){

percentage = 100;

}



if(xpProgress){

xpProgress.style.width =

percentage + "%";

}



const progressText =

document.getElementById("progressText");



if(progressText){

progressText.innerHTML =

currentXP + " / " + nextLevelXP + " XP";

}


}




// =====================================
// START MOCK TEST
// =====================================


window.startTest = function(type){



if(type==="daily"){


window.location.href=

"mocktest.html?type=daily";


}



else if(type==="weekly"){


window.location.href=

"mocktest.html?type=weekly";


}



else if(type==="monthly"){


window.location.href=

"mocktest.html?type=monthly";


}



};




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
// DASHBOARD JS
// PART 3 FINAL
// =====================================



// =====================================
// LEVEL SYSTEM
// =====================================


function calculateLevel(xp){


let level =

Math.floor(xp / 100) + 1;


return level;


}




// =====================================
// UPDATE LEVEL DISPLAY
// =====================================


async function updateStudentLevel(user){


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


const currentXP =

data.xp || 0;



const newLevel =

calculateLevel(currentXP);



if(levelText){

levelText.innerHTML =

newLevel;

}



updateXPProgress(currentXP);



}



}


catch(error){


console.log(

"Level Update Error",

error

);


}



}




// =====================================
// PROFILE BUTTON
// =====================================


const profileBtn =

document.querySelector(

".menu-card:nth-child(2)"

);



if(profileBtn){


profileBtn.addEventListener("click",()=>{


window.location.href="profile.html";


});


}




// =====================================
// PAGE READY
// =====================================


window.addEventListener(

"load",

()=>{


console.log(

"Dashboard Loaded Successfully"

);


}

);
// ===============================
// DAILY MOTIVATION QUOTES
// ===============================

const quotes = [

"வெற்றி என்பது முயற்சியை ஒருபோதும் கைவிடாதவர்களுக்கு மட்டுமே கிடைக்கும்.",

"இன்று படிக்கும் ஒரு மணி நேரம் நாளைய வெற்றியை உருவாக்கும்.",

"தோல்வி என்பது முடிவு அல்ல, மீண்டும் முயற்சி செய்யும் வாய்ப்பு.",

"கனவு காணுங்கள், திட்டமிடுங்கள், தினமும் உழையுங்கள்.",

"ஒவ்வொரு Mock Test-மும் உங்களை Selection-க்கு அருகில் கொண்டு செல்லும்."

];


const quoteBox = document.getElementById("dailyQuote");


if(quoteBox){

let today = new Date().getDate();

let quoteIndex = today % quotes.length;

quoteBox.innerHTML = quotes[quoteIndex];

}
