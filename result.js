// ======================================================
// G THE GENIUS
// RESULT JS
// MOBILE APP RESULT SYSTEM
// ======================================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// GET STORED TEST DATA
// ======================================================

const score =
    Number(localStorage.getItem("score")) || 0;

const totalQuestions =
    Number(localStorage.getItem("totalQuestions")) || 0;

const testType =
    localStorage.getItem("testType") || "daily";

const questions =
    JSON.parse(
        localStorage.getItem("questions") || "[]"
    );

const userAnswers =
    JSON.parse(
        localStorage.getItem("userAnswers") || "[]"
    );


// ======================================================
// STUDENT DATA
// ======================================================

let student = {};

try {

    student =
        JSON.parse(
            localStorage.getItem("student") || "{}"
        );

}
catch(error){

    console.log(
        "Student data error:",
        error
    );

}


// ======================================================
// STUDENT NAME / DISTRICT
// ======================================================

const studentName =
    student.name ||
    localStorage.getItem("studentName") ||
    "Student";


const studentDistrict =
    student.district ||
    localStorage.getItem("district") ||
    "-";


document.getElementById(
    "studentName"
).textContent = studentName;


document.getElementById(
    "studentDistrict"
).textContent = studentDistrict;


// ======================================================
// CALCULATE CORRECT / WRONG / SKIPPED
// ======================================================

let correct = 0;

let wrong = 0;

let skipped = 0;


questions.forEach((question, index) => {

    const answer =
        userAnswers[index];


    // Not answered
    if (
        answer === null ||
        answer === undefined
    ){

        skipped++;

        return;

    }


    // Correct
    if (
        Number(answer) ===
        Number(question.answer)
    ){

        correct++;

    }

    // Wrong
    else{

        wrong++;

    }

});


// ======================================================
// FALLBACK
// ======================================================

if (
    correct === 0 &&
    score > 0
){

    correct = score;

}


if (
    totalQuestions > 0 &&
    correct + wrong + skipped >
    totalQuestions
){

    skipped = 0;

}


// ======================================================
// SCORE DISPLAY
// ======================================================

document.getElementById(
    "scoreDisplay"
).textContent =

`${score} / ${totalQuestions}`;


// ======================================================
// STATISTICS
// ======================================================

document.getElementById(
    "correctDisplay"
).textContent = correct;


document.getElementById(
    "wrongDisplay"
).textContent = wrong;


document.getElementById(
    "skippedDisplay"
).textContent = skipped;


// ======================================================
// TEST TYPE
// ======================================================

let testName = "Daily Mock Test";


if(testType === "daily"){

    testName =
        "🟢 Daily Mock Test";

}


else if(testType === "weekly"){

    testName =
        "🟡 Weekly Mock Test";

}


else if(testType === "monthly"){

    testName =
        "🔴 Monthly Grand Test";

}


else{

    testName =
        "📝 Mock Test";

}


document.getElementById(
    "testTypeDisplay"
).textContent =
testName;


document.getElementById(
    "testName"
).textContent =
testName;


// ======================================================
// RESULT MESSAGE
// ======================================================

const resultMessage =
document.getElementById(
    "resultMessage"
);


if(totalQuestions === 0){

    resultMessage.textContent =
        "Test result not available.";

}

else{

    const percentage =
        Math.round(
            (score / totalQuestions) * 100
        );


    if(percentage >= 90){

        resultMessage.textContent =
            "🔥 Outstanding! You are exam ready!";

    }

    else if(percentage >= 75){

        resultMessage.textContent =
            "🏆 Excellent performance! Keep going!";

    }

    else if(percentage >= 50){

        resultMessage.textContent =
            "💪 Good effort! Practice more and improve!";

    }

    else{

        resultMessage.textContent =
            "📚 Keep practicing. Your next attempt can be better!";

    }

}


// ======================================================
// LOAD OVERALL RANK
// ======================================================

async function loadRank(){

    const rankDisplay =
        document.getElementById(
            "rankDisplay"
        );


    rankDisplay.textContent =
        "Loading...";


    try{

        const resultsRef =
            collection(
                db,
                "results"
            );


        const snapshot =
            await getDocs(
                resultsRef
            );


        let results = [];


        snapshot.forEach(doc => {

            const data =
                doc.data();


            results.push({

                id:doc.id,

                score:
                    Number(data.score) || 0,

                totalQuestions:
                    Number(
                        data.totalQuestions
                    ) || 0,

                testType:
                    data.testType || "daily",

                studentName:
                    data.studentName || "",

                createdAt:
                    data.createdAt || null

            });

        });


        // ==================================================
        // SAME TEST TYPE RANK
        // ==================================================

        results =
            results.filter(
                item =>
                    item.testType ===
                    testType
            );


        // ==================================================
        // SORT HIGH SCORE FIRST
        // ==================================================

        results.sort(
            (a,b) => {

                const aPercentage =
                    a.totalQuestions > 0
                    ?
                    a.score /
                    a.totalQuestions
                    :
                    0;


                const bPercentage =
                    b.totalQuestions > 0
                    ?
                    b.score /
                    b.totalQuestions
                    :
                    0;


                if(
                    bPercentage !==
                    aPercentage
                ){

                    return (
                        bPercentage -
                        aPercentage
                    );

                }


                return b.score - a.score;

            }
        );


        // ==================================================
        // CURRENT RESULT RANK
        // ==================================================

        let rank = 1;


        /*
         * Current test result is identified
         * using score + student name + test type.
         */

        let foundIndex =
            results.findIndex(
                item =>

                    item.score === score &&

                    item.studentName ===
                    studentName &&

                    item.testType ===
                    testType

            );


        if(foundIndex !== -1){

            rank =
                foundIndex + 1;

        }


        // If result is not found
        // calculate approximate rank

        else{

            rank =
                results.filter(
                    item => {

                        if(
                            item.totalQuestions === 0
                        ){

                            return false;

                        }


                        return (

                            item.score /
                            item.totalQuestions

                        ) >

                        (

                            score /
                            totalQuestions

                        );

                    }
                ).length + 1;

        }


        rankDisplay.textContent =
            "#" + rank;


        localStorage.setItem(
            "rank",
            rank
        );


    }

    catch(error){

        console.error(
            "Rank Error:",
            error
        );


        rankDisplay.textContent =
            "--";

    }

}


// ======================================================
// LOAD RANK
// ======================================================

loadRank();


// ======================================================
// RETRY TEST
// ======================================================

document.getElementById(
    "retryBtn"
).addEventListener(
    "click",
    () => {

        let url =
            "mocktest.html?type=" +
            encodeURIComponent(
                testType
            );


        window.location.href =
            url;

    }
);


// ======================================================
// DASHBOARD
// ======================================================

document.getElementById(
    "dashboardBtn"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "dashboard.html";

    }
);


// ======================================================
// SHARE RESULT
// ======================================================

document.getElementById(
    "shareBtn"
).addEventListener(
    "click",
    async () => {


        const rank =
            localStorage.getItem(
                "rank"
            ) || "--";


        const shareText =

`🎯 G THE GENIUS MOCK TEST

👤 ${studentName}

📝 ${testName}

🏆 Score: ${score}/${totalQuestions}

✅ Correct: ${correct}

❌ Wrong: ${wrong}

⏭️ Skipped: ${skipped}

🏅 Rank: #${rank}

🔥 Keep Learning!
G THE GENIUS`;



        // Native Share
        if(
            navigator.share
        ){

            try{

                await navigator.share({

                    title:
                        "G THE GENIUS Result",

                    text:
                        shareText

                });

            }

            catch(error){

                console.log(
                    "Share cancelled"
                );

            }

        }


        // Clipboard fallback

        else{

            try{

                await navigator.clipboard.writeText(
                    shareText
                );


                alert(
                    "Result copied! 📋"
                );

            }

            catch(error){

                alert(
                    shareText
                );

            }

        }

    }
);


// ======================================================
// PREVENT BACK BUTTON CONFUSION
// ======================================================

window.addEventListener(
    "pageshow",
    () => {

        window.scrollTo(
            0,
            0
        );

    }
);


// ======================================================
// CONSOLE
// ======================================================

console.log(
    "G THE GENIUS Result Loaded"
);

console.log(
    "Test Type:",
    testType
);

console.log(
    "Score:",
    score,
    "/",
    totalQuestions
);

console.log(
    "Correct:",
    correct
);

console.log(
    "Wrong:",
    wrong
);

console.log(
    "Skipped:",
    skipped
);
