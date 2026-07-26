import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
let allQuestions = [];

let testQuestions = [];

let currentQuestion = 0;

let selectedAnswers = [];

let testType = "daily";

let totalQuestions = 10;


// GET TEST TYPE FROM URL

const urlParams = new URLSearchParams(window.location.search);

testType = urlParams.get("type") || "daily";



// SET QUESTION COUNT

if(testType === "daily"){

    totalQuestions = 10;

    document.getElementById("testType").innerHTML =
    "🟢 Daily Mock Test";

}


else if(testType === "weekly"){

    totalQuestions = 25;

    document.getElementById("testType").innerHTML =
    "🟡 Weekly Mock Test";

}


else if(testType === "monthly"){

    totalQuestions = 100;

    document.getElementById("testType").innerHTML =
    "🔴 Monthly Grand Test";

}





// LOAD QUESTIONS JSON


async function loadQuestions(){

try{

const snapshot = await getDocs(
collection(db,"questions")
);

allQuestions=[];

snapshot.forEach((doc)=>{
allQuestions.push(doc.data());
});


testQuestions =
allQuestions
.sort(()=>Math.random()-0.5)
.slice(0,totalQuestions);


selectedAnswers =
new Array(testQuestions.length)
.fill(null);


showQuestion();



createPalette();
}

catch(error){

console.log(error);

}

}


// START
loadQuestions();


// DISPLAY QUESTION
function showQuestion(){

if(testQuestions.length === 0){

document.getElementById("questionText").innerHTML =
"No Questions Available";

return;

}
    
let q = testQuestions[currentQuestion];



document.getElementById("questionNumber").innerHTML =

"Question " + (currentQuestion + 1) +
" / " + testQuestions.length;



document.getElementById("questionText").innerHTML =

q.question;



let optionContainer = 
document.getElementById("options");


optionContainer.innerHTML = "";





q.options.forEach((option,index)=>{


let button = document.createElement("button");


button.className="option";


button.innerHTML = option;




// CHECK SELECTED ANSWER

if(selectedAnswers[currentQuestion] === index){

button.classList.add("selected");

}




button.onclick = function(){


selectedAnswers[currentQuestion] = index;


showQuestion();


};




optionContainer.appendChild(button);



});



}







// NEXT BUTTON


document.getElementById("nextBtn")
.onclick=function(){


if(currentQuestion < testQuestions.length-1){


currentQuestion++;


showQuestion();


}


};







// PREVIOUS BUTTON


document.getElementById("previousBtn")
.onclick=function(){


if(currentQuestion > 0){


currentQuestion--;


showQuestion();


}


};




// START TIMER

function startTimer(){


timer = setInterval(function(){


let minutes = Math.floor(timeLeft / 60);

let seconds = timeLeft % 60;



document.getElementById("timer").innerHTML =

minutes + ":" + 
(seconds < 10 ? "0" : "") +
seconds;



timeLeft--;



// AUTO SUBMIT

if(timeLeft < 0){


clearInterval(timer);

submitTest();


}



},1000);



}





// SUBMIT TEST



function submitTest(){


clearInterval(timer);



let score = 0;



testQuestions.forEach((question,index)=>{


if(selectedAnswers[index] === question.answer){


score++;


}



});





// SAVE RESULT


localStorage.setItem(
"score",
score
);



localStorage.setItem(
"totalQuestions",
testQuestions.length
);



localStorage.setItem(
"testType",
testType
);



localStorage.setItem(
"questions",
JSON.stringify(testQuestions)
);



localStorage.setItem(
"userAnswers",
JSON.stringify(selectedAnswers)
);





// GO RESULT PAGE


window.location.href="result.html";



}

// QUESTION PALETTE


function createPalette(){


let palette = document.createElement("div");

palette.id = "questionPalette";


testQuestions.forEach((q,index)=>{


let btn = document.createElement("button");


btn.innerHTML = index + 1;


btn.className="palette-btn";



btn.onclick=function(){


currentQuestion = index;


showQuestion();


};




palette.appendChild(btn);



});



document
.querySelector(".question-box")
.insertBefore(
palette,
document.getElementById("questionText")
);



}





// UPDATE PALETTE STATUS


function updatePalette(){


let buttons =
document.querySelectorAll(".palette-btn");



buttons.forEach((btn,index)=>{


btn.classList.remove(
"answered",
"active"
);



if(selectedAnswers[index] !== null){

btn.classList.add("answered");

}



if(index === currentQuestion){

btn.classList.add("active");

}


});



}





// MODIFY SHOW QUESTION


let oldShowQuestion = showQuestion;


showQuestion = function(){


oldShowQuestion();


updatePalette();


};





// SUBMIT CONFIRMATION


function confirmSubmit(){


let unanswered = selectedAnswers.filter(
answer => answer === null
).length;



if(unanswered > 0){


let result = confirm(

unanswered +
" questions unanswered.\nSubmit Test?"

);



if(result){

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

