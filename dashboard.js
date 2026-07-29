import { db, auth } from "./firebase-config.js";

import {
doc,
getDoc,
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================
// LEVEL SYSTEM
// =========================

function calculateLevel(xp){

return Math.floor(xp / 100) + 1;

}



// =========================
// LOAD STUDENT PROFILE
// =========================


async function loadProfile(){


try{


const user =
auth.currentUser;


if(!user){

console.log("User not login");

return;

}



const profileRef =
doc(
db,
"students",
user.uid
);



const snap =
await getDoc(profileRef);



if(!snap.exists()){

return;

}



const data =
snap.data();



// Name

const studentName =
document.getElementById(
"studentName"
);


if(studentName){

studentName.innerHTML =
data.name || "Student";

}



// Exam Goal

const examGoal =
document.getElementById(
"examGoal"
);


if(examGoal){

examGoal.innerHTML =
data.examGoal || "TNUSRB";

}




// XP

let xp =
data.xp || 0;



let level =
calculateLevel(xp);



document.getElementById(
"xp"
).innerHTML = xp;



document.getElementById(
"level"
).innerHTML = level;



// Next XP

let nextXP =
(level*100);



document.getElementById(
"nextXP"
).innerHTML =
nextXP;




// Progress


let progress =
(xp/nextXP)*100;



const bar =
document.getElementById(
"xpProgress"
);



if(bar){

bar.style.width =
progress+"%";

}




}


catch(error){

console.log(
"Profile Error",
error
);

}



}



// =========================
// LOAD PRACTICE STATS
// =========================


function loadStats(){


const practice =
localStorage.getItem(
"totalPractice"
)||0;


const accuracy =
localStorage.getItem(
"accuracy"
)||0;



const practiceBox =
document.getElementById(
"practiceCount"
);



const accuracyBox =
document.getElementById(
"accuracyBox"
);



if(practiceBox){

practiceBox.innerHTML =
practice;

}



if(accuracyBox){

accuracyBox.innerHTML =
accuracy+"%";

}



}


// =========================
// INIT
// =========================


auth.onAuthStateChanged(
(user)=>{


if(user){

loadProfile();

loadStats();

}


});

// =========================
// CONTINUE PRACTICE LOAD
// =========================


function loadContinuePractice(){


const data =
localStorage.getItem(
"continuePractice"
);



const subject =
document.getElementById(
"continueSubject"
);


const topic =
document.getElementById(
"continueTopic"
);


const question =
document.getElementById(
"continueQuestion"
);



if(!data){


if(subject)
subject.innerHTML="-";


return;

}



const practice =
JSON.parse(data);



if(subject){

subject.innerHTML =
practice.subject || "-";

}


if(topic){

topic.innerHTML =
practice.topic || "-";

}


if(question){

question.innerHTML =
Number(practice.question)+1;

}



}





// =========================
// BADGE LOAD
// =========================


function loadBadges(){


let badges =
JSON.parse(
localStorage.getItem(
"badges"
)
)||[];



const badgeCount =
document.getElementById(
"badgeCount"
);



const latestBadge =
document.getElementById(
"latestBadge"
);



if(badgeCount){

badgeCount.innerHTML =
badges.length;

}



if(latestBadge){


if(badges.length>0){


latestBadge.innerHTML =
badges[badges.length-1];


}
else{


latestBadge.innerHTML =
"No Badge Yet";


}



}



}





// =========================
// LOAD RANK
// =========================


async function loadRank(){


try{


const user =
auth.currentUser;


if(!user) return;



const resultsSnap =
await getDocs(
collection(db,"results")
);



let tamilRank=1;



let districtRank=1;



let myScore=0;



resultsSnap.forEach(doc=>{


const data =
doc.data();



if(data.studentId === user.uid){


myScore =
data.percentage || 0;


}



});



// Simple Rank Calculation

resultsSnap.forEach(doc=>{


const data =
doc.data();


if(
(data.percentage || 0)
>
myScore
){

tamilRank++;

}



});



const stateRank =
document.getElementById(
"stateRank"
);



if(stateRank){

stateRank.innerHTML =
tamilRank;

}




const district =
document.getElementById(
"districtRank"
);



if(district){

district.innerHTML =
districtRank;

}



}

catch(error){

console.log(
"Rank Error",
error
);

}


}





// =========================
// TEST BUTTON LINKS
// =========================


document.addEventListener(
"click",
function(e){


if(
e.target.innerText.includes(
"Start"
)
){


let card =
e.target.closest(
".test-card"
);



if(!card) return;



if(
card.classList.contains(
"daily"
)
){

location.href =
"mocktest.html?type=daily";


}


else if(
card.classList.contains(
"weekly"
)
){

location.href =
"mocktest.html?type=weekly";


}


else if(
card.classList.contains(
"monthly"
)
){

location.href =
"mocktest.html?type=monthly";


}



}



});






// =========================
// DAILY MISSION
// =========================


function updateMission(){


let practice =
Number(
localStorage.getItem(
"totalPractice"
)
)||0;



const mission =
document.querySelector(
".mission-card"
);



if(!mission) return;



if(practice>=20){


mission.innerHTML +=

`

<p>
🎉 Today's Practice Mission Completed!
</p>

`;



}



}





// =========================
// DASHBOARD START
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadContinuePractice();


loadBadges();


updateMission();



});


auth.onAuthStateChanged(
(user)=>{


if(user){

loadRank();

}


});

// =========================
// LOGOUT SYSTEM
// =========================


const profileIcon =
document.querySelector(
".profile-icon"
);



if(profileIcon){


profileIcon.onclick = function(){


location.href =
"profile.html";


};


}





// =========================
// CONTINUE BUTTON
// =========================


const continueBtn =
document.querySelector(
".continue-card .btn"
);



if(continueBtn){


continueBtn.onclick=function(){


location.href =
"practice.html";


};


}





// =========================
// BOTTOM NAV ACTIVE
// =========================


const navLinks =
document.querySelectorAll(
".bottom-nav a"
);



navLinks.forEach(link=>{


link.addEventListener(
"click",
function(){


navLinks.forEach(item=>{

item.classList.remove(
"active"
);

});


this.classList.add(
"active"
);


});


});





// =========================
// AUTO PROFILE REFRESH
// =========================


setInterval(()=>{


if(auth.currentUser){


loadProfile();


loadStats();


loadBadges();


}



},30000);






// =========================
// SECURITY CHECK
// =========================


auth.onAuthStateChanged(
(user)=>{


if(!user){


location.href =
"login.html";


}



});






// =========================
// APP READY
// =========================


console.log(
"✅ G THE GENIUS DASHBOARD READY"
);

