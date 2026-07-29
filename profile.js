// =========================
// G THE GENIUS PROFILE JS
// PART 1
// =========================


import { auth, db } from "./firebase-config.js";


import {

doc,
getDoc,
collection,
query,
where,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// =========================
// LOAD PROFILE
// =========================


async function loadProfile(){



const user =

auth.currentUser;



if(!user){

console.log(
"User Not Login"
);

return;

}





try{


const userRef =

doc(

db,

"users",

user.uid

);




const snap =

await getDoc(userRef);





if(
snap.exists()
){


let data = snap.data();




document.getElementById(
"profileName"
).innerHTML =

data.name || "Student";





document.getElementById(
"profileDistrict"
).innerHTML =

data.district || "-";





localStorage.setItem(
"studentName",
data.name || "Student"
);




localStorage.setItem(
"district",
data.district || "-"
);



}






loadLevel();


loadStatistics();



}



catch(error){


console.log(
"Profile Error",
error
);


}



}








// =========================
// XP LEVEL SYSTEM
// =========================


function loadLevel(){



let xp =

Number(

localStorage.getItem(
"xp"

)

)||0;






let level =

Math.floor(
xp / 100

)+1;





let progress =

xp % 100;






document.getElementById(
"profileXP"
).innerHTML =

xp;






document.getElementById(
"profileLevel"
).innerHTML =

level;







document.getElementById(
"profileXPBar"
).style.width =

progress+"%";



}









// =========================
// LOAD STATISTICS
// =========================


async function loadStatistics(){



const user =

auth.currentUser;



if(!user) return;





const q = query(

collection(db,"results"),

where(
"studentId",
"==",
user.uid
)

);





const snap =

await getDocs(q);





let total = 0;


let totalScore = 0;


let best = 0;





snap.forEach(doc=>{


let data = doc.data();



total++;


totalScore +=

Number(data.score)||0;




if(

Number(data.percentage)>best

){


best =

Number(data.percentage);


}



});






document.getElementById(
"totalTests"
).innerHTML =

total;





document.getElementById(
"totalScore"
).innerHTML =

totalScore;





document.getElementById(
"bestPercentage"
).innerHTML =

best+"%";



}








// =========================
// AUTH START
// =========================


auth.onAuthStateChanged(

(user)=>{


if(user){


loadProfile();


}



});






console.log(

"✅ G THE GENIUS PROFILE READY"

);

// =========================
// BADGE SYSTEM
// =========================


function loadBadges(){


let xp =

Number(

localStorage.getItem("xp")

)||0;



let badges = [];





if(xp >= 100){

badges.push("🌱 Beginner");

}



if(xp >= 300){

badges.push("🔥 Active Learner");

}



if(xp >= 500){

badges.push("🏆 Test Master");

}



if(xp >= 1000){

badges.push("👑 Genius Champion");

}






let badgeBox =

document.getElementById(
"profileBadges"
);



if(!badgeBox) return;



badgeBox.innerHTML="";





if(badges.length===0){


badgeBox.innerHTML =

"<div class='badge-item'>⭐ Beginner</div>";

return;


}




badges.forEach(

badge=>{


let div =

document.createElement("div");



div.className =

"badge-item";



div.innerHTML =

badge;



badgeBox.appendChild(div);



}

);



localStorage.setItem(

"badges",

JSON.stringify(badges)

);



}








// =========================
// CURRENT RANK
// =========================


async function loadRank(){



const user =

auth.currentUser;



if(!user) return;





const q = query(

collection(db,"results")

);





const snap =

await getDocs(q);





let results=[];



snap.forEach(doc=>{


results.push(doc.data());


});






results.sort(

(a,b)=>

Number(b.percentage)-Number(a.percentage)

);






let rank = "-";



results.forEach(

(item,index)=>{


if(

item.studentId === user.uid

){



rank = index+1;


}



});






document.getElementById(
"currentRank"
).innerHTML =

rank;



}








// =========================
// LOGOUT
// =========================


const logoutBtn =

document.getElementById(
"logoutBtn"
);



if(logoutBtn){



logoutBtn.onclick = ()=>{



auth.signOut()

.then(()=>{



localStorage.clear();



window.location.href =

"index.html";



})

.catch(error=>{


console.log(
"Logout Error",
error
);


});



};


}








// =========================
// LOAD ALL
// =========================


const oldLoadProfile =

loadProfile;



loadProfile = async function(){



await oldLoadProfile();



loadBadges();



loadRank();



};






console.log(

"✅ PROFILE FINAL READY"

);
