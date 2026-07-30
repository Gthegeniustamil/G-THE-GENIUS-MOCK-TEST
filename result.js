// ===================================
// G THE GENIUS MOCK TEST ENGINE
// FINAL VERSION
// PART 1
// ===================================

import { db, auth } from "./firebase-config.js";

import {
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===================================
// TEST TYPE
// ===================================

const params = new URLSearchParams(window.location.search);

let testType = params.get("type") || "daily";

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


// ===================================
// VARIABLES
// ===================================

let questions = [];

let selectedAnswers = [];

let currentQuestion = 0;

let timerInterval = null;


// ===================================
// HTML ELEMENTS
// ===================================

const timer =
document.getElementById("timer");

const questionNumber =
document.getElementById("questionNumber");

const questionText =
document.getElementById("questionText");

const optionsBox =
document.getElementById("optionsBox");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const palette =
document.getElementById("questionPalette");

const totalCount =
document.getElementById("totalCount");

const answeredCount =
document.getElementById("answeredCount");

const remainingCount =
document.getElementById("remainingCount");

const progressBar =
document.getElementById("testProgress");


// ===================================
// SHUFFLE
// ===================================

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        let j =
        Math.floor(Math.random()*(i+1));

        [array[i],array[j]] =
        [array[j],array[i]];

    }

    return array;

}


// ===================================
// LOAD QUESTIONS
// ===================================

async function loadQuestions(){

    try{

        const snap =
        await getDocs(
            collection(db,"questions")
        );

        let allQuestions = [];

        snap.forEach(doc=>{

            allQuestions.push({

                id:doc.id,

                ...doc.data()

            });

        });

        shuffle(allQuestions);

        questions =
        allQuestions.slice(0,totalQuestions);

        selectedAnswers =
        new Array(questions.length).fill(null);

        totalCount.textContent =
        questions.length;

        createPalette();

        showQuestion();

        startTimer();

    }

    catch(error){

        console.error(
            "Question Load Error",
            error
        );

        alert("Questions loading failed.");

    }

}


// ===================================
// START
// ===================================

loadQuestions();

