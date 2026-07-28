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



// Sort Percentage

students.sort((a,b)=>{

return b.percentage - a.percentage;

});




const leaderList =
document.getElementById("leaderList");



leaderList.innerHTML="";



let rank=1;



students.forEach((student)=>{



leaderList.innerHTML += `

<div class="leader-card">


<h2>

${rank==1?"🥇":
rank==2?"🥈":
rank==3?"🥉":"🏅"}

Rank ${rank}

</h2>


<h3>
👤 ${student.studentName}
</h3>


<p>
📍 ${student.district}
</p>


<p>
🎯 ${student.testType}
</p>


<p>
📝 Score :
${student.score}/${student.totalQuestions}

</p>


<p>
📈 ${student.percentage}%
</p>


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

return b.percentage-a.percentage;

});




districtBox.innerHTML="";



let rank=1;



districtStudents.forEach((student)=>{


districtBox.innerHTML += `

<div class="leader-card">


<h3>
${rank}. 👤 ${student.studentName}
</h3>


<p>
📈 ${student.percentage}%
</p>


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
