// ============================================================
// G THE GENIUS
// ADMIN PANEL JS
// Firebase v10.12.2
// FULL VERSION
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

let currentUser = null;


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
// SAFE ELEMENT HELPER
// ============================================================

function getElement(id) {

    return document.getElementById(id);

}


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeText(text) {

    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


// ============================================================
// ADMIN AUTH CHECK
// ============================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        console.log("No logged-in user.");

        window.location.href = "login.html";

        return;

    }


    currentUser = user;


    console.log(
        "Logged in user:",
        user.uid,
        user.email
    );


    try {

        const isAdmin =
            await checkAdminAccess(user);


        if (!isAdmin) {

            alert(
                "Access Denied ❌\n\nAdmin account required."
            );


            await signOut(auth);


            window.location.href =
                "login.html";


            return;

        }


        console.log(
            "Admin Access Granted ✅"
        );


        await loadDashboardStats();


    }

    catch (error) {

        console.error(
            "Admin verification error:",
            error
        );


        alert(
            "Unable to verify admin account.\n\n" +
            error.message
        );

    }

});


// ============================================================
// CHECK ADMIN ACCESS
// ============================================================

async function checkAdminAccess(user) {

    let adminFound = false;


    // ========================================================
    // METHOD 1
    // students/{uid}
    // ========================================================

    try {

        const studentsSnapshot =
            await getDocs(
                collection(db, "students")
            );


        studentsSnapshot.forEach((studentDoc) => {

            const data =
                studentDoc.data();


            if (
                studentDoc.id === user.uid &&
                String(data.role || "")
                    .toLowerCase()
                    .trim() === "admin"
            ) {

                adminFound = true;

            }

        });


    }

    catch (error) {

        console.warn(
            "Students admin check failed:",
            error
        );

    }


    // ========================================================
    // METHOD 2
    // admins collection
    // ========================================================

    if (!adminFound) {

        try {

            const adminsSnapshot =
                await getDocs(
                    collection(db, "admins")
                );


            adminsSnapshot.forEach((adminDoc) => {

                const data =
                    adminDoc.data();


                const emailMatch =
                    data.email &&
                    String(data.email)
                        .toLowerCase()
                        .trim() ===
                    String(user.email || "")
                        .toLowerCase()
                        .trim();


                const uidMatch =
                    adminDoc.id === user.uid ||
                    data.uid === user.uid;


                if (
                    uidMatch ||
                    emailMatch
                ) {

                    adminFound = true;

                }

            });


        }

        catch (error) {

            console.warn(
                "Admins collection check failed:",
                error
            );

        }

    }


    return adminFound;

}


// ============================================================
// LOGOUT
// ============================================================

const logoutButton =
    getElement("adminLogoutBtn");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

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

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Logout failed.\nPlease try again."
                );

            }

        }
    );

}


// ============================================================
// ADMIN MENU
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const menuCards =
            document.querySelectorAll(
                ".menu-card"
            );


        const adminSections =
            document.querySelectorAll(
                ".admin-section"
            );


        menuCards.forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const target =
                        button.getAttribute(
                            "data-section"
                        );


                    console.log(
                        "Admin Menu:",
                        target
                    );


                    // Remove active

                    menuCards.forEach(
                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    // Add active

                    button.classList.add(
                        "active"
                    );


                    // Hide sections

                    adminSections.forEach(
                        (section) => {

                            section.classList.remove(
                                "active-section"
                            );

                            section.style.display =
                                "none";

                        }
                    );


                    // Target section

                    const targetSection =
                        document.getElementById(
                            target
                        );


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


                    targetSection.style.display =
                        "block";


                    // Load questions

                    if (
                        target ===
                        "manageQuestionsSection"
                    ) {

                        await loadQuestions();

                    }


                    // Load results

                    if (
                        target ===
                        "resultsSection"
                    ) {

                        await loadResults();

                    }

                }
            );

        });


        console.log(
            "Admin Menu Initialized:",
            menuCards.length
        );

    }
);


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


        const totalQuestions =
            getElement("totalQuestions");


        const totalStudents =
            getElement("totalStudents");


        const totalResults =
            getElement("totalResults");


        const testsToday =
            getElement("testsToday");


        if (totalQuestions) {

            totalQuestions.textContent =
                questionsSnapshot.size;

        }


        if (totalStudents) {

            totalStudents.textContent =
                studentsSnapshot.size;

        }


        if (totalResults) {

            totalResults.textContent =
                resultsSnapshot.size;

        }


        // ====================================================
        // TESTS TODAY
        // ====================================================

        let todayCount = 0;


        const now =
            new Date();


        const todayYear =
            now.getFullYear();


        const todayMonth =
            now.getMonth();


        const todayDate =
            now.getDate();


        resultsSnapshot.forEach(
            (resultDoc) => {

                const data =
                    resultDoc.data();


                if (!data.createdAt) return;


                try {

                    const resultDate =
                        data.createdAt.toDate();


                    if (
                        resultDate.getFullYear() ===
                            todayYear &&

                        resultDate.getMonth() ===
                            todayMonth &&

                        resultDate.getDate() ===
                            todayDate
                    ) {

                        todayCount++;

                    }

                }

                catch (error) {

                    console.warn(
                        "Date conversion error:",
                        error
                    );

                }

            }
        );


        if (testsToday) {

            testsToday.textContent =
                todayCount;

        }

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

if (questionForm) {

    questionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const subject =
                getElement(
                    "questionSubject"
                ).value.trim();


            const topic =
                getElement(
                    "questionTopic"
                ).value.trim();


            const question =
                getElement(
                    "questionText"
                ).value.trim();


            const optionA =
                getElement(
                    "optionA"
                ).value.trim();


            const optionB =
                getElement(
                    "optionB"
                ).value.trim();


            const optionC =
                getElement(
                    "optionC"
                ).value.trim();


            const optionD =
                getElement(
                    "optionD"
                ).value.trim();


            const correctAnswerValue =
                getElement(
                    "correctAnswer"
                ).value;


            const explanation =
                getElement(
                    "questionExplanation"
                ).value.trim();


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !subject ||
                !topic ||
                !question ||
                !optionA ||
                !optionB ||
                !optionC ||
                !optionD ||
                correctAnswerValue === ""
            ) {

                questionMessage.textContent =
                    "⚠️ Please fill all required fields.";

                return;

            }


            const answer =
                Number(
                    correctAnswerValue
                );


            questionMessage.textContent =
                "🔍 Checking duplicate...";


            try {

                // =================================================
                // DUPLICATE CHECK
                // =================================================

                const existingSnapshot =
                    await getDocs(
                        collection(db, "questions")
                    );


                const normalizedQuestion =
                    normalizeText(
                        question
                    );


                let duplicate =
                    false;


                existingSnapshot.forEach(
                    (questionDoc) => {

                        const data =
                            questionDoc.data();


                        if (
                            normalizeText(
                                data.question
                            ) ===
                            normalizedQuestion
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
                    "⏳ Adding question...";


                // =================================================
                // ADD FIRESTORE
                // =================================================

                await addDoc(
                    collection(
                        db,
                        "questions"
                    ),
                    {

                        question:
                            question,

                        options: [

                            optionA,
                            optionB,
                            optionC,
                            optionD

                        ],

                        answer:
                            answer,

                        subject:
                            subject,

                        topic:
                            topic,

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
                    "❌ Failed to add question: " +
                    error.message;

            }

        }
    );

}


// ============================================================
// BULK JSON
// COPY / PASTE
// ============================================================

const bulkUploadButton =
    getElement("bulkUploadBtn");


if (bulkUploadButton) {

    bulkUploadButton.addEventListener(
        "click",
        async () => {

            const subject =
                getElement(
                    "bulkSubject"
                ).value.trim();


            const topic =
                getElement(
                    "bulkTopic"
                ).value.trim();


            const jsonText =
                getElement(
                    "bulkJson"
                ).value.trim();


            const message =
                getElement(
                    "bulkMessage"
                );


            const progressContainer =
                getElement(
                    "uploadProgressContainer"
                );


            const progressBar =
                getElement(
                    "uploadProgress"
                );


            const percent =
                getElement(
                    "uploadPercent"
                );


            const status =
                getElement(
                    "uploadStatus"
                );


            // =================================================
            // VALIDATION
            // =================================================

            if (!subject) {

                message.textContent =
                    "⚠️ Please select a subject.";

                return;

            }


            if (!topic) {

                message.textContent =
                    "⚠️ Please enter a topic.";

                return;

            }


            if (!jsonText) {

                message.textContent =
                    "⚠️ Please paste JSON questions.";

                return;

            }


            try {

                message.textContent =
                    "⏳ Reading JSON...";


                // =================================================
                // PARSE JSON
                // =================================================

                let questions;


                try {

                    questions =
                        JSON.parse(
                            jsonText
                        );

                }

                catch (jsonError) {

                    message.textContent =
                        "❌ Invalid JSON format.";

                    console.error(
                        "JSON Error:",
                        jsonError
                    );

                    return;

                }


                // =================================================
                // ARRAY CHECK
                // =================================================

                if (
                    !Array.isArray(
                        questions
                    )
                ) {

                    message.textContent =
                        "❌ JSON must contain an array of questions.";

                    return;

              }


                // =================================================
                // LOAD EXISTING QUESTIONS
                // =================================================

                message.textContent =
                    "🔍 Checking existing questions...";


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
                                data.question ||
                                ""
                            )
                        );

                    }
                );


                // =================================================
                // PROGRESS
                // =================================================

                progressContainer.style.display =
                    "block";


                progressBar.style.width =
                    "0%";


                percent.textContent =
                    "0%";


                status.textContent =
                    "Starting upload...";


                // =================================================
                // COUNTERS
                // =================================================

                let uploaded = 0;

                let skipped = 0;

                let invalid = 0;


                const total =
                    questions.length;


                // =================================================
                // PROCESS QUESTIONS
                // =================================================

                for (
                    let i = 0;
                    i < questions.length;
                    i++
                ) {

                    const q =
                        questions[i];


                    // ---------------------------------------------
                    // QUESTION TEXT
                    // ---------------------------------------------

                    const questionText =
                        String(
                            q.question ||
                            ""
                        ).trim();


                    if (!questionText) {

                        invalid++;

                    }

                    else {

                        const normalizedQuestion =
                            normalizeText(
                                questionText
                            );


                        // -----------------------------------------
                        // DUPLICATE
                        // -----------------------------------------

                        if (
                            existingQuestions.includes(
                                normalizedQuestion
                            )
                        ) {

                            skipped++;

                        }

                        else {

                            // -------------------------------------
                            // OPTIONS
                            // -------------------------------------

                            let options = [];


                            if (
                                Array.isArray(
                                    q.options
                                )
                            ) {

                                options =
                                    q.options.map(
                                        option =>
                                            String(
                                                option ||
                                                ""
                                            ).trim()
                                    );

                            }

                            else {

                                options = [

                                    String(
                                        q.optionA ||
                                        ""
                                    ).trim(),

                                    String(
                                        q.optionB ||
                                        ""
                                    ).trim(),

                                    String(
                                        q.optionC ||
                                        ""
                                    ).trim(),

                                    String(
                                        q.optionD ||
                                        ""
                                    ).trim()

                                ];

                            }


                            // -------------------------------------
                            // OPTION VALIDATION
                            // -------------------------------------

                            if (
                                options.length !== 4 ||
                                options.some(
                                    option =>
                                        !option
                                )
                            ) {

                                invalid++;

                            }

                            else {

                                // ---------------------------------
                                // ANSWER
                                // ---------------------------------

                                const answer =
                                    Number(
                                        q.answer
                                    );


                                if (
                                    ![
                                        0,
                                        1,
                                        2,
                                        3
                                    ].includes(
                                        answer
                                    )
                                ) {

                                    invalid++;

                                }

                                else {

                                    // -----------------------------
                                    // ADD FIRESTORE
                                    // -----------------------------

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
                                                String(
                                                    q.subject ||
                                                    subject
                                                ).trim(),

                                            topic:
                                                String(
                                                    q.topic ||
                                                    topic
                                                ).trim(),

                                            explanation:
                                                String(
                                                    q.explanation ||
                                                    ""
                                                ).trim(),

                                            createdAt:
                                                serverTimestamp()

                                        }
                                    );


                                    existingQuestions.push(
                                        normalizedQuestion
                                    );


                                    uploaded++;

                                }

                            }

                        }

                    }


                    // =================================================
                    // UPDATE PROGRESS
                    // =================================================

                    const current =
                        i + 1;


                    const progress =
                        Math.round(
                            (
                                current /
                                total
                            ) * 100
                        );


                    progressBar.style.width =
                        progress + "%";


                    percent.textContent =
                        progress + "%";


                    status.textContent =
                        `Processing ${current} / ${total} questions...`;

                }


                // =================================================
                // COMPLETE
                // =================================================

                progressBar.style.width =
                    "100%";


                percent.textContent =
                    "100%";


                status.textContent =
                    "Upload completed successfully.";


                message.textContent =
                    `✅ Upload Complete! ${uploaded} added, ${skipped} duplicate, ${invalid} invalid.`;


                // Clear JSON

                getElement(
                    "bulkJson"
                ).value = "";


                // Update dashboard

                await loadDashboardStats();


            }

            catch (error) {

                console.error(
                    "Bulk upload error:",
                    error
                );


                message.textContent =
                    "❌ Bulk upload failed: " +
                    error.message;


                if (status) {

                    status.textContent =
                        "Upload failed.";

                }

            }

        }
    );

}


// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {

    const list =
        getElement(
            "questionList"
        );


    if (!list) return;


    list.innerHTML = `
        <div class="loading-box">
            <div class="loader"></div>
            <p>Loading Questions...</p>
        </div>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(db, "questions")
            );


        allQuestions = [];


        snapshot.forEach(
            (questionDoc) => {

                allQuestions.push({

                    id:
                        questionDoc.id,

                    ...questionDoc.data()

                });

            }
        );


        renderQuestions();


    }

    catch (error) {

        console.error(
            "Load questions error:",
            error
        );


        list.innerHTML = `
            <div class="empty-box">
                ❌ Failed to load questions.
            </div>
        `;

    }

}


// ============================================================
// RENDER QUESTIONS
// ============================================================

function renderQuestions() {

    const list =
        getElement(
            "questionList"
        );


    if (!list) return;


    const searchInput =
        getElement(
            "questionSearch"
        );


    const subjectFilter =
        getElement(
            "filterSubject"
        );


    const search =
        searchInput
            ? normalizeText(
                searchInput.value
            )
            : "";


    const subject =
        subjectFilter
            ? subjectFilter.value
            : "all";


    const filtered =
        allQuestions.filter(
            (q) => {

                const questionText =
                    normalizeText(
                        q.question
                    );


                const topic =
                    normalizeText(
                        q.topic
                    );


                const matchesSearch =
                    !search ||
                    questionText.includes(
                        search
                    ) ||
                    topic.includes(
                        search
                    );


                const matchesSubject =
                    subject === "all" ||
                    q.subject === subject;


                return (
                    matchesSearch &&
                    matchesSubject
                );

            }
        );


    if (filtered.length === 0) {

        list.innerHTML = `
            <div class="empty-box">
                📭 No questions found.
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
                "question-admin-card";


            const options =
                Array.isArray(q.options)
                    ? q.options
                    : [];


            const answer =
                Number(
                    q.answer
                );


            card.innerHTML = `

                <div class="question-card-top">

                    <span class="question-index">
                        #${index + 1}
                    </span>

                    <span class="subject-badge">
                        ${escapeHTML(
                            q.subject ||
                            "General"
                        )}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(
                        q.question ||
                        "Question"
                    )}
                </h3>


                <div class="admin-options">

                    ${options.map(
                        (option, optionIndex) => `

                        <div
                            class="${
                                optionIndex === answer
                                    ? "correct-option"
                                    : ""
                            }">

                            ${String.fromCharCode(
                                65 +
                                optionIndex
                            )}.
                            ${escapeHTML(
                                option
                            )}

                        </div>

                    `).join("")}

                </div>


                <p class="topic-text">
                    📌 Topic:
                    ${escapeHTML(
                        q.topic ||
                        "-"
                    )}
                </p>


                <button
                    class="delete-question-btn"
                    data-id="${q.id}">

                    🗑️ Delete Question

                </button>

            `;


            list.appendChild(card);

        }
    );
    // ========================================================
    // DELETE BUTTONS
    // ========================================================

    list
        .querySelectorAll(
            ".delete-question-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.getAttribute(
                                "data-id"
                            );


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

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this question?"
        );


    if (!confirmDelete) return;


    try {

        await deleteDoc(
            doc(
                db,
                "questions",
                id
            )
        );


        alert(
            "Question deleted successfully ✅"
        );


        await loadQuestions();


        await loadDashboardStats();


    }

    catch (error) {

        console.error(
            "Delete question error:",
            error
        );


        alert(
            "Failed to delete question.\n\n" +
            error.message
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
        () => {

            renderQuestions();

        }
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
        () => {

            renderQuestions();

        }
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


    if (!list) return;


    list.innerHTML = `
        <div class="loading-box">
            <div class="loader"></div>
            <p>Loading Results...</p>
        </div>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(db, "results")
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


        // Latest first

        allResults.sort(
            (a, b) => {

                const aTime =
                    a.createdAt
                        ? a.createdAt.toMillis()
                        : 0;


                const bTime =
                    b.createdAt
                        ? b.createdAt.toMillis()
                        : 0;


                return bTime - aTime;

            }
        );


        renderResults();

    }

    catch (error) {

        console.error(
            "Load results error:",
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


    if (!list) return;


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
            ? normalizeText(
                searchInput.value
            )
            : "";


    const testType =
        typeFilter
            ? typeFilter.value
            : "all";


    const filtered =
        allResults.filter(
            (result) => {

                const studentName =
                    normalizeText(
                        result.studentName
                    );


                const district =
                    normalizeText(
                        result.district
                    );


                const matchesSearch =
                    !search ||
                    studentName.includes(
                        search
                    ) ||
                    district.includes(
                        search
                    );


                const matchesType =
                    testType === "all" ||
                    result.testType === testType;


                return (
                    matchesSearch &&
                    matchesType
                );

            }
        );


    if (filtered.length === 0) {

        list.innerHTML = `
            <div class="empty-box">
                📭 No results found.
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    filtered.forEach(
        (result) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-admin-card";


            const score =
                Number(
                    result.score || 0
                );


            const total =
                Number(
                    result.totalQuestions || 0
                );


            let percentage =
                Number(
                    result.percentage
                );


            if (
                !Number.isFinite(
                    percentage
                )
            ) {

                percentage =
                    total > 0
                        ? Math.round(
                            (
                                score /
                                total
                            ) * 100
                        )
                        : 0;

            }


            let dateText =
                "-";


            if (
                result.createdAt
            ) {

                try {

                    dateText =
                        result.createdAt
                            .toDate()
                            .toLocaleString();

                }

                catch {

                    dateText =
                        "-";

                }

            }


            card.innerHTML = `

                <div class="result-top">

                    <div>

                        <h3>
                            ${escapeHTML(
                                result.studentName ||
                                "Student"
                            )}
                        </h3>

                        <p>
                            📍
                            ${escapeHTML(
                                result.district ||
                                "-"
                            )}
                        </p>

                    </div>


                    <span class="test-type-badge">

                        ${escapeHTML(
                            result.testType ||
                            "Test"
                        ).toUpperCase()}

                    </span>

                </div>


                <div class="result-score">

                    <strong>
                        ${score} / ${total}
                    </strong>

                    <span>
                        ${percentage}%
                    </span>

                </div>


                <small>
                    🕒 ${escapeHTML(
                        dateText
                    )}
                </small>

            `;


            list.appendChild(card);

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
        () => {

            renderResults();

        }
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
        () => {

            renderResults();

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
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
// INITIAL DASHBOARD LOAD
// ============================================================

console.log(
    "🚀 G THE GENIUS Admin JS Loaded"
);
