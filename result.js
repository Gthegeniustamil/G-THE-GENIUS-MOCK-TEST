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
    limit,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// LOAD RESULT
// =========================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    await loadResult();

});

// =========================
// LOAD LATEST RESULT
// =========================

async function loadResult(){

    try{

        const q = query(
    collection(db,"results"),
    where("studentId","==",auth.currentUser.uid)
);
     
        

    catch(error){

        console.error(error);

        alert("Result Loading Failed");

    }

}
const snap = await getDocs(q);

if(snap.empty){

    alert("No Result Found");
    return;

}

let latest = null;

snap.forEach(doc => {

    latest = doc.data();

});

displayResult(latest);

// =========================
// DISPLAY RESULT
// =========================

function displayResult(data){

    // Marks
    document.getElementById("score").innerHTML =
    data.score ?? 0;

    document.getElementById("total").innerHTML =
    data.total ?? 0;

    // Test Type
    document.getElementById("testType").innerHTML =
    data.testType ?? "-";

    // Exam Name
    document.getElementById("examName").innerHTML =
    data.examType ?? "TNUSRB";

    // Correct
    document.getElementById("correctCount").innerHTML =
    data.correct ?? 0;

    // Wrong
    document.getElementById("wrongCount").innerHTML =
    data.wrong ?? 0;

    // Skipped
    document.getElementById("skipCount").innerHTML =
    data.skipped ?? 0;

    // Percentage element இருந்தால் hide
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
        localStorage.getItem("district");

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

        console.error(error);

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

🎯 Marks : ${document.getElementById("score").innerHTML}/${document.getElementById("total").innerHTML}

✅ Correct : ${document.getElementById("correctCount").innerHTML}

❌ Wrong : ${document.getElementById("wrongCount").innerHTML}

⏭ Skipped : ${document.getElementById("skipCount").innerHTML}`;

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
