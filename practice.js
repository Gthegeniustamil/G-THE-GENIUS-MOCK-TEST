import { db } from "./firebase-config.js";


import {

collection,
getDocs,
query,
where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// VARIABLES
// =========================


let questions = [];

let currentQuestion = 0;

let score = 0;

let selectedSubject = "";

let selectedTopic = "";





// =========================
// SUBJECT TOPIC DATA
// =========================


const topics = {


"Indian Polity":[

"Constitution",
"Fundamental Rights",
"President",
"Prime Minister",
"Parliament"

],


"Indian History":[

"Ancient India",
"Freedom Struggle",
"Chola History",
"Indian Independence"

],


"Geography":[

"India Geography",
"World Geography",
"Climate"

],


"General Science":[

"Physics",
"Chemistry",
"Biology"

],


"Tamil Nadu GK":[

"History",
"Districts",
"Government Schemes"

]


};







// =========================
// LOAD TOPICS
// =========================


const subjectSelect =

document.getElementById(
"subjectSelect"
);



const topicSelect =

document.getElementById(
"topicSelect"
);




if(subjectSelect){


subjectSelect.addEventListener(

"change",

()=>{


selectedSubject =

subjectSelect.value;



topicSelect.innerHTML =

`

<option>

Select Topic

</option>

`;



if(topics[selectedSubject]){


topics[selectedSubject]

.forEach(topic=>{


topicSelect.innerHTML +=


`

<option value="${topic}">

${topic}

</option>

`;



});

}


}

);

}






// =========================
// START PRACTICE
// =========================


const startBtn =

document.getElementById(
"startPractice"
);



if(startBtn){


startBtn.onclick = async()=>{


selectedTopic =

topicSelect.value;



if(
!selectedSubject ||
!selectedTopic
){


alert(
"Select Subject & Topic"
);


return;


}




await loadQuestions();



};


}







// =========================
// LOAD QUESTIONS FIRESTORE
// =========================


async function loadQuestions(){


try{


const q =

query(

collection(db,"questions"),

where(
"subject",
"==",
selectedSubject

)

);



const snap =

await getDocs(q);



questions=[];



snap.forEach(doc=>{


let data =
doc.data();



if(
data.topic === selectedTopic
){


questions.push(data);


}


});





if(
questions.length===0
){


alert(
"No Questions Available"
);



return;


}





// Random 10 Questions


questions =

questions.sort(
()=>0.5-Math.random()
)
.slice(0,10);





document.getElementById(
"practiceArea"
).style.display =
"block";



document.querySelector(
".select-card"
).style.display =
"none";



showQuestion();



}

catch(error){


console.log(
error
);


}



}

// =========================
// SHOW QUESTION
// =========================


function showQuestion(){


let question =

questions[currentQuestion];



if(!question)
return;




document.getElementById(
"questionNo"
).innerHTML =
currentQuestion + 1;



document.getElementById(
"totalQuestions"
).innerHTML =
questions.length;





document.getElementById(
"questionText"
).innerHTML =
question.question;






let options = [

question.option1,

question.option2,

question.option3,

question.option4

];





let buttons =

document.querySelectorAll(
".option"
);





buttons.forEach(
(button,index)=>{


button.innerHTML =

options[index];



button.className =
"option";



button.disabled =
false;



button.onclick = ()=>{


checkAnswer(

button,

index

);


};



});





// Hide Explanation


document.getElementById(
"explanationBox"
).style.display =
"none";






updateProgress();



}







// =========================
// CHECK ANSWER
// =========================


function checkAnswer(
button,
index
){


let question =

questions[currentQuestion];



let correctAnswer =

Number(
question.answer
);





let buttons =

document.querySelectorAll(
".option"
);





buttons.forEach(btn=>{


btn.disabled = true;


});






if(index === correctAnswer){


button.classList.add(
"correct"
);



score++;



addXP(10);



}

else{


button.classList.add(
"wrong"
);



buttons[correctAnswer]

.classList.add(
"correct"
);



}





showExplanation();



}







// =========================
// EXPLANATION
// =========================


function showExplanation(){


let question =

questions[currentQuestion];



document.getElementById(
"explanationText"
).innerHTML =

question.explanation ||
"No Explanation";



document.getElementById(
"explanationBox"
).style.display =
"block";



}







// =========================
// NEXT QUESTION
// =========================


const nextBtn =

document.getElementById(
"nextQuestion"
);



if(nextBtn){


nextBtn.onclick = ()=>{


currentQuestion++;




if(
currentQuestion < questions.length
){


showQuestion();


}

else{


finishPractice();


}



};



}








// =========================
// PROGRESS BAR
// =========================


function updateProgress(){



let percent =

(
(currentQuestion+1)

/

questions.length

)

*100;





const bar =

document.getElementById(
"progressBar"
);



if(bar){


bar.style.width =

percent+"%";


}



}

// =========================
// ADD XP SYSTEM
// =========================


function addXP(points){


let xp =

Number(

localStorage.getItem(
"xp"

)

) || 0;



xp += points;



localStorage.setItem(
"xp",
xp
);





document.getElementById(
"xpEarned"
).innerHTML =

points;





checkBadge(xp);



}







// =========================
// LEVEL SYSTEM
// =========================


function getLevel(xp){


return Math.floor(
xp / 100
) + 1;


}







// =========================
// BADGE UNLOCK
// =========================


function checkBadge(xp){



let badges =

JSON.parse(

localStorage.getItem(
"badges"

)

) || [];





let newBadge = "";





if(
xp >= 100 &&
!badges.includes(
"Beginner"
)
){


newBadge="Beginner";


}




else if(
xp >= 500 &&
!badges.includes(
"Practice Star"
)
){


newBadge="Practice Star";


}




else if(
xp >= 1000 &&
!badges.includes(
"Master Learner"
)
){


newBadge="Master Learner";


}







if(newBadge){


badges.push(
newBadge
);



localStorage.setItem(

"badges",

JSON.stringify(
badges
)

);





document.getElementById(
"badgeMessage"
).innerHTML =

"🏅 Badge Unlocked : "
+
newBadge;



}



}








// =========================
// SAVE PRACTICE HISTORY
// =========================


function savePracticeHistory(){



let history =

JSON.parse(

localStorage.getItem(
"practiceHistory"

)

) || [];





history.unshift({


subject:selectedSubject,


topic:selectedTopic,


score:score,


total:questions.length,


date:new Date()
.toLocaleDateString()



});





localStorage.setItem(

"practiceHistory",

JSON.stringify(
history
)

);



}







// =========================
// FINISH PRACTICE
// =========================


function finishPractice(){



savePracticeHistory();




let totalXP =

score * 10;





alert(

"🎉 Practice Completed\n\n"

+

"Score : "

+

score

+

"/"

+

questions.length

+

"\nXP Earned : "

+

totalXP

);





location.href =
"profile.html";



}







// =========================
// UPDATE PRACTICE COUNT
// =========================


function updatePracticeCount(){



let count =

Number(

localStorage.getItem(
"totalPractice"

)

) || 0;



count++;




localStorage.setItem(

"totalPractice",

count

);



}







// =========================
// PAGE READY
// =========================


document.addEventListener(

"DOMContentLoaded",

()=>{


updatePracticeCount();



console.log(

"✅ G THE GENIUS PRACTICE READY"

);



});


