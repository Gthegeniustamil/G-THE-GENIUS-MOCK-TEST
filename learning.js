// ==========================================
// G THE GENIUS
// LEARNING ZONE JS
// SUBJECT → EXISTING QUESTIONS
// FIREBASE FIRESTORE
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
let subjects = [];

let selectedSubject = null;
let subjectQuestions = [];

let currentQuestion = 0;
let answerShown = false;


// ==========================================
// DEFAULT SUBJECTS
// ==========================================

const defaultSubjects = [

    {
        id: "tamil",
        name: "தமிழ்",
        icon: "📖",
        description: "தமிழ் இலக்கணம் & இலக்கியம்"
    },

    {
        id: "history",
        name: "History",
        icon: "🏛️",
        description: "இந்திய & தமிழக வரலாறு"
    },

    {
        id: "south-indian-history",
        name: "South Indian History",
        icon: "🏰",
        description: "தென்னிந்திய வரலாறு"
    },

    {
        id: "geography",
        name: "Geography",
        icon: "🌍",
        description: "இந்திய & உலக புவியியல்"
    },

    {
        id: "polity",
        name: "Indian Polity",
        icon: "🇮🇳",
        description: "இந்திய அரசியல் அமைப்பு"
    },

    {
        id: "economics",
        name: "Economics",
        icon: "💰",
        description: "இந்திய பொருளாதாரம்"
    },

    {
        id: "science",
        name: "General Science",
        icon: "🔬",
        description: "அறிவியல் முக்கிய தகவல்கள்"
    },

    {
        id: "gk",
        name: "General Knowledge",
        icon: "🧠",
        description: "பொது அறிவு"
    },

    {
        id: "current-affairs",
        name: "Current Affairs",
        icon: "📰",
        description: "நடப்பு நிகழ்வுகள்"
    },

    {
        id: "maths",
        name: "Maths",
        icon: "➗",
        description: "கணிதம்"
    },

    {
        id: "reasoning",
        name: "Reasoning",
        icon: "🧩",
        description: "தர்க்க அறிவு"
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

    setupNavigation();

    setupSearch();

    setupButtons();

    await loadQuestions();

    hideLoader();

}


// ==========================================
// LOAD QUESTIONS FROM FIRESTORE
// ==========================================

async function loadQuestions() {

    try {

        showLoading();


        const snapshot =
            await getDocs(
                collection(db, "questions")
            );


        allQuestions = [];


        snapshot.forEach((doc) => {

            allQuestions.push({

                id: doc.id,

                ...doc.data()

            });

        });


        console.log(
            "Learning Questions Loaded:",
            allQuestions.length
        );


        if (
            allQuestions.length === 0
        ) {

            subjects = [];

            renderSubjects();

            return;

        }


        buildSubjects();


        renderSubjects();


    } catch (error) {

        console.error(
            "Learning Question Load Error:",
            error
        );


        subjects = [];


        renderSubjects();


        const grid =
            document.getElementById(
                "subjectGrid"
            );


        if (grid) {

            grid.innerHTML = `

                <div class="loading-card">

                    <div style="font-size:32px;">
                        ❌
                    </div>

                    <p>
                        Questions load ஆகவில்லை.
                    </p>

                    <small>
                        Please try again.
                    </small>

                </div>

            `;

        }

    }

}


// ==========================================
// BUILD SUBJECTS FROM QUESTIONS
// ==========================================

function buildSubjects() {

    const subjectMap =
        new Map();


    allQuestions.forEach(
        (question) => {

            const rawSubject =
                question.subject ||
                question.subjectId ||
                question.category ||
                question.subjectName;


            if (!rawSubject) return;


            const subjectValue =
                String(rawSubject)
                    .trim();


            if (!subjectValue) return;


            const normalizedId =
                normalizeSubjectId(
                    subjectValue
                );


            if (
                subjectMap.has(
                    normalizedId
                )
            ) {

                return;

            }


            const defaultSubject =
                defaultSubjects.find(
                    subject =>
                        normalizeSubjectId(
                            subject.id
                        ) ===
                        normalizedId
                );


            subjectMap.set(
                normalizedId,
                {

                    id:
                        normalizedId,

                    firestoreValue:
                        subjectValue,

                    name:
                        defaultSubject?.name ||
                        subjectValue,

                    icon:
                        defaultSubject?.icon ||
                        getSubjectIcon(
                            subjectValue
                        ),

                    description:
                        defaultSubject?.description ||
                        `${subjectValue} முக்கியமான கேள்விகள்`

                }
            );

        }
    );


    subjects =
        Array.from(
            subjectMap.values()
        );


    subjects.sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                "ta"
            )
    );


    console.log(
        "Learning Subjects:",
        subjects
    );

}


// ==========================================
// NORMALIZE SUBJECT ID
// ==========================================

function normalizeSubjectId(value) {

    return String(value)
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        )
        .replace(
            /[^a-z0-9\u0B80-\u0BFF-]/g,
            ""
        );

}


// ==========================================
// SUBJECT ICON
// ==========================================

function getSubjectIcon(subject) {

    const value =
        String(subject)
            .toLowerCase();


    if (
        value.includes("history") ||
        value.includes("வரலாறு")
    ) {

        return "🏛️";

    }


    if (
        value.includes("tamil") ||
        value.includes("தமிழ்")
    ) {

        return "📖";

    }


    if (
        value.includes("science") ||
        value.includes("அறிவியல்")
    ) {

        return "🔬";

    }


    if (
        value.includes("geography") ||
        value.includes("புவியியல்")
    ) {

        return "🌍";

    }


    if (
        value.includes("polity") ||
        value.includes("அரசியல்")
    ) {

        return "🇮🇳";

    }


    if (
        value.includes("economics") ||
        value.includes("பொருளாதாரம்")
    ) {

        return "💰";

    }


    if (
        value.includes("math") ||
        value.includes("கணிதம்")
    ) {

        return "➗";

    }


    if (
        value.includes("reasoning") ||
        value.includes("தர்க்கம்")
    ) {

        return "🧩";

    }


    if (
        value.includes("current") ||
        value.includes("நடப்பு")
    ) {

        return "📰";

    }


    return "📚";

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


    if (!grid) return;


    if (count) {

        count.textContent =
            `${filteredSubjects.length} Subjects`;

    }


    grid.innerHTML = "";


    if (
        filteredSubjects.length === 0
    ) {

        showNoResults();

        return;

    }


    hideNoResults();


    filteredSubjects.forEach(
        (subject) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "subject-card";


            card.innerHTML = `

                <span class="subject-arrow">
                    →
                </span>

                <div class="subject-icon">
                    ${escapeHTML(
                        subject.icon
                    )}
                </div>

                <div>

                    <h4>
                        ${escapeHTML(
                            subject.name
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            subject.description
                        )}
                    </p>

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


            grid.appendChild(card);

        }
    );

}


// ==========================================
// OPEN SUBJECT
// ==========================================

function openSubject(subject) {

    selectedSubject =
        subject;


    currentQuestion = 0;

    answerShown = false;


    subjectQuestions =
        allQuestions.filter(
            question => {

                const rawSubject =
                    question.subject ||
                    question.subjectId ||
                    question.category ||
                    question.subjectName;


                if (!rawSubject) {
                    return false;
                }


                return (
                    normalizeSubjectId(
                        rawSubject
                    ) ===
                    normalizeSubjectId(
                        subject.firestoreValue
                    )
                );

            }
        );


    console.log(
        "Selected Subject:",
        subject.name
    );


    console.log(
        "Questions:",
        subjectQuestions.length
    );


    const subjectIcon =
        document.getElementById(
            "selectedSubjectIcon"
        );


    const subjectName =
        document.getElementById(
            "selectedSubjectName"
        );


    if (subjectIcon) {

        subjectIcon.textContent =
            subject.icon;

    }


    if (subjectName) {

        subjectName.textContent =
            subject.name;

    }


    const count =
        document.getElementById(
            "questionCount"
        );


    if (count) {

        count.textContent =
            `${subjectQuestions.length} Questions`;

    }


    document.getElementById(
        "subjectSection"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "questionSection"
    ).classList.remove(
        "hidden"
    );


    if (
        subjectQuestions.length === 0
    ) {

        showNoQuestions();

    } else {

        showQuestion();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

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


    answerShown = false;


    const questionNumber =
        document.getElementById(
            "questionNumber"
        );


    const questionIndicator =
        document.getElementById(
            "questionIndicator"
        );


    if (questionNumber) {

        questionNumber.textContent =
            `Question ${currentQuestion + 1}`;

    }


    if (questionIndicator) {

        questionIndicator.textContent =
            `${currentQuestion + 1} / ${subjectQuestions.length}`;

    }


    const questionText =
        document.getElementById(
            "learningQuestion"
        );


    if (questionText) {

        questionText.innerHTML =
            formatLearningText(
                question.question ||
                question.questionText ||
                question.title ||
                "Question not available"
            );

    }


    renderOptions(
        question
    );


    hideAnswer();


    updateProgress();


    updateNavigation();


    const status =
        document.getElementById(
            "questionStatus"
        );


    if (status) {

        status.textContent =
            "📖 Learn";

    }

}


// ==========================================
// RENDER OPTIONS
// ==========================================

function renderOptions(question) {

    const container =
        document.getElementById(
            "learningOptions"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        !Array.isArray(
            question.options
        )
    ) {

        container.innerHTML = `

            <div class="loading-card">

                ❌ Options not available

            </div>

        `;

        return;

    }


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "learning-option";


            button.innerHTML = `

                <span class="option-letter">
                    ${String.fromCharCode(
                        65 + index
                    )}
                </span>

                <span class="option-text">
                    ${escapeHTML(
                        option
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    revealAnswer(
                        question,
                        index
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

        }
// ==========================================
// REVEAL ANSWER
// ==========================================

function revealAnswer(question, selectedIndex) {

    const correctIndex =
        getCorrectAnswerIndex(question);


    const buttons =
        document.querySelectorAll(
            ".learning-option"
        );


    buttons.forEach(
        (button, index) => {

            button.disabled = true;

            button.classList.remove(
                "correct",
                "wrong"
            );


            if (
                index === correctIndex
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                index === selectedIndex &&
                index !== correctIndex
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        }
    );


    answerShown = true;


    const correctAnswer =
        document.getElementById(
            "correctAnswer"
        );


    if (correctAnswer) {

        correctAnswer.textContent =
            getCorrectAnswerText(
                question,
                correctIndex
            );

    }


    const explanationBox =
        document.getElementById(
            "explanationBox"
        );


    const answerBox =
        document.getElementById(
            "answerBox"
        );


    if (answerBox) {

        answerBox.classList.remove(
            "hidden"
        );

    }


    if (explanationBox) {

        explanationBox.classList.remove(
            "hidden"
        );

    }


    const explanation =
        document.getElementById(
            "learningExplanation"
        );


    if (explanation) {

        explanation.innerHTML =
            formatLearningText(
                question.explanation ||
                question.answerExplanation ||
                question.description ||
                "இந்த கேள்விக்கான விளக்கம் Admin Panel-ல் இன்னும் சேர்க்கப்படவில்லை."
            );

    }


    const status =
        document.getElementById(
            "questionStatus"
        );


    if (status) {

        if (
            selectedIndex === correctIndex
        ) {

            status.textContent =
                "✅ Correct";

        } else {

            status.textContent =
                "❌ Wrong";

        }

    }

}


// ==========================================
// GET CORRECT ANSWER INDEX
// ==========================================

function getCorrectAnswerIndex(question) {

    const answer =
        question.answer ??
        question.correctAnswer ??
        question.correctOption ??
        question.correctIndex;


    if (
        typeof answer === "number"
    ) {

        return answer;

    }


    if (
        typeof answer === "string"
    ) {

        const value =
            answer.trim();


        // A / B / C / D

        if (
            /^[A-Da-d]$/.test(value)
        ) {

            return (
                value
                    .toUpperCase()
                    .charCodeAt(0) -
                65
            );

        }


        // Numeric answer

        if (
            !isNaN(
                Number(value)
            )
        ) {

            return Number(value);

        }


        // Answer text

        if (
            Array.isArray(
                question.options
            )
        ) {

            const found =
                question.options.findIndex(
                    option =>
                        String(option)
                            .trim()
                            .toLowerCase() ===
                        value.toLowerCase()
                );


            if (found !== -1) {

                return found;

            }

        }

    }


    return 0;

}


// ==========================================
// GET CORRECT ANSWER TEXT
// ==========================================

function getCorrectAnswerText(
    question,
    index
) {

    if (
        Array.isArray(
            question.options
        ) &&
        question.options[index] !== undefined
    ) {

        return (
            `${String.fromCharCode(
                65 + index
            )}. ${question.options[index]}`
        );

    }


    const answer =
        question.answer ??
        question.correctAnswer ??
        "Answer not available";


    return String(answer);

}


// ==========================================
// HIDE ANSWER
// ==========================================

function hideAnswer() {

    const answerBox =
        document.getElementById(
            "answerBox"
        );


    const explanationBox =
        document.getElementById(
            "explanationBox"
        );


    if (answerBox) {

        answerBox.classList.add(
            "hidden"
        );

    }


    if (explanationBox) {

        explanationBox.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// UPDATE PROGRESS
// ==========================================

function updateProgress() {

    if (
        !subjectQuestions.length
    ) return;


    const progress =
        (
            (currentQuestion + 1) /
            subjectQuestions.length
        ) * 100;


    const progressFill =
        document.getElementById(
            "learningProgressFill"
        );


    const progressText =
        document.getElementById(
            "learningProgressText"
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${Math.round(
                progress
            )}%`;

    }

}


// ==========================================
// UPDATE NAVIGATION
// ==========================================

function updateNavigation() {

    const previousBtn =
        document.getElementById(
            "previousQuestionBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextQuestionBtn"
        );


    if (!previousBtn || !nextBtn) {
        return;
    }


    previousBtn.disabled =
        currentQuestion === 0;


    if (
        currentQuestion ===
        subjectQuestions.length - 1
    ) {

        nextBtn.textContent =
            "Completed ✓";

        nextBtn.disabled = true;

    } else {

        nextBtn.textContent =
            "Next →";

        nextBtn.disabled = false;

    }

}


// ==========================================
// PREVIOUS QUESTION
// ==========================================

function previousQuestion() {

    if (
        currentQuestion <= 0
    ) return;


    currentQuestion--;

    showQuestion();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (
        currentQuestion >=
        subjectQuestions.length - 1
    ) {

        return;

    }


    currentQuestion++;

    showQuestion();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// NO QUESTIONS
// ==========================================

function showNoQuestions() {

    const questionCard =
        document.getElementById(
            "learningQuestionCard"
        );


    if (!questionCard) return;


    questionCard.innerHTML = `

        <div
            style="
                text-align:center;
                padding:45px 20px;
            "
        >

            <div
                style="
                    font-size:50px;
                    margin-bottom:15px;
                "
            >
                📚
            </div>

            <h3>
                Questions இல்லை
            </h3>

            <p>
                இந்த Subject-க்கு
                questions இன்னும்
                upload செய்யப்படவில்லை.
            </p>

        </div>

    `;


    const previousBtn =
        document.getElementById(
            "previousQuestionBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextQuestionBtn"
        );


    if (previousBtn) {

        previousBtn.disabled = true;

    }


    if (nextBtn) {

        nextBtn.disabled = true;

    }


    const count =
        document.getElementById(
            "questionCount"
        );


    if (count) {

        count.textContent =
            "0 Questions";

    }


    const indicator =
        document.getElementById(
            "questionIndicator"
        );


    if (indicator) {

        indicator.textContent =
            "0 / 0";

    }

}


// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const clearBtn =
        document.getElementById(
            "clearSearchBtn"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        () => {

            const value =
                input.value
                    .trim()
                    .toLowerCase();


            if (clearBtn) {

                clearBtn.style.display =
                    value
                        ? "block"
                        : "none";

            }


            const filtered =
                subjects.filter(
                    subject => {

                        return (

                            subject.name
                                .toLowerCase()
                                .includes(value)

                            ||

                            subject.description
                                .toLowerCase()
                                .includes(value)

                        );

                    }
                );


            renderSubjects(
                filtered
            );

        }
    );


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            () => {

                input.value = "";


                clearBtn.style.display =
                    "none";


                renderSubjects();

            }
        );

    }

}


// ==========================================
// BUTTON SETUP
// ==========================================

function setupButtons() {

    const backToSubjectsBtn =
        document.getElementById(
            "backToSubjectsBtn"
        );


    if (backToSubjectsBtn) {

        backToSubjectsBtn.addEventListener(
            "click",
            showSubjects
        );

    }


    const previousBtn =
        document.getElementById(
            "previousQuestionBtn"
        );


    if (previousBtn) {

        previousBtn.addEventListener(
            "click",
            previousQuestion
        );

    }


    const nextBtn =
        document.getElementById(
            "nextQuestionBtn"
        );


    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextQuestion
        );

    }


    const practiceBtn =
        document.getElementById(
            "startPracticeBtn"
        );


    if (practiceBtn) {

        practiceBtn.addEventListener(
            "click",
            startPractice
        );

    }


    const refreshBtn =
        document.getElementById(
            "refreshBtn"
        );


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            () => {

                location.reload();

            }
        );

    }

}


// ==========================================
// SHOW SUBJECTS
// ==========================================

function showSubjects() {

    selectedSubject = null;

    subjectQuestions = [];

    currentQuestion = 0;

    answerShown = false;


    document.getElementById(
        "subjectSection"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "questionSection"
    ).classList.add(
        "hidden"
    );


    renderSubjects();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// START PRACTICE
// ==========================================

function startPractice() {

    if (
        !selectedSubject
    ) {

        alert(
            "Please select a subject first."
        );

        return;

    }


    const subject =
        encodeURIComponent(
            selectedSubject.firestoreValue ||
            selectedSubject.name
        );


    /*
       Existing Practice page
       will receive subject.

       Example:
       practice.html?subject=History
    */


    window.location.href =
        `practice.html?subject=${subject}`;

}


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                const questionSection =
                    document.getElementById(
                        "questionSection"
                    );


                if (
                    questionSection &&
                    !questionSection.classList.contains(
                        "hidden"
                    )
                ) {

                    showSubjects();

                    return;

                }


                window.history.back();

            }
        );

    }


    const homeNav =
    // ==========================================
// HOME → DASHBOARD
// ==========================================

const homeNav = document.getElementById("homeNav");

if (homeNav) {

    homeNav.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

}


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


    const learningNav =
        document.getElementById(
            "learningNav"
        );


    if (learningNav) {

        learningNav.addEventListener(
            "click",
            showSubjects
        );

    }


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
// LOADING
// ==========================================

function showLoading() {

    const grid =
        document.getElementById(
            "subjectGrid"
        );


    if (!grid) return;


    grid.innerHTML = `

        <div class="loading-card">

            <div class="mini-spinner"></div>

            <p>
                Loading subjects...
            </p>

        </div>

    `;

}


// ==========================================
// HIDE LOADER
// ==========================================

function hideLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (!loader) return;


    setTimeout(
        () => {

            loader.classList.add(
                "hidden"
            );

        },
        250
    );

}


// ==========================================
// NO RESULTS
// ==========================================

function showNoResults() {

    const element =
        document.getElementById(
            "noResults"
        );


    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


function hideNoResults() {

    const element =
        document.getElementById(
            "noResults"
        );


    if (element) {

        element.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// FORMAT TEXT
// ==========================================

function formatLearningText(text) {

    if (!text) return "";


    const safeText =
        escapeHTML(
            String(text)
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
// ESCAPE HTML
// ==========================================

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


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "Learning Zone Error:",
            event.error ||
            event.message
        );

    }
);


// ==========================================
// FINISHED
// ==========================================

console.log(
    "📚 G THE GENIUS Learning Zone Ready"
);

console.log(
    "🔥 Using existing Firestore questions collection"
);
