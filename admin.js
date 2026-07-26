import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { db, auth } from "./firebase-config.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
updateDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveButton = document.getElementById("saveQuestion");
const logoutBtn = document.getElementById("logoutBtn");
const uploadBtn = document.getElementById("uploadBtn");

saveButton.onclick = async function(){

const question = document.getElementById("question").value.trim();

const options = [
document.getElementById("option0").value.trim(),
document.getElementById("option1").value.trim(),
document.getElementById("option2").value.trim(),
document.getElementById("option3").value.trim()
];

const answer = Number(document.getElementById("answer").value);

const explanation =
document.getElementById("explanation").value.trim();

if(question==="" || options.includes("") || isNaN(answer)){

alert("Please fill all fields");
return;

}

try{

await addDoc(collection(db,"questions"),{

question,
options,
answer,
explanation,
createdAt:serverTimestamp()

});

alert("✅ Question Added Successfully");

document.getElementById("question").value="";
document.getElementById("option0").value="";
document.getElementById("option1").value="";
document.getElementById("option2").value="";
document.getElementById("option3").value="";
document.getElementById("answer").value="";
document.getElementById("explanation").value="";

loadQuestions();

}
catch(error){

console.log(error);
alert("❌ Error Saving Question");

}

};

logoutBtn.onclick = async function(){

await signOut(auth);

window.location.href="admin-login.html";

};

// ================= BULK UPLOAD =================

uploadBtn.onclick = async function () {

const text = document.getElementById("bulkJson").value.trim();

if(text === ""){
alert("Paste JSON First");
return;
}

try{

const questions = JSON.parse(text);

let count = 0;

for(const q of questions){

await addDoc(collection(db,"questions"),{

question: q.question,
options: q.options,
answer: q.answer,
explanation: q.explanation,
createdAt: serverTimestamp()

});

count++;

}

document.getElementById("uploadStatus").innerHTML =
"✅ " + count + " Questions Uploaded Successfully";

document.getElementById("bulkJson").value="";

loadQuestions();

}

catch(error){

console.log(error);

document.getElementById("uploadStatus").innerHTML =
"❌ Invalid JSON";

}

};


// ================= LOAD QUESTIONS =================

async function loadQuestions(){

const questionList =
document.getElementById("questionList");

const questionCount =
document.getElementById("questionCount");

questionList.innerHTML = "Loading...";

const snapshot =
await getDocs(collection(db,"questions"));

questionList.innerHTML="";

questionCount.innerHTML =
"📊 Total Questions : " + snapshot.size;

snapshot.forEach((questionDoc)=>{

const q = questionDoc.data();

questionList.innerHTML += `

<div class="question-card">

<h3>${q.question}</h3>

<p>A. ${q.options[0]}</p>
<p>B. ${q.options[1]}</p>
<p>C. ${q.options[2]}</p>
<p>D. ${q.options[3]}</p>

<button onclick="editQuestion('${questionDoc.id}')">
✏️ Edit
</button>

<button onclick="deleteQuestion('${questionDoc.id}')">
🗑 Delete
</button>

</div>

`;

});

}

// ================= DELETE QUESTION =================

window.deleteQuestion = async function(id){

if(confirm("Delete this question?")){

await deleteDoc(doc(db,"questions",id));

loadQuestions();

}

};


// ================= EDIT QUESTION =================

window.editQuestion = async function(id){

const newQuestion = prompt("Enter New Question");

if(newQuestion == null || newQuestion.trim()==""){
return;
}

try{

await updateDoc(doc(db,"questions",id),{

question:newQuestion.trim()

});

alert("✅ Question Updated Successfully");

loadQuestions();

}
catch(error){

console.log(error);

alert("❌ Update Failed");

}

};


// ================= SEARCH QUESTION =================

document.getElementById("searchQuestion").onkeyup = function(){

const value = this.value.toLowerCase();

document.querySelectorAll(".question-card").forEach(card=>{

card.style.display =
card.innerText.toLowerCase().includes(value)
? "block"
: "none";

});

};


// ================= INITIAL LOAD =================

loadQuestions();

// ================= STUDENT RESULTS =================

async function loadResults(){

const resultList = document.getElementById("resultList");
const resultCount = document.getElementById("resultCount");

if(!resultList) return;

resultList.innerHTML = "Loading...";

const snapshot = await getDocs(collection(db,"results"));

resultList.innerHTML = "";

resultCount.innerHTML =
"📊 Total Results : " + snapshot.size;

snapshot.forEach((resultDoc)=>{

const r = resultDoc.data();

resultList.innerHTML += `

<div class="result-card">

<h3>👤 ${r.studentName}</h3>

<p>📍 District : ${r.district}</p>

<p>🎯 Test : ${r.testType}</p>

<p>📝 Score : ${r.score} / ${r.totalQuestions}</p>

<p>📈 Percentage : ${r.percentage}%</p>

<button onclick="deleteResult('${resultDoc.id}')">
🗑 Delete
</button>

</div>

`;

});

}

window.deleteResult = async function(id){

if(confirm("Delete this Result?")){

await deleteDoc(doc(db,"results",id));

loadResults();

}

};


// ================= SEARCH RESULT =================

const searchResult = document.getElementById("searchResult");

if(searchResult){

searchResult.onkeyup = function(){

const value = this.value.toLowerCase();

document.querySelectorAll(".result-card").forEach(card=>{

card.style.display =
card.innerText.toLowerCase().includes(value)
? "block"
: "none";

});

};

}


// ================= INITIAL LOAD =================

loadQuestions();
loadResults();
