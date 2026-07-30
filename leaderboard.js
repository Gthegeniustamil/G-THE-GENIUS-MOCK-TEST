// =========================
// G THE GENIUS LEADERBOARD JS
// PART 1
// =========================


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let allResults = [];






// =========================
// LOAD LEADERBOARD
// =========================


async function loadLeaderboard(){



try{



const q = query(

collection(
db,
"results"
),

orderBy(
"score",
"desc"
)

);





const snap =

await getDocs(q);





allResults=[];





snap.forEach(doc=>{


allResults.push({

id:doc.id,

...doc.data()

});


});






displayTopThree();


displayLeaderboard(
allResults
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
// TOP 3 DISPLAY
// =========================


function displayTopThree(){



if(
allResults.length===0
) return;




let first =
allResults[0];

let second =
allResults[1];

let third =
allResults[2];





document.getElementById(
"firstName"
).innerHTML =

first?.studentName || "-";



document.getElementById("firstScore").innerHTML =
first.score + "/" + first.total;






document.getElementById(
"secondName"
).innerHTML =

second?.studentName || "-";



document.getElementById("secondScore").innerHTML =
second.score + "/" + second.total;





document.getElementById(
"thirdName"
).innerHTML =

third?.studentName || "-";



document.getElementById("thirdScore").innerHTML =
third.score + "/" + third.total;


}








// =========================
// DISPLAY LIST
// =========================


function displayLeaderboard(data){



const list =

document.getElementById(
"leaderList"
);



list.innerHTML="";





data.forEach(
(student,index)=>{



let div =

document.createElement(
"div"
);



div.className =
"rank-row";






let badge =
getBadge(
student.score
);






div.innerHTML = `


<span class="rank">

#${index+1}

</span>



<span>

${student.studentName || "Student"}

<br>

<small>

${student.district || "-"}

</small>

</span>


<span class="score">

${student.score || 0}/${student.total || 0}

</span>



<span>

${badge}

</span>


`;





list.appendChild(div);



});



}







// =========================
// BADGE SYSTEM
// =========================




function getBadge(score){


if(score>=90)

return "🏆 Master";


if(score>=75)

return "🥇 Pro";


if(score>=50)

return "🥈 Rising";


return "⭐ Starter";


}







// =========================
// START
// =========================


loadLeaderboard();



console.log(

"✅ G THE GENIUS LEADERBOARD READY"

);

// =========================
// FILTER SYSTEM
// =========================


const testFilter =

document.getElementById(
"testFilter"
);



const rankFilter =

document.getElementById(
"rankFilter"
);





if(testFilter){


testFilter.onchange = ()=>{


applyFilter();


};


}






if(rankFilter){


rankFilter.onchange = ()=>{


applyFilter();


};


}








function applyFilter(){



let data = [...allResults];






// TEST TYPE FILTER


let type =

testFilter?.value || "all";




if(type !== "all"){



data = data.filter(

item =>

item.testType === type

);


}







// DISTRICT FILTER


let rankType =

rankFilter?.value || "overall";




if(rankType==="district"){



let district =

localStorage.getItem(
"district"
);



data = data.filter(

item =>

item.district === district

);



}





displayLeaderboard(data);



}








// =========================
// MY RANK
// =========================


function showMyRank(){



let userName =

localStorage.getItem(
"studentName"
);



let district =

localStorage.getItem(
"district"
);





let overallRank = 0;

let districtRank = 0;



let bestScore = 0;







allResults.forEach(

(item,index)=>{



if(

item.studentName === userName

){



overallRank = index+1;



if(
item.score > bestScore
){

bestScore = item.score;

}


}







});








let dRank = 1;



allResults.forEach(

(item)=>{



if(

item.district === district

){



if(

item.studentName === userName

){


districtRank = dRank;


}



dRank++;


}



});








let rankElement =

document.getElementById(
"myRank"
);



if(rankElement)

rankElement.innerHTML =

overallRank || "-";






let districtElement =

document.getElementById(
"myDistrictRank"
);



if(districtElement)

districtElement.innerHTML =

districtRank || "-";






let scoreElement =

document.getElementById(
"myBestScore"
);



if(scoreElement)

scoreElement.innerHTML =
bestScore;
}







// =========================
// LOAD BADGES
// =========================


function loadBadges(){



let badges =

JSON.parse(

localStorage.getItem(
"badges"

)

)||[];





let box =

document.getElementById(
"badgeList"
);





if(!box) return;





box.innerHTML="";





if(
badges.length===0
){


box.innerHTML =

"<span>No Badge</span>";


return;


}





badges.forEach(

badge=>{



let span =

document.createElement(
"span"
);



span.className =
"badge-item";



span.innerHTML =

"🏅 "+badge;



box.appendChild(span);



});



}








// =========================
// UPDATE AFTER LOAD
// =========================


const oldLoadLeaderboard =

loadLeaderboard;



loadLeaderboard = async function(){



await oldLoadLeaderboard();



showMyRank();



loadBadges();



};








console.log(

"✅ Leaderboard Final Ready"

);

