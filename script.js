import { db } from "./firebase-config.js";

import {
collection,
getDocs,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let allQuestions = [];
let testQuestions = [];
let currentQuestion = 0;
let selectedAnswers = [];

let testType = "daily";
let totalQuestions = 10;

const urlParams = new URLSearchParams(window.location.search);
testType = urlParams.get("type") || "daily";

if(testType==="daily"){
    totalQuestions = 10;
    document.getElementById("testType").innerHTML="🟢 Daily Mock Test";
}
else if(testType==="weekly"){
    totalQuestions = 25;
    document.getElementById("testType").innerHTML="🟡 Weekly Mock Test";
}
else{
    totalQuestions = 100;
    document.getElementById("testType").innerHTML="🔴 Monthly Grand Test";
}

async function loadQuestions(){

    document.getElementById("questionText").innerHTML="Loading Questions...";

    try{

        const snapshot = await getDocs(collection(db,"questions"));

        allQuestions=[];

        snapshot.forEach((doc)=>{
            allQuestions.push(doc.data());
        });

        if(allQuestions.length===0){
            document.getElementById("questionText").innerHTML="No Questions Found";
            return;
        }

        testQuestions = allQuestions
        .sort(()=>Math.random()-0.5)
        .slice(0,totalQuestions);

        selectedAnswers = new Array(testQuestions.length).fill(null);

        showQuestion();
        createPalette();

    }catch(error){

        console.log(error);

        document.getElementById("questionText").innerHTML="Failed to Load Questions";

    }

}

function showQuestion(){

    const q = testQuestions[currentQuestion];

    document.getElementById("questionNumber").innerHTML =
    "Question " + (currentQuestion+1) + " / " + testQuestions.length;

    document.getElementById("questionText").innerHTML =
    q.question;

    const optionBox = document.getElementById("options");

    optionBox.innerHTML="";

    q.options.forEach((option,index)=>{

        const btn = document.createElement("button");

        btn.className="option";

        btn.innerHTML=option;

        if(selectedAnswers[currentQuestion]===index){
            btn.classList.add("selected");
        }

        btn.onclick=function(){

            selectedAnswers[currentQuestion]=index;

            showQuestion();

        };

        optionBox.appendChild(btn);

    });

}

loadQuestions();

// NEXT BUTTON
document.getElementById("nextBtn").onclick = function(){

    if(currentQuestion < testQuestions.length - 1){

        currentQuestion++;

        showQuestion();

        updatePalette();

    }

};

// PREVIOUS BUTTON
document.getElementById("previousBtn").onclick = function(){

    if(currentQuestion > 0){

        currentQuestion--;

        showQuestion();

        updatePalette();

    }

};

// CREATE QUESTION PALETTE
function createPalette(){

    const palette = document.createElement("div");

    palette.id = "questionPalette";

    testQuestions.forEach((q,index)=>{

        const btn = document.createElement("button");

        btn.innerHTML = index + 1;

        btn.className = "palette-btn";

        btn.onclick = function(){

            currentQuestion = index;

            showQuestion();

            updatePalette();

        };

        palette.appendChild(btn);

    });

    document.querySelector(".question-box").prepend(palette);

    updatePalette();

}

// UPDATE PALETTE
function updatePalette(){

    const buttons = document.querySelectorAll(".palette-btn");

    buttons.forEach((btn,index)=>{

        btn.classList.remove("answered","active");

        if(selectedAnswers[index] !== null){
            btn.classList.add("answered");
        }

        if(index === currentQuestion){
            btn.classList.add("active");
        }

    });

            }

// ======================
// SUBMIT TEST
// ======================


async function submitTest(){

let score = 0;

testQuestions.forEach((q,index)=>{

if(selectedAnswers[index]===q.answer){
score++;
}

});

try{

await addDoc(collection(db,"results"),{

studentName: localStorage.getItem("studentName") || "Student",

district: localStorage.getItem("district") || "",

testType:testType,

score:score,

totalQuestions:testQuestions.length,

percentage:Math.round(score/testQuestions.length*100),

createdAt:serverTimestamp()

});

}catch(error){

console.log(error);

}

localStorage.setItem("score",score);
localStorage.setItem("totalQuestions",testQuestions.length);
localStorage.setItem("questions",JSON.stringify(testQuestions));
localStorage.setItem("userAnswers",JSON.stringify(selectedAnswers));
localStorage.setItem("testType",testType);

window.location.href="result.html";

}

// ======================
// CONFIRM SUBMIT
// ======================

function confirmSubmit(){

let unanswered =
selectedAnswers.filter(x=>x===null).length;

if(unanswered>0){

if(confirm(unanswered+" Questions not answered.\nSubmit Test?")){

submitTest();

}

}else{

submitTest();

}

}

document.getElementById("submitBtn").onclick=function(){

confirmSubmit();

};
