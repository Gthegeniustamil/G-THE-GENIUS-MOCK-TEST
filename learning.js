// ==========================================
// G THE GENIUS
// LEARNING ZONE
// SUBJECT ONLY
// Questions → Answer → Explanation
// Firebase Firestore
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


// ==========================================
// SUBJECT LIST
// ==========================================
//
// displayName = Learning Zone-ல் காட்டப்படும் பெயர்
// firebaseNames = Firestore-ல் தற்போது இருக்கும் subject பெயர்கள்
//
// பின்னர் Admin Panel-ல் subject names மாற்றலாம்.
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

        // தற்போது English subject இருந்தால்
        // அதிலிருந்து questions எடுக்கப்படும்.
        // பின்னர் Admin-ல் subject மாற்றலாம்.

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
            "current affairs",
            "Current Affairs"
        ]
    },

    {
        id: "psychology",
        displayName: "Psychology",
        icon: "🧠",
        description: "உளவியல் முக்கிய கேள்விகள்",

        // தற்போது Mathematics இருந்தால்
        // அதிலிருந்து questions எடுக்கப்படும்.
        // பின்னர் Admin-ல் Mathematics → Psychology
        // என்று மாற்றிக்கொள்ளலாம்.

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


    // Build subject list

    subjects =
        [...subjectConfig];


    // Setup buttons

    setupNavigation();

    
    setupSubjectBackButton();

    setupQuestionButtons();


    // Load questions

    await loadQuestions();


    // Render subjects

    renderSubjects();


    // Hide loader

    hideLoader();


    console.log(
        "📚 Learning Zone Ready"
    );

}


// ==========================================
// LOAD QUESTIONS
// ==========================================

async function loadQuestions() {

    const grid =
        document.getElementById(
            "subjectGrid"
        );


    if (grid) {

        grid.innerHTML = `

            <div class="loading-card">

                <div class="mini-spinner"></div>

                <p>
                    Loading Questions...
                </p>

            </div>

        `;

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
            (doc) => {

                const data =
                    doc.data();


                allQuestions.push({

                    id:
                        doc.id,

                    ...data

                });

            }
        );


        console.log(
            "📚 Questions Loaded:",
            allQuestions.length
        );


        console.log(
            "📚 Question Data:",
            allQuestions
        );


    } catch (error) {

        console.error(
            "❌ Questions Loading Error:",
            error
        );


        allQuestions = [];


        if (grid) {

            grid.innerHTML = `

                <div class="loading-card">

                    <div style="font-size:32px;">
                        ⚠️
                    </div>

                    <p>
                        Questions load ஆகவில்லை.
                    </p>

                    <small>
                        Please check Firebase connection.
                    </small>

                </div>

            `;

        }

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
// CHECK SUBJECT MATCH
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
// COUNT SUBJECT QUESTIONS
// ==========================================

function getSubjectQuestionCount(
    subject
) {

    return allQuestions.filter(
        question => {

            return questionMatchesSubject(
                question,
                subject
            );

        }
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
            "subjectGrid not found"
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
        (subject) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "subject-card";


            const questionCount =
                getSubjectQuestionCount(
                    subject
                );


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

                        ${
                            questionCount
                        }
                        Questions

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

function openSubject(
    subject
) {

    selectedSubject =
        subject;


    currentQuestion = 0;


    console.log(
        "📚 Selected Subject:",
        subject.displayName
    );


    // Find questions

    subjectQuestions =
        allQuestions.filter(
            question => {

                return questionMatchesSubject(
                    question,
                    subject
                );

            }
        );


    console.log(
        "📚 Subject Questions:",
        subjectQuestions.length
    );


    // Shuffle questions

    subjectQuestions =
        shuffleArray(
            subjectQuestions
        );


    // Update subject title

    setText(
        "selectedSubjectTitle",
        subject.displayName
    );


    setText(
        "selectedSubjectName",
        subject.displayName
    );


    setText(
        "selectedSubjectIcon",
        subject.icon
    );


    setText(
        "learningSubjectName",
        subject.displayName
    );


    // Hide subject

    hideElement(
        "subjectSection"
    );


    // Show learning section

    showElement(
        "learningSection"
    );


    // Hide topic section if exists

    hideElement(
        "topicSection"
    );


    // Show question

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
// SHOW NO QUESTIONS
// ==========================================

function showNoQuestions() {

    setText(
        "learningTitle",
        "Questions இன்னும் இல்லை"
    );


    setText(
        "learningKeyPoint",
        "இந்த Subject-க்கு Questions கிடைக்கவில்லை."
    );


    const explanation =
        document.getElementById(
            "learningExplanation"
        );


    if (explanation) {

        explanation.innerHTML = `

            <div class="loading-card">

                <div style="font-size:32px;">
                    📚
                </div>

                <p>
                    இந்த Subject-க்கு
                    Questions இன்னும் upload
                    செய்யப்படவில்லை.
                </p>

            </div>

        `;

    }


    setText(
        "learningImportant",
        "Admin Panel-ல் இந்த Subject-க்கு questions upload செய்யவும்."
    );


    setText(
        "learningRemember",
        "Questions upload செய்யப்பட்ட பிறகு இங்கே automatically வரும்."
    );


    setText(
        "learningExample",
        "மீண்டும் subject-ஐ open செய்து பார்க்கலாம்."
    );


    setText(
        "learningNumber",
        "0 / 0"
    );


    setText(
        "lessonIndicator",
        "0 / 0"
    );


    setText(
        "learningProgressText",
        "0%"
    );


    const progress =
        document.getElementById(
            "learningProgressFill"
        );


    if (progress) {

        progress.style.width =
            "0%";

    }


    updateQuestionButtons();

}


// ==========================================
// SHUFFLE ARRAY
// ==========================================

function shuffleArray(
    array
) {

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


// ==========================================
// SAFE SET TEXT
// ==========================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ?? "";

    }

}


// ==========================================
// SHOW ELEMENT
// ==========================================

function showElement(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// HIDE ELEMENT
// ==========================================

function hideElement(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(
    value
) {

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
// ==========================================
// G THE GENIUS
// LEARNING ZONE JS
// PART 2/3
// QUESTION DISPLAY
// ANSWER + EXPLANATION
// ==========================================


// ==========================================
// SHOW LEARNING QUESTION
// ==========================================

function showLearningQuestion() {

    if (
        !subjectQuestions.length
    ) {

        showNoQuestions();

        return;

    }


    const question =
        subjectQuestions[
            currentQuestion
        ];


    if (!question) {

        return;

    }


    console.log(
        "📖 Current Question:",
        question
    );


    // ======================================
    // QUESTION TEXT
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

    renderLearningOptions(
        question
    );


    // ======================================
    // ANSWER
    // ======================================

    const correctAnswer =
        getCorrectAnswer(
            question
        );

setText(
    "learningImportant",
    correctAnswer
        ? `✅ சரியான பதில்: ${correctAnswer}`
        : "✅ Answer available"
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
    // EXAMPLE / EXTRA INFO
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
            (
                number /
                total
            ) * 100
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
    // UPDATE BUTTONS
    // ======================================

    updateQuestionButtons();


    // ======================================
    // SCROLL TOP
    // ======================================

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// RENDER OPTIONS
// ==========================================

function renderLearningOptions(
    question
) {

    let optionsContainer =
        document.getElementById(
            "learningOptions"
        );


    // --------------------------------------
    // If learningOptions doesn't exist,
    // try alternative IDs
    // --------------------------------------

    if (!optionsContainer) {

        optionsContainer =
            document.getElementById(
                "optionsContainer"
            );

    }


    if (!optionsContainer) {

        optionsContainer =
            document.getElementById(
                "questionOptions"
            );

    }


    // --------------------------------------
    // If HTML doesn't contain options area,
    // create one automatically
    // --------------------------------------

    if (!optionsContainer) {

        const explanation =
            document.getElementById(
                "learningExplanation"
            );


        if (
            explanation &&
            explanation.parentElement
        ) {

            optionsContainer =
                document.createElement(
                    "div"
                );


            optionsContainer.id =
                "learningOptions";


            optionsContainer.className =
                "learning-options";


            explanation.parentElement.insertBefore(
                optionsContainer,
                explanation
            );

        }

    }


    if (!optionsContainer) {

        console.warn(
            "learningOptions container not found"
        );

        return;

    }


    optionsContainer.innerHTML =
        "";


    // ======================================
    // GET OPTIONS
    // ======================================

    const options =
        getQuestionOptions(
            question
        );


    if (
        options.length === 0
    ) {

        optionsContainer.innerHTML = `

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
        getCorrectAnswer(
            question
        );
console.log(
    "🎯 Learning Answer Debug:",
    {
        questionId: question.id,
        correctAnswer: question.correctAnswer,
        answer: question.answer,
        correct: question.correct,
        finalCorrectAnswer: correct,
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
                    option.value
                );


            const optionLabel =
                option.label;


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

                    ${escapeHTML(
                        getOptionLetter(
                            index
                        )
                    )}

                </div>


                <div class="option-text">

                    ${escapeHTML(
                        optionLabel
                    )}

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


            optionsContainer.appendChild(
                optionCard
            );

        }
    );

}


// ==========================================
// GET QUESTION OPTIONS
// ==========================================

function getQuestionOptions(
    question
) {

    // --------------------------------------
    // Array format
    // --------------------------------------

    if (
        Array.isArray(
            question.options
        )
    ) {

        return question.options.map(
            (option) => {

                if (
                    typeof option ===
                    "object"
                ) {

                    return {

                        value:
                            option.value ??
                            option.id ??
                            option.key ??
                            option.text ??
                            "",

                        label:
                            option.text ??
                            option.label ??
                            option.value ??
                            ""

                    };

                }


                return {

                    value:
                        option,

                    label:
                        option

                };

            }
        );

    }


    // --------------------------------------
    // Individual fields
    // --------------------------------------

    const optionFields = [

        [
            "A",
            question.optionA ||
            question.OptionA ||
            question.a ||
            question.A
        ],

        [
            "B",
            question.optionB ||
            question.OptionB ||
            question.b ||
            question.B
        ],

        [
            "C",
            question.optionC ||
            question.OptionC ||
            question.c ||
            question.C
        ],

        [
            "D",
            question.optionD ||
            question.OptionD ||
            question.d ||
            question.D
        ]

    ];


    return optionFields
        .filter(
            item => {

                return (
                    item[1] !==
                    undefined &&
                    item[1] !==
                    null &&
                    String(
                        item[1]
                    ).trim() !== ""
                );

            }
        )
        .map(
            item => {

                return {

                    value:
                        item[0],

                    label:
                        String(
                            item[1]
                        )

                };

            }
        );

}


// ==========================================
// GET OPTION LETTER
// ==========================================

function getOptionLetter(
    index
) {

    const letters = [
        "A",
        "B",
        "C",
        "D",
        "E"
    ];


    return (
        letters[index] ||
        String(
            index + 1
        )
    );

}


// ==========================================
// GET CORRECT ANSWER
// ==========================================

function getCorrectAnswer(
    question
) {

    const answer =
        question.correctAnswer ??
        question.answer ??
        question.correct ??
        question.correctOption ??
        question.correct_option ??
        question.correctAnswerText ??
        question.answerKey ??
        question.answer_key ??
        question.rightAnswer ??
        question.right_answer;


    if (
        answer ===
        undefined ||
        answer ===
        null
    ) {

        return "";

    }


    // --------------------------------------
    // If answer is object
    // --------------------------------------

    if (
        typeof answer ===
        "object"
    ) {

        return String(
            answer.text ??
            answer.label ??
            answer.value ??
            ""
        );

    }


    return String(
        answer
    ).trim();

}


// ==========================================
// CHECK CORRECT OPTION
// FIRESTORE 0-BASED ANSWER
//
// 0 = A
// 1 = B
// 2 = C
// 3 = D
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
        String(correctAnswer).trim() === ""
    ) {
        return false;
    }


    const correct =
        normalizeText(correctAnswer);


    const value =
        normalizeText(optionValue);


    const label =
        normalizeText(optionLabel);


    const letter =
        normalizeText(
            getOptionLetter(index)
        );


    // ======================================
    // 1. 0 / 1 / 2 / 3
    // ======================================

    if (
        /^(0|1|2|3)$/.test(correct)
    ) {

        return (
            Number(correct) ===
            index
        );

    }


    // ======================================
    // 2. A / B / C / D
    // ======================================

    if (
        correct === letter
    ) {

        return true;

    }


    // ======================================
    // 3. Option A / Option B / etc.
    // ======================================

    if (
        correct === `option ${letter}`
    ) {

        return true;

    }


    // ======================================
    // 4. (A) / (B) / (C) / (D)
    // ======================================

    if (
        correct === `(${letter})`
    ) {

        return true;

    }


    // ======================================
    // 5. A. / B. / C. / D.
    // ======================================

    if (
        correct === `${letter}.`
    ) {

        return true;

    }


    // ======================================
    // 6. Full option text
    // ======================================

    if (
        correct === label
    ) {

        return true;

    }


    if (
        correct === value
    ) {

        return true;

    }


    return false;

}


    

// ==========================================
// FORMAT LEARNING TEXT
// ==========================================

function formatLearningText(
    text
) {

    if (
        text ===
        undefined ||
        text ===
        null
    ) {

        return "";

    }


    const safeText =
        escapeHTML(
            String(
                text
            )
        );


    return safeText

        .replace(
            /\n\n/g,
            "<p></p>"
        )

        .replace(
            /\n/g,
            "<br>"
        );

}


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


    if (previous) {

        previous.disabled =
            (
                currentQuestion ===
                0 ||
                subjectQuestions.length ===
                0
            );

    }


    if (next) {

        next.disabled =
            (
                subjectQuestions.length ===
                0
            );


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
        currentQuestion >
        0
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
        () => {

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


    showElement(
        "subjectSection"
    );


    hideElement(
        "topicSection"
    );


    hideElement(
        "learningSection"
    );


    renderSubjects();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// SEARCH SETUP
// ==========================================

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const clear =
        document.getElementById(
            "clearSearchBtn"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        () => {

            const text =
                normalizeText(
                    input.value
                );


            if (clear) {

                clear.style.display =
                    text
                        ? "block"
                        : "none";

            }


            if (!text) {

                renderSubjects();

                return;

            }


            const filtered =
                subjects.filter(
                    subject => {

                        return (

                            normalizeText(
                                subject.displayName
                            ).includes(
                                text
                            )

                            ||

                            normalizeText(
                                subject.description
                            ).includes(
                                text
                            )

                        );

                    }
                );


            renderSubjects(
                filtered
            );

        }
    );


    if (clear) {

        clear.addEventListener(
            "click",
            () => {

                input.value =
                    "";


                clear.style.display =
                    "none";


                renderSubjects();

            }
        );

    }

        }

// ==========================================
// G THE GENIUS
// LEARNING ZONE JS
// PART 3/3
// NAVIGATION + HOME + PROFILE + PRACTICE
// ==========================================


// ==========================================
// NAVIGATION SETUP
// ==========================================

function setupNavigation() {

    // --------------------------------------
    // Back Button
    // --------------------------------------

    const backBtn =
    document.getElementById("backBtn");

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            // Learning question page open
            if (
                selectedSubject &&
                subjectQuestions.length > 0
            ) {

                showSubjects();

                return;
            }

            // Already on subject page
            // Go directly to dashboard
            window.location.href = "index.html";

        }
    );

}


    // --------------------------------------
    // HOME
    // --------------------------------------

    const homeNav =
        document.getElementById(
            "homeNav"
        );


    if (homeNav) {

        homeNav.addEventListener(
            "click",
            () => {

                console.log(
                    "🏠 Home → Dashboard"
                );


                goToDashboard();

            }
        );

    }


    // --------------------------------------
    // PRACTICE
    // --------------------------------------

    const practiceNav =
        document.getElementById(
            "practiceNav"
        );


    if (practiceNav) {

        practiceNav.addEventListener(
            "click",
            () => {

                window.location.href =
                    "practice.html";

            }
        );

    }


    // --------------------------------------
    // LEARNING
    // --------------------------------------

    const learningNav =
        document.getElementById(
            "learningNav"
        );


    if (learningNav) {

        learningNav.addEventListener(
            "click",
            () => {

                showSubjects();

            }
        );

    }


    // --------------------------------------
    // PROFILE
    // --------------------------------------

    const profileNav =
        document.getElementById(
            "profileNav"
        );


    if (profileNav) {

        profileNav.addEventListener(
            "click",
            () => {

                window.location.href =
                    "profile.html";

            }
        );

    }

}


// ==========================================
// GO TO DASHBOARD
// ==========================================

function goToDashboard() {

    /*
        IMPORTANT:

        Learning page-ல் Home click செய்தால்
        login.html செல்லக்கூடாது.

        Dashboard file:
        index.html

        உங்கள் dashboard வேறு file name-ல்
        இருந்தால் கீழே மட்டும் மாற்றலாம்.
    */


    window.location.href =
        "index.html";

}


// ==========================================
// REFRESH BUTTON
// ==========================================

function setupRefreshButton() {

    const refreshBtn =
        document.getElementById(
            "refreshBtn"
        );


    if (!refreshBtn) {

        return;

    }


    refreshBtn.addEventListener(
        "click",
        () => {

            refreshBtn.disabled =
                true;


            refreshBtn.innerHTML =
                "⏳ Loading...";


            setTimeout(
                () => {

                    location.reload();

                },
                300
            );

        }
    );

}


// ==========================================
// PRACTICE / QUICK TEST
// ==========================================

function setupQuickTest() {

    const quickTestBtn =
        document.getElementById(
            "startQuickTestBtn"
        );


    if (!quickTestBtn) {

        return;

    }


    quickTestBtn.addEventListener(
        "click",
        () => {

            if (
                !selectedSubject
            ) {

                alert(
                    "முதலில் ஒரு Subject-ஐ select செய்யுங்கள்."
                );

                return;

            }


            const subjectName =
                encodeURIComponent(
                    selectedSubject
                        .firebaseNames[0]
                );


            window.location.href =
                `practice.html?subject=${subjectName}`;

        }
    );

}


// ==========================================
// LOADER
// ==========================================

function hideLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (!loader) {

        return;

    }


    setTimeout(
        () => {

            loader.classList.add(
                "hidden"
            );

        },
        300
    );

}


// ==========================================
// SHOW LOADER
// ==========================================

function showLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (!loader) {

        return;

    }


    loader.classList.remove(
        "hidden"
    );

}


// ==========================================
// ERROR HANDLING
// ==========================================

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "❌ Learning Zone Error:",
            event.error ||
            event.message
        );

    }
);


// ==========================================
// FIREBASE ERROR HANDLING
// ==========================================

window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.error(
            "❌ Learning Zone Promise Error:",
            event.reason
        );

    }
);


// ==========================================
// PREVENT OLD TOPIC FUNCTIONS
// ==========================================
//
// பழைய HTML-ல் topic section இருந்தாலும்
// Learning JS அதை use செய்யாது.
// ==========================================

function disableTopicSystem() {

    const topicSection =
        document.getElementById(
            "topicSection"
        );


    if (topicSection) {

        topicSection.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// INITIAL UI
// ==========================================

function prepareInitialUI() {

    // Hide topic

    disableTopicSystem();


    // Show subject

    showElement(
        "subjectSection"
    );


    // Hide learning

    hideElement(
        "learningSection"
    );


    // Update subject count

    const count =
        document.getElementById(
            "subjectCount"
        );


    if (count) {

        count.textContent =
            `${subjects.length} Subjects`;

    }

}


// ==========================================
// SETUP OPTIONAL BUTTONS
// ==========================================

function setupOptionalButtons() {

    setupRefreshButton();

    setupQuickTest();

}


// ==========================================
// RUN FINAL SETUP
// ==========================================

prepareInitialUI();

setupOptionalButtons();


// ==========================================
// FINAL MESSAGE
// ==========================================

console.log(
    "✅ G THE GENIUS Learning Zone JS Loaded Successfully"
);

console.log(
    "📚 Subject Only Mode Enabled"
);

console.log(
    "📖 Questions loaded from Firestore: questions"
);

console.log(
    "🎯 Topic system disabled"
);
