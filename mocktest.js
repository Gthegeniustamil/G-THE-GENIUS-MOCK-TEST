// ==========================================
// G THE GENIUS MOCK TEST
// FINAL MOCK TEST JS
// Daily 15Q / 10 Min
// Weekly Sunday 25Q / 15 Min
// Monthly 1st & 15th 100Q / 20 Min
// ==========================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// VARIABLES
// ==========================================

let allQuestions = [];
let testQuestions = [];

let currentQuestion = 0;
let selectedAnswers = [];

let timerInterval = null;
let timeLeft = 0;

let testType = "daily";

let totalQuestions = 15;
let timeLimit = 600;


// ==========================================
// URL TEST TYPE
// ==========================================

const urlParams = new URLSearchParams(window.location.search);

testType = urlParams.get("type") || "daily";


// ==========================================
// TEST SETTINGS
// ==========================================

function setTestSettings() {

    const today = new Date();
    const day = today.getDay();
    const date = today.getDate();


    // -------------------------
    // DAILY
    // -------------------------

    if (testType === "daily") {

        totalQuestions = 15;
        timeLimit = 10 * 60;

        document.getElementById("testTitle").innerHTML =
            "🎯 Daily Mock Test";

        document.getElementById("testTypeName").innerHTML =
            "🟢 Daily Mock Test";

    }


    // -------------------------
    // WEEKLY
    // Sunday Only
    // -------------------------

    else if (testType === "weekly") {

        if (day !== 0) {

            document.getElementById("testTitle").innerHTML =
                "🟡 Weekly Mock Test";

            document.getElementById("testTypeName").innerHTML =
                "Available Every Sunday";

            document.getElementById("questionText").innerHTML =
                "🗓️ Weekly Mock Test is available every Sunday.";

            document.getElementById("optionsContainer").innerHTML = "";

            document.getElementById("nextBtn").disabled = true;
            document.getElementById("previousBtn").disabled = true;
            document.getElementById("submitBtn").disabled = true;

            return false;
        }


        totalQuestions = 25;
        timeLimit = 15 * 60;

        document.getElementById("testTitle").innerHTML =
            "🎯 Weekly Mock Test";

        document.getElementById("testTypeName").innerHTML =
            "🟡 Weekly Mock Test";

    }


    // -------------------------
    // MONTHLY
    // 1st & 15th
    // -------------------------

    else if (testType === "monthly") {

        if (date !== 1 && date !== 15) {

            document.getElementById("testTitle").innerHTML =
                "🔴 Monthly Grand Test";

            document.getElementById("testTypeName").innerHTML =
                "Available on 1st & 15th";

            document.getElementById("questionText").innerHTML =
                "📅 Monthly Grand Test is available on the 1st and 15th of every month.";

            document.getElementById("optionsContainer").innerHTML = "";

            document.getElementById("nextBtn").disabled = true;
            document.getElementById("previousBtn").disabled = true;
            document.getElementById("submitBtn").disabled = true;

            return false;
        }


        totalQuestions = 100;
        timeLimit = 20 * 60;

        document.getElementById("testTitle").innerHTML =
            "🎯 Monthly Grand Test";

        document.getElementById("testTypeName").innerHTML =
            "🔴 Monthly Grand Test";

    }


    // -------------------------
    // HEADER DETAILS
    // -------------------------

    document.getElementById("totalQuestions").innerHTML =
        totalQuestions;

    document.getElementById("testTime").innerHTML =
        formatTime(timeLimit);

    return true;
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);

    timeLeft = timeLimit;

    updateTimer();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            alert("⏰ Time Over! Test will be submitted.");

            submitTest();

        }

    }, 1000);
}


// ==========================================
// UPDATE TIMER
// ==========================================

function updateTimer() {

    const timerElement =
        document.getElementById("timer");

    timerElement.innerHTML =
        `⏰ ${formatTime(timeLeft)}`;


    if (timeLeft <= 60) {

        timerElement.style.borderColor = "#ff5555";
        timerElement.style.color = "#ff5555";

    } else {

        timerElement.style.borderColor = "#ffd700";
        timerElement.style.color = "#ffd700";

    }
}


// ==========================================
// LOAD QUESTIONS
// ==========================================

async function loadQuestions() {

    try {

        document.getElementById("questionText").innerHTML =
            "⏳ Loading Questions...";


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


        if (allQuestions.length === 0) {

            document.getElementById("questionText").innerHTML =
                "❌ No Questions Found";

            return;

        }


        // Random Questions

        testQuestions =
            [...allQuestions]
                .sort(() => Math.random() - 0.5)
                .slice(0, totalQuestions);


        // If database has fewer questions

        if (testQuestions.length < totalQuestions) {

            console.warn(
                `Only ${testQuestions.length} questions available`
            );

        }


        selectedAnswers =
            new Array(testQuestions.length).fill(null);


        showQuestion();

        createPalette();

        startTimer();


    } catch (error) {

        console.error(
            "Question Loading Error:",
            error
        );


        document.getElementById("questionText").innerHTML =
            "❌ Failed To Load Questions";


    }

}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    if (!testQuestions.length) return;


    const q =
        testQuestions[currentQuestion];


    // Question Number

    document.getElementById("questionCount").innerHTML =
        `Question ${currentQuestion + 1} / ${testQuestions.length}`;


    // Progress

    const progress =
        ((currentQuestion + 1) /
            testQuestions.length) * 100;


    document.getElementById("progressFill").style.width =
        progress + "%";


    // Question

    document.getElementById("questionText").innerHTML =
        q.question || "Question not available";


    // Options

    const optionsContainer =
        document.getElementById("optionsContainer");


    optionsContainer.innerHTML = "";


    if (!q.options || !Array.isArray(q.options)) {

        optionsContainer.innerHTML =
            "<p>❌ Options not available for this question.</p>";

        return;

    }


    q.options.forEach((option, index) => {

        const button =
            document.createElement("button");


        button.className =
            "option-btn";


        button.type = "button";


        button.innerHTML =
            `${String.fromCharCode(65 + index)}. ${option}`;


        // Selected

        if (
            selectedAnswers[currentQuestion] === index
        ) {

            button.classList.add("selected");

        }


        button.addEventListener("click", () => {

            selectedAnswers[currentQuestion] =
                index;

            showQuestion();

            updatePalette();

        });


        optionsContainer.appendChild(button);

    });


    updateNavigationButtons();

}


// ==========================================
// NAVIGATION BUTTONS
// ==========================================

function updateNavigationButtons() {

    const previousBtn =
        document.getElementById("previousBtn");

    const nextBtn =
        document.getElementById("nextBtn");


    previousBtn.disabled =
        currentQuestion === 0;


    nextBtn.disabled =
        currentQuestion ===
        testQuestions.length - 1;

}


// ==========================================
// NEXT
// ==========================================

document.getElementById("nextBtn")
    .addEventListener("click", () => {

        if (
            currentQuestion <
            testQuestions.length - 1
        ) {

            currentQuestion++;

            showQuestion();

            updatePalette();

        }

    });


// ==========================================
// PREVIOUS
// ==========================================

document.getElementById("previousBtn")
    .addEventListener("click", () => {

        if (currentQuestion > 0) {

            currentQuestion--;

            showQuestion();

            updatePalette();

        }

    });


// ==========================================
// QUESTION PALETTE
// ==========================================

function createPalette() {

    const oldPalette =
        document.getElementById("questionPalette");

    if (oldPalette) {

        oldPalette.remove();

    }


    const palette =
        document.createElement("div");


    palette.id =
        "questionPalette";


    palette.style.display = "grid";
    palette.style.gridTemplateColumns =
        "repeat(6, 1fr)";
    palette.style.gap = "14px";
    palette.style.marginBottom = "25px";


    testQuestions.forEach((question, index) => {

        const button =
            document.createElement("button");


        button.type = "button";


        button.className =
            "palette-btn";


        button.innerHTML =
            index + 1;


        button.addEventListener("click", () => {

            currentQuestion = index;

            showQuestion();

            updatePalette();

        });


        palette.appendChild(button);

    });


    const questionHeader =
        document.querySelector(".question-header");


    questionHeader.insertAdjacentElement(
        "afterend",
        palette
    );


    updatePalette();

}


// ==========================================
// UPDATE PALETTE
// ==========================================

function updatePalette() {

    document
        .querySelectorAll(".palette-btn")
        .forEach((button, index) => {

            button.classList.remove(
                "active",
                "answered"
            );


            if (
                selectedAnswers[index] !== null
            ) {

                button.classList.add("answered");

            }


            if (
                index === currentQuestion
            ) {

                button.classList.add("active");

            }

        });

}


// ==========================================
// SUBMIT CONFIRM
// ==========================================

function confirmSubmit() {

    const unanswered =
        selectedAnswers.filter(
            answer => answer === null
        ).length;


    if (unanswered > 0) {

        const confirmResult =
            confirm(
                `${unanswered} Questions unanswered.\n\nDo you want to submit the test?`
            );


        if (confirmResult) {

            submitTest();

        }

    } else {

        submitTest();

    }

}


// ==========================================
// SUBMIT BUTTON
// ==========================================

document.getElementById("submitBtn")
    .addEventListener("click", () => {

        confirmSubmit();

    });


// ==========================================
// SUBMIT TEST
// ==========================================

async function submitTest() {

    clearInterval(timerInterval);


    let score = 0;


    testQuestions.forEach((question, index) => {

        if (
            selectedAnswers[index] ===
            Number(question.answer)
        ) {

            score++;

        }

    });


    // Save Result

    try {

        await addDoc(
            collection(db, "results"),
            {

                studentName:
                    localStorage.getItem("studentName") ||
                    JSON.parse(
                        localStorage.getItem("student") ||
                        "{}"
                    ).name ||
                    "Student",

                district:
                    localStorage.getItem("district") ||
                    JSON.parse(
                        localStorage.getItem("student") ||
                        "{}"
                    ).district ||
                    "-",

                testType:
                    testType,

                score:
                    score,

                totalQuestions:
                    testQuestions.length,

                percentage:
                    Math.round(
                        (score /
                            testQuestions.length) *
                        100
                    ),

                createdAt:
                    serverTimestamp()

            }
        );


    } catch (error) {

        console.error(
            "Result Save Error:",
            error
        );

    }


    // Save for Result Page

    localStorage.setItem(
        "score",
        score
    );


    localStorage.setItem(
        "totalQuestions",
        testQuestions.length
    );


    localStorage.setItem(
        "questions",
        JSON.stringify(testQuestions)
    );


    localStorage.setItem(
        "userAnswers",
        JSON.stringify(selectedAnswers)
    );


    localStorage.setItem(
        "testType",
        testType
    );


    // Result Page

    window.location.href =
        "result.html";

}


// ==========================================
// START
// ==========================================

const testAllowed =
    setTestSettings();


if (testAllowed) {

    loadQuestions();

                          }
