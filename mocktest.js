// ===================================
// G THE GENIUS MOCK TEST ENGINE
// FINAL VERSION
// ===================================


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
addDoc

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===================================
// TEST SETTINGS
// ===================================


let testType =
new URLSearchParams(window.location.search)
.get("type");


let totalQuestions = 10;

let timeLimit = 5 * 60;



if(testType==="weekly"){

totalQuestions = 25;
timeLimit = 10 * 60;

}


else if(testType==="monthly"){

totalQuestions = 100;
timeLimit = 60 * 60;

}






// ===================================
// VARIABLES
// ===================================


let questions=[];

let currentQuestion=0;

let selectedAnswers=[];

let timerInterval;







// ===================================
// ELEMENTS
// ===================================


const questionNumber =
document.getElementById("questionNumber");


const questionText =
document.getElementById("questionText");


const optionsBox =
document.getElementById("optionsBox");


const nextBtn =
document.getElementById("nextBtn");


const prevBtn =
document.getElementById("prevBtn");


const timer =
document.getElementById("timer");


const questionPalette =
document.getElementById("questionPalette");


const totalCount =
document.getElementById("totalCount");


const answeredCount =
document.getElementById("answeredCount");


const remainingCount =
document.getElementById("remainingCount");


const testProgress =
document.getElementById("testProgress");







// ===================================
// SHUFFLE
// ===================================


function shuffle(array){

return array.sort(
()=>Math.random()-0.5
);

}







// ===================================
// LOAD QUESTIONS
// ===================================


async function loadQuestions(){


try{


let snap =
await getDocs(
collection(db,"questions")
);



let allQuestions=[];



snap.forEach(doc=>{


allQuestions.push({

id:doc.id,

...doc.data()

});


});





allQuestions =
shuffle(allQuestions);




questions =
allQuestions.slice(
0,
totalQuestions
);




selectedAnswers =
new Array(
questions.length
).fill(null);





createPalette();


showQuestion();


startTimer();



}


catch(error){

console.log(
"Loading Error",
error
);

}

}








// ===================================
// SHOW QUESTION
// ===================================


function showQuestion(){


if(!questions.length)
return;



let q =
questions[currentQuestion];



questionNumber.innerHTML =

`
Question ${currentQuestion+1}
/
${questions.length}
`;



questionText.innerHTML =
q.question;



optionsBox.innerHTML="";





q.options.forEach(option=>{


let btn =
document.createElement("button");



btn.className =
"option-btn";



btn.innerHTML =
option;




if(
selectedAnswers[currentQuestion]
===option
){

btn.classList.add(
"selected"
);

}




btn.onclick=()=>{


selectedAnswers[currentQuestion]
=
option;


showQuestion();


updatePalette();


};





optionsBox.appendChild(btn);



});





prevBtn.style.display =

currentQuestion===0
?
"none"
:
"block";






if(
currentQuestion===questions.length-1
){


nextBtn.innerHTML =
"✅ Submit Test";


}

else{


nextBtn.innerHTML =
"Next ➡";


}



updatePalette();


}









// ===================================
// NEXT
// ===================================


nextBtn.onclick=()=>{


if(
currentQuestion <
questions.length-1
){


currentQuestion++;

showQuestion();


}

else{


submitTest();


}


};






// ===================================
// PREVIOUS
// ===================================


prevBtn.onclick=()=>{


if(
currentQuestion>0
){


currentQuestion--;

showQuestion();


}

};










// ===================================
// TIMER
// ===================================


function startTimer(){


let time =
timeLimit;



timerInterval =
setInterval(()=>{


let min =
Math.floor(time/60);


let sec =
time%60;



timer.innerHTML =

`
⏰
${String(min).padStart(2,"0")}
:
${String(sec).padStart(2,"0")}
`;




if(time<=0){


clearInterval(timerInterval);


submitTest();


}



time--;



},1000);



}









// ===================================
// SUBMIT TEST
// ===================================


async function submitTest(){


clearInterval(timerInterval);



let score=0;



questions.forEach((q,index)=>{


if(
selectedAnswers[index]
===
q.answer
){


score++;


}


});






let percentage =
Math.round(

(score/questions.length)*100

);





localStorage.setItem(

"testQuestions",

JSON.stringify(questions)

);



localStorage.setItem(

"selectedAnswers",

JSON.stringify(selectedAnswers)

);







await addDoc(

collection(db,"results"),

{


studentName:

localStorage.getItem("studentName")
||
"Guest",



district:

localStorage.getItem("district")
||
"Unknown",



testType,


score,


total:
questions.length,


percentage,


date:
new Date()


}


);







alert(

`
Test Completed

Score:
${score}/${questions.length}

Percentage:
${percentage}%

`

);





window.location.href=
"result.html";


}










// ===================================
// QUESTION PALETTE
// ===================================


function createPalette(){


questionPalette.innerHTML="";


totalCount.innerHTML =
questions.length;



questions.forEach((q,index)=>{


let btn =
document.createElement("button");



btn.className =
"palette-btn";



btn.innerHTML =
index+1;



btn.onclick=()=>{


currentQuestion=index;


showQuestion();


};



questionPalette.appendChild(btn);



});



}







// ===================================
// UPDATE PALETTE
// ===================================


function updatePalette(){



let buttons =
document.querySelectorAll(
".palette-btn"
);



let answered=0;



buttons.forEach((btn,index)=>{


btn.classList.remove(
"active",
"answered"
);



if(selectedAnswers[index]){


btn.classList.add(
"answered"
);


answered++;


}



if(index===currentQuestion){


btn.classList.add(
"active"
);


}



});






answeredCount.innerHTML =
answered;



remainingCount.innerHTML =
questions.length-answered;



let percent =
Math.round(

(answered/questions.length)*100

);



testProgress.style.width =
percent+"%";



}







// ===================================
// START
// ===================================


loadQuestions();
