// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// DASHBOARD JS - FINAL
// PART 1 / 5
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const studentName =
document.getElementById("studentName");

const studentDistrict =
document.getElementById("studentDistrict");

const studentRank =
document.getElementById("studentRank");

const totalMarks =
document.getElementById("totalMarks");

const completedTests =
document.getElementById("completedTests");

const testCount =
document.getElementById("testCount");

const level =
document.getElementById("level");

const coins =
document.getElementById("coins");

const xpBar =
document.getElementById("xpBar");


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentUser = null;

let myResults = [];

let totalScore = 0;

let totalTests = 0;

let district = "";

let student = "";

console.log("Dashboard Part 1 Loaded ✅");

// ==========================================
// DASHBOARD JS FINAL
// PART 2 / 5
// LOAD STUDENT RESULTS
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    try {

        const q = query(
            collection(db, "results"),
            where("studentId", "==", user.uid),
            orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);

        myResults = [];
        totalScore = 0;
        totalTests = 0;

        snapshot.forEach((doc) => {

            const data = doc.data();

            myResults.push(data);

            totalScore += Number(data.score || 0);
            totalTests++;

            student = data.studentName || student;
            district = data.district || district;

        });

        // Greeting
        const hour = new Date().getHours();

        let greeting = "👋 Welcome";

        if (hour < 12) {

            greeting = "🌅 Good Morning";

        } else if (hour < 17) {

            greeting = "☀️ Good Afternoon";

        } else {

            greeting = "🌙 Good Evening";

        }

        // Student Name
        if (studentName) {

            studentName.innerHTML = `
                <small style="display:block;color:#FFD700;font-size:13px;">
                    ${greeting}
                </small>
                ${student || "Student"}
            `;

        }

        // District
        if (studentDistrict) {

            studentDistrict.innerText =
            district || "-";

        }

        // Total Marks
        if (totalMarks) {

            totalMarks.innerText =
            totalScore;

        }

        // Tests Completed
        if (completedTests) {

            completedTests.innerText =
            totalTests;

        }

        // Test Count
        if (testCount) {

            testCount.innerText =
            totalTests;

        }

        console.log("Dashboard Student Data Loaded ✅");

    }

    catch (error) {

        console.error(
            "Dashboard Error : ",
            error
        );

    }

});

// ==========================================
// DASHBOARD JS FINAL
// PART 3 / 5
// RANK + XP + COINS
// ==========================================

try {

    // Load All Results
    const allSnapshot = await getDocs(
        collection(db, "results")
    );

    let leaderboard = [];

    allSnapshot.forEach((doc) => {

        const data = doc.data();

        const index = leaderboard.findIndex(
            s => s.studentId === data.studentId
        );

        if (index === -1) {

            leaderboard.push({
                studentId: data.studentId,
                studentName: data.studentName,
                totalScore: Number(data.score || 0)
            });

        } else {

            leaderboard[index].totalScore +=
            Number(data.score || 0);

        }

    });

    // Highest Score First
    leaderboard.sort(
        (a, b) =>
        b.totalScore - a.totalScore
    );

    // Find My Rank
    const myRankIndex =
    leaderboard.findIndex(
        s => s.studentId === currentUser.uid
    );

    if (studentRank) {

        studentRank.innerText =
        myRankIndex >= 0
        ? myRankIndex + 1
        : "-";

    }

    // XP
    const xp =
    Number(localStorage.getItem("xp")) || 0;

    const currentLevel =
    Math.floor(xp / 50) + 1;

    if (level) {

        level.innerText =
        "Level " + currentLevel;

    }

    // XP Progress
    if (xpBar) {

        const progress =
        (xp % 50) * 2;

        xpBar.style.width =
        progress + "%";

    }

    // Coins
    if (coins) {

        coins.innerText =
        Number(
            localStorage.getItem("coins")
        ) || 0;

    }

    console.log("Rank Loaded ✅");

}

catch(error){

    console.error(
        "Rank Error :",
        error
    );

}

// ==========================================
// DASHBOARD JS FINAL
// PART 4 / 5
// MOTIVATION + LEARNING + ADMIN + LOGOUT
// ==========================================

// Daily Motivation Quotes
const quotes = [

"வெற்றி ஒரே நாளில் கிடைக்காது... தினமும் முயற்சி செய்தால் நிச்சயம் கிடைக்கும்.",

"இன்று படிக்கும் ஒவ்வொரு பக்கமும் நாளைய வெற்றிக்கான படிக்கட்டு.",

"கனவு அரசு வேலை என்றால் முயற்சி தினமும் தொடர வேண்டும்.",

"முயற்சி செய்பவர்களுக்கு வெற்றி நிச்சயம்.",

"நேரத்தை சரியாக பயன்படுத்துபவன் வாழ்க்கையில் உயர்வான்.",

"நம்பிக்கை இருந்தால் வெற்றி உறுதி.",

"தினமும் ஒரு Mock Test எழுதுங்கள்."

];

const quoteBox =
document.getElementById("dailyQuote");

if(quoteBox){

    quoteBox.innerText =
    quotes[Math.floor(Math.random() * quotes.length)];

}


// ==========================================
// LEARNING PAGE NAVIGATION
// ==========================================

window.openLearning = function(subject){

    window.location.href =
    "learning.html?subject=" + subject;

};


// ==========================================
// ADMIN ACCESS
// ==========================================

const adminAccess =
document.getElementById("adminAccess");

if(adminAccess){

    if(

        currentUser &&
        currentUser.email ===
        "gthegenius7@gmail.com"

    ){

        adminAccess.style.display = "flex";

    }

    else{

        adminAccess.style.display = "none";

    }

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener(

        "click",

        async()=>{

            try{

                await signOut(auth);

                localStorage.removeItem("lastPage");

                window.location.href =
                "login.html";

            }

            catch(error){

                console.error(
                    error
                );

            }

        }

    );

}

console.log("Dashboard Part 4 Loaded ✅");

// ==========================================
// DASHBOARD JS FINAL
// PART 5 / 5
// FINAL INITIALIZATION
// ==========================================

// Save Last Page
localStorage.setItem(
    "lastPage",
    "dashboard"
);

// Button Click Log
document.querySelectorAll("a").forEach(link=>{

    link.addEventListener("click",()=>{

        console.log(
            "Opening :",
            link.getAttribute("href")
        );

    });

});

// Auto Refresh Dashboard
window.addEventListener(

    "focus",

    async()=>{

        if(currentUser){

            location.reload();

        }

    }

);

// Global Error
window.addEventListener(

    "error",

    (event)=>{

        console.error(
            "Dashboard Error :",
            event.message
        );

    }

);

// Promise Error
window.addEventListener(

    "unhandledrejection",

    (event)=>{

        console.error(
            "Promise Error :",
            event.reason
        );

    }

);

// Dashboard Ready
console.log(`
======================================
G THE GENIUS DASHBOARD READY ✅
--------------------------------------
✔ Student Profile
✔ Good Morning
✔ District
✔ Rank
✔ Total Marks
✔ Tests Completed
✔ XP Level
✔ Coins
✔ Progress Bar
✔ Learning Zone
✔ Admin Access
✔ Logout
✔ Auto Refresh
======================================
`);
