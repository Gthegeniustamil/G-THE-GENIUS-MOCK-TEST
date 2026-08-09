// ======================================================
// G THE GENIUS
// DASHBOARD JS
// Firebase Auth + Firestore
// Mobile App Dashboard
// ======================================================

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const studentNameElement =
    document.getElementById("studentName");

const studentDistrictElement =
    document.getElementById("studentDistrict");

const testsTakenElement =
    document.getElementById("testsTaken");

const bestScoreElement =
    document.getElementById("bestScore");

const streakElement =
    document.getElementById("streak");

const logoutBtn =
    document.getElementById("logoutBtn");


// ======================================================
// GET LOCAL STUDENT
// ======================================================

function getLocalStudent() {

    try {

        const student =
            localStorage.getItem("student");

        if (!student) return null;

        return JSON.parse(student);

    }

    catch (error) {

        console.error(
            "Local Student Error:",
            error
        );

        return null;

    }

}


// ======================================================
// SHOW STUDENT DETAILS
// ======================================================

function showStudent(student) {

    if (!student) return;


    if (studentNameElement) {

        studentNameElement.textContent =
            student.name || "Student";

    }


    if (studentDistrictElement) {

        studentDistrictElement.textContent =
            student.district || "-";

    }

}


// ======================================================
// GET TEST RESULTS
// ======================================================

async function loadStudentResults(user) {

    try {

        if (!user) return;


        const resultsRef =
            collection(db, "results");


        /*
         * We use uid when available.
         * Older results may not have uid,
         * so we also support studentName fallback.
         */

        let results = [];


        try {

            const uidQuery =
                query(
                    resultsRef,
                    where("uid", "==", user.uid)
                );


            const uidSnapshot =
                await getDocs(uidQuery);


            uidSnapshot.forEach((doc) => {

                results.push({
                    id: doc.id,
                    ...doc.data()
                });

            });

        }

        catch (error) {

            console.log(
                "UID query unavailable:",
                error
            );

        }


        // ------------------------------------------------
        // FALLBACK FOR OLD RESULTS
        // ------------------------------------------------

        if (results.length === 0) {

            const student =
                getLocalStudent();


            if (student && student.name) {

                const nameQuery =
                    query(
                        resultsRef,
                        where(
                            "studentName",
                            "==",
                            student.name
                        )
                    );


                const nameSnapshot =
                    await getDocs(nameQuery);


                nameSnapshot.forEach((doc) => {

                    results.push({
                        id: doc.id,
                        ...doc.data()
                    });

                });

            }

        }


        // ------------------------------------------------
        // TEST COUNT
        // ------------------------------------------------

        if (testsTakenElement) {

            testsTakenElement.textContent =
                results.length;

        }


        // ------------------------------------------------
        // BEST SCORE
        // ------------------------------------------------

        let bestScore = 0;


        results.forEach((result) => {

            const score =
                Number(result.score) || 0;


            if (score > bestScore) {

                bestScore = score;

            }

        });


        if (bestScoreElement) {

            bestScoreElement.textContent =
                bestScore;

        }


        console.log(
            "Student Results:",
            results
        );

    }

    catch (error) {

        console.error(
            "Results Loading Error:",
            error
        );


        if (testsTakenElement) {

            testsTakenElement.textContent = "0";

        }


        if (bestScoreElement) {

            bestScoreElement.textContent = "0";

        }

    }

}


// ======================================================
// LOAD STREAK
// ======================================================

function loadStreak() {

    const streak =
        Number(
            localStorage.getItem("streak")
        ) || 0;


    if (streakElement) {

        streakElement.textContent =
            streak;

    }

}


// ======================================================
// AUTH STATE
// ======================================================

onAuthStateChanged(
    auth,
    async (user) => {

        // ------------------------------------------------
        // NOT LOGGED IN
        // ------------------------------------------------

        if (!user) {

            console.log(
                "No authenticated user."
            );


            localStorage.removeItem("student");


            window.location.href =
                "login.html";


            return;

        }


        console.log(
            "Dashboard User:",
            user.uid
        );


        // ------------------------------------------------
        // STUDENT DATA
        // ------------------------------------------------

        const student =
            getLocalStudent();


        if (student) {

            showStudent(student);

        }

        else {

            /*
             * If localStorage is missing,
             * use Firebase account information.
             */

            const fallbackStudent = {

                uid: user.uid,

                name:
                    user.displayName ||
                    "Student",

                district: "-",

                email:
                    user.email || "",

                role: "student"

            };


            localStorage.setItem(
                "student",
                JSON.stringify(
                    fallbackStudent
                )
            );


            localStorage.setItem(
                "studentName",
                fallbackStudent.name
            );


            localStorage.setItem(
                "district",
                fallbackStudent.district
            );


            showStudent(
                fallbackStudent
            );

        }


        // ------------------------------------------------
        // LOAD DATA
        // ------------------------------------------------

        await loadStudentResults(user);

        loadStreak();

    }
);


// ======================================================
// LOGOUT
// ======================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) return;


            try {

                logoutBtn.disabled = true;

                logoutBtn.textContent =
                    "Logging out...";


                await signOut(auth);


                // ----------------------------------------
                // CLEAR LOGIN DATA
                // ----------------------------------------

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

                localStorage.removeItem(
                    "uid"
                );

                localStorage.removeItem(
                    "role"
                );


                // ----------------------------------------
                // LOGIN PAGE
                // ----------------------------------------

                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                logoutBtn.disabled = false;

                logoutBtn.textContent =
                    "🚪 Logout";

                alert(
                    "Logout failed. Please try again."
                );

            }

        }
    );

}


// ======================================================
// TEST CARD SCHEDULE CONTROL
// ======================================================

function updateTestAvailability() {

    const now =
        new Date();

    const day =
        now.getDay();

    const date =
        now.getDate();


    // --------------------------------------------------
    // WEEKLY TEST
    // Sunday = 0
    // --------------------------------------------------

    const weeklyBtn =
        document.querySelector(
            'a[href*="type=weekly"]'
        );


    if (weeklyBtn) {

        if (day !== 0) {

            weeklyBtn.textContent =
                "Sunday";

            weeklyBtn.style.opacity =
                "0.55";

        }

        else {

            weeklyBtn.textContent =
                "Start";

            weeklyBtn.style.opacity =
                "1";

        }

    }


    // --------------------------------------------------
    // MONTHLY TEST
    // 1st & 15th
    // --------------------------------------------------

    const monthlyBtn =
        document.querySelector(
            'a[href*="type=monthly"]'
        );


    if (monthlyBtn) {

        if (
            date !== 1 &&
            date !== 15
        ) {

            monthlyBtn.textContent =
                "1st / 15th";

            monthlyBtn.style.opacity =
                "0.55";

        }

        else {

            monthlyBtn.textContent =
                "Start";

            monthlyBtn.style.opacity =
                "1";

        }

    }

}


// ======================================================
// RUN SCHEDULE CHECK
// ======================================================

updateTestAvailability();


// ======================================================
// PREVENT ACCIDENTAL BACK AFTER LOGOUT
// ======================================================

window.addEventListener(
    "pageshow",
    (event) => {

        if (event.persisted) {

            window.location.reload();

        }

    }
);


// ======================================================
// READY
// ======================================================

console.log(
    "G THE GENIUS Dashboard Ready 🚀"
);
