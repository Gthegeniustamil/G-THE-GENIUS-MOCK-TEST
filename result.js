import { db } from "./firebase-config.js";

import {
collection,
addDoc,
serverTimestamp
} 
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// GET DATA FROM LOCAL STORAGE


let score = Number(localStorage.getItem("score")) || 0;

let totalQuestions = 
Number(localStorage.getItem("totalQuestions")) || 0;


let testType = 
localStorage.getItem("testType") || "Daily";



let questions = 
JSON.parse(localStorage.getItem("questions")) || [];


let userAnswers = 
JSON.parse(localStorage.getItem("userAnswers")) || [];





// SCORE DISPLAY


document.getElementById("score").innerHTML =

score + " / " + totalQuestions;




// PERCENTAGE


let percentage = 0;


if(totalQuestions > 0){

percentage = Math.round(
(score / totalQuestions) * 100
);

}


document.getElementById("percentage").innerHTML =

percentage + "%";






// CORRECT WRONG


let wrong = totalQuestions - score;



document.getElementById("correct").innerHTML =
score;



document.getElementById("wrong").innerHTML =
wrong;



document.getElementById("total").innerHTML =
totalQuestions;








// ANSWER REVIEW


let reviewBox = 
document.getElementById("reviewContainer");



questions.forEach((q,index)=>{


let userAnswer = userAnswers[index];



let isCorrect =
userAnswer === q.answer;



let card = document.createElement("div");


card.className="review-card";



card.innerHTML = `


<h3>
${index+1}. ${q.question}
</h3>


<p>

Your Answer:
<b>
${userAnswer !== null && userAnswer !== undefined 
? q.options[userAnswer] 
: "Not Answered"}
</b>

</p>



<p>

Correct Answer:

<b>
${q.options[q.answer]}
</b>

</p>



<p class="${isCorrect ? "correct":"wrong"}">

${isCorrect 
? "✅ Correct Answer" 
: "❌ Wrong Answer"}

</p>



<p>

📖 Explanation:

<br>

${q.explanation}

</p>



`;



reviewBox.appendChild(card);



});

async function saveResult(){


try{


await addDoc(collection(db,"results"),{


studentName:
localStorage.getItem("studentName") || "Student",


district:
localStorage.getItem("district") || "Unknown",


testType:testType,


score:score,


totalQuestions:totalQuestions,


percentage:percentage,


date:serverTimestamp()


});


console.log("Result Saved Successfully");


}

catch(error){

console.log(
"Save Error:",
error
);

}


}



saveResult();
