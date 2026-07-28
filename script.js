import { db } from "./firebase-config.js";

import {
collection,
getDocs,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let allQuestions = [];
let testQuestions = [];
let currentQuestion = 0;
let selectedAnswers = [];
let timer;


// Test Settings

let testType = "daily";
let totalQuestions = 10;
let timeLimit = 300;



const urlParams =
new URLSearchParams(window.location.search);

testType =
urlParams.get("type") || "daily";



// Student Details

document.getElementById("studentName").innerHTML =
localStorage.getItem("studentName") || "Student";


document.getElementById("studentDistrict").innerHTML =
localStorage.getItem("district") || "-";




// Test Type

if(testType==="daily"){

totalQuestions = 10;
timeLimit = 300;

document.getElementById("testType").innerHTML =
"🟢 Daily Mock Test";

}

else if(testType==="weekly"){

totalQuestions = 25;
timeLimit = 600;

document.getElementById("testType").innerHTML =
"🟡 Weekly Mock Test";

}

else{

totalQuestions = 100;
timeLimit = 3600;

document.getElementById("testType").innerHTML =
"🔴 Monthly Grand Test";

}




// TIMER

function startTimer(){

let timeLeft = timeLimit;


timer=setInterval(()=>{


let min=Math.floor(timeLeft/60);

let sec=timeLeft%60;


document.getElementById("timer").innerHTML =
`⏰ ${min}:${sec.toString().padStart(2,"0")}`;


if(timeLeft<=0){

clearInterval(timer);

alert("Time Over! Test Submitted");

submitTest();

return;

}


timeLeft--;


},1000);


}





// LOAD QUESTIONS

async function loadQuestions(){


try{


document.getElementById("questionText").innerHTML =
"Loading Questions...";



const snapshot =
await getDocs(collection(db,"questions"));



allQuestions=[];



snapshot.forEach((doc)=>{

allQuestions.push(doc.data());

});



console.log(
"Questions Loaded:",
allQuestions
);



if(allQuestions.length===0){

document.getElementById("questionText").innerHTML =
"No Questions Found";

return;

}




testQuestions =
allQuestions
.sort(()=>Math.random()-0.5)
.slice(0,totalQuestions);



selectedAnswers =
new Array(testQuestions.length).fill(null);



showQuestion();

createPalette();

startTimer();



}

catch(error){


console.log(error);


document.getElementById("questionText").innerHTML =
"Failed To Load Questions";


}


}



loadQuestions();






// SHOW QUESTION


function showQuestion(){


let q =
testQuestions[currentQuestion];



document.getElementById("questionNumber").innerHTML =
"Question "+(currentQuestion+1)+
" / "+
testQuestions.length;



document.getElementById("questionText").innerHTML =
q.question;



let box =
document.getElementById("options");


box.innerHTML="";



q.options.forEach((option,index)=>{


let btn=document.createElement("button");


btn.className="option";


btn.innerHTML=option;



if(selectedAnswers[currentQuestion]===index){

btn.classList.add("selected");

}



btn.onclick=function(){


selectedAnswers[currentQuestion]=index;


showQuestion();


updatePalette();


};



box.appendChild(btn);



});



}





// NEXT

document.getElementById("nextBtn").onclick=function(){


if(currentQuestion <
testQuestions.length-1){


currentQuestion++;

showQuestion();

updatePalette();


}


};






// PREVIOUS


document.getElementById("previousBtn").onclick=function(){


if(currentQuestion>0){


currentQuestion--;

showQuestion();

updatePalette();


}


};







// PALETTE


function createPalette(){


let palette =
document.createElement("div");


palette.id="questionPalette";



testQuestions.forEach((q,index)=>{


let btn =
document.createElement("button");


btn.innerHTML=index+1;

btn.className="palette-btn";



btn.onclick=function(){


currentQuestion=index;

showQuestion();

updatePalette();


};



palette.appendChild(btn);



});



document.querySelector(".question-box")
.prepend(palette);



}




function updatePalette(){


document
.querySelectorAll(".palette-btn")
.forEach((btn,index)=>{


btn.classList.remove(
"active",
"answered"
);



if(selectedAnswers[index]!==null){

btn.classList.add("answered");

}


if(index===currentQuestion){

btn.classList.add("active");

}


});


}







// SUBMIT


async function submitTest(){


clearInterval(timer);



let score=0;



testQuestions.forEach((q,index)=>{


if(selectedAnswers[index]===q.answer){

score++;

}


});





try{


await addDoc(
collection(db,"results"),
{


studentName:
localStorage.getItem("studentName") || "Student",


district:
localStorage.getItem("district") || "-",


testType:testType,


score:score,


totalQuestions:
testQuestions.length,


percentage:
Math.round(
(score/testQuestions.length)*100
),


createdAt:
serverTimestamp()


});



// STREAK


let today =
new Date().toLocaleDateString();


let lastDate =
localStorage.getItem("lastTestDate");


let streak =
Number(localStorage.getItem("streak")) || 0;



if(lastDate !== today){


let yesterday =
new Date();


yesterday.setDate(
yesterday.getDate()-1
);



if(lastDate === yesterday.toLocaleDateString()){


streak++;


}

else{


streak=1;


}



localStorage.setItem(
"streak",
streak
);



localStorage.setItem(
"lastTestDate",
today
);


}



}



catch(error){


console.log(
"Save Error:",
error
);


}




localStorage.setItem(
"score",
score
);


localStorage.setItem(
"totalQuestions",
testQuestions.length
);


localStorage.setItem(
"questions",
JSON.stringify(testQuestions)
);


localStorage.setItem(
"userAnswers",
JSON.stringify(selectedAnswers)
);


localStorage.setItem(
"testType",
testType
);



window.location.href="result.html";


}







function confirmSubmit(){


let unanswered =
selectedAnswers.filter(x=>x===null).length;



if(unanswered>0){


if(confirm(
unanswered+
" Questions not answered. Submit?"
)){


submitTest();


}


}

else{


submitTest();


}



}




document.getElementById("submitBtn")
.onclick=function(){

confirmSubmit();

};
