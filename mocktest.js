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
let timer = null;
let submitted = false;

let testType = "daily";
let totalQuestions = 10;
let timeLimit = 300;

// =========================
// GET TEST TYPE
// =========================

const params = new URLSearchParams(window.location.search);

testType = params.get("type") || "daily";

let testTitle = "Daily Mock Test";

switch(testType){

    case "daily":
        totalQuestions = 10;
        timeLimit = 5 * 60;
        testTitle = "Daily Mock Test";
        break;

    case "weekly":
        totalQuestions = 25;
        timeLimit = 10 * 60;
        testTitle = "Weekly Mock Test";
        break;

    case "monthly":
        totalQuestions = 100;
        timeLimit = 60 * 60;
        testTitle = "Monthly Grand Test";
        break;

}

// =========================
// UPDATE PAGE
// =========================

document.getElementById("testTitle").innerHTML = testTitle;
document.getElementById("testType").innerHTML = testTitle;

document.getElementById("totalMarks").innerHTML = totalQuestions;
document.getElementById("timeLimit").innerHTML = Math.floor(timeLimit/60);

// =========================
// AUTH CHECK
// =========================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        alert("Please Login");

        window.location.href="login.html";

        return;

    }

    await loadMockQuestions();

});

// =========================
// LOAD QUESTIONS
// =========================

async function loadMockQuestions(){

    try{

        const snap = await getDocs(collection(db,"questions"));

        testQuestions = [];

        snap.forEach(doc=>{

            const data = doc.data();

            testQuestions.push({

                question : data.question,

                options : Array.isArray(data.options)
                    ? data.options
                    : [
                        data.option1,
                        data.option2,
                        data.option3,
                        data.option4
                    ],

                answer : Number(
                    data.answer ??
                    data.correctAnswer ??
                    0
                ),

                explanation : data.explanation || "",

                subject : data.subject || "",

                topic : data.topic || ""

            });

        });

        if(testQuestions.length===0){

            alert("No Questions Found");

            return;

        }

        testQuestions.sort(()=>Math.random()-0.5);

        testQuestions =
        testQuestions.slice(0,totalQuestions);

        selectedAnswers =
        new Array(testQuestions.length).fill(null);

        document.getElementById("totalQuestions").innerHTML =
        testQuestions.length;

        createPalette();

        showQuestion();

        startTimer();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// =========================
// SHOW QUESTION
// =========================

function showQuestion(){

    if(testQuestions.length===0) return;

    const q = testQuestions[currentIndex];

    document.getElementById("currentQuestion").innerHTML =
    currentIndex + 1;

    document.getElementById("questionText").innerHTML =
    q.question;

    const buttons =
    document.querySelectorAll(".option");

    buttons.forEach((btn,index)=>{

        btn.innerHTML =
        q.options[index] || "";

        btn.classList.remove("selected");

        if(selectedAnswers[currentIndex]===index){

            btn.classList.add("selected");

        }

        btn.onclick=()=>{

            selectAnswer(index);

        };

    });

    updatePalette();

    updateProgress();

}

// =========================
// SELECT ANSWER
// =========================

function selectAnswer(index){

    selectedAnswers[currentIndex]=index;

    document.querySelectorAll(".option")
    .forEach(btn=>{

        btn.classList.remove("selected");

    });

    document.querySelectorAll(".option")[index]
    .classList.add("selected");

    updatePalette();

}

// =========================
// CREATE PALETTE
// =========================

function createPalette(){

    const box =
    document.getElementById("questionPalette");

    box.innerHTML="";

    testQuestions.forEach((q,index)=>{

        const btn =
        document.createElement("button");

        btn.innerHTML=index+1;

        btn.onclick=()=>{

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

    buttons.forEach((btn,index)=>{

        btn.classList.remove(
            "active",
            "answered"
        );

        if(index===currentIndex){

            btn.classList.add("active");

        }

        if(selectedAnswers[index]!==null){

            btn.classList.add("answered");

        }

    });

}

// =========================
// UPDATE PROGRESS
// =========================

function updateProgress(){

    const percent =
    ((currentIndex+1)/
    testQuestions.length)*100;

    document.getElementById(
    "testProgress"
    ).style.width =
    percent + "%";

}

// =========================
// NEXT BUTTON
// =========================

document.getElementById(
"nextBtn"
).onclick=()=>{

    if(
        currentIndex <
        testQuestions.length-1
    ){

        currentIndex++;

        showQuestion();

    }

};

// =========================
// PREVIOUS BUTTON
// =========================

document.getElementById(
"previousBtn"
).onclick=()=>{

    if(currentIndex>0){

        currentIndex--;

        showQuestion();

    }

};

// =========================
// TIMER
// =========================

function startTimer(){

    let seconds = timeLimit;

    updateTimer(seconds);

    timer = setInterval(()=>{

        seconds--;

        updateTimer(seconds);

        if(seconds<=0){

            clearInterval(timer);

            alert("⏰ Time Over");

            submitTest();

        }

    },1000);

}

function updateTimer(seconds){

    let min = Math.floor(seconds/60);

    let sec = seconds%60;

    document.getElementById("timer").innerHTML =
    "⏰ " +
    String(min).padStart(2,"0") +
    ":" +
    String(sec).padStart(2,"0");

}

// =========================
// CALCULATE RESULT
// =========================

function calculateResult(){

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    testQuestions.forEach((q,index)=>{

        if(selectedAnswers[index]===null){

            skipped++;

        }

        else if(selectedAnswers[index]===q.answer){

            correct++;

        }

        else{

            wrong++;

        }

    });

    return{

        score:correct,
        correct:correct,
        wrong:wrong,
        skipped:skipped

    };

}

// =========================
// SUBMIT CONFIRM
// =========================

document.getElementById("submitBtn").onclick=()=>{

    document.getElementById(
    "submitConfirm"
    ).style.display="block";

};

document.getElementById("cancelSubmit").onclick=()=>{

    document.getElementById(
    "submitConfirm"
    ).style.display="none";

};

document.getElementById("confirmSubmit").onclick=()=>{

    submitTest();

};

// =========================
// SAVE RESULT
// =========================

async function saveResult(result){

    const user = auth.currentUser;

    if(!user) return;

    await addDoc(

        collection(db,"results"),

        {

            studentId:user.uid,

            studentName:
            localStorage.getItem("studentName") || "Student",

            district:
            localStorage.getItem("district") || "-",

            examType:
            localStorage.getItem("examGoal") || "TNUSRB",

            testType:testType,

            score:result.score,

            total:testQuestions.length,

            correct:result.correct,

            wrong:result.wrong,

            skipped:result.skipped,

            answers:selectedAnswers,

            questions:testQuestions,

            timestamp:serverTimestamp()

        }

    );

  }

// =========================
// SAVE RESULT LOCAL
// =========================

function saveResultLocal(result){

    localStorage.setItem(
        "lastResult",
        JSON.stringify({

            score:result.score,

            total:testQuestions.length,

            correct:result.correct,

            wrong:result.wrong,

            skipped:result.skipped,

            answers:selectedAnswers,

            questions:testQuestions,

            testType:testType,

            examType:
            localStorage.getItem("examGoal") || "TNUSRB"

        })
    );

}

// =========================
// SUBMIT TEST
// =========================

async function submitTest(){

    if(submitted) return;

    submitted = true;

    clearInterval(timer);

    document.getElementById("submitConfirm").style.display="none";

    try{

        const result = calculateResult();

        saveResultLocal(result);

        await saveResult(result);

        alert(
            "🎉 Test Completed\n\n" +
            "Marks : " +
            result.score +
            " / " +
            testQuestions.length
        );

        window.location.href = "result.html";

    }

    catch(error){

        console.error(error);

        alert("❌ Result Save Failed");

        submitted = false;

    }

}

// =========================
// PREVENT PAGE EXIT
// =========================

window.onbeforeunload = function(){

    if(!submitted){

        return "Test is running.";

    }

};

// =========================
// FINAL READY
// =========================

console.log("✅ G THE GENIUS MOCK TEST READY");
