// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 1 / 8
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==========================================
// DOM ELEMENTS
// ==========================================

const studentName = document.getElementById("studentName");
const studentDistrict = document.getElementById("studentDistrict");
const greeting = document.getElementById("greeting");

const streakCount = document.getElementById("streakCount");
const xpCount = document.getElementById("xpCount");
const coinCount = document.getElementById("coinCount");

const loadingOverlay = document.getElementById("loadingOverlay");

// ==========================================
// GREETING
// ==========================================

function updateGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {

        greeting.textContent = "Good Morning";

    } else if (hour < 17) {

        greeting.textContent = "Good Afternoon";

    } else {

        greeting.textContent = "Good Evening";

    }

}

// ==========================================
// LOAD STUDENT DATA
// ==========================================

async function loadStudent(uid) {

    try {

        const studentRef = doc(db, "students", uid);

        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {

            const data = studentSnap.data();

            studentName.textContent =
                data.name || "Student";

            studentDistrict.textContent =
                data.district || "Tamil Nadu";

            streakCount.textContent =
                data.streak || 0;

            xpCount.textContent =
                (data.xp || 0) + " XP";

            coinCount.textContent =
                data.coins || 0;

        } else {

            console.log("Student document not found.");

        }

    } catch (error) {

        console.error(error);

    }

}

// ==========================================
// AUTH CHECK
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    updateGreeting();

    await loadStudent(user.uid);

    if (loadingOverlay) {

        loadingOverlay.style.display = "none";

    }

});

// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 2 / 8
// ==========================================


// ==========================================
// DOM
// ==========================================

const continueSubject =
    document.getElementById("continueSubject");

const continueTopic =
    document.getElementById("continueTopic");

const continueProgress =
    document.getElementById("continueProgress");

const continuePercent =
    document.getElementById("continuePercent");

const continueBtn =
    document.getElementById("continueBtn");

const lessonCount =
    document.getElementById("lessonCount");

const practiceCount =
    document.getElementById("practiceCount");

const accuracy =
    document.getElementById("accuracy");

const rank =
    document.getElementById("rank");

// Mission Checkboxes

const mission1 =
    document.getElementById("mission1");

const mission2 =
    document.getElementById("mission2");

const mission3 =
    document.getElementById("mission3");

// ==========================================
// LOAD DASHBOARD DATA
// ==========================================

async function loadDashboardData(uid){

    try{

        const ref = doc(db,"students",uid);

        const snap = await getDoc(ref);

        if(!snap.exists()) return;

        const data = snap.data();

        // Continue Learning

        continueSubject.textContent =
            data.currentSubject || "No Lesson Started";

        continueTopic.textContent =
            data.currentTopic || "Start your first lesson today.";

        const progress =
            data.lessonProgress || 0;

        continueProgress.style.width =
            progress + "%";

        continuePercent.textContent =
            progress + "%";

        // Progress

        lessonCount.textContent =
            data.lessonsCompleted || 0;

        practiceCount.textContent =
            data.practiceCompleted || 0;

        accuracy.textContent =
            (data.accuracy || 0) + "%";

        rank.textContent =
            data.rank || "--";

        // Today's Mission

        mission1.checked =
            data.missionLearn || false;

        mission2.checked =
            data.missionPractice || false;

        mission3.checked =
            data.missionScore || false;

    }

    catch(error){

        console.error(
            "Dashboard Load Error:",
            error
        );

    }

}

// ==========================================
// CONTINUE LEARNING
// ==========================================

continueBtn?.addEventListener("click",()=>{

    const lessonId =
        localStorage.getItem("continueLesson");

    if(lessonId){

        window.location.href =
        `learning.html?lesson=${lessonId}`;

    }else{

        window.location.href =
        "learning.html";

    }

});

// ==========================================
// ANIMATE PROGRESS
// ==========================================

function animateProgress(value){

    let current = 0;

    const timer = setInterval(()=>{

        if(current >= value){

            clearInterval(timer);

        }else{

            current++;

            continueProgress.style.width =
                current + "%";

            continuePercent.textContent =
                current + "%";

        }

    },15);

}


// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 3 / 8
// ==========================================

import {
collection,
query,
where,
orderBy,
limit,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// ==========================================
// DOM
// ==========================================

const topRankStudent =
document.getElementById("topRankStudent");

const districtRank =
document.getElementById("districtRank");

const overallRank =
document.getElementById("overallRank");

const currentTitle =
document.getElementById("currentTitle");

const currentSummary =
document.getElementById("currentSummary");

const examList =
document.getElementById("examList");

// ==========================================
// LEADERBOARD PREVIEW
// ==========================================

async function loadLeaderboardPreview(){

    try{

        const q = query(
            collection(db,"results"),
            orderBy("score","desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(doc=>{

            const data = doc.data();

            topRankStudent.textContent =
            data.name || "Student";

        });

    }catch(error){

        console.error(error);

    }

}

// ==========================================
// CURRENT AFFAIRS
// ==========================================

async function loadCurrentAffairs(){

    try{

        const q = query(
            collection(db,"current_affairs"),
            orderBy("date","desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(doc=>{

            const data = doc.data();

            currentTitle.textContent =
            data.title;

            currentSummary.textContent =
            data.summary;

        });

    }catch(error){

        console.error(error);

    }

}

// ==========================================
// UPCOMING EXAMS
// ==========================================

async function loadUpcomingExams(){

    try{

        examList.innerHTML = "";

        const q = query(
            collection(db,"exams"),
            orderBy("examDate","asc"),
            limit(5)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(doc=>{

            const exam = doc.data();

            examList.innerHTML += `

            <div class="exam-item">

                📅 ${exam.examName}

                <br>

                ${exam.examDate}

            </div>

            `;

        });

    }catch(error){

        console.error(error);

    }

}

// ==========================================
// MOCK TEST BUTTONS
// ==========================================

document.querySelectorAll(".mock-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        localStorage.setItem(
            "lastMockVisit",
            Date.now()
        );

    });

});

// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(()=>{

    loadLeaderboardPreview();

    loadCurrentAffairs();

},300000); // 5 Minutes

// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 4 / 8
// ==========================================


// ==========================================
// DOM
// ==========================================

const recentActivity =
document.getElementById("recentActivity");

const challengeTitle =
document.getElementById("challengeTitle");

const challengeDescription =
document.getElementById("challengeDescription");

const challengeBtn =
document.getElementById("challengeBtn");

// ==========================================
// LOAD STUDENT RANK
// ==========================================

async function loadStudentRank(studentData){

    try{

        // Overall Rank
        const overallQuery = query(
            collection(db,"results"),
            orderBy("score","desc")
        );

        const overallSnap = await getDocs(overallQuery);

        let overallPosition = 1;

        overallSnap.forEach(result=>{

            const data = result.data();

            if(data.uid === auth.currentUser.uid){

                overallRank.textContent = overallPosition;

            }

            overallPosition++;

        });

        // District Rank
        const districtQuery = query(
            collection(db,"results"),
            where("district","==",studentData.district),
            orderBy("score","desc")
        );

        const districtSnap = await getDocs(districtQuery);

        let districtPosition = 1;

        districtSnap.forEach(result=>{

            const data = result.data();

            if(data.uid === auth.currentUser.uid){

                districtRank.textContent = districtPosition;

            }

            districtPosition++;

        });

    }catch(error){

        console.error("Rank Error:",error);

    }

}

// ==========================================
// RECENT ACTIVITY
// ==========================================

async function loadRecentActivity(){

    try{

        recentActivity.innerHTML = "";

        const q = query(
            collection(db,"activities"),
            where("uid","==",auth.currentUser.uid),
            orderBy("time","desc"),
            limit(5)
        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){

            recentActivity.innerHTML = `
            <div class="activity-item">
            No Recent Activity
            </div>`;
            return;

        }

        snapshot.forEach(doc=>{

            const data = doc.data();

            recentActivity.innerHTML += `
            <div class="activity-item">
                ${data.icon || "📘"} ${data.message}
            </div>
            `;

        });

    }catch(error){

        console.error(error);

    }

}

// ==========================================
// DAILY CHALLENGE
// ==========================================

function loadDailyChallenge(){

    const challenges = [

        {
            title:"Answer 10 Questions",
            description:"Complete 10 Practice Questions Today."
        },

        {
            title:"Current Affairs",
            description:"Read Today's Current Affairs."
        },

        {
            title:"Score 90%",
            description:"Score Above 90% In Practice Test."
        },

        {
            title:"Complete One Lesson",
            description:"Finish Any Learning Topic."
        }

    ];

    const day =
    new Date().getDate() %
    challenges.length;

    challengeTitle.textContent =
    challenges[day].title;

    challengeDescription.textContent =
    challenges[day].description;

}

// ==========================================
// CHALLENGE BUTTON
// ==========================================

challengeBtn?.addEventListener("click",()=>{

    window.location.href =
    "practice.html";

});

// ==========================================
// ACHIEVEMENT CHECK
// ==========================================

function checkAchievements(student){

    if(student.practiceCompleted >= 100){

        showToast("🏅 Gold Badge Unlocked!");

    }

    if(student.lessonsCompleted >= 50){

        showToast("🎖️ Learning Champion!");

    }

}

// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 5 / 8
// ==========================================

// ==========================================
// DOM ELEMENTS
// ==========================================

const weeklyLessonProgress =
document.getElementById("weeklyLessonProgress");

const weeklyPracticeProgress =
document.getElementById("weeklyPracticeProgress");

const weeklyMockProgress =
document.getElementById("weeklyMockProgress");

const correctAnswers =
document.getElementById("correctAnswers");

const wrongAnswers =
document.getElementById("wrongAnswers");

const skippedAnswers =
document.getElementById("skippedAnswers");

const overallAccuracy =
document.getElementById("overallAccuracy");

// ==========================================
// LOAD PERFORMANCE
// ==========================================

function loadPerformance(student){

    correctAnswers.textContent =
    student.correctAnswers || 0;

    wrongAnswers.textContent =
    student.wrongAnswers || 0;

    skippedAnswers.textContent =
    student.skippedAnswers || 0;

    overallAccuracy.textContent =
    (student.accuracy || 0) + "%";

}

// ==========================================
// WEEKLY PROGRESS
// ==========================================

function loadWeeklyProgress(student){

    weeklyLessonProgress.value =
    student.weeklyLessons || 0;

    weeklyPracticeProgress.value =
    student.weeklyPractice || 0;

    weeklyMockProgress.value =
    student.weeklyMockTests || 0;

}

// ==========================================
// RECOMMENDED TOPICS
// ==========================================

function loadRecommendedTopics(student){

    const topicButtons =
    document.querySelectorAll(".topic-btn");

    if(student.weakSubject){

        topicButtons.forEach(btn=>{

            if(btn.textContent
            .includes(student.weakSubject)){

                btn.style.border =
                "2px solid #FFD700";

            }

        });

    }

}

// ==========================================
// TOPIC BUTTONS
// ==========================================

document.querySelectorAll(".topic-btn")
.forEach(button=>{

    button.addEventListener("click",()=>{

        const topic =
        button.textContent.trim();

        localStorage.setItem(
            "selectedTopic",
            topic
        );

        window.location.href =
        "learning.html";

    });

});

// ==========================================
// QUICK REVISION
// ==========================================

document.querySelectorAll(".revision-btn")
.forEach(button=>{

    button.addEventListener("click",()=>{

        const subject =
        button.textContent.trim();

        localStorage.setItem(
            "revisionSubject",
            subject
        );

        window.location.href =
        "practice.html?mode=revision";

    });

});

// ==========================================
// WRONG ANSWER NOTEBOOK
// ==========================================

const wrongNotebookButton =
document.querySelector(".wrong-note-card .primary-btn");

wrongNotebookButton?.addEventListener("click",()=>{

    window.location.href =
    "wrong-answers.html";

});

// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard(student){

    loadPerformance(student);

    loadWeeklyProgress(student);

    loadRecommendedTopics(student);

}

// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 6 / 8
// ==========================================

// ==========================================
// DOM
// ==========================================

const toast =
document.getElementById("toast");


// ==========================================
// TOAST MESSAGE
// ==========================================

function showToast(message){

    if(!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// ==========================================
// LOADING SCREEN
// ==========================================

function showLoading(){

    if(loadingOverlay){

        loadingOverlay.style.display =
        "flex";

    }

}

function hideLoading(){

    if(loadingOverlay){

        loadingOverlay.style.display =
        "none";

    }

}

// ==========================================
// GENIUS AI
// ==========================================

document.querySelectorAll(".ai-btn")
.forEach(button=>{

    button.addEventListener("click",()=>{

        const question =
        button.innerText.trim();

        localStorage.setItem(
            "geniusQuestion",
            question
        );

        window.location.href =
        "genius-ai.html";

    });

});

// ==========================================
// SETTINGS BUTTONS
// ==========================================

document.querySelectorAll(".setting-btn")
.forEach(button=>{

    button.addEventListener("click",()=>{

        const text =
        button.innerText;

        if(text.includes("Profile")){

            window.location.href =
            "profile.html";

        }

        else if(text.includes("History")){

            window.location.href =
            "history.html";

        }

        else if(text.includes("Certificate")){

            window.location.href =
            "certificate.html";

        }

        else{

            window.location.href =
            "about.html";

        }

    });

});

// ==========================================
// SUPPORT BUTTONS
// ==========================================

document.querySelectorAll(".support-btn")
.forEach(button=>{

    button.addEventListener("click",()=>{

        showToast(
            "Opening..."
        );

    });

});

// ==========================================
// BOTTOM NAVIGATION
// ==========================================

const currentPage =
window.location.pathname
.split("/")
.pop();

document.querySelectorAll(".nav-item")
.forEach(item=>{

    const href =
    item.getAttribute("href");

    if(href === currentPage){

        item.classList.add("active");

    }

});

// ==========================================
// WELCOME TOAST
// ==========================================

setTimeout(()=>{

    showToast(
        "🎉 Welcome to G THE GENIUS"
    );

},1500);

// ==========================================
// NETWORK STATUS
// ==========================================

window.addEventListener("offline",()=>{

    showToast(
        "📡 No Internet Connection"
    );

});

window.addEventListener("online",()=>{

    showToast(
        "✅ Connected"
    );

});

// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 7 / 8
// ==========================================

// ==========================================
// DAILY STREAK
// ==========================================

function updateDailyStreak(student){

    const today =
    new Date().toDateString();

    if(student.lastLogin !== today){

        const newStreak =
        (student.streak || 0) + 1;

        streakCount.textContent =
        newStreak;

    }

}

// ==========================================
// XP & COINS
// ==========================================

function updateRewards(student){

    xpCount.textContent =
    `${student.xp || 0} XP`;

    coinCount.textContent =
    student.coins || 0;

}

// ==========================================
// CURRENT AFFAIRS AUTO CHANGE
// ==========================================

let currentAffairIndex = 0;

function rotateCurrentAffairs(list){

    if(!list || list.length === 0) return;

    setInterval(()=>{

        currentAffairIndex++;

        if(currentAffairIndex >= list.length){

            currentAffairIndex = 0;

        }

        currentTitle.textContent =
        list[currentAffairIndex].title;

        currentSummary.textContent =
        list[currentAffairIndex].summary;

    },10000);

}

// ==========================================
// AUTO REFRESH DASHBOARD
// ==========================================

function refreshDashboard(){

    if(auth.currentUser){

        loadStudent(auth.currentUser.uid);

        loadDashboardData(auth.currentUser.uid);

        loadLeaderboardPreview();

        loadCurrentAffairs();

        loadUpcomingExams();

        loadRecentActivity();

    }

}

setInterval(refreshDashboard,300000);

// Refresh every 5 minutes

// ==========================================
// PAGE VISIBILITY
// ==========================================

document.addEventListener(
"visibilitychange",
()=>{

    if(!document.hidden){

        refreshDashboard();

    }

});

// ==========================================
// KEYBOARD SHORTCUT
// ==========================================

document.addEventListener(
"keydown",
(event)=>{

    if(event.key === "F5"){

        event.preventDefault();

        refreshDashboard();

        showToast("🔄 Dashboard Refreshed");

    }

});

// ==========================================
// FIRST LOAD
// ==========================================

window.addEventListener(
"load",
()=>{

    hideLoading();

    showToast(
    "🚀 Dashboard Ready");

});

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log(
"%cG THE GENIUS Dashboard v6.0 Loaded",
"color:#FFD700;font-size:16px;font-weight:bold;"
);

// ==========================================
// G THE GENIUS
// DASHBOARD JS v6.0
// PART 8 / 8 FINAL
// ==========================================

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

window.addEventListener("error", (event) => {

    console.error("Dashboard Error:", event.error);

    showToast("⚠️ Something went wrong.");

});

window.addEventListener("unhandledrejection", (event) => {

    console.error("Promise Error:", event.reason);

});

// ==========================================
// OFFLINE / ONLINE
// ==========================================

function updateConnectionStatus() {

    if (navigator.onLine) {

        console.log("Online");

    } else {

        showToast("📡 You are Offline");

    }

}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

// ==========================================
// VERSION
// ==========================================

const APP_VERSION = "6.0.0";

console.log(`G THE GENIUS Dashboard v${APP_VERSION}`);

// ==========================================
// DASHBOARD INITIALIZE
// ==========================================

async function initializeDashboard() {

    try {

        showLoading();


        if (auth.currentUser) {

            await loadStudent(auth.currentUser.uid);

            await loadDashboardData(auth.currentUser.uid);

            await loadLeaderboardPreview();

            await loadCurrentAffairs();

            await loadUpcomingExams();

            await loadRecentActivity();

        }

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to load dashboard");

    } finally {

        hideLoading();

    }

}

// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});

// ==========================================
// AUTO SAVE LAST VISIT
// ==========================================

window.addEventListener("beforeunload", () => {

    localStorage.setItem(
        "lastDashboardVisit",
        new Date().toISOString()
    );

});

// ==========================================
// APP READY
// ==========================================

console.log("==================================");
console.log("     G THE GENIUS");
console.log(" Government Exam Learning Portal");
console.log(" Dashboard v6.0 Ready");
console.log("==================================");
