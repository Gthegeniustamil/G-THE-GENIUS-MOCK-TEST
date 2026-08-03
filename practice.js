// ===================================
// G THE GENIUS PRACTICE SYSTEM
// FINAL VERSION
// ===================================


import { db } from "./firebase-config.js";

import { subjectTopics } from "./subjects.js";


import {

collection,
getDocs

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// VARIABLES
// =========================


let questions=[];

let practiceQuestions=[];

let currentIndex=0;

let score=0;

let correct=0;

let wrong=0;




// =========================
// ELEMENTS
// =========================


const subjectSelect =
document.getElementById("subject");


const topicSelect =
document.getElementById("topic");


const startBtn = document.getElementById("startPracticeBtn");

startBtn?.addEventListener("click", () => {

    window.location.href = "practice-test.html";

});



// =========================
// LOAD SUBJECTS
// =========================


function loadSubjects(){


if(!subjectSelect)
return;



subjectSelect.innerHTML="";



Object.keys(subjectTopics)
.forEach(sub=>{


let option =
document.createElement("option");


option.value=sub;

option.textContent=sub;


subjectSelect.appendChild(option);


});



loadTopics();


}






// =========================
// LOAD TOPICS
// =========================


function loadTopics(){


if(!topicSelect)
return;


topicSelect.innerHTML="";



let selected =
subjectSelect.value;



subjectTopics[selected]
.forEach(topic=>{


let option =
document.createElement("option");


option.value=topic;

option.textContent=topic;


topicSelect.appendChild(option);


});



}




subjectSelect?.addEventListener(
"change",
loadTopics
);








// =========================
// LOAD QUESTIONS
// =========================


async function loadQuestions(){


try{


let snap =
await getDocs(
collection(db,"questions")
);



questions=[];



snap.forEach(doc=>{


questions.push({

id:doc.id,

...doc.data()

});


});



console.log(
"Questions Loaded",
questions.length
);



}

catch(error){


console.log(
"Question Load Error",
error
);


}


}








// =========================
// START PRACTICE
// =========================


if(startBtn){


startBtn.onclick=()=>{


let subject =
subjectSelect.value;



let topic =
topicSelect.value;





if(subject==="All Mixed"){


practiceQuestions =
[...questions];


}



else if(topic==="All Topics"){


practiceQuestions =

questions.filter(q=>

q.subject===subject

);



}



else{


practiceQuestions =

questions.filter(q=>

q.subject===subject
&&
q.topic===topic

);



}






practiceQuestions.sort(

()=>Math.random()-0.5

);





currentIndex=0;

score=0;

correct=0;

wrong=0;



showQuestion();



};

}




// =========================
// SHOW QUESTION
// =========================


function showQuestion(){


if(
currentIndex >= practiceQuestions.length
){


practiceComplete();


return;

}



let q =
practiceQuestions[currentIndex];





document.getElementById(
"questionNumber"
).innerHTML=

`
${currentIndex+1}
/
${practiceQuestions.length}
`;



document.getElementById(
"questionText"
).innerHTML =
q.question;






for(let i=0;i<4;i++){



let btn =
document.getElementById(
"option"+i
);



if(btn){



btn.innerHTML =
q.options[i];



btn.className =
"option-btn";



btn.disabled=false;



btn.onclick=()=>{


checkAnswer(
i,
q.answer,
q
);


};


}


}


updateProgress();



}







// =========================
// CHECK ANSWER
// =========================


function checkAnswer(
selected,
answer,
q
){


let buttons =
document.querySelectorAll(
".option-btn"
);



buttons.forEach(btn=>{


btn.disabled=true;


});





if(
buttons[selected].innerHTML
===
answer
){


score++;

correct++;


buttons[selected]
.classList.add(
"correct"
);


}

else{


wrong++;


buttons[selected]
.classList.add(
"wrong"
);



buttons.forEach(btn=>{


if(btn.innerHTML===answer){


btn.classList.add(
"correct"
);


}


});



}



showExplanation(
q.explanation
);



updateScore();


}








// =========================
// NEXT QUESTION
// =========================


const nextBtn =
document.getElementById(
"nextQuestion"
);



nextBtn?.addEventListener(
"click",
()=>{


currentIndex++;

showQuestion();


}
);








// =========================
// SCORE UPDATE
// =========================


function updateScore(){



document.getElementById(
"practiceScore"
).innerHTML=score;



document.getElementById(
"correctCount"
).innerHTML=correct;



document.getElementById(
"wrongCount"
).innerHTML=wrong;



let total =
correct+wrong;



let accuracy =
total ?

Math.round(
(correct/total)*100
)
:
0;



document.getElementById(
"accuracy"
).innerHTML=
accuracy+"%";


}







// =========================
// EXPLANATION
// =========================


function showExplanation(text){


let box =
document.getElementById(
"explanationBox"
);



if(!box)
return;



box.style.display="block";


box.innerHTML=

`
💡 Explanation :

<br>

${text || "No Explanation"}

`;



}







// =========================
// PROGRESS
// =========================


function updateProgress(){


let bar =
document.getElementById(
"practiceProgress"
);



if(bar){


let percent =

(
(currentIndex+1)
/
practiceQuestions.length
)
*100;



bar.style.width =
percent+"%";


}



}







// =========================
// XP SYSTEM
// =========================


function addXP(){


let xp =
Number(
localStorage.getItem("xp")
)||0;



xp += correct*5;



localStorage.setItem(
"xp",
xp
);


}







// =========================
// SAVE HISTORY
// =========================


function saveHistory(){


let data={


date:
new Date()
.toLocaleDateString(),


score,

correct,

wrong


};




let history =

JSON.parse(

localStorage.getItem(
"practiceHistory"
)

)||[];



history.push(data);



localStorage.setItem(

"practiceHistory",

JSON.stringify(history)

);



}








// =========================
// COMPLETE
// =========================


function practiceComplete(){


addXP();


saveHistory();



alert(

`
🎉 Practice Completed

Correct : ${correct}

Wrong : ${wrong}

Score : ${score}

`

);


}





// =========================
// INIT
// =========================


loadSubjects();

loadQuestions();


console.log(
"✅ Practice Final Ready"
);
