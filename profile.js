// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// PROFILE JS
// PART 1 / 5
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ==========================================
// HTML ELEMENTS
// ==========================================

const studentName =
document.getElementById("studentName");

const studentEmail =
document.getElementById("studentEmail");

const studentId =
document.getElementById("studentId");

const studentDistrict =
document.getElementById("studentDistrict");

const joinedDate =
document.getElementById("joinedDate");

const bestMarks =
document.getElementById("bestMarks");

const testsCompleted =
document.getElementById("testsCompleted");

const currentRank =
document.getElementById("currentRank");

const totalMarks =
document.getElementById("totalMarks");

const lastMarks =
document.getElementById("lastMarks");

const highestScore =
document.getElementById("highestScore");

const topRankAchievement =
document.getElementById("topRankAchievement");

const testStreak =
document.getElementById("testStreak");

const badgeCount =
document.getElementById("badgeCount");

const logoutBtn =
document.getElementById("logoutBtn");



// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentUser = null;
let studentData = {};
let resultsData = [];

// ==========================================
// PROFILE JS
// PART 2 / 5
// AUTH + LOAD PROFILE
// ==========================================





// ===============================
// AUTH CHECK
// ===============================

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href = "login.html";

return;

}

currentUser = user;

await loadStudentProfile();

await loadStudentResults();

});






// ===============================
// LOAD STUDENT PROFILE
// ===============================

async function loadStudentProfile(){

try{

const studentRef = doc(

db,

"students",

currentUser.uid

);

const studentSnap = await getDoc(studentRef);



if(!studentSnap.exists()){

alert("Student profile not found.");

return;

}



studentData = studentSnap.data();



// ===============================
// DISPLAY PROFILE
// ===============================

studentName.textContent =
studentData.name || "Student";

studentEmail.textContent =
currentUser.email || "-";

studentId.textContent =
currentUser.uid;

studentDistrict.textContent =
studentData.district || "-";



// Joined Date

if(studentData.createdAt){

const date = studentData.createdAt.toDate();

joinedDate.textContent =
date.toLocaleDateString("en-IN");

}else{

joinedDate.textContent = "-";

}

}
catch(error){

console.error(

"Profile Load Error:",

error

);

}

}

// ==========================================
// PROFILE JS
// PART 3 / 5
// RESULTS + PERFORMANCE
// ==========================================





// ===============================
// LOAD STUDENT RESULTS
// ===============================

async function loadStudentResults(){

try{

const q = query(

collection(db,"results"),

where("uid","==",currentUser.uid)

);

const snapshot = await getDocs(q);

resultsData = [];

snapshot.forEach((doc)=>{

resultsData.push(doc.data());

});



// No Results

if(resultsData.length === 0){

bestMarks.textContent = "0";
testsCompleted.textContent = "0";
totalMarks.textContent = "0";
lastMarks.textContent = "0";
highestScore.textContent = "0";
currentRank.textContent = "-";

return;

}



// ===============================
// CALCULATIONS
// ===============================

const marksList =

resultsData.map(item=>

Number(item.marks) || 0

);

const best = Math.max(...marksList);

const total = marksList.reduce(

(a,b)=>a+b,

0

);

const latest =

marksList[marksList.length-1];



// UI

bestMarks.textContent = best;

highestScore.textContent = best;

testsCompleted.textContent =

resultsData.length;

totalMarks.textContent = total;

lastMarks.textContent = latest;



await calculateCurrentRank();

await updateAchievements();

}
catch(error){

console.error(

"Results Load Error:",

error

);

}

}





// ===============================
// CURRENT RANK
// ===============================

async function calculateCurrentRank(){

const snapshot = await getDocs(

query(

collection(db,"results")

)

);



const allResults = [];

snapshot.forEach((doc)=>{

allResults.push(doc.data());

});



allResults.sort(

(a,b)=>

(b.marks||0)-(a.marks||0)

);



const rank =

allResults.findIndex(

item=>item.uid===currentUser.uid

)+1;



currentRank.textContent =

rank>0 ? rank : "-";

}

// ==========================================
// PROFILE JS
// PART 4 / 5
// ACHIEVEMENTS + LOGOUT
// ==========================================





// ===============================
// UPDATE ACHIEVEMENTS
// ===============================

async function updateAchievements(){

const totalTests = resultsData.length;

const highest = Math.max(

...resultsData.map(item => Number(item.marks) || 0)

);



// Top Rank Achievement

if(Number(currentRank.textContent) === 1){

topRankAchievement.textContent = "🏆 Rank #1";

}else if(Number(currentRank.textContent) <= 10){

topRankAchievement.textContent = "🥇 Top 10";

}else if(Number(currentRank.textContent) <= 50){

topRankAchievement.textContent = "🥈 Top 50";

}else{

topRankAchievement.textContent = "Keep Practicing";

}



// Test Streak (Basic)

testStreak.textContent =

`${totalTests} Tests`;



// Badge Count

let badges = 0;

if(totalTests >= 5) badges++;
if(totalTests >= 10) badges++;
if(highest >= 80) badges++;
if(highest >= 90) badges++;
if(highest === 100) badges++;

badgeCount.textContent =

`${badges} Earned`;

}





// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener(

"click",

async(e)=>{

e.preventDefault();

try{

await signOut(auth);

localStorage.clear();

sessionStorage.clear();

window.location.href = "login.html";

}
catch(error){

console.error(

"Logout Error:",

error

);

alert("Unable to logout.");

}

}

);





// ===============================
// REFRESH PROFILE
// ===============================

window.addEventListener(

"focus",

async()=>{

if(currentUser){

await loadStudentProfile();

await loadStudentResults();

}

}

);

// ==========================================
// PROFILE JS
// PART 5 / 5
// FINAL
// ==========================================





// ===============================
// LOADING COMPLETE
// ===============================

function hideLoading(){

const loader = document.getElementById("loader");

if(loader){

loader.style.display = "none";

}

}





// ===============================
// PAGE READY
// ===============================

window.addEventListener("load",()=>{

console.log(

"G THE GENIUS Profile Loaded Successfully"

);

hideLoading();

});





// ===============================
// GLOBAL ERROR HANDLER
// ===============================

window.addEventListener("error",(event)=>{

console.error(

"Profile Page Error:",

event.message

);

});





// ===============================
// UNHANDLED PROMISE HANDLER
// ===============================

window.addEventListener(

"unhandledrejection",

(event)=>{

console.error(

"Unhandled Promise:",

event.reason

);

}

);





// ===============================
// SAVE LAST PAGE
// ===============================

localStorage.setItem(

"lastPage",

"profile"

);





// ===============================
// END OF PROFILE JS
// ===============================
