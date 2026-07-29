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

let testType = "daily";
let totalQuestions = 10;
let timeLimit = 300;

// =========================
// GET TEST TYPE
// =========================

const params = new URLSearchParams(window.location.search);

testType = params.get("type") || "daily";

switch(testType){

    case "daily":
        totalQuestions = 10;
        timeLimit = 5 * 60;
        break;

    case "weekly":
        totalQuestions = 25;
        timeLimit = 10 * 60;
        break;

    case "monthly":
        totalQuestions = 100;
        timeLimit = 60 * 60;
        break;
}

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

            const options = Array.isArray(data.options)
            ? data.options
            : [
                data.option1 || "",
                data.option2 || "",
                data.option3 || "",
                data.option4 || ""
            ];

            testQuestions.push({

                question : data.question || "",

                options : options,

                answer : Number(
                    data.answer ??
                    data.correctAnswer ??
                    0
                ),

                explanation :
                data.explanation || "",

                subject :
                data.subject || "",

                topic :
                data.topic || ""

            });

        });

        if(testQuestions.length===0){

            alert("No Questions Found");

            return;

        }

        // Shuffle

        testQuestions.sort(()=>Math.random()-0.5);

        // Limit

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

        alert("Question Load Error");

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

        btn.innerHTML = q.options[index] || "";

        btn.classList.remove("selected");

        if(selectedAnswers[currentIndex]===index){

            btn.classList.add("selected");

        }

        btn.onclick = ()=>{

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
    .forEach(btn=>btn.classList.remove("selected"));

    document.querySelectorAll(".option")[index]
    .classList.add("selected");

    updatePalette();

}

// =========================
// QUESTION PALETTE
// =========================

function createPalette(){

    const box =
    document.getElementById("questionPalette");

    if(!box) return;

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

        btn.classList.remove("active");
        btn.classList.remove("answered");

        if(index===currentIndex){

            btn.classList.add("active");

        }

        if(selectedAnswers[index]!==null){

            btn.classList.add("answered");

        }

    });

}

// =========================
// PROGRESS BAR
// =========================

function updateProgress(){

    const percent =
    ((currentIndex+1)/testQuestions.length)*100;

    document.getElementById("testProgress").style.width =
    percent + "%";

}

// =========================
// NEXT BUTTON
// =========================

document.getElementById("nextBtn").onclick = ()=>{

    if(currentIndex < testQuestions.length-1){

        currentIndex++;

        showQuestion();

    }

};

// =========================
// PREVIOUS BUTTON
// =========================

document.getElementById("previousBtn").onclick = ()=>{

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

        if(seconds <= 0){

            clearInterval(timer);

            alert("⏰ Time Over");

            submitTest();

        }

    },1000);

}

function updateTimer(seconds){

    let min = Math.floor(seconds / 60);

    let sec = seconds % 60;

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

        if(selectedAnswers[index] === null){

            skipped++;

        }

        else if(selectedAnswers[index] == q.answer){

            correct++;

        }

        else{

            wrong++;

        }

    });

    return {

        score: correct,
        correct: correct,
        wrong: wrong,
        skipped: skipped

    };

}

// =========================
// SUBMIT BUTTON
// =========================

document.getElementById("submitBtn").onclick = ()=>{

    document.getElementById("submitConfirm").style.display="block";

};

document.getElementById("cancelSubmit").onclick = ()=>{

    document.getElementById("submitConfirm").style.display="none";

};

document.getElementById("confirmSubmit").onclick = async ()=>{

    document.getElementById("submitConfirm").style.display="none";

    await submitTest();

};
// =========================
// SAVE RESULT FIREBASE
// =========================

async function saveResult(result){

    const user = auth.currentUser;

    if(!user){

        alert("User Not Logged In");

        return;
    }

    await addDoc(collection(db,"results"),{

        studentId : user.uid,

        studentName :
        localStorage.getItem("studentName") || "Student",

        district :
        localStorage.getItem("district") || "-",

        examType :
        localStorage.getItem("examGoal") || "TNUSRB",

        testType : testType,

        score : result.score,

        total : testQuestions.length,

        correct : result.correct,

        wrong : result.wrong,

        skipped : result.skipped,

        answers : selectedAnswers,

        questions : testQuestions,

        timestamp : serverTimestamp()

    });

}

// =========================
// SAVE RESULT LOCAL
// =========================

function saveResultLocal(result){

    localStorage.setItem("lastResult",JSON.stringify({

        score : result.score,

        total : testQuestions.length,

        correct : result.correct,

        wrong : result.wrong,

        skipped : result.skipped,

        answers : selectedAnswers,

        questions : testQuestions,

        testType : testType,

        examType :
        localStorage.getItem("examGoal") || "TNUSRB"

    }));

}

// =========================
// SUBMIT TEST
// =========================

let submitted = false;

async function submitTest(){

    if(submitted) return;

    submitted = true;

    try{

        clearInterval(timer);

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

        submitted = false;

        alert("❌ Result Save Failed");

    }

}

// =========================
// PREVENT EXIT
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
