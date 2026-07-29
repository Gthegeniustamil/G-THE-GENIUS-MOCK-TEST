import {
collection,
getDocs,
query,
where,
addDoc,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, auth } from "./firebase-config.js";

import {

// =========================
// SUBJECT → TOPIC DATA
// =========================

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
"Awards"
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

// =========================
// ELEMENTS
// =========================

const subjectCards =
document.querySelectorAll(".subject-card");

// =========================
// SUBJECT CLICK
// =========================

subjectCards.forEach(card=>{

card.onclick=function(){

const subject =
this.dataset.subject;

localStorage.setItem(
"selectedSubject",
subject
);

showTopics(subject);

};

});

// =========================
// SHOW TOPICS
// =========================

function showTopics(subject){

const list = topics[subject];

if(!list){

alert("No Topics Found");

return;

}

let html="";

list.forEach(topic=>{

html += `

<div class="subject-card topic-card"
data-topic="${topic}">

📂

<span>${topic}</span>

</div>

`;

});

document

  
// =========================
// TOPIC CLICK EVENTS
// =========================

function loadTopicEvents(){

const topicCards =
document.querySelectorAll(".topic-card");


topicCards.forEach(card=>{


card.onclick = async function(){


const topic =
this.dataset.topic;


const subject =
localStorage.getItem("selectedSubject");


localStorage.setItem(
"selectedTopic",
topic
);


await startPractice(
subject,
topic
);


};


});


}



// =========================
// START PRACTICE
// =========================

async function startPractice(subject,topic){


try{


const qRef =
collection(db,"questions");


const qQuery =
query(
qRef,
where("subject","==",subject),
where("topic","==",topic)
);



const snapshot =
await getDocs(qQuery);



let questions=[];



snapshot.forEach(doc=>{


questions.push({

id:doc.id,
...doc.data()

});


});



if(questions.length===0){


alert(
"No Questions Available for this Topic"
);


return;


}



// Random Questions

questions =
questions
.sort(
()=>Math.random()-0.5
)
.slice(0,20);




localStorage.setItem(

"practiceQuestions",

JSON.stringify(questions)

);



localStorage.setItem(
"currentQuestion",
0
);



localStorage.setItem(
"practiceScore",
0
);



openPracticeScreen();



}


catch(error){


console.error(error);


alert(
"Error Loading Questions"
);


}



}



// =========================
// OPEN QUESTION SCREEN
// =========================


function openPracticeScreen(){


document.querySelector(".subject-grid")
.innerHTML = `



<div class="practice-box">


<div class="progress-area">

<h3 id="progressText">
Question 1 / 20
</h3>


<div class="progress-bar">

<div id="progressFill"></div>

</div>


</div>



<div id="questionArea">

</div>



<button id="nextBtn" class="btn">

Next Question ➡️

</button>



</div>


`;



showQuestion();


}



// =========================
// SHOW QUESTION
// =========================

function showQuestion(){


const questions =
JSON.parse(
localStorage.getItem(
"practiceQuestions"
)
);



let index =
Number(
localStorage.getItem(
"currentQuestion"
)
);



const q =
questions[index];



if(!q){

finishPractice();

return;

}



document.getElementById(
"progressText"
).innerHTML =

`Question ${index+1} / ${questions.length}`;



document.getElementById(
"questionArea"
).innerHTML = `


<h3>

${q.question}

</h3>


<div class="options">


<button class="option"
data-answer="0">

A. ${q.options[0]}

</button>


<button class="option"
data-answer="1">

B. ${q.options[1]}

</button>


<button class="option"
data-answer="2">

C. ${q.options[2]}

</button>


<button class="option"
data-answer="3">

D. ${q.options[3]}

</button>


</div>



<p id="explanation"></p>


`;



loadOptionEvents(q);



updateProgress(
index+1,
questions.length
);


}


// =========================
// PROGRESS BAR
// =========================

function updateProgress(current,total){


let percent =
(current/total)*100;


const bar =
document.getElementById(
"progressFill"
);


if(bar){

bar.style.width =
percent+"%";

}


}

/* =========================
   OPTION CLICK EVENTS
========================= */

function loadOptionEvents(q){


const options =
document.querySelectorAll(".option");


options.forEach(option=>{


option.onclick=function(){


const selected =
Number(
this.dataset.answer
);


checkAnswer(
q,
selected
);


};


});


}



/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(q,selected){


const correct =
Number(q.answer);



const explanation =
document.getElementById(
"explanation"
);



document.querySelectorAll(
".option"
).forEach(btn=>{

btn.disabled=true;


});



if(selected === correct){


thisScoreUpdate();


document.querySelector(
`.option[data-answer="${correct}"]`
)
.style.border =
"2px solid #00ff7f";



explanation.innerHTML = `

<h3 style="color:#00ff7f">

✅ Correct Answer

</h3>

<p>
+5 XP Earned ⭐
</p>


<p>

${q.explanation || ""}

</p>

`;


}

else{


document.querySelector(
`.option[data-answer="${selected}"]`
)
.style.border =
"2px solid red";



document.querySelector(
`.option[data-answer="${correct}"]`
)
.style.border =
"2px solid #00ff7f";



explanation.innerHTML = `

<h3 style="color:red">

❌ Wrong Answer

</h3>


<p>
✅ Correct :
${q.options[correct]}
</p>


<p>

${q.explanation || ""}

</p>

`;



}



saveContinueProgress();



}




/* =========================
   XP SYSTEM
========================= */


function thisScoreUpdate(){


let xp =
Number(
localStorage.getItem("xp")
) || 0;



xp +=5;



localStorage.setItem(
"xp",
xp
);



let score =
Number(
localStorage.getItem(
"practiceScore"
)
)||0;



score++;


localStorage.setItem(
"practiceScore",
score
);



}



/* =========================
   NEXT BUTTON
========================= */


document.addEventListener(
"click",
function(e){


if(
e.target.id==="nextBtn"
){


let index =
Number(
localStorage.getItem(
"currentQuestion"
)
);



index++;



localStorage.setItem(
"currentQuestion",
index
);



showQuestion();



}



});




/* =========================
 BOOKMARK
========================= */


function addBookmark(question){


let bookmarks =
JSON.parse(
localStorage.getItem(
"bookmarks"
)
)||[];



bookmarks.push(question);



localStorage.setItem(
"bookmarks",
JSON.stringify(bookmarks)
);



alert(
"⭐ Bookmark Added"
);


}





/* =========================
 CONTINUE PRACTICE SAVE
========================= */


function saveContinueProgress(){


const data={


subject:
localStorage.getItem(
"selectedSubject"
),


topic:
localStorage.getItem(
"selectedTopic"
),


question:
localStorage.getItem(
"currentQuestion"
),


questions:
localStorage.getItem(
"practiceQuestions"
),


time:
new Date()
.toISOString()


};



localStorage.setItem(

"continuePractice",

JSON.stringify(data)

);



}




/* =========================
 FINISH PRACTICE
========================= */


async function finishPractice(){


let score =
localStorage.getItem(
"practiceScore"
)||0;



let questions =
JSON.parse(
localStorage.getItem(
"practiceQuestions"
)
)||[];



document.querySelector(
".subject-grid"
).innerHTML = `


<div class="welcome-card">


<h2>
🎉 Practice Completed
</h2>


<h3>

Score :
${score} / ${questions.length}

</h3>


<p>

XP Earned:
${score*5}

⭐

</p>


<button class="btn"
onclick="location.reload()">

Practice Again

</button>


</div>


`;



await savePracticeHistory(
score,
questions.length
);



}



/* =========================
 FIREBASE PRACTICE HISTORY
========================= */


async function savePracticeHistory(
score,total
){


try{


const user =
auth.currentUser;



if(!user) return;



await addDoc(

collection(
db,
"practiceHistory"
),

{


studentId:
user.uid,


subject:
localStorage.getItem(
"selectedSubject"
),


topic:
localStorage.getItem(
"selectedTopic"
),


score:score,


totalQuestions:
total,


xpEarned:
score*5,


date:
new Date()



}


);



}

catch(error){

console.log(error);

}



  }

// =========================
// DAILY STREAK SYSTEM
// =========================


function updateDailyStreak(){

let today =
new Date().toDateString();


let lastDate =
localStorage.getItem(
"lastPracticeDate"
);


let streak =
Number(
localStorage.getItem(
"practiceStreak"
)
)||0;



if(lastDate !== today){


if(lastDate){


let last =
new Date(lastDate);


let current =
new Date(today);


let diff =
(current-last)/(1000*60*60*24);



if(diff === 1){

streak++;

}
else{

streak=1;

}


}
else{

streak=1;

}


localStorage.setItem(
"practiceStreak",
streak
);


localStorage.setItem(
"lastPracticeDate",
today
);


}


return streak;


}



// =========================
// SUBJECT BADGE SYSTEM
// =========================


function checkSubjectBadge(){


let subject =
localStorage.getItem(
"selectedSubject"
);


let count =
Number(
localStorage.getItem(
subject+"_count"
)
)||0;



count++;



localStorage.setItem(
subject+"_count",
count
);



let badge="";


if(count >=100){

badge="💎 Diamond Master";

}

else if(count>=50){

badge="🥇 Gold Master";

}

else if(count>=25){

badge="🥈 Silver Master";

}

else if(count>=10){

badge="🥉 Bronze Master";

}



if(badge){


let badges =
JSON.parse(
localStorage.getItem(
"badges"
)
)||[];



if(!badges.includes(
subject+" "+badge
)){


badges.push(
subject+" "+badge
);


localStorage.setItem(
"badges",
JSON.stringify(badges)
);


showBadgePopup(
subject,
badge
);


}



}



}



// =========================
// BADGE POPUP
// =========================


function showBadgePopup(
subject,
badge
){


alert(

"🏆 Badge Unlocked!\n\n"+
subject+
"\n"+
badge

);


}




// =========================
// WRONG QUESTION SAVE
// =========================


function saveWrongQuestion(q){


let wrong =
JSON.parse(
localStorage.getItem(
"wrongQuestions"
)
)||[];



wrong.push(q);



localStorage.setItem(

"wrongQuestions",

JSON.stringify(wrong)

);


}




// =========================
// CONTINUE PRACTICE CHECK
// =========================


function checkContinuePractice(){


let data =
localStorage.getItem(
"continuePractice"
);



if(!data) return;



let practice =
JSON.parse(data);



let result =
confirm(

"▶ Continue Previous Practice?\n\n"+
practice.subject+
"\n"+
practice.topic

);



if(result){


localStorage.setItem(
"practiceQuestions",
practice.questions
);


localStorage.setItem(
"currentQuestion",
practice.question
);


showQuestion();


}



}



// =========================
// ANALYTICS
// =========================


function updateAnalytics(){


let total =
Number(
localStorage.getItem(
"totalPractice"
)
)||0;


total++;



localStorage.setItem(
"totalPractice",
total
);



let correct =
Number(
localStorage.getItem(
"correctAnswers"
)
)||0;



let accuracy =
0;


if(total>0){

accuracy =
Math.round(
(correct/total)*100
);

}



localStorage.setItem(
"accuracy",
accuracy
);


}



// =========================
// CALL PREMIUM FEATURES
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


updateDailyStreak();


checkContinuePractice();


});  

// =========================
// XP LEVEL SYSTEM
// =========================


function calculateLevel(xp){


return Math.floor(xp / 100) + 1;


}




// =========================
// SAVE XP TO FIREBASE PROFILE
// =========================


async function updateStudentProfile(){


try{


const user = auth.currentUser;


if(!user) return;



const uid = user.uid;



const profileRef =
doc(
db,
"students",
uid
);



const profileSnap =
await getDoc(profileRef);



let oldXP = 0;
let oldPractice = 0;



if(profileSnap.exists()){


const data =
profileSnap.data();


oldXP =
data.xp || 0;


oldPractice =
data.totalPractice || 0;


}



let earnedXP = 5;



let newXP =
oldXP + earnedXP;



let level =
calculateLevel(newXP);



await setDoc(
profileRef,
{


xp:newXP,


level:level,


totalPractice:
oldPractice + 1,


lastPractice:
new Date()



},
{
merge:true
}

);



console.log(
"Profile Updated"
);



}

catch(error){

console.log(
"Profile Update Error",
error
);

}



}




// =========================
// SAVE BADGES FIREBASE
// =========================


async function saveBadgeFirebase(
badgeName
){


try{


const user =
auth.currentUser;


if(!user) return;



const badgeRef =
doc(
db,
"students",
user.uid
);



await updateDoc(
badgeRef,
{


badges:
[badgeName]



}

);



}

catch(error){

console.log(error);

}



}




// =========================
// PRACTICE COMPLETE PROFILE UPDATE
// =========================


async function completeProfileUpdate(){


let score =
Number(
localStorage.getItem(
"practiceScore"
)
)||0;



for(
let i=0;
i<score;
i++
){


await updateStudentProfile();


}



checkSubjectBadge();


}





// =========================
// LEVEL DISPLAY
// =========================


function showLevel(){


let xp =
Number(
localStorage.getItem("xp")
)||0;


let level =
calculateLevel(xp);



const levelBox =
document.getElementById(
"levelBox"
);



if(levelBox){


levelBox.innerHTML =

`
⭐ XP : ${xp}

<br>

🏆 Level : ${level}

`;

}


}



// =========================
// AUTO LOAD PROFILE DATA
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


showLevel();


});

// =========================
// WRONG QUESTION RETRY
// =========================


function startWrongPractice(){


let wrongQuestions =
JSON.parse(
localStorage.getItem(
"wrongQuestions"
)
)||[];



if(wrongQuestions.length===0){

alert(
"🎉 No Wrong Questions"
);

return;

}



localStorage.setItem(
"practiceQuestions",
JSON.stringify(wrongQuestions)
);



localStorage.setItem(
"currentQuestion",
0
);



localStorage.setItem(
"practiceScore",
0
);



showQuestion();


}



// =========================
// BOOKMARK LIST
// =========================


function loadBookmarks(){


let bookmarks =
JSON.parse(
localStorage.getItem(
"bookmarks"
)
)||[];



const area =
document.getElementById(
"bookmarkArea"
);



if(!area) return;



if(bookmarks.length===0){


area.innerHTML =

`
<p>
⭐ No Bookmarks Added
</p>
`;

return;


}



area.innerHTML="";



bookmarks.forEach((q,index)=>{


area.innerHTML +=

`

<div class="welcome-card">

<h3>
${index+1}. ${q.question}
</h3>


<p>
${q.options[0]}
</p>

<p>
${q.options[1]}
</p>

<p>
${q.options[2]}
</p>

<p>
${q.options[3]}
</p>


</div>

`;

});


}





// =========================
// CONTINUE PRACTICE CARD
// =========================


function showContinueCard(){


const data =
localStorage.getItem(
"continuePractice"
);



const box =
document.getElementById(
"continueBox"
);



if(!box) return;



if(!data){


box.style.display="none";

return;

}



const practice =
JSON.parse(data);



box.innerHTML =

`

<div class="welcome-card">


<h3>
▶ Continue Practice
</h3>


<p>
📚 ${practice.subject}
</p>


<p>
📂 ${practice.topic}
</p>


<p>
Question :
${Number(practice.question)+1}
</p>


<button class="btn"
id="continueBtn">

Continue

</button>


</div>

`;



document.getElementById(
"continueBtn"
).onclick=function(){


localStorage.setItem(
"practiceQuestions",
practice.questions
);


localStorage.setItem(
"currentQuestion",
practice.question
);


showQuestion();


};


}





// =========================
// LOAD PRACTICE HISTORY
// =========================


async function loadPracticeHistory(){


try{


const user =
auth.currentUser;


if(!user) return;



const historyRef =
collection(
db,
"practiceHistory"
);



const snapshot =
await getDocs(historyRef);



const area =
document.getElementById(
"historyArea"
);



if(!area) return;



area.innerHTML="";



snapshot.forEach(doc=>{


const data =
doc.data();



if(data.studentId === user.uid){



area.innerHTML +=

`

<div class="welcome-card">


<h3>
📖 ${data.subject}
</h3>


<p>
📂 ${data.topic}
</p>


<p>
🎯 Score :
${data.score}/${data.totalQuestions}

</p>


<p>
⭐ XP :
${data.xpEarned}

</p>


</div>

`;



}


});


}

catch(error){

console.log(error);

}


}





// =========================
// DASHBOARD STAT UPDATE
// =========================


function updateDashboardStats(){


const total =
localStorage.getItem(
"totalPractice"
)||0;



const accuracy =
localStorage.getItem(
"accuracy"
)||0;



let practiceCount =
document.getElementById(
"practiceCount"
);



let accuracyBox =
document.getElementById(
"accuracyBox"
);



if(practiceCount){

practiceCount.innerHTML =
total;

}



if(accuracyBox){

accuracyBox.innerHTML =
accuracy+"%";

}


}





// =========================
// INITIAL LOAD
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


showContinueCard();

loadBookmarks();

loadPracticeHistory();

updateDashboardStats();


});
