import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { db, auth } from "./firebase-config.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
updateDoc,
doc,
serverTimestamp,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveButton = document.getElementById("saveQuestion");
const logoutBtn = document.getElementById("logoutBtn");
const uploadBtn = document.getElementById("uploadBtn");

// ================= SINGLE QUESTION SAVE =================

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

// Duplicate Check

const q = query(
collection(db,"questions"),
where("question","==",question)
);

const snapshot = await getDocs(q);

if(!snapshot.empty){

alert("⚠️ Question Already Exists");
return;

}

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

// ================= LOGOUT =================

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

// Existing Questions Load

const snapshot = await getDocs(collection(db,"questions"));

const existingQuestions = new Set();

snapshot.forEach((doc)=>{

const data = doc.data();

if(data.question){

existingQuestions.add(
data.question.trim().toLowerCase()
);

}

});

let added = 0;
let skipped = 0;
let failed = 0;

const total = questions.length;

document.getElementById("uploadStatus").innerHTML =
"⏳ Upload Started...";

uploadBtn.disabled = true;

for(let i=0;i<questions.length;i++){

const q = questions[i];

try{

const questionText =
q.question.trim().toLowerCase();

document.getElementById("uploadStatus").innerHTML =

`
Uploading ${i+1} / ${total}<br>
✅ Added : ${added}<br>
⏭️ Skipped : ${skipped}<br>
❌ Failed : ${failed}
`;

if(existingQuestions.has(questionText)){

skipped++;
continue;

}

await addDoc(collection(db,"questions"),{

question:q.question,

options:q.options,

answer:q.answer,

explanation:q.explanation,

createdAt:serverTimestamp()

});

existingQuestions.add(questionText);

added++;

}
catch(err){

console.log(err);

failed++;

}

}

uploadBtn.disabled = false;

document.getElementById("uploadStatus").innerHTML =

`
<h3>✅ Upload Completed</h3>

<p>📥 Total : ${total}</p>

<p>✅ Added : ${added}</p>

<p>⏭️ Duplicate Skipped : ${skipped}</p>

<p>❌ Failed : ${failed}</p>

`;

document.getElementById("bulkJson").value="";

loadQuestions();

}

  // ================= REMOVE DUPLICATES =================

const removeDuplicateBtn =
document.getElementById("removeDuplicateBtn");

if(removeDuplicateBtn){

removeDuplicateBtn.onclick = async function(){

const ok = confirm(
"Duplicate Questions delete செய்யவா?\n\nஇந்த action-ஐ Undo செய்ய முடியாது."
);

if(!ok) return;

removeDuplicateBtn.disabled = true;
removeDuplicateBtn.innerHTML = "Cleaning...";

try{

const snapshot =
await getDocs(collection(db,"questions"));

const questionMap = new Map();

let deleted = 0;

for(const questionDoc of snapshot.docs){

const data = questionDoc.data();

const key = data.question
.trim()
.toLowerCase();

if(questionMap.has(key)){

await deleteDoc(
doc(db,"questions",questionDoc.id)
);

deleted++;

}
else{

questionMap.set(key,true);

}

}

alert(
"✅ Duplicate Cleaning Completed\n\nDeleted : "
+ deleted
);

loadQuestions();

}
catch(error){

console.log(error);

alert("❌ Error Removing Duplicates");

}

removeDuplicateBtn.disabled = false;
removeDuplicateBtn.innerHTML =
"🧹 Remove Duplicate Questions";

};

}
  
catch(error){

console.log(error);

uploadBtn.disabled=false;

document.getElementById("uploadStatus").innerHTML =
"❌ Invalid JSON";

}

};

