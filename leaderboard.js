import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let allStudents = [];



// Load Results

async function loadLeaderboard(){


const snapshot =
await getDocs(collection(db,"results"));



allStudents = [];



snapshot.forEach((doc)=>{

allStudents.push(doc.data());

});



showLeaderboard();


}






// Show Overall Leaderboard

function showLeaderboard(){


let filter =
document.getElementById("testFilter").value;



let students = [...allStudents];



if(filter !== "all"){

students =
students.filter(
s=>s.testType.toLowerCase()===filter
);

}


// Sort by Marks

students.sort((a,b)=>{

return b.score - a.score;

});



const leaderList =
document.getElementById("leaderList");

leaderList.innerHTML += `

<div class="leader-card ${rank==1?"first":rank==2?"second":rank==3?"third":""}">

<div class="rank-col">
${rank==1?"🥇":rank==2?"🥈":rank==3?"🥉":"#"+rank}
</div>

<div class="name-col">
${student.studentName}
</div>

<div class="district-col">
${student.district}
</div>

<div class="mark-col">
${student.score}/${student.totalQuestions}
</div>

</div>

`;



rank++;


});



showDistrictRank();



}








// District Rank

function showDistrictRank(){


let myDistrict =
localStorage.getItem("district");



let districtBox =
document.getElementById("districtRank");



if(!myDistrict){

districtBox.innerHTML =
"District Not Selected";

return;

}



let districtStudents =
allStudents.filter(

s=>s.district===myDistrict

);




districtStudents.sort((a,b)=>{

return b.score-a.score;

});




districtBox.innerHTML="";



let rank=1;



districtStudents.forEach((student)=>{


districtBox.innerHTML += `

<div class="leader-card">

<div class="rank-col">
${rank}
</div>

<div class="name-col">
${student.studentName}
</div>

<div class="district-col">
${student.district}
</div>

<div class="mark-col">
${student.score}/${student.totalQuestions}
</div>

</div>

`;



rank++;


});


}







// Filter Change

document.getElementById("testFilter")
.onchange=function(){


showLeaderboard();


};





loadLeaderboard();
