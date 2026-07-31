// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// RESULT JS
// PART 1 / 4
// ==========================================



import {

auth,
db

} from "./firebase-config.js";






import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";






import {

collection,
query,
where,
orderBy,
limit,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";









// ===============================
// URL DATA
// ===============================



const urlParams =

new URLSearchParams(

window.location.search

);






const marksFromURL =

Number(

urlParams.get("marks")

) || 0;






const totalFromURL =

Number(

urlParams.get("total")

) || 0;











// ===============================
// HTML ELEMENTS
// ===============================



const marksDisplay =

document.getElementById("marks");



const totalQuestions =

document.getElementById("totalQuestions");



const rankDisplay =

document.getElementById("rank");



const resultMessage =

document.getElementById("resultMessage");











// ===============================
// INITIAL MARK DISPLAY
// ===============================



if(marksDisplay){


marksDisplay.innerHTML =

marksFromURL;


}





if(totalQuestions){


totalQuestions.innerHTML =

totalFromURL;


}











// ===============================
// AUTH CHECK
// ===============================



onAuthStateChanged(auth, async(user)=>{



if(!user){


window.location.href="login.html";


return;


}






await loadRank(user.uid);




});

// ==========================================
// RESULT JS
// PART 2 / 4
// RANK + SCORE DETAILS
// ==========================================






// ===============================
// LOAD RANK
// ===============================


async function loadRank(uid){

try{

const resultsRef = collection(db,"results");



// Highest marks first

const q = query(

resultsRef,

orderBy("marks","desc"),

limit(1000)

);



const snapshot = await getDocs(q);

let rank = 1;
let found = false;



snapshot.forEach((doc)=>{

const data = doc.data();

if(!found && data.uid === uid && data.marks === marksFromURL){

found = true;

}else if(!found){

rank++;

}

});



if(rankDisplay){

rankDisplay.textContent = found ? rank : "-";

}



// ===============================
// CORRECT / WRONG
// ===============================

const correctAnswers =
document.getElementById("correctAnswers");

const wrongAnswers =
document.getElementById("wrongAnswers");



if(correctAnswers){

correctAnswers.textContent = marksFromURL;

}



if(wrongAnswers){

wrongAnswers.textContent =
Math.max(0,totalFromURL - marksFromURL);

}



// ===============================
// RESULT MESSAGE
// ===============================

if(resultMessage){

if(marksFromURL === totalFromURL){

resultMessage.textContent =
"🏆 Outstanding Performance!";

}
else if(marksFromURL >= Math.ceil(totalFromURL * 0.8)){

resultMessage.textContent =
"🌟 Excellent! Keep it up!";

}
else if(marksFromURL >= Math.ceil(totalFromURL * 0.6)){

resultMessage.textContent =
"👍 Good Job! Practice More.";

}
else{

resultMessage.textContent =
"📚 Keep Practicing. Success is Near!";

}

}

}catch(error){

console.error("Result Load Error:",error);

}

}

// ==========================================
// RESULT JS
// PART 3 / 4
// STUDENT STATS UPDATE
// ==========================================



import {

doc,
getDoc,
updateDoc,
increment

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// ===============================
// UPDATE STUDENT STATISTICS
// ===============================


async function updateStudentStats(uid){

try{

const studentRef = doc(db,"students",uid);

const studentSnap = await getDoc(studentRef);



if(studentSnap.exists()){

const studentData = studentSnap.data();



// Update student totals

await updateDoc(studentRef,{

totalMarks: increment(marksFromURL),

testsCompleted: increment(1),

lastMarks: marksFromURL,

lastTestDate: new Date(),

lastUpdated: new Date()

});



console.log("Student statistics updated.");

}

}catch(error){

console.error(

"Student Update Error:",

error

);

}

}






// ===============================
// CALL UPDATE
// ===============================


onAuthStateChanged(auth, async(user)=>{

if(user){

await updateStudentStats(user.uid);

}

});






// ===============================
// SAVE LAST RESULT
// ===============================


localStorage.setItem(

"lastMarks",

marksFromURL

);

localStorage.setItem(

"lastTotal",

totalFromURL

);

// ==========================================
// RESULT JS
// PART 4 / 4
// FINAL
// ==========================================





// ===============================
// ACTION BUTTONS
// ===============================

const dashboardBtn =
document.querySelector(
'a[href="dashboard.html"]'
);

const leaderboardBtn =
document.querySelector(
'a[href="leaderboard.html"]'
);

const historyBtn =
document.querySelector(
'a[href="history.html"]'
);





if(dashboardBtn){

dashboardBtn.addEventListener("click",(e)=>{

e.preventDefault();

window.location.href = "dashboard.html";

});

}



if(leaderboardBtn){

leaderboardBtn.addEventListener("click",(e)=>{

e.preventDefault();

window.location.href = "leaderboard.html";

});

}



if(historyBtn){

historyBtn.addEventListener("click",(e)=>{

e.preventDefault();

window.location.href = "history.html";

});

}






// ===============================
// SAVE LAST PAGE
// ===============================

localStorage.setItem(

"lastPage",

"result"

);






// ===============================
// CLEAR TEMP TEST DATA
// ===============================

localStorage.removeItem("selectedAnswers");
localStorage.removeItem("currentQuestion");
localStorage.removeItem("timeLeft");






// ===============================
// PAGE READY
// ===============================

window.addEventListener("load",()=>{

console.log(
"G THE GENIUS Result Page Loaded Successfully"
);

});






// ===============================
// END OF RESULT JS
// ===============================

