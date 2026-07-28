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







// Review

const reviewContainer =
document.getElementById("reviewContainer");



reviewContainer.innerHTML = "";





questions.forEach((q,index)=>{


let userAnswer =
userAnswers[index];



let correct =
q.answer;



let result =
userAnswer === correct;



reviewContainer.innerHTML += `


<div class="review-card">


<h3>
${index+1}. ${q.question}
</h3>


<p>

Your Answer:

<b>
${q.options[userAnswer] || "Not Answered"}
</b>

</p>



<p>

Correct Answer:

<b>
${q.options[correct]}
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
