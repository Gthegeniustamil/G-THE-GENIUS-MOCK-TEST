// ==========================================================
// G THE GENIUS MOCK TEST PORTAL
// MOCKTEST.JS v5.0
// PART 1
// ==========================================================

// ================= IMPORTS =================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ================= GLOBAL VARIABLES =================

let currentUser = null;

let questions = [];
let selectedAnswers = [];

let currentQuestion = 0;

let totalQuestions = 10;

let testType = "daily";

let timeLimit = 300;
let timeLeft = 300;
let timerInterval = null;


// ================= DOM =================

const timerEl = document.getElementById("timer");

const questionNumberEl =
document.getElementById("questionNumber");

const questionTextEl =
document.getElementById("questionText");

const optionsBox =
document.getElementById("optionsBox");

const palette =
document.getElementById("questionPalette");

const progressBar =
document.getElementById("testProgress");

const totalCount =
document.getElementById("totalCount");

const answeredCount =
document.getElementById("answeredCount");

const remainingCount =
document.getElementById("remainingCount");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const submitBtn =
document.getElementById("submitBtn");


// ================= AUTH =================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    await initializeTest();

});


// ================= INITIALIZE =================

async function initializeTest() {

    const params =
        new URLSearchParams(window.location.search);

    testType =
        params.get("type") || "daily";

    switch (testType) {

        case "daily":
            totalQuestions = 10;
            timeLimit = 300;
            break;

        case "weekly":
            totalQuestions = 25;
            timeLimit = 600;
            break;

        case "monthly":
            totalQuestions = 100;
            timeLimit = 3600;
            break;

    }

    timeLeft = timeLimit;

    totalCount.textContent = totalQuestions;

    selectedAnswers =
        new Array(totalQuestions).fill(null);

    await loadQuestions();

}


// ================= LOAD QUESTIONS =================

async function loadQuestions() {

    try {

        const snapshot =
            await getDocs(collection(db, "questions"));

        let allQuestions = [];

        snapshot.forEach(doc => {

            const q = doc.data();

            allQuestions.push(normalizeQuestion(q));

        });

        shuffle(allQuestions);

        questions =
            allQuestions.slice(0, totalQuestions);

        localStorage.setItem(
            "questions",
            JSON.stringify(questions)
        );

        createPalette();

        showQuestion();

        startTimer();

    }

    catch (err) {

        console.error(err);

        alert("Unable to load questions.");

    }

}


// ================= SUPPORT ALL JSON FORMATS =================

function normalizeQuestion(q) {

    return {

        question:

            q.question ||
            q.questionText ||
            q.title ||
            "",

        options:

            q.options ||

            [

                q.option1 || q.A,

                q.option2 || q.B,

                q.option3 || q.C,

                q.option4 || q.D

            ],

        answer:

            q.answer ||
            q.correctAnswer ||
            q.correctOption ||
            "",

        explanation:

            q.explanation ||
            ""

    };

}


// ================= SHUFFLE =================

function shuffle(arr) {

    for (let i = arr.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] =
        [arr[j], arr[i]];

    }

      }

// ==========================================================
// SHOW QUESTION
// ==========================================================

function showQuestion() {

    if (!questions.length) return;

    const q = questions[currentQuestion];

    questionNumberEl.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    questionTextEl.textContent = q.question;

    optionsBox.innerHTML = "";

    q.options.forEach((option, index) => {

        const optionDiv =
            document.createElement("div");

        optionDiv.className = "option";

        if (selectedAnswers[currentQuestion] === option) {

            optionDiv.classList.add("selected");

        }

        optionDiv.innerHTML = `

            <label class="option-item">

                <input
                    type="radio"
                    name="answer"
                    value="${option}"
                    ${selectedAnswers[currentQuestion] === option ? "checked" : ""}
                >

                <span>${option}</span>

            </label>

        `;

        optionDiv.onclick = () => {

            selectAnswer(option);

        };

        optionsBox.appendChild(optionDiv);

    });

    updateButtons();

    updatePalette();

    updateStatus();

}



// ==========================================================
// SELECT ANSWER
// ==========================================================

function selectAnswer(answer) {

    selectedAnswers[currentQuestion] = answer;

    localStorage.setItem(
        "selectedAnswers",
        JSON.stringify(selectedAnswers)
    );

    showQuestion();

}



// ==========================================================
// BUTTON STATUS
// ==========================================================

function updateButtons() {

    prevBtn.disabled =
        currentQuestion === 0;

    nextBtn.disabled =
        currentQuestion ===
        questions.length - 1;

}



// ==========================================================
// NEXT BUTTON
// ==========================================================

nextBtn.addEventListener("click", () => {

    if (currentQuestion <
        questions.length - 1) {

        currentQuestion++;

        showQuestion();

    }

});



// ==========================================================
// PREVIOUS BUTTON
// ==========================================================

prevBtn.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});



// ==========================================================
// QUESTION PALETTE
// ==========================================================

function createPalette() {

    palette.innerHTML = "";

    for (let i = 0; i < totalQuestions; i++) {

        const btn =
            document.createElement("button");

        btn.className = "palette-btn";

        btn.textContent = i + 1;

        btn.onclick = () => {

            currentQuestion = i;

            showQuestion();

        };

        palette.appendChild(btn);

    }

}



// ==========================================================
// UPDATE PALETTE
// ==========================================================

function updatePalette() {

    const buttons =
        palette.querySelectorAll(".palette-btn");

    buttons.forEach((btn, index) => {

        btn.classList.remove(
            "current",
            "answered"
        );

        if (index === currentQuestion) {

            btn.classList.add("current");

        }

        if (selectedAnswers[index] !== null) {

            btn.classList.add("answered");

        }

    });

}



// ==========================================================
// UPDATE STATUS
// ==========================================================

function updateStatus() {

    const answered =
        selectedAnswers.filter(
            answer => answer !== null
        ).length;

    answeredCount.textContent =
        answered;

    remainingCount.textContent =
        totalQuestions - answered;

    const percent =
        (answered / totalQuestions) * 100;

    progressBar.style.width =
        percent + "%";

                      }

// ==========================================================
// TIMER SYSTEM
// ==========================================================

function startTimer() {

    clearInterval(timerInterval);

    updateTimerDisplay();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();


        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            alert("Time Finished!");

            submitTest();

        }


    }, 1000);

}



// ==========================================================
// TIMER DISPLAY
// ==========================================================

function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    timerEl.textContent =

        `⏰ ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}



// ==========================================================
// AUTO SAVE PROGRESS
// ==========================================================

function saveProgress() {

    const data = {

        questions,

        selectedAnswers,

        currentQuestion,

        testType,

        timeLeft

    };


    localStorage.setItem(

        "mockTestProgress",

        JSON.stringify(data)

    );

}



// ==========================================================
// LOAD SAVED PROGRESS
// ==========================================================

function loadProgress() {

    const saved =

        localStorage.getItem(
            "mockTestProgress"
        );


    if (!saved) return false;


    try {

        const data =
            JSON.parse(saved);


        if (
            data.testType !== testType
        ) {

            return false;

        }


        selectedAnswers =
            data.selectedAnswers ||
            selectedAnswers;


        currentQuestion =
            data.currentQuestion || 0;


        timeLeft =
            data.timeLeft || timeLeft;


        return true;


    }

    catch(error) {

        console.log(
            "Progress Error",
            error
        );

        return false;

    }

}



// ==========================================================
// AUTO SAVE EVERY 5 SECOND
// ==========================================================

setInterval(() => {

    if (questions.length > 0) {

        saveProgress();

    }

},5000);



// ==========================================================
// CLEAR OLD DATA AFTER FINAL SUBMIT
// ==========================================================

function clearTestData(){

    localStorage.removeItem(
        "mockTestProgress"
    );

    localStorage.removeItem(
        "selectedAnswers"
    );

}



// ==========================================================
// RESTORE WHEN PAGE LOAD
// ==========================================================

// loadQuestions() முடிந்த பிறகு
// Part 1-ல் questions set ஆன இடத்தில்
// இதை அடுத்த Part-ல் integrate செய்வோம்.

// ==========================================================
// SUBMIT BUTTON EVENT
// ==========================================================

submitBtn.addEventListener("click", () => {


    const confirmSubmit = confirm(
        "Are you sure you want to submit?"
    );


    if (confirmSubmit) {

        submitTest();
      await prepareFinalResult();

window.location.href = "result.html";

    }


});



// ==========================================================
// FINAL SUBMIT FUNCTION
// ==========================================================

function submitTest() {


    clearInterval(timerInterval);



    let correct = 0;

    let wrong = 0;

    let skipped = 0;



    // ==========================================
    // SCORE CALCULATION
    // ==========================================

    questions.forEach((question, index) => {


        const userAnswer =
            selectedAnswers[index];



        // SKIPPED

        if (
            userAnswer === null ||
            userAnswer === undefined ||
            userAnswer === ""
        ) {

            skipped++;

            return;

        }



        // CORRECT

        if (
            normalizeAnswer(userAnswer)
            ===
            normalizeAnswer(question.answer)
        ) {


            correct++;


        }

        // WRONG

        else {


            wrong++;


        }


    });



    // IMPORTANT
    // Score = Correct only

    const score = correct;



    const percentage =

        Number(
            (
                (score / questions.length)
                *
                100
            )
            .toFixed(2)
        );



    // ==========================================
    // SAVE RESULT DATA
    // ==========================================


    localStorage.setItem(

        "resultData",

        JSON.stringify({

            testType,

            totalQuestions:
                questions.length,


            score,


            correct,


            wrong,


            skipped,


            percentage,


            questions,


            selectedAnswers


        })

    );



    // Clear temporary progress

    clearTestData();



    // Redirect Result

    window.location.href =
        "result.html";


}




// ==========================================================
// ANSWER NORMALIZER
// ==========================================================

function normalizeAnswer(answer){


    if(!answer)
        return "";



    return answer

        .toString()

        .trim()

        .toLowerCase();

}
// ==========================================================
// SAVE RESULT TO FIREBASE
// ==========================================================

async function saveResultToFirebase() {


    try {


        const resultData =

            JSON.parse(
                localStorage.getItem("resultData")
            );


        if(!resultData)
            return;



        const userRef =

            doc(
                db,
                "users",
                currentUser.uid
            );



        const userSnap =
            await getDoc(userRef);



        let oldXP = 0;

        let studentName =
            currentUser.displayName ||
            "Student";



        if(userSnap.exists()){


            const data =
                userSnap.data();


            oldXP =
                data.xp || 0;


            studentName =
                data.name ||
                studentName;


        }



        // XP Calculation

        const earnedXP =
            (resultData.correct * 10) + 5;



        const totalXP =
            oldXP + earnedXP;



        const level =
            Math.floor(
                totalXP / 50
            ) + 1;



        // Update User XP


        await setDoc(

            userRef,

            {

                name:
                    studentName,


                email:
                    currentUser.email,


                xp:
                    totalXP,


                level:
                    level,


                updatedAt:
                    serverTimestamp()

            },


            {
                merge:true
            }

        );





        // Save Result Document


        const resultRef =

            doc(
                collection(db,"results")
            );



        await setDoc(

            resultRef,

            {


                uid:
                    currentUser.uid,


                name:
                    studentName,


                email:
                    currentUser.email,


                testType:
                    resultData.testType,


                totalQuestions:
                    resultData.totalQuestions,


                score:
                    resultData.score,


                correct:
                    resultData.correct,


                wrong:
                    resultData.wrong,


                skipped:
                    resultData.skipped,


                percentage:
                    resultData.percentage,


                xpEarned:
                    earnedXP,


                level:
                    level,


                district:
                    localStorage.getItem("district")
                    || "",


                answers:
                    resultData.selectedAnswers,


                createdAt:
                    serverTimestamp()


            }


        );



        console.log(
            "Result Saved Successfully"
        );


    }


    catch(error){


        console.error(
            "Result Save Error:",
            error
        );


    }


}

// ==========================================================
// ADVANCED QUESTION LOADING
// FIRESTORE + JSON SUPPORT
// ==========================================================

async function loadQuestions() {

    try {


        let allQuestions = [];



        // =====================================
        // 1. TRY FIRESTORE FIRST
        // =====================================


        try {


            const snapshot =

                await getDocs(
                    collection(db,"questions")
                );



            snapshot.forEach(doc => {


                allQuestions.push(

                    normalizeQuestion(
                        doc.data()
                    )

                );


            });


        }

        catch(error){

            console.log(
                "Firestore load failed"
            );

        }





        // =====================================
        // 2. IF FIRESTORE EMPTY LOAD JSON
        // =====================================


        if(allQuestions.length === 0){


            const response =

                await fetch(
                    "questions.json"
                );


            const jsonData =
                await response.json();



            jsonData.forEach(q => {


                allQuestions.push(

                    normalizeQuestion(q)

                );


            });


        }





        // =====================================
        // REMOVE INVALID QUESTIONS
        // =====================================


        allQuestions =

            allQuestions.filter(q =>

                q.question &&
                q.options &&
                q.options.length > 0 &&
                q.answer

            );






        // =====================================
        // RANDOM QUESTIONS
        // =====================================


        shuffle(allQuestions);



        questions =

            allQuestions.slice(
                0,
                totalQuestions
            );




        // =====================================
        // RESTORE OLD TEST
        // =====================================


        const restored =
            loadProgress();



        if(!restored){


            selectedAnswers =

                new Array(
                    questions.length
                )
                .fill(null);


            currentQuestion = 0;


        }






        localStorage.setItem(

            "questions",

            JSON.stringify(
                questions
            )

        );




        localStorage.setItem(

            "selectedAnswers",

            JSON.stringify(
                selectedAnswers
            )

        );





        createPalette();


        showQuestion();


        startTimer();



    }


    catch(error){


        console.error(
            "Question Loading Error:",
            error
        );


        alert(
            "Questions not available"
        );


    }

}





// ==========================================================
// REMOVE DUPLICATE QUESTIONS
// ==========================================================

function removeDuplicateQuestions(list){


    const seen = new Set();



    return list.filter(q => {


        if(seen.has(q.question)){


            return false;


        }


        seen.add(q.question);


        return true;


    });


    }

// ==========================================================
// G THE GENIUS MOCK TEST PORTAL
// MOCKTEST.JS v5.0 FINAL
// PART 7
// ATTEMPT & RESULT DATA PREPARE
// ==========================================================


// ==========================================================
// CREATE UNIQUE ATTEMPT ID
// ==========================================================

function createAttemptId(){

    return `${currentUser.uid}_${testType}_${Date.now()}`;

}



// ==========================================================
// COUNT PREVIOUS ATTEMPTS
// ==========================================================

async function getUserAttemptNumber(){

    try{

        const snapshot = await getDocs(
            collection(db,"results")
        );


        let count = 0;


        snapshot.forEach(docSnap=>{

            const data =
            docSnap.data();


            if(
                data.uid === currentUser.uid &&
                data.testType === testType
            ){

                count++;

            }


        });


        return count + 1;


    }

    catch(error){

        console.error(
            "Attempt Count Error:",
            error
        );


        return 1;

    }

}




// ==========================================================
// PREPARE FINAL RESULT DATA
// ==========================================================

async function prepareFinalResult(){


    const data = {

        attemptId:
        createAttemptId(),


        attemptNumber:
        await getUserAttemptNumber(),



        uid:
        currentUser.uid,


        email:
        currentUser.email,



        testType:
        testType,



        totalQuestions:
        questions.length,



        questions:
        questions,



        selectedAnswers:
        selectedAnswers,


        submittedAt:
        new Date()

    };



    localStorage.setItem(

        "finalResultData",

        JSON.stringify(data)

    );


      }
// ==========================================================
// G THE GENIUS MOCK TEST PORTAL
// MOCKTEST.JS v5.0 FINAL
// PART 8
// FIRESTORE RESULT SAVE + XP SYSTEM
// ==========================================================



// ==========================================================
// SAVE RESULT TO FIRESTORE
// ==========================================================

async function saveFinalResult(){


    try{


        const resultData =

        JSON.parse(

            localStorage.getItem(
                "finalResultData"
            )

        );



        if(!resultData){

            console.log(
                "No Result Data"
            );

            return;

        }




        // ==========================
        // GET USER PROFILE
        // ==========================


        const userRef =

        doc(

            db,

            "users",

            currentUser.uid

        );



        const userSnap =

        await getDoc(userRef);



        let oldXP = 0;



        let name =
        currentUser.displayName ||
        "Student";



        if(userSnap.exists()){


            const userData =
            userSnap.data();



            oldXP =
            userData.xp || 0;



            name =
            userData.name || name;


        }





        // ==========================
        // XP CALCULATION
        // ==========================


        const result =
        JSON.parse(

            localStorage.getItem(
                "resultData"
            )

        );



        const earnedXP =

        (result.correct * 10) + 5;



        const totalXP =

        oldXP + earnedXP;



        const level =

        Math.floor(
            totalXP / 50
        ) + 1;




        // ==========================
        // UPDATE USER XP
        // ==========================


        await setDoc(

            userRef,


            {

                name:name,

                email:
                currentUser.email,


                xp:
                totalXP,


                level:
                level,


                updatedAt:
                serverTimestamp()


            },


            {
                merge:true
            }

        );





        // ==========================
        // SAVE RESULT
        // ==========================


        const resultRef =

        doc(
            collection(db,"results")
        );



        await setDoc(

            resultRef,


            {


                attemptId:
                resultData.attemptId,


                attemptNumber:
                resultData.attemptNumber,


                uid:
                currentUser.uid,


                name:name,


                email:
                currentUser.email,


                testType:
                result.testType,


                totalQuestions:
                result.totalQuestions,


                score:
                result.score,


                correct:
                result.correct,


                wrong:
                result.wrong,


                skipped:
                result.skipped,


                percentage:
                result.percentage,


                xpEarned:
                earnedXP,


                totalXP:
                totalXP,


                level:
                level,


                district:
                localStorage.getItem(
                    "district"
                ) || "",



                answers:
                result.selectedAnswers,


                createdAt:
                serverTimestamp()


            }

        );



        console.log(
            "Result Saved Successfully"
        );


    }


    catch(error){


        console.error(

            "Firebase Save Error:",

            error

        );


    }


          }

// ==========================================================
// G THE GENIUS MOCK TEST PORTAL
// MOCKTEST.JS v5.0 FINAL
// PART 9
// FINAL CONNECTION
// ==========================================================



// ==========================================================
// RESTORE TEST ON REFRESH
// ==========================================================

function restoreTest(){


    const saved =

    localStorage.getItem(
        "mockTestProgress"
    );



    if(!saved)
        return;



    try{


        const data =
        JSON.parse(saved);



        if(
            data.testType === testType
        ){


            currentQuestion =
            data.currentQuestion || 0;



            selectedAnswers =
            data.selectedAnswers ||
            selectedAnswers;



            timeLeft =
            data.timeLeft ||
            timeLeft;


        }


    }

    catch(error){

        console.log(
            "Restore Failed"
        );

    }


}




// ==========================================================
// SAVE BEFORE EXIT
// ==========================================================

window.addEventListener(

"beforeunload",

()=>{


    if(
        questions.length > 0
    ){


        localStorage.setItem(

            "mockTestProgress",


            JSON.stringify({

                currentQuestion,

                selectedAnswers,

                timeLeft,

                testType


            })

        );


    }


}

);





// ==========================================================
// FINAL CLEANUP
// ==========================================================

function finishTestCleanup(){


    localStorage.removeItem(
        "mockTestProgress"
    );


    localStorage.removeItem(
        "selectedAnswers"
    );


}



// ==========================================================
// GLOBAL ERROR HANDLER
// ==========================================================

window.addEventListener(

"error",

(event)=>{


    console.error(

        "Mock Test Error:",

        event.error

    );


}

);





// ==========================================================
// FINAL START
// ==========================================================

async function startMockTest(){


    try{


        await initializeTest();


        restoreTest();


        showQuestion();



    }


    catch(error){


        console.error(

            "Start Test Error:",

            error

        );


        alert(
            "Test Loading Failed"
        );


    }


}




// ==========================================================
// START APPLICATION
// ==========================================================

startMockTest();
