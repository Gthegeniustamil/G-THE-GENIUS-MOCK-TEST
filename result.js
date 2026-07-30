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
// AUTH
// =========================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    await loadResult();

});

// =========================
// LOAD RESULT
// =========================

async function loadResult(){

    try{

        const localData =
        JSON.parse(
            localStorage.getItem("lastResult")
        );

        if(localData){

            displayResult(localData);

        }

        const q = query(

            collection(db,"results"),

            where("studentId","==",auth.currentUser.uid),

            orderBy("timestamp","desc")

        );

        const snap = await getDocs(q);

        if(!snap.empty){

            const latest =
            snap.docs[0].data();

            displayResult(latest);

        }

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
    data.score ?? 0;

    document.getElementById("total").innerHTML =
    data.total ?? 0;

    document.getElementById("correctCount").innerHTML =
    data.correct ?? 0;

    document.getElementById("wrongCount").innerHTML =
    data.wrong ?? 0;

    document.getElementById("skipCount").innerHTML =
    data.skipped ?? 0;

    document.getElementById("examName").innerHTML =
    data.examType || "TNUSRB";

    // Test Type
    let title = "Daily Mock Test";

    if(data.testType==="daily"){

        title="Daily Mock Test";

    }

    else if(data.testType==="weekly"){

        title="Weekly Mock Test";

    }

    else if(data.testType==="monthly"){

        title="Monthly Grand Test";

    }

    document.getElementById("testType").innerHTML =
    title;

    // Hide Percentage
    const percentage =
    document.getElementById("percentage");

    if(percentage){

        percentage.parentElement.style.display="none";

    }

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

        console.error("Rank Error :",error);

        document.getElementById("rank").innerHTML = "-";
        document.getElementById("districtRank").innerHTML = "-";

    }

}

// =========================
// SHARE RESULT
// =========================

const shareBtn = document.getElementById("shareResult");

if(shareBtn){

    shareBtn.onclick = async()=>{

        const text =
`🏆 G THE GENIUS MOCK TEST RESULT

🎯 Marks : ${document.getElementById("score").innerHTML}/${document.getElementById("total").innerHTML}

✅ Correct : ${document.getElementById("correctCount").innerHTML}

❌ Wrong : ${document.getElementById("wrongCount").innerHTML}

⏭ Skipped : ${document.getElementById("skipCount").innerHTML}

📚 Test : ${document.getElementById("testType").innerHTML}

🚀 G THE GENIUS`;

        if(navigator.share){

            await navigator.share({

                title:"G THE GENIUS",

                text:text

            });

        }

        else{

            await navigator.clipboard.writeText(text);

            alert("Result Copied");

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

        window.location.href="dashboard.html";

    };

}

// =========================
// FINAL READY
// =========================

console.log("✅ RESULT PAGE READY");
