// ===========================================================
// G THE GENIUS MOCK TEST PORTAL
// RESULT.JS
// PART 1
// Professional ES6 Module
// ===========================================================


// ===========================================================
// IMPORTS
// ===========================================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===========================================================
// RESULT DATA
// ===========================================================

let currentUser = null;

let questions = [];

let selectedAnswers = [];

let score = 0;

let correct = 0;

let wrong = 0;

let skipped = 0;

let percentage = 0;

let overallRank = "-";

let districtRank = "-";

let xpEarned = 0;

let level = 1;

let testType = "daily";

let district = "";

let totalQuestions = 0;


// ===========================================================
// HTML ELEMENTS
// ===========================================================

const scoreEl = document.getElementById("score");

const correctEl = document.getElementById("correct");

const wrongEl = document.getElementById("wrong");

const skippedEl = document.getElementById("skipped");

const percentageEl = document.getElementById("percentage");

const overallRankEl = document.getElementById("overallRank");

const districtRankEl = document.getElementById("districtRank");

const xpEl = document.getElementById("xp");

const levelEl = document.getElementById("level");

const reviewContainer = document.getElementById("reviewContainer");

const shareBtn = document.getElementById("shareBtn");

const retryBtn = document.getElementById("retryBtn");


// ===========================================================
// AUTH
// ===========================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

    await loadResult();

});

// ===========================================================
// LOAD RESULT
// ===========================================================

async function loadResult() {

    try {

        // Test type
        testType = localStorage.getItem("testType") || "daily";

        // District
        district = localStorage.getItem("district") || "";

        // Questions
        questions = JSON.parse(
            localStorage.getItem("questions") || "[]"
        );

        // Answers
        selectedAnswers = JSON.parse(
            localStorage.getItem("selectedAnswers") || "[]"
        );

        totalQuestions = questions.length;

        if (totalQuestions === 0) {

            alert("Result data not found.");

            window.location.href = "dashboard.html";

            return;

        }

        calculateResult();

        displayResult();

        await saveResult();

        await calculateRanks();

        showReview();

        setupButtons();

    } catch (error) {

        console.error(error);

        alert("Unable to load result.");

    }

}



// ===========================================================
// CALCULATE RESULT
// ===========================================================

function calculateResult() {

    score = 0;
    correct = 0;
    wrong = 0;
    skipped = 0;

    questions.forEach((question, index) => {

        const answer = selectedAnswers[index];

        if (
            answer === undefined ||
            answer === null ||
            answer === ""
        ) {

            skipped++;
            return;

        }

        if (answer === question.answer) {

            correct++;
            score++;

        } else {

            wrong++;

        }

    });

    percentage = Number(
        ((score / totalQuestions) * 100).toFixed(2)
    );

    calculateXP();

}



// ===========================================================
// XP SYSTEM
// ===========================================================

function calculateXP() {

    let bonus = 0;

    if (percentage >= 90)
        bonus = 30;
    else if (percentage >= 80)
        bonus = 20;
    else if (percentage >= 70)
        bonus = 15;
    else if (percentage >= 60)
        bonus = 10;
    else
        bonus = 5;

    xpEarned = (correct * 10) + bonus;

}



// ===========================================================
// LEVEL SYSTEM
// Every 50 XP = 1 Level
// ===========================================================

function calculateLevel(totalXP) {

    return Math.floor(totalXP / 50) + 1;

}



// ===========================================================
// GRADE SYSTEM
// ===========================================================

function getGrade(percent) {

    if (percent >= 95) return "A+";

    if (percent >= 90) return "A";

    if (percent >= 80) return "B+";

    if (percent >= 70) return "B";

    if (percent >= 60) return "C";

    if (percent >= 50) return "D";

    return "F";

}

// ===========================================================
// DISPLAY RESULT
// ===========================================================

function displayResult() {

    const grade = getGrade(percentage);

    if (scoreEl)
        scoreEl.textContent = `${score} / ${totalQuestions}`;

    if (correctEl)
        correctEl.textContent = correct;

    if (wrongEl)
        wrongEl.textContent = wrong;

    if (skippedEl)
        skippedEl.textContent = skipped;

    if (percentageEl)
        percentageEl.textContent = `${percentage}%`;

    if (xpEl)
        xpEl.textContent = `+${xpEarned} XP`;

    // Optional Grade Element
    const gradeEl = document.getElementById("grade");

    if (gradeEl)
        gradeEl.textContent = grade;

}



// ===========================================================
// SAVE RESULT TO FIRESTORE
// ===========================================================

async function saveResult() {

    try {

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        let totalXP = 0;

        let studentName = currentUser.displayName || "Student";

        if (userSnap.exists()) {

            const data = userSnap.data();

            totalXP = data.xp || 0;

            studentName = data.name || studentName;

        }

        totalXP += xpEarned;

        level = calculateLevel(totalXP);

        // Update User Profile
        await setDoc(userRef, {

            name: studentName,
            email: currentUser.email,

            district: district,

            xp: totalXP,

            level: level,

            updatedAt: serverTimestamp()

        }, { merge: true });

        if (levelEl)
            levelEl.textContent = level;

        // Save Result
        const resultId =
            `${currentUser.uid}_${testType}_${Date.now()}`;

        const resultRef = doc(db, "results", resultId);

        await setDoc(resultRef, {

            uid: currentUser.uid,

            name: studentName,

            email: currentUser.email,

            district: district,

            testType: testType,

            totalQuestions: totalQuestions,

            score: score,

            correct: correct,

            wrong: wrong,

            skipped: skipped,

            percentage: percentage,

            grade: getGrade(percentage),

            xpEarned: xpEarned,

            totalXP: totalXP,

            level: level,

            answers: selectedAnswers,

            createdAt: serverTimestamp()

        });

    } catch (error) {

        console.error("Save Result Error:", error);

    }

}

// ===========================================================
// CALCULATE RANKS
// Overall Rank + District Rank
// ===========================================================

async function calculateRanks() {

    try {

        // ==========================================
        // OVERALL RANK
        // ==========================================

        const overallQuery = query(
            collection(db, "results"),
            where("testType", "==", testType),
            orderBy("percentage", "desc"),
            orderBy("score", "desc")
        );

        const overallSnapshot = await getDocs(overallQuery);

        overallRank = "-";

        let overallList = [];

        overallSnapshot.forEach((docSnap) => {
            overallList.push(docSnap.data());
        });

        overallList.sort((a, b) => {

            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }

            if (b.score !== a.score) {
                return b.score - a.score;
            }

            return 0;

        });

        const myEmail = currentUser.email;

        const overallIndex = overallList.findIndex(item =>
            item.email === myEmail &&
            item.testType === testType &&
            item.score === score &&
            item.percentage === percentage
        );

        overallRank =
            overallIndex === -1
                ? overallList.length
                : overallIndex + 1;

        if (overallRankEl) {
            overallRankEl.textContent = "#" + overallRank;
        }


        // ==========================================
        // DISTRICT RANK
        // ==========================================

        const districtQuery = query(
            collection(db, "results"),
            where("testType", "==", testType),
            where("district", "==", district),
            orderBy("percentage", "desc"),
            orderBy("score", "desc")
        );

        const districtSnapshot = await getDocs(districtQuery);

        let districtList = [];

        districtSnapshot.forEach((docSnap) => {
            districtList.push(docSnap.data());
        });

        districtList.sort((a, b) => {

            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }

            if (b.score !== a.score) {
                return b.score - a.score;
            }

            return 0;

        });

        const districtIndex = districtList.findIndex(item =>
            item.email === myEmail &&
            item.testType === testType &&
            item.score === score &&
            item.percentage === percentage
        );

        districtRank =
            districtIndex === -1
                ? districtList.length
                : districtIndex + 1;

        if (districtRankEl) {
            districtRankEl.textContent = "#" + districtRank;
        }

    } catch (error) {

        console.error("Rank Calculation Error:", error);

        if (overallRankEl) overallRankEl.textContent = "-";
        if (districtRankEl) districtRankEl.textContent = "-";
    }

}

// ===========================================================
// RESULT REVIEW
// ===========================================================

function showReview() {

    if (!reviewContainer) return;

    reviewContainer.innerHTML = "";

    questions.forEach((question, index) => {

        const userAnswer = selectedAnswers[index];

        const correctAnswer = question.answer;

        const isCorrect = userAnswer === correctAnswer;

        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `

        <div class="review-header">
            <h3>Question ${index + 1}</h3>
        </div>

        <div class="review-question">
            ${question.question}
        </div>

        <div class="review-your-answer ${isCorrect ? "correct" : "wrong"}">
            <strong>Your Answer:</strong>
            ${
                userAnswer !== undefined &&
                userAnswer !== null &&
                userAnswer !== ""
                    ? userAnswer
                    : "Skipped"
            }
        </div>

        <div class="review-correct-answer">
            <strong>Correct Answer:</strong>
            ${correctAnswer}
        </div>

        <div class="review-explanation">
            <strong>Explanation:</strong><br>
            ${question.explanation || "Explanation not available."}
        </div>

        `;

        reviewContainer.appendChild(card);

    });

}



// ===========================================================
// SHARE RESULT
// ===========================================================

async function shareResult() {

    const text =

`🏆 G THE GENIUS MOCK TEST RESULT

✅ Score : ${score}/${totalQuestions}

📊 Percentage : ${percentage}%

✔ Correct : ${correct}

❌ Wrong : ${wrong}

⏭ Skipped : ${skipped}

🌍 Overall Rank : #${overallRank}

📍 District Rank : #${districtRank}

⭐ XP Earned : +${xpEarned}

🔥 Test : ${testType.toUpperCase()}

https://gthegeniustamil.github.io/G-THE-GENIUS-MOCK-TEST/
`;

    try {

        if (navigator.share) {

            await navigator.share({

                title: "G THE GENIUS Result",

                text: text

            });

        } else {

            await navigator.clipboard.writeText(text);

            alert("Result copied to clipboard.");

        }

    } catch (e) {

        console.log(e);

    }

}



// ===========================================================
// RETRY TEST
// ===========================================================

function retryTest() {

    localStorage.removeItem("selectedAnswers");

    window.location.href =
        `mocktest.html?type=${testType}`;

}



// ===========================================================
// BUTTON EVENTS
// ===========================================================

function setupButtons() {

    if (shareBtn) {

        shareBtn.addEventListener(

            "click",

            shareResult

        );

    }

    if (retryBtn) {

        retryBtn.addEventListener(

            "click",

            retryTest

        );

    }

}



// ===========================================================
// OPTIONAL HOME BUTTON
// ===========================================================

const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {

    homeBtn.addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });

}



// ===========================================================
// OPTIONAL LEADERBOARD BUTTON
// ===========================================================

const leaderboardBtn =
document.getElementById("leaderboardBtn");

if (leaderboardBtn) {

    leaderboardBtn.addEventListener("click", () => {

        window.location.href = "leaderboard.html";

    });

}



// ===========================================================
// CLEAR TEMP DATA
// (Keep questions for review until leaving page)
// ===========================================================

window.addEventListener("beforeunload", () => {

    // Uncomment if you want to clear after viewing result

    // localStorage.removeItem("questions");
    // localStorage.removeItem("selectedAnswers");

});



// ===========================================================
// END OF FILE
// ===========================================================

