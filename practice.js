// ============================================================
// G THE GENIUS
// PRACTICE TEST
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
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let allQuestions = [];

let practiceQuestions = [];

let selectedAnswers = [];

let currentQuestion = 0;

let timerInterval = null;

let timeLeft = 600;

let currentUser = null;


// ============================================================
// ELEMENTS
// ============================================================

const setupArea =
    document.getElementById("setupArea");

const testArea =
    document.getElementById("testArea");

const resultArea =
    document.getElementById("resultArea");

const subjectSelect =
    document.getElementById("subjectSelect");

const topicSelect =
    document.getElementById("topicSelect");

const questionCount =
    document.getElementById("questionCount");

const setupMessage =
    document.getElementById("setupMessage");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const questionNumber =
    document.getElementById("questionNumber");

const questionCounter =
    document.getElementById("questionCounter");

const palette =
    document.getElementById("palette");

const progressBar =
    document.getElementById("progressBar");

const timer =
    document.getElementById("timer");


// ============================================================
// AUTH
// ============================================================

onAuthStateChanged(
    auth,
    (user) => {

        currentUser = user || null;

        console.log(
            "Practice User:",
            currentUser
                ? currentUser.email
                : "Guest"
        );

    }
);


// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {

    setupMessage.textContent =
        "Loading questions...";

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
            (questionDoc) => {

                const data =
                    questionDoc.data();


                if (
                    data.question &&
                    Array.isArray(
                        data.options
                    ) &&
                    data.options.length >= 4
                ) {

                    allQuestions.push({

                        id:
                            questionDoc.id,

                        question:
                            data.question,

                        options:
                            data.options,

                        answer:
                            Number(
                                data.answer
                            ),

                        subject:
                            data.subject ||
                            "General",

                        topic:
                            data.topic ||
                            "General",

                        explanation:
                            data.explanation ||
                            ""

                    });

                }

            }
        );


        populateSubjects();


        setupMessage.textContent =
            `${allQuestions.length} questions ready ✅`;

    }

    catch (error) {

        console.error(
            "Question loading error:",
            error
        );

        setupMessage.textContent =
            "❌ Questions load ஆகவில்லை.";

    }

}


// ============================================================
// POPULATE SUBJECTS
// ============================================================

function populateSubjects() {

    subjectSelect.innerHTML =
        `<option value="">
            Select Subject
        </option>`;


    const subjects =
        [
            ...new Set(
                allQuestions
                    .map(
                        q => q.subject
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    subjects.forEach(
        (subject) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject;

            option.textContent =
                subject;


            subjectSelect.appendChild(
                option
            );

        }
    );

}


// ============================================================
// SUBJECT CHANGE
// ============================================================

subjectSelect.addEventListener(
    "change",
    () => {

        const subject =
            subjectSelect.value;


        topicSelect.innerHTML =
            `<option value="">
                Select Topic
            </option>`;


        if (!subject) return;


        const topics =
            [
                ...new Set(
                    allQuestions
                        .filter(
                            q =>
                                q.subject ===
                                subject
                        )
                        .map(
                            q =>
                                q.topic
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        topics.forEach(
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
);


// ============================================================
// START PRACTICE
// ============================================================

document
    .getElementById(
        "startPracticeBtn"
    )
    .addEventListener(
        "click",
        startPractice
    );


function startPractice() {

    const subject =
        subjectSelect.value;


    const topic =
        topicSelect.value;


    const count =
        Number(
            questionCount.value
        );


    if (!subject) {

        setupMessage.textContent =
            "⚠️ முதலில் Subject தேர்வு செய்யுங்கள்.";

        return;

    }


    if (!topic) {

        setupMessage.textContent =
            "⚠️ Topic தேர்வு செய்யுங்கள்.";

        return;

    }


    const filtered =
        allQuestions.filter(
            q =>
                q.subject === subject &&
                q.topic === topic
        );


    if (filtered.length === 0) {

        setupMessage.textContent =
            "❌ இந்த Topic-ல் questions இல்லை.";

        return;

    }


    practiceQuestions =
        shuffle(
            filtered
        ).slice(
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


    currentQuestion = 0;


    timeLeft =
        practiceQuestions.length <= 10
            ? 600
            : practiceQuestions.length <= 20
                ? 900
                : 1800;


    setupArea.style.display =
        "none";

    resultArea.style.display =
        "none";

    testArea.style.display =
        "block";


    document.getElementById(
        "testTitle"
    ).textContent =
        `${subject} • ${topic}`;


    renderPalette();

    showQuestion();

    startTimer();

}


// ============================================================
// SHUFFLE
// ============================================================

function shuffle(array) {

    const result =
        [...array];


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }


    return result;

}


// ============================================================
// SHOW QUESTION
// ============================================================

function showQuestion() {

    const q =
        practiceQuestions[
            currentQuestion
        ];


    if (!q) return;


    const total =
        practiceQuestions.length;


    questionNumber.textContent =
        `Question ${currentQuestion + 1}`;


    questionCounter.textContent =
        `Question ${
            currentQuestion + 1
        } / ${total}`;


    questionText.textContent =
        q.question;


    optionsContainer.innerHTML =
        "";


    q.options
        .slice(0,4)
        .forEach(
            (optionText,index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "option";


                if (
                    selectedAnswers[
                        currentQuestion
                    ] === index
                ) {

                    button.classList.add(
                        "selected"
                    );

                }


                button.innerHTML =
                    `
                    <span class="option-letter">
                        ${String.fromCharCode(
                            65 + index
                        )}
                    </span>
                    ${escapeHTML(
                        optionText
                    )}
                    `;


                button.addEventListener(
                    "click",
                    () => {

                        selectAnswer(
                            index
                        );

                    }
                );


                optionsContainer.appendChild(
                    button
                );

            }
        );


    const progress =
        (
            (currentQuestion + 1) /
            total
        ) * 100;


    progressBar.style.width =
        `${progress}%`;


    document.getElementById(
        "previousBtn"
    ).disabled =
        currentQuestion === 0;


    document.getElementById(
        "nextBtn"
    ).style.display =
        currentQuestion === total - 1
            ? "none"
            : "block";


    renderPalette();

}


// ============================================================
// SELECT ANSWER
// ============================================================

function selectAnswer(index) {

    selectedAnswers[
        currentQuestion
    ] = index;


    showQuestion();

}


// ============================================================
// PALETTE
// ============================================================

function renderPalette() {

    palette.innerHTML =
        "";


    practiceQuestions.forEach(
        (_, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                index + 1;


            if (
                index ===
                currentQuestion
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

}


// ============================================================
// PREVIOUS
// ============================================================

document
    .getElementById(
        "previousBtn"
    )
    .addEventListener(
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


// ============================================================
// NEXT
// ============================================================

document
    .getElementById(
        "nextBtn"
    )
    .addEventListener(
        "click",
        () => {

            if (
                currentQuestion <
                practiceQuestions.length - 1
            ) {

                currentQuestion++;

                showQuestion();

            }

        }
    );


// ============================================================
// TIMER
// ============================================================

function startTimer() {

    clearInterval(
        timerInterval
    );


    updateTimer();


    timerInterval =
        setInterval(
            () => {

                timeLeft--;


                updateTimer();


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    alert(
                        "⏰ Time Over!"
                    );


                    submitPractice();

                }

            },
            1000
        );

}


// ============================================================
// UPDATE TIMER
// ============================================================

function updateTimer() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        timeLeft % 60;


    timer.textContent =
        `⏰ ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;


    if (
        timeLeft <= 60
    ) {

        timer.classList.add(
            "danger"
        );

    }

    else {

        timer.classList.remove(
            "danger"
        );

    }

}


// ============================================================
// SUBMIT
// ============================================================

document
    .getElementById(
        "submitBtn"
    )
    .addEventListener(
        "click",
        () => {

            const unanswered =
                selectedAnswers.filter(
                    answer =>
                        answer === null
                ).length;


            let message =
                "Are you sure you want to submit?";


            if (
                unanswered > 0
            ) {

                message +=
                    `\n\n${unanswered} question(s) unanswered.`;

            }


            if (
                confirm(message)
            ) {

                submitPractice();

            }

        }
    );


// ============================================================
// SUBMIT PRACTICE
// ============================================================

async function submitPractice() {

    clearInterval(
        timerInterval
    );


    let correct = 0;

    let wrong = 0;

    let skipped = 0;


    practiceQuestions.forEach(
        (q,index) => {

            const selected =
                selectedAnswers[index];


            if (
                selected === null
            ) {

                skipped++;

            }

            else if (
                selected ===
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


    const total =
        practiceQuestions.length;


    await savePracticeResult(
        score,
        total,
        correct,
        wrong,
        skipped
    );


    showResult(
        score,
        total,
        correct,
        wrong,
        skipped
    );

}


// ============================================================
// SAVE RESULT
// ============================================================

async function savePracticeResult(
    score,
    total,
    correct,
    wrong,
    skipped
) {

    try {

        await addDoc(
            collection(
                db,
                "results"
            ),
            {

                userId:
                    currentUser
                        ? currentUser.uid
                        : null,

                userEmail:
                    currentUser
                        ? currentUser.email
                        : null,

                name:
                    currentUser
                        ? (
                            currentUser.displayName ||
                            currentUser.email
                        )
                        : "Guest",

                testType:
                    "practice",

                subject:
                    subjectSelect.value,

                topic:
                    topicSelect.value,

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
            "Practice result saved ✅"
        );

    }

    catch (error) {

        console.error(
            "Result save error:",
            error
        );

    }

}


// ============================================================
// SHOW RESULT
// ============================================================

function showResult(
    score,
    total,
    correct,
    wrong,
    skipped
) {

    testArea.style.display =
        "none";


    resultArea.style.display =
        "block";


    document.getElementById(
        "finalScore"
    ).textContent =
        `${score} / ${total}`;


    document.getElementById(
        "correctCount"
    ).textContent =
        correct;


    document.getElementById(
        "wrongCount"
    ).textContent =
        wrong;


    document.getElementById(
        "skippedCount"
    ).textContent =
        skipped;


    renderReview();


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


// ============================================================
// REVIEW
// ============================================================

function renderReview() {

    const container =
        document.getElementById(
            "reviewContainer"
        );


    container.innerHTML =
        "";


    practiceQuestions.forEach(
        (q,index) => {

            const selected =
                selectedAnswers[index];


            const correctAnswer =
                Number(q.answer);


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "review-card";


            let statusText = "";

            let statusClass = "";


            if (selected === null
            ) {

                statusText =
                    "⏭ Skipped";

                statusClass =
                    "skipped";

            }

            else if (
                selected ===
                correctAnswer
            ) {

                statusText =
                    "✅ Correct";

                statusClass =
                    "review-correct";

            }

            else {

                statusText =
                    "❌ Wrong";

                statusClass =
                    "review-wrong";

            }


            const selectedText =
                selected === null
                    ? "Not answered"
                    : q.options[selected];


            card.innerHTML =
                `
                <h4>
                    ${index + 1}. ${escapeHTML(
                        q.question
                    )}
                </h4>

                <p class="${statusClass}">
                    ${statusText}
                </p>

                <p>
                    Your Answer:
                    <strong>
                        ${escapeHTML(
                            selectedText
                        )}
                    </strong>
                </p>

                <p>
                    Correct Answer:
                    <strong>
                        ${escapeHTML(
                            q.options[correctAnswer]
                        )}
                    </strong>
                </p>

                ${
                    q.explanation
                        ? `
                        <p>
                            💡
                            ${escapeHTML(
                                q.explanation
                            )}
                        </p>
                        `
                        : ""
                }
                `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================================
// RESTART
// ============================================================

document
    .getElementById(
        "restartBtn"
    )
    .addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );


            resultArea.style.display =
                "none";


            setupArea.style.display =
                "block";


            setupMessage.textContent =
                "";


            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        }
    );


// ============================================================
// BACK BUTTON
// ============================================================

document
    .getElementById(
        "backBtn"
    )
    .addEventListener(
        "click",
        () => {

            if (
                testArea.style.display ===
                "block"
            ) {

                if (
                    confirm(
                        "Practice test-ல் இருந்து வெளியேற வேண்டுமா?"
                    )
                ) {

                    clearInterval(
                        timerInterval
                    );

                    testArea.style.display =
                        "none";

                    setupArea.style.display =
                        "block";

                }

                return;

            }


            window.location.href =
                "dashboard.html";

        }
    );


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)
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


// ============================================================
// INITIAL LOAD
// ============================================================

loadQuestions();
               
