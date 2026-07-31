
// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// RESULT JS
// PART 1 / 5
// ==========================================


import { db, auth } from "./firebase-config.js";


import {

collection,

addDoc,

serverTimestamp

} from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// GET LAST RESULT DATA


let score =
Number(
localStorage.getItem("lastScore")
) || 0;




let percentage =
localStorage.getItem(
"lastPercentage"
) || 0;






// STUDENT DATA


let studentName =
localStorage.getItem(
"studentName"
) || "Student";



let district =
localStorage.getItem(
"district"
) || "-";







// RESULT ELEMENTS


const scoreBox =
document.getElementById(
"score"
);



const percentageBox =
document.getElementById(
"percentage"
);






if(scoreBox){

scoreBox.innerText =
score;

}



if(percentageBox){

percentageBox.innerText =
percentage + "%";

}

// ==========================================
// SAVE RESULT TO FIRESTORE
// PART 2 / 5
// ==========================================



const testType =

new URLSearchParams(

window.location.search

).get("type")

|| "Practice";







async function saveResult(){



try{



await addDoc(

collection(
db,
"results"
),

{


studentName: studentName,


district: district,



testType: testType,



score: score,



percentage: Number(
percentage
),



createdAt:
serverTimestamp()



}



);





console.log(

"✅ Result Saved"

);





}

catch(error){



console.error(

"Result Save Error",

error

);



}



}







// Auto Save


saveResult();


// ==========================================
// PERFORMANCE ANALYSIS
// PART 3 / 5
// ==========================================



const resultMessage =
document.getElementById(
"resultMessage"
);




function getPerformanceMessage(){



let msg = "";





if(percentage >= 90){


msg =
"🏆 Excellent! Top Rank Preparation";


}



else if(percentage >= 75){


msg =
"⭐ Very Good! Keep Practicing";


}



else if(percentage >= 50){


msg =
"🔥 Good Effort! Improve More";


}



else{


msg =
"📚 Need More Practice. Never Give Up";


}




return msg;



}







if(resultMessage){


resultMessage.innerText =
getPerformanceMessage();


}







// ==========================================
// RESULT SUMMARY
// ==========================================



const studentNameBox =
document.getElementById(
"studentName"
);



const districtBox =
document.getElementById(
"district"
);






if(studentNameBox){


studentNameBox.innerText =
studentName;


}





if(districtBox){


districtBox.innerText =
district;


}


// ==========================================
// RANK + SHARE SYSTEM
// PART 4 / 5
// ==========================================



import {

getDocs

} from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// ==========================================
// CALCULATE TEMP RANK
// ==========================================


async function calculateRank(){


try{


let snapshot =

await getDocs(

collection(
db,
"results"
)

);





let students = [];





snapshot.forEach(doc=>{


students.push(
doc.data()
);


});






students.sort(

(a,b)=>

Number(b.percentage)

-

Number(a.percentage)

);







let rank =

students.findIndex(

(s)=>

s.studentName === studentName

&&

Number(s.percentage)

===

Number(percentage)

)

+1;







const rankBox =

document.getElementById(
"rank"
);






if(rankBox){


rankBox.innerText =

rank;


}



}

catch(error){


console.error(
"Rank Error",
error
);


}



}





calculateRank();








// ==========================================
// SHARE RESULT
// ==========================================



const shareBtn =

document.getElementById(
"shareBtn"
);





if(shareBtn){


shareBtn.onclick = ()=>{


let text =

`
G THE GENIUS Mock Test Result

👤 Name: ${studentName}

🏆 Score: ${score}

⭐ Percentage: ${percentage}%

`;


if(
navigator.share
){


navigator.share({

title:
"G THE GENIUS Result",

text:text


});


}

else{


alert(text);


}



};


}


// ==========================================
// RESULT HISTORY SAVE
// PART 5 / 5 FINAL
// ==========================================





function saveLocalHistory(){



let history =

JSON.parse(

localStorage.getItem(
"testHistory"
)

)

|| [];






history.push({

name: studentName,

score: score,

percentage: percentage,

testType: testType,

date:

new Date().toLocaleDateString()


});






localStorage.setItem(

"testHistory",

JSON.stringify(history)

);



}







saveLocalHistory();







// ==========================================
// RESULT PAGE READY
// ==========================================



console.log(

`
================================

G THE GENIUS RESULT SYSTEM READY ✅

Student:
${studentName}

Score:
${score}

Percentage:
${percentage}%

================================
`

);
