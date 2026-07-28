import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentType = "daily";

async function loadLeaderboard() {

    const leaderList = document.getElementById("leaderList");
    leaderList.innerHTML = "Loading...";

    const snapshot = await getDocs(collection(db, "results"));

    let students = [];

    snapshot.forEach((doc) => {
        students.push(doc.data());
    });

    // Filter by Test Type
    students = students.filter(student => student.testType === currentType);

    // Sort by Percentage
    students.sort((a, b) => b.percentage - a.percentage);

    leaderList.innerHTML = "";

    if (students.length === 0) {
        leaderList.innerHTML = "<h3>No Results Found</h3>";
        return;
    }

    let rank = 1;

    students.forEach((student) => {

        leaderList.innerHTML += `
        <div class="leader-card">

            <h2>
            ${rank <= 3 ? ["🥇","🥈","🥉"][rank-1] : "🏅"}
            Rank ${rank}
            </h2>

            <h3>👤 ${student.studentName}</h3>

            <p>📍 ${student.district}</p>

            <p>🎯 Test : ${student.testType}</p>

            <p>📝 Score : ${student.score}/${student.totalQuestions}</p>

            <p>📈 ${student.percentage}%</p>

        </div>
        `;

        rank++;
    });

}

// Button Events
document.getElementById("dailyBtn").onclick = () => {
    currentType = "daily";
    loadLeaderboard();
};

document.getElementById("weeklyBtn").onclick = () => {
    currentType = "weekly";
    loadLeaderboard();
};

document.getElementById("monthlyBtn").onclick = () => {
    currentType = "monthly";
    loadLeaderboard();
};

// Default Load
loadLeaderboard();
