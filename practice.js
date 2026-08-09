// ============================================================
// G THE GENIUS
// PRACTICE TEST JS
// Firebase v10.12.2
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
// GLOBAL VARIABLES
// ============================================================

let currentUser = null;

let allQuestions = [];
let practiceQuestions = [];

let selectedAnswers = [];

let currentIndex = 0;

let timerInterval = null;

let timeLeft = 15 * 60;

let testStarted = false;


// ============================================================
// DOM ELEMENTS
// ============================================================

const selectionArea =
    document.getElementById("selectionArea");

const testArea =
    document.getElementById("testArea");

const loadingBox =
    document.getElementById("loadingBox");

const subjectSelect =
    document.getElementById("subjectSelect");

const topicSelect =
    document.getElementById("topicSelect");

const questionCount =
    document.getElementById("questionCount");

const startPracticeBtn =
    document.getElementById("startPracticeBtn");

const selectionMessage =
    document.getElementById("selectionMessage");

const currentQuestionNumber =
    document.getElementById(
        "currentQuestionNumber"
    );

const totalQuestionNumber =
    document.getElementById(
        "totalQuestionNumber"
    );

const timerElement =
    document.getElementById("timer");

const progressFill =
    document.getElementById("progressFill");

const questionNumber =
    document.getElementById("questionNumber");

const questionTopic =
    document.getElementById("questionTopic");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById(
        "optionsContainer"
    );

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const submitBtn =
    document.getElementById("submitBtn");

const questionPalette =
    document.getElementById(
        "questionPalette"
    );

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// AUTH CHECK
// ============================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        alert(
            "Please login to use Practice Test."
        );

        window.location.href =
            "login.html";

        return;

    }

    currentUser = user;

    console.log(
        "Practice User:",
        user.uid
    );

    await loadAllQuestions();

});


// ============================================================
// LOAD ALL QUESTIONS
// ============================================================

async function loadAllQuestions() {

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

        snapshot.forEach((questionDoc) => {

            const data =
                questionDoc.data();

            allQuestions.push({

                id:
                    questionDoc.id,

                question:
                    data.question || "",

                options:
                    Array.isArray(data.options)
                        ? data.options
                        : [],

                answer:
                    Number(
                        data.answer ?? 0
                    ),

                subject:
                    data.subject || "",

                topic:
                    data.topic || "",

                explanation:
                    data.explanation || ""

            });

        });


        console.log(
            "Questions Loaded:",
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
            "Question loading error:",
            error
        );

        selectionMessage.textContent =
            "❌ Failed to load questions.";

    }

    finally {

        loadingBox.style.display = "none";

    }

}


// ============================================================
// SUBJECT CHANGE
// ============================================================

subjectSelect.addEventListener(
    "change",
    () => {

        const subject =
            subjectSelect.value.trim();

        topicSelect.innerHTML = `
            <option value="">
                Select Topic
            </option>
        `;


        if (!subject) return;


        const topics = new Set();


        allQuestions.forEach((q) => {

            if (
                normalize(q.subject) ===
                normalize(subject)
            ) {

                if (q.topic) {

                    topics.add(
                        q.topic.trim()
                    );

                }

            }

        });


        const sortedTopics =
            [...topics].sort();


        if (
            sortedTopics.length > 0
        ) {

            const allOption =
                document.createElement(
                    "option"
                );

            allOption.value = "All";

            allOption.textContent =
                "All Topics";

            topicSelect.appendChild(
                allOption
            );


            sortedTopics.forEach(
                (topic) => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        topic;

                    option.textContent =
                        topic;

                    topicSelect.appendChild(
                        option
                    );

                }
            );

        }

    }
);


// ============================================================
// START PRACTICE
// ============================================================

startPracticeBtn.addEventListener(
    "click",
    startPractice
);


async function startPractice() {

    const subject =
        subjectSelect.value.trim();

    const topic =
        topicSelect.value.trim();

    const count =
        Number(
            questionCount.value
        );


    if (!subject) {

        selectionMessage.textContent =
            "⚠️ Please select a subject.";

        return;

    }


    if (!topic) {

        selectionMessage.textContent =
            "⚠️ Please select a topic.";

        return;

    }


    let filteredQuestions =
        allQuestions.filter((q) => {

            return (
                normalize(q.subject) ===
                normalize(subject)
            );

        });


    if (
        topic !== "All"
    ) {

        filteredQuestions =
            filteredQuestions.filter(
                (q) => {

                    return (
                        normalize(q.topic) ===
                        normalize(topic)
                    );

                }
            );

    }


    if (
        filteredQuestions.length === 0
    ) {

        selectionMessage.textContent =
            "❌ இந்த Subject / Topic-ல் questions இல்லை.";

        return;

    }


    // Shuffle

    filteredQuestions =
        shuffleArray(
            filteredQuestions
        );


    // Number of questions

    practiceQuestions =
        filteredQuestions.slice(
            0,
            Math.min(
                count,
                filteredQuestions.length
            )
        );


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


    selectionArea.style.display =
        "none";

    testArea.style.display =
        "block";


    totalQuestionNumber.textContent =
        practiceQuestions.length;


    createPalette();

    displayQuestion();

    startTimer();

}


// ============================================================
// TIME LIMIT
// ============================================================

function getTimeLimit(count) {

    if (count <= 10) {

        return 5 * 60;

    }

    if (count <= 25) {

        return 10 * 60;

    }

    return 20 * 60;

}


// ============================================================
// DISPLAY QUESTION
// ============================================================

function displayQuestion() {

    if (
        !practiceQuestions.length
    ) return;


    const q =
        practiceQuestions[
            currentIndex
        ];


    currentQuestionNumber.textContent =
        currentIndex + 1;


    questionNumber.textContent =
        `Question ${currentIndex + 1}`;


    questionTopic.textContent =
        q.topic || "General";


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

        submitBtn.style.display =
            "block";

    }

    else {

        nextBtn.style.display =
            "block";

        submitBtn.style.display =
            "block";

    }


    updatePalette();

}


// ============================================================
// SELECT ANSWER
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

        submitPractice(
            false
        );

    }
);


function submitPractice(
    autoSubmit
) {

    if (
        !practiceQuestions.length
    ) return;


    if (!autoSubmit) {

        const answered =
            selectedAnswers.filter(
                (answer) =>
                    answer !== null
            ).length;


        const skipped =
            practiceQuestions.length -
            answered;


        const confirmed =
            confirm(
                `Test complete?\n\n` +
                `Answered: ${answered}\n` +
                `Skipped: ${skipped}`
            );


        if (!confirmed) return;

    }


    stopTimer();


    calculateResult();

}


// ============================================================
// CALCULATE RESULT
// ============================================================

function calculateResult() {

    let correct = 0;
    let wrong = 0;
    let skipped = 0;


    practiceQuestions.forEach(
        (q, index) => {

            const userAnswer =
                selectedAnswers[index];


            if (
                userAnswer === null ||
                userAnswer === undefined
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


    const score =
        correct;


    const resultData = {

        testType:
            "practice",

        subject:
            subjectSelect.value,

        topic:
            topicSelect.value,

        score:
            score,

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
                            "",

                        topic:
                            q.topic ||
                            ""

                    };

                }
            ),

        createdAt:
            new Date().toISOString()

    };


    // Save locally for result page

    localStorage.setItem(
        "practiceResult",
        JSON.stringify(
            resultData
        )
    );


    // Also save selected answers separately

    localStorage.setItem(
        "practiceSelectedAnswers",
        JSON.stringify(
            selectedAnswers
        )
    );


    localStorage.setItem(
        "practiceQuestions",
        JSON.stringify(
            practiceQuestions
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
                        "⏰ Time's up!\nYour test will be submitted automatically."
                    );

                    submitPractice(
                        true
                    );

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

        timerInterval =
            null;

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
        `⏰ ${
            String(minutes)
                .padStart(2, "0")
        }:${
            String(seconds)
                .padStart(2, "0")
        }`;


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
        (_, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                index + 1;


            button.type =
                "button";


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
// BACK BUTTON
// ============================================================

backBtn.addEventListener(
    "click",
    () => {

        if (testStarted) {

            const leave =
                confirm(
                    "Test is in progress. Are you sure you want to leave?"
                );

            if (!leave) return;

            stopTimer();

        }


        window.location.href =
            "dashboard.html";

    }
);
// ============================================================
// PREVENT ACCIDENTAL REFRESH
// ============================================================

window.addEventListener(
    "beforeunload",
    (event) => {

        if (!testStarted) return;


        event.preventDefault();

        event.returnValue = "";

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
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(value || "")
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

