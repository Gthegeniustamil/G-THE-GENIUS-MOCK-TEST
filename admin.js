// ============================================================
// G THE GENIUS
// ADMIN PANEL JS - FINAL
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


// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 G THE GENIUS Admin JS Started");

    initializeAdminMenu();
    initializeBulkUpload();
    initializeAddQuestion();
    initializeLogout();
    initializeFilters();

});


// ============================================================
// ADMIN AUTH
// ============================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        console.log("❌ User not logged in");

        window.location.href = "login.html";

        return;
    }

    try {

        console.log("Checking admin:", user.uid);

        const studentsSnapshot =
            await getDocs(
                collection(db, "students")
            );

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

            window.location.href =
                "login.html";

            return;

        }


        console.log("✅ Admin Access Granted");

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
            "login.html";

    }

});


// ============================================================
// ADMIN MENU
// ============================================================

function initializeAdminMenu() {

    const menuCards =
        document.querySelectorAll(".menu-card");

    const sections =
        document.querySelectorAll(".admin-section");


    console.log(
        "Menu Buttons:",
        menuCards.length
    );

    console.log(
        "Admin Sections:",
        sections.length
    );


    if (!menuCards.length) {

        console.error(
            "❌ Menu cards not found"
        );

        return;

    }


    menuCards.forEach((button) => {

        button.addEventListener("click", async () => {

            const target =
                button.dataset.section;


            console.log(
                "📌 Menu clicked:",
                target
            );


            // Remove active from buttons

            menuCards.forEach((btn) => {

                btn.classList.remove("active");

            });


            // Add active

            button.classList.add("active");


            // Hide all sections

            sections.forEach((section) => {

                section.classList.remove(
                    "active-section"
                );

                section.style.display =
                    "none";

            });


            // Find target

            const targetSection =
                document.getElementById(target);


            if (!targetSection) {

                console.error(
                    "❌ Section not found:",
                    target
                );

                return;

            }


            // Show target

            targetSection.classList.add(
                "active-section"
            );

            targetSection.style.display =
                "block";


            // Scroll to section

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            // Load section data

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
        "✅ Admin Menu Initialized"
    );

}


// ============================================================
// LOGOUT
// ============================================================

function initializeLogout() {

    const logoutBtn =
        document.getElementById(
            "adminLogoutBtn"
        );


    if (!logoutBtn) return;


    logoutBtn.addEventListener(
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
                    "Logout failed."
                );

            }

        }
    );

}


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
                collection(
                    db,
                    "questions"
                )
            ),

            getDocs(
                collection(
                    db,
                    "students"
                )
            ),

            getDocs(
                collection(
                    db,
                    "results"
                )
            )

        ]);


        const totalQuestions =
            document.getElementById(
                "totalQuestions"
            );

        const totalStudents =
            document.getElementById(
                "totalStudents"
            );

        const totalResults =
            document.getElementById(
                "totalResults"
            );

        const testsToday =
            document.getElementById(
                "testsToday"
            );


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


        // Tests today

        let todayCount = 0;

        const today =
            new Date().toDateString();


        resultsSnapshot.forEach((resultDoc) => {

            const data =
                resultDoc.data();


            if (
                data.createdAt &&
                typeof data.createdAt.toDate ===
                    "function"
            ) {

                const resultDate =
                    data.createdAt
                        .toDate()
                        .toDateString();


                if (
                    resultDate === today
                ) {

                    todayCount++;

                }

            }

        });


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

function initializeAddQuestion() {

    const form =
        document.getElementById(
            "questionForm"
        );


    if (!form) {

        console.error(
            "❌ Question form not found"
        );

        return;

    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const message =
                document.getElementById(
                    "questionMessage"
                );


            const subject =
                document.getElementById(
                    "questionSubject"
                ).value.trim();


            const topic =
                document.getElementById(
                    "questionTopic"
                ).value.trim();


            const question =
                document.getElementById(
                    "questionText"
                ).value.trim();


            const optionA =
                document.getElementById(
                    "optionA"
                ).value.trim();


            const optionB =
                document.getElementById(
                    "optionB"
                ).value.trim();


            const optionC =
                document.getElementById(
                    "optionC"
                ).value.trim();


            const optionD =
                document.getElementById(
                    "optionD"
                ).value.trim();


            const correctValue =
                document.getElementById(
                    "correctAnswer"
                ).value;


            const explanation =
                document.getElementById(
                    "questionExplanation"
                ).value.trim();


            if (
                !subject ||
                !topic ||
                !question ||
                !optionA ||
                !optionB ||
                !optionC ||
                !optionD ||
                correctValue === ""
            ) {

                message.textContent =
                    "⚠️ Please fill all required fields.";

                return;

            }


            message.textContent =
                "⏳ Checking duplicate...";


            try {

                const snapshot =
                    await getDocs(
                        collection(
                            db,
                            "questions"
                        )
                    );


                const normalized =
                    normalizeText(
                        question
                    );


                let duplicate = false;


                snapshot.forEach((questionDoc) => {

                    const data =
                        questionDoc.data();


                    if (
                        normalizeText(
                            data.question || ""
                        ) === normalized
                    ) {

                        duplicate = true;

                    }

                });


                if (duplicate) {

                    message.textContent =
                        "⚠️ This question already exists.";

                    return;

                }


                message.textContent =
                    "⏳ Adding question...";


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
                            Number(correctValue),

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


                message.textContent =
                    "✅ Question added successfully!";


                form.reset();


                await loadDashboardStats();

            }

            catch (error) {

                console.error(
                    "Add question error:",
                    error
                );

                message.textContent =
                    "❌ Failed to add question.";

            }

        }
    );

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
// BULK UPLOAD INITIALIZE
// ============================================================

function initializeBulkUpload() {

    const bulkFile =
        document.getElementById(
            "bulkFile"
        );

    const bulkButton =
        document.getElementById(
            "bulkUploadBtn"
        );


    if (!bulkFile) {

        console.error(
            "❌ bulkFile not found"
        );

        return;

    }


    if (!bulkButton) {

        console.error(
            "❌ bulkUploadBtn not found"
        );

        return;

    }


    console.log(
        "✅ Bulk Upload Initialized"
    );


    // File selected

    bulkFile.addEventListener(
        "change",
        () => {

            const file =
                bulkFile.files[0];


            const selectedFile =
                document.getElementById(
                    "selectedFile"
                );


            if (file) {

                selectedFile.textContent =
                    `📄 ${file.name} (${formatFileSize(file.size)})`;

            }

            else {

                selectedFile.textContent =
                    "No file selected";

            }

        }
    );


    // Upload button

    bulkButton.addEventListener(
        "click",
        uploadBulkQuestions
    );

}


// ============================================================
// FILE SIZE
// ============================================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }

    return (
        (bytes / (1024 * 1024))
            .toFixed(1) +
        " MB"
    );

}


// ============================================================
// BULK UPLOAD QUESTIONS
// ============================================================

async function uploadBulkQuestions() {

    const bulkFile =
        document.getElementById(
            "bulkFile"
        );


    const bulkMessage =
        document.getElementById(
            "bulkMessage"
        );


    const file =
        bulkFile.files[0];


    const subject =
        document.getElementById(
            "bulkSubject"
        ).value.trim();


    const topic =
        document.getElementById(
            "bulkTopic"
        ).value.trim();


    // -------------------------
    // VALIDATION
    // -------------------------

    if (!file) {

        bulkMessage.textContent =
            "⚠️ Please select a JSON file.";

        return;

    }


    if (!file.name.toLowerCase().endsWith(".json")) {

        bulkMessage.textContent =
            "❌ Please select a .json file.";

        return;

    }


    if (!subject) {

        bulkMessage.textContent =
            "⚠️ Please select a subject.";

        return;

    }


    if (!topic) {

        bulkMessage.textContent =
            "⚠️ Please enter a topic.";

        return;

    }


    try {

        bulkMessage.textContent =
            "⏳ Reading JSON file...";


        // -------------------------
        // READ FILE
        // -------------------------

        const text =
            await file.text();


        let questions;


        try {

            questions =
                JSON.parse(text);

        }

        catch (jsonError) {

            throw new Error(
                "Invalid JSON format."
            );

        }


        // -------------------------
        // ARRAY CHECK
        // -------------------------

        if (!Array.isArray(questions)) {

            throw new Error(
                "JSON must contain an array of questions."
            );

        }


        if (questions.length === 0) {

            throw new Error(
                "JSON file contains no questions."
            );

        }


        console.log(
            "Questions in JSON:",
            questions.length
        );


        // -------------------------
        // PROGRESS ELEMENTS
        // -------------------------

        const progressContainer =
            document.getElementById(
                "uploadProgressContainer"
            );


        const progressBar =
            document.getElementById(
                "uploadProgress"
            );


        const percent =
            document.getElementById(
                "uploadPercent"
            );


        const status =
            document.getElementById(
                "uploadStatus"
            );


        progressContainer.style.display =
            "block";


        progressBar.style.width =
            "0%";


        percent.textContent =
            "0%";


        status.textContent =
            "Checking existing questions...";


        // -------------------------
        // EXISTING QUESTIONS
        // -------------------------

        const existingSnapshot =
            await getDocs(
                collection(
                    db,
                    "questions"
                )
            );


        const existingQuestions =
            new Set();


        existingSnapshot.forEach((questionDoc) => {

            const data =
                questionDoc.data();


            const normalized =
                normalizeText(
                    data.question || ""
                );


            if (normalized) {

                existingQuestions.add(
                    normalized
                );

            }

        });


        // -------------------------
        // UPLOAD
        // -------------------------

        let uploaded = 0;
        let skipped = 0;
        let invalid = 0;


        const total =
            questions.length;


        for (
            let i = 0;
            i < total;
            i++
        ) {

            const q =
                questions[i];


            if (
                !q ||
                typeof q !== "object"
            ) {

                invalid++;

                updateUploadProgress(
                    i + 1,
                    total,
                    progressBar,
                    percent,
                    status
                );

                continue;

            }


            const questionText =
                String(
                    q.question || ""
                ).trim();
 if (!questionText) {

                invalid++;

                updateUploadProgress(
                    i + 1,
                    total,
                    progressBar,
                    percent,
                    status
                );

                continue;

            }


            const normalized =
                normalizeText(
                    questionText
                );


            // -------------------------
            // DUPLICATE
            // -------------------------

            if (
                existingQuestions.has(
                    normalized
                )
            ) {

                skipped++;

                updateUploadProgress(
                    i + 1,
                    total,
                    progressBar,
                    percent,
                    status
                );

                continue;

            }


            // -------------------------
            // OPTIONS
            // -------------------------

            let options = [];


            if (
                Array.isArray(q.options)
            ) {

                options =
                    q.options.map(
                        option =>
                            String(
                                option ?? ""
                            ).trim()
                    );

            }

            else {

                options = [

                    String(
                        q.optionA ?? ""
                    ).trim(),

                    String(
                        q.optionB ?? ""
                    ).trim(),

                    String(
                        q.optionC ?? ""
                    ).trim(),

                    String(
                        q.optionD ?? ""
                    ).trim()

                ];

            }


            // Need exactly 4 options

            if (
                options.length !== 4 ||
                options.some(
                    option => !option
                )
            ) {

                invalid++;

                updateUploadProgress(
                    i + 1,
                    total,
                    progressBar,
                    percent,
                    status
                );

                continue;

            }


            // -------------------------
            // ANSWER
            // -------------------------

            let answer =
                Number(
                    q.answer
                );


            // Support A/B/C/D

            if (
                typeof q.answer ===
                "string"
            ) {

                const answerText =
                    q.answer
                        .trim()
                        .toUpperCase();


                if (
                    answerText === "A"
                ) answer = 0;


                if (
                    answerText === "B"
                ) answer = 1;


                if (
                    answerText === "C"
                ) answer = 2;


                if (
                    answerText === "D"
                ) answer = 3;

            }


            if (
                !Number.isInteger(answer) ||
                answer < 0 ||
                answer > 3
            ) {

                invalid++;

                updateUploadProgress(
                    i + 1,
                    total,
                    progressBar,
                    percent,
                    status
                );

                continue;

            }


            // -------------------------
            // FIRESTORE ADD
            // -------------------------

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
                        q.subject
                            ? String(q.subject)
                            : subject,

                    topic:
                        q.topic
                            ? String(q.topic)
                            : topic,

                    explanation:
                        q.explanation
                            ? String(q.explanation)
                            : "",

                    createdAt:
                        serverTimestamp()

                }
            );


            existingQuestions.add(
                normalized
            );


            uploaded++;


            // -------------------------
            // PROGRESS
            // -------------------------

            updateUploadProgress(
                i + 1,
                total,
                progressBar,
                percent,
                status
            );

        }


        // -------------------------
        // COMPLETE
        // -------------------------

        progressBar.style.width =
            "100%";

        percent.textContent =
            "100%";


        status.textContent =
            "✅ Upload completed";


        bulkMessage.textContent =
            `✅ Complete! ${uploaded} uploaded, ${skipped} duplicates skipped, ${invalid} invalid skipped.`;


        console.log(
            "Bulk upload completed",
            {
                uploaded,
                skipped,
                invalid
            }
        );


        // Reset file

        bulkFile.value = "";


        document.getElementById(
            "selectedFile"
        ).textContent =
            "No file selected";


        // Update dashboard

        await loadDashboardStats();


        // Refresh questions if manage page exists

        if (
            document.getElementById(
                "manageQuestionsSection"
            ).classList.contains(
                "active-section"
            )
        ) {

            await loadQuestions();

        }

    }

    catch (error) {

        console.error(
            "❌ Bulk upload error:",
            error
        );


        bulkMessage.textContent =
            "❌ " +
            (
                error.message ||
                "Bulk upload failed."
            );

    }

}


// ============================================================
// UPDATE UPLOAD PROGRESS
// ============================================================

function updateUploadProgress(
    current,
    total,
    progressBar,
    percent,
    status
) {

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

// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {

    const list =
        document.getElementById(
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
                collection(
                    db,
                    "questions"
                )
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
        document.getElementById(
            "questionList"
        );


    if (!list) return;


    const search =
        (
            document.getElementById(
                "questionSearch"
            )?.value || ""
        )
            .trim()
            .toLowerCase();


    const subject =
        document.getElementById(
            "filterSubject"
        )?.value || "all";


    const filtered =
        allQuestions.filter((q) => {

            const question =
                String(
                    q.question || ""
                ).toLowerCase();


            const topic =
                String(
                    q.topic || ""
                ).toLowerCase();


            const qSubject =
                String(
                    q.subject || ""
                );


            const matchesSearch =
                !search ||
                question.includes(search) ||
                topic.includes(search);


            const matchesSubject =
                subject === "all" ||
                qSubject === subject;


            return (
                matchesSearch &&
                matchesSubject
            );

        });


    if (!filtered.length) {

        list.innerHTML = `
            <div class="empty-box">
                📭 No questions found.
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    filtered.forEach((q, index) => {

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


        let optionsHTML = "";


        options.forEach(
            (option, optionIndex) => {

                const isCorrect =
                    Number(q.answer) ===
                    optionIndex;


                optionsHTML += `
                    <div class="${
                        isCorrect
                            ? "correct-option"
                            : ""
                    }">
                        ${
                            String.fromCharCode(
                                65 + optionIndex
                            )
                        }. ${
                            escapeHTML(
                                option
                            )
                        }
                    </div>
                `;

            }
        );


        card.innerHTML = `

            <div class="question-card-top">

                <span class="question-index">
                    #${index + 1}
                </span>

                <span class="subject-badge">
                    ${escapeHTML(
                        q.subject || "-"
                    )}
                </span>

            </div>

            <h3>
                ${escapeHTML(
                    q.question || "-"
                )}
            </h3>

            <div class="admin-options">
                ${optionsHTML}
            </div>

            <p class="topic-text">
                📌 Topic:
                ${escapeHTML(
                    q.topic || "-"
                )}
            </p>

            <button
                class="delete-question-btn"
                data-id="${q.id}">
                🗑️ Delete Question
            </button>

        `;


        list.appendChild(card);

    });


    // Delete buttons

    list
        .querySelectorAll(
            ".delete-question-btn"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    await deleteQuestion(
                        button.dataset.id
                    );

                }
            );

        });

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
            "✅ Question deleted successfully."
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
            "❌ Failed to delete question."
        );

    }

}


// ============================================================
// FILTERS
// ============================================================

function initializeFilters() {

    const questionSearch =
        document.getElementById(
            "questionSearch"
        );


    const filterSubject =
        document.getElementById(
            "filterSubject"
        );


    if (questionSearch) {

        questionSearch.addEventListener(
            "input",
            renderQuestions
        );

    }


    if (filterSubject) {

        filterSubject.addEventListener(
            "change",
            renderQuestions
        );

    }


    const resultSearch =
        document.getElementById(
            "resultSearch"
        );


    const resultTestType =
        document.getElementById(
            "resultTestType"
        );


    if (resultSearch) {

        resultSearch.addEventListener(
            "input",
            renderResults
        );

    }


    if (resultTestType) {

        resultTestType.addEventListener(
            "change",
            renderResults
        );

    }

}


// ============================================================
// LOAD RESULTS
// ============================================================

async function loadResults() {

    const list =
        document.getElementById(
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
                collection(
                    db,
                    "results"
                )
            );


        allResults = [];


        snapshot.forEach((resultDoc) => {

            allResults.push({

                id:
                    resultDoc.id,

                ...resultDoc.data()

            });

        });


        // Latest first

        allResults.sort((a, b) => {

            const aTime =
                a.createdAt?.toMillis?.() || 0;

            const bTime =
                b.createdAt?.toMillis?.() || 0;

            return bTime - aTime;

        });


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
        document.getElementById(
            "resultsList"
        );


    if (!list) return;


    const search =
        (
            document.getElementById(
                "resultSearch"
            )?.value || ""
        )
            .trim()
            .toLowerCase();


    const testType =
        document.getElementById(
            "resultTestType"
        )?.value || "all";


    const filtered =
        allResults.filter((result) => {

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

        });


    if (!filtered.length) {

        list.innerHTML = `
            <div class="empty-box">
                📭 No results found.
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    filtered.forEach((result) => {

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


        const percentage =
            total > 0
                ? Math.round(
                    (score / total) * 100
                )
                : 0;


        let dateText =
            "-";


        if (
            result.createdAt &&
            typeof result.createdAt.toDate ===
                "function"
        ) {

            dateText =
                result.createdAt
                    .toDate()
                    .toLocaleString();

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
                        📍 ${escapeHTML(
                            result.district ||
                            "-"
                        )}
                    </p>

                </div>

                <span class="test-type-badge">
                    ${escapeHTML(
                        String(
                            result.testType ||
                            "-"
                        ).toUpperCase()
                    )}
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
                🕒 ${escapeHTML(dateText)}
            </small>

        `;


        list.appendChild(card);

    });

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// END
// ============================================================

console.log(
    "✅ G THE GENIUS ADMIN PANEL JS LOADED"
);

            
            
