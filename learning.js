// ==========================================
// G THE GENIUS
// LEARNING ZONE - FINAL VERSION
// ==========================================
// Existing Firestore questions collection
// Subject → Topic → Question → Answer → Explanation
// No separate "learning" collection required
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
// DEFAULT SUBJECT DETAILS
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

    console.log(
        "📚 Initializing G THE GENIUS Learning Zone..."
    );

    setupNavigation();

    setupSearch();

    setupButtons();

    await loadQuestions();

    hideLoader();

}


// ==========================================
// LOAD QUESTIONS FROM FIREBASE
// ==========================================

async function loadQuestions() {

    try {

        showSubjectLoading();

        console.log(
            "📥 Loading questions from Firestore..."
        );

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
            "✅ Questions Loaded:",
            allQuestions.length
        );


        if (
            allQuestions.length === 0
        ) {

            console.warn(
                "⚠️ No questions found in questions collection"
            );

            subjects =
                [...defaultSubjects];

            renderSubjects();

            return;

        }


        // Build subjects
        buildSubjectsFromQuestions();


        // Show subjects
        renderSubjects();


    } catch (error) {

        console.error(
            "❌ Learning Question Load Error:",
            error
        );


        // Firebase error fallback
        subjects =
            [...defaultSubjects];


        renderSubjects();

    }

}


// ==========================================
// BUILD SUBJECTS FROM QUESTIONS
// ==========================================

function buildSubjectsFromQuestions() {

    const subjectMap =
        new Map();


    allQuestions.forEach(
        (item) => {

            const rawSubject =
                item.subject ||
                item.subjectName ||
                item.category;


            if (!rawSubject) return;


            const subjectName =
                String(rawSubject).trim();


            if (!subjectName) return;


            const subjectId =
                normalizeId(
                    subjectName
                );


            if (
                !subjectMap.has(subjectId)
            ) {

                const defaultSubject =
                    findDefaultSubject(
                        subjectId,
                        subjectName
                    );


                subjectMap.set(
                    subjectId,
                    {

                        id:
                            subjectId,

                        name:
                            defaultSubject
                                ?.name ||
                            subjectName,

                        icon:
                            defaultSubject
                                ?.icon ||
                            "📚",

                        description:
                            defaultSubject
                                ?.description ||
                            "Important exam questions"

                    }
                );

            }

        }
    );


    subjects =
        Array.from(
            subjectMap.values()
        );


    // Sort alphabetically
    subjects.sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                "ta"
            )
    );


    // Safety fallback
    if (
        subjects.length === 0
    ) {

        subjects =
            [...defaultSubjects];

    }


    console.log(
        "📚 Subjects:",
        subjects
    );

}


// ==========================================
// FIND DEFAULT SUBJECT
// ==========================================

function findDefaultSubject(
    subjectId,
    subjectName
) {

    return defaultSubjects.find(
        (subject) => {

            return (

                subject.id ===
                subjectId

                ||

                normalizeId(
                    subject.name
                ) ===
                subjectId

                ||

                subject.name
                    .toLowerCase() ===
                subjectName
                    .toLowerCase()

            );

        }
    );

}


// ==========================================
// NORMALIZE ID
// ==========================================

function normalizeId(value) {

    if (!value) return "";


    return String(value)
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9\u0B80-\u0BFF]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

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
                            subject.description || ""
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


    selectedTopic =
        null;


    currentLesson =
        0;


    const title =
        document.getElementById(
            "selectedSubjectTitle"
        );

    if (title) {

        title.textContent =
            subject.name;

    }


    const name =
        document.getElementById(
            "selectedSubjectName"
        );

    if (name) {

        name.textContent =
            subject.name;

    }


    const icon =
        document.getElementById(
            "selectedSubjectIcon"
        );

    if (icon) {

        icon.textContent =
            subject.icon;

    }


    const learningSubjectName =
        document.getElementById(
            "learningSubjectName"
        );

    if (learningSubjectName) {

        learningSubjectName.textContent =
            subject.name;

    }


    loadTopics();


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

        subjectSection.classList.add(
            "hidden"
        );

    }


    if (topicSection) {

        topicSection.classList.remove(
            "hidden"
        );

    }


    if (learningSection) {

        learningSection.classList.add(
            "hidden"
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD TOPICS FROM QUESTIONS
// ==========================================

function loadTopics() {

    if (!selectedSubject) return;


    const subjectId =
        selectedSubject.id;


    const topicMap =
        new Map();


    allQuestions.forEach(
        (item) => {

            const rawSubject =
                item.subject ||
                item.subjectName ||
                item.category;


            if (!rawSubject) return;


            const itemSubjectId =
                normalizeId(
                    rawSubject
                );


            if (
                itemSubjectId !==
                subjectId
            ) {

                return;

            }


            const rawTopic =
                item.topic ||
                item.topicId ||
                item.topicName ||
                item.topicTitle;


            if (!rawTopic) return;


            const topicName =
                String(
                    rawTopic
                ).trim();


            if (!topicName) return;


            const topicId =
                normalizeId(
                    topicName
                );


            if (
                !topicMap.has(topicId)
            ) {

                topicMap.set(
                    topicId,
                    {

                        id:
                            topicId,

                        name:
                            topicName,

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
                b.name,
                "ta"
            )
    );


    console.log(
        "📖 Topics:",
        topics
    );


    renderTopics();

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
                        font-size:32px;
                        margin-bottom:10px;
                    "
                >
                    📚
                </div>

                <p>
                    இந்த Subject-க்கு
                    Topics இன்னும்
                    சேர்க்கப்படவில்லை.
                </p>

                <small>
                    Admin Panel → Question Upload
                    மூலம் Subject + Topic சேர்க்கவும்.
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


    currentLesson =
        0;


    const topicName =
        document.getElementById(
            "learningTopicName"
        );


    if (topicName) {

        topicName.textContent =
            topic.name;

    }


    loadLessons();


    document.getElementById(
        "subjectSection"
    )?.classList.add(
        "hidden"
    );


    document.getElementById(
        "topicSection"
    )?.classList.add(
        "hidden"
    );


    document.getElementById(
        "learningSection"
    )?.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD LESSONS
// ==========================================

function loadLessons() {

    if (
        !selectedSubject ||
        !selectedTopic
    ) {

        return;

    }


    const subjectId =
        selectedSubject.id;


    const topicId =
        selectedTopic.id;


    lessons =
        allQuestions.filter(
            (item) => {

                const rawSubject =
                    item.subject ||
                    item.subjectName ||
                    item.category;


                const rawTopic =
                    item.topic ||
                    item.topicId ||
                    item.topicName ||
                    item.topicTitle;


                if (
                    !rawSubject ||
                    !rawTopic
                ) {

                    return false;

                }


                const itemSubjectId =
                    normalizeId(
                        rawSubject
                    );


                const itemTopicId =
                    normalizeId(
                        rawTopic
                    );


                return (

                    itemSubjectId ===
                    subjectId

                    &&

                    itemTopicId ===
                    topicId

                );

            }
        );


    console.log(
        "📝 Learning Questions:",
        lessons.length
    );


    // Sort by order if available
    lessons.sort(
        (a, b) => {

            const orderA =
                Number(
                    a.order ||
                    a.questionNumber ||
                    a.lessonNumber ||
                    0
                );


            const orderB =
                Number(
                    b.order ||
                    b.questionNumber ||
                    b.lessonNumber ||
                    0
                );


            return orderA - orderB;

        }
    );


    if (
        lessons.length === 0
    ) {

        lessons = [

            {

                question:
                    "இந்த topic-ல் கேள்விகள் இல்லை.",

                answer:
                    "Admin Panel-ல் இந்த Topic-க்கு questions upload செய்யவும்.",

                explanation:
                    "Question Upload செய்யும் போது Subject மற்றும் Topic சரியாக select செய்யப்பட்டுள்ளதா என்பதை உறுதி செய்யவும்."

            }

        ];

    }


    showLesson();

}


// ==========================================
// SHOW LESSON
// ==========================================

function showLesson() {

    if (
        !lessons.length
    ) {

        return;

    }


    const lesson =
        lessons[currentLesson];


    // --------------------------------------
    // QUESTION
    // --------------------------------------

    const question =
        lesson.question ||
        lesson.questionText ||
        lesson.title ||
        "Question not available";


    const title =
        document.getElementById(
            "learningTitle"
        );


    if (title) {

        title.textContent =
            question;

    }


    // --------------------------------------
    // KEY POINT
    // --------------------------------------

    const keyPoint =
        document.getElementById(
            "learningKeyPoint"
        );


    if (keyPoint) {

        keyPoint.textContent =
            getCorrectAnswerText(
                lesson
            );

    }


    // --------------------------------------
    // EXPLANATION
    // --------------------------------------

    const explanation =
        document.getElementById(
            "learningExplanation"
        );


    if (explanation) {

        explanation.innerHTML =
            formatLearningText(

                lesson.explanation ||
                lesson.explain ||
                lesson.description ||
                "இந்த கேள்விக்கான explanation இன்னும் சேர்க்கப்படவில்லை."

            );

    }


    // --------------------------------------
    // IMPORTANT
    // --------------------------------------

    const important =
        document.getElementById(
            "learningImportant"
        );


    if (important) {

        important.textContent =
            lesson.important ||
            lesson.examPoint ||
            "⭐ இந்த கேள்வி தேர்வுக்கு முக்கியமானது.";

    }


    // --------------------------------------
    // REMEMBER
    // --------------------------------------

    const remember =
        document.getElementById(
            "learningRemember"
        );


    if (remember) {

        remember.textContent =
            lesson.remember ||
            lesson.rememberThis ||
            "🧠 இந்த answer-ஐ நினைவில் வைத்துக்கொள்ளுங்கள்.";

    }


    // --------------------------------------
    // EXAMPLE
    // --------------------------------------

    const example =
        document.getElementById(
            "learningExample"
        );


    if (example) {

        example.textContent =
            lesson.example ||
            lesson.exampleQuestion ||
            "📚 இந்த topic-ஐ மீண்டும் ஒருமுறை revise செய்யுங்கள்.";

    }


    // --------------------------------------
    // NUMBER
    // --------------------------------------

    const learningNumber =
        document.getElementById(
            "learningNumber"
        );


    if (learningNumber) {

        learningNumber.textContent =
            `${currentLesson + 1} / ${lessons.length}`;

    }


    // --------------------------------------
    // INDICATOR
    // --------------------------------------

    const indicator =
        document.getElementById(
            "lessonIndicator"
        );


    if (indicator) {

        indicator.textContent =
            `${currentLesson + 1} / ${lessons.length}`;

    }


    // --------------------------------------
    // PROGRESS TEXT
    // --------------------------------------

    const progressText =
        document.getElementById(
            "learningProgressText"
        );


    const progress =
        Math.round(
            (
                (currentLesson + 1) /
                lessons.length
            ) * 100
        );


    if (progressText) {

        progressText.textContent =
            `${progress}%`;

    }


    // --------------------------------------
    // PROGRESS BAR
    // --------------------------------------

    const progressFill =
        document.getElementById(
            "learningProgressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }


    // Update buttons
    updateLessonButtons();

}


// ==========================================
// GET CORRECT ANSWER
// ==========================================

function getCorrectAnswerText(
    question
) {

    if (!question) {

        return "Answer not available";

    }


    const answer =
        question.answer;


    const options =
        question.options;


    // If answer is number
    if (
        typeof answer === "number" &&
        Array.isArray(options)
    ) {

        if (
            options[answer] !== undefined
        ) {

            return (
                "✅ Correct Answer: " +
                options[answer]
            );

        }

    }


    // If answer is numeric string
    if (
        typeof answer === "string" &&
        /^\d+$/.test(answer) &&
        Array.isArray(options)
    ) {

        const index =
            Number(answer);


        if (
            options[index] !== undefined
        ) {

            return (
                "✅ Correct Answer: " +
                options[index]
            );

        }

    }


    // If answer is A/B/C/D
    if (
        typeof answer === "string" &&
        /^[A-Da-d]$/.test(answer) &&
        Array.isArray(options)
    ) {

        const index =
            answer
                .toUpperCase()
                .charCodeAt(0) -
            65;


        if (
            options[index] !== undefined
        ) {

            return (
                "✅ Correct Answer: " +
                options[index]
            );

        }

    }


    // Direct answer text
    if (
        answer !== undefined &&
        answer !== null
    ) {

        return (
            "✅ Correct Answer: " +
            String(answer)
        );

    }


    return (
        "✅ Correct Answer: Not available"
    );

}


// ==========================================
// FORMAT LEARNING TEXT
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
            "<p></p>"
        )
        .replace(
            /\n/g,
            "<br>"
        );

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


    if (previous) {

        previous.disabled =
            currentLesson === 0;

    }


    if (next) {

        next.disabled =
            currentLesson ===
            lessons.length - 1;


        if (
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

}


// ==========================================
// PREVIOUS LESSON
// ==========================================

const previousLessonBtn =
    document.getElementById(
        "previousLessonBtn"
    );


if (previousLessonBtn) {

    previousLessonBtn.addEventListener(
        "click",
        () => {

            if (
                currentLesson > 0
            ) {

                currentLesson--;

                showLesson();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

}


// ==========================================
// NEXT LESSON
// ==========================================

const nextLessonBtn =
    document.getElementById(
        "nextLessonBtn"
    );


if (nextLessonBtn) {

    nextLessonBtn.addEventListener(
        "click",
        () => {

            if (
                currentLesson <
                lessons.length - 1
            ) {

                currentLesson++;

                showLesson();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

}
// ==========================================
// G THE GENIUS
// LEARNING ZONE JS - PART 2
// EXISTING QUESTIONS COLLECTION
// ==========================================


// ==========================================
// LOAD EXISTING QUESTIONS
// ==========================================

async function loadLearningData() {

    try {

        showSubjectLoading();

        console.log(
            "📚 Loading Learning Data from questions..."
        );


        const snapshot =
            await getDocs(
                collection(db, "questions")
            );


        allLearningData = [];


        snapshot.forEach((doc) => {

            const data = doc.data();


            allLearningData.push({

                id: doc.id,

                ...data

            });

        });


        console.log(
            "📚 Questions Loaded:",
            allLearningData.length
        );


        // --------------------------------------
        // NO QUESTIONS
        // --------------------------------------

        if (
            allLearningData.length === 0
        ) {

            subjects = [];

            renderSubjects();

            return;

        }


        // --------------------------------------
        // BUILD SUBJECTS
        // --------------------------------------

        buildSubjectsFromQuestions();


        renderSubjects();


    } catch (error) {

        console.error(
            "❌ Learning Data Error:",
            error
        );


        const grid =
            document.getElementById(
                "subjectGrid"
            );


        if (grid) {

            grid.innerHTML = `

                <div class="loading-card">

                    <div
                        style="
                            font-size:40px;
                        "
                    >
                        ⚠️
                    </div>

                    <p>
                        Learning data load
                        ஆகவில்லை.
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

function buildSubjectsFromQuestions() {

    const subjectMap =
        new Map();


    allLearningData.forEach(
        (question) => {


            const subject =
                question.subject ||
                question.subjectId ||
                question.category;


            if (!subject) return;


            const subjectId =
                String(subject)
                    .trim();


            if (!subjectId) return;


            if (
                !subjectMap.has(
                    subjectId.toLowerCase()
                )
            ) {


                let subjectName =
                    question.subjectName ||
                    subjectId;


                let icon =
                    "📚";


                const lower =
                    subjectId.toLowerCase();


                // --------------------------------
                // SUBJECT ICONS
                // --------------------------------

                if (
                    lower.includes("tamil") ||
                    lower.includes("தமிழ்")
                ) {

                    icon = "📖";

                }

                else if (
                    lower.includes("current")
                ) {

                    icon = "📰";

                }

                else if (
                    lower.includes("science")
                ) {

                    icon = "🔬";

                }

                else if (
                    lower.includes("history")
                ) {

                    icon = "🏛️";

                }

                else if (
                    lower.includes("geography")
                ) {

                    icon = "🌍";

                }

                else if (
                    lower.includes("polity")
                ) {

                    icon = "🇮🇳";

                }

                else if (
                    lower.includes("econom")
                ) {

                    icon = "💰";

                }

                else if (
                    lower.includes("math")
                ) {

                    icon = "➗";

                }

                else if (
                    lower.includes("reason")
                ) {

                    icon = "🧩";

                }


                subjectMap.set(
                    subjectId.toLowerCase(),
                    {

                        id: subjectId,

                        name: subjectName,

                        icon: icon,

                        description:
                            `${subjectName} - Important Exam Questions`

                    }
                );

            }

        }
    );


    subjects =
        Array.from(
            subjectMap.values()
        );


    console.log(
        "📚 Subjects:",
        subjects
    );

}


// ==========================================
// OPEN SUBJECT
// ==========================================

function openSubject(subject) {

    selectedSubject =
        subject;


    currentLesson = 0;


    document.getElementById(
        "selectedSubjectTitle"
    ).textContent =
        subject.name;


    document.getElementById(
        "selectedSubjectName"
    ).textContent =
        subject.name;


    document.getElementById(
        "selectedSubjectIcon"
    ).textContent =
        subject.icon;


    document.getElementById(
        "learningSubjectName"
    ).textContent =
        subject.name;


    loadTopicsFromQuestions();


    document.getElementById(
        "subjectSection"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "topicSection"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "learningSection"
    ).classList.add(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD TOPICS FROM QUESTIONS
// ==========================================

function loadTopicsFromQuestions() {

    if (!selectedSubject) return;


    const subjectId =
        String(
            selectedSubject.id
        )
        .trim()
        .toLowerCase();


    const subjectQuestions =
        allLearningData.filter(
            question => {


                const questionSubject =
                    question.subject ||
                    question.subjectId ||
                    question.category ||
                    "";


                return (
                    String(
                        questionSubject
                    )
                    .trim()
                    .toLowerCase()
                    ===
                    subjectId
                );

            }
        );


    const topicMap =
        new Map();


    subjectQuestions.forEach(
        (question) => {


            const topic =
                question.topic ||
                question.topicId ||
                question.topicName ||
                "General";


            const topicName =
                String(topic)
                    .trim();


            if (!topicName) return;


            const key =
                topicName.toLowerCase();


            if (
                !topicMap.has(key)
            ) {

                topicMap.set(
                    key,
                    {

                        id: topicName,

                        name: topicName,

                        description:
                            "Important questions & explanations"

                    }
                );

            }

        }
    );


    topics =
        Array.from(
            topicMap.values()
        );


    console.log(
        "📚 Topics:",
        topics
    );


    renderTopics();

}


// ==========================================
// OPEN TOPIC
// ==========================================

function openTopic(topic) {

    selectedTopic =
        topic;


    currentLesson = 0;


    document.getElementById(
        "learningTopicName"
    ).textContent =
        topic.name;


    loadQuestionLessons();


    document.getElementById(
        "subjectSection"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "topicSection"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "learningSection"
    ).classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD QUESTIONS AS LESSONS
// ==========================================

function loadQuestionLessons() {

    if (
        !selectedSubject ||
        !selectedTopic
    ) return;


    const subjectId =
        String(
            selectedSubject.id
        )
        .trim()
        .toLowerCase();


    const topicId =
        String(
            selectedTopic.id
        )
        .trim()
        .toLowerCase();


    lessons =
        allLearningData.filter(
            question => {


                const questionSubject =
                    question.subject ||
                    question.subjectId ||
                    question.category ||
                    "";


                const questionTopic =
                    question.topic ||
                    question.topicId ||
                    question.topicName ||
                    "General";


                return (

                    String(
                        questionSubject
                    )
                    .trim()
                    .toLowerCase()
                    ===
                    subjectId

                    &&

                    String(
                        questionTopic
                    )
                    .trim()
                    .toLowerCase()
                    ===
                    topicId

                );

            }
        );


    console.log(
        "📖 Learning Questions:",
        lessons.length
    );


    // --------------------------------------
    // SORT
    // --------------------------------------

    lessons.sort(
        (a, b) => {


            const orderA =
                Number(
                    a.order ||
                    a.questionNumber ||
                    0
                );


            const orderB =
                Number(
                    b.order ||
                    b.questionNumber ||
                    0
                );


            return orderA - orderB;

        }
    );


    // --------------------------------------
    // SHOW LESSON
    // --------------------------------------

    if (
        lessons.length === 0
    ) {

        lessons = [

            {

                question:
                    "இந்த Topic-ல் Questions இல்லை.",

                answer:
                    "Admin Panel-ல் Questions Upload செய்யவும்.",

                explanation:
                    "இந்த Subject மற்றும் Topic-க்கு Questions Upload செய்த பிறகு Learning Zone-ல் தானாக காட்டப்படும்."

            }

        ];

    }


    showQuestionLesson();

}


// ==========================================
// SHOW QUESTION LESSON
// ==========================================

function showQuestionLesson() {

    if (
        !lessons.length
    ) return;


    const lesson =
        lessons[currentLesson];


    // --------------------------------------
    // QUESTION
    // --------------------------------------

    document.getElementById(
        "learningTitle"
    ).textContent =

        lesson.question ||
        lesson.title ||
        lesson.name ||
        "Question";


    // --------------------------------------
    // KEY POINT
    // --------------------------------------

    document.getElementById(
        "learningKeyPoint"
    ).textContent =

        lesson.answerText ||
        lesson.answerExplanation ||
        "Answer கீழே பார்க்கவும்.";


    // --------------------------------------
    // EXPLANATION
    // --------------------------------------

    document.getElementById(
        "learningExplanation"
    ).innerHTML =

        formatLearningText(

            lesson.explanation ||

            lesson.description ||

            lesson.content ||

            "இந்த கேள்விக்கான explanation இன்னும் சேர்க்கப்படவில்லை."

        );


    // --------------------------------------
    // IMPORTANT
    // --------------------------------------

    document.getElementById(
        "learningImportant"
    ).textContent =

        lesson.important ||

        lesson.examPoint ||

        "⭐ Exam Important Question";


    // --------------------------------------
    // REMEMBER
    // --------------------------------------

    document.getElementById(
        "learningRemember"
    ).textContent =

        lesson.remember ||

        lesson.memory ||

        "🧠 இந்த Answer-ஐ நினைவில் வைத்துக்கொள்ளுங்கள்.";


    // --------------------------------------
    // EXAMPLE / ANSWER
    // --------------------------------------

    document.getElementById(
        "learningExample"
    ).textContent =

        getCorrectAnswerText(
            lesson
        );


    // --------------------------------------
    // QUESTION NUMBER
    // --------------------------------------

    document.getElementById(
        "learningNumber"
    ).textContent =

        `Question ${
            currentLesson + 1
        } / ${
            lessons.length
        }`;


    document.getElementById(
        "lessonIndicator"
    ).textContent =

        `${
            currentLesson + 1
        } / ${
            lessons.length
        }`;


    // --------------------------------------
    // PROGRESS
    // --------------------------------------

    const progress =
        (
            (currentLesson + 1) /
            lessons.length
        ) * 100;


    document.getElementById(
        "learningProgressText"
    ).textContent =

        `${Math.round(progress)}%`;


    document.getElementById(
        "learningProgressFill"
    ).style.width =

        `${progress}%`;


    updateLessonButtons();

}


// ==========================================
// GET CORRECT ANSWER
// ==========================================

function getCorrectAnswerText(
    question
) {


    const options =
        question.options;


    const answer =
        question.answer;


    if (
        Array.isArray(options)
        &&
        answer !== undefined
        &&
        answer !== null
    ) {


        const answerIndex =
            Number(answer);


        if (
            options[
                answerIndex
            ] !== undefined
        ) {

            return (

                `✅ Correct Answer: ` +

                `${String.fromCharCode(
                    65 + answerIndex
                )}. ` +

                `${options[
                    answerIndex
                ]}`

            );

        }

    }


    // --------------------------------------
    // If answer is already text
    // --------------------------------------

    if (
        typeof answer === "string"
    ) {

        return (
            `✅ Correct Answer: ${answer}`
        );

    }


    if (
        question.correctAnswer
    ) {

        return (

            `✅ Correct Answer: ` +

            question.correctAnswer

        );

    }


    return (
        "✅ Correct Answer available"
    );

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


    window.location.href =

        `practice.html?subject=${subject}&topic=${topic}`;

}


// ==========================================
// HOME → DASHBOARD
// ==========================================

function goToDashboard() {

    window.location.href =
        "dashboard.html";

}


// ==========================================
// NAVIGATION FIX
// ==========================================

function setupNavigation() {


    const homeNav =
        document.getElementById(
            "homeNav"
        );


    if (homeNav) {

        homeNav.onclick =
            function () {

                goToDashboard();

            };

    }


    const practiceNav =
        document.getElementById(
            "practiceNav"
        );


    if (practiceNav) {

        practiceNav.onclick =
            function () {

                window.location.href =
                    "practice.html";

            };

    }


    const learningNav =
        document.getElementById(
            "learningNav"
        );


    if (learningNav) {

        learningNav.onclick =
            function () {

                showSubjects();

            };

    }


    const profileNav =
        document.getElementById(
            "profileNav"
        );


    if (profileNav) {

        profileNav.onclick =
            function () {

                window.location.href =
                    "profile.html";

            };

    }


    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (backBtn) {

        backBtn.onclick =
            function () {


                if (
                    !document
                        .getElementById(
                            "learningSection"
                        )
                        .classList
                        .contains("hidden")
                ) {

                    showTopics();

                    return;

                }


                if (
                    !document
                        .getElementById(
                            "topicSection"
                        )
                        .classList
                        .contains("hidden")
                ) {

                    showSubjects();

                    return;

                }


                window.location.href =
                    "dashboard.html";

            };

    }

}


// ==========================================
// REFRESH
// ==========================================

function refreshLearning() {

    location.reload();

}


// ==========================================
// EXPOSE FUNCTIONS
// ==========================================

window.openSubject =
    openSubject;

window.openTopic =
    openTopic;

window.startQuickTest =
    startQuickTest;

window.goToDashboard =
    goToDashboard;

window.refreshLearning =
    refreshLearning;


// ==========================================
// FINAL LOG
// ==========================================

console.log(
    "📚 G THE GENIUS Learning Zone Part 2 Ready"
);
