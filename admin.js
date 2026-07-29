// ================= FIREBASE IMPORT =================

import { db, auth } from "./firebase-config.js";


import {
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ================= LOGOUT =================


const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){


logoutBtn.onclick = async()=>{


await signOut(auth);


window.location.href =
"admin-login.html";


};


}




// ================= BULK SUBJECT TOPIC =================


const bulkSubject =
document.getElementById("bulkSubject");


const bulkTopic =
document.getElementById("bulkTopic");



const bulkTopics = {


"General Knowledge":[
"Indian GK",
"World GK",
"Important Days",
"Books and Authors",
"Awards",
"Sports",
"Organizations",
"States and Capitals",
"National Symbols"
],


"Indian Polity":[
"Constitution",
"Fundamental Rights",
"Parliament",
"President",
"Governor",
"Judiciary"
],


"Indian History":[
"Ancient India",
"Medieval India",
"Modern India",
"Freedom Struggle"
],


"Indian Geography":[
"Physical Geography",
"Rivers",
"Climate",
"Soil"
],


"Indian Economy":[
"Banking",
"Budget",
"Tax",
"Finance"
],


"General Science":[
"Physics",
"Chemistry",
"Biology",
"Scientific Facts"
],


"Psychology":[
"Memory",
"Concentration",
"Confidence",
"Stress Management"
],


"Physical Training":[
"Running",
"Long Jump",
"High Jump",
"Rope Climbing"
],


"Current Affairs":[
"National",
"International",
"Sports",
"Awards"
],


"Reasoning":[
"Analogy",
"Series",
"Coding Decoding",
"Blood Relation"
],


"Aptitude":[
"Percentage",
"Profit and Loss",
"Time and Work",
"Ratio"
],


"Computer":[
"Basics",
"Hardware",
"Software",
"Internet"
],


"Tamil":[
"Grammar",
"Literature",
"Authors",
"Poems"
],


"English":[
"Grammar",
"Vocabulary",
"Synonyms",
"Antonyms"
],


"TNUSRB Special":[
"Police GK",
"Police Act",
"Previous Questions"
],


"TNPSC Special":[
"Tamil Nadu GK",
"Government Schemes",
"Previous Questions"
]

};




// LOAD TOPIC


if(bulkSubject && bulkTopic){


bulkSubject.onchange = ()=>{


let subject =
bulkSubject.value;



bulkTopic.innerHTML = `

<option value="">
📂 Select Topic
</option>

`;



if(bulkTopics[subject]){


bulkTopics[subject].forEach(topic=>{


bulkTopic.innerHTML += `

<option value="${topic}">
${topic}
</option>

`;


});


}



};


}

// ================= BULK UPLOAD =================

const uploadBtn = document.getElementById("uploadBtn");
const bulkJson = document.getElementById("bulkJson");
const uploadStatus = document.getElementById("uploadStatus");

if (uploadBtn) {

uploadBtn.onclick = async function () {

const selectedSubject = bulkSubject.value;
const selectedTopic = bulkTopic.value;

if (selectedSubject === "") {
alert("Please Select Subject");
return;
}

if (selectedTopic === "") {
alert("Please Select Topic");
return;
}

const jsonText = bulkJson.value.trim();

if (jsonText === "") {
alert("Paste JSON Questions");
return;
}

try {

const questions = JSON.parse(jsonText);

if (!Array.isArray(questions)) {
alert("JSON must be an Array");
return;
}

uploadBtn.disabled = true;
uploadStatus.innerHTML = "⏳ Uploading...";

const snapshot = await getDocs(
collection(db, "questions")
);

const existingQuestions = new Set();

snapshot.forEach((docSnap) => {

const data = docSnap.data();

if (data.question) {

existingQuestions.add(
data.question.trim().toLowerCase()
);

}

});

let added = 0;
let duplicate = 0;
let failed = 0;

for (const q of questions) {

try {

if (
!q.question ||
!Array.isArray(q.options) ||
q.options.length !== 4
) {

failed++;
continue;

}

const questionText =
q.question.trim().toLowerCase();

if (existingQuestions.has(questionText)) {

duplicate++;
continue;

}

await addDoc(
collection(db, "questions"),
{

question: q.question.trim(),

options: q.options,

answer: Number(q.answer),

explanation:
q.explanation || "",

subject: selectedSubject,

topic: selectedTopic,

createdAt:
serverTimestamp()

}

);

existingQuestions.add(questionText);

added++;

}
catch (err) {

console.error(err);

failed++;

}

}

uploadBtn.disabled = false;

uploadStatus.innerHTML = `

<h3>✅ Upload Completed</h3>

<p>📦 Added : ${added}</p>

<p>⏭️ Duplicate : ${duplicate}</p>

<p>❌ Failed : ${failed}</p>

`;

bulkJson.value = "";

}
catch (error) {

console.error(error);

uploadBtn.disabled = false;

uploadStatus.innerHTML =
"❌ Invalid JSON Format";

}

};

  }

// ================= LOAD QUESTIONS =================

async function loadQuestions() {

const questionList =
document.getElementById("questionList");

const questionCount =
document.getElementById("questionCount");

if(!questionList) return;

questionList.innerHTML = "Loading...";

const snapshot =
await getDocs(collection(db,"questions"));

questionList.innerHTML = "";

if(questionCount){

questionCount.innerHTML =
"📚 Total Questions : " + snapshot.size;

}

snapshot.forEach((questionDoc)=>{

const q = questionDoc.data();

questionList.innerHTML += `

<div class="question-card">

<h3>${q.question}</h3>

<p><b>📚 Subject :</b> ${q.subject || "-"}</p>

<p><b>📂 Topic :</b> ${q.topic || "-"}</p>

<p><b>A.</b> ${q.options[0]}</p>
<p><b>B.</b> ${q.options[1]}</p>
<p><b>C.</b> ${q.options[2]}</p>
<p><b>D.</b> ${q.options[3]}</p>

<p><b>✅ Answer :</b>
${q.options[q.answer]}
</p>

<button onclick="deleteQuestion('${questionDoc.id}')">
🗑 Delete
</button>

</div>

`;

});

}



// ================= DELETE QUESTION =================

window.deleteQuestion = async function(id){

if(!confirm("Delete this Question?")) return;

try{

await deleteDoc(doc(db,"questions",id));

alert("Question Deleted");

loadQuestions();

}
catch(error){

console.error(error);

alert("Delete Failed");

}

};



// ================= SEARCH =================

const searchQuestion =
document.getElementById("searchQuestion");

if(searchQuestion){

searchQuestion.onkeyup=function(){

const value =
this.value.toLowerCase();

document.querySelectorAll(".question-card")
.forEach(card=>{

card.style.display =
card.innerText
.toLowerCase()
.includes(value)
? "block"
: "none";

});

};

}



// ================= DASHBOARD STATS =================

async function loadDashboardStats(){

const totalQuestions =
document.getElementById("totalQuestions");

if(!totalQuestions) return;

const snapshot =
await getDocs(collection(db,"questions"));

totalQuestions.innerHTML =
snapshot.size;

}



// ================= PAGE LOAD =================

window.addEventListener(
"DOMContentLoaded",
async()=>{

await loadQuestions();

await loadDashboardStats();

}
);
