// ==========================================
// G THE GENIUS MOCK TEST PORTAL v6.0
// RESULT.JS
// PART 1
// ==========================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// GET RESULT FROM LOCAL STORAGE
// ==========================================

const score =
Number(localStorage.getItem("lastScore")) || 0;

const correct =
Number(localStorage.getItem("lastCorrect")) || 0;

const wrong =
Number(localStorage.getItem("lastWrong")) || 0;

const unanswered =
Number(localStorage.getItem("lastUnanswered")) || 0;

const total =
Number(localStorage.getItem("lastTotal")) || 0;

const percentage =
Number(localStorage.getItem("lastPercentage")) || 0;

const review =
JSON.parse(
localStorage.getItem("lastReview")
) || [];


// ==========================================
// STUDENT DETAILS
// ==========================================

const studentName =
localStorage.getItem("studentName") || "Student";

const district =
localStorage.getItem("district") || "-";


// ==========================================
// HTML ELEMENTS
// ==========================================

const marksBox =
document.getElementById("marks");

const correctBox =
document.getElementById("correctAnswers");

const wrongBox =
document.getElementById("wrongAnswers");

const totalBox =
document.getElementById("totalQuestions");

const rankBox =
document.getElementById("rank");

const resultMessage =
document.getElementById("resultMessage");

const reviewContainer =
document.getElementById("reviewContainer");


// ==========================================
// DISPLAY RESULT
// ==========================================

if(marksBox){
    marksBox.innerText = score;
}

if(correctBox){
    correctBox.innerText = correct;
}

if(wrongBox){
    wrongBox.innerText = wrong;
}

if(totalBox){
    totalBox.innerText = total;
}


// ==========================================
// PERFORMANCE MESSAGE
// ==========================================

if(resultMessage){

    if(percentage >= 90){

        resultMessage.innerText =
        "🏆 Excellent Performance";

    }

    else if(percentage >= 75){

        resultMessage.innerText =
        "⭐ Very Good";

    }

    else if(percentage >= 50){

        resultMessage.innerText =
        "🔥 Good Effort";

    }

    else{

        resultMessage.innerText =
        "📚 Keep Practicing";

    }

}

console.log("✅ RESULT PART 1 LOADED");

// ==========================================
// PART 2
// FIRESTORE RANK CALCULATION
// ==========================================

async function calculateRank(){

    try{

        const snapshot =
        await getDocs(collection(db,"results"));

        let students = [];

        snapshot.forEach(doc=>{

            students.push(doc.data());

        });

        // Highest percentage first
        students.sort((a,b)=>{

            if(Number(b.percentage) === Number(a.percentage)){

                return Number(b.score) - Number(a.score);

            }

            return Number(b.percentage) - Number(a.percentage);

        });

        let rank = "-";

        for(let i=0;i<students.length;i++){

            const s = students[i];

            if(
                s.studentName === studentName &&
                Number(s.score) === score &&
                Number(s.percentage) === percentage
            ){

                rank = i + 1;
                break;

            }

        }

        if(rankBox){

            rankBox.innerText = rank;

        }

        console.log("Rank :", rank);

    }

    catch(error){

        console.error("Rank Error :", error);

        if(rankBox){

            rankBox.innerText = "-";

        }

    }

}

calculateRank();


// ==========================================
// RESULT SUMMARY
// ==========================================

console.log("================================");
console.log("Student :", studentName);
console.log("District :", district);
console.log("Score :", score);
console.log("Correct :", correct);
console.log("Wrong :", wrong);
console.log("Unanswered :", unanswered);
console.log("Total :", total);
console.log("Percentage :", percentage + "%");
console.log("================================");

// ==========================================
// PART 3
// QUESTION REVIEW
// ==========================================

if(reviewContainer){

    reviewContainer.innerHTML = "";

    if(review.length === 0){

        reviewContainer.innerHTML = `
            <div class="review-card">
                <h3>No Question Review Available</h3>
            </div>
        `;

    }else{

        review.forEach((item,index)=>{

            let color = "#ffaa00";

            if(item.status === "Correct"){
                color = "#00c853";
            }

            else if(item.status === "Wrong"){
                color = "#ff1744";
            }

            reviewContainer.innerHTML += `

            <div class="review-card">

                <h3>Question ${index+1}</h3>

                <p>
                    <b>Question</b><br>
                    ${item.question}
                </p>

                <hr>

                <p>
                    <b>Your Answer</b><br>
                    <span style="color:${color};font-weight:bold;">
                        ${item.yourAnswer}
                    </span>
                </p>

                <p>
                    <b>Correct Answer</b><br>
                    <span style="color:#00c853;font-weight:bold;">
                        ${item.correctAnswer}
                    </span>
                </p>

                <p>
                    <b>Explanation</b><br>
                    ${item.explanation}
                </p>

                <p style="color:${color};font-weight:bold;">
                    ${item.status}
                </p>

            </div>

            `;

        });

    }

}

console.log("✅ QUESTION REVIEW READY");

// ==========================================
// PART 4
// SHARE + HISTORY + RETRY + PRINT
// ==========================================


// SAVE HISTORY

let history = JSON.parse(
    localStorage.getItem("testHistory")
) || [];

history.push({

    studentName: studentName,
    district: district,

    score: score,
    correct: correct,
    wrong: wrong,
    unanswered: unanswered,

    total: total,
    percentage: percentage,

    testType:
    localStorage.getItem("lastTestType") || "Practice",

    date: new Date().toLocaleString()

});

localStorage.setItem(
    "testHistory",
    JSON.stringify(history)
);


// ==========================================
// SHARE RESULT
// ==========================================

const shareBtn =
document.getElementById("shareBtn");

if(shareBtn){

    shareBtn.onclick = async()=>{

        const text =

`🏆 G THE GENIUS MOCK TEST RESULT

👤 ${studentName}

✅ Correct : ${correct}
❌ Wrong : ${wrong}
📄 Total : ${total}

⭐ Score : ${score}
📊 Percentage : ${percentage}%

`;

        if(navigator.share){

            await navigator.share({

                title:"G THE GENIUS",

                text:text

            });

        }

        else{

            alert(text);

        }

    };

}


// ==========================================
// RETRY TEST
// ==========================================

const retryBtn =
document.getElementById("retryBtn");

if(retryBtn){

    retryBtn.onclick = ()=>{

        history.back();

    };

}


// ==========================================
// PRINT RESULT
// ==========================================

const printBtn =
document.getElementById("printBtn");

if(printBtn){

    printBtn.onclick = ()=>{

        window.print();

    };

}


console.log("✅ PART 4 READY");
// ==========================================
// PART 5
// XP + LEVEL + COINS + BADGE + FINAL
// ==========================================


// XP SYSTEM

let xp =
Number(localStorage.getItem("xp")) || 0;

xp += 10;

localStorage.setItem("xp", xp);


// LEVEL

const level =
Math.floor(xp / 50) + 1;

const levelBox =
document.getElementById("level");

if(levelBox){

    levelBox.innerText =
    "Level " + level;

}


// COINS

let coins =
Number(localStorage.getItem("coins")) || 0;

coins += 5;

localStorage.setItem("coins", coins);

const coinBox =
document.getElementById("coins");

if(coinBox){

    coinBox.innerText = coins;

}


// PASS / FAIL

const badge =
document.getElementById("resultBadge");

if(badge){

    if(percentage >= 35){

        badge.innerHTML = "🏆 PASS";
        badge.style.background = "#00c853";

    }else{

        badge.innerHTML = "❌ FAIL";
        badge.style.background = "#d50000";

    }

}


// PROGRESS BAR

const progressBar =
document.getElementById("progressBar");

if(progressBar){

    progressBar.style.width = "0%";

    setTimeout(()=>{

        progressBar.style.width =
        percentage + "%";

    },300);

}


// CERTIFICATE

const certificateBtn =
document.getElementById("certificateBtn");

if(certificateBtn){

    if(percentage >= 90){

        certificateBtn.style.display =
        "inline-block";

    }else{

        certificateBtn.style.display =
        "none";

    }

}


// FINAL LOG

console.log("====================================");
console.log("G THE GENIUS RESULT READY");
console.log("Student :", studentName);
console.log("Score :", score);
console.log("Correct :", correct);
console.log("Wrong :", wrong);
console.log("Total :", total);
console.log("Percentage :", percentage + "%");
console.log("XP :", xp);
console.log("Level :", level);
console.log("Coins :", coins);
console.log("====================================");
