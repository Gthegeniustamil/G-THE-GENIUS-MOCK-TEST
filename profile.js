// ==========================================
// G THE GENIUS - PROFILE JS
// v5.0
// ==========================================

import { db, auth } from "./firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    setDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// VARIABLES
// ==========================================

let currentUser = null;
let profileResults = [];


// ==========================================
// ELEMENT HELPER
// ==========================================

function el(id) {
    return document.getElementById(id);
}


// ==========================================
// GET LOCAL STUDENT
// ==========================================

function getLocalStudent() {

    try {

        return JSON.parse(
            localStorage.getItem("student") || "{}"
        );

    } catch (error) {

        console.error(
            "Student LocalStorage Error:",
            error
        );

        return {};

    }

}


// ==========================================
// GET STUDENT NAME
// ==========================================

function getStudentName() {

    const student = getLocalStudent();

    return (
        localStorage.getItem("studentName") ||
        student.name ||
        currentUser?.displayName ||
        "Student"
    );

}


// ==========================================
// GET DISTRICT
// ==========================================

function getDistrict() {

    const student = getLocalStudent();

    return (
        localStorage.getItem("district") ||
        student.district ||
        "-"
    );

}


// ==========================================
// GET EMAIL
// ==========================================

function getEmail() {

    const student = getLocalStudent();

    return (
        student.email ||
        currentUser?.email ||
        "-"
    );

}


// ==========================================
// UPDATE PROFILE UI
// ==========================================

function updateProfileUI() {

    const name =
        getStudentName();

    const district =
        getDistrict();

    const email =
        getEmail();


    // Hero

    if (el("profileName")) {

        el("profileName").textContent =
            name;

    }


    if (el("profileDistrict")) {

        el("profileDistrict").textContent =
            `📍 ${district}`;

    }


    if (el("profileEmail")) {

        el("profileEmail").textContent =
            `📧 ${email}`;

    }


    // Personal information

    if (el("infoName")) {

        el("infoName").textContent =
            name;

    }


    if (el("infoDistrict")) {

        el("infoDistrict").textContent =
            district;

    }


    if (el("infoEmail")) {

        el("infoEmail").textContent =
            email;

    }


    // User ID

    if (el("infoUserId")) {

        el("infoUserId").textContent =
            currentUser?.uid ||
            "Guest";

    }


    // Avatar

    if (el("profileAvatar")) {

        const firstLetter =
            name
                .trim()
                .charAt(0)
                .toUpperCase() || "G";

        el("profileAvatar").textContent =
            firstLetter;

    }


    // Edit fields

    if (el("editName")) {

        el("editName").value =
            name === "Student" ? "" : name;

    }


    if (el("editDistrict")) {

        el("editDistrict").value =
            district === "-" ? "" : district;

    }


    if (el("editEmail")) {

        el("editEmail").value =
            email === "-" ? "" : email;

    }

}


// ==========================================
// LOAD PAGE
// ==========================================

function hideLoader() {

    const loader =
        el("pageLoader");

    if (!loader) return;

    loader.classList.add("hidden");

    setTimeout(() => {

        loader.style.display =
            "none";

    }, 400);

}


// ==========================================
// FIREBASE AUTH
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser = user;

        updateProfileUI();

        await loadResults();

        updateStatistics();

        updateAchievements();

        hideLoader();

    }
);

// ==========================================
// LOAD RESULTS FROM FIRESTORE
// ==========================================

async function loadResults() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "results")
            );


        profileResults = [];


        snapshot.forEach((resultDoc) => {

            const data =
                resultDoc.data();


            // ----------------------------------
            // Only current student's results
            // ----------------------------------

            const studentName =
                data.studentName || "";


            const currentName =
                getStudentName();


            const uid =
                data.uid || "";


            const matchesUID =
                currentUser &&
                uid &&
                uid === currentUser.uid;


            const matchesName =
                studentName &&
                currentName &&
                studentName.toLowerCase() ===
                currentName.toLowerCase();


            if (matchesUID || matchesName) {

                profileResults.push({
                    id: resultDoc.id,
                    ...data
                });

            }

        });


        console.log(
            "Profile Results:",
            profileResults.length
        );


    } catch (error) {

        console.error(
            "Profile Results Loading Error:",
            error
        );

        profileResults = [];

    }

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const totalTests =
        profileResults.length;


    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;

    let bestScore = 0;
    let totalScore = 0;


    // ======================================
    // CALCULATE EACH RESULT
    // ======================================

    profileResults.forEach((result) => {

        const score =
            Number(result.score || 0);


        const total =
            Number(
                result.totalQuestions ||
                result.total ||
                0
            );


        totalScore += score;


        if (score > bestScore) {

            bestScore =
                score;

        }


        // ----------------------------------
        // Correct
        // ----------------------------------

        totalCorrect +=
            score;


        // ----------------------------------
        // Wrong / Skipped
        // ----------------------------------

        if (result.correct !== undefined) {

            totalCorrect =
                totalCorrect -
                score +
                Number(result.correct || 0);

        }


        if (result.wrong !== undefined) {

            totalWrong +=
                Number(result.wrong || 0);

        }


        if (result.skipped !== undefined) {

            totalSkipped +=
                Number(result.skipped || 0);

        }
        else {

            const answered =
                Number(
                    result.correct ||
                    score ||
                    0
                ) +
                Number(
                    result.wrong || 0
                );


            const skipped =
                total -
                answered;


            if (skipped > 0) {

                totalSkipped +=
                    skipped;

            }

        }

    });


    // ======================================
    // AVERAGE SCORE
    // ======================================

    let averageScore = 0;


    if (totalTests > 0) {

        averageScore =
            Math.round(
                totalScore /
                totalTests
            );

    }


    // ======================================
    // DISPLAY
    // ======================================

    if (el("totalTests")) {

        el("totalTests").textContent =
            totalTests;

    }


    if (el("totalCorrect")) {

        el("totalCorrect").textContent =
            totalCorrect;

    }


    if (el("totalWrong")) {

        el("totalWrong").textContent =
            totalWrong;

    }


    if (el("totalSkipped")) {

        el("totalSkipped").textContent =
            totalSkipped;

    }


    if (el("bestScore")) {

        el("bestScore").textContent =
            bestScore;

    }


    if (el("averageScore")) {

        el("averageScore").textContent =
            averageScore;

    }


    // ======================================
    // TEST TYPE COUNTS
    // ======================================

    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let practice = 0;


    profileResults.forEach((result) => {

        const type =
            String(
                result.testType ||
                result.type ||
                ""
            ).toLowerCase();


        if (type === "daily") {

            daily++;

        }
        else if (type === "weekly") {

            weekly++;

        }
        else if (type === "monthly") {

            monthly++;

        }
        else if (
            type === "practice" ||
            type === "subject" ||
            type === "topic"
        ) {

            practice++;

        }

    });


    if (el("dailyTests")) {

        el("dailyTests").textContent =
            daily;

    }


    if (el("weeklyTests")) {

        el("weeklyTests").textContent =
            weekly;

    }


    if (el("monthlyTests")) {

        el("monthlyTests").textContent =
            monthly;

    }


    if (el("practiceTests")) {

        el("practiceTests").textContent =
            practice;

    }


    console.log(
        "Profile Statistics Updated"
    );

}


// ==========================================
// ACHIEVEMENTS
// ==========================================

function updateAchievements() {

    const totalTests =
        profileResults.length;


    unlockAchievement(
        "achievementFirst",
        totalTests >= 1
    );


    unlockAchievement(
        "achievement10",
        totalTests >= 10
    );


    unlockAchievement(
        "achievement50",
        totalTests >= 50
    );


    unlockAchievement(
        "achievement100",
        totalTests >= 100
    );

}


// ==========================================
// UNLOCK ACHIEVEMENT
// ==========================================

function unlockAchievement(
    id,
    unlocked
) {

    const achievement =
        el(id);


    if (!achievement) return;


    if (unlocked) {

        achievement.classList.remove(
            "locked"
        );

        achievement.classList.add(
            "unlocked"
        );

    }
    else {

        achievement.classList.add(
            "locked"
        );

        achievement.classList.remove(
            "unlocked"
        );

    }

}

// ==========================================
// EDIT PROFILE
// ==========================================

function openEditModal() {

    updateProfileUI();

    const modal =
        el("editModal");

    if (!modal) return;

    modal.classList.add("show");

}


// ==========================================
// CLOSE EDIT MODAL
// ==========================================

function closeEditModal() {

    const modal =
        el("editModal");

    if (!modal) return;

    modal.classList.remove("show");

    if (el("profileFormMessage")) {

        el("profileFormMessage").textContent =
            "";

    }

}


// ==========================================
// SAVE PROFILE
// ==========================================

async function saveProfile(event) {

    event.preventDefault();


    const name =
        el("editName")?.value.trim() || "";


    const district =
        el("editDistrict")?.value.trim() || "";


    const email =
        el("editEmail")?.value.trim() || "";


    const message =
        el("profileFormMessage");


    if (!name) {

        if (message) {

            message.textContent =
                "⚠️ Please enter your name.";

        }

        return;

    }


    if (!district) {

        if (message) {

            message.textContent =
                "⚠️ Please enter your district.";

        }

        return;

    }


    try {

        // ----------------------------------
        // Save LocalStorage
        // ----------------------------------

        localStorage.setItem(
            "studentName",
            name
        );


        localStorage.setItem(
            "district",
            district
        );


        const student =
            getLocalStudent();


        student.name =
            name;


        student.district =
            district;


        if (email) {

            student.email =
                email;

        }


        localStorage.setItem(
            "student",
            JSON.stringify(student)
        );


        // ----------------------------------
        // Firebase User Profile
        // ----------------------------------

        if (currentUser) {

            try {

                await updateProfile(
                    currentUser,
                    {
                        displayName: name
                    }
                );

            } catch (profileError) {

                console.warn(
                    "Firebase Profile Update:",
                    profileError
                );

            }

        }


        // ----------------------------------
        // Firestore Student Profile
        // ----------------------------------

        if (currentUser) {

            try {

                await setDoc(
                    doc(
                        db,
                        "students",
                        currentUser.uid
                    ),
                    {
                        uid:
                            currentUser.uid,

                        name:
                            name,

                        district:
                            district,

                        email:
                            email ||
                            currentUser.email ||
                            "",

                        updatedAt:
                            new Date()
                    },
                    {
                        merge: true
                    }
                );

            } catch (firestoreError) {

                console.warn(
                    "Firestore Profile Save:",
                    firestoreError
                );

            }

        }


        // ----------------------------------
        // Update UI
        // ----------------------------------

        updateProfileUI();


        if (message) {

            message.textContent =
                "✅ Profile updated successfully!";

            message.classList.add(
                "success"
            );

        }


        setTimeout(() => {

            closeEditModal();

        }, 900);


    } catch (error) {

        console.error(
            "Profile Save Error:",
            error
        );


        if (message) {

            message.textContent =
                "❌ Unable to save profile.";

        }

    }

}


// ==========================================
// LOGOUT MODAL
// ==========================================

function openLogoutModal() {

    const modal =
        el("logoutModal");

    if (!modal) return;

    modal.classList.add("show");

}


// ==========================================
// CLOSE LOGOUT MODAL
// ==========================================

function closeLogoutModal() {

    const modal =
        el("logoutModal");

    if (!modal) return;

    modal.classList.remove("show");

}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        await signOut(auth);


        // Clear login related data

        localStorage.removeItem(
            "studentName"
        );

        localStorage.removeItem(
            "district"
        );

        localStorage.removeItem(
            "student"
        );


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );


        alert(
            "❌ Logout failed. Please try again."
        );

    }

}


// ==========================================
// NAVIGATION
// ==========================================

function goToPage(page) {

    window.location.href =
        page;

}


// ==========================================
// EVENT LISTENERS
// ==========================================


// ------------------------------------------
// Back
// ------------------------------------------

if (el("backBtn")) {

    el("backBtn")
        .addEventListener(
            "click",
            () => {

                if (
                    document.referrer &&
                    document.referrer !==
                    window.location.href
                ) {

                    history.back();

                }
                else {

                    goToPage(
                        "dashboard.html"
                    );

                }

            }
        );

}


// ------------------------------------------
// Refresh
// ------------------------------------------

if (el("refreshBtn")) {

    el("refreshBtn")
        .addEventListener(
            "click",
            async () => {

                el("refreshBtn").textContent =
                    "⏳";


                await loadResults();

                updateStatistics();

                updateAchievements();

                updateProfileUI();


                el("refreshBtn").textContent =
                    "↻";

            }
        );

}


// ------------------------------------------
// Edit Profile
// ------------------------------------------

if (el("editProfileBtn")) {

    el("editProfileBtn")
        .addEventListener(
            "click",
            openEditModal
        );

}


// ------------------------------------------
// Close Edit
// ------------------------------------------

if (el("closeModalBtn")) {

    el("closeModalBtn")
        .addEventListener(
            "click",
            closeEditModal
        );

}


if (el("cancelEditBtn")) {

    el("cancelEditBtn")
        .addEventListener(
            "click",
            closeEditModal
        );

}


// ------------------------------------------
// Profile Form
// ------------------------------------------

if (el("profileForm")) {

    el("profileForm")
        .addEventListener(
            "submit",
            saveProfile
        );

}


// ------------------------------------------
// Logout Button
// ------------------------------------------

if (el("logoutBtn")) {

    el("logoutBtn")
        .addEventListener(
            "click",
            openLogoutModal
        );

}


// ------------------------------------------
// Cancel Logout
// ------------------------------------------

if (el("cancelLogoutBtn")) {

    el("cancelLogoutBtn")
        .addEventListener(
            "click",
            closeLogoutModal
        );

}


// ------------------------------------------
// Confirm Logout
// ------------------------------------------

if (el("confirmLogoutBtn")) {

    el("confirmLogoutBtn")
        .addEventListener(
            "click",
            logoutUser
        );

}


// ==========================================
// PAGE NAVIGATION
// ==========================================

if (el("dashboardBtn")) {

    el("dashboardBtn")
        .addEventListener(
            "click",
            () => {

                goToPage(
                    "dashboard.html"
                );

            }
        );

}


if (el("homeNav")) {

    el("homeNav")
        .addEventListener(
            "click",
            () => {

                goToPage(
                    "dashboard.html"
                );

            }
        );

}


if (el("practiceNav")) {

    el("practiceNav")
        .addEventListener(
            "click",
            () => {

                goToPage(
                    "practice.html"
                );

            }
        );

}


if (el("leaderboardNav")) {

    el("leaderboardNav")
        .addEventListener(
            "click",
            () => {

                goToPage(
                    "leaderboard.html"
                );

            }
        );

}


if (el("profileNav")) {

    el("profileNav")
        .addEventListener(
            "click",
            () => {

                goToPage(
                    "profile.html"
                );

            }
        );

}


// ------------------------------------------
// Test History
// ------------------------------------------

const historyBtn = el("historyBtn");
const historyPanel = el("historyPanel");
const historyList = el("historyList");

if (historyBtn) {

    historyBtn.addEventListener(
        "click",
        async () => {

            // Show history on same page
            if (historyPanel) {
                historyPanel.style.display = "block";
            }

            if (!historyList) return;

            historyList.innerHTML =
                "⏳ Loading your test history...";

            try {

                const user = auth.currentUser;

                if (!user) {

                    historyList.innerHTML =
                        "❌ Please login again.";

                    return;
                }

                const resultsRef =
                    collection(db, "results");

                const historyQuery =
                    query(
                        resultsRef,
                        where("uid", "==", user.uid)
                    );

                const snapshot =
                    await getDocs(historyQuery);

                if (snapshot.empty) {

                    historyList.innerHTML =
                        "📭 No test history found.";

                    return;
                }

                let history = [];

                snapshot.forEach((doc) => {

                    history.push({
                        id: doc.id,
                        ...doc.data()
                    });

                });

                history.sort((a, b) => {

                    const aTime =
                        a.createdAt?.toMillis?.() || 0;

                    const bTime =
                        b.createdAt?.toMillis?.() || 0;

                    return bTime - aTime;

                });

                historyList.innerHTML = "";

                history.forEach((result) => {

                    const score =
                        Number(result.score || 0);

                    const total =
                        Number(
                            result.totalQuestions || 0
                        );

                    let date = "-";

                    if (result.createdAt) {

                        try {

                            date =
                                result.createdAt
                                    .toDate()
                                    .toLocaleString();

                        } catch {}

                    }

                    const card =
                        document.createElement("div");

                    card.innerHTML = `
                        <div class="history-card">

                            <strong>
                                ${result.testType || "Test"}
                            </strong>

                            <p>
                                📝 Score:
                                ${score} / ${total}
                            </p>

                            <p>
                                📅 ${date}
                            </p>

                        </div>
                    `;

                    historyList.appendChild(card);

                });

            }

            catch (error) {

                console.error(
                    "History Error:",
                    error
                );

                historyList.innerHTML =
                    "❌ Unable to load test history.";

            }

        }
    );

}

// ==========================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==========================================

if (el("editModal")) {

    el("editModal")
        .addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    el("editModal")
                ) {

                    closeEditModal();

                }

            }
        );

}


if (el("logoutModal")) {

    el("logoutModal")
        .addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    el("logoutModal")
                ) {

                    closeLogoutModal();

                }

            }
        );

}


// ==========================================
// INITIAL UI
// ==========================================

updateProfileUI();

console.log(
    "G THE GENIUS Profile JS Loaded Successfully"
);
