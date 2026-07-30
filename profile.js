// =========================
// G THE GENIUS PROFILE JS
// PART 1
// =========================

import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// LOAD AFTER LOGIN
// =========================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    await loadProfile();

});

// =========================
// LOAD PROFILE
// =========================

async function loadProfile(){

    try{

        const user = auth.currentUser;

        if(!user) return;

        const snap = await getDoc(
            doc(db,"users",user.uid)
        );

        if(snap.exists()){

            const data = snap.data();

            document.getElementById("profileName").innerHTML =
            data.name || "Student";

            document.getElementById("profileDistrict").innerHTML =
            data.district || "-";

            document.getElementById("profileExam").innerHTML =
            data.examGoal || "TNUSRB";

            localStorage.setItem(
                "studentName",
                data.name || "Student"
            );

            localStorage.setItem(
                "district",
                data.district || "-"
            );

        }

        loadLevel();

        await loadStatistics();

        loadBadges();

        await loadRank();

    }

    catch(error){

        console.error(error);

        alert("Profile Loading Failed");

    }

}

// =========================
// XP & LEVEL
// =========================

function loadLevel(){

    let xp =
    Number(localStorage.getItem("xp")) || 0;

    let level =
    Math.floor(xp/100)+1;

    let progress =
    xp % 100;

    document.getElementById("profileXP").innerHTML =
    xp;

    document.getElementById("profileLevel").innerHTML =
    level;

    document.getElementById("profileXPBar").style.width =
    progress + "%";

}

// =========================
// LOAD STATISTICS
// =========================

async function loadStatistics(){

    const user = auth.currentUser;

    if(!user) return;

    const q = query(
        collection(db,"results"),
        where("studentId","==",user.uid)
    );

    const snap = await getDocs(q);

    let totalTests = 0;
    let totalScore = 0;
    let bestScore = 0;

    snap.forEach(doc=>{

        const data = doc.data();

        totalTests++;

        const score = Number(data.score) || 0;

        totalScore += score;

        if(score > bestScore){

            bestScore = score;

        }

    });

    // My Statistics

    document.getElementById("totalTests").innerHTML =
    totalTests;

    document.getElementById("totalScore").innerHTML =
    totalScore;

    document.getElementById("bestPercentage").innerHTML =
    bestScore;

    // Achievement Card

    const completed =
    document.getElementById("completedTests");

    if(completed){

        completed.innerHTML =
        totalTests;

    }

    const highest =
    document.getElementById("highestScore");

    if(highest){

        highest.innerHTML =
        bestScore;

    }

}

// =========================
// BADGE SYSTEM
// =========================

function loadBadges(){

    const xp =
    Number(localStorage.getItem("xp")) || 0;

    const badgeBox =
    document.getElementById("profileBadges");

    if(!badgeBox) return;

    badgeBox.innerHTML = "";

    const badges = [];

    if(xp >= 100){
        badges.push("🌱 Beginner");
    }

    if(xp >= 300){
        badges.push("🔥 Active Learner");
    }

    if(xp >= 500){
        badges.push("🏆 Test Master");
    }

    if(xp >= 1000){
        badges.push("👑 Genius Champion");
    }

    if(badges.length === 0){
        badges.push("⭐ Beginner");
    }

    badges.forEach(badge=>{

        const div =
        document.createElement("div");

        div.className = "badge-item";

        div.innerHTML = badge;

        badgeBox.appendChild(div);

    });

}

// =========================
// LOAD OVERALL RANK
// =========================

async function loadRank(){

    const user = auth.currentUser;

    if(!user) return;

    const snap = await getDocs(
        collection(db,"results")
    );

    const results = [];

    snap.forEach(doc=>{

        results.push(doc.data());

    });

    results.sort((a,b)=>

        (Number(b.score)||0) -
        (Number(a.score)||0)

    );

    let rank = "-";

    results.forEach((item,index)=>{

        if(item.studentId === user.uid){

            rank = index + 1;

        }

    });

    const rankBox =
    document.getElementById("currentRank");

    if(rankBox){

        rankBox.innerHTML = rank;

    }

}

// =========================
// LOGOUT
// =========================

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.onclick = async()=>{

        try{

            await auth.signOut();

            localStorage.clear();

            window.location.href = "index.html";

        }

        catch(error){

            console.error(error);

            alert("Logout Failed");

        }

    };

}

// =========================
// AUTO LEVEL UP BONUS
// =========================

const levelUp =
localStorage.getItem("levelUp");

if(levelUp === "true"){

    alert("🎉 Congratulations!\nLevel Up!");

    localStorage.removeItem("levelUp");

}

// =========================
// PAGE READY
// =========================

console.log("✅ G THE GENIUS PROFILE READY");
