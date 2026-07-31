// =====================================
// G THE GENIUS
// PREMIUM DASHBOARD JS
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
// DOM ELEMENTS
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
// LOAD STUDENT DATA
// ===============================


onAuthStateChanged(auth,async(user)=>{


if(!user){


window.location.href="login.html";

return;


}



try{


const userDoc =

await getDoc(

doc(db,"students",user.uid)

);



if(userDoc.exists()){


const data=userDoc.data();



if(studentName){

studentName.innerHTML =
data.name || "Student";

}



if(studentDistrict){

studentDistrict.innerHTML =
"📍 "+(data.district || "District");

}




let xp = data.xp || 0;



let level =

Math.floor(xp / 50)+1;



if(userXP){

userXP.innerHTML=xp;

}



if(userLevel){

userLevel.innerHTML=level;

}





let progress =

(xp % 50)/50*100;



if(xpProgress){

xpProgress.style.width=

progress+"%";

}



}



}

catch(error){


console.log(error);


}


});

// =====================================
// G THE GENIUS
// PREMIUM DASHBOARD JS
// PART 2 FINAL
// =====================================



// ===============================
// DAILY MOTIVATION
// ===============================


const motivationList = [


"வெற்றி என்பது தினமும் செய்யும் சிறிய முயற்சிகளின் முடிவு.",


"இன்று படிக்கும் ஒவ்வொரு நிமிடமும் நாளைய வெற்றியை உருவாக்கும்.",


"முயற்சி செய்பவர்களுக்கு மட்டுமே வெற்றி கிடைக்கும்.",


"Mock Test எழுதுங்கள்... உங்கள் Selection கனவை நெருங்குங்கள்.",


"கடின உழைப்பு + சரியான பயிற்சி = அரசு வேலை."


];



const quoteBox =

document.getElementById("dailyQuote");



if(quoteBox){


let day = new Date().getDate();


quoteBox.innerHTML =

motivationList[day % motivationList.length];


}





// ===============================
// ADMIN SECURITY
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
// START TEST
// ===============================


window.startTest = function(type){


window.location.href =

"mocktest.html?type="+type;


}





// ===============================
// APP READY
// ===============================


console.log(

"G THE GENIUS PREMIUM DASHBOARD READY"

);
