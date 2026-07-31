// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// MOCKTEST.JS FULL FINAL
// PART 1 / 5
// ==========================================


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
query,
where,
addDoc,
serverTimestamp

} from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ==========================================
// URL DATA
// ==========================================


const params =
new URLSearchParams(
window.location.search
);



const testType =
params.get("type") || "topic";


const selectedTopic =
params.get("topic");



const selectedSubject =
params.get("subject");







// ==========================================
// TEST SETTINGS
// ==========================================


let totalQuestions = 10;


let timeLimit = 5 * 60;




if(testType==="weekly"){


totalQuestions = 25;


timeLimit = 10 * 60;


}



if(testType==="monthly"){


totalQuestions = 100;


timeLimit = 60 * 60;


}








// ==========================================
// VARIABLES
// ==========================================


let questions = [];


let currentQuestion = 0;


let selectedAnswers = [];


let remainingTime = timeLimit;


let timer;







// ==========================================
// HTML ELEMENTS
// ==========================================


const questionNumber =
document.getElementById(
"questionNumber"
);



const questionText =
document.getElementById(
"questionText"
);



const optionsBox =
document.getElementById(
"optionsBox"
);



const timerBox =
document.getElementById(
"timer"
);



const loading =
document.getElementById(
"loading"
);


// ==========================================
// LOAD QUESTIONS FROM FIRESTORE
// PART 2 / 5
// ==========================================



async function loadQuestions(){


try{


let qRef =
collection(
db,
"questions"
);



let snapshot;





// TOPIC BASED PRACTICE


if(selectedTopic){



let q =

query(

qRef,

where(
"topic",
"==",
selectedTopic
)

);



snapshot =
await getDocs(q);



}





// SUBJECT BASED PRACTICE


else if(selectedSubject){



let q =

query(

qRef,

where(
"subject",
"==",
selectedSubject
)

);



snapshot =
await getDocs(q);



}





// NORMAL MOCK TEST


else{


snapshot =
await getDocs(qRef);


}







questions=[];






snapshot.forEach(doc=>{


questions.push({

id:doc.id,

...doc.data()

});


});






console.log(

"Questions Loaded:",

questions.length

);






}

catch(error){



console.error(

"Question Load Error",

error

);



}



}









// ==========================================
// SHUFFLE QUESTIONS
// ==========================================


function shuffle(array){


return array.sort(

()=>Math.random()-0.5

);


}








// ==========================================
// PREPARE TEST QUESTIONS
// ==========================================


function prepareQuestions(){



questions =
shuffle(
questions
);






if(
questions.length >
totalQuestions

){


questions =

questions.slice(

0,

totalQuestions

);



}







selectedAnswers =

new Array(

questions.length

)

.fill(null);






console.log(

"Test Ready:",

questions.length

);



}


// ==========================================
// QUESTION DISPLAY SYSTEM
// PART 3 / 5
// ==========================================



function showQuestion(){



if(!questions.length)

return;






let q =

questions[currentQuestion];






// QUESTION NUMBER


if(questionNumber){


questionNumber.innerText =

"Question "

+

(currentQuestion + 1)

+

" / "

+

questions.length;


}







// QUESTION TEXT


if(questionText){


questionText.innerText =

q.question;


}







// OPTIONS


if(optionsBox){


optionsBox.innerHTML="";





q.options.forEach(option=>{



let btn =

document.createElement(
"button"
);




btn.className =
"option-btn";



btn.innerText =
option;






if(

selectedAnswers[currentQuestion]

=== option

){


btn.classList.add(
"selected"
);


}






btn.onclick = ()=>{


selectedAnswers[currentQuestion]

=

option;





showQuestion();



};







optionsBox.appendChild(btn);



});



}



}









// ==========================================
// NEXT BUTTON
// ==========================================



const nextBtn =

document.getElementById(
"nextBtn"
);





if(nextBtn){


nextBtn.onclick = ()=>{



if(

currentQuestion <

questions.length - 1

){


currentQuestion++;


showQuestion();



}



};



}








// ==========================================
// PREVIOUS BUTTON
// ==========================================



const prevBtn =

document.getElementById(
"prevBtn"
);





if(prevBtn){


prevBtn.onclick = ()=>{



if(

currentQuestion > 0

){


currentQuestion--;


showQuestion();



}



};



}


// ==========================================
// TIMER SYSTEM
// PART 4 / 5
// ==========================================



function startTimer(){



timer = setInterval(()=>{



let min =

Math.floor(
remainingTime / 60
);



let sec =

remainingTime % 60;







if(timerBox){


timerBox.innerText =

"⏰ "

+

String(min).padStart(2,"0")

+

":"

+

String(sec).padStart(2,"0");


}







remainingTime--;






if(remainingTime < 0){


clearInterval(timer);


submitTest();


}



},1000);



}










// ==========================================
// SCORE CALCULATION FINAL
// ==========================================


function calculateResult(){


let correct = 0;

let wrong = 0;

let unanswered = 0;



questions.forEach((q,index)=>{


let userAnswer =
selectedAnswers[index];



if(!userAnswer){


unanswered++;


}

else if(

userAnswer.trim()

===

q.answer.trim()

){


correct++;


}

else{


wrong++;


}



});





return {

correct,

wrong,

unanswered

};


}










// ==========================================
// SAVE RESULT
// ==========================================



async function saveResult(resultData){


try{



await addDoc(

collection(
db,
"results"
),

{


studentName:

localStorage.getItem(
"studentName"
)

|| "Student",



district:

localStorage.getItem(
"district"
)

|| "-",



testType:



testType,



score:
score:
resultData.correct,


correct:
resultData.correct,


wrong:
resultData.wrong,


unanswered:
resultData.unanswered,


totalQuestions:
questions.length,


percentage:
(
resultData.correct /
questions.length
*
100
).toFixed(2),


createdAt:

serverTimestamp()



}


);



console.log(
"Result Saved"
);



}

catch(error){



console.error(
error
);



}



}









// ==========================================
// SUBMIT TEST
// ==========================================



async function submitTest(){



clearInterval(timer);





let resultData =

calculateResult();


await saveResult(resultData);






localStorage.setItem(

"lastScore",

score

);





localStorage.setItem(

"lastPercentage",

(

score /

questions.length

*

100

).toFixed(2)

);







window.location.href =

"result.html";



}


// ==========================================
// FINAL TEST START SYSTEM
// PART 5 / 5 FINAL
// ==========================================






// ==========================================
// HIDE LOADING
// ==========================================


function hideLoading(){


if(loading){


loading.style.display="none";


}


}








// ==========================================
// START TEST
// ==========================================


async function startTest(){



await loadQuestions();






if(
questions.length === 0

){



if(loading){


loading.innerHTML =

"❌ No Questions Found";


}


return;


}







prepareQuestions();






hideLoading();






showQuestion();






startTimer();






console.log(

"G THE GENIUS TEST STARTED"

);



}










// ==========================================
// SUBMIT BUTTON
// ==========================================


const submitBtn =

document.getElementById(
"submitBtn"
);






if(submitBtn){



submitBtn.onclick = ()=>{



let confirmSubmit =

confirm(

"Submit Test?"

);






if(confirmSubmit){


submitTest();


}



};



}







// ==========================================
// PAGE LOAD
// ==========================================



window.addEventListener(

"load",

()=>{


startTest();


}

);






// ==========================================
// EXPORT
// ==========================================


window.submitTest =

submitTest;



console.log(

"MOCK TEST JS READY ✅"

);
