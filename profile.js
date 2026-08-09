// ======================================================
// G THE GENIUS
// PROFILE JS
// Mobile App Profile + Firebase
// ======================================================

import {
    auth,
    db
} from "../firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const studentName =
    document.getElementById("studentName");

const studentDistrict =
    document.getElementById("studentDistrict");

const totalTests =
    document.getElementById("totalTests");

const totalMarks =
    document.getElementById("totalMarks");

const bestScore =
    document.getElementById("bestScore");

const overallRank =
    document.getElementById("overallRank");

const districtRank =
    document.getElementById("districtRank");

const profileHistory =
    document.getElementById("profileHistory");

const logoutBtn =
    document.getElementById("logoutBtn");

const editProfileBtn =
    document.getElementById("editProfileBtn");


// ======================================================
// AUTH CHECK
// ======================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }

    await loadProfile(user);

});


// ======================================================
// LOAD PROFILE
// ======================================================

async function loadProfile(user) {

    try {

        const studentRef =
            doc(
                db,
                "students",
                user.uid
            );

        const studentSnap =
            await getDoc(studentRef);

        let data = {};

        if (studentSnap.exists()) {

            data =
                studentSnap.data();

        }

        const name =
            data.name ||
            user.displayName ||
            "Student";

        const district =
            data.district ||
            "-";


        // Display

        studentName.textContent =
            name;

        studentDistrict.textContent =
            "📍 " + district;


        // Local storage

        localStorage.setItem(
            "studentName",
            name
        );

        localStorage.setItem(
            "district",
            district
        );


        // Load results

        await loadResults(
            name,
            district
        );

    }

    catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        studentName.textContent =
            "Student";

        studentDistrict.textContent =
            "📍 -";

    }

}


// ======================================================
// LOAD RESULTS
// ======================================================

async function loadResults(
    name,
    district
) {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "results"
                )
            );

        let results = [];


        snapshot.forEach((resultDoc) => {

            const data =
                resultDoc.data();


            // Match by student name

            if (
                data.studentName === name
            ) {

                results.push({

                    id:
                        resultDoc.id,

                    studentName:
                        data.studentName || "",

                    district:
                        data.district || "",

                    score:
                        Number(
                            data.score
                        ) || 0,

                    totalQuestions:
                        Number(
                            data.totalQuestions
                        ) || 0,

                    testType:
                        data.testType ||
                        "daily",

                    createdAt:
                        data.createdAt ||
                        null

                });

            }

        });


        // ==================================================
        // TOTAL TESTS
        // ==================================================

        totalTests.textContent =
            results.length;


        // ==================================================
        // TOTAL MARKS
        // ==================================================

        const marks =
            results.reduce(
                (sum, item) =>
                    sum + item.score,
                0
            );

        totalMarks.textContent =
            marks;


        // ==================================================
        // BEST SCORE
        // ==================================================

        let best = 0;

        results.forEach(item => {

            if (
                item.score > best
            ) {

                best =
                    item.score;

            }

        });

        bestScore.textContent =
            best;


        // ==================================================
        // HISTORY
        // ==================================================

        displayHistory(
            results
        );


        // ==================================================
        // RANK
        // ==================================================

        await calculateRanks(
            name,
            district
        );

    }

    catch (error) {

        console.error(
            "Result Error:",
            error
        );

        totalTests.textContent =
            "0";

        totalMarks.textContent =
            "0";

        bestScore.textContent =
            "0";

        profileHistory.innerHTML =
            "<p>No test history yet 📚</p>";

    }

}


// ======================================================
// DISPLAY HISTORY
// ======================================================

function displayHistory(results) {

    if (
        results.length === 0
    ) {

        profileHistory.innerHTML =
            "<p>No test history yet 📚</p>";

        return;

    }


    results.sort((a, b) => {

        const dateA =
            a.createdAt?.seconds || 0;

        const dateB =
            b.createdAt?.seconds || 0;

        return dateB - dateA;

    });


    // Show latest 10

    const latest =
        results.slice(0, 10);


    profileHistory.innerHTML =
        "";


    latest.forEach(item => {

        let icon =
            "🟢";

        let title =
            "Daily Mock Test";


        if (
            item.testType ===
            "weekly"
        ) {

            icon = "🟡";

            title =
                "Weekly Mock Test";

        }


        else if (
            item.testType ===
            "monthly"
        ) {

            icon = "🔴";

            title =
                "Monthly Grand Test";

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "history-card";


        const percentage =
            item.totalQuestions > 0
            ?
            Math.round(
                (
                    item.score /
                    item.totalQuestions
                ) * 100
            )
            :
            0;


        card.innerHTML = `

            <div class="history-left">

                <strong>
                    ${icon} ${title}
                </strong>

                <small>
                    ${formatDate(item.createdAt)}
                </small>

            </div>

            <div class="history-right">

                <strong>
                    ${item.score}/${item.totalQuestions}
                </strong>

                <small>
                    ${percentage}%
                </small>

            </div>

        `;


        profileHistory.appendChild(
            card
        );

    });

}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(timestamp) {

    if (
        !timestamp ||
        !timestamp.seconds
    ) {

        return "Recent Test";

    }


    const date =
        new Date(
            timestamp.seconds * 1000
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ======================================================
// RANK CALCULATION
// ======================================================

async function calculateRanks(
    name,
    district
) {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "results"
                )
            );


        let students = [];


        snapshot.forEach(resultDoc => {

            const data =
                resultDoc.data();


            const score =
                Number(
                    data.score
                ) || 0;


            const total =
                Number(
                    data.totalQuestions
                ) || 0;


            if (
                total === 0
            ) {

                return;

            }


            students.push({

                name:
                    data.studentName ||
                    "",

                district:
                    data.district ||
                    "",

                score:
                    score,

                total:
                    total,

                percentage:
                    score / total

            });

        });


        // ==================================================
        // BEST RESULT FOR EACH STUDENT
        // ==================================================

        const studentMap =
            new Map();


        students.forEach(student => {

            const existing =
                studentMap.get(
                    student.name
                );


            if (
                !existing ||
                student.percentage >
                existing.percentage
            ) {

                studentMap.set(
                    student.name,
                    student
                );

            }

        });


        const uniqueStudents =
            Array.from(
                studentMap.values()
            );


        // ==================================================
        // OVERALL RANK
        // ==================================================

        uniqueStudents.sort(
            (a, b) =>
                b.percentage -
                a.percentage
        );


        const overallIndex =
            uniqueStudents.findIndex(
                student =>
                    student.name === name
            );


        if (
            overallIndex >= 0
        ) {

            overallRank.textContent =
                "#" +
                (overallIndex + 1);

        }

        else {

            overallRank.textContent =
                "--";

        }


        // ==================================================
        // DISTRICT RANK
        // ==================================================

        const districtStudents =
            uniqueStudents.filter(
                student =>
                    student.district ===
                    district
            );


        districtStudents.sort(
            (a, b) =>
                b.percentage -
                a.percentage
        );


        const districtIndex =
            districtStudents.findIndex(
                student =>
                    student.name === name
            );


        if (
            districtIndex >= 0
        ) {

            districtRank.textContent =
                "#" +
                (districtIndex + 1);

        }

        else {

            districtRank.textContent =
                "--";

        }

    }

    catch (error) {

        console.error(
            "Rank Error:",
            error
        );

        overallRank.textContent =
            "--";

        districtRank.textContent =
            "--";

    }

}


// ======================================================
// EDIT PROFILE
// ======================================================

editProfileBtn.addEventListener(
    "click",
    () => {

        alert(
            "Profile editing will be available soon ✏️"
        );

    }
);


// ======================================================
// LOGOUT
// ======================================================

logoutBtn.addEventListener(
    "click",
    async () => {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {

            return;

        }


        try {

            await signOut(
                auth
            );


            localStorage.removeItem(
                "student"
            );

            localStorage.removeItem(
                "studentName"
            );

            localStorage.removeItem(
                "district"
            );

            localStorage.removeItem(
                "email"
            );


            window.location.href =
                "login.html";

        }

        catch (error) {

            console.error(
                "Logout Error:",
                error
            );

            alert(
                "Logout failed. Please try again."
            );

        }

    }
);


console.log(
    "G THE GENIUS Profile Ready"
);
