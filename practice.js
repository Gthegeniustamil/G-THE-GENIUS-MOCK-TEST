// ============================================================
// G THE GENIUS - SUBJECT ONLY PRACTICE TEST
// ============================================================

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// VARIABLES
// ============================================================

let currentUser = null;

let allQuestions = [];

let practiceQuestions = [];

let selectedAnswers = [];

let currentIndex = 0;

let timerInterval = null;

let timeLeft = 300;

let testStarted = false;


// ============================================================
// DOM
// ============================================================

const selectionArea =
    document.getElementById("selectionArea");

const testArea =
    document.getElementById("testArea");

const loadingBox =
    document.getElementById("loadingBox");

const subjectSelect =
    document.getElementById("subjectSelect");

const questionCount =
    document.getElementById("questionCount");

const startPracticeBtn =
    document.getElementById("startPracticeBtn");

const selectionMessage =
    document.getElementById("selectionMessage");

const currentQuestionNumber =
    document.getElementById("currentQuestionNumber");

const totalQuestionNumber =
    document.getElementById("totalQuestionNumber");

const timerElement =
    document.getElementById("timer");

const progressFill =
    document.getElementById("progressFill");

const questionNumber =
    document.getElementById("questionNumber");

const questionSubject =
    document.getElementById("questionSubject");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const submitBtn =
    document.getElementById("submitBtn");

const questionPalette =
    document.getElementById("questionPalette");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// AUTH
// ============================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        alert("Please login to use Practice Test.");

        window.location.href =
            "login.html";

        return;
    }

    currentUser = user;

    await loadQuestions();

});


// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {

    loadingBox.style.display = "block";

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "questions"
                )
            );

        allQuestions = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            allQuestions.push({

                id: doc.id,

                question:
                    data.question || "",

                options:
                    Array.isArray(data.options)
                        ? data.options
                        : [],

                answer:
                    Number(data.answer ?? 0),

                subject:
                    data.subject ||
                    data.Subject ||
                    "",

                explanation:
                    data.explanation ||
                    ""

            });

        });


        console.log(
            "Questions loaded:",
            allQuestions.length
        );


        if (
            allQuestions.length === 0
        ) {

            selectionMessage.textContent =
                "❌ Questions not found.";

        }

    }

    catch (error) {

        console.error(
            "Firestore error:",
            error
        );

        selectionMessage.textContent =
            "❌ Questions load ஆகவில்லை.";

    }

    finally {

        loadingBox.style.display = "none";

    }

}

// ============================================================
// START PRACTICE - FIXED VERSION
// ============================================================

function startPractice() {

    const subject =
        subjectSelect.value.trim();

    const count =
        Number(questionCount.value);


    console.log("Selected Subject:", subject);
    console.log("Total Questions:", allQuestions.length);


    // Subject check

    if (!subject) {

        selectionMessage.textContent =
            "⚠️ முதலில் Subject select செய்யுங்கள்.";

        return;
    }


    // Filter questions

    let filteredQuestions =
        allQuestions.filter((q) => {

            const firestoreSubject =
                String(
                    q.subject || ""
                ).trim();

            console.log(
                "Firestore Subject:",
                firestoreSubject
            );

            return (
                firestoreSubject.toLowerCase() ===
                subject.toLowerCase()
            );

        });


    console.log(
        "Filtered Questions:",
        filteredQuestions.length
    );


    // No questions

    if (
        filteredQuestions.length === 0
    ) {

        selectionMessage.textContent =
            `❌ "${subject}" Subject-ல் questions கிடைக்கவில்லை.`;

        return;
    }


    // Shuffle

    filteredQuestions =
        shuffleArray(
            filteredQuestions
        );


    // Select questions

    practiceQuestions =
        filteredQuestions.slice(
            0,
            Math.min(
                count,
                filteredQuestions.length
            )
        );


    // Answers reset

    selectedAnswers =
        new Array(
            practiceQuestions.length
        ).fill(null);


    currentIndex = 0;


    // Timer

    timeLeft =
        getTimeLimit(
            practiceQuestions.length
        );


    testStarted = true;


    // Hide selection

    selectionArea.style.display =
        "none";


    // Show test

    testArea.style.display =
        "block";


    // Total questions

    totalQuestionNumber.textContent =
        practiceQuestions.length;


    // Create palette

    createPalette();


    // Display first question

    displayQuestion();


    // Start timer

    startTimer();


    // Scroll top

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}




// ============================================================
// TIME
// ============================================================

function getTimeLimit(count) {

    if (count <= 10) {



// ============================================================
// DISPLAY QUESTION
// ============================================================

function displayQuestion() {

    const q =
        practiceQuestions[
            currentIndex
        ];


    if (!q) return;


    currentQuestionNumber.textContent =
        currentIndex + 1;


    questionNumber.textContent =
        `Question ${currentIndex + 1}`;


    questionSubject.textContent =
        q.subject || "General";


    questionText.textContent =
        q.question;


    progressFill.style.width =
        (
            (currentIndex + 1) /
            practiceQuestions.length
        ) * 100 + "%";


    optionsContainer.innerHTML =
        "";


    const letters = [
        "A",
        "B",
        "C",
        "D"
    ];


    q.options.forEach(
        (optionText, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "option";


            if (
                selectedAnswers[
                    currentIndex
                ] === index
            ) {

                button.classList.add(
                    "selected"
                );

            }


            button.innerHTML = `

                <span class="option-letter">
                    ${letters[index] || index + 1}
                </span>

                <span>
                    ${escapeHTML(optionText)}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(index);

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    previousBtn.disabled =
        currentIndex === 0;

    previousBtn.style.opacity =
        currentIndex === 0
            ? "0.45"
            : "1";


    if (
        currentIndex ===
        practiceQuestions.length - 1
    ) {

        nextBtn.style.display =
            "none";

    }

    else {

        nextBtn.style.display =
            "block";

    }


    updatePalette();

}


// ============================================================
// ANSWER
// ============================================================

function selectAnswer(index) {

    selectedAnswers[
        currentIndex
    ] = index;

    displayQuestion();

}


// ============================================================
// NEXT
// ============================================================

nextBtn.addEventListener(
    "click",
    () => {

        if (
            currentIndex <
            practiceQuestions.length - 1
        ) {

            currentIndex++;

            displayQuestion();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


// ============================================================
// PREVIOUS
// ============================================================

previousBtn.addEventListener(
    "click",
    () => {

        if (
            currentIndex > 0
        ) {

            currentIndex--;

            displayQuestion();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


// ============================================================
// SUBMIT
// ============================================================

submitBtn.addEventListener(
    "click",
    () => {

        const answered =
            selectedAnswers.filter(
                (x) => x !== null
            ).length;

        const skipped =
            practiceQuestions.length -
            answered;


        const confirmSubmit =
            confirm(
                `Test submit செய்யவா?\n\n` +
                `Answered: ${answered}\n` +
                `Skipped: ${skipped}`
            );


        if (!confirmSubmit) return;


        submitPractice();

    }
);


function submitPractice() {

    stopTimer();


    let correct = 0;

    let wrong = 0;

    let skipped = 0;


    practiceQuestions.forEach(
        (q, index) => {

            const userAnswer =
                selectedAnswers[index];


            if (
                userAnswer === null
            ) {

                skipped++;

            }

            else if (
                Number(userAnswer) ===
                Number(q.answer)
            ) {

                correct++;

            }

            else {

                wrong++;

            }

        }
    );


    const resultData = {

        testType:
            "practice",

        subject:
            subjectSelect.value,

        score:
            correct,

        correct:
            correct,

        wrong:
            wrong,

        skipped:
            skipped,

        total:
            practiceQuestions.length,

        questions:
            practiceQuestions.map(
                (q, index) => {

                    return {

                        id:
                            q.id,

                        question:
                            q.question,

                        options:
                            q.options,

                        correctAnswer:
                            Number(
                                q.answer
                            ),

                        userAnswer:
                            selectedAnswers[
                                index
                            ],

                        explanation:
                            q.explanation ||
                            "",

                        subject:
                            q.subject ||
                            ""

                    };

                }
            ),

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "practiceResult",
        JSON.stringify(
            resultData
        )
    );


    window.location.href =
        "result.html?type=practice";

}


// ============================================================
// TIMER
// ============================================================

function startTimer() {

    stopTimer();

    updateTimer();


    timerInterval =
        setInterval(
            () => {

                timeLeft--;

                updateTimer();


                if (
                    timeLeft <= 0
                ) {

                    stopTimer();

                    alert(
                        "⏰ Time's up! Test automatically submitted."
                    );

                    submitPractice();

                }

            },
            1000
        );

}


function stopTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


function updateTimer() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );

    const seconds =
        timeLeft % 60;


    timerElement.textContent =
        `⏰ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    if (
        timeLeft <= 60
    ) {

        timerElement.classList.add(
            "warning"
        );

    }

    else {

        timerElement.classList.remove(
            "warning"
        );

    }

}


// ============================================================
// PALETTE
// ============================================================

function createPalette() {

    questionPalette.innerHTML =
        "";


    practiceQuestions.forEach(
        (_, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.textContent =
                index + 1;


            button.addEventListener(
                "click",
                () => {

                    currentIndex =
                        index;

                    displayQuestion();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );


            questionPalette.appendChild(
                button
            );

        }
    );


    updatePalette();

}


function updatePalette() {

    const buttons =
        questionPalette.querySelectorAll(
            "button"
        );


    buttons.forEach(
        (button, index) => {

            button.classList.remove(
                "current"
            );

            button.classList.remove(
                "answered"
            );


            if (
                index === currentIndex
            ) {

                button.classList.add(
                    "current"
                );

            }


            if (
                selectedAnswers[index] !==
                null
            ) {

                button.classList.add(
                    "answered"
                );

            }

        }
    );

}


// ============================================================
// BACK
// ============================================================

backBtn.addEventListener(
    "click",
    () => {

        if (testStarted) {

            const leave =
                confirm(
                    "Test இன்னும் நடக்கிறது. வெளியேறவா?"
                );

            if (!leave) return;

            stopTimer();

        }


        window.location.href =
            "dashboard.html";

    }
);


// ============================================================
// NORMALIZE
// ============================================================

function normalize(text) {

    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


// ============================================================
// SHUFFLE
// ============================================================

function shuffleArray(array) {

    const copy =
        [...array];


    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

        }
