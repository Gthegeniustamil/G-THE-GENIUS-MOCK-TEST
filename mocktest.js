// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// MOCK TEST JS
// PART 1 / 5
// ==========================================



import {

auth,
db

} from "./firebase-config.js";






import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";






import {

collection,
getDocs,
addDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";









// ===============================
// GLOBAL VARIABLES
// ===============================



let questions = [];

let selectedAnswers = [];

let currentQuestion = 0;

let score = 0;

let timer;

let timeLeft = 300;

let userData = null;









// TEST SETTINGS


const urlParams = new URLSearchParams(

window.location.search

);



const testType =

urlParams.get("type") || "daily";



const subject =

urlParams.get("subject");



const topic =

urlParams.get("topic");











// TEST CONFIGURATION


let totalQuestions = 10;



if(testType === "weekly"){


totalQuestions = 25;


timeLeft = 600;


}



else if(testType === "monthly"){


totalQuestions = 100;


timeLeft = 3600;


}










// HTML ELEMENTS


const questionText =

document.getElementById("questionText");



const optionsContainer =

document.getElementById("optionsContainer");



const questionNumber =

document.getElementById("questionNumber");



const questionCount =

document.getElementById("questionCount");



const timerDisplay =

document.getElementById("timer");



const progressCount =

document.getElementById("progressCount");



const progressFill =

document.getElementById("progressFill");

// ==========================================
// MOCK TEST JS
// QUESTION LOAD SYSTEM
// PART 2 / 5
// ==========================================






// ===============================
// AUTH CHECK
// ===============================


onAuthStateChanged(auth, async(user)=>{



if(!user){


window.location.href="login.html";


return;


}






// GET STUDENT DATA


userData = {

uid:user.uid,

email:user.email

};






await loadQuestions();



});











// ===============================
// LOAD QUESTIONS FROM FIRESTORE
// ===============================



async function loadQuestions(){



try{



const loadingScreen =

document.getElementById("loadingScreen");





const questionSnapshot =

await getDocs(

collection(db,"questions")

);






let allQuestions = [];






questionSnapshot.forEach((doc)=>{



allQuestions.push({


id:doc.id,


...doc.data()



});



});








// SUBJECT FILTER


if(subject){



allQuestions =

allQuestions.filter(q=>


q.subject === subject


);



}








// TOPIC FILTER


if(topic){



allQuestions =

allQuestions.filter(q=>


q.topic === topic


);



}









// RANDOM QUESTIONS



allQuestions.sort(()=>Math.random()-0.5);








questions =

allQuestions.slice(

0,

totalQuestions

);









// INITIALIZE ANSWERS


selectedAnswers =

new Array(

questions.length

).fill(null);








if(questionCount){


questionCount.innerHTML =

questions.length;


}






createQuestionPalette();






showQuestion();







startTimer();








if(loadingScreen){


loadingScreen.style.display="none";


}






}






catch(error){



console.log(

"Question Load Error",

error

);



const errorBox =

document.getElementById("errorMessage");



if(errorBox){


errorBox.innerHTML =

"Unable to load questions";


}



}





}
// ==========================================
// MOCK TEST JS
// QUESTION DISPLAY SYSTEM
// PART 3 / 5
// ==========================================






// ===============================
// SHOW QUESTION
// ===============================


function showQuestion(){



if(!questions.length){

return;

}







const question =

questions[currentQuestion];








// QUESTION NUMBER


questionNumber.innerHTML =

currentQuestion + 1;







// QUESTION TEXT


questionText.innerHTML =

question.question;








// CLEAR OPTIONS


optionsContainer.innerHTML = "";








// CREATE OPTIONS



question.options.forEach((option,index)=>{






const button =

document.createElement("button");





button.className =

"option-btn";






button.innerHTML =

`${index + 1}. ${option}`;







// SELECTED ANSWER STYLE


if(

selectedAnswers[currentQuestion] === index

){


button.classList.add("selected");


}







button.onclick = ()=>{


selectAnswer(index);


};







optionsContainer.appendChild(button);






});









updateProgress();





}









// ===============================
// SELECT ANSWER
// ===============================


function selectAnswer(index){



selectedAnswers[currentQuestion] = index;





showQuestion();





updatePalette();



}









// ===============================
// QUESTION PALETTE
// ===============================


function createQuestionPalette(){



const palette =

document.getElementById(

"questionPalette"

);





palette.innerHTML="";








questions.forEach((q,index)=>{



const btn =

document.createElement("button");





btn.className =

"question-number-btn";





btn.innerHTML =

index + 1;







btn.onclick = ()=>{



currentQuestion = index;


showQuestion();



};







palette.appendChild(btn);





});




}


// ==========================================
// MOCK TEST JS
// NAVIGATION + TIMER SYSTEM
// PART 4 / 5
// ==========================================






// ===============================
// PROGRESS UPDATE
// ===============================


function updateProgress(){



let answered =

selectedAnswers.filter(

(answer)=>answer !== null

).length;







if(progressCount){



progressCount.innerHTML =

`${answered} / ${questions.length}`;


}







if(progressFill){



let percent =

(answered / questions.length) * 100;





progressFill.style.width =

percent + "%";



}





}









// ===============================
// NEXT BUTTON
// ===============================



const nextBtn =

document.getElementById("nextBtn");





if(nextBtn){



nextBtn.onclick = ()=>{





if(currentQuestion < questions.length - 1){



currentQuestion++;



showQuestion();



}







};





}









// ===============================
// PREVIOUS BUTTON
// ===============================



const previousBtn =

document.getElementById("previousBtn");





if(previousBtn){



previousBtn.onclick = ()=>{





if(currentQuestion > 0){



currentQuestion--;



showQuestion();



}






};



}









// ===============================
// TIMER SYSTEM
// ===============================



function startTimer(){



clearInterval(timer);






timer = setInterval(()=>{



let minutes =

Math.floor(timeLeft / 60);



let seconds =

timeLeft % 60;








if(seconds < 10){



seconds =

"0" + seconds;


}








if(timerDisplay){



timerDisplay.innerHTML =

`${minutes}:${seconds}`;


}








timeLeft--;







if(timeLeft < 0){



clearInterval(timer);



submitTest();



}




},1000);



}
// ==========================================
// MOCK TEST JS
// RESULT SAVE + SUBMIT SYSTEM
// PART 5 / 5
// FINAL
// ==========================================






// ===============================
// SUBMIT BUTTON
// ===============================


const submitBtn =

document.getElementById("submitBtn");






if(submitBtn){



submitBtn.onclick = ()=>{


submitTest();


};



}









// ===============================
// SUBMIT TEST
// ===============================


async function submitTest(){





clearInterval(timer);







score = 0;








// CHECK ANSWERS


questions.forEach((question,index)=>{



if(

selectedAnswers[index] === question.answer

){



score++;



}



});









// SAVE RESULT FIRESTORE


try{



await addDoc(

collection(db,"results"),

{


uid:userData.uid,


email:userData.email,


testType:testType,


subject:subject || "",


topic:topic || "",


marks:score,


totalQuestions:questions.length,



timestamp:serverTimestamp()



}



);











// UPDATE STATUS


const status =

document.getElementById("testStatus");



if(status){



status.innerHTML =

`Test Completed 🎉 Marks : ${score}`;



}







// GO RESULT PAGE


setTimeout(()=>{



window.location.href =

`result.html?marks=${score}&total=${questions.length}`;



},1500);








}







catch(error){



console.log(

"Result Save Error",

error

);



}



}









// ===============================
// PAGE LOAD MESSAGE
// ===============================



console.log(

"G THE GENIUS Mock Test Loaded Successfully"

);

