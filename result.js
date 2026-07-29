import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let score =
Number(localStorage.getItem("score")) || 0;


let total =
Number(localStorage.getItem("totalQuestions")) || 0;



let questions =
JSON.parse(localStorage.getItem("questions")) || [];



let userAnswers =
JSON.parse(localStorage.getItem("userAnswers")) || [];



let testType =
localStorage.getItem("testType") || "Daily";




// Student Details

document.getElementById("studentName").innerHTML =
localStorage.getItem("studentName") || "Student";


document.getElementById("district").innerHTML =
localStorage.getItem("district") || "-";


document.getElementById("testType").innerHTML =
testType;






// Score

document.getElementById("score").innerHTML =

score + " / " + total;



let percentage = 0;


if(total>0){

percentage =
Math.round((score/total)*100);

}



document.getElementById("percentage").innerHTML =

percentage + "%";

// =====================
// XP REWARD SYSTEM
// =====================


let oldXP =
Number(localStorage.getItem("xp")) || 0;


// Correct Answer XP

let answerXP = score * 5;


// Complete Test Bonus

let bonusXP = 30;


// Total XP Earned

let earnedXP =
answerXP + bonusXP;



let newXP =
oldXP + earnedXP;



localStorage.setItem(
"xp",
newXP
);





// Review

const reviewContainer =
document.getElementById("reviewContainer");



reviewContainer.innerHTML = "";





questions.forEach((q,index)=>{
console.log(q);

let userAnswer = userAnswers[index];

let correctAnswerText = "";

if (typeof q.answer === "number") {
    correctAnswerText = q.options[q.answer];
} else if (!isNaN(Number(q.answer))) {
    correctAnswerText = q.options[Number(q.answer)];
} else {
    correctAnswerText = q.answer;
}

let userAnswerText = "Not Answered";

if (userAnswer !== null && userAnswer !== undefined) {
    if (typeof userAnswer === "number") {
        userAnswerText = q.options[userAnswer];
    } else if (!isNaN(Number(userAnswer))) {
        userAnswerText = q.options[Number(userAnswer)];
    } else {
        userAnswerText = userAnswer;
    }
}

let result = Number(userAnswer) === Number(q.answer);



reviewContainer.innerHTML += `


<div class="review-card">


<h3>
${index+1}. ${q.question}
</h3>


<p>

Your Answer:

<b>
${userAnswerText}
</b>

</p>

<p>

Correct Answer:

<b>
${correctAnswerText}
</b>

</p>



<p>

${result ? "✅ Correct" : "❌ Wrong"}

</p>



<p>

💡 Explanation:

${q.explanation || "Explanation not available"}

</p>



</div>


`;



});






// Dashboard Button


document.getElementById("dashboardBtn").onclick=function(){


window.location.href="dashboard.html";


};
