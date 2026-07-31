// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// LEADERBOARD JS
// PART 1 / 5
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
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ===============================
// HTML ELEMENTS
// ===============================

const leaderboardList =
document.getElementById("leaderboardList");

const testFilter =
document.getElementById("testFilter");

const searchStudent =
document.getElementById("searchStudent");

const refreshLeaderboard =
document.getElementById("refreshLeaderboard");



// PODIUM

const firstName =
document.getElementById("firstName");

const firstMarks =
document.getElementById("firstMarks");

const secondName =
document.getElementById("secondName");

const secondMarks =
document.getElementById("secondMarks");

const thirdName =
document.getElementById("thirdName");

const thirdMarks =
document.getElementById("thirdMarks");



// STUDENT INFO

const myRank =
document.getElementById("myRank");

const myMarks =
document.getElementById("myMarks");

const myTests =
document.getElementById("myTests");



// SUMMARY

const totalStudents =
document.getElementById("totalStudents");

const totalTests =
document.getElementById("totalTests");

const highestMarks =
document.getElementById("highestMarks");



// ===============================
// GLOBAL VARIABLES
// ===============================

let leaderboardData = [];

let currentUser = null;

// ==========================================
// LEADERBOARD JS
// PART 2 / 5
// AUTH + LOAD LEADERBOARD
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

await loadLeaderboard();

});






// ===============================
// LOAD LEADERBOARD
// ===============================

async function loadLeaderboard(){

try{

const q = query(

collection(db,"results"),

orderBy("marks","desc")

);

const snapshot = await getDocs(q);

leaderboardData = [];

snapshot.forEach((doc)=>{

leaderboardData.push({

id:doc.id,

...doc.data()

});

});



// Apply current filter

applyFilter();

}
catch(error){

console.error(

"Leaderboard Load Error:",

error

);

}

}






// ===============================
// TOP 3 PODIUM
// ===============================

function loadPodium(data){

const topThree = data.slice(0,3);



if(topThree[0]){

firstName.textContent =
topThree[0].name || "Student";

firstMarks.textContent =
`${topThree[0].marks} Marks`;

}



if(topThree[1]){

secondName.textContent =
topThree[1].name || "Student";

secondMarks.textContent =
`${topThree[1].marks} Marks`;

}



if(topThree[2]){

thirdName.textContent =
topThree[2].name || "Student";

thirdMarks.textContent =
`${topThree[2].marks} Marks`;

}



// Summary

totalTests.textContent = data.length;

highestMarks.textContent =
data.length ? data[0].marks : 0;

const uniqueStudents =

new Set(data.map(item=>item.uid));

totalStudents.textContent =
uniqueStudents.size;

}
// ==========================================
// LEADERBOARD JS
// PART 3 / 5
// FILTER + SEARCH + LIST
// ==========================================





// ===============================
// APPLY FILTER
// ===============================

function applyFilter(){

let filteredData = [...leaderboardData];



// Test Type Filter

const selectedFilter = testFilter.value;

if(selectedFilter !== "all"){

filteredData = filteredData.filter(item=>{

if(selectedFilter === "subject"){

return item.subject &&
item.subject !== "";

}

if(selectedFilter === "topic"){

return item.topic &&
item.topic !== "";

}

return item.testType === selectedFilter;

});

}



// Search Filter

const keyword =

searchStudent.value
.trim()
.toLowerCase();

if(keyword){

filteredData = filteredData.filter(item=>

(item.name || "")
.toLowerCase()
.includes(keyword)

);

}



// Reload UI

loadPodium(filteredData);

renderLeaderboard(filteredData);

updateMyRank(filteredData);

}






// ===============================
// RENDER LEADERBOARD
// ===============================

function renderLeaderboard(data){

leaderboardList.innerHTML = "";



data.forEach((item,index)=>{

const row =
document.createElement("div");

row.className =
"leaderboard-row";

row.innerHTML = `

<span class="rank">
#${index+1}
</span>

<span class="student-name">
${item.name || "Student"}
</span>

<span class="student-marks">
${item.marks}
</span>

`;

leaderboardList.appendChild(row);

});

}

// ==========================================
// LEADERBOARD JS
// PART 4 / 5
// MY RANK + EVENTS
// ==========================================





// ===============================
// CURRENT STUDENT RANK
// ===============================

function updateMyRank(data){

if(!currentUser) return;

const index = data.findIndex(item=>

item.uid === currentUser.uid

);

if(index === -1){

myRank.textContent = "-";
myMarks.textContent = "0";
myTests.textContent = "0";

return;

}



// Student Results

const myResults = data.filter(item=>

item.uid === currentUser.uid

);



// Best Marks

const bestMarks = Math.max(

...myResults.map(item=>item.marks)

);



// UI Update

myRank.textContent = index + 1;

myMarks.textContent = bestMarks;

myTests.textContent = myResults.length;

}






// ===============================
// REFRESH BUTTON
// ===============================

refreshLeaderboard.addEventListener(

"click",

async()=>{

await loadLeaderboard();

}

);






// ===============================
// SEARCH EVENT
// ===============================

searchStudent.addEventListener(

"input",

()=>{

applyFilter();

}

);






// ===============================
// FILTER EVENT
// ===============================

testFilter.addEventListener(

"change",

()=>{

applyFilter();

}

);

// ==========================================
// LEADERBOARD JS
// PART 5 / 5
// FINAL
// ==========================================





// ===============================
// EMPTY STATE
// ===============================

function showEmptyState(){

leaderboardList.innerHTML = `

<div class="leaderboard-empty">

<h3>No Results Found</h3>

<p>No leaderboard data is available.</p>

</div>

`;

}





// ===============================
// UPDATE UI
// ===============================

function updateLeaderboardUI(data){

if(data.length === 0){

showEmptyState();

return;

}

loadPodium(data);

renderLeaderboard(data);

updateMyRank(data);

}





// ===============================
// SAFE FILTER
// ===============================

const oldApplyFilter = applyFilter;

applyFilter = function(){

let filteredData = [...leaderboardData];



// Test Filter

const selected = testFilter.value;

if(selected !== "all"){

if(selected === "subject"){

filteredData = filteredData.filter(item=>item.subject);

}
else if(selected === "topic"){

filteredData = filteredData.filter(item=>item.topic);

}
else{

filteredData = filteredData.filter(

item=>item.testType === selected

);

}

}



// Search

const keyword =

searchStudent.value
.trim()
.toLowerCase();

if(keyword){

filteredData = filteredData.filter(item=>

(item.name || "")
.toLowerCase()
.includes(keyword)

);

}



updateLeaderboardUI(filteredData);

};






// ===============================
// PAGE READY
// ===============================

window.addEventListener("load",()=>{

console.log(

"G THE GENIUS Leaderboard Loaded Successfully"

);

});






// ===============================
// END OF FILE
// ===============================


