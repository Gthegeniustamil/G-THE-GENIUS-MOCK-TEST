// =========================
// G THE GENIUS RESULT JS
// PART 1
// =========================

import { db, auth } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// AUTH CHECK
// =========================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        window.location.href = "login.html";
        return;

    }

    // History page-லிருந்து வந்த Result
    const savedResult =
    localStorage.getItem("lastResult");

    if(savedResult){

        const data =
        JSON.parse(savedResult);

        displayResult(data);

        localStorage.removeItem("lastResult");

        return;

    }

    // Latest Result Load
    await loadResult();

});

// =========================
// LOAD LATEST RESULT
// =========================

async function loadResult(){

    try{

        const q = query(

            collection(db,"results"),

            where(
                "studentId",
                "==",
                auth.currentUser.uid
            ),

            orderBy(
                "timestamp",
                "desc"
            )

        );

        const snap =
        await getDocs(q);

        if(snap.empty){

            alert("No Result Found");

            return;

        }

        const latest =
        snap.docs[0].data();

        displayResult(latest);

    }

    catch(error){

        console.error(error);

        alert("Result Loading Failed");

    }

}

// =========================
// DISPLAY RESULT
// =========================

function displayResult(data){

    document.getElementById("score").innerHTML =
    data.score || 0;

    document.getElementById("total").innerHTML =
    data.total || 0;

    document.getElementById("examName").innerHTML =
    data.examType || "TNUSRB";

    // Test Type
    let type = "Mock Test";

    if(data.testType === "daily"){

        type = "🟢 Daily Mock Test";

    }
    else if(data.testType === "weekly"){

        type = "🟡 Weekly Mock Test";

    }
    else if(data.testType === "monthly"){

        type = "🔴 Monthly Grand Test";

    }

    document.getElementById("testType").innerHTML =
    type;

    // Correct / Wrong / Skipped
    document.getElementById("correctCount").innerHTML =
    data.correct || 0;

    document.getElementById("wrongCount").innerHTML =
    data.wrong || 0;

    document.getElementById("skipCount").innerHTML =
    data.skipped || 0;

    // Percentage
    const percentage =
    Math.round(((data.score || 0) / (data.total || 1)) * 100);

    document.getElementById("percentage").innerHTML =
    percentage + "%";

    // Rank Load
    calculateRank();

}

// =========================
// CALCULATE RANK
// =========================

async function calculateRank(){

    try{

        const q = query(

            collection(db,"results"),

            orderBy("score","desc")

        );

        const snap = await getDocs(q);

        let overallRank = 1;
        let districtRank = 1;

        const currentUser = auth.currentUser;

        const myDistrict =
        localStorage.getItem("district") || "-";

        for(const doc of snap.docs){

            const data = doc.data();

            if(data.studentId === currentUser.uid){

                document.getElementById("rank").innerHTML =
                overallRank;

                break;

            }

            overallRank++;

        }

        for(const doc of snap.docs){

            const data = doc.data();

            if(data.district === myDistrict){

                if(data.studentId === currentUser.uid){

                    document.getElementById("districtRank").innerHTML =
                    districtRank;

                    break;

                }

                districtRank++;

            }

        }

    }

    catch(error){

        console.error("Rank Error:", error);

    }

}

// =========================
// SHARE RESULT
// =========================

const shareBtn =
document.getElementById("shareResult");

if(shareBtn){

    shareBtn.onclick = async()=>{

        const text =

`🏆 G THE GENIUS MOCK TEST

📝 ${document.getElementById("testType").innerHTML}

🎯 Marks : ${document.getElementById("score").innerHTML}/${document.getElementById("total").innerHTML}

✅ Correct : ${document.getElementById("correctCount").innerHTML}

❌ Wrong : ${document.getElementById("wrongCount").innerHTML}

⏭ Skipped : ${document.getElementById("skipCount").innerHTML}

🏆 Overall Rank : #${document.getElementById("rank").innerHTML}`;

        if(navigator.share){

            await navigator.share({

                title:"G THE GENIUS",

                text:text

            });

        }

        else{

            await navigator.clipboard.writeText(text);

            alert("Result Copied Successfully");

        }

    };

}

// =========================
// RETRY BUTTON
// =========================

const retryBtn =
document.getElementById("retryTest");


if(retryBtn){

    retryBtn.onclick = ()=>{

        window.location.href =
        "dashboard.html";

    };

}


// =========================
// UPDATE XP SYSTEM
// =========================

function updateXP(){

    let xp =
    Number(localStorage.getItem("xp")) || 0;


    xp += 10;


    localStorage.setItem(
        "xp",
        xp
    );

}


// =========================
// PAGE READY
// =========================

console.log(
"✅ G THE GENIUS RESULT PAGE READY"
);
