// ==========================================
// G THE GENIUS
// LEARNING ZONE
// FINAL JS - PART 1
// Subject Loading + Firebase + Subjects
// ==========================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// VARIABLES
// ==========================================

let allQuestions = [];
let subjectQuestions = [];

let selectedSubject = null;
let currentQuestion = 0;

let subjects = [];
let questionsLoading = true;

// ==========================================
// SUBJECT CONFIG
// ==========================================

const subjectConfig = [

    {
        id: "tamil",
        displayName: "தமிழ்",
        icon: "📖",
        description: "தமிழ் இலக்கியம் & முக்கிய கேள்விகள்",
        firebaseNames: [
            "தமிழ்",
            "Tamil",
            "tamil"
        ]
    },

    {
        id: "tamil-grammar",
        displayName: "தமிழ் இலக்கணம்",
        icon: "📝",
        description: "தமிழ் இலக்கணத்தின் முக்கிய கேள்விகள்",
        firebaseNames: [
            "English",
            "english",
            "தமிழ் இலக்கணம்",
            "Tamil Grammar"
        ]
    },

    {
        id: "gk",
        displayName: "General Knowledge",
        icon: "🧠",
        description: "பொது அறிவின் முக்கிய கேள்விகள்",
        firebaseNames: [
            "General Knowledge",
            "general knowledge",
            "GK",
            "gk"
        ]
    },

    {
        id: "polity",
        displayName: "Indian Polity",
        icon: "🇮🇳",
        description: "இந்திய அரசியலமைப்பு & அரசியல்",
        firebaseNames: [
            "Indian Polity",
            "indian polity",
            "Polity",
            "polity"
        ]
    },

    {
        id: "history",
        displayName: "History",
        icon: "🏛️",
        description: "இந்திய & தமிழக வரலாறு",
        firebaseNames: [
            "History",
            "history"
        ]
    },

    {
        id: "geography",
        displayName: "Geography",
        icon: "🌍",
        description: "இந்திய & உலக புவியியல்",
        firebaseNames: [
            "Geography",
            "geography"
        ]
    },

    {
        id: "science",
        displayName: "General Science",
        icon: "🔬",
        description: "அறிவியலின் முக்கிய கேள்விகள்",
        firebaseNames: [
            "General Science",
            "general science",
            "Science",
            "science"
        ]
    },

    {
        id: "economics",
        displayName: "Economics",
        icon: "💰",
        description: "இந்திய பொருளாதாரம்",
        firebaseNames: [
            "Economics",
            "economics"
        ]
    },

    {
        id: "current-affairs",
        displayName: "Current Affairs",
        icon: "📰",
        description: "நடப்பு நிகழ்வுகளின் முக்கிய கேள்விகள்",
        firebaseNames: [
            "Current Affairs",
            "current affairs"
        ]
    },

    {
        id: "psychology",
        displayName: "Psychology",
        icon: "🧠",
        description: "உளவியல் முக்கிய கேள்விகள்",
        firebaseNames: [
            "Mathematics",
            "mathematics",
            "Maths",
            "maths",
            "Psychology",
            "psychology"
        ]
    }

];


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeLearning
);


// ==========================================
// INITIALIZE
// ==========================================
async function initializeLearning() {

    console.log(
        "📚 G THE GENIUS Learning Zone Starting..."
    );

    subjects = [...subjectConfig];

    setupNavigation();
    setupTopButtons();

    setupSubjectBackButton();

    setupQuestionButtons();

    setupQuickTest();

    // ======================================
    // 🚀 INSTANT APP UI
    // Firebase wait செய்ய வேண்டாம்
    // ======================================

    renderSubjects();

    hideLoader();

    console.log(
        "⚡ Learning UI Ready Instantly"
    );

    // ======================================
    // 🔥 FIREBASE BACKGROUND LOAD
    // ======================================

    loadQuestions()
        .then(() => {

            // Firebase data வந்த பிறகு
            // question counts மட்டும் update
            renderSubjects();

            console.log(
                "✅ Firebase Questions Updated"
            );

        })
        .catch(error => {

            console.error(
                "❌ Background Firebase Error:",
                error
            );

        });

}

// ==========================================
// LOAD QUESTIONS
// ==========================================

async function loadQuestions() {

    // ======================================
    // QUESTIONS LOADING STATE
    // ======================================

    questionsLoading = true;


    // ======================================
    // SHOW SUBJECTS IMMEDIATELY
    // Count மட்டும் Loading...
    // ======================================

    renderSubjects();


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "questions"
                )
            ):


        // ==================================
        // CLEAR OLD QUESTIONS
        // ==================================

        allQuestions = [];


        // ==================================
        // LOAD FIREBASE QUESTIONS
        // ==================================

        snapshot.forEach(
            (doc) => {

                allQuestions.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        console.log(
            "📚 Questions Loaded:",
            allQuestions.length
        );


        // ==================================
        // FIREBASE LOADING COMPLETE
        // ==================================

        questionsLoading = false;


        // ==================================
        // UPDATE SUBJECT COUNTS
        // ==================================

        renderSubjects();


        console.log(
            "✅ Learning Questions Ready"
        );


    } catch (error) {

        console.error(
            "❌ Firebase Questions Error:",
            error
        );


        // ==================================
        // LOADING COMPLETE
        // ==================================

        questionsLoading = false;


        // ==================================
        // KEEP SUBJECTS VISIBLE
        // Don't replace with error card
        // ==================================

        renderSubjects();


        console.log(
            "⚠️ Questions could not be loaded"
        );

    }

}

        


// ==========================================
// GET QUESTION SUBJECT
// ==========================================

function getQuestionSubject(question) {

    return (

        question.subject ??

        question.subjectName ??

        question.category ??

        question.subjectTitle ??

        ""

    );

}


// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizeText(value) {

    return String(
        value ?? ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /\s+/g,
        " "
    );

}


// ==========================================
// SUBJECT MATCH
// ==========================================

function questionMatchesSubject(
    question,
    subject
) {

    const questionSubject =
        normalizeText(
            getQuestionSubject(
                question
            )
        );

    if (!questionSubject) {

        return false;

    }

    return subject.firebaseNames.some(
        name => {

            return (
                normalizeText(name) ===
                questionSubject
            );

        }
    );

}


// ==========================================
// SUBJECT QUESTION COUNT
// ==========================================

function getSubjectQuestionCount(
    subject
) {

    return allQuestions.filter(
        question =>
            questionMatchesSubject(
                question,
                subject
            )
    ).length;

}


// ==========================================
// RENDER SUBJECTS
// ==========================================

function renderSubjects(
    filteredSubjects = subjects
) {

    const grid =
        document.getElementById(
            "subjectGrid"
        );

    const count =
        document.getElementById(
            "subjectCount"
        );

    if (!grid) {

        console.error(
            "❌ subjectGrid not found"
        );

        return;

    }

    if (count) {

        count.textContent =
            `${filteredSubjects.length} Subjects`;

    }

    grid.innerHTML = "";

    if (
        filteredSubjects.length === 0
    ) {

        grid.innerHTML = `

            <div class="loading-card">

                <div style="font-size:30px;">
                    🔍
                </div>

                <p>
                    Subject கிடைக்கவில்லை.
                </p>

            </div>

        `;

        return;

    }

    filteredSubjects.forEach(
        subject => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "subject-card";

 const questionCount =
    questionsLoading
        ? "⏳ Loading..."
        : `${getSubjectQuestionCount(subject)} Questions`;

            card.innerHTML = `

                <span class="subject-arrow">
                    →
                </span>

                <div class="subject-icon">
                    ${escapeHTML(
                        subject.icon
                    )}
                </div>

                <div class="subject-info">

                    <h4>
                        ${escapeHTML(
                            subject.displayName
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            subject.description
                        )}
                    </p>

                    <small class="subject-question-count">
    ${questionCount}
</small>

                </div>

            `;

            card.addEventListener(
                "click",
                () => {

                    openSubject(
                        subject
                    );

                }
            );

            grid.appendChild(
                card
            );

        }
    );
}


// ==========================================
// OPEN SUBJECT
// ==========================================

function openSubject(subject) {

    selectedSubject =
        subject;

    currentQuestion =
        0;

    subjectQuestions =
        allQuestions.filter(
            question =>
                questionMatchesSubject(
                    question,
                    subject
                )
        );

    subjectQuestions =
        shuffleArray(
            subjectQuestions
        );

    setText(
        "selectedSubjectName",
        subject.displayName
    );

    setText(
        "selectedSubjectIcon",
        subject.icon
    );

    hideElement(
        "subjectSection"
    );

    showElement(
        "learningSection"
    );

    hideElement(
        "topicSection"
    );

    if (
        subjectQuestions.length > 0
    ) {

        showLearningQuestion();

    } else {

        showNoQuestions();

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// SHUFFLE
// ==========================================

function shuffleArray(array) {

    const copy = [...array];

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


// ==========================================
// SET TEXT
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? "";

    }

}


// ==========================================
// SHOW ELEMENT
// ==========================================

function showElement(id) {

    const element =
        document.getElementById(id);

    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// HIDE ELEMENT
// ==========================================

function hideElement(id) {

    const element =
        document.getElementById(id);

    if (element) {

        element.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
// ==========================================
// QUICK TEST BUTTON
// ==========================================

function setupQuickTest() {

    const quickTestButton =
        document.getElementById("startQuickTestBtn");

    if (!quickTestButton) {
        return;
    }

    quickTestButton.addEventListener(
        "click",
        function () {

            if (!selectedSubject) {

                alert(
                    "முதலில் ஒரு Subject-ஐ தேர்வு செய்யவும்."
                );

                return;
            }

            const subjectName =
                encodeURIComponent(
                    selectedSubject.displayName
                );

            window.location.href =
                "practice.html?subject=" +
                subjectName;

        }
    );

}

// ==========================================
// PART 1 END
// ==========================================
// ==========================================
// G THE GENIUS
// LEARNING ZONE JS
// PART 2
// QUESTION DISPLAY
// OPTIONS
// CORRECT ANSWER
// EXPLANATION
// ==========================================


// ==========================================
// SHOW LEARNING QUESTION
// ==========================================

function showLearningQuestion() {

    if (!subjectQuestions.length) {
        showNoQuestions();
        return;
    }

    const question =
        subjectQuestions[currentQuestion];

    if (!question) {
        return;
    }

    console.log(
        "📖 Current Question:",
        question
    );


    // ======================================
    // QUESTION
    // ======================================

    const questionText =
        question.question ||
        question.questionText ||
        question.text ||
        question.title ||
        "Question not available";

    setText(
        "learningTitle",
        questionText
    );


    // ======================================
    // KEY POINT
    // ======================================

    const keyPoint =
        question.keyPoint ||
        question.keypoint ||
        question.key_point ||
        question.questionType ||
        "Important Exam Question";

    setText(
        "learningKeyPoint",
        keyPoint
    );


    // ======================================
    // OPTIONS
    // ======================================

    renderLearningOptions(question);


    // ======================================
    // CORRECT ANSWER
    // ======================================

    const correctAnswer =
    getCorrectAnswer(question);

const options =
    getQuestionOptions(question);

let correctText = "";

if (
    correctAnswer !== "" &&
    options.length > 0
) {

    const answerIndex =
        Number(correctAnswer);

    if (
        Number.isInteger(answerIndex) &&
        answerIndex >= 0 &&
        answerIndex < options.length
    ) {

        correctText =
            options[answerIndex].label;

    } else {

        correctText =
            correctAnswer;

    }

}

setText(
    "learningImportant",
    correctText
        ? `✅ சரியான பதில்: ${correctText}`
        : ""
);


    // ======================================
    // EXPLANATION
    // ======================================

    const explanation =
        question.explanation ||
        question.Explanation ||
        question.answerExplanation ||
        question.answer_explanation ||
        question.solution ||
        question.reason ||
        "இந்த கேள்விக்கான விளக்கம் Admin Panel-ல் இன்னும் சேர்க்கப்படவில்லை.";

    const explanationElement =
        document.getElementById(
            "learningExplanation"
        );

    if (explanationElement) {

        explanationElement.innerHTML =
            formatLearningText(
                explanation
            );

    }


    // ======================================
    // REMEMBER
    // ======================================

    const remember =
        question.remember ||
        question.rememberThis ||
        question.memory ||
        question.shortNote ||
        question.note ||
        "இந்த Answer-ஐ revision செய்து நினைவில் வைத்துக்கொள்ளுங்கள்.";

    setText(
        "learningRemember",
        remember
    );


    // ======================================
    // EXAMPLE
    // ======================================

    const example =
        question.example ||
        question.exampleQuestion ||
        question.additionalInfo ||
        question.extraInfo ||
        "இந்த கேள்வியை மீண்டும் ஒருமுறை படித்து பாருங்கள்.";

    setText(
        "learningExample",
        example
    );


    // ======================================
    // QUESTION NUMBER
    // ======================================

    const total =
        subjectQuestions.length;

    const number =
        currentQuestion + 1;

    setText(
        "learningNumber",
        `${number} / ${total}`
    );

    setText(
        "lessonIndicator",
        `${number} / ${total}`
    );


    // ======================================
    // PROGRESS
    // ======================================

    const percentage =
        Math.round(
            (number / total) * 100
        );

    setText(
        "learningProgressText",
        `${percentage}%`
    );

    const progressFill =
        document.getElementById(
            "learningProgressFill"
        );

    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }


    // ======================================
    // BUTTONS
    // ======================================

    updateQuestionButtons();


    // ======================================
    // TOP
    // ======================================

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// RENDER LEARNING OPTIONS
// ==========================================

function renderLearningOptions(question) {

    let container =
        document.getElementById(
            "learningOptions"
        );

    if (!container) {

        container =
            document.getElementById(
                "optionsContainer"
            );

    }

    if (!container) {

        container =
            document.getElementById(
                "questionOptions"
            );

    }

    if (!container) {

        const explanation =
            document.getElementById(
                "learningExplanation"
            );

        if (
            explanation &&
            explanation.parentElement
        ) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "learningOptions";

            container.className =
                "learning-options";

            explanation.parentElement.insertBefore(
                container,
                explanation
            );

        }

    }

    if (!container) {

        console.warn(
            "learningOptions container not found"
        );

        return;

    }


    // Clear old options

    container.innerHTML = "";


    // ======================================
    // GET OPTIONS
    // ======================================

    const options =
        getQuestionOptions(question);

    if (!options.length) {

        container.innerHTML = `
            <div class="no-options">
                Options not available.
            </div>
        `;

        return;

    }


    // ======================================
    // CORRECT ANSWER
    // ======================================

    const correct =
        getCorrectAnswer(question);


    console.log(
        "🎯 Learning Answer:",
        {
            id: question.id,
            correctAnswer: question.correctAnswer,
            answer: question.answer,
            correct: question.correct,
            finalAnswer: correct,
            options: options
        }
    );


    // ======================================
    // CREATE OPTIONS
    // ======================================

    options.forEach(
        (option, index) => {

            const optionValue =
                String(
                    option.value ?? ""
                );

            const optionLabel =
                String(
                    option.label ?? ""
                );


            // IMPORTANT:
            // index 0 = A
            // index 1 = B
            // index 2 = C
            // index 3 = D

            const isCorrect =
                isCorrectOption(
                    optionValue,
                    optionLabel,
                    correct,
                    index,
                    question
                );


            const optionCard =
                document.createElement(
                    "div"
                );

            optionCard.className =
                "learning-option";


            if (isCorrect) {

                optionCard.classList.add(
                    "correct-option"
                );

            }


            optionCard.innerHTML = `

                <div class="option-letter">
                    ${getOptionLetter(index)}
                </div>

                <div class="option-text">
                    ${escapeHTML(optionLabel)}
                </div>

                ${
                    isCorrect
                    ? `
                        <div class="correct-mark">
                            ✓
                        </div>
                    `
                    : ""
                }

            `;


            container.appendChild(
                optionCard
            );

        }
    );

}


// ==========================================
// GET QUESTION OPTIONS
// ==========================================

function getQuestionOptions(question) {

    let rawOptions =
        question.options ||
        question.choices ||
        question.answers ||
        null;


    // Array format

    if (Array.isArray(rawOptions)) {

        return rawOptions.map(
            (option, index) => {

                if (
                    typeof option ===
                    "object"
                ) {

                    return {

                        value:
                            option.value ??
                            option.id ??
                            index,

                        label:
                            option.label ??
                            option.text ??
                            option.answer ??
                            ""

                    };

                }


                return {

                    value: index,

                    label: String(option)

                };

            }
        );

    }


    // Separate option fields

    const possibleOptions = [

        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD

    ];


    if (
        possibleOptions.some(
            option =>
                option !== undefined &&
                option !== null &&
                option !== ""
        )
    ) {

        return possibleOptions.map(
            (option, index) => ({

                value: index,

                label:
                    String(
                        option ?? ""
                    )

            })
        );

    }


    return [];

}


// ==========================================
// GET OPTION LETTER
// ==========================================

function getOptionLetter(index) {

    const letters = [
        "A",
        "B",
        "C",
        "D"
    ];

    return (
        letters[index] ||
        String(index + 1)
    );

}


// ==========================================
// GET CORRECT ANSWER
// ==========================================

function getCorrectAnswer(question) {

    let answer =
        question.correctAnswer ??
        question.correct_answer ??
        question.answer ??
        question.correctOption ??
        question.correct_option ??
        question.correct ??
        question.answerIndex;


    if (
        answer === undefined ||
        answer === null ||
        answer === ""
    ) {

        return "";

    }


    return String(answer).trim();

}


// ==========================================
// CHECK CORRECT OPTION
// ==========================================

function isCorrectOption(
    optionValue,
    optionLabel,
    correctAnswer,
    index,
    question
) {

    if (
        correctAnswer === undefined ||
        correctAnswer === null ||
        correctAnswer === ""
    ) {

        return false;

    }


    const correct =
        String(
            correctAnswer
        )
        .trim()
        .toLowerCase();


    const value =
        String(
            optionValue
        )
        .trim()
        .toLowerCase();


    const label =
        String(
            optionLabel
        )
        .trim()
        .toLowerCase();


    // ======================================
    // MOST IMPORTANT
    //
    // Firebase answer index:
    //
    // 0 = A
    // 1 = B
    // 2 = C
    // 3 = D
    //
    // Therefore 3 MUST mean D.
    // ======================================

    if (
        /^[0-3]$/.test(correct)
    ) {

        return (
            index ===
            Number(correct)
        );

    }


    // A / B / C / D

    const letters = [
        "a",
        "b",
        "c",
        "d"
    ];

    if (
        letters.includes(correct)
    ) {

        return (
            letters[index] ===
            correct
        );

    }


    // Full option text

    if (
        label === correct
    ) {

        return true;

    }


    // Numeric 1 / 2 / 3 / 4 format

    if (
        /^[1-4]$/.test(correct)
    ) {

        return (
            index ===
            Number(correct) - 1
        );

    }


    // Match option value

    if (
        value === correct
    ) {

        return true;

    }


    return false;

}


// ==========================================
// FORMAT LEARNING TEXT
// ==========================================

function formatLearningText(text) {

    return escapeHTML(
        String(
            text ?? ""
        )
    )
    .replace(
        /\n/g,
        "<br>"
    );

                }

// ==========================================
// G THE GENIUS
// LEARNING ZONE JS
// PART 3
// NAVIGATION
// PREVIOUS / NEXT
// BACK TO SUBJECTS
// LOADER
// ==========================================


// ==========================================
// UPDATE QUESTION BUTTONS
// ==========================================

function updateQuestionButtons() {

    const previous =
        document.getElementById(
            "previousLessonBtn"
        );

    const next =
        document.getElementById(
            "nextLessonBtn"
        );


    if (!subjectQuestions.length) {

        if (previous) {

            previous.disabled = true;

        }

        if (next) {

            next.disabled = true;

        }

        return;

    }


    // ======================================
    // PREVIOUS BUTTON
    // ======================================

    if (previous) {

        previous.disabled =
            currentQuestion === 0;

        previous.textContent =
            currentQuestion === 0
                ? "← Previous"
                : "← Previous";

    }


    // ======================================
    // NEXT BUTTON
    // ======================================

    if (next) {

        next.disabled = false;

        if (
            currentQuestion ===
            subjectQuestions.length - 1
        ) {

            next.textContent =
                "Completed ✓";

        } else {

            next.textContent =
                "Next →";

        }

    }

}


// ==========================================
// PREVIOUS QUESTION
// ==========================================

function goToPreviousQuestion() {

    if (
        currentQuestion > 0
    ) {

        currentQuestion--;

        showLearningQuestion();

    }

}


// ==========================================
// NEXT QUESTION
// ==========================================

function goToNextQuestion() {

    if (
        currentQuestion <
        subjectQuestions.length - 1
    ) {

        currentQuestion++;

        showLearningQuestion();

    }

}


// ==========================================
// QUESTION BUTTON SETUP
// ==========================================

function setupQuestionButtons() {

    const previous =
        document.getElementById(
            "previousLessonBtn"
        );

    const next =
        document.getElementById(
            "nextLessonBtn"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            goToPreviousQuestion
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            goToNextQuestion
        );

    }

}


// ==========================================
// SUBJECT BACK BUTTON
// ==========================================

function setupSubjectBackButton() {

    const back =
        document.getElementById(
            "backToSubjectsBtn"
        );


    if (!back) {

        return;

    }


    back.addEventListener(
        "click",
        function () {

            showSubjects();

        }
    );

}


// ==========================================
// SHOW SUBJECTS
// ==========================================

function showSubjects() {

    selectedSubject =
        null;

    subjectQuestions =
        [];

    currentQuestion =
        0;


    // Show subject section

    showElement(
        "subjectSection"
    );


    // Hide learning section

    hideElement(
        "learningSection"
    );


    // Hide topic section

    hideElement(
        "topicSection"
    );


    // Render subjects again

    renderSubjects();


    // Scroll top

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// NAVIGATION SETUP
// ==========================================

function setupNavigation() {

    // HOME
    const homeButton =
        document.getElementById("homeNav");

    if (homeButton) {

        homeButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "index.html";

            }
        );

    }


    // PRACTICE
    const practiceButton =
        document.getElementById("practiceNav");

    if (practiceButton) {

        practiceButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "practice.html";

            }
        );

    }


    // LEARNING
    const learningButton =
        document.getElementById("learningNav");

    if (learningButton) {

        learningButton.addEventListener(
            "click",
            function () {

                showSubjects();

            }
        );

    }


    // PROFILE
    const profileButton =
        document.getElementById("profileNav");

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "profile.html";

            }
        );

    }


    // TOP BACK BUTTON
    const backButton =
        document.getElementById("backBtn");

    if (backButton) {

        backButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showSubjects();

            }
        );

    }

}
// ==========================================
// TOP BACK + REFRESH BUTTONS
// ==========================================

function setupTopButtons() {

    const backButton =
        document.getElementById("backBtn");

    if (backButton) {

        backButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showSubjects();

            }
        );

    }


    const refreshButton =
        document.getElementById("refreshBtn");

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                location.reload();

            }
        );

    }

                    }

// ==========================================
// LOADER
// ==========================================

function hideLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (loader) {

        loader.classList.add(
            "hidden"
        );

    }


    const loading =
        document.querySelector(
            ".page-loader"
        );


    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "❌ Learning Zone Error:",
            event.error ||
            event.message
        );

    }
);


// ==========================================
// FIREBASE / PROMISE ERROR
// ==========================================

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "❌ Learning Zone Promise Error:",
            event.reason
        );

    }
);


// ==========================================
// START MESSAGE
// ==========================================

console.log(
    "📚 G THE GENIUS Learning Zone JS Loaded Successfully"
);
// ======================================================
// PRACTICE THIS SUBJECT BUTTON
// ======================================================

const startQuickTestBtn =
    document.getElementById("startQuickTestBtn");

if (startQuickTestBtn) {

    startQuickTestBtn.addEventListener("click", () => {

        const subject =
            window.currentSubject ||
            new URLSearchParams(
                window.location.search
            ).get("subject");

        if (!subject) {

            alert("Subject not found ❌");

            return;

        }

        window.location.href =
            `practice.html?subject=${encodeURIComponent(subject)}`;

    });

                                                        }
