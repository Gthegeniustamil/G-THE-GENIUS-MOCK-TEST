// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// HISTORY JS
// PART 1 / 5
// ==========================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ==========================================
// HTML ELEMENTS
// ==========================================

const studentName =
document.getElementById("studentName");

const studentEmail =
document.getElementById("studentEmail");

const historyList =
document.getElementById("historyList");

const emptyHistory =
document.getElementById("emptyHistory");

const searchHistory =
document.getElementById("searchHistory");

const historyFilter =
document.getElementById("historyFilter");

const refreshHistory =
document.getElementById("refreshHistory");

const totalTests =
document.getElementById("totalTests");

const bestMarks =
document.getElementById("bestMarks");

const averageMarks =
document.getElementById("averageMarks");

const latestScore =
document.getElementById("latestScore");

const highestScore =
document.getElementById("highestScore");

const successRate =
document.getElementById("successRate");



// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentUser = null;

let historyData = [];

let filteredHistory = [];

// ==========================================
// HISTORY JS
// PART 2 / 5
// AUTH + LOAD HISTORY
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

    studentName.textContent =
    user.displayName || "Student";

    studentEmail.textContent =
    user.email || "-";

    await loadHistory();

});






// ===============================
// LOAD HISTORY
// ===============================

async function loadHistory(){

    try{

        const q = query(

            collection(db,"results"),

            where("uid","==",currentUser.uid),

            orderBy("createdAt","desc")

        );

        const snapshot = await getDocs(q);

        historyData = [];

        snapshot.forEach((doc)=>{

            historyData.push({

                id:doc.id,

                ...doc.data()

            });

        });

        filteredHistory = [...historyData];

        updateStatistics();

        renderHistory(filteredHistory);

    }
    catch(error){

        console.error(

            "History Load Error:",

            error

        );

    }

}

// ==========================================
// HISTORY JS
// PART 3 / 5
// RENDER HISTORY + STATISTICS
// ==========================================





// ===============================
// RENDER HISTORY
// ===============================

function renderHistory(data){

    historyList.innerHTML = "";

    if(data.length === 0){

        emptyHistory.style.display = "block";
        historyList.style.display = "none";
        return;

    }

    emptyHistory.style.display = "none";
    historyList.style.display = "flex";

    data.forEach(item=>{

        const date = item.timestamp
        ? item.timestamp.toDate().toLocaleString("en-IN")
        : "-";

        historyList.innerHTML += `

        <div class="history-card">

            <div class="history-top">

                <span class="test-type">

                    ${item.testType || "Mock Test"}

                </span>

                <span class="test-date">

                    ${date}

                </span>

            </div>

            <div class="history-body">

                <h3>

                    ${item.title || "TNUSRB Mock Test"}

                </h3>

                <div class="history-details">

                    <div>

                        <strong>Marks</strong>

                        <p>${item.marks || 0}</p>

                    </div>

                    <div>

                        <strong>Percentage</strong>

                        <p>${item.percentage || 0}%</p>

                    </div>

                    <div>

                        <strong>Rank</strong>

                        <p>#${item.rank || "-"}</p>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}





// ===============================
// UPDATE STATISTICS
// ===============================

function updateStatistics(){

    if(historyData.length === 0){

        totalTests.textContent = "0";
        bestMarks.textContent = "0";
        averageMarks.textContent = "0";
        latestScore.textContent = "0";
        highestScore.textContent = "0";
        successRate.textContent = "0%";

        return;

    }

    const marks = historyData.map(item => Number(item.score) || 0);
    const best = Math.max(...marks);

    const average = Math.round(

        marks.reduce((a,b)=>a+b,0) / marks.length

    );

    totalTests.textContent = historyData.length;
    bestMarks.textContent = best;
    averageMarks.textContent = average;
    latestScore.textContent = marks[0];
    highestScore.textContent = best;

    const success = Math.round(

        (marks.filter(m => m >= 35).length / marks.length) * 100

    );

    successRate.textContent = success + "%";

}

// ==========================================
// HISTORY JS
// PART 4 / 5
// SEARCH + FILTER + REFRESH
// ==========================================





// ===============================
// APPLY FILTER
// ===============================

function applyFilter(){

    let data = [...historyData];

    // Search

    const keyword =

    searchHistory.value
    .trim()
    .toLowerCase();

    if(keyword){

        data = data.filter(item=>

            (item.title || "")
            .toLowerCase()
            .includes(keyword)

        );

    }



    // Test Type Filter

    const filter = historyFilter.value;

    if(filter !== "all"){

        if(filter === "subject"){

            data = data.filter(item=>

                item.subject &&
                item.subject !== ""

            );

        }

        else if(filter === "topic"){

            data = data.filter(item=>

                item.topic &&
                item.topic !== ""

            );

        }

        else{

            data = data.filter(item=>

                item.testType === filter

            );

        }

    }

    filteredHistory = data;

    renderHistory(filteredHistory);

}





// ===============================
// SEARCH EVENT
// ===============================

searchHistory.addEventListener(

    "input",

    ()=>{

        applyFilter();

    }

);





// ===============================
// FILTER EVENT
// ===============================

historyFilter.addEventListener(

    "change",

    ()=>{

        applyFilter();

    }

);





// ===============================
// REFRESH BUTTON
// ===============================

refreshHistory.addEventListener(

    "click",

    async()=>{

        await loadHistory();

    }

);

// ==========================================
// HISTORY JS
// PART 5 / 5
// FINAL
// ==========================================





// ===============================
// HIDE LOADING
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

        "G THE GENIUS History Loaded Successfully"

    );

    hideLoading();

});





// ===============================
// AUTO REFRESH
// ===============================

window.addEventListener(

    "focus",

    async()=>{

        if(currentUser){

            await loadHistory();

        }

    }

);





// ===============================
// GLOBAL ERROR HANDLER
// ===============================

window.addEventListener(

    "error",

    (event)=>{

        console.error(

            "History Page Error:",

            event.message

        );

    }

);





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

    "history"

);





// ===============================
// END OF FILE
// ===============================
