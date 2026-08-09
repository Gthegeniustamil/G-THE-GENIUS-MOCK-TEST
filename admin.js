// ============================================================
// G THE GENIUS
// ADMIN PANEL JS
// Firebase v10.12.2
// ============================================================

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let allQuestions = [];
let allResults = [];
let allStudents = [];


// ============================================================
// ELEMENTS
// ============================================================

const questionForm =
    document.getElementById("questionForm");

const questionMessage =
    document.getElementById("questionMessage");

const bulkMessage =
    document.getElementById("bulkMessage");


// ============================================================
// ADMIN AUTH CHECK
// ============================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    try {

        const studentsSnapshot =
            await getDocs(collection(db, "students"));

        let adminFound = false;

        studentsSnapshot.forEach((studentDoc) => {

            const data = studentDoc.data();

            if (
                studentDoc.id === user.uid &&
                data.role === "admin"
            ) {

                adminFound = true;

            }

        });


        if (!adminFound) {

            alert(
                "Access Denied ❌\nAdmin account required."
            );

            await signOut(auth);

            window.location.href = "login.html";

            return;

        }


        console.log("Admin Access Granted ✅");

        loadDashboardStats();

    }

    catch (error) {

        console.error(
            "Admin verification error:",
            error
        );

        alert(
            "Unable to verify admin account."
        );

        window.location.href =
            "dashboard.html";

    }

});


// ============================================================
// ADMIN LOGOUT
// ============================================================

document
    .getElementById("adminLogoutBtn")
    .addEventListener("click", async () => {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmLogout) return;

        try {

            await signOut(auth);

            localStorage.clear();

            window.location.href =
                "login.html";

        }

        catch (error) {

            console.error(error);

            alert(
                "Logout failed. Please try again."
            );

        }

    });

// ============================================================
// ADMIN MENU - FIXED
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const menuCards =
        document.querySelectorAll(".menu-card");

    const adminSections =
        document.querySelectorAll(".admin-section");


    menuCards.forEach((button) => {

        button.addEventListener("click", async () => {

            const target =
                button.getAttribute("data-section");

            console.log("Admin Menu Clicked:", target);


            // -----------------------------
            // REMOVE ACTIVE FROM ALL BUTTONS
            // -----------------------------

            menuCards.forEach((btn) => {

                btn.classList.remove("active");

            });


            // -----------------------------
            // ADD ACTIVE TO CLICKED BUTTON
            // -----------------------------

            button.classList.add("active");


            // -----------------------------
            // HIDE ALL SECTIONS
            // -----------------------------

            adminSections.forEach((section) => {

                section.classList.remove(
                    "active-section"
                );

                section.style.display = "none";

            });


            // -----------------------------
            // SHOW TARGET SECTION
            // -----------------------------

            const targetSection =
                document.getElementById(target);


            if (!targetSection) {

                console.error(
                    "Section not found:",
                    target
                );

                return;

            }


            targetSection.classList.add(
                "active-section"
            );

            targetSection.style.display = "block";


            // -----------------------------
            // LOAD DATA
            // -----------------------------

            if (
                target ===
                "manageQuestionsSection"
            ) {

                await loadQuestions();

            }


            if (
                target ===
                "resultsSection"
            ) {

                await loadResults();

            }

        });

    });


    console.log(
        "✅ Admin Menu Initialized:",
        menuCards.length,
        "menu buttons"
    );

});



// ============================================================
// DASHBOARD STATISTICS
// ============================================================

async function loadDashboardStats() {

    try {

        const [
            questionsSnapshot,
            studentsSnapshot,
            resultsSnapshot
        ] = await Promise.all([

            getDocs(
                collection(db, "questions")
            ),

            getDocs(
                collection(db, "students")
            ),

            getDocs(
                collection(db, "results")
            )

        ]);


        document
            .getElementById("totalQuestions")
            .textContent =
            questionsSnapshot.size;


        document
            .getElementById("totalStudents")
            .textContent =
            studentsSnapshot.size;


        document
            .getElementById("totalResults")
            .textContent =
            resultsSnapshot.size;


        // Tests today

        const today =
            new Date().toLocaleDateString();


        let testsToday = 0;


        resultsSnapshot.forEach((resultDoc) => {

            const data =
                resultDoc.data();


            if (!data.createdAt) return;


            const date =
                data.createdAt
                    .toDate()
                    .toLocaleDateString();


            if (date === today) {

                testsToday++;

            }

        });


        document
            .getElementById("testsToday")
            .textContent =
            testsToday;

    }

    catch (error) {

        console.error(
            "Dashboard stats error:",
            error
        );

    }

}


// ============================================================
// ADD QUESTION
// ============================================================

questionForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const subject =
            document
                .getElementById("questionSubject")
                .value
                .trim();


        const topic =
            document
                .getElementById("questionTopic")
                .value
                .trim();


        const question =
            document
                .getElementById("questionText")
                .value
                .trim();


        const optionA =
            document
                .getElementById("optionA")
                .value
                .trim();


        const optionB =
            document
                .getElementById("optionB")
                .value
                .trim();


        const optionC =
            document
                .getElementById("optionC")
                .value
                .trim();


        const optionD =
            document
                .getElementById("optionD")
                .value
                .trim();


        const answer =
            Number(
                document
                    .getElementById("correctAnswer")
                    .value
            );


        const explanation =
            document
                .getElementById("questionExplanation")
                .value
                .trim();


        if (!subject ||
            !topic ||
            !question ||
            !optionA ||
            !optionB ||
            !optionC ||
            !optionD) {

            questionMessage.textContent =
                "Please fill all required fields.";

            return;

        }


        questionMessage.textContent =
            "Checking duplicate...";


        try {

            // Duplicate check

            const existingSnapshot =
                await getDocs(
                    collection(db, "questions")
                );


            const normalizedQuestion =
                normalizeText(question);


            let duplicate = false;


            existingSnapshot.forEach(
                (questionDoc) => {

                    const data =
                        questionDoc.data();


                    if (
                        normalizeText(
                            data.question || ""
                        ) === normalizedQuestion
                    ) {

                        duplicate = true;

                    }

                }
            );


            if (duplicate) {

                questionMessage.textContent =
                    "⚠️ This question already exists.";

                return;

            }


            questionMessage.textContent =
                "Adding question...";


            await addDoc(
                collection(db, "questions"),
                {

                    question: question,

                    options: [
                        optionA,
                        optionB,
                        optionC,
                        optionD
                    ],

                    answer: answer,

                    subject: subject,

                    topic: topic,

                    explanation:
                        explanation,

                    createdAt:
                        serverTimestamp()

                }
            );


            questionMessage.textContent =
                "✅ Question added successfully!";


            questionForm.reset();


            await loadDashboardStats();


        }

        catch (error) {

            console.error(
                "Add question error:",
                error
            );


            questionMessage.textContent =
                "❌ Failed to add question.";

        }

    }
);


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeText(text) {

    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


// ============================================================
// BULK FILE SELECT
// ============================================================

const bulkFile =
    document.getElementById("bulkFile");


bulkFile.addEventListener(
    "change",
    () => {

        const file =
            bulkFile.files[0];


        document
            .getElementById("selectedFile")
            .textContent =
            file
                ? file.name
                : "No file selected";

    }
);


// ============================================================
// BULK UPLOAD
// ============================================================

document
    .getElementById("bulkUploadBtn")
    .addEventListener(
        "click",
        async () => {

            const file =
                bulkFile.files[0];


            const subject =
                document
                    .getElementById("bulkSubject")
                    .value
                    .trim();


            const topic =
                document
                    .getElementById("bulkTopic")
                    .value
                    .trim();


            if (!file) {

                bulkMessage.textContent =
                    "Please select a JSON file.";

                return;

            }


            if (!subject) {

                bulkMessage.textContent =
                    "Please select a subject.";

                return;

            }


            if (!topic) {

                bulkMessage.textContent =
                    "Please enter a topic.";

                return;

            }


            try {

                bulkMessage.textContent =
                    "Reading JSON file...";


                const text =
                    await file.text();


                const questions =
                    JSON.parse(text);


                if (!Array.isArray(questions)) {

                    throw new Error(
                        "JSON must contain an array."
                    );

                }


                if (questions.length === 0) {

                    bulkMessage.textContent =
                        "No questions found.";

                    return;

                }


                // Load existing questions

                const existingSnapshot =
                    await getDocs(
                        collection(db, "questions")
                    );


                const existingQuestions =
                    [];


                existingSnapshot.forEach(
                    (questionDoc) => {

                        const data =
                            questionDoc.data();


                        existingQuestions.push(
                            normalizeText(
                                data.question || ""
                            )
                        );

                    }
                );


                const total =
                    questions.length;


                let uploaded = 0;

                let skipped = 0;


                const progressContainer =
                    document
                        .getElementById(
                            "uploadProgressContainer"
                        );


                const progressBar =
                    document
                        .getElementById(
                            "uploadProgress"
                        );


                const percent =
                    document
                        .getElementById(
                            "uploadPercent"
                        );


                const status =
                    document
                        .getElementById(
                            "uploadStatus"
                        );


                progressContainer.style.display =
                    "block";


                for (
                    let i = 0;
                    i < questions.length;
                    i++
                ) {

                    const q =
                        questions[i];


                    const questionText =
                        String(
                            q.question || ""
                        ).trim();


                    if (!questionText) {

                        skipped++;

                        continue;

                    }


                    const normalized =
                        normalizeText(
                            questionText
                        );


                    // Duplicate check

                    if (
                        existingQuestions.includes(
                            normalized
                        )
                    ) {

                        skipped++;

                    }

                    else {

                        const options =
                            Array.isArray(q.options)
                                ? q.options
                                : [
                                    q.optionA || "",
                                    q.optionB || "",
                                    q.optionC || "",
                                    q.optionD || ""
                                ];


                        const answer =
                            Number(
                                q.answer ?? 0
                            );


                        await addDoc(
                            collection(
                                db,
                                "questions"
                            ),
                            {

                                question:
                                    questionText,

                                options:
                                    options,

                                answer:
                                    answer,

                                subject:
                                    q.subject ||
                                    subject,

                                topic:
                                    q.topic ||
                                    topic,

                                explanation:
                                    q.explanation ||
                                    "",

                                createdAt:
                                    serverTimestamp()

                            }
                        );


                        existingQuestions.push(
                            normalized
                        );


                        uploaded++;

                    }


                    const current =
                        i + 1;


                    const progress =
                        Math.round(
                            (current / total) * 100
                        );


                    progressBar.style.width =
                        progress + "%";


                    percent.textContent =
                        progress + "%";


                    status.textContent =
                        `Processing ${current} / ${total} questions...`;

                }


                status.textContent =
                    `Completed: ${uploaded} uploaded, ${skipped} skipped.`;


                bulkMessage.textContent =
                    `✅ Upload complete! ${uploaded} added, ${skipped} duplicates/invalid skipped.`;


                await loadDashboardStats();


            }

            catch (error) {

                console.error(
                    "Bulk upload error:",
                    error
                );


                bulkMessage.textContent =
                    "❌ Invalid JSON or upload failed.";

            }

        }
    );


// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {

    const list =
        document.getElementById(
            "questionList"
        );


    list.innerHTML =
        `<div class="loading-box">
            <div class="loader"></div>
            <p>Loading Questions...</p>
        </div>`;


    try {

        const snapshot =
            await getDocs(
                collection(db, "questions")
            );


        allQuestions = [];


        snapshot.forEach((questionDoc) => {

            allQuestions.push({

                id:
                    questionDoc.id,

                ...questionDoc.data()

            });

        });


        renderQuestions();

    }

    catch (error) {

        console.error(error);

        list.innerHTML =
            `<div class="empty-box">
                ❌ Failed to load questions.
            </div>`;

    }

}


// ============================================================
// RENDER QUESTIONS
// ============================================================

function renderQuestions() {

    const list =
        document.getElementById(
            "questionList"
        );


    const search =
        document
            .getElementById(
                "questionSearch"
            )
            .value
            .trim()
            .toLowerCase();


    const subject =
        document
            .getElementById(
                "filterSubject"
            )
            .value;


    const filtered =
        allQuestions.filter((q) => {

            const matchesSearch =
                !search ||
                String(
                    q.question || ""
                                    ).toLowerCase();


                const qSubject =
                    String(
                        q.subject || ""
                    );


                const qTopic =
                    String(
                        q.topic || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    question.includes(search) ||
                    qTopic.includes(search);


                const matchesSubject =
                    subject === "all" ||
                    qSubject === subject;


                return (
                    matchesSearch &&
                    matchesSubject
                );

            }
        );


    if (filtered.length === 0) {

        list.innerHTML = `

            <div class="empty-box">

                📚 No questions found.

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    filtered.forEach(
        (q, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-card";


            const options =
                Array.isArray(q.options)
                    ? q.options
                    : [];


            const answerIndex =
                Number(q.answer);


            const answerLetter =
                answerIndex >= 0 &&
                answerIndex <= 3
                    ? String.fromCharCode(
                        65 + answerIndex
                    )
                    : "-";


            card.innerHTML = `

                <div class="question-card-header">

                    <div>

                        <span class="question-number">

                            Q${index + 1}

                        </span>

                        <span class="question-subject">

                            ${escapeHTML(
                                q.subject || "-"
                            )}

                        </span>

                        <span class="question-topic">

                            ${escapeHTML(
                                q.topic || "-"
                            )}

                        </span>

                    </div>

                    <button
                        type="button"
                        class="delete-question-btn"
                        data-id="${q.id}">

                        🗑️ Delete

                    </button>

                </div>


                <div class="question-card-body">

                    <h3>

                        ${escapeHTML(
                            q.question || ""
                        )}

                    </h3>


                    <div class="admin-options">

                        ${options.map(
                            (option, optionIndex) => `

                            <div
                                class="${
                                    optionIndex === answerIndex
                                        ? "correct-option"
                                        : ""
                                }">

                                <strong>
                                    ${String.fromCharCode(
                                        65 + optionIndex
                                    )}.
                                </strong>

                                ${escapeHTML(
                                    option
                                )}

                                ${
                                    optionIndex ===
                                    answerIndex
                                        ? " ✅"
                                        : ""
                                }

                            </div>

                        `
                        ).join("")}

                    </div>


                    ${
                        q.explanation
                            ? `
                                <div class="question-explanation">

                                    💡
                                    ${escapeHTML(
                                        q.explanation
                                    )}

                                </div>
                              `
                            : ""
                    }

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );


    // ------------------------------------------------
    // DELETE EVENTS
    // ------------------------------------------------

    document
        .querySelectorAll(
            ".delete-question-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;


                        await deleteQuestion(
                            id
                        );

                    }
                );

            }
        );

}


// ============================================================
// DELETE QUESTION
// ============================================================

async function deleteQuestion(id) {

    if (!id) {

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this question?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "questions",
                id
            )
        );


        alert(
            "✅ Question deleted successfully."
        );


        await loadQuestions();

        await loadDashboardStats();

    }

    catch (error) {

        console.error(
            "Delete Question Error:",
            error
        );


        alert(
            "❌ Failed to delete question."
        );

    }

}


// ============================================================
// QUESTION SEARCH
// ============================================================

const questionSearch =
    getElement(
        "questionSearch"
    );


if (questionSearch) {

    questionSearch.addEventListener(
        "input",
        renderQuestions
    );

}


// ============================================================
// SUBJECT FILTER
// ============================================================

const filterSubject =
    getElement(
        "filterSubject"
    );


if (filterSubject) {

    filterSubject.addEventListener(
        "change",
        renderQuestions
    );

}


// ============================================================
// LOAD RESULTS
// ============================================================

async function loadResults() {

    const list =
        getElement(
            "resultsList"
        );


    if (!list) {

        return;

    }


    list.innerHTML = `

        <div class="loading-box">

            <div class="loader"></div>

            <p>
                Loading Results...
            </p>

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "results"
                )
            );


        allResults = [];


        snapshot.forEach(
            (resultDoc) => {

                allResults.push({

                    id:
                        resultDoc.id,

                    ...resultDoc.data()

                });

            }
        );


        console.log(
            "Results Loaded:",
            allResults.length
        );


        renderResults();

    }

    catch (error) {

        console.error(
            "Load Results Error:",
            error
        );


        list.innerHTML = `

            <div class="empty-box">

                ❌ Failed to load results.

            </div>

        `;

    }

}


// ============================================================
// RENDER RESULTS
// ============================================================

function renderResults() {

    const list =
        getElement(
            "resultsList"
        );


    if (!list) {

        return;

    }


    const searchInput =
        getElement(
            "resultSearch"
        );


    const typeFilter =
        getElement(
            "resultTestType"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const testType =
        typeFilter
            ? typeFilter.value
            : "all";


    let filtered =
        allResults.filter(
            (result) => {

                const name =
                    String(
                        result.studentName || ""
                    ).toLowerCase();


                const district =
                    String(
                        result.district || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    district.includes(search);


                const matchesType =
                    testType === "all" ||
                    result.testType === testType;


                return (
                    matchesSearch &&
                    matchesType
                );

            }
        );


    // Newest first

    filtered.sort(
        (a, b) => {

            const aTime =
                a.createdAt?.seconds || 0;


            const bTime =
                b.createdAt?.seconds || 0;


            return bTime - aTime;

        }
    );


    if (filtered.length === 0) {

        list.innerHTML = `

            <div class="empty-box">

                📊 No results found.

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    filtered.forEach(
        (result, index) => {

            const score =
                Number(
                    result.score || 0
                );


            const total =
                Number(
                    result.totalQuestions || 0
                );


            const percentage =
                total > 0
                    ? Math.round(
                        (
                            score /
                            total
                        ) * 100
                    )
                    : 0;


            let testName =
                "Daily Mock Test";


            let icon =
                "🟢";


            if (
                result.testType ===
                "weekly"
            ) {

                testName =
                    "Weekly Mock Test";

                icon =
                    "🟡";

            }


            else if (
                result.testType ===
                "monthly"
            ) {

                testName =
                    "Monthly Grand Test";

                icon =
                    "🔴";

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-card";


            card.innerHTML = `

                <div>

                    <strong>

                        ${escapeHTML(
                            result.studentName ||
                            "Student"
                        )}

                    </strong>

                    <small>

                        📍
                        ${escapeHTML(
                            result.district ||
                            "-"
                        )}

                    </small>

                </div>


                <div>

                    <span>

                        ${icon}
                        ${testName}

                    </span>

                    <strong>

                        ${score}/${total}

                    </strong>

                    <small>

                        ${percentage}%

                    </small>

                </div>


                <div>

                    <small>

                        ${formatDate(
                            result.createdAt
                        )}

                    </small>

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );

}


// ============================================================
// RESULT SEARCH
// ============================================================

const resultSearch =
    getElement(
        "resultSearch"
    );


if (resultSearch) {

    resultSearch.addEventListener(
        "input",
        renderResults
    );

}


// ============================================================
// RESULT TEST TYPE FILTER
// ============================================================

const resultTestType =
    getElement(
        "resultTestType"
    );


if (resultTestType) {

    resultTestType.addEventListener(
        "change",
        renderResults
    );

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "Recent";

    }


    try {

        let date;


        if (
            timestamp.seconds
        ) {

            date =
                new Date(
                    timestamp.seconds *
                    1000
                );

        }

        else if (
            timestamp.toDate
        ) {

            date =
                timestamp.toDate();

        }

        else {

            return "Recent";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    }

    catch (error) {

        return "Recent";

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(
        value || ""
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


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "======================================"
);

console.log(
    "G THE GENIUS ADMIN PANEL LOADED ✅"
);

console.log(
    "Firebase v10.12.2"
);

console.log(
    "Bulk Upload System: READY"
);

console.log(
    "Duplicate Check: ENABLED"
);

console.log(
    "Firestore Batch Upload: ENABLED"
);

console.log(
    "======================================"
);
            
