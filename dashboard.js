// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// DASHBOARD JS
// PART 1 / 2
// ==========================================

// Firebase Config
import { auth, db } from "./firebase-config.js";

// Firebase Functions
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// HTML ELEMENTS
// ==========================================

const studentName = document.getElementById("studentName");
const studentDistrict = document.getElementById("studentDistrict");
const testCount = document.getElementById("testCount");
const studentRank = document.getElementById("studentRank");
const totalMarks = document.getElementById("totalMarks");
const completedTests = document.getElementById("completedTests");

const levelBox = document.getElementById("level");
const coinsBox = document.getElementById("coins");
const xpBar = document.getElementById("xpBar");

// ==========================================
// LOGIN CHECK
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {

            const data = studentSnap.data();

            // ===============================
            // GOOD MORNING / AFTERNOON
            // ===============================

            const hour = new Date().getHours();

            let greeting = "👋 Welcome";

            if (hour < 12) {
                greeting = "🌅 Good Morning";
            } else if (hour < 17) {
                greeting = "☀️ Good Afternoon";
            } else {
                greeting = "🌙 Good Evening";
            }

            // ===============================
            // STUDENT NAME
            // ===============================

            if (studentName) {

                studentName.innerHTML = `
                    <small style="display:block;font-size:14px;color:#FFD54F;">
                        ${greeting}
                    </small>

                    <span style="display:block;font-size:24px;font-weight:700;">
                        ${data.name || "Student"}
                    </span>
                `;

            }

            // ===============================
            // DISTRICT
            // ===============================

            if (studentDistrict) {
                studentDistrict.textContent =
                    data.district || "-";
            }

            // ===============================
            // MARKS
            // ===============================

            if (totalMarks) {
                totalMarks.textContent =
                    data.totalMarks || 0;
            }

            // ===============================
            // RANK
            // ===============================

            if (studentRank) {
                studentRank.textContent =
                    data.rank || "-";
            }

            // ===============================
            // COMPLETED TESTS
            // ===============================

            if (completedTests) {
                completedTests.textContent =
                    data.testsCompleted || 0;
            }

            if (testCount) {
                testCount.textContent =
                    data.testsCompleted || 0;
            }

            // ===============================
            // XP / LEVEL / COINS
            // ===============================

            const xp = Number(localStorage.getItem("xp")) || 0;
            const coins = Number(localStorage.getItem("coins")) || 0;

            const level = Math.floor(xp / 50) + 1;

            if (levelBox) {
                levelBox.innerText = "Level " + level;
            }

            if (coinsBox) {
                coinsBox.innerText = coins;
            }

            if (xpBar) {
                xpBar.style.width = ((xp % 50) * 2) + "%";
            }

        }

    } catch (error) {

        console.error("Dashboard Error :", error);

    }

});

// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// DASHBOARD JS
// PART 2 / 2 FINAL
// ==========================================

// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            localStorage.removeItem("student");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout Error :", error);

        }

    });

}

// ==========================================
// DAILY QUOTE
// ==========================================

const quotes = [

    "வெற்றி ஒரே நாளில் கிடைக்காது... தினமும் முயற்சி செய்தால் நிச்சயம் கிடைக்கும்.",

    "இன்று படிக்கும் ஒவ்வொரு பக்கமும் நாளைய வெற்றிக்கான படிக்கட்டு.",

    "கனவு அரசு வேலை என்றால் முயற்சி தினமும் தொடர வேண்டும்.",

    "முயற்சி செய்பவர்களுக்கு வெற்றி நிச்சயம்.",

    "நேரத்தை சரியாக பயன்படுத்துபவன் வாழ்க்கையில் உயர்வான்."

];

const quoteElement = document.getElementById("dailyQuote");

if (quoteElement) {

    quoteElement.innerText =
        quotes[Math.floor(Math.random() * quotes.length)];

}

// ==========================================
// LEARNING BUTTON
// ==========================================

window.openLearning = function (subject) {

    window.location.href =
        "learning.html?subject=" + subject;

};

// ==========================================
// ADMIN ACCESS
// ==========================================

const adminAccess =
document.getElementById("adminAccess");

onAuthStateChanged(auth, (user) => {

    if (!adminAccess) return;

    if (
        user &&
        user.email === "gthegenius7@gmail.com"
    ) {

        adminAccess.style.display = "flex";

    } else {

        adminAccess.style.display = "none";

    }

});

// ==========================================
// SAVE LAST PAGE
// ==========================================

localStorage.setItem(
    "lastPage",
    "dashboard"
);

// ==========================================
// LINK LOG
// ==========================================

document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        console.log("Opening :", link.href);

    });

});

// ==========================================
// DASHBOARD READY
// ==========================================

console.log("====================================");
console.log("G THE GENIUS Dashboard Ready ✅");
console.log("Premium Dashboard Loaded");
console.log("====================================");
