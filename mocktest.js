// ==========================================
// G THE GENIUS MOCK TEST PORTAL v6.0
// MOCKTEST.JS
// PART 1
// ==========================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// URL PARAMETERS
// ==========================================

const params = new URLSearchParams(window.location.search);

const testType = params.get("type") || "daily";
const selectedSubject = params.get("subject");
const selectedTopic = params.get("topic");


// ==========================================
// TEST SETTINGS
// ==========================================

let totalQuestions = 10;
let timeLimit = 5 * 60;

switch(testType){

    case "weekly":
        totalQuestions = 25;
        timeLimit = 10 * 60;
        break;

    case "monthly":
        totalQuestions = 100;
        timeLimit = 60 * 60;
        break;

    default:
        totalQuestions = 10;
        timeLimit = 5 * 60;

}


// ==========================================
// VARIABLES
// ==========================================

let questions = [];
let currentQuestion = 0;
let selectedAnswers = [];
let timer = null;
let remainingTime = timeLimit;


// ==========================================
// HTML ELEMENTS
// ==========================================

const loading = document.getElementById("loading");
const timerBox = document.getElementById("timer");

const questionNumber =
document.getElementById("questionNumber");

const questionText =
document.getElementById("questionText");

const optionsBox =
document.getElementById("optionsBox");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

const submitBtn =
document.getElementById("submitBtn");

console.log("✅ MOCKTEST PART 1 LOADED");

// ==========================================
// PART 2
// LOAD QUESTIONS FROM FIRESTORE
// ==========================================

async function loadQuestions(){

    try{

        let qRef = collection(db, "questions");
        let snapshot;

        if(selectedTopic){

            snapshot = await getDocs(
                query(
                    qRef,
                    where("topic","==",selectedTopic)
                )
            );

        }

        else if(selectedSubject){

            snapshot = await getDocs(
                query(
                    qRef,
                    where("subject","==",selectedSubject)
                )
            );

        }

        else{

            snapshot = await getDocs(qRef);

        }

        questions = [];

        snapshot.forEach(doc=>{

            const data = doc.data();

            if(
                data.question &&
                Array.isArray(data.options) &&
                data.options.length >= 4
            ){

                questions.push({

                    id:doc.id,

                    question:data.question,

                    options:data.options,

                    answer:data.answer,

                    explanation:data.explanation || "",

                    subject:data.subject || "",

                    topic:data.topic || ""

                });

            }

        });

        console.log("Questions Loaded :",questions.length);

    }

    catch(error){

        console.error("Question Load Error",error);

        alert(error.message);

    }

}



// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        let j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

    return array;

}



// ==========================================
// PREPARE QUESTIONS
// ==========================================

function prepareQuestions(){

    shuffle(questions);

    questions = questions.slice(
        0,
        Math.min(totalQuestions,questions.length)
    );

    selectedAnswers = new Array(
        questions.length
    ).fill(null);

    console.log(
        "Prepared Questions:",
        questions.length
    );

                    }

// ==========================================
// PART 3
// QUESTION DISPLAY SYSTEM
// ==========================================

function showQuestion(){

    if(questions.length===0) return;

    const q = questions[currentQuestion];

    if(questionNumber){

        questionNumber.innerText =
        `Question ${currentQuestion+1} / ${questions.length}`;

    }

    if(questionText){

        questionText.innerText = q.question;

    }

    optionsBox.innerHTML = "";

    q.options.forEach((option,index)=>{

        const btn = document.createElement("button");

        btn.className = "option-btn";

        btn.innerText = option;

        if(selectedAnswers[currentQuestion]===option){

            btn.classList.add("selected");

        }

        btn.onclick = ()=>{

            selectedAnswers[currentQuestion] = option;

            document
            .querySelectorAll(".option-btn")
            .forEach(b=>b.classList.remove("selected"));

            btn.classList.add("selected");

        };

        optionsBox.appendChild(btn);

    });

}



// ==========================================
// NEXT BUTTON
// ==========================================

nextBtn.onclick = ()=>{

    if(currentQuestion < questions.length-1){

        currentQuestion++;

        showQuestion();

    }

};



// ==========================================
// PREVIOUS BUTTON
// ==========================================

prevBtn.onclick = ()=>{

    if(currentQuestion>0){

        currentQuestion--;

        showQuestion();

    }

};

// ==========================================
// PART 4
// RESULT CALCULATION
// ==========================================

function normalizeAnswer(answer, options = []){

    if(answer === null || answer === undefined) return "";

    if(typeof answer === "number"){
        return String(options[answer] || "")
            .trim()
            .toLowerCase();
    }

    let value = String(answer).trim();

    const map = {
        "A":0,
        "B":1,
        "C":2,
        "D":3
    };

    if(map[value.toUpperCase()] !== undefined){

        return String(
            options[map[value.toUpperCase()]] || ""
        )
        .trim()
        .toLowerCase();

    }

    return value.toLowerCase();

}



function calculateResult(){

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    let review = [];

    questions.forEach((q,index)=>{

        const userAnswer = selectedAnswers[index];

        const selected =
        normalizeAnswer(userAnswer,q.options);

        const answer =
        normalizeAnswer(q.answer,q.options);

        let status = "Wrong";

        if(!userAnswer){

            unanswered++;
            status = "Unanswered";

        }

        else if(selected === answer){

            correct++;
            status = "Correct";

        }

        else{

            wrong++;

        }

        review.push({

            question:q.question,

            yourAnswer:userAnswer || "Not Answered",

            correctAnswer:answer,

            explanation:
            q.explanation ||
            "No Explanation",

            status:status

        });

    });

    return{

        correct,
        wrong,
        unanswered,
        review

    };

}



// ==========================================
// SUBMIT TEST
// ==========================================

async function submitTest(){

    clearInterval(timer);

    try{

        const resultData =
        calculateResult();

        localStorage.setItem(
            "lastScore",
            resultData.correct
        );

        localStorage.setItem(
            "lastCorrect",
            resultData.correct
        );

        localStorage.setItem(
            "lastWrong",
            resultData.wrong
        );

        localStorage.setItem(
            "lastUnanswered",
            resultData.unanswered
        );

        localStorage.setItem(
            "lastTotal",
            questions.length
        );

        localStorage.setItem(
            "lastPercentage",
            (
                resultData.correct /
                questions.length *
                100
            ).toFixed(2)
        );

        localStorage.setItem(
            "lastReview",
            JSON.stringify(resultData.review)
        );

        await saveResult(resultData);

        window.location.href =
        "result.html";

    }

    catch(error){

        console.error(error);

        alert(
            "Submit Error : " +
            error.message
        );

    }

}

// ==========================================
// PART 5
// TIMER + START TEST + FINAL
// ==========================================

// TIMER

function startTimer(){

    timer = setInterval(()=>{

        const min =
        Math.floor(remainingTime/60);

        const sec =
        remainingTime%60;

        if(timerBox){

            timerBox.innerText =
            `⏰ ${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

        }

        if(remainingTime<=0){

            clearInterval(timer);

            submitTest();

            return;

        }

        remainingTime--;

    },1000);

}



// LOADING

function hideLoading(){

    if(loading){

        loading.style.display="none";

    }

}



// START TEST

async function startTest(){

    await loadQuestions();

    if(questions.length===0){

        if(loading){

            loading.innerHTML =
            "❌ No Questions Found";

        }

        return;

    }

    prepareQuestions();

    hideLoading();

    showQuestion();

    startTimer();

}



// SUBMIT BUTTON

if(submitBtn){

    submitBtn.onclick=()=>{

        if(confirm("Submit Test?")){

            submitTest();

        }

    };

}



// PAGE LOAD

window.addEventListener("load",startTest);



// EXPORT

window.submitTest=submitTest;

console.log("✅ MOCKTEST JS v6 READY");
