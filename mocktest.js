// =====================================
// G THE GENIUS
// MOCK TEST JS
// PART 1
// =====================================


import { db, auth } from "./firebase-config.js";


import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// =====================================
// DOM
// =====================================


const questionText =
document.getElementById("questionText");


const optionsContainer =
document.getElementById("optionsContainer");


const questionNumber =
document.getElementById("questionNumber");


const totalQuestions =
document.getElementById("totalQuestions");


const testTitle =
document.getElementById("testTitle");



const timer =
document.getElementById("timer");





// =====================================
// TEST SETTINGS
// =====================================


let testType =
new URLSearchParams(window.location.search)
.get("type") || "daily";



let totalQuestionCount = 10;

let timeLimit = 5 * 60;



if(testType==="weekly"){


totalQuestionCount=25;

timeLimit=10*60;


testTitle.innerHTML=
"🟡 Weekly Mock Test";


}



if(testType==="monthly"){


totalQuestionCount=100;

timeLimit=60*60;


testTitle.innerHTML=
"🔴 Monthly Grand Test";


}




totalQuestions.innerHTML =
totalQuestionCount;




// =====================================
// VARIABLES
// =====================================


let questions=[];

let currentIndex=0;

let selectedAnswers=[];

let timeLeft=timeLimit;

let timerInterval;





// =====================================
// AUTH CHECK
// =====================================


onAuthStateChanged(auth,(user)=>{


if(!user){


window.location.href="login.html";


}


});





// =====================================
// LOAD QUESTIONS
// =====================================


async function loadQuestions(){


try{


const snap =

await getDocs(

collection(db,"questions")

);



let allQuestions=[];



snap.forEach((doc)=>{


allQuestions.push(doc.data());


});



questions =

allQuestions

.sort(()=>Math.random()-0.5)

.slice(0,totalQuestionCount);



selectedAnswers =

new Array(

questions.length

).fill(null);



showQuestion();



startTimer();



}


catch(error){


console.log(

"Question Load Error",

error

);


}


}





// START

loadQuestions();

// =====================================
// MOCK TEST JS
// PART 2
// =====================================



// =====================================
// SHOW QUESTION
// =====================================


function showQuestion(){


if(!questions.length) return;



const q =

questions[currentIndex];



questionNumber.innerHTML =

currentIndex + 1;



questionText.innerHTML =

q.question;



optionsContainer.innerHTML="";




q.options.forEach((option,index)=>{



const btn =

document.createElement("button");



btn.className="option-btn";


btn.innerHTML =

option;



if(selectedAnswers[currentIndex]===index){


btn.classList.add("selected");


}



btn.onclick=()=>{


selectAnswer(index);


};



optionsContainer.appendChild(btn);



});



updatePalette();


}





// =====================================
// SELECT ANSWER
// =====================================


function selectAnswer(index){


selectedAnswers[currentIndex]=index;


showQuestion();


}




// =====================================
// BUTTONS
// =====================================


const nextBtn =

document.getElementById("nextBtn");


const previousBtn =

document.getElementById("previousBtn");




nextBtn.onclick=()=>{


if(currentIndex < questions.length-1){


currentIndex++;


showQuestion();


}


};



previousBtn.onclick=()=>{


if(currentIndex>0){


currentIndex--;


showQuestion();


}


};





// =====================================
// QUESTION PALETTE
// =====================================


const palette =

document.getElementById("palette");



function updatePalette(){


palette.innerHTML="";



questions.forEach((q,index)=>{


const btn =

document.createElement("button");



btn.className="palette-btn";


btn.innerHTML=index+1;




if(index===currentIndex){


btn.classList.add("active");


}



if(selectedAnswers[index]!==null){


btn.classList.add("answered");


}



btn.onclick=()=>{


currentIndex=index;


showQuestion();


};



palette.appendChild(btn);



});


    }

// =====================================
// MOCK TEST JS
// PART 3 FINAL
// =====================================



// =====================================
// TIMER
// =====================================


function startTimer(){


timerInterval = setInterval(()=>{


let minutes =

Math.floor(timeLeft / 60);



let seconds =

timeLeft % 60;



timer.innerHTML =

"⏰ " +

String(minutes).padStart(2,"0")

+

":"

+

String(seconds).padStart(2,"0");




if(timeLeft <= 60){


timer.classList.add("timer-warning");


}



if(timeLeft <= 0){


clearInterval(timerInterval);


submitTest();


}



timeLeft--;



},1000);


}




// =====================================
// SUBMIT TEST
// =====================================


const submitBtn =

document.getElementById("submitBtn");



if(submitBtn){


submitBtn.onclick=()=>{


let confirmSubmit =

confirm(

"Are you sure you want to submit?"

);



if(confirmSubmit){


submitTest();


}



};


}





async function submitTest(){


clearInterval(timerInterval);



let correct = 0;



questions.forEach((q,index)=>{


if(

selectedAnswers[index] === q.correctAnswer

){


correct++;


}



});



let score = correct;


let percentage =

Math.round(

(score / questions.length) * 100

);





const user = auth.currentUser;



if(user){



await saveResult(

user,

score,

percentage

);



}





window.location.href =

"result.html?score="

+

score

+

"&total="

+

questions.length;



}




// =====================================
// SAVE RESULT FIRESTORE
// =====================================


async function saveResult(user,score,percentage){


try{


await addDoc(

collection(db,"results"),

{


uid:user.uid,


score:score,


percentage:percentage,


testType:testType,


totalQuestions:questions.length,


createdAt:new Date()



}


);



}


catch(error){


console.log(

"Result Save Error",

error

);


}


           }

