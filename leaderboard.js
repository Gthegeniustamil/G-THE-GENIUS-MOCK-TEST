// =====================================
// G THE GENIUS
// LEADERBOARD JS
// PART 1
// =====================================


import { db } from "./firebase-config.js";


import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =====================================
// DOM
// =====================================


const leaderboardData =

document.getElementById("leaderboardData");


const topStudents =

document.getElementById("topStudents");





// =====================================
// LOAD RESULTS
// =====================================


async function loadLeaderboard(){


try{


const snap =

await getDocs(

collection(db,"results")

);



let results=[];



snap.forEach((doc)=>{


results.push(doc.data());


});




// SORT BY PERCENTAGE


results.sort((a,b)=>{


return b.percentage - a.percentage;


});



displayLeaderboard(results);



displayTopStudents(results);



}



catch(error){


console.log(

"Leaderboard Error",

error

);


}


}





// =====================================
// DISPLAY TABLE
// =====================================


function displayLeaderboard(data){



leaderboardData.innerHTML="";



data.forEach((student,index)=>{



const row =

document.createElement("tr");



row.innerHTML = `

<td>

${index+1}

</td>


<td>

${student.name || "Student"}

</td>


<td>

${student.district || "-"}

</td>


<td>

${student.testType || "-"}

</td>


<td>

${student.score || 0}

</td>


<td>

${student.percentage || 0}%

</td>

`;



leaderboardData.appendChild(row);



});


}





// START

loadLeaderboard();
// =====================================
// G THE GENIUS
// LEADERBOARD JS
// PART 2 FINAL
// =====================================



// =====================================
// TOP STUDENTS
// =====================================


function displayTopStudents(data){


if(!topStudents) return;



topStudents.innerHTML="";



const top = data.slice(0,3);



top.forEach((student,index)=>{


const card =

document.createElement("div");



card.className="top-card";



let medal="🥉";


if(index===0){

medal="🥇";

}

else if(index===1){

medal="🥈";

}



card.innerHTML = `


<h2>

${medal}

</h2>


<h3>

${student.name || "Student"}

</h3>


<p>

${student.district || "-"}

</p>


<p>

Score : ${student.score || 0}

</p>


<p>

${student.percentage || 0}%

</p>


`;



topStudents.appendChild(card);



});



}





// =====================================
// DISTRICT FILTER
// =====================================


const districtFilter =

document.getElementById("districtFilter");



if(districtFilter){


districtFilter.addEventListener(

"change",

async()=>{


const selected =

districtFilter.value;



const snap =

await getDocs(

collection(db,"results")

);



let data=[];



snap.forEach((doc)=>{


const item = doc.data();



if(

selected==="All" ||

item.district===selected

){


data.push(item);


}



});



data.sort((a,b)=>


b.percentage-a.percentage


);



displayLeaderboard(data);


displayTopStudents(data);



}


);


}




console.log(

"G THE GENIUS LEADERBOARD LOADED"

);


