// =====================================
// G THE GENIUS
// DASHBOARD JS
// PART 1
// =====================================


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===============================
// DOM
// ===============================


const studentName =

document.getElementById("studentName");


const studentDistrict =

document.getElementById("studentDistrict");


const userXP =

document.getElementById("userXP");


const userLevel =

document.getElementById("userLevel");


const xpProgress =

document.getElementById("xpProgress");





// ===============================
// ADMIN UID
// ===============================


const ADMIN_UID = "YOUR_ADMIN_UID";





// ===============================
// LOAD USER
// ===============================


onAuthStateChanged(auth,async(user)=>{


if(!user){


window.location.href="login.html";

return;


}



const userRef =

doc(db,"students",user.uid);



const snap =

await getDoc(userRef);



if(snap.exists()){


const data=snap.data();



if(studentName)

studentName.innerHTML=data.name;



if(studentDistrict)

studentDistrict.innerHTML=
"📍 "+data.district;



let xp=data.xp || 0;



let level=Math.floor(xp/50)+1;



if(userXP)

userXP.innerHTML=xp;



if(userLevel)

userLevel.innerHTML=level;



let progress=

(xp%50)/50*100;



if(xpProgress)

xpProgress.style.width=

progress+"%";



}



});

// =====================================
// G THE GENIUS
// DASHBOARD JS
// PART 2 FINAL
// =====================================



// ===============================
// DAILY MOTIVATION
// ===============================


const quotes = [


"வெற்றி என்பது தினசரி செய்யும் சிறிய முயற்சிகளின் பலன்.",


"இன்று படிக்கும் நேரம் நாளைய வெற்றியை உருவாக்கும்.",


"தோல்வியை பயப்படாதீர்கள், முயற்சியை மட்டும் நிறுத்தாதீர்கள்.",


"உங்கள் இலக்கு Selection என்றால் உங்கள் முயற்சி தினமும் தொடர வேண்டும்.",


"ஒவ்வொரு Mock Test-மும் உங்கள் வெற்றிக்கான ஒரு படி.",


"கனவு + உழைப்பு = வெற்றி."


];



const quoteBox =

document.getElementById("dailyQuote");



if(quoteBox){


const today = new Date().getDate();


quoteBox.innerHTML =

quotes[today % quotes.length];


}





// ===============================
// ADMIN LINK CONTROL
// ===============================


const adminLink =

document.getElementById("adminLink");



if(adminLink){


onAuthStateChanged(auth,(user)=>{


if(user && user.uid === ADMIN_UID){


adminLink.style.display="block";


}

else{


adminLink.style.display="none";


}


});


}





// ===============================
// TEST START
// ===============================


window.startTest=function(type){


window.location.href =

"mocktest.html?type="+type;


}





console.log(

"G THE GENIUS DASHBOARD LOADED"

);

