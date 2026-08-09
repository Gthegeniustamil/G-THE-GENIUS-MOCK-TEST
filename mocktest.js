/* =========================================================
   G THE GENIUS
   MOCK TEST ENGINE
   PREMIUM MOBILE APP VERSION
   ========================================================= */

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let allQuestions = [];

let testQuestions = [];

let currentQuestion = 0;

let selectedAnswers = [];

let timer = null;

let timeLeft = 0;


/* =========================================================
   TEST SETTINGS
========================================================= */

let testType = "daily";

let totalQuestions = 15;

let timeLimit = 600;


/* =========================================================
   URL TEST TYPE
========================================================= */

const urlParams =
    new URLSearchParams(window.location.search);


testType =
    urlParams.get("type") || "daily";


testType =
    testType.toLowerCase();


/* =========================================================
   TEST CONFIGURATION
========================================================= */

function setupTest() {

    const today = new Date();

    const day = today.getDay();

    const date = today.getDate();


    /* =========================
       DAILY
    ========================= */

    if (testType === "daily") {

        totalQuestions = 15;

        timeLimit = 10 * 60;

        setText(
            "testTitle",
            "🟢 Daily Mock Test"
        );

        setText(
            "testTypeName",
            "🟢 Daily"
        );

        setText(
            "totalQuestions",
            "15"
        );

        setText(
            "testTime",
            "10 Minutes"
        );

    }


    /* =========================
       WEEKLY
    ========================= */

    else if (testType === "weekly") {

        totalQuestions = 25;

        timeLimit = 15 * 60;

        setText(
            "testTitle",
            "🟡 Weekly Compulsory Exam"
        );

        setText(
            "testTypeName",
            "🟡 Weekly"
        );

        setText(
            "totalQuestions",
            "25"
        );

        setText(
            "testTime",
            "15 Minutes"
        );


        /*
           Sunday = 0
        */

        if (day !== 0) {

            showScheduleMessage(
                "🗓️ Weekly Exam Sunday மட்டும் available."
            );

            return false;

        }

    }


    /* =========================
       MONTHLY
    ========================= */

    else if (testType === "monthly") {

        totalQuestions = 100;

        timeLimit = 20 * 60;

        setText(
            "testTitle",
            "🔴 Monthly Grand Test"
        );

        setText(
            "testTypeName",
            "🔴 Monthly"
        );

        setText(
            "totalQuestions",
            "100"
        );

        setText(
            "testTime",
            "20 Minutes"
        );


        /*
           Monthly Test:
           1st & 15th
        */

        if (date !== 1 && date !== 15) {

            showScheduleMessage(
                "📅 Monthly Grand Test 1st மற்றும் 15th தேதி மட்டும் available."
            );

            return false;

        }

    }


    /* =========================
       UNKNOWN TYPE
    ========================= */

    else {

        testType = "daily";

        totalQuestions = 15;

        timeLimit = 600;

        setText(
            "testTitle",
            "🟢 Daily Mock Test"
        );

        setText(
            "testTypeName",
            "🟢 Daily"
        );

        setText(
            "totalQuestions",
            "15"
        );

        setText(
            "testTime",
            "10 Minutes"
        );

    }


    return true;

}


/* =========================================================
   HELPER
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* =========================================================
   SCHEDULE MESSAGE
========================================================= */

function showScheduleMessage(message) {

    const testArea =
        document.getElementById("testArea");

    if (!testArea) return;


    testArea.innerHTML = `

        <div class="result-box"
             style="display:block;">

            <h2>📅 Test Schedule</h2>

            <p style="
                margin:18px 0;
                color:#d7def2;
                line-height:1.7;
            ">

                ${message}

            </p>

            <button
                class="retry-btn"
                onclick="location.href='dashboard.html'">

                ← Back to Dashboard

            </button>

        </div>

    `;

}


/* =========================================================
   LOAD QUESTIONS
========================================================= */

async function loadQuestions() {

    try {

        setText(
            "questionText",
            "⏳ Loading Questions..."
        );


        const snapshot =
            await getDocs(
                collection(db, "questions")
            );


        allQuestions = [];


        snapshot.forEach((doc) => {

            const data = doc.data();

            allQuestions.push({

                id: doc.id,

                ...data

            });

        });


        console.log(
            "Questions Loaded:",
            allQuestions.length
        );


        if (allQuestions.length < totalQuestions) {

            setText(
                "questionText",
                `⚠️ இந்த Test-க்கு ${totalQuestions} Questions தேவை.`
            );

            return;

        }


        /* =========================
           RANDOM QUESTIONS
        ========================= */

        testQuestions =
            [...allQuestions]
                .sort(
                    () => Math.random() - 0.5
                )
                .slice(
                    0,
                    totalQuestions
                );


        selectedAnswers =
            new Array(
                testQuestions.length
            ).fill(null);


        currentQuestion = 0;


        updateTestInfo();


        createPalette();


        showQuestion();


        updateProgress();


        startTimer();


        const loading =
            document.getElementById("loading");

        if (loading) {

            loading.style.display = "none";

        }

    }

    catch (error) {

        console.error(
            "Question Loading Error:",
            error
        );


        setText(
            "questionText",
            "❌ Questions Load ஆகவில்லை. மீண்டும் முயற்சி செய்யுங்கள்."
        );

    }

}


/* =========================================================
   TEST INFO
========================================================= */

function updateTestInfo() {

    setText(
        "totalQuestions",
        testQuestions.length
    );


    setText(
        "testTime",
        formatTime(timeLimit)
    );


    setText(
        "questionCount",
        `Question 1 / ${testQuestions.length}`
    );

}


/* =========================================================
   SHOW QUESTION
========================================================= */

function showQuestion() {

    if (!testQuestions.length) return;


    const question =
        testQuestions[currentQuestion];


    /* =========================
       QUESTION NUMBER
    ========================= */

    setText(
        "questionCount",
        `Question ${currentQuestion + 1} / ${testQuestions.length}`
    );


    const questionNumber =
        document.getElementById(
            "questionNumber"
        );


    if (questionNumber) {

        questionNumber.textContent =
            `Question ${currentQuestion + 1} / ${testQuestions.length}`;

    }


    /* =========================
       QUESTION TEXT
    ========================= */

    setText(
        "questionText",
        question.question || "Question unavailable"
    );


    /* =========================
       OPTIONS
    ========================= */

    const container =
        document.getElementById(
            "optionsContainer"
        );


    if (!container) return;


    container.innerHTML = "";


    let options =
        question.options || [];


    options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";


            button.className =
                "option-btn";


            button.textContent =
                `${String.fromCharCode(65 + index)}. ${option}`;


            if (
                selectedAnswers[currentQuestion] ===
                index
            ) {

                button.classList.add(
                    "selected"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(index);

                }
            );


            container.appendChild(
                button
            );

        }
    );


    updateNavigation();


    updateProgress();


    updatePalette();

}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(index) {

    selectedAnswers[currentQuestion] =
        index;


    showQuestion();

}


/* =========================================================
   NEXT BUTTON
========================================================= */

const nextBtn =
    document.getElementById(
        "nextBtn"
    );


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            if (
                currentQuestion <
                testQuestions.length - 1
            ) {

                currentQuestion++;

                showQuestion();

            }

        }
    );

}


/* =========================================================
   PREVIOUS BUTTON
========================================================= */

const previousBtn =
    document.getElementById(
        "previousBtn"
    );


if (previousBtn) {

    previousBtn.addEventListener(
        "click",
        () => {

            if (
                currentQuestion > 0
            ) {

                currentQuestion--;

                showQuestion();

            }

        }
    );

}


/* =========================================================
   NAVIGATION STATE
========================================================= */

function updateNavigation() {

    if (previousBtn) {

        previousBtn.disabled =
            currentQuestion === 0;

    }


    if (nextBtn) {

        nextBtn.disabled =
            currentQuestion ===
            testQuestions.length - 1;

    }

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

    const fill =
        document.getElementById(
            "progressFill"
        );


    if (!fill) return;


    const progress =
        (
            (currentQuestion + 1) /
            testQuestions.length
        ) * 100;


    fill.style.width =
        `${progress}%`;

}


/* =========================================================
   QUESTION PALETTE
========================================================= */

function createPalette() {

    let oldPalette =
        document.getElementById(
            "questionPalette"
        );


    if (oldPalette) {

        oldPalette.remove();

    }


    const palette =
        document.createElement(
            "div"
        );


    palette.id =
        "questionPalette";


    palette.className =
        "question-palette";


    testQuestions.forEach(
        (question, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";


            button.className =
                "palette-btn";


            button.textContent =
                index + 1;


            button.addEventListener(
                "click",
                () => {

                    currentQuestion =
                        index;

                    showQuestion();

                }
            );


            palette.appendChild(
                button
            );

        }
    );


    const questionCard =
        document.querySelector(
            ".question-card"
        );


    if (questionCard) {

        questionCard.before(
            palette
        );

    }

}


/* =========================================================
   UPDATE PALETTE
========================================================= */

function updatePalette() {

    const buttons =
        document.querySelectorAll(
            ".palette-btn"
        );


    buttons.forEach(
        (button, index) => {

            button.classList.remove(
                "active",
                "answered"
            );


            if (
                selectedAnswers[index] !==
                null
            ) {

                button.classList.add(
                    "answered"
                );

            }


            if (
                index === currentQuestion
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearInterval(timer);


    timeLeft = timeLimit;


    updateTimer();


    timer =
        setInterval(
            () => {

                timeLeft--;


                updateTimer();


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(timer);


                    alert(
                        "⏰ Time Over! Test automatically submitted."
                    );


                    submitTest(true);

                }

            },
            1000
        );

}


/* =========================================================
   UPDATE TIMER
========================================================= */

function updateTimer() {

    const timerElement =
        document.getElementById(
            "timer"
        );


    if (!timerElement) return;


    timerElement.textContent =
        formatTime(timeLeft);


    timerElement.classList.remove(
        "timer-warning",
        "timer-danger"
    );


    if (timeLeft <= 60) {

        timerElement.classList.add(
            "timer-danger"
        );

    }

    else if (timeLeft <= 180) {

        timerElement.classList.add(
            "timer-warning"
        );

    }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}


/* =========================================================
   SUBMIT BUTTON
========================================================= */

const submitBtn =
    document.getElementById(
        "submitBtn"
    );


if (submitBtn) {

    submitBtn.addEventListener(
        "click",
        confirmSubmit
    );

}


/* =========================================================
   CONFIRM SUBMIT
========================================================= */

function confirmSubmit() {

    if (!testQuestions.length) {

        return;

    }


    const unanswered =
        selectedAnswers.filter(
            answer => answer === null
        ).length;


    if (unanswered > 0) {

        const confirmResult =
            confirm(
                `⚠️ ${unanswered} Questions unanswered.\n\nTest submit செய்யலாமா?`
            );


        if (!confirmResult) {

            return;

        }

    }


    submitTest(false);

}


/* =========================================================
   SUBMIT TEST
========================================================= */

async function submitTest(autoSubmit = false) {

    clearInterval(timer);


    if (!testQuestions.length) {

        return;

    }


    /* =========================
       CALCULATE SCORE
    ========================= */

    let score = 0;


    testQuestions.forEach(
        (question, index) => {

            if (
                isCorrectAnswer(
                    question.answer,
                    selectedAnswers[index]
                )
            ) {

                score++;

            }

        }
    );


    const total =
        testQuestions.length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    const answered =
        selectedAnswers.filter(
            answer => answer !== null
        ).length;


    const skipped =
        total - answered;


    /* =========================
       STUDENT DATA
    ========================= */

    const studentName =
        localStorage.getItem(
            "studentName"
        ) ||
        localStorage.getItem(
            "name"
        ) ||
        "Student";


    const district =
        localStorage.getItem(
            "district"
        ) ||
        "-";


    /* =========================
       SAVE RESULT
    ========================= */

    try {

        await addDoc(
            collection(
                db,
                "results"
            ),
            {

                studentName:
                    studentName,

                district:
                    district,

                testType:
                    testType,

                score:
                    score,

                totalQuestions:
                    total,

                answered:
                    answered,

                skipped:
                    skipped,

                percentage:
                    percentage,

                autoSubmitted:
                    autoSubmit,

                createdAt:
                    serverTimestamp()

            }
        );


        console.log(
            "Result Saved Successfully"
        );

    }

    catch (error) {

        console.error(
            "Result Save Error:",
            error
        );

    }


    /* =========================
       STREAK
    ========================= */

    updateStreak();


    /* =========================
       LOCAL STORAGE
    ========================= */

    localStorage.setItem(
        "score",
        score
    );


    localStorage.setItem(
        "totalQuestions",
        total
    );


    localStorage.setItem(
        "answered",
        answered
    );


    localStorage.setItem(
        "skipped",
        skipped
    );


    localStorage.setItem(
        "percentage",
        percentage
    );


    localStorage.setItem(
        "questions",
        JSON.stringify(
            testQuestions
        )
    );


    localStorage.setItem(
        "userAnswers",
        JSON.stringify(
            selectedAnswers
        )
    );


    localStorage.setItem(
        "testType",
        testType
    );


    /* =========================
       RESULT PAGE
    ========================= */

    window.location.href =
        "result.html";

}


/* ======================================
