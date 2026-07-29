// =========================
// G THE GENIUS DASHBOARD JS
// PART 1
// =========================


import { auth, db } from "./firebase-config.js";


import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// LOAD STUDENT DATA
// =========================


async function loadStudentData(){



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
"studentName"
).innerHTML =

data.name || "Student";





document.getElementById(
"studentDistrict"
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






loadXP();



}



catch(error){


console.log(

"Dashboard Error",

error

);



}



}









// =========================
// XP LEVEL SYSTEM
// =========================


function loadXP(){



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






let levelXP =

xp % 100;






document.getElementById(
"userXP"
).innerHTML =

xp;





document.getElementById(
"userLevel"
).innerHTML =

level;






document.getElementById(
"xpProgress"
).style.width =

levelXP+"%";



}









// =========================
// AUTH CHECK
// =========================


auth.onAuthStateChanged(

(user)=>{



if(user){


loadStudentData();


}



});






console.log(

"✅ G THE GENIUS DASHBOARD READY"

);

// =========================
// TEST ACCESS CHECK
// =========================


function checkTestStatus(){



let attempts =

JSON.parse(

localStorage.getItem(
"mockAttempts"

)

)|| {};



let today =

new Date()
.toLocaleDateString();






// DAILY STATUS


let dailyBtn =

document.querySelector(
".daily button"
);



if(dailyBtn){



if(

attempts.dailyDate === today

&&

attempts.daily >= 5

){



dailyBtn.innerHTML =

"Completed ✅";



dailyBtn.disabled = true;



}



}








// WEEKLY STATUS


let weeklyBtn =

document.querySelector(
".weekly button"
);



if(weeklyBtn){



if(

attempts.weekly >= 3

){



weeklyBtn.innerHTML =

"Completed ✅";



weeklyBtn.disabled = true;



}



}








}








// =========================
// LOGOUT
// =========================


function logoutUser(){



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


}








// =========================
// PROFILE SYNC
// =========================


function syncProfile(){



let name =

localStorage.getItem(
"studentName"
);



let district =

localStorage.getItem(
"district"
);





if(name){


document.getElementById(
"studentName"
).innerHTML =

name;



}





if(district){



document.getElementById(
"studentDistrict"
).innerHTML =

district;



}



}








// =========================
// START DASHBOARD
// =========================


const oldLoadStudentData =

loadStudentData;



loadStudentData = async function(){



await oldLoadStudentData();



checkTestStatus();



syncProfile();



};








console.log(

"✅ Dashboard Final Integration Completed"

);
