// ==========================================
// G THE GENIUS PROFILE SYSTEM v1.0
// PART 1 / 4
// ==========================================

import { auth, db } from "./firebase-config.js";

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

const studentName =
document.getElementById("studentName");

const studentEmail =
document.getElementById("studentEmail");

const studentDistrict =
document.getElementById("studentDistrict");

const studentRegisterNo =
document.getElementById("studentRegisterNo");

const profileImage =
document.getElementById("profileImage");

const loadingScreen =
document.getElementById("loadingScreen");



// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile(user){

    try{

        // students collection
        const studentRef =
        doc(db,"students",user.uid);

        const studentSnap =
        await getDoc(studentRef);

        if(studentSnap.exists()){

            const data =
            studentSnap.data();

            studentName.textContent =
            data.name || "Student";

            studentEmail.textContent =
            data.email || user.email;

            studentDistrict.textContent =
            data.district || "Tamil Nadu";

            studentRegisterNo.textContent =
            "Registration No : " +
            (data.registerNo || user.uid.substring(0,8));

            if(data.photoURL){

                profileImage.src =
                data.photoURL;

            }

        }

    }
    catch(error){

        console.error(
        "Profile Load Error:",
        error
        );

    }

}



// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
auth,
async(user)=>{

    if(user){

        await loadProfile(user);

        if(loadingScreen){

            loadingScreen.style.display="none";

        }

    }else{

        window.location.href="login.html";

    }

});

// ==========================================
// G THE GENIUS PROFILE SYSTEM v1.0
// PART 2 / 4
// XP + LEVEL + PROGRESS
// ==========================================

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ==========================================
// HTML ELEMENTS
// ==========================================

const xpValue =
document.getElementById("xpValue");

const coinValue =
document.getElementById("coinValue");

const lessonValue =
document.getElementById("lessonValue");

const streakValue =
document.getElementById("streakValue");

const studentLevel =
document.getElementById("studentLevel");

const currentLevel =
document.getElementById("currentLevel");

const completedLessons =
document.getElementById("completedLessons");

const learningProgressText =
document.getElementById("learningProgressText");

const learningProgressBar =
document.getElementById("learningProgressBar");

const levelProgressBar =
document.getElementById("levelProgressBar");

const levelPercentage =
document.getElementById("levelPercentage");

const nextLevelText =
document.getElementById("nextLevelText");




// ==========================================
// LOAD STUDENT PROGRESS
// ==========================================

async function loadLearningProgress(user){

    try{

        const progressRef =
        doc(db,"studentProgress",user.uid);

        const progressSnap =
        await getDoc(progressRef);

        if(!progressSnap.exists()){

            return;

        }

        const data =
        progressSnap.data();



        // XP

        const xp =
        data.xp || 0;

        xpValue.textContent =
        xp + " XP";



        // Coins

        coinValue.textContent =
        data.coins || 0;



        // Lessons

        const lessons =
        data.completedLessons || 0;

        lessonValue.textContent =
        lessons;

        completedLessons.textContent =
        lessons + " / 100";



        // Daily Streak

        streakValue.textContent =
        data.streak || 0;



        // Level

        const level =
        data.level || "Level 1";

        studentLevel.textContent =
        level;

        currentLevel.textContent =
        level;



        // Learning Progress

        const progress =
        Math.min(
            (lessons / 100) * 100,
            100
        );

        learningProgressBar.style.width =
        progress + "%";

        learningProgressText.textContent =
        Math.round(progress) +
        "% Completed";



        // XP Progress

        const xpInLevel =
        xp % 1000;

        const xpProgress =
        (xpInLevel / 1000) * 100;

        levelProgressBar.style.width =
        xpProgress + "%";

        levelPercentage.textContent =
        Math.round(xpProgress) + "%";

        nextLevelText.textContent =
        (1000 - xpInLevel) +
        " XP required to reach next level";



    }
    catch(error){

        console.error(
        "Progress Load Error:",
        error
        );

    }

}



// ==========================================
// UPDATE AUTH STATE
// ==========================================

onAuthStateChanged(
auth,
async(user)=>{

    if(user){

        await loadProfile(user);

        await loadLearningProgress(user);

        if(loadingScreen){

            loadingScreen.style.display =
            "none";

        }

    }

});

// ==========================================
// G THE GENIUS PROFILE SYSTEM v1.0
// PART 3 / 4
// BADGES + CERTIFICATES + RANK
// ==========================================

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ==========================================
// HTML ELEMENTS
// ==========================================

const badgeContainer =
document.getElementById("badgeContainer");

const certificateContainer =
document.getElementById("certificateContainer");

const activityContainer =
document.getElementById("activityContainer");

const testsTaken =
document.getElementById("testsTaken");

const averageScore =
document.getElementById("averageScore");

const bestScore =
document.getElementById("bestScore");

const overallRank =
document.getElementById("overallRank");

const stateRank =
document.getElementById("stateRank");

const districtRank =
document.getElementById("districtRank");



// ==========================================
// LOAD BADGES
// ==========================================

async function loadBadges(user){

    const progressDoc =
    await getDoc(doc(db,"studentProgress",user.uid));

    if(!progressDoc.exists()) return;

    const badges =
    progressDoc.data().badges || [];

    badgeContainer.innerHTML = "";

    if(badges.length===0){

        badgeContainer.innerHTML=`

        <div class="badge-card">

        🏅

        <h3>No Badges</h3>

        <p>Complete lessons to unlock badges.</p>

        </div>

        `;

        return;
    }

    badges.forEach(badge=>{

        badgeContainer.innerHTML +=`

        <div class="badge-card">

        🏆

        <h3>${badge}</h3>

        <p>Achievement Unlocked</p>

        </div>

        `;

    });

}



// ==========================================
// LOAD CERTIFICATES
// ==========================================

async function loadCertificates(user){

    const q =
    query(
        collection(db,"certificates"),
        where("userId","==",user.uid)
    );

    const snap =
    await getDocs(q);

    certificateContainer.innerHTML="";

    if(snap.empty){

        certificateContainer.innerHTML=`

        <div class="certificate-card">

        <h3>No Certificate</h3>

        <p>Complete 25 lessons to unlock.</p>

        </div>

        `;

        return;
    }

    snap.forEach(docSnap=>{

        const data =
        docSnap.data();

        certificateContainer.innerHTML +=`

        <div class="certificate-card">

        <h3>${data.level}</h3>

        <p>${data.certificateId}</p>

        </div>

        `;

    });

}



// ==========================================
// MOCK TEST STATISTICS
// ==========================================

async function loadMockStats(user){

    const q =
    query(
        collection(db,"results"),
        where("userId","==",user.uid)
    );

    const snap =
    await getDocs(q);

    let total=0;
    let best=0;

    testsTaken.textContent =
    snap.size;

    snap.forEach(result=>{

        const data =
        result.data();

        total +=
        data.score || 0;

        if((data.score||0)>best){

            best =
            data.score;

        }

    });

    averageScore.textContent =
    snap.size ?
    Math.round(total/snap.size) : 0;

    bestScore.textContent =
    best;

}



// ==========================================
// RANK (Placeholder)
// ==========================================

async function loadRank(){

    overallRank.textContent="--";
    stateRank.textContent="--";
    districtRank.textContent="--";

}



// ==========================================
// RECENT ACTIVITY
// ==========================================

function loadActivity(){

    activityContainer.innerHTML=`

    <div class="activity-card">

    <h4>🎉 Welcome to G THE GENIUS</h4>

    <p>Your recent learning activities will appear here.</p>

    </div>

    `;

}



// ==========================================
// LOAD ALL
// ==========================================

async function loadProfileExtras(user){

    await loadBadges(user);

    await loadCertificates(user);

    await loadMockStats(user);

    await loadRank();

    loadActivity();

}

// ==========================================
// G THE GENIUS PROFILE SYSTEM v1.0
// PART 4 / 4 FINAL
// ==========================================



// ===============================
// LOGOUT
// ===============================

const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){

    logoutBtn.addEventListener(
    "click",
    async()=>{

        const confirmLogout = confirm(
        "Are you sure you want to logout?"
        );

        if(!confirmLogout) return;

        try{

            await signOut(auth);

            alert(
            "Logout Successful"
            );

            window.location.href =
            "login.html";

        }

        catch(error){

            console.error(
            "Logout Error:",
            error
            );

            alert(
            "Logout Failed!"
            );

        }

    });

}




// ===============================
// AUTO REFRESH
// ===============================

function refreshProfile(){

    const user =
    auth.currentUser;

    if(user){

        loadProfile(user);

        loadLearningProgress(user);

        loadProfileExtras(user);

    }

}



// Auto Refresh every 60 seconds
setInterval(
refreshProfile,
60000
);




// ===============================
// FINAL AUTH INITIALIZATION
// ===============================

onAuthStateChanged(
auth,
async(user)=>{

    if(!user){

        window.location.href =
        "login.html";

        return;

    }

    try{

        await loadProfile(user);

        await loadLearningProgress(user);

        await loadProfileExtras(user);

        if(loadingScreen){

            loadingScreen.style.display =
            "none";

        }

    }

    catch(error){

        console.error(
        "Profile Initialization Error:",
        error
        );

    }

});




// ===============================
// SYSTEM READY
// ===============================

console.log(
"👤 G THE GENIUS Profile System Loaded Successfully"
);
