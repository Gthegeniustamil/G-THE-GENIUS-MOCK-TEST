// =========================
// G THE GENIUS PRACTICE JS
// PART 1
// =========================


import { db } from "./firebase-config.js";


import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let questions = [];

let practiceQuestions = [];

let currentIndex = 0;

let score = 0;

let correct = 0;

let wrong = 0;








// =========================
// LOAD QUESTIONS
// =========================


async function loadQuestions(){



try{


const snap = await getDocs(

collection(
db,
"questions"
)

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


const startBtn =

document.getElementById(
"startPractice"
);



if(startBtn){



startBtn.onclick = ()=>{



let category =

document.getElementById(
"categorySelect"
).value;






if(category==="all"){



practiceQuestions =

[...questions];



}

else{


practiceQuestions =

questions.filter(

q=>

q.category === category

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



alert(

"Practice Completed 🎉"

);



return;


}






let q =

practiceQuestions[currentIndex];






document.getElementById(
"questionNumber"
).innerHTML =

currentIndex+1;






document.getElementById(
"questionText"
).innerHTML =

q.question;







for(let i=0;i<4;i++){



let btn =

document.getElementById(
"option"+i
);



btn.innerHTML =

q.options[i];



btn.className =

"option-btn";



btn.disabled=false;



btn.onclick = ()=>{


checkAnswer(

i,

q.answer

);


};



}





}








// =========================
// ANSWER CHECK
// =========================


function checkAnswer(selected,answer){



let buttons =

document.querySelectorAll(
".option-btn"
);






buttons.forEach(btn=>{


btn.disabled=true;


});





if(selected == answer){



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



buttons[answer]
.classList.add(
"correct"
);



}





updateScore();



}








// =========================
// UPDATE SCORE
// =========================


function updateScore(){



document.getElementById(
"practiceScore"
).innerHTML =

score;




document.getElementById(
"correctCount"
).innerHTML =

correct;




document.getElementById(
"wrongCount"
).innerHTML =

wrong;






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
).innerHTML =

accuracy+"%";



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



currentIndex++;


showQuestion();



};



}








loadQuestions();



console.log(

"✅ Practice JS Loaded"

);

// =========================
// EXPLANATION SYSTEM
// =========================


function showExplanation(text){


let box =

document.getElementById(
"explanationBox"
);



if(!box) return;




box.style.display="block";



box.innerHTML =

"💡 Explanation : <br>" +

(text || "No explanation available");



}








// =========================
// UPDATE PROGRESS
// =========================


function updateProgress(){



let total =

practiceQuestions.length;



let progress =

((currentIndex+1)/total)*100;





let bar =

document.getElementById(
"practiceProgress"
);



if(bar){



bar.style.width =

progress+"%";


}



}








// =========================
// XP ADD SYSTEM
// =========================


function addPracticeXP(){



let xp =

Number(

localStorage.getItem(
"xp"

)

)||0;






let newXP =

xp + (correct * 5);






localStorage.setItem(

"xp",

newXP

);



console.log(

"XP Added",

newXP

);



}








// =========================
// SAVE PRACTICE DATA
// =========================


function savePractice(){



let data = {


date:

new Date().toLocaleDateString(),


correct:


correct,


wrong:


wrong,


score:


score



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
// COMPLETE SUMMARY
// =========================


function practiceComplete(){



addPracticeXP();



savePractice();





alert(

"🎉 Practice Completed\n\n"+

"Correct : "+correct+

"\nWrong : "+wrong+

"\nScore : "+score

);





}





// =========================
// OVERRIDE NEXT BUTTON
// =========================


const oldShowQuestion =

showQuestion;



showQuestion = function(){



if(

currentIndex >= practiceQuestions.length

){



practiceComplete();


return;


}





oldShowQuestion();



updateProgress();





let q =

practiceQuestions[currentIndex];




showExplanation(

q.explanation

);



};








// =========================
// INITIAL LOAD
// =========================


document.addEventListener(

"DOMContentLoaded",

()=>{


updateScore();



}

);






console.log(

"✅ Practice Final Integration Ready"

);
