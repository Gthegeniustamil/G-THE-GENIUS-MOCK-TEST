// ==========================================
// G THE GENIUS MOCK TEST PORTAL
// MOCKTEST.JS v7 FINAL
// PART 1
// ==========================================

import { db, auth } from "./firebase-config.js";

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

const testType =
params.get("type") || "daily";

const selectedSubject =
params.get("subject");

const selectedTopic =
params.get("topic");


// ==========================================
// TEST SETTINGS
// ==========================================

let totalQuestions = 10;
let timeLimit = 300;

switch(testType){

    case "weekly":

        totalQuestions = 25;
        timeLimit = 600;
        break;

    case "monthly":

        totalQuestions = 100;
        timeLimit = 3600;
        break;

    default:

        totalQuestions = 10;
        timeLimit = 300;

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

const loading =
document.getElementById("loading");

const timerBox =
document.getElementById("timer");

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


// ==========================================
// RESULT VARIABLES
// ==========================================

let correct = 0;
let wrong = 0;
let unanswered = 0;

let review = [];

console.log("✅ MOCKTEST v7 PART 1 LOADED");

// ==========================================
// PART 2
// LOAD QUESTIONS FROM FIRESTORE
// ==========================================

async function loadQuestions(){

    try{

        let qRef = collection(db,"questions");

        let snapshot;

        // Topic Wise

        if(selectedTopic){

            snapshot = await getDocs(

                query(
                    qRef,
                    where("topic","==",selectedTopic)
                )

            );

        }

        // Subject Wise

        else if(selectedSubject){

            snapshot = await getDocs(

                query(
                    qRef,
                    where("subject","==",selectedSubject)
                )

            );

        }

        // All Questions

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

                    id: doc.id,

                    question: data.question,

                    options: data.options,

                    answer: data.answer,

                    explanation:
                    data.explanation || "",

                    subject:
                    data.subject || "",

                    topic:
                    data.topic || ""

                });

            }

        });

        console.log(
            "Questions Loaded :",
            questions.length
        );

    }

    catch(error){

        console.error(error);

        alert(
            "Question Load Error\n\n" +
            error.message
        );

    }

}



// ==========================================
// SHUFFLE QUESTIONS
// ==========================================

function shuffleQuestions(){

    for(

        let i = questions.length - 1;

        i > 0;

        i--

    ){

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [questions[i],questions[j]] =
        [questions[j],questions[i]];

    }

}



// ==========================================
// PREPARE QUESTIONS
// ==========================================

function prepareQuestions(){

    shuffleQuestions();

    if(

        questions.length >

        totalQuestions

    ){

        questions = questions.slice(

            0,

            totalQuestions

        );

    }

    selectedAnswers =

    new Array(

        questions.length

    ).fill(null);

    console.log(
        "Prepared Questions :",
        questions.length
    );

}

console.log("✅ MOCKTEST v7 PART 2 READY");

// ==========================================
// PART 3
// QUESTION DISPLAY SYSTEM
// ==========================================

function showQuestion(){

    if(questions.length===0) return;

    const q = questions[currentQuestion];

    // Question Number

    if(questionNumber){

        questionNumber.innerText =
        `Question ${currentQuestion+1} / ${questions.length}`;

    }

    // Question

    if(questionText){

        questionText.innerText =
        q.question;

    }

    // Options

    optionsBox.innerHTML = "";

    q.options.forEach((option,index)=>{

        const btn =
        document.createElement("button");

        btn.className =
        "option-btn";

        btn.innerText =
        option;

        // Already Selected

        if(
            selectedAnswers[currentQuestion] === option
        ){

            btn.classList.add("selected");

        }

        btn.onclick = ()=>{

            selectedAnswers[currentQuestion] =
            option;

            document
            .querySelectorAll(".option-btn")
            .forEach(button=>{

                button.classList.remove("selected");

            });

            btn.classList.add("selected");

        };

        optionsBox.appendChild(btn);

    });

}



// ==========================================
// NEXT BUTTON
// ==========================================

if(nextBtn){

    nextBtn.onclick = ()=>{

        if(
            currentQuestion <
            questions.length-1
        ){

            currentQuestion++;

            showQuestion();

        }

    };

}



// ==========================================
// PREVIOUS BUTTON
// ==========================================

if(prevBtn){

    prevBtn.onclick = ()=>{

        if(currentQuestion>0){

            currentQuestion--;

            showQuestion();

        }

    };

}

console.log("✅ MOCKTEST v7 PART 3 READY");
// ==========================================
// PART 4
// TIMER + RESULT CALCULATION + SAVE RESULT
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



// NORMALIZE ANSWER

function normalizeAnswer(answer,options=[]){

    if(answer===null || answer===undefined)
        return "";

    if(typeof answer==="number"){

        return String(
            options[answer] || ""
        ).trim().toLowerCase();

    }

    let value =
    String(answer).trim();

    const map={

        A:0,
        B:1,
        C:2,
        D:3

    };

    if(map[value.toUpperCase()]!==undefined){

        return String(

            options[
                map[value.toUpperCase()]
            ] || ""

        ).trim().toLowerCase();

    }

    return value.toLowerCase();

}



// RESULT CALCULATION

function calculateResult(){

    correct=0;
    wrong=0;
    unanswered=0;

    review=[];

    questions.forEach((q,index)=>{

        const userAnswer =
        selectedAnswers[index];

        const selected =
        normalizeAnswer(
            userAnswer,
            q.options
        );

        const answer =
        normalizeAnswer(
            q.answer,
            q.options
        );

        let status="Wrong";

        if(!userAnswer){

            unanswered++;

            status="Unanswered";

        }

        else if(selected===answer){

            correct++;

            status="Correct";

        }

        else{

            wrong++;

        }

        review.push({

            question:q.question,

            yourAnswer:
            userAnswer || "Not Answered",

            correctAnswer:
            answer,

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



// SAVE RESULT

async function saveResult(resultData){

    await addDoc(

        collection(db,"results"),

        {

            studentName:
            localStorage.getItem("studentName")
            || "Student",

            district:
            localStorage.getItem("district")
            || "-",
uid: auth.currentUser?.uid || "",

email: auth.currentUser?.email || "",
            
            testType,

            score:
            resultData.correct,

            correct:
            resultData.correct,

            wrong:
            resultData.wrong,

            unanswered:
            resultData.unanswered,

            totalQuestions:
            questions.length,

            percentage:Number(

                (

                    resultData.correct /
                    questions.length

                )*100

            ).toFixed(2),

            createdAt:
            serverTimestamp()

        }

    );

    console.log("✅ Result Saved");

}

console.log("✅ MOCKTEST v7 PART 4 READY");

// ==========================================
// PART 5
// SUBMIT + START TEST + PAGE LOAD
// ==========================================

// SUBMIT TEST

async function submitTest(){

    clearInterval(timer);

    try{

        const resultData =
        calculateResult();

        // LOCAL STORAGE

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

        const percentage = Number(
            (
                resultData.correct /
                questions.length
            ) * 100
        ).toFixed(2);

        localStorage.setItem(
            "lastPercentage",
            percentage
        );

        localStorage.setItem(
            "lastReview",
            JSON.stringify(resultData.review)
        );

        localStorage.setItem(
            "lastTestType",
            testType
        );

        // SAVE TO FIRESTORE

        await saveResult(resultData);

        // REDIRECT

        window.location.replace("result.html");

    }

    catch(error){

        console.error(error);

        alert(
            "Submit Error\n\n" +
            error.message
        );

    }

}



// HIDE LOADING

function hideLoading(){

    if(loading){

        loading.style.display = "none";

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

    submitBtn.onclick = ()=>{

        if(confirm("Submit Test?")){

            submitTest();

        }

    };

}



// PAGE LOAD

window.addEventListener(
    "load",
    startTest
);



// EXPORT

window.submitTest =
submitTest;



console.log("==================================");
console.log("G THE GENIUS MOCK TEST v7 READY");
console.log("Questions :", questions.length);
console.log("Test Type :", testType);
console.log("==================================");
