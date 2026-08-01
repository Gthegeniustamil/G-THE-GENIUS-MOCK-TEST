alert("RESULT JS LOADED");
// ==========================================
// G THE GENIUS RESULT JS v6.0
// PART 1
// ==========================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// GET RESULT DATA
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

const studentName =
localStorage.getItem("studentName") || "Student";

const district =
localStorage.getItem("district") || "-";

const reviewData =
JSON.parse(localStorage.getItem("lastReview")) || [];
console.log("lastScore =", localStorage.getItem("lastScore"));
console.log("lastCorrect =", localStorage.getItem("lastCorrect"));
console.log("lastWrong =", localStorage.getItem("lastWrong"));
console.log("lastUnanswered =", localStorage.getItem("lastUnanswered"));
console.log("lastTotal =", localStorage.getItem("lastTotal"));
console.log("lastPercentage =", localStorage.getItem("lastPercentage"));
console.log("lastReview =", localStorage.getItem("lastReview"));

// ==========================================
// HTML ELEMENTS
// ==========================================

const marksBox = document.getElementById("marks");

if (marksBox) {
    marksBox.innerText = localStorage.getItem("lastScore") || 0;
}

const correctBox =
document.getElementById("correctAnswers");

const wrongBox =
document.getElementById("wrongAnswers");

const totalBox =
document.getElementById("totalQuestions");

const percentageBox =
document.getElementById("percentage");

const rankBox =
document.getElementById("rank");

const resultMessage =
document.getElementById("resultMessage");

const reviewContainer =
document.getElementById("reviewContainer");


// ==========================================
// DISPLAY RESULT
// ==========================================

if(marksBox) marksBox.innerText = score;

if(correctBox) correctBox.innerText = correct;

if(wrongBox) wrongBox.innerText = wrong;

if(totalBox) totalBox.innerText = total;

if(percentageBox)
percentageBox.innerText = percentage + "%";

}

// ==========================================
// RESULT MESSAGE
// PART 2
// ==========================================

function getPerformanceMessage(){

    if(percentage >= 90){
        return "🏆 Excellent! Top Rank Preparation";
    }

    if(percentage >= 75){
        return "⭐ Very Good! Keep Practicing";
    }

    if(percentage >= 50){
        return "🔥 Good Effort! Keep Improving";
    }

    return "📚 Need More Practice";
}

if(resultMessage){
    resultMessage.innerText = getPerformanceMessage();
}


// ==========================================
// STUDENT DETAILS
// ==========================================

const studentNameBox =
document.getElementById("studentName");

const districtBox =
document.getElementById("district");

if(studentNameBox){
    studentNameBox.innerText = studentName;
}

if(districtBox){
    districtBox.innerText = district;
}


// ==========================================
// RANK CALCULATION
// ==========================================

async function calculateRank(){

    try{

        const snapshot =
        await getDocs(collection(db,"results"));

        let students=[];

        snapshot.forEach(doc=>{

            students.push(doc.data());

        });

        students.sort((a,b)=>

            Number(b.percentage) -
            Number(a.percentage)

        );

        let rank = students.findIndex(item=>

            item.studentName===studentName &&

            Number(item.percentage)===percentage

        ) + 1;

        if(rankBox){

            rankBox.innerText =
            rank > 0 ? rank : "-";

        }

    }

    catch(error){

        console.error("Rank Error:",error);

    }

}

calculateRank();


// ==========================================
// SAVE HISTORY
// ==========================================

let history = JSON.parse(

localStorage.getItem("testHistory")

) || [];

history.push({

    studentName,
    score,
    correct,
    wrong,
    unanswered,
    total,
    percentage,
    date:new Date().toLocaleString()

});

localStorage.setItem(

"testHistory",

JSON.stringify(history)

);


// ==========================================
// PART 3
// QUESTION REVIEW + SHARE + FINAL
// ==========================================

// QUESTION REVIEW

if(reviewContainer){

    reviewContainer.innerHTML = "";

    reviewData.forEach((item,index)=>{

        let color = "#ffaa00";

        if(item.status==="Correct"){
            color="#00ff88";
        }

        if(item.status==="Wrong"){
            color="#ff4444";
        }

        reviewContainer.innerHTML += `

        <div class="review-card">

            <h3>Question ${index+1}</h3>

            <p>
                <b>Question</b><br>
                ${item.question}
            </p>

            <p>
                <b>Your Answer</b><br>
                <span style="color:${color};font-weight:bold;">
                    ${item.yourAnswer}
                </span>
            </p>

            <p>
                <b>Correct Answer</b><br>
                <span style="color:#00ff88;font-weight:bold;">
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



// ==========================================
// SHARE BUTTON
// ==========================================

const shareBtn =
document.getElementById("shareBtn");

if(shareBtn){

    shareBtn.onclick = async()=>{

        const text =

`🏆 G THE GENIUS MOCK TEST

👤 ${studentName}

✅ Correct : ${correct}
❌ Wrong : ${wrong}
📄 Total : ${total}

⭐ Score : ${score}
📊 Percentage : ${percentage}%

`;

        if(navigator.share){

            await navigator.share({

                title:"G THE GENIUS Result",

                text:text

            });

        }

        else{

            alert(text);

        }

    };

}



// ==========================================
// RESULT READY
// ==========================================

console.log("=================================");
console.log("G THE GENIUS RESULT READY");
console.log("Student :",studentName);
console.log("Score :",score);
console.log("Correct :",correct);
console.log("Wrong :",wrong);
console.log("Percentage :",percentage+"%");
console.log("=================================");

// ==========================================
// PART 4
// ADVANCED RESULT FEATURES
// ==========================================


// PASS / FAIL BADGE

const badge =
document.getElementById("resultBadge");

if(badge){

    if(percentage>=35){

        badge.innerHTML="🏆 PASS";

        badge.style.background="#00c853";

    }

    else{

        badge.innerHTML="❌ FAIL";

        badge.style.background="#d50000";

    }

}



// PROGRESS BAR

const progressBar =
document.getElementById("progressBar");

if(progressBar){

    progressBar.style.width="0%";

    setTimeout(()=>{

        progressBar.style.width=

        percentage+"%";

    },300);

}



// XP SYSTEM

let xp=

Number(

localStorage.getItem("xp")

)||0;

xp+=10;

localStorage.setItem(

"xp",

xp

);



// LEVEL SYSTEM

let level=

Math.floor(xp/50)+1;

const levelBox=

document.getElementById("level");

if(levelBox){

levelBox.innerText=

"Level "+level;

}



// COINS

let coins=

Number(

localStorage.getItem("coins")

)||0;

coins+=5;

localStorage.setItem(

"coins",

coins

);

const coinBox=

document.getElementById("coins");

if(coinBox){

coinBox.innerText=coins;

}



// RETRY BUTTON

const retryBtn=

document.getElementById("retryBtn");

if(retryBtn){

retryBtn.onclick=()=>{

history.back();

};

}



// PRINT RESULT

const printBtn=

document.getElementById("printBtn");

if(printBtn){

printBtn.onclick=()=>{

window.print();

};

}



// CERTIFICATE

const certificateBtn=

document.getElementById("certificateBtn");

if(certificateBtn){

if(percentage>=90){

certificateBtn.style.display="inline-block";

}

else{

certificateBtn.style.display="none";

}

}



// FINAL LOG

console.log("================================");

console.log("RESULT FINAL READY");

console.log("XP :",xp);

console.log("LEVEL :",level);

console.log("COINS :",coins);

console.log("================================");
