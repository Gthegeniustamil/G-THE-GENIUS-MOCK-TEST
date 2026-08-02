// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// DASHBOARD JS FINAL
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
    orderBy,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// HTML ELEMENTS
// ==========================================

const studentName = document.getElementById("studentName");
const studentDistrict = document.getElementById("studentDistrict");
const studentRank = document.getElementById("studentRank");
const totalMarks = document.getElementById("totalMarks");
const completedTests = document.getElementById("completedTests");
const testCount = document.getElementById("testCount");

const level = document.getElementById("level");
const coins = document.getElementById("coins");
const xpBar = document.getElementById("xpBar");

const dailyQuote = document.getElementById("dailyQuote");
const adminAccess = document.getElementById("adminAccess");
const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentUser = null;

let myResults = [];

let leaderboardData = [];

let totalScore = 0;

let totalTests = 0;

let myDistrict = "";

let myName = "";


// ==========================================
// LOGIN CHECK
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    console.log("User Logged In :", user.uid);

    await loadDashboard();

});


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    totalScore = 0;
    totalTests = 0;
    myResults = [];
    leaderboardData = [];

    console.log("Loading Dashboard...");
}
// LOAD STUDENT PROFILE

try {

    const userRef = doc(
        db,
        "users",
        currentUser.uid
    );

    const userSnap = await getDoc(userRef);


    if(userSnap.exists()){

        const userData = userSnap.data();

        myName =
        userData.name || 
        userData.studentName ||
        "Student";


        myDistrict =
        userData.district ||
        "-";

    }

}
catch(error){

    console.error(
        "Profile Load Error",
        error
    );

}
// ==========================================
// LOAD MY RESULTS
// ==========================================

try {

    const q = query(
        collection(db, "results"),
        where("studentId", "==", currentUser.uid),
        orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        const data = doc.data();

        myResults.push(data);

        totalScore += Number(data.score || 0);

        totalTests++;

        if (!myName) {

            myName = data.studentName || "Student";

        }

        if (!myDistrict) {

            myDistrict = data.district || "-";

        }

    });

}
catch (error) {

    console.error(
        "Result Load Error",
        error
    );

}


// ==========================================
// UPDATE STUDENT CARD
// ==========================================

const hour = new Date().getHours();

let greeting = "👋 Welcome";

if (hour < 12) {

    greeting = "🌅 Good Morning";

}
else if (hour < 17) {

    greeting = "☀️ Good Afternoon";

}
else {

    greeting = "🌙 Good Evening";

}

if (studentName) {

    studentName.innerHTML = `
        <small style="display:block;
        color:#FFD700;
        font-size:13px;">
        ${greeting}
        </small>

        ${myName}
    `;

}

if (studentDistrict) {

    studentDistrict.innerHTML =
    myDistrict;

}

if (totalMarks) {

    totalMarks.innerHTML =
    totalScore;

}

if (completedTests) {

    completedTests.innerHTML =
    totalTests;

}

if (testCount) {

    testCount.innerHTML =
    totalTests;

}

console.log("Student Card Loaded ✅");

// ==========================================
// PART 3 / 5
// RANK + XP + COINS
// ==========================================

try {

    const allSnapshot = await getDocs(
        collection(db, "results")
    );

    const studentMap = {};

    allSnapshot.forEach((doc) => {

        const data = doc.data();

        if (!data.studentId) return;

        if (!studentMap[data.studentId]) {

            studentMap[data.studentId] = {

                studentId: data.studentId,
                studentName: data.studentName || "Student",
                totalMarks: 0

            };

        }

        studentMap[data.studentId].totalMarks +=
        Number(data.score || 0);

    });

    leaderboardData = Object.values(studentMap);

    leaderboardData.sort((a, b) =>
        b.totalMarks - a.totalMarks
    );

    const myIndex = leaderboardData.findIndex(
        item => item.studentId === currentUser.uid
    );

    if (studentRank) {

        studentRank.innerHTML =
        myIndex >= 0 ? "#" + (myIndex + 1) : "-";

    }

}
catch (error) {

    console.error(
        "Rank Error",
        error
    );

}


// ==========================================
// XP + LEVEL + COINS
// ==========================================

const xp =
Number(localStorage.getItem("xp")) || 0;

const coinValue =
Number(localStorage.getItem("coins")) || 0;

const currentLevel =
Math.floor(xp / 50) + 1;

if (level) {

    level.innerHTML =
    "Level " + currentLevel;

}

if (coins) {

    coins.innerHTML =
    coinValue;

}

if (xpBar) {

    const progress =
    (xp % 50) * 2;

    xpBar.style.width =
    progress + "%";

}

console.log("Rank + XP Loaded ✅");

// ==========================================
// PART 4 / 5
// DAILY QUOTE + LEARNING + ADMIN
// ==========================================

// Daily Motivation

const quotes = [

"வெற்றி ஒரே நாளில் கிடைக்காது... தினமும் முயற்சி செய்தால் நிச்சயம் கிடைக்கும்.",

"இன்று படிக்கும் ஒவ்வொரு பக்கமும் நாளைய வெற்றிக்கான படிக்கட்டு.",

"கனவு அரசு வேலை என்றால் தினமும் முயற்சி செய்யுங்கள்.",

"முயற்சி தான் வெற்றியின் முதல் படி.",

"நேரத்தை மதிப்பவன் வாழ்க்கையில் உயர்வான்.",

"தினமும் ஒரு Mock Test எழுதுங்கள்.",

"நம்பிக்கை இருந்தால் வெற்றி உறுதி."

];

if(dailyQuote){

    dailyQuote.innerHTML =

    quotes[Math.floor(Math.random()*quotes.length)];

}


// ==========================================
// LEARNING PAGE
// ==========================================

window.openLearning = function(subject){

    window.location.href =
    "learning.html?subject=" + subject;

};


// ==========================================
// ADMIN BUTTON
// ==========================================

if(adminAccess){

    if(

        currentUser.email ===
        "gthegenius7@gmail.com"

    ){

        adminAccess.style.display = "flex";

    }

    else{

        adminAccess.style.display = "none";

    }

}

console.log("Dashboard Extras Loaded ✅");

// ==========================================
// PART 5 / 5
// LOGOUT + TEST NAVIGATION + FINAL INIT
// ==========================================


// ==========================================
// LOGOUT SYSTEM
// ==========================================

if(logoutBtn){

    logoutBtn.onclick = async()=>{

        try{

            await signOut(auth);

            console.log(
                "Logout Success ✅"
            );

            window.location.href =
            "login.html";

        }

        catch(error){

            console.error(
                "Logout Error",
                error
            );

        }

    };

}


// ==========================================
// MOCK TEST NAVIGATION
// ==========================================


window.startDailyTest = function(){

    window.location.href =
    "mocktest.html?type=daily";

};


window.startWeeklyTest = function(){

    window.location.href =
    "mocktest.html?type=weekly";

};


window.startMonthlyTest = function(){

    window.location.href =
    "mocktest.html?type=monthly";

};



// ==========================================
// SUBJECT TEST
// ==========================================

window.startSubjectTest = function(subject){

    window.location.href =
    "practice.html?subject=" + subject;

};



// ==========================================
// PROFILE PAGE
// ==========================================

window.openProfile = function(){

    window.location.href =
    "profile.html";

};



// ==========================================
// LEADERBOARD PAGE
// ==========================================

window.openLeaderboard = function(){

    window.location.href =
    "leaderboard.html";

};



// ==========================================
// HISTORY PAGE
// ==========================================

window.openHistory = function(){

    window.location.href =
    "history.html";

};



// ==========================================
// ADMIN PANEL
// ==========================================

window.openAdmin = function(){

    window.location.href =
    "admin.html";

};



// ==========================================
// SOCIAL LINKS
// ==========================================

window.openYoutube = function(){

    window.open(
    "https://youtube.com/@gthegeniustamil",
    "_blank"
    );

};


window.openTelegram = function(){

    window.open(
    "https://t.me/gthegenius",
    "_blank"
    );

};


window.openEmail = function(){

    window.location.href =
    "mailto:gthegenius7@gmail.com";

};



// ==========================================
// COPYRIGHT YEAR
// ==========================================

const year =
document.getElementById("year");


if(year){

    year.innerHTML =
    new Date().getFullYear();

}



// ==========================================
// DASHBOARD READY
// ==========================================

console.log(
"🚀 G THE GENIUS DASHBOARD v5.0 READY"
);
