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
// ADMIN MENU
// ============================================================

document
    .querySelectorAll(".menu-card")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const target =
                button.dataset.section;


            document
                .querySelectorAll(".menu-card")
                .forEach((btn) => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            document
                .querySelectorAll(".admin-section")
                .forEach((section) => {

                    section.classList.remove(
                        "active-section"
                    );

                });


            const targetSection =
                document.getElementById(target);


            if (targetSection) {

                targetSection.classList.add(
                    "active-section"
                );

            }


            // Load data when section opens

            if (
                target ===
                "manageQuestionsSection"
            ) {

                loadQuestions();

            }


            if (
                target ===
                "resultsSection"
            ) {

                loadResults();

            }

        });

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
                )
            
