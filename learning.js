// ==========================================
// G THE GENIUS
// LEARNING ZONE
// FINAL VERSION
// ==========================================
// Existing questions collection பயன்படுத்துகிறது
// Flow:
// Subject → Topic → Questions → Answer → Explanation
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
let topics = [];
let lessons = [];

let selectedSubject = null;
let selectedTopic = null;

let currentLesson = 0;

let searchText = "";


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


    setupNavigation();

    setupButtons();

    setupSearch();


    await loadQuestions();


    hideLoader();


}


// ==========================================
// LOAD QUESTIONS
// ==========================================

async function loadQuestions() {

    try {

        showSubjectLoading();


        console.log(
            "⏳ Loading questions from Firestore..."
        );


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

                allQuestions.push({

                    id: doc.id,

                    ...doc.data()

                });

            }
        );


        console.log(
            "✅ Questions Loaded:",
            allQuestions.length
        );


        // --------------------------------------
        // NO QUESTIONS
        // --------------------------------------

        if (
            allQuestions.length === 0
        ) {

            subjects = [];

            renderSubjects();

            return;

        }


        // --------------------------------------
        // CREATE SUBJECTS
        // --------------------------------------

        buildSubjects();


        renderSubjects();


    } catch (error) {

        console.error(
            "❌ Firestore Learning Error:",
            error
        );


        showLoadError();

    }

}


// ==========================================
// BUILD SUBJECTS
// ==========================================

function buildSubjects() {

    const subjectMap =
        new Map();


    allQuestions.forEach(
        (question) => {


            const rawSubject =
                question.subject ??
                question.subjectId ??
                question.subjectName ??
                question.category ??
                "";


            const subject =
                String(rawSubject)
                    .trim();


            if (!subject) return;


            const key =
                subject.toLowerCase();


            if (
                !subjectMap.has(key)
            ) {


                subjectMap.set(
                    key,
                    {

                        id: subject,

                        name:
                            getSubjectName(
                                subject
                            ),

                        icon:
                            getSubjectIcon(
                                subject
                            ),

                        description:
                            getSubjectDescription(
                                subject
                            )

                    }
                );

            }

        }
    );


    subjects =
        Array.from(
            subjectMap.values()
        );


    // Alphabetical order

    subjects.sort(
        (a, b) =>
            a.name.localeCompare(
                b.name
            )
    );


    console.log(
        "📚 Subjects Found:",
        subjects
    );

}


// ==========================================
// SUBJECT NAME
// ==========================================

function getSubjectName(
    subject
) {

    const value =
        String(subject)
            .trim();


    const lower =
        value.toLowerCase();


    const names = {

        tamil:
            "தமிழ்",

        history:
            "History",

        geography:
            "Geography",

        polity:
            "Indian Polity",

        economics:
            "Economics",

        science:
            "General Science",

        gk:
            "General Knowledge",

        "general knowledge":
            "General Knowledge",

        "current affairs":
            "Current Affairs",

        "current-affairs":
            "Current Affairs",

        maths:
            "Maths",

        math:
            "Maths",

        reasoning:
            "Reasoning"

    };


    if (
        names[lower]
    ) {

        return names[lower];

    }


    return value;

}


// ==========================================
// SUBJECT ICON
// ==========================================

function getSubjectIcon(
    subject
) {

    const value =
        String(subject)
            .toLowerCase();


    if (
        value.includes("tamil") ||
        value.includes("தமிழ்")
    ) {

        return "📖";

    }


    if (
        value.includes("current")
    ) {

        return "📰";

    }


    if (
        value.includes("science") ||
        value.includes("அறிவியல்")
    ) {

        return "🔬";

    }


    if (
        value.includes("history") ||
        value.includes("வரலாறு")
    ) {

        return "🏛️";

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
        value.includes("econom")
    ) {

        return "💰";

    }


    if (
        value.includes("math")
    ) {

        return "➗";

    }


    if (
        value.includes("reason")
    ) {

        return "🧩";

    }


    if (
        value.includes("gk") ||
        value.includes("general knowledge")
    ) {

        return "🧠";

    }


    return "📚";

}


// ==========================================
// SUBJECT DESCRIPTION
// ==========================================

function getSubjectDescription(
    subject
) {

    const value =
        String(subject)
            .toLowerCase();


    if (
        value.includes("tamil")
    ) {

        return "தமிழ் இலக்கணம் & இலக்கியம்";

    }


    if (
        value.includes("history")
    ) {

        return "இந்திய & தமிழக வரலாறு";

    }


    if (
        value.includes("geography")
    ) {

        return "இந்திய & உலக புவியியல்";

    }


    if (
        value.includes("science")
    ) {

        return "அறிவியல் முக்கிய கேள்விகள்";

    }


    if (
        value.includes("current")
    ) {

        return "நடப்பு நிகழ்வுகள்";

    }


    if (
        value.includes("math")
    ) {

        return "கணித முக்கிய கேள்விகள்";

    }


    if (
        value.includes("reason")
    ) {

        return "தர்க்க அறிவு";

    }


    return "முக்கியமான தேர்வு கேள்விகள்";

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

        grid.innerHTML = `

            <div class="loading-card">

                <div
                    style="
                        font-size:42px;
                        margin-bottom:10px;
                    "
                >
                    📚
                </div>

                <p>
                    Questions இல்லை.
                </p>

                <small>
                    Admin Panel-ல் Subject உடன்
                    Questions Upload செய்யவும்.
                </small>

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


    selectedTopic = null;


    currentLesson = 0;


    setText(
        "selectedSubjectTitle",
        subject.name
    );


    setText(
        "selectedSubjectName",
        subject.name
    );


    setText(
        "selectedSubjectIcon",
        subject.icon
    );


    setText(
        "learningSubjectName",
        subject.name
    );


    loadTopics();


    showSection(
        "topic"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD TOPICS
// ==========================================

function loadTopics() {

    if (
        !selectedSubject
    ) return;


    const subjectKey =
        normalize(
            selectedSubject.id
        );


    const topicMap =
        new Map();


    allQuestions.forEach(
        (question) => {


            const questionSubject =
                getQuestionSubject(
                    question
                );


            if (
                normalize(
                    questionSubject
                ) !==
                subjectKey
            ) {

                return;

            }


            const rawTopic =
                getQuestionTopic(
                    question
                );


            const topic =
                String(
                    rawTopic || "General"
                )
                .trim();


            const key =
                topic.toLowerCase();


            if (
                !topicMap.has(key)
            ) {

                topicMap.set(
                    key,
                    {

                        id: topic,

                        name: topic,

                        description:
                            "Important exam questions"

                    }
                );

            }

        }
    );


    topics =
        Array.from(
            topicMap.values()
        );


    topics.sort(
        (a, b) =>
            a.name.localeCompare(
                b.name
            )
    );


    console.log(
        "📚 Topics:",
        topics
    );


    renderTopics();

}


// ==========================================
// GET QUESTION SUBJECT
// ==========================================

function getQuestionSubject(
    question
) {

    return (

        question.subject ??

        question.subjectId ??

        question.subjectName ??

        question.category ??

        ""

    );

}


// ==========================================
// GET QUESTION TOPIC
// ==========================================

function getQuestionTopic(
    question
) {

    return (

        question.topic ??

        question.topicId ??

        question.topicName ??

        question.topicTitle ??

        "General"

    );

}


// ==========================================
// NORMALIZE
// ==========================================

function normalize(
    value
) {

    return String(
        value ?? ""
    )
    .trim()
    .toLowerCase();

}


// ==========================================
// SET TEXT
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
// SHOW SECTION
// ==========================================

function showSection(
    section
) {

    const subjectSection =
        document.getElementById(
            "subjectSection"
        );


    const topicSection =
        document.getElementById(
            "topicSection"
        );


    const learningSection =
        document.getElementById(
            "learningSection"
        );


    if (subjectSection) {

        subjectSection.classList.toggle(
            "hidden",
            section !== "subject"
        );

    }


    if (topicSection) {

        topicSection.classList.toggle(
            "hidden",
            section !== "topic"
        );

    }


    if (learningSection) {

        learningSection.classList.toggle(
            "hidden",
            section !== "learning"
        );

    }

            }

// ==========================================
// RENDER TOPICS
// ==========================================

function renderTopics(
    filteredTopics = topics
) {

    const grid =
        document.getElementById(
            "topicGrid"
        );


    const count =
        document.getElementById(
            "topicCount"
        );


    if (!grid) return;


    if (count) {

        count.textContent =
            `${filteredTopics.length} Topics`;

    }


    grid.innerHTML = "";


    if (
        filteredTopics.length === 0
    ) {

        grid.innerHTML = `

            <div class="loading-card">

                <div
                    style="
                        font-size:42px;
                        margin-bottom:10px;
                    "
                >
                    📚
                </div>

                <p>
                    இந்த Subject-க்கு
                    Topics இல்லை.
                </p>

                <small>
                    Admin Panel-ல் Topic உடன்
                    Questions Upload செய்யவும்.
                </small>

            </div>

        `;

        return;

    }


    filteredTopics.forEach(
        (topic, index) => {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "topic-card";


            card.innerHTML = `

                <div class="topic-number">
                    ${index + 1}
                </div>

                <div class="topic-info">

                    <h4>
                        ${escapeHTML(
                            topic.name
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            topic.description
                        )}
                    </p>

                </div>

                <div class="topic-arrow">
                    →
                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    openTopic(
                        topic
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
// OPEN TOPIC
// ==========================================

function openTopic(
    topic
) {

    selectedTopic =
        topic;


    currentLesson = 0;


    setText(
        "learningTopicName",
        topic.name
    );


    loadLessons();


    showSection(
        "learning"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD LESSONS
// ==========================================
// Existing QUESTIONS-ஐ Learning content ஆக பயன்படுத்துகிறது
// ==========================================

function loadLessons() {

    if (
        !selectedSubject ||
        !selectedTopic
    ) {

        return;

    }


    const subjectKey =
        normalize(
            selectedSubject.id
        );


    const topicKey =
        normalize(
            selectedTopic.id
        );


    lessons =
        allQuestions.filter(
            (question) => {


                const questionSubject =
                    normalize(
                        getQuestionSubject(
                            question
                        )
                    );


                const questionTopic =
                    normalize(
                        getQuestionTopic(
                            question
                        )
                    );


                return (

                    questionSubject ===
                    subjectKey

                    &&

                    questionTopic ===
                    topicKey

                );

            }
        );


    console.log(
        "📖 Learning Questions:",
        lessons.length
    );


    // --------------------------------------
    // SORT QUESTIONS
    // --------------------------------------

    lessons.sort(
        (a, b) => {


            const orderA =
                Number(
                    a.order ??
                    a.questionNumber ??
                    a.questionNo ??
                    0
                );


            const orderB =
                Number(
                    b.order ??
                    b.questionNumber ??
                    b.questionNo ??
                    0
                );


            return (
                orderA - orderB
            );

        }
    );


    // --------------------------------------
    // SHOW FIRST QUESTION
    // --------------------------------------

    showLesson();

}


// ==========================================
// SHOW LESSON
// ==========================================

function showLesson() {

    if (
        !lessons.length
    ) {

        showEmptyLesson();

        return;

    }


    const lesson =
        lessons[
            currentLesson
        ];


    // ======================================
    // QUESTION
    // ======================================

    const questionText =
        lesson.question ??
        lesson.questionText ??
        lesson.title ??
        "Question not available";


    setHTML(
        "learningTitle",
        questionText
    );


    // ======================================
    // QUESTION NUMBER
    // ======================================

    setText(
        "learningNumber",
        `Question ${
            currentLesson + 1
        } / ${
            lessons.length
        }`
    );


    setText(
        "lessonIndicator",
        `${
            currentLesson + 1
        } / ${
            lessons.length
        }`
    );


    // ======================================
    // KEY POINT
    // ======================================

    const answer =
        getCorrectAnswer(
            lesson
        );


    setText(
        "learningKeyPoint",
        answer
    );


    // ======================================
    // EXPLANATION
    // ======================================

    const explanation =
        lesson.explanation ??
        lesson.Explanation ??
        lesson.explain ??
        lesson.description ??
        "";


    setHTML(
        "learningExplanation",
        formatLearningText(
            explanation ||
            "இந்த கேள்விக்கான explanation Admin Panel-ல் சேர்க்கப்படவில்லை."
        )
    );


    // ======================================
    // IMPORTANT
    // ======================================

    const important =
        lesson.important ??
        lesson.examPoint ??
        lesson.examImportant ??
        lesson.importantPoint ??
        "இந்த கேள்வி தேர்வுக்கு முக்கியமானது.";


    setText(
        "learningImportant",
        important
    );


    // ======================================
    // REMEMBER
    // ======================================

    const remember =
        lesson.remember ??
        lesson.rememberThis ??
        lesson.memoryTip ??
        lesson.tip ??
        "இந்த answer-ஐ revision செய்யுங்கள்.";


    setText(
        "learningRemember",
        remember
    );


    // ======================================
    // EXAMPLE / OPTIONS
    // ======================================

    const example =
        lesson.example ??
        lesson.exampleQuestion ??
        buildOptionsText(
            lesson
        );


    setText(
        "learningExample",
        example
    );


    // ======================================
    // PROGRESS
    // ======================================

    const progress =
        (
            (
                currentLesson + 1
            )
            /
            lessons.length
        )
        *
        100;


    setText(
        "learningProgressText",
        `${Math.round(progress)}%`
    );


    const progressFill =
        document.getElementById(
            "learningProgressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }


    updateLessonButtons();


    updateQuestionOptions(
        lesson
    );

}


// ==========================================
// GET CORRECT ANSWER
// ==========================================

function getCorrectAnswer(
    question
) {

    // --------------------------------------
    // Direct answer text
    // --------------------------------------

    if (
        question.correctAnswer
    ) {

        return String(
            question.correctAnswer
        );

    }


    if (
        question.answerText
    ) {

        return String(
            question.answerText
        );

    }


    // --------------------------------------
    // Numeric answer index
    // --------------------------------------

    if (
        question.options &&
        Array.isArray(
            question.options
        ) &&
        question.answer !== undefined
    ) {

        const index =
            Number(
                question.answer
            );


        if (
            question.options[index] !==
            undefined
        ) {

            return String(
                question.options[index]
            );

        }

    }


    // --------------------------------------
    // String answer
    // --------------------------------------

    if (
        question.answer !== undefined
    ) {

        return String(
            question.answer
        );

    }


    return "Answer not available";

}


// ==========================================
// BUILD OPTIONS TEXT
// ==========================================

function buildOptionsText(
    question
) {

    if (
        !question.options ||
        !Array.isArray(
            question.options
        )
    ) {

        return "இந்த கேள்வியை நினைவில் வைத்துக்கொள்ளுங்கள்.";

    }


    return question.options
        .map(
            (option, index) => {

                return `${
                    String.fromCharCode(
                        65 + index
                    )
                }. ${option}`;

            }
        )
        .join("   |   ");

}


// ==========================================
// SHOW OPTIONS
// ==========================================

function updateQuestionOptions(
    question
) {

    const container =
        document.getElementById(
            "learningOptions"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !question.options ||
        !Array.isArray(
            question.options
        )
    ) {

        return;

    }


    const correctIndex =
        Number(
            question.answer
        );


    question.options.forEach(
        (option, index) => {


            const optionDiv =
                document.createElement(
                    "div"
                );


            optionDiv.className =
                "learning-option";


            if (
                index === correctIndex
            ) {

                optionDiv.classList.add(
                    "correct"
                );

            }


            optionDiv.innerHTML = `

                <span class="learning-option-letter">

                    ${
                        String.fromCharCode(
                            65 + index
                        )
                    }

                </span>

                <span class="learning-option-text">

                    ${
                        escapeHTML(
                            option
                        )
                    }

                </span>

                ${
                    index === correctIndex
                    ? `
                        <span class="learning-correct-mark">
                            ✓
                        </span>
                    `
                    : ""
                }

            `;


            container.appendChild(
                optionDiv
            );

        }
    );

}


// ==========================================
// EMPTY LESSON
// ==========================================

function showEmptyLesson() {

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


    setHTML(
        "learningTitle",
        "📚 Learning Content இல்லை"
    );


    setText(
        "learningKeyPoint",
        "இந்த Topic-க்கு Questions இல்லை."
    );


    setHTML(
        "learningExplanation",
        `
            <p>
                Admin Panel-ல் இந்த Subject மற்றும்
                Topic-க்கு Questions Upload செய்யவும்.
            </p>
        `
    );


    setText(
        "learningImportant",
        "Topic-க்கு questions சேர்த்த பிறகு இங்கே காட்டப்படும்."
    );


    setText(
        "learningRemember",
        "Admin Panel → Questions → Subject + Topic"
    );


    setText(
        "learningExample",
        "Questions upload செய்தவுடன் Learning Zone-ல் automatically வரும்."
    );


    const container =
        document.getElementById(
            "learningOptions"
        );


    if (container) {

        container.innerHTML = "";

    }


    updateLessonButtons();

}


// ==========================================
// FORMAT TEXT
// ==========================================

function formatLearningText(
    text
) {

    if (!text) {

        return "";

    }


    const safeText =
        escapeHTML(
            String(text)
        );


    return safeText
        .replace(
            /\n\n/g,
            "<br><br>"
        )
        .replace(
            /\n/g,
            "<br>"
        );

}


// ==========================================
// SET HTML
// ==========================================

function setHTML(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.innerHTML =
            value ?? "";

    }

}


// ==========================================
// LESSON BUTTONS
// ==========================================

function updateLessonButtons() {

    const previous =
        document.getElementById(
            "previousLessonBtn"
        );


    const next =
        document.getElementById(
            "nextLessonBtn"
        );


    if (!previous || !next) {

        return;

    }


    previous.disabled =
        currentLesson <= 0;


    next.disabled =
        currentLesson >=
        lessons.length - 1;


    if (
        lessons.length > 0 &&
        currentLesson ===
        lessons.length - 1
    ) {

        next.textContent =
            "Completed ✓";

    } else {

        next.textContent =
            "Next →";

    }

}


// ==========================================
// PREVIOUS LESSON
// ==========================================

function previousLesson() {

    if (
        currentLesson <= 0
    ) {

        return;

    }


    currentLesson--;


    showLesson();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// NEXT LESSON
// ==========================================

function nextLesson() {

    if (
        currentLesson >=
        lessons.length - 1
    ) {

        return;

    }


    currentLesson++;


    showLesson();


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


    const clearBtn =
        document.getElementById(
            "clearSearchBtn"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        () => {


            searchText =
                input.value
                    .trim()
                    .toLowerCase();


            if (clearBtn) {

                clearBtn.style.display =
                    searchText
                    ? "block"
                    : "none";

            }


            performSearch();

        }
    );


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            () => {


                input.value =
                    "";


                searchText =
                    "";


                clearBtn.style.display =
                    "none";


                performSearch();

            }
        );

    }

}


// ==========================================
// SEARCH
// ==========================================

function performSearch() {

    if (
        !searchText
    ) {

        if (
            isSectionVisible(
                "subjectSection"
            )
        ) {

            renderSubjects();

        }


        else if (
            isSectionVisible(
                "topicSection"
            )
        ) {

            renderTopics();

        }


        return;

    }


    // --------------------------------------
    // SUBJECT SEARCH
    // --------------------------------------

    if (
        isSectionVisible(
            "subjectSection"
        )
    ) {

        const filtered =
            subjects.filter(
                (subject) => {


                    return (

                        normalize(
                            subject.name
                        )
                        .includes(
                            searchText
                        )

                        ||

                        normalize(
                            subject.description
                        )
                        .includes(
                            searchText
                        )

                    );

                }
            );


        renderSubjects(
            filtered
        );


        return;

    }


    // --------------------------------------
    // TOPIC SEARCH
    // --------------------------------------

    if (
        isSectionVisible(
            "topicSection"
        )
    ) {

        const filtered =
            topics.filter(
                (topic) => {


                    return (

                        normalize(
                            topic.name
                        )
                        .includes(
                            searchText
                        )

                        ||

                        normalize(
                            topic.description
                        )
                        .includes(
                            searchText
                        )

                    );

                }
            );


        renderTopics(
            filtered
        );

    }

}


// ==========================================
// SECTION VISIBLE
// ==========================================

function isSectionVisible(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return false;

    }


    return !element.classList.contains(
        "hidden"
    );

            }

// ==========================================
// BUTTON SETUP
// ==========================================

function setupButtons() {

    // --------------------------------------
    // PREVIOUS LESSON
    // --------------------------------------

    const previousLessonBtn =
        document.getElementById(
            "previousLessonBtn"
        );


    if (previousLessonBtn) {

        previousLessonBtn.addEventListener(
            "click",
            previousLesson
        );

    }


    // --------------------------------------
    // NEXT LESSON
    // --------------------------------------

    const nextLessonBtn =
        document.getElementById(
            "nextLessonBtn"
        );


    if (nextLessonBtn) {

        nextLessonBtn.addEventListener(
            "click",
            nextLesson
        );

    }


    // --------------------------------------
    // BACK TO SUBJECTS
    // --------------------------------------

    const backToSubjectsBtn =
        document.getElementById(
            "backToSubjectsBtn"
        );


    if (backToSubjectsBtn) {

        backToSubjectsBtn.addEventListener(
            "click",
            () => {

                showSubjects();

            }
        );

    }


    // --------------------------------------
    // BACK TO TOPICS
    // --------------------------------------

    const backToTopicsBtn =
        document.getElementById(
            "backToTopicsBtn"
        );


    if (backToTopicsBtn) {

        backToTopicsBtn.addEventListener(
            "click",
            () => {

                showTopics();

            }
        );

    }


    // --------------------------------------
    // REFRESH
    // --------------------------------------

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


    // --------------------------------------
    // QUICK TEST
    // --------------------------------------

    const quickTestBtn =
        document.getElementById(
            "startQuickTestBtn"
        );


    if (quickTestBtn) {

        quickTestBtn.addEventListener(
            "click",
            startQuickTest
        );

    }

}


// ==========================================
// SHOW SUBJECTS
// ==========================================

function showSubjects() {

    selectedSubject = null;

    selectedTopic = null;

    topics = [];

    lessons = [];

    currentLesson = 0;


    showSection(
        "subject"
    );


    renderSubjects();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// SHOW TOPICS
// ==========================================

function showTopics() {

    selectedTopic = null;

    lessons = [];

    currentLesson = 0;


    if (
        selectedSubject
    ) {

        loadTopics();

    }


    showSection(
        "topic"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// QUICK TEST
// ==========================================

function startQuickTest() {

    if (
        !selectedSubject ||
        !selectedTopic
    ) {

        alert(
            "முதலில் ஒரு Topic-ஐ தேர்வு செய்யுங்கள்."
        );

        return;

    }


    const subject =
        encodeURIComponent(
            selectedSubject.id
        );


    const topic =
        encodeURIComponent(
            selectedTopic.id
        );


    // --------------------------------------
    // Existing Practice Test
    // --------------------------------------

    window.location.href =
        `practice.html?subject=${subject}&topic=${topic}`;

}


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

    // --------------------------------------
    // BACK BUTTON
    // --------------------------------------

    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {


                // Learning → Topics

                if (
                    isSectionVisible(
                        "learningSection"
                    )
                ) {

                    showTopics();

                    return;

                }


                // Topics → Subjects

                if (
                    isSectionVisible(
                        "topicSection"
                    )
                ) {

                    showSubjects();

                    return;

                }


                // Subjects → Dashboard

                window.location.href =
                    "index.html";

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

                // Dashboard page

                window.location.href =
                    "index.html";

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
// LOADING
// ==========================================

function showSubjectLoading() {

    const grid =
        document.getElementById(
            "subjectGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = `

        <div
            class="loading-card"
            style="
                width:100%;
                text-align:center;
                padding:35px 20px;
            "
        >

            <div
                class="mini-spinner"
                style="
                    margin:auto;
                    margin-bottom:15px;
                "
            ></div>

            <p>
                📚 Loading Questions...
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
// LOAD ERROR
// ==========================================

function showLoadError() {

    const grid =
        document.getElementById(
            "subjectGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = `

        <div
            class="loading-card"
            style="
                width:100%;
                text-align:center;
                padding:35px 20px;
            "
        >

            <div
                style="
                    font-size:45px;
                    margin-bottom:10px;
                "
            >
                ⚠️
            </div>

            <h3>
                Learning Load Failed
            </h3>

            <p>
                Questions database-ஐ
                load செய்ய முடியவில்லை.
            </p>

            <button
                type="button"
                onclick="location.reload()"
                style="
                    margin-top:15px;
                    padding:12px 22px;
                    border:none;
                    border-radius:12px;
                    cursor:pointer;
                "
            >
                🔄 Try Again
            </button>

        </div>

    `;

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
// GLOBAL ERROR HANDLER
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
// PROMISE ERROR
// ==========================================

window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.error(
            "❌ Learning Promise Error:",
            event.reason
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
    "🔥 Using existing questions collection"
);

console.log(
    "🎯 Subject → Topic → Question → Answer"
);
