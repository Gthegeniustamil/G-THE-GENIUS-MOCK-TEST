// ============================================================
// G THE GENIUS - PRACTICE TEST
// SUBJECT ONLY VERSION
// ============================================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// VARIABLES
// ============================================================

let allQuestions = [];
let practiceQuestions = [];
let selectedAnswers = [];
let currentIndex = 0;

let timerInterval = null;
let timeLeft = 300;


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

const startBtn =
    document.getElementById("startPracticeBtn");

const message =
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
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Practice JS loaded successfully"
        );

    }
);



// ============================================================
// 🚀 INSTANT PRACTICE PAGE
// ============================================================

console.log(
    "⚡ Practice UI Ready Instantly"
);

// Firebase background loading
loadQuestions()
    .then(() => {

        console.log(
            "✅ Practice Questions Ready"
        );

    })
    .catch(error => {

        console.error(
            "❌ Background Question Load Error:",
            error
        );

    });



async function loadQuestions() {

    // ======================================
    // 🔥 FIREBASE BACKGROUND LOAD
    // ======================================

    if (startBtn) {

        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";

    }

    if (loadingBox) {

    loadingBox.style.display = "block";

    loadingBox.textContent =
        "⏳ Questions Loading...";

    }

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "questions"
                )
            );


        allQuestions = [];


        snapshot.forEach(
            doc => {

                const data =
                    doc.data();


                const options =
                    Array.isArray(
                        data.options
                    )
                        ? data.options
                        : [
                            data.optionA || "",
                            data.optionB || "",
                            data.optionC || "",
                            data.optionD || ""
                        ];


                const subject =
                    data.subject ||
                    data.Subject ||
                    data.category ||
                    data.Category ||
                    "";


                const answer =
                    data.correctAnswer !== undefined
                        ? data.correctAnswer
                        : data.answer !== undefined
                            ? data.answer
                            : data.correct !== undefined
                                ? data.correct
                                : 0;


                allQuestions.push({

                    id:
                        doc.id,

                    question:
                        data.question ||
                        data.questionText ||
                        data.text ||
                        "",

                    options:
                        options,

                    answer:
                        convertAnswer(
                            answer
                        ),

                    subject:
                        String(
                            subject
                        ).trim(),

                    explanation:
                        data.explanation ||
                        data.Explanation ||
                        ""

                });

            }
        );


        console.log(
            "Firestore Questions:",
            allQuestions.length
        );


        if (
            allQuestions.length === 0
        ) {

            showMessage(
                "❌ Firestore-ல் questions இல்லை."
            );

            return;

        }


        if (startBtn) {

            startBtn.disabled =
                false;

            startBtn.style.opacity =
                "1";

        }


        showMessage(
            `✅ ${allQuestions.length} questions ready`
        );


    }

    catch (error) {

        console.error(
            "QUESTION LOAD ERROR:",
            error
        );


        showMessage(
            "❌ Questions load ஆகவில்லை. Console error check செய்யுங்கள்."
        );

    }

    finally {

    if (loadingBox) {

        loadingBox.style.display = "none";

        loadingBox.textContent = "";

    }

    }

}


// ============================================================
// START BUTTON
// ============================================================

if (startBtn) {

    startBtn.addEventListener(
        "click",
        startPractice
    );

}


function startPractice() {

    console.log(
        "START BUTTON CLICKED"
    );


    const subject =
        String(
            subjectSelect.value
        ).trim();


    const count =
        Number(
            questionCount.value
        );


    if (!subject) {

        showMessage(
            "⚠️ முதலில் Subject select செய்யுங்கள்."
        );

        return;

    }


    if (
        allQuestions.length === 0
    ) {

        showMessage(
            "⏳ Questions இன்னும் load ஆகவில்லை."
        );

        return;

    }


    // ========================================================
    // SUBJECT MATCH
    // ========================================================

    let filtered =
        allQuestions.filter(
            q => {

                return subjectsMatch(
                    q.subject,
                    subject
                );

            }
        );


    console.log(
        "Selected:",
        subject
    );

    console.log(
        "Matching:",
        filtered.length
    );


    // ========================================================
    // NO MATCH
    // ========================================================

    if (
        filtered.length === 0
    ) {

        showMessage(
            `❌ "${subject}" Subject-ல் questions இல்லை.`
        );

        return;

    }


    // ========================================================
    // SHUFFLE
    // ========================================================

    filtered =
        shuffle(
            filtered
        );


    // ========================================================
    // SELECT QUESTIONS
    // ========================================================

    practiceQuestions =
        filtered.slice(
            0,
            Math.min(
                count,
                filtered.length
            )
        );


    selectedAnswers =
        new Array(
            practiceQuestions.length
        ).fill(null);


    currentIndex = 0;


    // ========================================================
    // TIMER
    // ========================================================

    timeLeft =
        getTimeLimit(
            practiceQuestions.length
        );


    // ========================================================
    // SHOW TEST
    // ========================================================

    selectionArea.style.display =
        "none";

    testArea.style.display =
        "block";


    totalQuestionNumber.textContent =
        practiceQuestions.length;


    createPalette();

    displayQuestion();

    startTimer();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================================
// SUBJECT MATCH
// ============================================================

function subjectsMatch(
    firestoreSubject,
    selectedSubject
) {

    const a =
        normalize(
            firestoreSubject
        );

    const b =
        normalize(
            selectedSubject
        );


    if (a === b) {
        return true;
    }


    // GK variations

    if (
        (
            a === "gk" ||
            a === "general knowledge"
        ) &&
        (
            b === "gk" ||
            b === "general knowledge"
        )
    ) {

        return true;

    }


    return false;

}


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
            (
                currentIndex + 1
            ) /
            practiceQuestions.length
        ) *
        100 +
        "%";


    optionsContainer.innerHTML =
        "";


    const letters = [
        "A",
        "B",
        "C",
        "D"
    ];


    q.options.forEach(
        (
            option,
            index
        ) => {

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
                    ${escapeHTML(option)}
                </span>

            `;


            button.onclick =
                () => {

                    selectedAnswers[
                        currentIndex
                    ] = index;

                    displayQuestion();

                };


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
// NEXT
// ============================================================

nextBtn.onclick =
    () => {

        if (
            currentIndex <
            practiceQuestions.length - 1
        ) {

            currentIndex++;

            displayQuestion();

        }

    };


// ============================================================
// PREVIOUS
// ============================================================

previousBtn.onclick =
    () => {

        if (
            currentIndex > 0
        ) {

            currentIndex--;

            displayQuestion();

        }

    };


// ============================================================
// SUBMIT
// ============================================================

submitBtn.onclick =
    () => {

        const answered =
            selectedAnswers.filter(
                answer =>
                    answer !== null
            ).length;


        const skipped =
            practiceQuestions.length -
            answered;


        const ok =
            confirm(
                `Test Submit செய்யவா?\n\n` +
                `Answered : ${answered}\n` +
                `Skipped : ${skipped}`
            );


        if (!ok) {
            return;
        }


        submitTest();

    };


// ============================================================
// SUBMIT TEST
// ============================================================

function submitTest() {

    stopTimer();


    let correct = 0;
    let wrong = 0;
    let skipped = 0;


    const resultQuestions =
        practiceQuestions.map(
            (
                q,
                index
            ) => {

                const userAnswer =
                    selectedAnswers[
                        index
                    ];


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
                        userAnswer,

                    explanation:
                        q.explanation,

                    subject:
                        q.subject

                };

            }
        );


    const resultData = {

        testType:
            "practice",

        type:
            "practice",

        subject:
            subjectSelect.value,

        score:
            correct,

        marks:
            correct,

        total:
            practiceQuestions.length,

        totalQuestions:
            practiceQuestions.length,

        correct:
            correct,

        wrong:
            wrong,

        skipped:
            skipped,

        questions:
            resultQuestions,

        createdAt:
            new Date().toISOString()

    };


    // ========================================================
    // SAVE RESULT
    // ========================================================

    localStorage.setItem(
        "practiceResult",
        JSON.stringify(
            resultData
        )
    );


    localStorage.setItem(
        "lastResult",
        JSON.stringify(
            resultData
        )
    );


    console.log(
        "RESULT SAVED:",
        resultData
    );


    // ========================================================
    // OPEN RESULT
    // ========================================================

    window.location.href =
        "result.html?type=practice";

}


// ============================================================
// TIMER
// ============================================================

function getTimeLimit(count) {

    if (
        count <= 10
    ) {

        return 5 * 60;

    }


    if (
        count <= 25
    ) {

        return 10 * 60;

    }


    if (
        count <= 50
    ) {

        return 20 * 60;

    }


    return 30 * 60;

}


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

                    submitTest();

                }

            },
            1000
        );

}


function stopTimer() {

    if (
        timerInterval
    ) {

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
// QUESTION PALETTE
// ============================================================

function createPalette() {

    questionPalette.innerHTML =
        "";


    practiceQuestions.forEach(
        (
            _,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                index + 1;


            button.onclick =
                () => {

                    currentIndex =
                        index;

                    displayQuestion();

                };


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
        (
            button,
            index
        ) => {

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

if (backBtn) {

    backBtn.onclick =
        () => {

            stopTimer();

            window.location.href =
                "dashboard.html";

        };

}


// ============================================================
// HELPERS
// ============================================================

function normalize(value) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


function convertAnswer(answer) {

    if (
        typeof answer === "number"
    ) {

        return answer;

    }


    const text =
        String(
            answer || ""
        )
        .trim()
        .toUpperCase();


    const letters = {
        A: 0,
        B: 1,
        C: 2,
        D: 3
    };


    if (
        letters[text] !== undefined
    ) {

        return letters[text];

    }


    if (
        !isNaN(
         Number(text)
        )
    ) {

        return Number(text);

    }


    return 0;

}


function shuffle(array) {

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
        ] =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}


function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function showMessage(text) {

    if (message) {

        message.textContent =
            text;

    }

}
