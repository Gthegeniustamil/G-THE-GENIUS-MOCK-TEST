import { db, auth } from "./firebase-config.js";


import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// LOAD LEADERBOARD
// =========================


async function loadLeaderboard(){


try{


const snapshot =

await getDocs(

collection(
db,
"results"
)

);



let students = [];



snapshot.forEach((doc)=>{


let data =
doc.data();



students.push({

id:doc.id,

name:data.studentName || "Student",

district:data.district || "-",

exam:data.examType || "TNUSRB",

score:data.score || 0,

percentage:data.percentage || 0,

studentId:data.studentId || ""

});


});





// SORT HIGH SCORE


students.sort(

(a,b)=>

b.percentage -

a.percentage

);






displayTopPlayers(
students
);



displayRanking(
students
);



loadMyRank(
students
);



}

catch(error){


console.log(
"Leaderboard Error",
error
);


}



}







// =========================
// TOP PLAYERS
// =========================


function displayTopPlayers(data){


const box =

document.getElementById(
"topPlayers"
);



if(!box) return;



box.innerHTML="";



data.slice(0,3)

.forEach((student,index)=>{



let medal;



if(index===0)

medal="🥇";


else if(index===1)

medal="🥈";


else

medal="🥉";





box.innerHTML +=


`

<div class="rank-card">


<div class="rank-position">

${medal}

</div>



<div class="rank-info">


<h3>

${student.name}

</h3>


<p>

📍 ${student.district}

</p>


<p>

🎯 ${student.exam}

</p>


</div>



<div class="rank-score">


<h3>

${student.percentage}%

</h3>


</div>


</div>

`;



});


}







// =========================
// FULL RANKING
// =========================


function displayRanking(data){


const list =

document.getElementById(
"leaderboardList"
);



if(!list) return;



list.innerHTML="";



data.forEach((student,index)=>{



list.innerHTML +=


`

<div class="rank-card">


<div class="rank-position">


#${index+1}


</div>



<div class="rank-info">


<h3>

${student.name}

</h3>


<p>

📍 ${student.district}

</p>


<p>

🎯 ${student.exam}

</p>


</div>



<div class="rank-score">


<h3>

${student.percentage}%

</h3>


</div>


</div>

`;



});



}







// =========================
// MY RANK
// =========================


function loadMyRank(data){


const user =
auth.currentUser;



if(!user) return;



let rank = 0;


let score = 0;



data.forEach((student,index)=>{


if(student.studentId === user.uid){


rank=index+1;

score=student.percentage;


}


});




const rankBox =

document.getElementById(
"myRank"
);



const scoreBox =

document.getElementById(
"myScore"
);



if(rankBox)

rankBox.innerHTML =
rank;



if(scoreBox)

scoreBox.innerHTML =
score;



}





// =========================
// START
// =========================


auth.onAuthStateChanged(

(user)=>{


if(user){


loadLeaderboard();


}


});

// =========================
// GLOBAL DATA
// =========================

let allStudents = [];





// =========================
// FILTER LEADERBOARD
// =========================


function applyFilter(){


let exam =

document.getElementById(
"examFilter"
).value;



let district =

document.getElementById(
"districtFilter"
).value;





let filtered = allStudents.filter(
(student)=>{


let examMatch =
(exam==="all" ||
student.exam===exam);



let districtMatch =
(district==="all" ||
student.district===district);



return examMatch && districtMatch;


});



displayTopPlayers(filtered);


displayRanking(filtered);


loadMyRank(filtered);


}






// =========================
// LOAD DISTRICTS
// =========================


function loadDistricts(){


const select =

document.getElementById(
"districtFilter"
);



if(!select) return;



let districts = [];



allStudents.forEach(
(student)=>{


if(
!districts.includes(
student.district
)
){

districts.push(
student.district
);

}


});




districts.sort();




districts.forEach(
(district)=>{


select.innerHTML +=


`

<option value="${district}">

${district}

</option>

`;



});



}







// =========================
// DISTRICT RANK
// =========================


function loadDistrictRank(){


const user =
auth.currentUser;


if(!user) return;



let myStudent;



allStudents.forEach(
(student)=>{


if(student.studentId === user.uid){

myStudent = student;

}


});



if(!myStudent)
return;




let districtStudents =

allStudents.filter(
(student)=>

student.district ===
myStudent.district

);




districtStudents.sort(

(a,b)=>

b.percentage -
a.percentage

);




let rank =

districtStudents.findIndex(

(student)=>

student.studentId ===
user.uid

)+1;





const box =

document.getElementById(
"myDistrictRank"
);



if(box){

box.innerHTML =
rank;

}


}







// =========================
// PERFORMANCE DATA
// =========================


function loadPerformance(){


const user =
auth.currentUser;


if(!user) return;



let tests = 0;

let bestScore = 0;



allStudents.forEach(
(student)=>{


if(
student.studentId === user.uid
){


tests++;



if(
student.percentage >
bestScore
){

bestScore =
student.percentage;

}


}


});





const testBox =

document.getElementById(
"totalTests"
);



const scoreBox =

document.getElementById(
"bestScore"
);



if(testBox)

testBox.innerHTML =
tests;



if(scoreBox)

scoreBox.innerHTML =
bestScore+"%";


}







// =========================
// EVENT LISTENER
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


const examFilter =

document.getElementById(
"examFilter"
);



const districtFilter =

document.getElementById(
"districtFilter"
);




if(examFilter){

examFilter.addEventListener(
"change",
applyFilter
);

}



if(districtFilter){

districtFilter.addEventListener(
"change",
applyFilter
);

}


});






// =========================
// UPDATE LOAD FUNCTION
// =========================


const oldLoadLeaderboard =
loadLeaderboard;



loadLeaderboard = async function(){


await oldLoadLeaderboard();


const snapshot =

await getDocs(

collection(
db,
"results"
)

);



allStudents=[];



snapshot.forEach((doc)=>{


let data =
doc.data();



allStudents.push({

name:data.studentName || "Student",

district:data.district || "-",

exam:data.examType || "TNUSRB",

percentage:data.percentage || 0,

score:data.score || 0,

studentId:data.studentId || ""

});


});



allStudents.sort(

(a,b)=>

b.percentage-a.percentage

);



loadDistricts();


loadDistrictRank();


loadPerformance();


}

// =========================
// LOADING DISPLAY
// =========================


function showLoading(){


const list =

document.getElementById(
"leaderboardList"
);



if(list){


list.innerHTML =

`

<div class="rank-card">

<h3>
⏳ Loading Ranking...
</h3>

</div>

`;

}


}






// =========================
// EMPTY DATA CHECK
// =========================


function checkEmpty(data){


const list =

document.getElementById(
"leaderboardList"
);



if(
data.length===0
){


if(list){


list.innerHTML =

`

<div class="rank-card">


<h3>

😔 No Results Found

</h3>


<p>

Complete Mock Test to appear in Ranking

</p>


</div>

`;

}



return true;


}



return false;


}







// =========================
// HIGHLIGHT MY CARD
// =========================


function highlightMyRank(){


const user =
auth.currentUser;



if(!user)
return;



const cards =

document.querySelectorAll(
".rank-card"
);



cards.forEach(card=>{


if(
card.innerText.includes(
user.email
)
){


card.style.border =
"2px solid #FFD700";


}


});


}






// =========================
// REFRESH LEADERBOARD
// =========================


setInterval(()=>{


if(auth.currentUser){


showLoading();


setTimeout(()=>{


loadLeaderboard();


},1000);



}



},60000);






// =========================
// LOGOUT SECURITY
// =========================


auth.onAuthStateChanged(
(user)=>{


if(!user){


location.href =
"login.html";


}


});






// =========================
// PAGE READY
// =========================


document.addEventListener(

"DOMContentLoaded",

()=>{


showLoading();


console.log(
"🏆 G THE GENIUS LEADERBOARD READY"
);


});
