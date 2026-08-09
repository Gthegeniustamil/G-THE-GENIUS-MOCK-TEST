// ======================================================
// G THE GENIUS
// MOCK TEST JS — FINAL
// Daily / Weekly / Monthly
// ======================================================

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


// ======================================================
// SETTINGS
// ======================================================

const TEST_SETTINGS = {

    daily: {
        name: "🟢 Daily Mock Test",
        questions: 15,
        minutes: 10
    },

    weekly: {
        name: "🟡 Weekly Sunday Exam",
        questions: 25,
        minutes: 15
    },

    monthly: {
        name: "🔴 Monthly Grand Test",
        questions: 100,
        minutes: 20
    }

};


// ======================================================
// URL TEST TYPE
// ======================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const testType =
    params.get("type") || "daily";


const settings =
    TEST_SETTINGS[testType] ||
    TEST_SETTINGS.daily;


const TOTAL_QUESTIONS =
    settings.questions;


const TIME_LIMIT =
    settings.minutes * 60;


// ======================================================
// VARIABLES
// ======================================================

let allQuestions = [];

let testQuestions = [];

let currentQuestion = 0;

let selectedAnswers = [];

let timer = null;

let timeLeft = TIME_LIMIT;

let testStarted = false;

let currentUser = null;


// ======================================================
// ELEMENTS
// ======================================================

const loading =
    document.getElementById("loading");

const timerElement =
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

const submitBtn =
    document.getElementById("submitBtn");

const explanationBox =
    document.getElementById("explanationBox");


// ======================================================
// AUTH CHECK
// ======================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;


        await checkTestSchedule();

    }
);


// ======================================================
// TEST SCHEDULE
// ======================================================

async function checkTestSchedule() {

    const today =
        new Date();


    // --------------------------------------------------
    // WEEKLY — SUNDAY ONLY
    // --------------------------------------------------

    if (testType === "weekly") {

        const day =
            today.getDay();


        if (day !== 0) {

            showScheduleMessage(
                "🟡 Weekly Exam is available only on Sunday."
            );

            return;

        }

    }


    // --------------------------------------------------
    // MONTHLY — 1st & 15th
    // --------------------------------------------------

    if (testType === "monthly") {

        const date =
            today.getDate();


        if (
            date !== 1 &&
            date !== 15
        ) {

            showScheduleMessage(
                "🔴 Monthly Grand Test is available only on the 1st and 15th."
            );

            return;

        }

    }


    // --------------------------------------------------
    // DAILY
    // --------------------------------------------------

    await loadQuestions();

}


// ======================================================
// SCHEDULE MESSAGE
// ======================================================

function showScheduleMessage(message) {

    if (loading) {

        loading.innerHTML = `
            <div style="
                padding:25px;
                text-align:center;
                background:rgba(255,255,255,.08);
                border:1px solid rgba(255,215,0,.3);
                border-radius:20px;
            ">

                <div style="
                    font-size:35px;
                    margin-bottom:12px;
                ">
                    ⏳
                </div>

                <h3 style="
                    color:#ffd700;
                    margin-bottom:10px;
                ">
                    ${settings.name}
                </h3>

                <p style="
                    color:#d8def0;
                    line-height:1.6;
                ">
                    ${message}
                </p>

                <button
                    onclick="location.href='dashboard.html'"
                    style="
                        margin-top:15px;
                        padding:12px 22px;
                        border:0;
                        border-radius:25px;
                        background:#ffd700;
                        color:#081229;
                        font-weight:bold;
                    "
                >
                    ← Back to Dashboard
                </button>

            </div>
        `;

    }


    if (questionText) {

        questionText.innerHTML = "";

    }


    if (optionsBox) {

        optionsBox.innerHTML = "";

    }


    if (prevBtn) {

        prevBtn.style.display = "none";

    }


    if (nextBtn) {

        nextBtn.style.display = "none";

    }


    if (submitBtn) {

        submitBtn.style.display = "none";

    }

}


// ======================================================
// LOAD QUESTIONS
// ======================================================

async function loadQuestions() {

    try {

        if (loading) {

            loading.style.display = "block";

            loading.innerHTML =
                `⏳ Loading ${settings.name}...`;

        }


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "questions"
                )
            );


        allQuestions = [];


        snapshot.forEach(
            (doc) => {

                const data =
                    doc.data();


                if (
                    data.question &&
                    Array.isArray(data.options)
                ) {

                    allQuestions.push({

                        id: doc.id,

                        ...data

                    });

                }

            }
        );


        console.log(
            "Questions Loaded:",
            allQuestions.length
        );


        // ------------------------------------------------
        // CHECK QUESTION COUNT
        // ------------------------------------------------

        if (
            allQuestions.length <
            TOTAL_QUESTIONS
        ) {

            showError(
                `Only ${allQuestions.length} questions are available. ${TOTAL_QUESTIONS} questions are required for this test.`
            );

            return;

        }


        // ------------------------------------------------
        // RANDOMIZE
        // ------------------------------------------------

        testQuestions =
            shuffleArray(
                [...allQuestions]
            ).slice(
                0,
                TOTAL_QUESTIONS
            );


        selectedAnswers =
            new Array(
                testQuestions.length
            ).fill(null);


        // ------------------------------------------------
        // UI
        // ------------------------------------------------

        if (loading) {

            loading.style.display =
                "none";

        }


        updateTestHeader();

        showQuestion();

        createQuestionPalette();

        startTimer();

        testStarted = true;

    }

    catch (error) {

        console.error(
            "Question Loading Error:",
            error
        );


        showError(
            "Failed to load questions. Please try again."
        );

    }

}


// ======================================================
// SHUFFLE
// ======================================================

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array;

}


// ======================================================
// TEST HEADER
// ======================================================

function updateTestHeader() {

    document.title =
        `${settings.name} | G THE GENIUS`;


    const header =
        document.querySelector(
            ".mock-header p"
        );


    if (header) {

        header.innerHTML = `
            ${settings.name}
            <br>
            ${TOTAL_QUESTIONS} Questions
            • ${settings.minutes} Minutes
        `;

    }


    if (timerElement) {

        timerElement.innerHTML =
            `⏰ ${formatTime(timeLeft)}`;

    }

}


// ======================================================
// TIMER
// ======================================================

function startTimer() {

    clearInterval(timer);


    timeLeft =
        TIME_LIMIT;


    updateTimer();


    timer =
        setInterval(
            () => {

                timeLeft--;

                updateTimer();


                if (timeLeft <= 0) {

                    clearInterval(timer);

                    alert(
                        "⏰ Time Over! Your test will be submitted automatically."
                    );

                    submitTest(true);

                }

            },
            1000
        );

}


// ======================================================
// TIMER DISPLAY
// ======================================================

function updateTimer() {

    if (!timerElement) return;


    timerElement.innerHTML =
        `⏰ ${formatTime(timeLeft)}`;


    if (timeLeft <= 60) {

        timerElement.style.color =
            "#ff5555";

        timerElement.style.borderColor =
            "#ff5555";

    }

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return (
        String(minutes)
        .padStart(2, "0")
        +
        ":"
        +
        String(secs)
        .padStart(2, "0")
    );

}


// ======================================================
// SHOW QUESTION
// ======================================================

function showQuestion() {

    if (
        !testQuestions.length
    ) return;


    const q =
        testQuestions[
            currentQuestion
        ];


    // --------------------------------------------------
    // QUESTION NUMBER
    // --------------------------------------------------

    if (questionNumber) {

        questionNumber.innerHTML =
            `Question ${
                currentQuestion + 1
            } / ${
                testQuestions.length
            }`;

    }


    // --------------------------------------------------
    // QUESTION TEXT
    // --------------------------------------------------

    if (questionText) {

        questionText.innerHTML =
            q.question;

    }


    // --------------------------------------------------
    // OPTIONS
    // --------------------------------------------------

    if (optionsBox) {

        optionsBox.innerHTML = "";


        q.options.forEach(
            (option, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "option-btn";


                button.type =
                    "button";


                button.innerHTML =
                    `
                    <span style="
                        font-weight:bold;
                        margin-right:8px;
                    ">
                        ${String.fromCharCode(
                            65 + index
                        )}.
                    </span>
                    ${option}
                    `;


                if (
                    selectedAnswers[
                        currentQuestion
                    ] === index
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


                optionsBox.appendChild(
                    button
                );

            }
        );

    }


    // --------------------------------------------------
    // BUTTON STATE
    // --------------------------------------------------

    if (prevBtn) {

        prevBtn.disabled =
            currentQuestion === 0;

    }


    if (nextBtn) {

        nextBtn.disabled =
            currentQuestion ===
            testQuestions.length - 1;

    }


    // --------------------------------------------------
    // CLEAR EXPLANATION
    // --------------------------------------------------

    if (explanationBox) {

        explanationBox.innerHTML = "";

    }


    updatePalette();

}


// ======================================================
// SELECT ANSWER
// ======================================================

function selectAnswer(index) {

    selectedAnswers[
        currentQuestion
    ] = index;


    showQuestion();

}


// ======================================================
// NEXT
// ======================================================

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

                scrollQuestionTop();

            }

        }
    );

}


// ======================================================
// PREVIOUS
// ======================================================

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        () => {

            if (
                currentQuestion > 0
            ) {

                currentQuestion--;

                showQuestion();

                scrollQuestionTop();

            }

        }
    );

}


// ======================================================
// SCROLL
// ======================================================

function scrollQuestionTop() {

    const card =
        document.querySelector(
            ".question-card"
        );


    if (card) {

        card.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// QUESTION PALETTE
// ======================================================

function createQuestionPalette() {

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


    palette.style.cssText = `
        display:grid;
        grid-template-columns:
        repeat(auto-fill,minmax(42px,1fr));
        gap:8px;
        margin-bottom:20px;
        padding:15px;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.12);
        border-radius:18px;
    `;


    testQuestions.forEach(
        (q, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                index + 1;


            button.className =
                "palette-btn";


            button.style.cssText = `
                min-height:40px;
                border:1px solid rgba(255,255,255,.18);
                border-radius:12px;
                background:#101d3d;
                color:white;
                font-weight:bold;
                cursor:pointer;
            `;


            button.addEventListener(
                "click",
                () => {

                    currentQuestion =
                        index;

                    showQuestion();

                    scrollQuestionTop();

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


    updatePalette();

}


// ======================================================
// UPDATE PALETTE
// ======================================================

function updatePalette() {

    document
        .querySelectorAll(
            ".palette-btn"
        )
        .forEach(
            (button, index) => {

                button.style.background =
                    "#101d3d";


                button.style.color =
                    "#ffffff";


                button.style.borderColor =
                    "rgba(255,255,255,.18)";


                if (
                    selectedAnswers[index]
                    !== null
                ) {

                    button.style.background =
                        "#ffd700";

                    button.style.color =
                        "#081229";

                }


                if (
                    index ===
                    currentQuestion
                ) {

                    button.style.border =
                        "2px solid #ffffff";

                }

            }
        );

}


// ======================================================
// SUBMIT BUTTON
// ======================================================

if (submitBtn) {

    submitBtn.addEventListener(
        "click",
        () => {

            confirmSubmit();

        }
    );

}


// ======================================================
// CONFIRM SUBMIT
// ======================================================

function confirmSubmit() {

    const unanswered =
        selectedAnswers.filter(
            answer =>
                answer === null
        ).length;


    if (unanswered > 0) {

        const confirmed =
            confirm(
                `${unanswered} question(s) are unanswered.\n\nDo you want to submit the test?`
            );


        if (!confirmed) {

            return;

        }

    }


    submitTest(false);

}


// ======================================================
// SUBMIT TEST
// ======================================================

async function submitTest(autoSubmit = false) {

    if (!testStarted && !autoSubmit) {

        return;

    }


    clearInterval(timer);


    if (submitBtn) {

        submitBtn.disabled =
            true;

        submitBtn.textContent =
            "Submitting...";

    }


    let score = 0;
   
testQuestions.forEach(
        (question, index) => {

            if (
                selectedAnswers[index] ===
                question.answer
            ) {

                score++;

            }

        }
    );


    const total =
        testQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;


    // ==================================================
    // STUDENT DATA
    // ==================================================

    const student =
        getStudentData();


    // ==================================================
    // SAVE FIRESTORE
    // ==================================================

    try {

        await addDoc(
            collection(
                db,
                "results"
            ),
            {

                uid:
                    currentUser?.uid ||
                    student.uid ||
                    "",


                studentName:
                    student.name ||
                    currentUser?.displayName ||
                    "Student",


                district:
                    student.district ||
                    "-",


                email:
                    currentUser?.email ||
                    student.email ||
                    "",


                testType:
                    testType,


                testName:
                    settings.name,


                score:
                    score,


                totalQuestions:
                    total,


                percentage:
                    percentage,


                answers:
                    selectedAnswers,


                questionIds:
                    testQuestions.map(
                        q => q.id || ""
                    ),


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


    // ==================================================
    // STREAK
    // ==================================================

    updateStreak();


    // ==================================================
    // LOCAL STORAGE
    // ==================================================

    localStorage.setItem(
        "score",
        score
    );


    localStorage.setItem(
        "totalQuestions",
        total
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


    localStorage.setItem(
        "testName",
        settings.name
    );


    // ==================================================
    // RESULT PAGE
    // ==================================================

    window.location.href =
        "result.html";

}


// ======================================================
// STUDENT DATA
// ======================================================

function getStudentData() {

    try {

        const data =
            localStorage.getItem(
                "student"
            );


        if (data) {

            return JSON.parse(data);

        }

    }

    catch (error) {

        console.error(
            error
        );

    }


    return {

        uid: "",

        name:
            localStorage.getItem(
                "studentName"
            ) || "Student",

        district:
            localStorage.getItem(
                "district"
            ) || "-",

        email:
            localStorage.getItem(
                "email"
            ) || ""

    };

}


// ======================================================
// STREAK
// ======================================================

function updateStreak() {

    const today =
        new Date()
            .toLocaleDateString(
                "en-IN"
            );


    const lastDate =
        localStorage.getItem(
            "lastTestDate"
        );


    let streak =
        Number(
            localStorage.getItem(
                "streak"
            )
        ) || 0;


    if (
        lastDate === today
    ) {

        return;

    }


    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const yesterdayString =
        yesterday.toLocaleDateString(
            "en-IN"
        );


    if (
        lastDate ===
        yesterdayString
    ) {

        streak++;

    }

    else {

        streak = 1;

    }


    localStorage.setItem(
        "streak",
        streak
    );


    localStorage.setItem(
        "lastTestDate",
        today
    );

}


// ======================================================
// ERROR
// ======================================================

function showError(message) {

    if (loading) {

        loading.innerHTML = `
            <div style="
                padding:25px;
                text-align:center;
                color:#ff7777;
            ">
                ❌ ${message}
            </div>
        `;

    }


    if (questionText) {

        questionText.innerHTML =
            "";

    }


    if (optionsBox) {

        optionsBox.innerHTML =
            "";

    }

}


// ======================================================
// BEFORE LEAVING PAGE
// ======================================================

window.addEventListener(
    "beforeunload",
    (event) => {

        if (testStarted) {

            event.preventDefault();

            event.returnValue = "";

        }

    }
);


// ======================================================
// READY
// ======================================================

console.log(
    "G THE GENIUS Mock Test Ready 🚀"
);   
