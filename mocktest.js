
// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// MOCKTEST JS TOPIC FILTER UPDATE
// PART 1 / 5
// ==========================================



import { db } from "./firebase-config.js";


import {

collection,

getDocs,

query,

where

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// URL DATA


const urlParams =
new URLSearchParams(
window.location.search
);



const selectedCategory =
urlParams.get("category");



const selectedTopic =
urlParams.get("topic");







console.log(
"Category:",
selectedCategory
);



console.log(
"Topic:",
selectedTopic
);








// QUESTIONS ARRAY


let questions = [];

let currentQuestion = 0;

let selectedAnswers = [];






// ==========================================
// LOAD QUESTIONS
// ==========================================


async function loadQuestions(){


try{


let qRef =
collection(
db,
"questions"
);




let snap;



// Topic Practice Test


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



snap =
await getDocs(q);


}





// Normal Mock Test


else{


snap =
await getDocs(qRef);


}






questions=[];





snap.forEach(doc=>{


questions.push({

id:doc.id,

...doc.data()

});


});







console.log(
"Loaded Questions:",
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
// TEST TYPE SETTINGS
// PART 2 / 5
// ==========================================



const testType =
urlParams.get("type") || "topic";



let totalQuestions = 10;

let timeLimit = 5 * 60;





if(testType === "daily"){


totalQuestions = 10;


timeLimit = 5 * 60;


}





else if(testType === "weekly"){


totalQuestions = 25;


timeLimit = 10 * 60;


}





else if(testType === "monthly"){


totalQuestions = 100;


timeLimit = 60 * 60;


}







// ==========================================
// SHUFFLE QUESTIONS
// ==========================================



function shuffleQuestions(array){


return array.sort(

()=>Math.random() - 0.5

);


}







// ==========================================
// SELECT QUESTIONS
// ==========================================



function prepareQuestions(){



questions = shuffleQuestions(
questions
);





if(
questions.length > totalQuestions
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
).fill(null);






console.log(

"Test Questions Ready:",
questions.length

);



}


// ==========================================
// QUESTION DISPLAY SYSTEM
// PART 3 / 5
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







// ==========================================
// SHOW QUESTION
// ==========================================



function showQuestion(){



if(!questions.length)

return;






let q =
questions[currentQuestion];






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







if(questionText){


questionText.innerText =
q.question;


}






if(optionsBox){


optionsBox.innerHTML="";



q.options.forEach(option=>{



let button =
document.createElement("button");



button.className =
"option-btn";



button.innerText =
option;






if(
selectedAnswers[currentQuestion]
=== option

){


button.classList.add(
"selected"
);


}






button.onclick = ()=>{


selectedAnswers[currentQuestion]
=
option;



showQuestion();


};






optionsBox.appendChild(
button
);



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
questions.length-1

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
// TIMER + RESULT CALCULATION
// PART 4 / 5
// ==========================================



let timer;


let remainingTime =
timeLimit;







const timerBox =
document.getElementById(
"timer"
);






// ==========================================
// START TIMER
// ==========================================


function startTimer(){



timer =
setInterval(()=>{



let minutes =
Math.floor(
remainingTime / 60
);



let seconds =
remainingTime % 60;





if(timerBox){


timerBox.innerText =

"⏰ "

+
String(minutes).padStart(2,"0")

+
":"

+
String(seconds).padStart(2,"0");


}







remainingTime--;






if(remainingTime < 0){



clearInterval(timer);


submitTest();



}



},1000);



}







// ==========================================
// CALCULATE SCORE
// ==========================================


function calculateScore(){



let score = 0;




questions.forEach(
(q,index)=>{



if(
selectedAnswers[index]
===
q.answer

){


score++;


}



});




return score;



}







// ==========================================
// SUBMIT TEST
// ==========================================


function submitTest(){



clearInterval(timer);





let score =
calculateScore();






let percentage =

(
score /
questions.length

)
*
100;






localStorage.setItem(

"lastScore",

score

);




localStorage.setItem(

"lastPercentage",

percentage.toFixed(2)

);







console.log({

score,

percentage

});





window.location.href =

"result.html";



}


// ==========================================
// FINAL TEST INITIALIZATION
// PART 5 / 5 FINAL
// ==========================================





// ==========================================
// START MOCK TEST
// ==========================================


async function startTest(){



await loadQuestions();





if(
questions.length === 0

){


alert(
"No Questions Available"
);


return;


}





prepareQuestions();





showQuestion();





startTimer();





console.log(

"G THE GENIUS MOCK TEST STARTED"

);



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
