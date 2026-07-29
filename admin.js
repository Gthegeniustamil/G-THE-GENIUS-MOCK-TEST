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

// ================= ELEMENTS =================

const saveButton = document.getElementById("saveQuestion");
const logoutBtn = document.getElementById("logoutBtn");
const uploadBtn = document.getElementById("uploadBtn");
// ================= SUBJECT TOPIC SYSTEM =================

const subjectSelect = document.getElementById("subject");
const topicSelect = document.getElementById("topic");


const topics = {
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
"Indian Rivers",
"Climate",
"Soil"
],


"Science":[
"Physics",
"Chemistry",
"Biology",
"General Science"
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
"Rope Climbing",
"Endurance"
],


"Current Affairs":[
"National",
"International",
"Sports",
"Awards"
]

};



// Subject Change

if(subjectSelect){

subjectSelect.onchange = function(){

let selected = this.value;


topicSelect.innerHTML =
`
<option value="">
📂 Select Topic
</option>
`;


if(topics[selected]){

topics[selected].forEach(topic=>{


topicSelect.innerHTML +=
`
<option value="${topic}">
${topic}
</option>
`;


});


}


};


}
// ================= SAVE SINGLE QUESTION =================

saveButton.onclick = async function () {

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

  if (
    question === "" ||
    options.includes("") ||
    isNaN(answer)
  ) {
    alert("Please fill all fields");
    return;
  }

  try {

    // Duplicate Check

    const duplicateQuery = query(
      collection(db, "questions"),
      where("question", "==", question)
    );

    const duplicateSnapshot =
      await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {

      alert("⚠️ Question Already Exists");
      return;

    }

    await addDoc(collection(db, "questions"), {

      question: question,
      options: options,
      answer: answer,
      explanation: explanation,
      createdAt: serverTimestamp()

    });

    alert("✅ Question Added Successfully");

    document.getElementById("question").value = "";
    document.getElementById("option0").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("answer").value = "";
    document.getElementById("explanation").value = "";

    loadQuestions();

  } catch (error) {

    console.error(error);

    alert("❌ Error Saving Question");

  }

};

// ================= LOGOUT =================

logoutBtn.onclick = async function () {

  await signOut(auth);

  window.location.href = "admin-login.html";

};

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
"States and Capitals",
"National Symbols"
],


"Indian Polity":[
"Constitution",
"Fundamental Rights",
"Directive Principles",
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
"Soil",
"Natural Resources"
],


"Indian Economy":[
"Banking",
"Budget",
"Tax",
"Finance",
"Economy Basics"
],


"General Science":[
"Physics",
"Chemistry",
"Biology",
"Scientific Facts"
],


"Physics":[
"Motion",
"Force",
"Energy",
"Electricity",
"Light"
],


"Chemistry":[
"Atoms",
"Elements",
"Acids and Bases",
"Chemical Reactions"
],


"Biology":[
"Human Body",
"Plants",
"Animals",
"Diseases"
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


"Current Affairs":[
"National",
"International",
"Sports",
"Awards",
"Appointments"
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
"Rope Climbing",
"Endurance"
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



// Subject Change Event

if(bulkSubject){

bulkSubject.onchange = function(){

let selected = this.value;


bulkTopic.innerHTML = `
<option value="">
📂 Select Topic
</option>
`;


if(bulkTopics[selected]){


bulkTopics[selected].forEach(function(topic){


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

uploadBtn.onclick = async function () {

  const bulkJson =
    document.getElementById("bulkJson");

  const uploadStatus =
    document.getElementById("uploadStatus");
const selectedSubject =
document.getElementById("bulkSubject").value;


const selectedTopic =
document.getElementById("bulkTopic").value;


if(selectedSubject === "" || selectedTopic === ""){

alert("Please Select Subject and Topic");

return;

}
  
  
  const text = bulkJson.value.trim();

  if (text === "") {

    alert("Paste JSON First");

    return;

  }

  try {

    const questions = JSON.parse(text);

    if (!Array.isArray(questions)) {

      alert("JSON must be an Array");

      return;

    }

    // Load Existing Questions

    const snapshot =
      await getDocs(collection(db, "questions"));

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
    let skipped = 0;
    let failed = 0;

    const total = questions.length;

    uploadBtn.disabled = true;

    uploadStatus.innerHTML =
      "⏳ Upload Started...";

    for (let i = 0; i < total; i++) {

      const q = questions[i];

      uploadStatus.innerHTML = `
      <b>Uploading...</b><br>
      ${i + 1} / ${total}<br><br>

      ✅ Added : ${added}<br>
      ⏭️ Skipped : ${skipped}<br>
      ❌ Failed : ${failed}
      `;

      try {

        if (
          !q.question ||
          !q.options ||
          !Array.isArray(q.options) ||
          q.options.length !== 4
        ) {

          failed++;

          continue;

        }

        const questionText =
          q.question.trim().toLowerCase();

        if (existingQuestions.has(questionText)) {

          skipped++;

          continue;

        }

        await addDoc(
          collection(db, "questions"),
          {

            question: q.question.trim(),

            options: q.options,

            answer: q.answer,

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

      } catch (err) {

        console.error(err);

        failed++;

      }

    }

    uploadBtn.disabled = false;

    uploadStatus.innerHTML = `

    <h3>✅ Upload Completed</h3>

    <p>📦 Total : ${total}</p>

    <p>✅ Added : ${added}</p>

    <p>⏭️ Duplicate : ${skipped}</p>

    <p>❌ Failed : ${failed}</p>

    `;

    bulkJson.value = "";

    loadQuestions();

  }

  catch (error) {

    console.error(error);

    uploadBtn.disabled = false;

    uploadStatus.innerHTML =
      "❌ Invalid JSON Format";

  }

};

// ================= LOAD QUESTIONS =================

async function loadQuestions() {

  const questionList =
    document.getElementById("questionList");

  const questionCount =
    document.getElementById("questionCount");

  questionList.innerHTML = "Loading...";

  const snapshot =
    await getDocs(collection(db, "questions"));

  questionList.innerHTML = "";

  questionCount.innerHTML =
    "📊 Total Questions : " + snapshot.size;

  snapshot.forEach((questionDoc) => {

    const q = questionDoc.data();

    questionList.innerHTML += `

<div class="question-card">

<h3>${q.question}</h3>

<p><b>A.</b> ${q.options[0]}</p>
<p><b>B.</b> ${q.options[1]}</p>
<p><b>C.</b> ${q.options[2]}</p>
<p><b>D.</b> ${q.options[3]}</p>

<p><b>✅ Answer :</b> ${
typeof q.answer === "number"
? q.options[q.answer]
: q.answer
}</p>

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

const ok = confirm(
"Delete this Question?"
);

if(!ok) return;

try{

await deleteDoc(doc(db,"questions",id));

alert("✅ Question Deleted");

loadQuestions();

}
catch(error){

console.error(error);

alert("❌ Delete Failed");

}

};

// ================= FULL EDIT QUESTION =================

window.editQuestion = async function(id){

try{

const snapshot =
await getDocs(collection(db,"questions"));

let current = null;

snapshot.forEach(docSnap=>{

if(docSnap.id===id){

current = docSnap.data();

}

});

if(current===null){

alert("Question Not Found");

return;

}

const question =
prompt("Question",current.question);

if(question===null) return;

const option0 =
prompt("Option A",current.options[0]);

if(option0===null) return;

const option1 =
prompt("Option B",current.options[1]);

if(option1===null) return;

const option2 =
prompt("Option C",current.options[2]);

if(option2===null) return;

const option3 =
prompt("Option D",current.options[3]);

if(option3===null) return;

const answer =
Number(
prompt(
"Correct Answer Index (0-3)",
current.answer
)
);

if(isNaN(answer)){

alert("Invalid Answer");

return;

}

const explanation =
prompt(
"Explanation",
current.explanation || ""
);

if(explanation===null) return;

await updateDoc(doc(db,"questions",id),{

question:question.trim(),

options:[
option0.trim(),
option1.trim(),
option2.trim(),
option3.trim()
],

answer:answer,

explanation:explanation.trim()

});

alert("✅ Question Updated");

loadQuestions();

}
catch(error){

console.error(error);

alert("❌ Update Failed");

}

};

// ================= SEARCH QUESTION =================

const searchQuestion =
document.getElementById("searchQuestion");

if(searchQuestion){

searchQuestion.onkeyup = function(){

const value = this.value.toLowerCase();

document.querySelectorAll(".question-card").forEach(card=>{

card.style.display =
card.innerText.toLowerCase().includes(value)
? "block"
: "none";

});

};

}

// ================= STUDENT RESULTS =================

async function loadResults(){

const resultList =
document.getElementById("resultList");

const resultCount =
document.getElementById("resultCount");

if(!resultList) return;

resultList.innerHTML = "Loading...";

const snapshot =
await getDocs(collection(db,"results"));

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

// ================= DELETE RESULT =================

window.deleteResult = async function(id){

if(!confirm("Delete this Result?")) return;

try{

await deleteDoc(doc(db,"results",id));

alert("✅ Result Deleted");

loadResults();

}
catch(error){

console.error(error);

alert("❌ Delete Failed");

}

};

// ================= SEARCH RESULT =================

const searchResult =
document.getElementById("searchResult");

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

// ================= REMOVE DUPLICATE QUESTIONS =================

const removeDuplicateBtn =
document.getElementById("removeDuplicateBtn");

if(removeDuplicateBtn){

removeDuplicateBtn.onclick = async function(){

if(!confirm(
"Duplicate Questions remove செய்யவா?"
)) return;

removeDuplicateBtn.disabled = true;
removeDuplicateBtn.innerHTML = "⏳ Cleaning...";

try{

const snapshot =
await getDocs(collection(db,"questions"));

const questionMap = new Map();

let deleted = 0;

for(const questionDoc of snapshot.docs){

const data = questionDoc.data();

const key =
data.question.trim().toLowerCase();

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
`✅ Duplicate Cleaning Completed

Deleted : ${deleted}`
);

loadQuestions();

}
catch(error){

console.error(error);

alert("❌ Cleaning Failed");

}

removeDuplicateBtn.disabled = false;
removeDuplicateBtn.innerHTML =
"🧹 Remove Duplicate Questions";

};

}

// ================= SORT QUESTIONS (LATEST FIRST) =================

async function refreshQuestions(){

    await loadQuestions();

}

// ================= REFRESH RESULTS =================

async function refreshResults(){

    await loadResults();

}

// ================= SAFE INITIAL LOAD =================

window.addEventListener("DOMContentLoaded", async () => {

    try{

        await refreshQuestions();

    }catch(error){

        console.error("Question Load Error :", error);

    }

    try{

        await refreshResults();

    }catch(error){

        console.error("Result Load Error :", error);

    }

});

// ================= AUTO REFRESH AFTER 30 SECONDS =================

setInterval(async()=>{

    try{

        await refreshQuestions();

    }catch(error){}

},30000);

// ================= GLOBAL ERROR HANDLER =================

window.onerror = function(message, source, line, column, error){

    console.error("JavaScript Error");

    console.error(message);

    console.error(source);

    console.error(line);

    console.error(column);

    console.error(error);

};

// ================= ADMIN READY =================

console.log("✅ G THE GENIUS ADMIN PANEL READY");

loadDashboardStats();

/* DASHBOARD STATS */
// ================= DASHBOARD STATS =================

async function loadDashboardStats(){

try{

// Questions Count

const questionSnap =
await getDocs(collection(db,"questions"));

const totalQuestions =
document.getElementById("totalQuestions");

if(totalQuestions){

totalQuestions.innerHTML =
questionSnap.size;

}


// Results Count

const resultSnap =
await getDocs(collection(db,"results"));

const totalResults =
document.getElementById("totalResults");

if(totalResults){

totalResults.innerHTML =
resultSnap.size;

}


// Unique Students

let students = new Set();


resultSnap.forEach((doc)=>{

const data = doc.data();

if(data.studentName){

students.add(data.studentName);

}

});


const totalStudents =
document.getElementById("totalStudents");


if(totalStudents){

totalStudents.innerHTML =
students.size;

}


}
catch(error){

console.log(
"Dashboard Error:",
error
);

}

}

// ================= STUDENTS LIST =================

async function loadStudentsList(){

const studentList =
document.getElementById("studentList");

if(!studentList) return;


const snapshot =
await getDocs(collection(db,"results"));


let students = {};


snapshot.forEach((docSnap)=>{

const data = docSnap.data();

const name = data.studentName;

if(!name) return;


if(!students[name]){

students[name]={

name:name,

district:data.district || "N/A",

tests:1,

bestMark:data.score || 0,

totalQuestions:data.totalQuestions || 0

};

}
else{


students[name].tests++;


if((data.score || 0) > students[name].bestMark){

students[name].bestMark =
data.score;

students[name].totalQuestions =
data.totalQuestions;

}


}


});



studentList.innerHTML="";


Object.values(students).forEach((s,index)=>{


studentList.innerHTML += `

<div class="result-card">

<h3>
👤 ${index+1}. ${s.name}
</h3>

<p>
📍 District : ${s.district}
</p>

<p>
📝 Tests Taken : ${s.tests}
</p>

<p>
🎯 Best Mark : ${s.bestMark} / ${s.totalQuestions}
</p>


</div>

`;


});


}



// ================= ADMIN LEADERBOARD =================


async function loadAdminLeaderboard(){

const leaderboardList =
document.getElementById("leaderboardList");


if(!leaderboardList) return;



const snapshot =
await getDocs(collection(db,"results"));


let students = {};



snapshot.forEach((docSnap)=>{


const data = docSnap.data();

const name = data.studentName;


if(!name) return;



if(!students[name] ||
(data.score || 0) > students[name].mark){


students[name]={

name:name,

district:data.district || "N/A",

mark:data.score || 0,

total:data.totalQuestions || 0

};


}



});



let ranking =
Object.values(students);



ranking.sort((a,b)=>
b.mark - a.mark
);



leaderboardList.innerHTML="";



ranking.forEach((s,index)=>{


let medal="";

if(index===0) medal="🥇";
else if(index===1) medal="🥈";
else if(index===2) medal="🥉";



leaderboardList.innerHTML += `

<div class="result-card">

<h3>
${medal} ${index+1}. ${s.name}
</h3>

<p>
📍 District : ${s.district}
</p>

<p>
🎯 Mark : ${s.mark} / ${s.total}
</p>


</div>

`;



});


}



// ================= LOAD EXTRA SECTIONS =================


window.addEventListener("DOMContentLoaded",()=>{

loadStudentsList();

loadAdminLeaderboard();

});
