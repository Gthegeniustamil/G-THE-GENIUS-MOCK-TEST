/* =========================================================
   G THE GENIUS
   MOCK TEST ENGINE
   Daily / Weekly / Monthly
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

let testSubmitted = false;


/* =========================================================
   TEST SETTINGS
   ========================================================= */

let testType = "daily";

let totalQuestions = 15;

let timeLimit = 10 * 60;


/* =========================================================
   URL TEST TYPE
   ========================================================= */

const urlParams =
    new URLSearchParams(window.location.search);

testType =
    urlParams.get("type") || "daily";


/* =========================================================
   TEST CONFIGURATION
   ========================================================= */

if (testType === "daily") {

    totalQuestions = 15;

    timeLimit = 10 * 60;

}
else if (testType === "weekly") {

    totalQuestions = 25;

    timeLimit = 15 * 60;

}
else if (testType === "monthly") {

    totalQuestions = 100;

    timeLimit = 20 * 60;

}
else {

    testType = "daily";

    totalQuestions = 15;

    timeLimit = 10 * 60;
}


/* =========================================================
   GET ELEMENT
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


/* =========================================================
   TEST INFORMATION
   ========================================================= */

function updateTestInfo() {

    const title =
        getElement("testTitle");

    const typeName =
        getElement("testTypeName");

    const questions =
        getElement("totalQuestions");

    const time =
        getElement("testTime");


    if (testType === "daily") {

        if (title)
            title.innerHTML = "🎯 Daily Mock Test";

        if (typeName)
            typeName.innerHTML = "🟢 Daily Mock Test";

        if (questions)
            questions.innerHTML = "15";

        if (time)
            time.innerHTML = "10 Minutes";

    }


    else if (testType === "weekly") {

        if (title)
            title.innerHTML = "🏆 Weekly Exam";

        if (typeName)
            typeName.innerHTML = "🟡 Weekly Exam";

        if (questions)
            questions.innerHTML = "25";

        if (time)
            time.innerHTML = "15 Minutes";

    }


    else {

        if (title)
            title.innerHTML = "👑 Monthly Grand Test";

        if (typeName)
            typeName.innerHTML =
                "🔴 Monthly Grand Test";

        if (questions)
            questions.innerHTML = "100";

        if (time)
            time.innerHTML = "20 Minutes";

    }

}


updateTestInfo();


/* =========================================================
   STUDENT DETAILS
   ========================================================= */

const studentName =
    localStorage.getItem("studentName") || "Student";

const district =
    localStorage.getItem("district") || "-";


/* =========================================================
   LOAD QUESTIONS
   ========================================================= */

async function loadQuestions() {

    try {

        const questionText =
            getElement("questionText");

        if (questionText) {

            questionText.innerHTML =
                "Loading Questions...";

        }


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

            if (questionText) {

                questionText.innerHTML =
                    "❌ No Questions Found";

            }

            return;

        }


        /* -----------------------------------------
           RANDOM QUESTIONS
        ----------------------------------------- */

        testQuestions =
            [...allQuestions]
                .sort(() => Math.random() - 0.5)
                .slice(
                    0,
                    Math.min(
                        totalQuestions,
                        allQuestions.length
                    )
                );


        /* -----------------------------------------
           ANSWER ARRAY
        ----------------------------------------- */

        selectedAnswers =
            new Array(
                testQuestions.length
            ).fill(null);


        currentQuestion = 0;


        /* -----------------------------------------
           SHOW TEST
        ----------------------------------------- */

        showQuestion();

        createPalette();

        updateProgress();

        startTimer();


    }
    catch (error) {

        console.error(
            "Question Loading Error:",
            error
        );


        const questionText =
            getElement("questionText");


        if (questionText) {

            questionText.innerHTML =
                "❌ Failed To Load Questions";

        }

    }

}


/* =========================================================
   SHOW QUESTION
   ========================================================= */

function showQuestion() {

    if (!testQuestions.length)
        return;


    const q =
        testQuestions[currentQuestion];


    /* -----------------------------------------
       QUESTION NUMBER
    ----------------------------------------- */

    const questionCount =
        getElement("questionCount");


    if (questionCount) {

        questionCount.innerHTML =
            `Question ${currentQuestion + 1} / ${testQuestions.length}`;

    }


    /* -----------------------------------------
       QUESTION TEXT
    ----------------------------------------- */

    const questionText =
        getElement("questionText");


    if (questionText) {

        questionText.innerHTML =
            q.question || "Question";

    }


    /* -----------------------------------------
       OPTIONS
    ----------------------------------------- */

    const optionsContainer =
        getElement("optionsContainer");


    if (!optionsContainer)
        return;


    optionsContainer.innerHTML = "";


    const options =
        q.options || [];


    options.forEach((option, index) => {

        const button =
            document.createElement("button");


        button.type = "button";


        button.className =
            "option-btn";


        button.innerHTML =
            option;


        /* Selected */

        if (
            selectedAnswers[currentQuestion]
            === index
        ) {

            button.classList.add(
                "selected"
            );

        }


        /* Click */

        button.addEventListener(
            "click",
            () => {

                selectedAnswers[
                    currentQuestion
                ] = index;


                showQuestion();

                updatePalette();

                updateProgress();

            }
        );


        optionsContainer.appendChild(
            button
        );

    });


    /* -----------------------------------------
       PREVIOUS BUTTON
    ----------------------------------------- */

    const previousBtn =
        getElement("previousBtn");


    if (previousBtn) {

        previousBtn.disabled =
            currentQuestion === 0;

    }


    /* -----------------------------------------
       NEXT BUTTON
    ----------------------------------------- */

    const nextBtn =
        getElement("nextBtn");


    if (nextBtn) {

        if (
            currentQuestion
            === testQuestions.length - 1
        ) {

            nextBtn.innerHTML =
                "Finish →";

        }
        else {

            nextBtn.innerHTML =
                "Next →";

        }

    }

}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

const nextBtn =
    getElement("nextBtn");


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            if (
                currentQuestion
                <
                testQuestions.length - 1
            ) {

                currentQuestion++;

                showQuestion();

                updatePalette();

                updateProgress();

            }
            else {

                confirmSubmit();

            }

        }
    );

}


/* =========================================================
   PREVIOUS BUTTON
   ========================================================= */

const previousBtn =
    getElement("previousBtn");


if (previousBtn) {

    previousBtn.addEventListener(
        "click",
        () => {

            if (currentQuestion > 0) {

                currentQuestion--;

                showQuestion();

                updatePalette();

                updateProgress();

            }

        }
    );

}


/* =========================================================
   QUESTION PALETTE
   ========================================================= */

function createPalette() {

    let palette =
        document.getElementById(
            "questionPalette"
        );


    if (!palette) {

        palette =
            document.createElement("div");

        palette.id =
            "questionPalette";


        palette.className =
            "question-palette";


        const testArea =
            document.querySelector(
                ".test-area"
            );


        const questionCard =
            document.querySelector(
                ".question-card"
            );


        if (testArea && questionCard) {

            testArea.insertBefore(
                palette,
                questionCard
            );

        }

    }


    palette.innerHTML = "";


    testQuestions.forEach(
        (question, index) => {

            const button =
                document.createElement("button");


            button.type = "button";


            button.className =
                "palette-btn";


            button.innerHTML =
                index + 1;


            button.addEventListener(
                "click",
                () => {

                    currentQuestion =
                        index;


                    showQuestion();

                    updatePalette();

                    updateProgress();

                }
            );


            palette.appendChild(
                button
            );

        }
    );


    updatePalette();

}


/* =========================================================
   UPDATE PALETTE
   ========================================================= */

function updatePalette() {

    document
        .querySelectorAll(
            ".palette-btn"
        )
        .forEach(
            (button, index) => {

                button.classList.remove(
                    "active",
                    "answered"
                );


                if (
                    selectedAnswers[index]
                    !== null
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
   PROGRESS BAR
   ========================================================= */

function updateProgress() {

    const progressFill =
        getElement("progressFill");


    if (!progressFill)
        return;


    const total =
        testQuestions.length;


    if (!total)
        return;


    const progress =
        (
            (currentQuestion + 1)
            / total
        ) * 100;


    progressFill.style.width =
        `${progress}%`;

}


/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {

    clearInterval(timer);


    let timeLeft =
        timeLimit;


    updateTimerDisplay(
        timeLeft
    );


    timer =
        setInterval(
            () => {

                timeLeft--;


                updateTimerDisplay(
                    timeLeft
                );


                if (timeLeft <= 0) {

                    clearInterval(
                        timer
                    );


                    if (!testSubmitted) {

                        alert(
                            "⏰ Time Over!\n\nYour test will be submitted automatically."
                        );


                        submitTest(
                            true
                        );

                    }

                }

            },
            1000
        );

}


/* =========================================================
   TIMER DISPLAY
   ========================================================= */

function updateTimerDisplay(
    seconds
) {

    const timerElement =
        getElement("timer");


    if (!timerElement)
        return;


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    timerElement.innerHTML =
        `⏰ ${minutes}:${secs
            .toString()
            .padStart(2, "0")}`;


    /* Warning */

    timerElement.classList.remove(
        "timer-warning",
        "timer-danger"
    );


    if (seconds <= 60) {

        timerElement.classList.add(
            "timer-danger"
        );

    }
    else if (seconds <= 180) {

        timerElement.classList.add(
            "timer-warning"
        );

    }

}


/* =========================================================
   SUBMIT BUTTON
   ========================================================= */

const submitBtn =
    getElement("submitBtn");


if (submitBtn) {

    submitBtn.addEventListener(
        "click",
        () => {

            confirmSubmit();

        }
    );

}


/* =========================================================
   CONFIRM SUBMIT
   ========================================================= */

function confirmSubmit() {

    if (testSubmitted)
        return;


    const unanswered =
        selectedAnswers.filter(
            answer => answer === null
        ).length;


    if (unanswered > 0) {

        const confirmResult =
            confirm(
                `${unanswered} question(s) are unanswered.\n\nDo you want to submit the test?`
            );


        if (!confirmResult)
            return;

    }


    submitTest(false);

}


/* =========================================================
   CALCULATE SCORE
   ========================================================= */

function calculateScore() {

    let score = 0;


    testQuestions.forEach(
        (question, index) => {

            if (
                selectedAnswers[index]
                === question.answer
            ) {

                score++;

            }

        }
    );


    return score;

}


/* =========================================================
   SAVE RESULT
   ========================================================= */

async function submitTest(
    autoSubmit = false
) {

    if (testSubmitted)
        return;


    testSubmitted = true;


    clearInterval(timer);


    const score =
        calculateScore();


    const total =
        testQuestions.length;


    const correct =
        score;


    const wrong =
        selectedAnswers.filter(
            (answer, index) => {

                return (
                    answer !== null
                    &&
                    answer !==
                    testQuestions[index].answer
                );

            }
        ).length;


    const skipped =
        selectedAnswers.filter(
            answer =>
                answer === null
        ).length;


    /* -----------------------------------------
       SAVE RESULT TO FIRESTORE
    ----------------------------------------- */

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

                correct:
                    correct,

                wrong:
                    wrong,

                skipped:
                    skipped,

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


    /* -----------------------------------------
       TEST STREAK
    ----------------------------------------- */

    updateStreak();


    /* -----------------------------------------
       LOCAL STORAGE
    ----------------------------------------- */

    localStorage.setItem(
        "score",
        score
    );


    localStorage.setItem(
        "totalQuestions",
        total
    );


    localStorage.setItem(
        "correct",
        correct
    );


    localStorage.setItem(
        "wrong",
        wrong
    );


    localStorage.setItem(
        "skipped",
        skipped
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
        "autoSubmit",
        autoSubmit
    );


    /* -----------------------------------------
       RESULT PAGE
    ----------------------------------------- */

    window.location.href =
        "result.html";

}


/* =========================================================
   STREAK
   ========================================================= */

function updateStreak() {

    const today =
        new Date()
            .toLocaleDateString();


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
        lastDate !== today
    ) {

        const yesterday =
            new Date();


        yesterday.setDate(
            yesterday.getDate() - 1
        );


        if (
            lastDate ===
            yesterday.toLocaleDateString()
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

}


/* =========================================================
   START
   ========================================================= */

loadQuestions();
