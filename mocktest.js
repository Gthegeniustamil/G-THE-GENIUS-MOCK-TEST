// =========================
// G THE GENIUS MOCK TEST
// PART 1
// =========================


import { db, auth } from "./firebase-config.js";


import {

collection,
getDocs,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// =========================
// VARIABLES
// =========================


let testQuestions = [];

let currentIndex = 0;

let selectedAnswers = [];

let testType = "daily";

let timeLimit = 300;

let timer;



// =========================
// GET TEST TYPE
// =========================


const params =

new URLSearchParams(
window.location.search
);



testType =

params.get("type") || "daily";





if(testType==="daily"){

timeLimit = 5*60;

}


else if(testType==="weekly"){

timeLimit = 10*60;

}


else if(testType==="monthly"){

timeLimit = 60*60;

}







// =========================
// ATTEMPT LIMIT
// =========================


function checkAttempt(){


let today =

new Date()
.toLocaleDateString();



let attempts =

JSON.parse(

localStorage.getItem(
"mockAttempts"
)

)|| {};





if(testType==="daily"){


if(
attempts.dailyDate === today
&&
attempts.daily >=5
){


alert(
"Daily 5 attempts completed"
);


return false;


}


}







if(testType==="weekly"){



let week =

getWeekNumber();



if(
attempts.week === week
&&
attempts.weekly >=3
){


alert(
"Weekly 3 attempts completed"
);


return false;


}



}







if(testType==="monthly"){


let date =

new Date()
.getDate();



if(
date!==1 &&
date!==15
){


alert(
"Monthly Test available only on 1st and 15th"
);


return false;


}


}





return true;


}








// =========================
// SAVE ATTEMPT
// =========================


function saveAttempt(){



let attempts =

JSON.parse(

localStorage.getItem(
"mockAttempts"
)

)|| {};



let today =

new Date()
.toLocaleDateString();





if(testType==="daily"){


if(
attempts.dailyDate !== today
){

attempts.dailyDate=today;

attempts.daily=0;


}


attempts.daily++;

}



else if(testType==="weekly"){


attempts.week=getWeekNumber();


attempts.weekly =
(attempts.weekly||0)+1;


}




else{


attempts.monthly =
(attempts.monthly||0)+1;


}



localStorage.setItem(

"mockAttempts",

JSON.stringify(
attempts
)

);


}









// =========================
// LOAD QUESTIONS
// =========================


async function loadMockQuestions(){


try{


const snap =

await getDocs(

collection(
db,
"questions"
)

);





testQuestions=[];





snap.forEach(doc=>{


let data =
doc.data();





let options=[];





// Format 1 Support


if(data.option1){


options=[

data.option1,

data.option2,

data.option3,

data.option4

];


}




// Format 2 Support


else if(
Array.isArray(
data.options
)
){


options=data.options;


}






testQuestions.push({


question:

data.question,


options:options,


answer:

data.answer ??
data.correctAnswer,


explanation:

data.explanation || "No Explanation",


subject:

data.subject || "",


topic:

data.topic || ""


});



});







// Random


testQuestions =

testQuestions

.sort(
()=>0.5-Math.random()
);







// Question count


if(testType==="daily"){


testQuestions =
testQuestions.slice(0,10);


}


else if(testType==="weekly"){


testQuestions =
testQuestions.slice(0,25);


}


else{


testQuestions =
testQuestions.slice(0,100);


}





selectedAnswers =

new Array(
testQuestions.length
).fill(null);







document.getElementById(
"totalQuestions"
).innerHTML =

testQuestions.length;



showQuestion();



startTimer();



}

catch(error){


console.log(
"Question Load Error",
error
);


}



}







// =========================
// WEEK NUMBER
// =========================


function getWeekNumber(){


let date = new Date();


let firstDay =

new Date(
date.getFullYear(),
0,
1
);



return Math.ceil(

(
(
date-firstDay
)

/

86400000
+

firstDay.getDay()+1

)

/7

);



}





// =========================
// START
// =========================


auth.onAuthStateChanged(
(user)=>{


if(user){


if(
checkAttempt()
){


saveAttempt();


loadMockQuestions();


}


}



});

// =========================
// SHOW QUESTION
// =========================


function showQuestion(){


let q =

testQuestions[currentIndex];



if(!q) return;





document.getElementById(
"currentQuestion"
).innerHTML =

currentIndex + 1;





document.getElementById(
"questionText"
).innerHTML =

q.question;






let buttons =

document.querySelectorAll(
".option"
);






buttons.forEach(
(button,index)=>{


button.innerHTML =

q.options[index] || "";



button.classList.remove(
"selected"
);



button.onclick = ()=>{


selectAnswer(index);


};



if(
selectedAnswers[currentIndex]===index
){


button.classList.add(
"selected"
);


}



});





updateProgress();


updatePalette();


}








// =========================
// SELECT ANSWER
// =========================


function selectAnswer(index){


selectedAnswers[currentIndex]=index;



let buttons =

document.querySelectorAll(
".option"
);



buttons.forEach(btn=>{


btn.classList.remove(
"selected"
);


});





buttons[index].classList.add(
"selected"
);



updatePalette();



}








// =========================
// QUESTION PALETTE
// =========================


function createPalette(){


const box =

document.getElementById(
"questionPalette"
);



if(!box) return;



box.innerHTML="";




testQuestions.forEach(
(question,index)=>{



let btn =

document.createElement(
"button"
);



btn.innerHTML =
index+1;




btn.onclick = ()=>{


currentIndex=index;


showQuestion();



};



box.appendChild(btn);



});


}








// =========================
// UPDATE PALETTE
// =========================


function updatePalette(){



const buttons =

document.querySelectorAll(
"#questionPalette button"
);



buttons.forEach(
(button,index)=>{



button.classList.remove(
"active"
);


button.classList.remove(
"answered"
);





if(index===currentIndex){


button.classList.add(
"active"
);


}



if(
selectedAnswers[index]!==null
){


button.classList.add(
"answered"
);


}



});



}








// =========================
// PROGRESS
// =========================


function updateProgress(){


let percent =


(
(currentIndex+1)

/

testQuestions.length

)

*100;





const bar =

document.getElementById(
"testProgress"
);



if(bar){


bar.style.width =

percent+"%";


}



}







// =========================
// NEXT BUTTON
// =========================


const nextBtn =

document.getElementById(
"nextBtn"
);



if(nextBtn){



nextBtn.onclick = ()=>{


if(
currentIndex <
testQuestions.length-1
){



currentIndex++;


showQuestion();



}



};



}







// =========================
// PREVIOUS BUTTON
// =========================


const previousBtn =

document.getElementById(
"previousBtn"
);



if(previousBtn){


previousBtn.onclick = ()=>{


if(
currentIndex>0
){


currentIndex--;


showQuestion();



}



};



}








// =========================
// CREATE AFTER LOAD
// =========================


const oldLoadQuestions =

loadMockQuestions;



loadMockQuestions = async function(){


await oldLoadQuestions();



createPalette();


showQuestion();


  }


// =========================
// TIMER SYSTEM
// =========================


function startTimer(){


let seconds = timeLimit;



timer = setInterval(()=>{


let min =

Math.floor(seconds/60);



let sec =

seconds % 60;



document.getElementById(
"timer"
).innerHTML =


"⏰ "

+

String(min).padStart(2,"0")

+

":"

+

String(sec).padStart(2,"0");






seconds--;





if(seconds < 0){


clearInterval(timer);


alert(
"Time Finished! Test Submitted"
);



submitTest();



}



},1000);



}







// =========================
// CALCULATE SCORE
// =========================


function calculateScore(){



let correct = 0;



testQuestions.forEach(
(question,index)=>{



if(
selectedAnswers[index] == question.answer
){


correct++;


}



});




return correct;



}







// =========================
// SUBMIT BUTTON
// =========================


const submitBtn =

document.getElementById(
"submitBtn"
);



if(submitBtn){


submitBtn.onclick = ()=>{


let confirmBox =

document.getElementById(
"submitConfirm"
);



if(confirmBox){


confirmBox.style.display="block";


}


};



}







const confirmSubmit =

document.getElementById(
"confirmSubmit"
);



if(confirmSubmit){


confirmSubmit.onclick = ()=>{


submitTest();


};


}







const cancelSubmit =

document.getElementById(
"cancelSubmit"
);



if(cancelSubmit){


cancelSubmit.onclick = ()=>{


document.getElementById(
"submitConfirm"
).style.display="none";


};


}








// =========================
// SAVE RESULT FIREBASE
// =========================


async function saveResult(
score
){



const user =

auth.currentUser;



if(!user) return;





let percentage =


Math.round(

(
score /

testQuestions.length

)

*100

);







await addDoc(

collection(
db,
"results"
),

{


studentId:

user.uid,



studentName:

localStorage.getItem(
"studentName"
)

||

"Student",




district:

localStorage.getItem(
"district"
)

||

"-",





examType:

localStorage.getItem(
"examGoal"
)

||

"TNUSRB",





testType:

testType,




score:

score,




total:

testQuestions.length,




percentage:

percentage,




timestamp:

serverTimestamp()


}



);



return percentage;



}








// =========================
// SUBMIT TEST
// =========================


async function submitTest(){



clearInterval(timer);



let score =

calculateScore();



let percentage =

await saveResult(
score
);





alert(

"🎉 Test Completed\n\n"

+

"Score : "

+

score

+

"/"

+

testQuestions.length

+

"\nPercentage : "

+

percentage

+

"%"

);





window.location.href =

"result.html";



}







// =========================
// FINAL READY
// =========================


console.log(

"✅ G THE GENIUS MOCK TEST READY"

);
