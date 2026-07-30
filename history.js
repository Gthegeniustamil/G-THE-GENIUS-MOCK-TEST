// =========================
// G THE GENIUS HISTORY JS
// PART 1
// =========================

import { auth, db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
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

    await loadHistory();

});

// =========================
// LOAD HISTORY
// =========================

async function loadHistory(){

    try{

        document.getElementById("studentName").innerHTML =
        localStorage.getItem("studentName") || "Student";

        document.getElementById("studentDistrict").innerHTML =
        localStorage.getItem("district") || "-";

        document.getElementById("studentExam").innerHTML =
        localStorage.getItem("examGoal") || "TNUSRB";

        const q = query(

    collection(db,"results"),

    where(
        "studentId",
        "==",
        auth.currentUser.uid
    )

);


const snap = await getDocs(q);

        if(snap.empty){

            document.getElementById("historyList").innerHTML =
            "<p class='loading'>No Test History Found</p>";

            return;

        }

        let totalTests = 0;
        let totalMarks = 0;
        let bestScore = 0;

        const historyBox =
        document.getElementById("historyList");

        historyBox.innerHTML = "";

      // =========================
// DISPLAY HISTORY
// PART 2
// =========================

        snap.forEach(doc=>{

            const data = doc.data();

            totalTests++;

            const score =
            Number(data.score) || 0;

            totalMarks += score;

            if(score > bestScore){

                bestScore = score;

            }

            let testDate = "-";

            if(data.timestamp){

                testDate =
                data.timestamp
                .toDate()
                .toLocaleString();

            }

            const card =
            document.createElement("div");

            card.className =
            "history-item";

            card.innerHTML = `

            <h3>${data.testType || "Mock Test"}</h3>

            <p>📅 ${testDate}</p>

            <p>📚 ${data.examType || "TNUSRB"}</p>

            <p>🏆 Marks : ${score}/${data.total || 0}</p>

            <p>✅ Correct : ${data.correct || 0}</p>

            <p>❌ Wrong : ${data.wrong || 0}</p>

            <p>⏭ Skipped : ${data.skipped || 0}</p>

            <button
            class="history-btn"
            data-id="${doc.id}">

            👁 View Result

            </button>

            `;

            historyBox.appendChild(card);

        });

        document.getElementById("totalTests").innerHTML =
        totalTests;

        document.getElementById("totalMarks").innerHTML =
        totalMarks;

        document.getElementById("bestScore").innerHTML =
        bestScore;

      // =========================
// VIEW RESULT BUTTON
// PART 3
// =========================

        const viewButtons =
        document.querySelectorAll(".history-btn");

        viewButtons.forEach(btn=>{

            btn.onclick = ()=>{

                const index =
                Array.from(viewButtons).indexOf(btn);

                const data =
                snap.docs[index].data();

                localStorage.setItem(

                    "lastResult",

                    JSON.stringify(data)

                );

                window.location.href =
                "result.html";

            };

        });

    }

    catch(error){

    console.error("History Error:", error);

    alert(
        "History Error: " + error.message
    );

    }

}

// =========================
// PAGE REFRESH SUPPORT
// =========================

window.addEventListener("pageshow",()=>{

    console.log("History Page Loaded");

});

// =========================
// PAGE READY
// =========================

console.log("✅ G THE GENIUS HISTORY READY");
