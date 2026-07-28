import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let allStudents = [];

let rankMode = "overall";

let selectedTest = "daily";



const leaderList =
document.getElementById("leaderList");

const rankTitle =
document.getElementById("rankTitle");



async function loadLeaderboard(){


const snapshot =
await getDocs(collection(db,"results"));


allStudents=[];


snapshot.forEach((doc)=>{

allStudents.push(doc.data());

});


showLeaderboard();

}




function showLeaderboard(){


let students = [...allStudents];


// Test Filter

students = students.filter((student)=>{


return student.testType === selectedTest;


});




// District Filter

if(rankMode==="district"){


let myDistrict =
localStorage.getItem("district");


students = students.filter((student)=>{


return student.district === myDistrict;


});


rankTitle.innerHTML =
"📍 District Ranking - " + myDistrict;


}
else{


rankTitle.innerHTML =
"🌍 Overall Ranking";


}




// Sort Score

students.sort((a,b)=>{

return b.percentage - a.percentage;

});




leaderList.innerHTML="";



let rank=1;



students.forEach((student)=>{


leaderList.innerHTML += `


<div class="leader-card">


<h2>

${
rank==1 ? "🥇" :
rank==2 ? "🥈" :
rank==3 ? "🥉" :
"🏅"
}

Rank ${rank}

</h2>



<h3>
👤 ${student.studentName}
</h3>


<p>
📍 ${student.district}
</p>


<p>
🎯 Test : ${student.testType}
</p>


<p>
📝 Score : ${student.score}/${student.totalQuestions}
</p>


<p>
📈 Percentage : ${student.percentage}%
</p>



</div>


`;


rank++;


});


}



// Buttons


document.getElementById("overallBtn").onclick=function(){

rankMode="overall";

showLeaderboard();

};



document.getElementById("districtBtn").onclick=function(){

rankMode="district";

showLeaderboard();

};




document.getElementById("dailyBtn").onclick=function(){

selectedTest="daily";

showLeaderboard();

};



document.getElementById("weeklyBtn").onclick=function(){

selectedTest="weekly";

showLeaderboard();

};



document.getElementById("monthlyBtn").onclick=function(){

selectedTest="monthly";

showLeaderboard();

};




loadLeaderboard();
