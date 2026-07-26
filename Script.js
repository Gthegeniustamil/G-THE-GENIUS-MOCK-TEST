// G THE GENIUS - Test Engine Part 1

let questions = [];
let currentQuestion = 0;
let answers = [];

async function loadQuestions() {

    const response = await fetch("questions/daily/Day001.json");
    questions = await response.json();

    showQuestion();

}

function showQuestion() {

    document.getElementById("qno").innerText = currentQuestion + 1;

    document.getElementById("question").innerText =
    questions[currentQuestion].question;

    document.getElementById("op1").innerText =
    "A. " + questions[currentQuestion].options[0];

    document.getElementById("op2").innerText =
    "B. " + questions[currentQuestion].options[1];

    document.getElementById("op3").innerText =
    "C. " + questions[currentQuestion].options[2];

    document.getElementById("op4").innerText =
    "D. " + questions[currentQuestion].options[3];

}

function selectAnswer(option){

    answers[currentQuestion]=option;

    alert("Option Selected");

}

document.getElementById("op1").onclick=()=>selectAnswer(0);
document.getElementById("op2").onclick=()=>selectAnswer(1);
document.getElementById("op3").onclick=()=>selectAnswer(2);
document.getElementById("op4").onclick=()=>selectAnswer(3);

document.querySelector(".next").onclick=()=>{

    if(currentQuestion<questions.length-1){

        currentQuestion++;

        showQuestion();

    }

};

document.querySelector(".prev").onclick=()=>{

    if(currentQuestion>0){

        currentQuestion--;

        showQuestion();

    }

};

loadQuestions();
