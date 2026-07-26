const score = Number(localStorage.getItem("score")) || 0;
const totalQuestions = Number(localStorage.getItem("totalQuestions")) || 0;

const questions =
JSON.parse(localStorage.getItem("questions")) || [];

const userAnswers =
JSON.parse(localStorage.getItem("userAnswers")) || [];

document.getElementById("score").innerHTML =
score + " / " + totalQuestions;

document.getElementById("percentage").innerHTML =
Math.round((score / totalQuestions) * 100) + "%";

const reviewContainer =
document.getElementById("reviewContainer");

questions.forEach((q,index)=>{

const userAnswer = userAnswers[index];

const correct = userAnswer === q.answer;

reviewContainer.innerHTML += `

<div class="review-card">

<h3>Q${index+1}. ${q.question}</h3>

<p>
<b>Your Answer :</b>
${userAnswer!=null ? q.options[userAnswer] : "Not Answered"}
</p>

<p style="color:green">
<b>Correct Answer :</b>
${q.options[q.answer]}
</p>

<p>
<b>Explanation :</b>
${q.explanation}
</p>

<p style="font-weight:bold;
color:${correct ? "green" : "red"}">

${correct ? "✅ Correct" : "❌ Wrong"}

</p>

</div>

`;

});
