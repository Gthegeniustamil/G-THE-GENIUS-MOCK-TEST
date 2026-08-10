// ==========================================
// G THE GENIUS
// LEARNING ZONE JS
// Subject → Topic → Lesson → Quick Test
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

let allLearningData = [];

let subjects = [];
let topics = [];
let lessons = [];

let selectedSubject = null;
let selectedTopic = null;

let currentLesson = 0;

let searchText = "";


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

    await loadLearningData();

    hideLoader();

}


// ==========================================
// LOAD FIREBASE DATA
// ==========================================

async function loadLearningData() {

    try {

        showSubjectLoading();

        const snapshot =
            await getDocs(
                collection(db, "learning")
            );


        allLearningData = [];


        snapshot.forEach((doc) => {

            allLearningData.push({
                id: doc.id,
                ...doc.data()
            });

        });


        console.log(
            "Learning documents:",
            allLearningData.length
        );


        if (allLearningData.length > 0) {

            buildSubjectsFromFirebase();

        } else {

            subjects =
                [...defaultSubjects];

        }


        renderSubjects();


    } catch (error) {

        console.error(
            "Learning Load Error:",
            error
        );


        subjects =
            [...defaultSubjects];

        renderSubjects();

    }

}


// ==========================================
// BUILD SUBJECTS
// ==========================================

function buildSubjectsFromFirebase() {

    const subjectMap = new Map();


    allLearningData.forEach((item) => {

        const subjectId =
            item.subjectId ||
            item.subject ||
            item.category;


        const subjectName =
            item.subjectName ||
            item.subjectTitle ||
            item.subject;


        if (!subjectId) return;


        if (!subjectMap.has(subjectId)) {

            const defaultSubject =
                defaultSubjects.find(
                    s => s.id === subjectId
                );


            subjectMap.set(
                subjectId,
                {

                    id: subjectId,

                    name:
                        subjectName ||
                        defaultSubject?.name ||
                        subjectId,

                    icon:
                        item.subjectIcon ||
                        defaultSubject?.icon ||
                        "📚",

                    description:
                        item.subjectDescription ||
                        defaultSubject?.description ||
                        "Important exam learning"

                }
            );

        }

    });


    subjects =
        Array.from(
            subjectMap.values()
        );


    // If Firebase has incomplete subject data
    if (subjects.length === 0) {

        subjects =
            [...defaultSubjects];

    }

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


    count.textContent =
        `${filteredSubjects.length} Subjects`;


    grid.innerHTML = "";


    if (
        filteredSubjects.length === 0
    ) {

        showNoResults();

        return;

    }


    hideNoResults();


    filteredSubjects.forEach(
        (subject, index) => {

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
                    ${escapeHTML(subject.icon)}
                </div>

                <div>

                    <h4>
                        ${escapeHTML(subject.name)}
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

                    openSubject(subject);

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


    loadTopics();


    document.getElementById(
        "subjectSection"
    ).classList.add("hidden");


    document.getElementById(
        "topicSection"
    ).classList.remove("hidden");


    document.getElementById(
        "learningSection"
    ).classList.add("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// LOAD TOPICS
// ==========================================

function loadTopics() {

    if (!selectedSubject) return;


    const subjectId =
        selectedSubject.id;


    const firebaseItems =
        allLearningData.filter(
            item => {

                const id =
                    item.subjectId ||
                    item.subject ||
                    item.category;

                return String(id)
                    .toLowerCase() ===
                    String(subjectId)
                        .toLowerCase();

            }
        );


    const topicMap =
        new Map();


    firebaseItems.forEach(
        (item) => {

            const topicId =
                item.topicId ||
                item.topic ||
                item.topicName;


            if (!topicId) return;


            if (!topicMap.has(topicId)) {

                topicMap.set(
                    topicId,
                    {

                        id: topicId,

                        name:
                            item.topicName ||
                            item.topicTitle ||
                            item.topic ||
                            topicId,

                        description:
                            item.topicDescription ||
                            "Important exam topic"

                    }
                );

            }

        }
    );


    topics =
        Array.from(
            topicMap.values()
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


    count.textContent =
        `${filteredTopics.length} Topics`;


    grid.innerHTML = "";


    if (
        filteredTopics.length === 0
    ) {

        grid.innerHTML = `

            <div class="loading-card">

                <div
                    style="
                        font-size:28px;
                    "
                >
                    📚
                </div>

                <p>
                    இந்த Subject-க்கு
                    Learning Topics இன்னும்
                    சேர்க்கப்படவில்லை.
                </p>

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
                            topic.description || ""
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

                    openTopic(topic);

                }
            );


            grid.appendChild(card);

        }
    );

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


    loadLessons();


    document.getElementById(
        "subjectSection"
    ).classList.add("hidden");


    document.getElementById(
        "topicSection"
    ).classList.add("hidden");


    document.getElementById(
        "learningSection"
    ).classList.remove("hidden");


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
    ) return;


    const subjectId =
        selectedSubject.id;


    const topicId =
        selectedTopic.id;


    lessons =
        allLearningData.filter(
            item => {

                const itemSubject =
                    item.subjectId ||
                    item.subject ||
                    item.category;


                const itemTopic =
                    item.topicId ||
                    item.topic ||
                    item.topicName;


                return (

                    String(itemSubject)
                        .toLowerCase() ===
                    String(subjectId)
                        .toLowerCase()

                    &&

                    String(itemTopic)
                        .toLowerCase() ===
                    String(topicId)
                        .toLowerCase()

                );

            }
        );


    lessons.sort(
        (a, b) => {

            const orderA =
                Number(
                    a.order ||
                    a.lessonNumber ||
                    0
                );


            const orderB =
                Number(
                    b.order ||
                    b.lessonNumber ||
                    0
                );


            return orderA - orderB;

        }
    );


    if (lessons.length === 0) {

        lessons = [

            {

                title:
                    selectedTopic.name,

                keyPoint:
                    "இந்த topic-க்கான முக்கியமான தகவல்களை படிக்கவும்.",

                explanation:
                    "இந்த topic-க்கான learning content இன்னும் Admin Panel மூலம் சேர்க்கப்படவில்லை.",

                important:
                    "இந்த topic-ல் முக்கியமான exam points சேர்க்கப்படும்.",

                remember:
                    "முக்கியமான facts-ஐ note செய்து revision செய்யுங்கள்.",

                example:
                    "இந்த topic முடிந்ததும் Quick Test மூலம் உங்கள் preparation-ஐ check செய்யலாம்."

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
    ) return;


    const lesson =
        lessons[currentLesson];


    document.getElementById(
        "learningTitle"
    ).textContent =
        lesson.title ||
        lesson.name ||
        "Learning Lesson";


    document.getElementById(
        "learningKeyPoint"
    ).textContent =
        lesson.keyPoint ||
        lesson.keypoint ||
        lesson.key_point ||
        "Important key point";


    document.getElementById(
        "learningExplanation"
    ).innerHTML =
        formatLearningText(
            lesson.explanation ||
            lesson.content ||
            lesson.description ||
            "Explanation not available."
        );


    document.getElementById(
        "learningImportant"
    ).textContent =
        lesson.important ||
        lesson.examPoint ||
        lesson.examImportant ||
        "Important for exam";


    document.getElementById(
        "learningRemember"
    ).textContent =
        lesson.remember ||
        lesson.rememberThis ||
        lesson.memory ||
        "Remember this point";


    document.getElementById(
        "learningExample"
    ).textContent =
        lesson.example ||
        lesson.exampleQuestion ||
        "Review this topic and test yourself.";


    document.getElementById(
        "learningNumber"
    ).textContent =
        `${currentLesson + 1} / ${lessons.length}`;


    document.getElementById(
        "lessonIndicator"
    ).textContent =
        `${currentLesson + 1} / ${lessons.length}`;


    document.getElementById(
        "learningProgressText"
    ).textContent =
        `${Math.round(
            ((currentLesson + 1) /
            lessons.length) * 100
        )}%`;


    document.getElementById(
        "learningProgressFill"
    ).style.width =
        `${(
            (currentLesson + 1) /
            lessons.length
        ) * 100}%`;


    updateLessonButtons();

}


// ==========================================
// FORMAT LEARNING TEXT
// ==========================================

function formatLearningText(text) {

    if (!text) return "";


    const safeText =
        escapeHTML(
            String(text)
        );


    return safeText
        .replace(/\n\n/g, "<p></p>")
        .replace(/\n/g, "<br>");
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


    previous.disabled =
        currentLesson === 0;


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


// ==========================================
// PREVIOUS LESSON
// ==========================================

document.getElementById(
    "previousLessonBtn"
).addEventListener(
    "click",
    () => {

        if (currentLesson > 0) {

            currentLesson--;

            showLesson();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


// ==========================================
// NEXT LESSON
// ==========================================

document.getElementById(
    "nextLessonBtn"
).addEventListener(
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


    input.addEventListener(
        "input",
        () => {

            searchText =
                input.value
                    .trim()
                    .toLowerCase();


            clearBtn.style.display =
                searchText
                    ? "block"
                    : "none";


            performSearch();

        }
    );


    clearBtn.addEventListener(
        "click",
        () => {

            input.value = "";

            searchText = "";

            clearBtn.style.display =
                "none";

            performSearch();

        }
    );

}


// ==========================================
// PERFORM SEARCH
// ==========================================

function performSearch() {

    if (
        !searchText
    ) {

        if (
            !document.getElementById(
                "subjectSection"
            ).classList.contains("hidden")
        ) {

            renderSubjects();

        } else if (
            !document.getElementById(
                "topicSection"
            ).classList.contains("hidden")
        ) {

            renderTopics();

        }

        return;

    }


    if (
        !document.getElementById(
            "subjectSection"
        ).classList.contains("hidden")
    ) {

        const filtered =
            subjects.filter(
                subject => {

                    return (

                        subject.name
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        subject.description
                            .toLowerCase()
                            .includes(searchText)

                    );

                }
            );


        renderSubjects(filtered);

    }


    else if (
        !document.getElementById(
            "topicSection"
        ).classList.contains("hidden")
    ) {

        const filtered =
            topics.filter(
                topic => {

                    return (

                        topic.name
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (
                            topic.description || ""
                        )
                        .toLowerCase()
                        .includes(searchText)

                    );

                }
            );


        renderTopics(filtered);

    }

}


// ==========================================
// BUTTON SETUP
// ==========================================

function setupButtons() {

    document.getElementById(
        "backToSubjectsBtn"
    ).addEventListener(
        "click",
        () => {

            showSubjects();

        }
    );


    document.getElementById(
        "backToTopicsBtn"
    ).addEventListener(
        "click",
        () => {

            showTopics();

        }
    );


    document.getElementById(
        "refreshBtn"
    ).addEventListener(
        "click",
        () => {

            location.reload();

        }
    );


    document.getElementById(
        "startQuickTestBtn"
    ).addEventListener(
        "click",
        startQuickTest
    );

}


// ==========================================
// SHOW SUBJECTS
// ==========================================

function showSubjects() {

    selectedSubject = null;

    selectedTopic = null;

    currentLesson = 0;

    document.getElementById(
        "subjectSection"
    ).classList.remove("hidden");


    document.getElementById(
        "topicSection"
    ).classList.add("hidden");


    document.getElementById(
        "learningSection"
    ).classList.add("hidden");


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

    document.getElementById(
        "subjectSection"
    ).classList.add("hidden");


    document.getElementById(
        "topicSection"
    ).classList.remove("hidden");


    document.getElementById(
        "learningSection"
    ).classList.add("hidden");


    renderTopics();

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
            "Please select a topic first."
        );

        return;

    }


    /*
        Quick Test can use the existing
        Practice Test page.

        URL parameters:
        subject + topic

        Your practice.js can read these
        parameters and filter questions.
    */


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
// NAVIGATION
// ==========================================

function setupNavigation() {

    document.getElementById(
        "backBtn"
    ).addEventListener(
        "click",
        () => {

            if (
                !document.getElementById(
                    "learningSection"
                ).classList.contains("hidden")
            ) {

                showTopics();

                return;

            }


            if (
                !document.getElementById(
                    "topicSection"
                ).classList.contains("hidden")
            ) {

                showSubjects();

                return;

            }


            window.history.back();

        }
    );


    document.getElementById(
        "homeNav"
    ).addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );


    document.getElementById(
        "practiceNav"
    ).addEventListener(
        "click",
        () => {

            window.location.href =
                "practice.html";

        }
    );


    document.getElementById(
        "learningNav"
    ).addEventListener(
        "click",
        () => {

            showSubjects();

        }
    );


    document.getElementById(
        "profileNav"
    ).addEventListener(
        "click",
        () => {

            window.location.href =
                "profile.html";

        }
    );

}


// ==========================================
// LOADING
// ==========================================

function showSubjectLoading() {

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

    document.getElementById(
        "noResults"
    ).classList.remove(
        "hidden"
    );

}


function hideNoResults() {

    document.getElementById(
        "noResults"
    ).classList.add(
        "hidden"
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
    (error) => {

        console.error(
            "Learning Zone Error:",
            error
        );

    }
);


// ==========================================
// FINISHED
// ==========================================

console.log(
    "📚 G THE GENIUS Learning Zone Ready"
);
