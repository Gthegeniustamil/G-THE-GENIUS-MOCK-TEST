// ==================================================
// G THE GENIUS
// LEADERBOARD JS
// Mobile App Style Leaderboard
// ==================================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==================================================
// VARIABLES
// ==================================================

let allResults = [];
let currentType = "all";
let currentResults = [];


// ==================================================
// STUDENT DATA
// ==================================================

const studentData =
    JSON.parse(localStorage.getItem("student")) || {};

const currentStudentName =
    studentData.name ||
    localStorage.getItem("studentName") ||
    "Student";

const currentStudentDistrict =
    studentData.district ||
    localStorage.getItem("district") ||
    "-";


document.getElementById("myStudentName").textContent =
    currentStudentName;

document.getElementById("myStudentDistrict").textContent =
    currentStudentDistrict;


// ==================================================
// LOAD RESULTS
// ==================================================

async function loadLeaderboard() {

    const list =
        document.getElementById("leaderboardList");

    try {

        list.innerHTML = `
            <div class="loading-box">
                <div class="loader"></div>
                <p>Loading Rankings...</p>
            </div>
        `;


        const snapshot =
            await getDocs(
                collection(db, "results")
            );


        allResults = [];


        snapshot.forEach((doc) => {

            const data = doc.data();


            const score =
                Number(data.score) || 0;

            const total =
                Number(data.totalQuestions) || 0;


            allResults.push({

                id: doc.id,

                studentName:
                    data.studentName ||
                    data.name ||
                    "Student",

                district:
                    data.district ||
                    "-",

                testType:
                    data.testType ||
                    "daily",

                score: score,

                totalQuestions: total,

                createdAt:
                    data.createdAt || null

            });

        });


        applyFilter();

    }

    catch (error) {

        console.error(
            "Leaderboard Error:",
            error
        );


        list.innerHTML = `
            <div class="empty-state">
                <div>⚠️</div>
                <h3>Unable To Load</h3>
                <p>Please try again later.</p>
            </div>
        `;

    }

}


// ==================================================
// FILTER
// ==================================================

function applyFilter() {

    if (currentType === "all") {

        currentResults =
            [...allResults];

    }

    else {

        currentResults =
            allResults.filter(
                item =>
                    item.testType === currentType
            );

    }


    // Sort by score descending
    currentResults.sort(
        (a, b) =>
            b.score - a.score
    );


    // If same score → higher total first
    currentResults.sort(
        (a, b) => {

            if (b.score !== a.score) {

                return b.score - a.score;

            }

            return (
                b.totalQuestions -
                a.totalQuestions
            );

        }
    );


    updateSubtitle();

    showPodium();

    showLeaderboard();

    updateMyRank();

}


// ==================================================
// SUBTITLE
// ==================================================

function updateSubtitle() {

    const subtitle =
        document.getElementById(
            "rankingSubtitle"
        );


    if (currentType === "all") {

        subtitle.textContent =
            "All Test Results";

    }

    else if (currentType === "daily") {

        subtitle.textContent =
            "Daily Mock Test Rankings";

    }

    else if (currentType === "weekly") {

        subtitle.textContent =
            "Weekly Mock Test Rankings";

    }

    else if (currentType === "monthly") {

        subtitle.textContent =
            "Monthly Grand Test Rankings";

    }

}


// ==================================================
// TOP 3 PODIUM
// ==================================================

function showPodium() {

    const top3 =
        currentResults.slice(0, 3);


    // Default values

    setPodium(
        1,
        top3[0]
    );

    setPodium(
        2,
        top3[1]
    );

    setPodium(
        3,
        top3[2]
    );

}


// ==================================================
// SET PODIUM DATA
// ==================================================

function setPodium(rank, student) {

    const name =
        document.getElementById(
            `rank${rank}Name`
        );

    const district =
        document.getElementById(
            `rank${rank}District`
        );

    const score =
        document.getElementById(
            `rank${rank}Score`
        );


    if (!student) {

        name.textContent = "--";

        district.textContent = "--";

        score.textContent = "--";

        return;

    }


    name.textContent =
        student.studentName;


    district.textContent =
        student.district;


    score.textContent =
        `${student.score} / ${student.totalQuestions}`;

}


// ==================================================
// SHOW FULL LEADERBOARD
// ==================================================

function showLeaderboard(
    searchText = ""
) {

    const list =
        document.getElementById(
            "leaderboardList"
        );

    const empty =
        document.getElementById(
            "emptyState"
        );


    let filtered =
        [...currentResults];


    // Search

    if (searchText.trim()) {

        const search =
            searchText
                .toLowerCase()
                .trim();


        filtered =
            filtered.filter(
                student =>
                    student.studentName
                        .toLowerCase()
                        .includes(search)
            );

    }


    document.getElementById(
        "studentCount"
    ).textContent =
        `${filtered.length} Students`;


    if (filtered.length === 0) {

        list.innerHTML = "";

        empty.style.display = "block";

        return;

    }


    empty.style.display = "none";


    list.innerHTML = "";


    filtered.forEach(
        (student, index) => {

            const rank =
                currentResults.indexOf(
                    student
                ) + 1;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "ranking-card";


            // Highlight current student

            const isMe =
                student.studentName
                    .toLowerCase() ===
                currentStudentName
                    .toLowerCase();


            if (isMe) {

                card.classList.add(
                    "my-ranking"
                );

            }


            let medal = "";


            if (rank === 1) {

                medal = "🥇";

            }

            else if (rank === 2) {

                medal = "🥈";

            }

            else if (rank === 3) {

                medal = "🥉";

            }

            else {

                medal = rank;

            }


            card.innerHTML = `

                <div class="rank-badge">

                    ${medal}

                </div>


                <div class="student-info">

                    <h3>

                        ${escapeHTML(
                            student.studentName
                        )}

                        ${
                            isMe
                                ? `<span class="you-badge">
                                    YOU
                                   </span>`
                                : ""
                        }

                    </h3>

                    <p>

                        📍
                        ${escapeHTML(
                            student.district
                        )}

                    </p>

                </div>


                <div class="student-score">

                    <strong>

                        ${student.score}

                    </strong>

                    <span>

                        / ${student.totalQuestions}

                    </span>

                </div>

            `;


            list.appendChild(card);

        }
    );

}


// ==================================================
// MY RANK
// ==================================================

function updateMyRank() {

    const rankElement =
        document.getElementById(
            "myRank"
        );


    const index =
        currentResults.findIndex(
            student =>

                student.studentName
                    .toLowerCase() ===
                currentStudentName
                    .toLowerCase()
        );


    if (index === -1) {

        rankElement.textContent =
            "--";

        return;

    }


    rankElement.textContent =
        index + 1;

}


// ==================================================
// FILTER BUTTONS
// ==================================================

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {


        button.addEventListener(
            "click",
            () => {


                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                currentType =
                    button.dataset.type;


                applyFilter();

            }
        );

    });


// ==================================================
// SEARCH
// ==================================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


searchInput.addEventListener(
    "input",
    () => {

        showLeaderboard(
            searchInput.value
        );

    }
);


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==================================================
// START
// ==================================================

loadLeaderboard();
