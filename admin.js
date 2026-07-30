// =========================
// G THE GENIUS ADMIN JS
// FULL IMPORTS
// =========================


import { db, auth } from "./firebase-config.js";


// FIRESTORE

import {

    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// AUTH

import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let allQuestions = [];
let previewQuestions = [];

// =========================
// SUBJECT TOPICS
// =========================

const topics = {

  "Indian Polity": [
    "Constitution",
    "Preamble",
    "Citizenship",
    "Fundamental Rights",
    "Fundamental Duties",
    "Directive Principles",
    "Parliament",
    "Lok Sabha",
    "Rajya Sabha",
    "President",
    "Vice President",
    "Prime Minister",
    "Council of Ministers",
    "Governor",
    "Chief Minister",
    "Supreme Court",
    "High Court",
    "Election Commission",
    "Finance Commission",
    "CAG",
    "Attorney General",
    "Emergency Provisions",
    "Constitutional Bodies",
    "Non Constitutional Bodies",
    "Local Government",
    "Panchayati Raj",
    "Municipal Administration",
    "Schedules",
    "Important Articles",
    "Constitution Amendments"
  ]

};

// =========================
// SUBJECT → TOPIC LOADER
// =========================

const bulkSubject = document.getElementById("bulkSubject");
const bulkTopic = document.getElementById("bulkTopic");

if (bulkSubject && bulkTopic) {

  bulkSubject.addEventListener("change", function () {

    bulkTopic.innerHTML =
      `<option value="">Select Topic</option>`;

    const selectedSubject = this.value;

    if (topics[selectedSubject]) {

      topics[selectedSubject].forEach(topic => {

        const option = document.createElement("option");

        option.value = topic;
        option.textContent = topic;

        bulkTopic.appendChild(option);

      });

    }

  });

}

console.log("✅ Part 1A-1 Loaded");

// =========================
// PART 1A-2
// MORE SUBJECT TOPICS
// =========================

topics["Indian Constitution"] = [
  "Making of Constitution",
  "Constituent Assembly",
  "Drafting Committee",
  "Salient Features",
  "Schedules",
  "Articles",
  "Citizenship",
  "Fundamental Rights",
  "Fundamental Duties",
  "Directive Principles",
  "Union Government",
  "State Government",
  "Judiciary",
  "Emergency",
  "Constitutional Amendments"
];

topics["Indian History"] = [
  "Prehistoric Period",
  "Indus Valley Civilization",
  "Vedic Age",
  "Mahajanapadas",
  "Jainism",
  "Buddhism",
  "Mauryan Empire",
  "Gupta Empire",
  "Delhi Sultanate",
  "Mughal Empire",
  "Marathas",
  "European Arrival",
  "British Rule",
  "Governor Generals",
  "Viceroys"
];

topics["World History"] = [
  "French Revolution",
  "American Revolution",
  "Industrial Revolution",
  "Russian Revolution",
  "Renaissance",
  "Reformation",
  "World War I",
  "World War II",
  "United Nations",
  "Cold War",
  "Nazism",
  "Fascism",
  "Important Treaties",
  "World Leaders",
  "International Organizations"
];

topics["Freedom Struggle"] = [
  "1857 Revolt",
  "INC Formation",
  "Moderates",
  "Extremists",
  "Partition of Bengal",
  "Swadeshi Movement",
  "Home Rule Movement",
  "Non Cooperation Movement",
  "Civil Disobedience Movement",
  "Quit India Movement",
  "Revolutionary Movement",
  "Subash Chandra Bose",
  "INA",
  "Cabinet Mission",
  "Indian Independence"
];

topics["Tamil Nadu History"] = [
  "Sangam Age",
  "Kalabhras",
  "Pallavas",
  "Pandyas",
  "Cholas",
  "Cheras",
  "Nayaks",
  "Marathas",
  "Poligars",
  "Freedom Fighters",
  "Social Reformers",
  "Tamil Culture",
  "Temple Architecture",
  "Literature",
  "Important Kings"
];

console.log("✅ Part 1A-2 Loaded");

// =========================
// PART 1A-3
// GEOGRAPHY + SCIENCE TOPICS
// =========================

topics["Geography"] = [
  "Earth",
  "Solar System",
  "Latitude & Longitude",
  "Climate",
  "Rivers",
  "Mountains",
  "Plateaus",
  "Deserts",
  "Soil",
  "Agriculture",
  "Minerals",
  "Natural Resources",
  "Forests",
  "Environment",
  "Map Based Questions"
];

topics["Indian Geography"] = [
  "Physical Features",
  "States & Capitals",
  "Rivers",
  "Dams",
  "Mountains",
  "Climate",
  "Monsoon",
  "Soil",
  "Agriculture",
  "National Parks",
  "Wildlife Sanctuaries",
  "Minerals",
  "Industries",
  "Transport",
  "Important Places"
];

topics["World Geography"] = [
  "Continents",
  "Countries",
  "Capitals",
  "Oceans",
  "Seas",
  "Rivers",
  "Mountains",
  "Deserts",
  "Volcanoes",
  "Earthquakes",
  "Climate",
  "Time Zones",
  "Natural Resources",
  "Important Straits",
  "World Maps"
];

topics["Tamil Nadu Geography"] = [
  "Districts",
  "Rivers",
  "Dams",
  "Mountains",
  "Climate",
  "Soil",
  "Agriculture",
  "Industries",
  "National Parks",
  "Wildlife Sanctuaries",
  "Transport",
  "Tourist Places",
  "Resources",
  "Power Projects",
  "Important Places"
];

topics["General Science"] = [
  "Physics",
  "Chemistry",
  "Biology",
  "Human Body",
  "Diseases",
  "Nutrition",
  "Environment",
  "Science & Technology",
  "Inventions",
  "Scientists",
  "Units & Measurements",
  "Everyday Science",
  "Space Science",
  "Medical Science",
  "Latest Science"
];

topics["Physics"] = [
  "Motion",
  "Force",
  "Work",
  "Power",
  "Energy",
  "Gravitation",
  "Heat",
  "Light",
  "Sound",
  "Electricity",
  "Magnetism",
  "Modern Physics",
  "Units",
  "Laws of Motion",
  "Waves"
];

topics["Chemistry"] = [
  "Matter",
  "Atom",
  "Molecule",
  "Elements",
  "Compounds",
  "Mixtures",
  "Periodic Table",
  "Chemical Bonding",
  "Acids",
  "Bases",
  "Salts",
  "Metals",
  "Non-Metals",
  "Chemical Reactions",
  "Organic Chemistry"
];

topics["Biology"] = [
  "Cell",
  "Tissues",
  "Human Body",
  "Digestive System",
  "Respiratory System",
  "Circulatory System",
  "Nervous System",
  "Plant Kingdom",
  "Animal Kingdom",
  "Genetics",
  "Evolution",
  "Nutrition",
  "Diseases",
  "Vaccines",
  "Biotechnology"
];

console.log("✅ Part 1A-3 Loaded");

// =========================
// PART 1A-5
// ECONOMICS + CURRENT AFFAIRS + COMPUTER
// =========================

topics["Economics"] = [
    "Basic Economics",
    "Micro Economics",
    "Macro Economics",
    "Demand",
    "Supply",
    "Production",
    "Consumption",
    "Market",
    "Inflation",
    "Deflation",
    "National Income",
    "Economic Development",
    "Poverty",
    "Unemployment",
    "Five Year Plans"
];

topics["Indian Economy"] = [
    "GDP",
    "GNP",
    "National Income",
    "NITI Aayog",
    "Planning Commission",
    "Union Budget",
    "Taxation",
    "GST",
    "Banking",
    "RBI",
    "SEBI",
    "Finance Commission",
    "Economic Survey",
    "Public Finance",
    "Government Schemes"
];

topics["Tamil Nadu Economy"] = [
    "Agriculture",
    "Industries",
    "Textile Industry",
    "MSME",
    "Tourism",
    "Government Schemes",
    "Economic Growth",
    "Employment",
    "Co-operative Societies",
    "Rural Development"
];

topics["Current Affairs"] = [
    "National",
    "Tamil Nadu",
    "International",
    "Economy",
    "Science & Technology",
    "Sports",
    "Awards",
    "Appointments",
    "Books & Authors",
    "Important Days",
    "Government Schemes",
    "Defence",
    "Environment",
    "Space",
    "Obituaries"
];

topics["Tamil Nadu GK"] = [
    "Districts",
    "Rivers",
    "Dams",
    "Temples",
    "Festivals",
    "Freedom Fighters",
    "Chief Ministers",
    "Governors",
    "Government Schemes",
    "Tourist Places",
    "Industries",
    "Important Personalities",
    "Awards",
    "Culture",
    "Current Affairs"
];

topics["Computer Science"] = [
    "Computer Basics",
    "Hardware",
    "Software",
    "Operating System",
    "MS Office",
    "Internet",
    "Email",
    "Networking",
    "Cyber Security",
    "Memory",
    "Input Devices",
    "Output Devices",
    "Programming Basics",
    "Database",
    "Artificial Intelligence"
];

topics["Aptitude"] = [
    "Number System",
    "Percentage",
    "Ratio & Proportion",
    "Average",
    "Profit & Loss",
    "Simple Interest",
    "Compound Interest",
    "Time & Work",
    "Time & Distance",
    "Boat & Stream",
    "Age Problems",
    "Mixture",
    "Partnership",
    "HCF & LCM",
    "Simplification"
];

topics["Reasoning"] = [
    "Analogy",
    "Classification",
    "Coding-Decoding",
    "Blood Relation",
    "Direction Sense",
    "Ranking",
    "Number Series",
    "Alphabet Series",
    "Puzzle",
    "Syllogism",
    "Statement & Conclusion",
    "Clock",
    "Calendar",
    "Mirror Image",
    "Paper Folding"
];

console.log("✅ PART 1A-5 Loaded");
// =========================
// PART 1A-6
// LANGUAGE + GK + FINAL SUBJECTS
// =========================

topics["Tamil"] = [
    "தமிழ் இலக்கணம்",
    "பெயர்ச்சொல்",
    "வினைச்சொல்",
    "இடைச்சொல்",
    "உரிச்சொல்",
    "சங்க இலக்கியம்",
    "ஐம்பெரும் காப்பியங்கள்",
    "ஐஞ்சிறு காப்பியங்கள்",
    "திருக்குறள்",
    "நன்னூல்",
    "பழமொழிகள்",
    "இலக்கிய ஆசிரியர்கள்",
    "தமிழ் எழுத்துக்கள்",
    "புணர்ச்சி",
    "வினா விடை"
];

topics["English"] = [
    "Grammar",
    "Parts of Speech",
    "Tenses",
    "Articles",
    "Prepositions",
    "Voice",
    "Narration",
    "Synonyms",
    "Antonyms",
    "One Word Substitution",
    "Idioms & Phrases",
    "Vocabulary",
    "Comprehension",
    "Error Spotting",
    "Sentence Improvement"
];

topics["Sports"] = [
    "Olympics",
    "Asian Games",
    "Commonwealth Games",
    "Cricket",
    "Football",
    "Hockey",
    "Tennis",
    "Chess",
    "Badminton",
    "Athletics",
    "World Cup",
    "Indian Players",
    "Sports Awards",
    "Sports Personalities",
    "Recent Sports"
];

topics["Awards and Honours"] = [
    "Bharat Ratna",
    "Padma Awards",
    "Gallantry Awards",
    "Nobel Prize",
    "Oscar Awards",
    "Booker Prize",
    "Jnanpith Award",
    "Dadasaheb Phalke Award",
    "Arjuna Award",
    "Khel Ratna"
];

topics["Books and Authors"] = [
    "Indian Authors",
    "Tamil Authors",
    "Famous Books",
    "Autobiographies",
    "Biographies",
    "Recent Books",
    "Literature",
    "Novels",
    "Poets",
    "Classical Works"
];

topics["Important Days"] = [
    "National Days",
    "International Days",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

topics["Art and Culture"] = [
    "Dance",
    "Music",
    "Drama",
    "Painting",
    "Architecture",
    "Festivals",
    "UNESCO Heritage",
    "Temple Art",
    "Folk Arts",
    "Classical Arts"
];

topics["Defence"] = [
    "Indian Army",
    "Indian Navy",
    "Indian Air Force",
    "Missiles",
    "Military Exercises",
    "Defence Organisations",
    "DRDO",
    "BSF",
    "CRPF",
    "Defence Current Affairs"
];

topics["Space Technology"] = [
    "ISRO",
    "NASA",
    "Satellites",
    "Launch Vehicles",
    "Space Missions",
    "Chandrayaan",
    "Mangalyaan",
    "Gaganyaan",
    "Space Stations",
    "Recent Space News"
];

topics["Previous Year Questions"] = [
    "TNUSRB PYQ",
    "TNPSC PYQ",
    "SSC PYQ",
    "RRB PYQ",
    "UPSC PYQ",
    "Police Constable PYQ",
    "SI PYQ",
    "Forest PYQ",
    "Group 2 PYQ",
    "Group 4 PYQ"
];

topics["Model Questions"] = [
    "Practice Set 1",
    "Practice Set 2",
    "Practice Set 3",
    "Mock Test",
    "Grand Test",
    "Easy Level",
    "Medium Level",
    "Hard Level",
    "Mixed Questions",
    "Revision Test"
];

console.log("✅ PART 1A-6 Loaded");

// =========================
// PART 2A-1
// LOAD QUESTIONS FROM FIRESTORE
// =========================

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let allQuestions = [];

// =========================
// LOAD QUESTIONS
// =========================

async function loadQuestions() {

    const list = document.getElementById("questionList");

    if (!list) return;

    list.innerHTML = `
        <div class="loading">
            Loading Questions...
        </div>
    `;

    try {

        const snapshot = await getDocs(
            collection(db, "questions")
        );

        allQuestions = [];

        snapshot.forEach((item) => {

            allQuestions.push({
                id: item.id,
                ...item.data()
            });

        });

        displayQuestions(allQuestions);

    }

    catch (error) {

        console.error(error);

        list.innerHTML = `
            <p>Failed to load questions.</p>
        `;

    }

}

// =========================
// DISPLAY QUESTIONS
// =========================

function displayQuestions(data) {

    const list = document.getElementById("questionList");

    if (!list) return;

    list.innerHTML = "";

    if (data.length === 0) {

        list.innerHTML = `
            <p>No Questions Found.</p>
        `;

        return;
    }

    data.forEach((q) => {

        const card = document.createElement("div");

        card.className = "question-item";

        card.innerHTML = `

<h3>${q.question}</h3>

<p><b>Subject :</b> ${q.subject}</p>

<p><b>Topic :</b> ${q.topic}</p>

<p>
A) ${q.options?.[0] || ""}
<br>
B) ${q.options?.[1] || ""}
<br>
C) ${q.options?.[2] || ""}
<br>
D) ${q.options?.[3] || ""}
</p>

<p>
<b>Correct Answer :</b> ${q.answer}
</p>

<p>
<b>Explanation :</b>
${q.explanation || "-"}
</p>

<button
class="delete-btn"
onclick="deleteQuestion('${q.id}')">
🗑 Delete
</button>

        `;

        list.appendChild(card);

    });

}

// =========================
// DELETE QUESTION
// =========================

window.deleteQuestion = async function (id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {

        await deleteDoc(
            doc(db, "questions", id)
        );

        alert("✅ Question Deleted Successfully");

        loadQuestions();
        loadAdminStats();

    }

    catch (error) {

        console.error("Delete Error :", error);

        alert("❌ Failed to Delete Question");

    }

};


// =========================
// SEARCH QUESTIONS
// =========================

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

    searchBtn.onclick = () => {

        const keyword = document
            .getElementById("searchQuestion")
            .value
            .trim()
            .toLowerCase();

        if (keyword === "") {

            displayQuestions(allQuestions);
            return;

        }

        const result = allQuestions.filter(q => {

            return (

                q.question?.toLowerCase().includes(keyword) ||

                q.subject?.toLowerCase().includes(keyword) ||

                q.topic?.toLowerCase().includes(keyword)

            );

        });

        displayQuestions(result);

    };

}

// =========================
// SUBJECT FILTER
// =========================

const filterSubject = document.getElementById("filterSubject");
const filterTopic = document.getElementById("filterTopic");
const filterBtn = document.getElementById("filterBtn");

if (filterSubject) {

    filterSubject.addEventListener("change", function () {

        const subject = this.value;

        filterTopic.innerHTML = `
            <option value="all">
                All Topics
            </option>
        `;

        let topicList = [];

        allQuestions.forEach(q => {

            if (
                subject === "all" ||
                q.subject === subject
            ) {

                if (
                    q.topic &&
                    !topicList.includes(q.topic)
                ) {

                    topicList.push(q.topic);

                }

            }

        });

        topicList.sort();

        topicList.forEach(topic => {

            filterTopic.innerHTML += `
                <option value="${topic}">
                    ${topic}
                </option>
            `;

        });

    });

}

// =========================
// APPLY FILTER
// =========================

if (filterBtn) {

    filterBtn.addEventListener("click", () => {

        const subject = filterSubject.value;
        const topic = filterTopic.value;

        const filteredQuestions = allQuestions.filter(q => {

            const subjectMatch =
                subject === "all" ||
                q.subject === subject;

            const topicMatch =
                topic === "all" ||
                q.topic === topic;

            return subjectMatch && topicMatch;

        });

        displayQuestions(filteredQuestions);

    });

      // =========================
// INITIALIZE ADMIN PANEL
// =========================

window.addEventListener("load", async () => {

    try {

        await loadQuestions();
        await loadAdminStats();

        console.log("✅ Questions Loaded");
        console.log("✅ Admin Stats Loaded");
        console.log("🚀 G THE GENIUS Admin Panel Ready");

    }

    catch (error) {

        console.error("Initialization Error:", error);

    }

});

}
// =========================
// VALIDATE QUESTION
// =========================

function validateQuestion(question) {

    if (!question.question || question.question.trim() === "") {
        return false;
    }

    if (!question.options || !Array.isArray(question.options)) {
        return false;
    }

    if (question.options.length !== 4) {
        return false;
    }

    for (let option of question.options) {
        if (!option || option.trim() === "") {
            return false;
        }
    }

    if (
        question.answer === undefined ||
        question.answer === null ||
        question.answer < 0 ||
        question.answer > 3
    ) {
        return false;
    }

    return true;
}

console.log("✅ Question Validation Ready");



// =========================
// PART 3A-1
// JSON FILE PREVIEW
// =========================

const jsonFile = document.getElementById("jsonFile");
const questionCount = document.getElementById("questionCount");

let previewQuestions = [];

if (jsonFile) {

    jsonFile.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {

            try {

                const data = JSON.parse(e.target.result);

                if (!Array.isArray(data)) {

                    alert("❌ Invalid JSON Format");
                    return;

                }

                previewQuestions = data;

                if (questionCount) {
                    questionCount.textContent = data.length;
                }

                console.log("✅ JSON Loaded");
                console.log(previewQuestions);

                alert(`✅ ${data.length} Questions Loaded Successfully`);

            }

            catch (err) {

                alert("❌ Invalid JSON File");

            }

        };

        reader.readAsText(file);

    });

          }

// =========================
// PART 3A-2
// JSON VALIDATION
// =========================

function validateQuestion(question) {

    if (!question.question) return false;

    if (!question.options) return false;

    if (!Array.isArray(question.options)) return false;

    if (question.options.length !== 4) return false;

    if (question.answer === undefined || question.answer === null) return false;

    return true;

}

function checkQuestions() {

    if (previewQuestions.length === 0) {

        alert("⚠️ Load JSON File First");
        return;

    }

    let valid = 0;
    let invalid = 0;

    previewQuestions.forEach(q => {

        if (validateQuestion(q)) {
            valid++;
        } else {
            invalid++;
        }

    });

    alert(
`Validation Report

✅ Valid Questions : ${valid}

❌ Invalid Questions : ${invalid}`
    );

}

const validateBtn = document.getElementById("validateBtn");

if (validateBtn) {

    validateBtn.addEventListener("click", checkQuestions);

}

console.log("✅ JSON Validation Ready");

// =========================
// PART 3A-3
// SHOW PREVIEW
// =========================

function showPreview() {

    const previewList =
        document.getElementById("previewList");

    if (!previewList) return;

    previewList.innerHTML = "";

    if (previewQuestions.length === 0) {

        previewList.innerHTML = `
            <p>No Questions Loaded</p>
        `;

        return;
    }

    previewQuestions.forEach((q, index) => {

        const card = document.createElement("div");

        card.className = "preview-item";

        card.innerHTML = `

<h4>${index + 1}. ${q.question}</h4>

<p>
A) ${q.options?.[0] || ""}
</p>

<p>
B) ${q.options?.[1] || ""}
</p>

<p>
C) ${q.options?.[2] || ""}
</p>

<p>
D) ${q.options?.[3] || ""}
</p>

<p>
<b>Answer :</b> ${q.answer}
</p>

<hr>

`;

        previewList.appendChild(card);

    });

}


// =========================
// PREVIEW BUTTON
// =========================

const previewBtn =
document.getElementById("previewBtn");

if (previewBtn) {

    previewBtn.addEventListener("click", () => {

        if (previewQuestions.length === 0) {

            alert("Please Load JSON File First");

            return;

        }

        showPreview();

    });

}

console.log("✅ Preview System Ready");

// =========================
// PART 3A-4
// DUPLICATE CHECK + UPLOAD
// =========================

async function isDuplicate(question) {

    try {

        const q = query(
            collection(db, "questions"),
            where("question", "==", question)
        );

        const snap = await getDocs(q);

        return !snap.empty;

    }

    catch (error) {

        console.error(error);

        return false;

    }

}



const bulkUploadBtn =
document.getElementById("bulkUploadBtn");

if (bulkUploadBtn) {

bulkUploadBtn.addEventListener("click", async () => {

    const subject =
    document.getElementById("bulkSubject").value;

    const topic =
    document.getElementById("bulkTopic").value;

    if (!subject || !topic) {

        alert("Select Subject & Topic");

        return;

    }

    if (previewQuestions.length === 0) {

        alert("Load JSON File First");

        return;

    }

    let added = 0;
    let duplicate = 0;
    let failed = 0;

    for (const q of previewQuestions) {

        try {

            if (!validateQuestion(q)) {

                failed++;
                continue;

            }

            const exists =
            await isDuplicate(q.question);

            if (exists) {

                duplicate++;
                continue;

            }

            await addDoc(
                collection(db, "questions"),
                {

                    questionId:
                    "GTG-" + Date.now(),

                    subject,

                    topic,

                    question:
                    q.question,

                    options:
                    q.options,

                    answer:
                    Number(q.answer),

                    explanation:
                    q.explanation || "",

                    createdAt:
                    serverTimestamp()

                }
            );

            added++;

        }

        catch (err) {

            console.error(err);

            failed++;

        }

              }

             // =========================
    // UPLOAD REPORT
    // =========================

    const total = previewQuestions.length;

    if (document.getElementById("bulkTotal")) {
        document.getElementById("bulkTotal").textContent = total;
    }

    if (document.getElementById("addedCount")) {
        document.getElementById("addedCount").textContent = added;
    }

    if (document.getElementById("skippedCount")) {
        document.getElementById("skippedCount").textContent = duplicate;
    }

    if (document.getElementById("failedCount")) {
        document.getElementById("failedCount").textContent = failed;
    }
await saveUploadHistory({

    subject: subject,

    topic: topic,

    total: total,

    added: added,

    duplicate: duplicate,

    failed: failed

});
    alert(
`✅ Upload Completed

Total      : ${total}
Added      : ${added}
Duplicate  : ${duplicate}
Failed     : ${failed}`
    );

    // =========================
    // CLEAR AFTER UPLOAD
    // =========================

    previewQuestions = [];

    const jsonFile =
        document.getElementById("jsonFile");

    if (jsonFile) {
        jsonFile.value = "";
    }

    const bulkText =
        document.getElementById("bulkText");

    if (bulkText) {
        bulkText.value = "";
    }

    const previewList =
        document.getElementById("previewList");

    if (previewList) {
        previewList.innerHTML = "";
    }

    const questionCount =
        document.getElementById("questionCount");

    if (questionCount) {
        questionCount.textContent = "0";
    }

    // Refresh Question List & Stats
    await loadQuestions();
    await loadAdminStats();

    console.log("✅ Upload Finished");

}); // bulkUploadBtn click end

} // bulkUploadBtn if end

// =========================
// PART 3A-6
// SAVE UPLOAD HISTORY
// =========================

async function saveUploadHistory(data) {

    try {

        await addDoc(

            collection(db, "uploadHistory"),

            {

                uploadId:
                    "GTG-UP-" + Date.now(),

                subject:
                    data.subject,

                topic:
                    data.topic,

                total:
                    data.total,

                added:
                    data.added,

                duplicate:
                    data.duplicate,

                failed:
                    data.failed,

                uploadedAt:
                    serverTimestamp()

            }

        );

        console.log("✅ Upload History Saved");

    }

    catch (error) {

        console.error(
            "Upload History Error",
            error
        );

    }

}

// =========================
// PART 4A-1
// LOAD UPLOAD HISTORY
// =========================

async function loadUploadHistory() {

    const historyBox =
        document.getElementById("uploadHistory");

    if (!historyBox) return;

    historyBox.innerHTML = `
        <p>Loading Upload History...</p>
    `;

    try {

        const snap = await getDocs(
            collection(db, "uploadHistory")
        );

        historyBox.innerHTML = "";

        if (snap.empty) {

            historyBox.innerHTML = `
                <p>No Upload History Found</p>
            `;

            return;

        }

        snap.forEach(doc => {

            const data = doc.data();

            const card =
                document.createElement("div");

            card.className = "history-card";

            let uploadedDate = "-";

            try {

                if (data.uploadedAt) {

                    uploadedDate =
                        data.uploadedAt
                        .toDate()
                        .toLocaleString("en-IN");

                }

            } catch (e) {}

            card.innerHTML = `

<h3>📂 ${data.uploadId}</h3>

<p><b>Subject :</b> ${data.subject}</p>

<p><b>Topic :</b> ${data.topic}</p>

<p><b>Total :</b> ${data.total}</p>

<p>✅ Added : ${data.added}</p>

<p>⚠️ Duplicate : ${data.duplicate}</p>

<p>❌ Failed : ${data.failed}</p>

<p>🕒 ${uploadedDate}</p>

<hr>

`;

            historyBox.appendChild(card);

        });

        console.log("✅ Upload History Loaded");

    }

    catch (error) {

        console.error(
            "History Load Error",
            error
        );

        historyBox.innerHTML = `
            <p>Failed to Load Upload History</p>
        `;

    }

}

// =========================
// PART 4A-2
// EXPORT QUESTIONS JSON
// =========================

async function exportQuestions() {

    try {

        const snapshot = await getDocs(
            collection(db, "questions")
        );

        let questions = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            questions.push({

                question: data.question,

                options: data.options,

                answer: data.answer,

                explanation: data.explanation || "",

                subject: data.subject,

                topic: data.topic

            });

        });

        const jsonData =
            JSON.stringify(
                questions,
                null,
                2
            );

        const blob = new Blob(
            [jsonData],
            {
                type: "application/json"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "G_THE_GENIUS_Questions.json";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        alert("✅ Questions Exported Successfully");

    }

    catch (error) {

        console.error(
            "Export Error:",
            error
        );

        alert("❌ Export Failed");

    }

}



// =========================
// EXPORT BUTTON
// =========================

const exportBtn =
document.getElementById("exportBtn");

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        exportQuestions
    );

}

console.log("✅ Export System Ready");
// =========================
// PART 5A-1
// ADMIN DASHBOARD STATS
// =========================


async function loadAdminStats(){

    try {


        const snapshot = await getDocs(
            collection(db,"questions")
        );


        let total = 0;


        let stats = {

            "Indian Polity":0,
            "Indian History":0,
            "General Science":0,
            "Tamil Nadu GK":0,
            "Current Affairs":0,
            "Geography":0,
            "Economics":0,
            "Computer Science":0,
            "Aptitude":0,
            "Reasoning":0,
            "Tamil":0,
            "English":0

        };



        snapshot.forEach((doc)=>{


            const data = doc.data();


            total++;


            if(stats[data.subject] !== undefined){

                stats[data.subject]++;

            }


        });



        // TOTAL QUESTIONS

        const totalBox =
        document.getElementById(
            "totalQuestions"
        );


        if(totalBox){

            totalBox.innerHTML = total;

        }




        // SUBJECT COUNTS


        const countMap = {


            polityCount:
            "Indian Polity",


            historyCount:
            "Indian History",


            scienceCount:
            "General Science",


            tnCount:
            "Tamil Nadu GK"


        };



        Object.keys(countMap)
        .forEach(id=>{


            const box =
            document.getElementById(id);



            if(box){

                box.innerHTML =
                stats[countMap[id]] || 0;

            }


        });



        console.log(
            "✅ Dashboard Stats Updated"
        );


    }


    catch(error){


        console.error(
            "Stats Error:",
            error
        );


    }


}

// =========================
// PART 5A-2
// ADMIN SECURITY SYSTEM
// =========================


import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// =========================
// ADMIN EMAIL LIST
// =========================


const adminEmails = [

    "gthegenius7@gmail.com"

];





// =========================
// CHECK ADMIN LOGIN
// =========================


onAuthStateChanged(
auth,
(user)=>{


    if(!user){


        alert(
            "⚠️ Admin Login Required"
        );


        window.location.href =
        "login.html";


        return;


    }





    if(
        !adminEmails.includes(
            user.email
        )
    ){


        alert(
            "❌ Access Denied"
        );


        window.location.href =
        "dashboard.html";


        return;


    }





    const adminName =
    document.getElementById(
        "adminName"
    );


    if(adminName){

        adminName.innerHTML =
        user.email;

    }





    const status =
    document.getElementById(
        "adminStatus"
    );


    if(status){

        status.innerHTML =
        "🟢 Online";

    }





    console.log(
        "✅ Admin Verified"
    );


});






// =========================
// LOGOUT
// =========================


const logoutBtn =
document.getElementById(
    "adminLogoutBtn"
);



if(logoutBtn){


    logoutBtn.addEventListener(
        "click",
        async()=>{


            try{


                await signOut(auth);


                window.location.href =
                "login.html";


            }


            catch(error){


                console.error(
                    "Logout Error",
                    error
                );


            }


        }
    );


}


console.log(
"✅ Admin Security Ready"
);

// =========================
// PART 5A-3
// FINAL INITIALIZATION
// =========================



window.addEventListener(
"load",
async()=>{


    try{


        // Load Questions

        await loadQuestions();



        // Load Dashboard Stats

        await loadAdminStats();



        // Load Upload History

        await loadUploadHistory();



        console.log(
            "🚀 G THE GENIUS ADMIN PANEL READY"
        );


    }


    catch(error){


        console.error(
            "Admin Start Error:",
            error
        );


    }



});






// =========================
// GLOBAL ERROR HANDLER
// =========================


window.addEventListener(
"error",
(event)=>{


    console.error(
        "Admin JS Error:",
        event.message
    );


});





console.log(
"✅ Final Admin Controller Loaded"
);


/* =========================
G THE GENIUS ADMIN PANEL
ADMIN.CSS
PART 6A-1
BASE + HEADER
========================= */


*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Poppins',sans-serif;
}


body{

    background:
    linear-gradient(
        135deg,
        #081229,
        #162b55
    );

    color:white;

    min-height:100vh;

    padding:20px;

}



/* =========================
ADMIN HEADER
========================= */


.admin-header{

    display:flex;

    align-items:center;

    gap:20px;

    padding:20px;

    background:
    rgba(255,255,255,0.08);

    backdrop-filter:
    blur(15px);

    border-radius:20px;

    border:
    1px solid
    rgba(255,255,255,0.15);

    box-shadow:
    0 10px 30px rgba(0,0,0,0.3);

}



.admin-logo{

    width:90px;

    height:90px;

    border-radius:50%;

    object-fit:cover;

    border:
    3px solid #ffd700;

}



.admin-header h2{

    color:#ffd700;

    font-size:28px;

}



.admin-header p{

    color:#ddd;

    margin-top:5px;

}



#adminName{

    color:white;

    margin-top:8px;

}



#adminStatus{

    display:inline-block;

    margin-top:8px;

    color:#00ff88;

    font-weight:bold;

}





/* =========================
LOGOUT BUTTON
========================= */


#adminLogoutBtn{

    margin-left:auto;

    padding:12px 22px;

    border:none;

    border-radius:12px;

    background:
    #ff4757;

    color:white;

    cursor:pointer;

    font-size:15px;

    font-weight:bold;

}



#adminLogoutBtn:hover{

    transform:scale(1.05);

}

/* =========================
PART 6A-2
ADMIN STATS CARDS
========================= */


.admin-stats{

    display:grid;

    grid-template-columns:
    repeat(auto-fit,minmax(180px,1fr));

    gap:20px;

    margin-top:25px;

}




.stat-card{

    background:
    rgba(255,255,255,0.10);

    backdrop-filter:
    blur(15px);

    padding:25px;

    border-radius:18px;

    text-align:center;

    border:
    1px solid
    rgba(255,255,255,0.15);

    box-shadow:
    0 8px 25px
    rgba(0,0,0,0.25);

    transition:
    0.3s;

}



.stat-card:hover{

    transform:
    translateY(-8px);

}



.stat-card h2{

    color:#ffd700;

    font-size:35px;

    margin-bottom:10px;

}



.stat-card p{

    color:#ffffff;

    font-size:16px;

}





/* =========================
SECTION COMMON DESIGN
========================= */


.bulk-card,
.manage-card,
.history-card,
.export-card{

    margin-top:30px;

    padding:25px;

    background:

    rgba(255,255,255,0.08);

    backdrop-filter:
    blur(15px);

    border-radius:20px;

    border:
    1px solid
    rgba(255,255,255,0.15);

    box-shadow:
    0 10px 30px
    rgba(0,0,0,0.25);

}



.bulk-card h2,
.manage-card h2,
.history-card h2,
.export-card h2{

    color:#ffd700;

    margin-bottom:20px;

}

// ===============================
// G THE GENIUS ADMIN JS
// PART 6A - 3
// QUESTION SEARCH + FILTER SYSTEM
// ===============================



// ===============================
// DISPLAY QUESTIONS
// ===============================


function displayQuestions(data){


const list = document.getElementById(
"questionList"
);



if(!list) return;



list.innerHTML = "";



if(data.length === 0){


list.innerHTML = 
`
<p>
No Questions Found
</p>
`;

return;


}



data.forEach(q=>{



let div = document.createElement(
"div"
);



div.className =
"question-item";



div.innerHTML =

`

<h3>
${q.question}
</h3>


<p>
📚 Subject :
${q.subject || "-"}
</p>


<p>
📌 Topic :
${q.topic || "-"}
</p>


<p>

A) ${q.options?.[0] || ""}

<br>

B) ${q.options?.[1] || ""}

<br>

C) ${q.options?.[2] || ""}

<br>

D) ${q.options?.[3] || ""}

</p>


<p>
✅ Answer :
${q.answer}
</p>


<p>
💡 Explanation :
${q.explanation || "-"}
</p>


<button 
class="delete-btn"
onclick="deleteQuestion('${q.id}')">

🗑 Delete

</button>


`;



list.appendChild(div);



});


}









// ===============================
// SEARCH QUESTION
// ===============================


const searchBtn = document.getElementById(
"searchBtn"
);



if(searchBtn){



searchBtn.onclick = ()=>{



let text = document.getElementById(
"searchQuestion"
).value
.toLowerCase()
.trim();




let result = allQuestions.filter(q=>



q.question
.toLowerCase()
.includes(text)



);



displayQuestions(result);



};


}









// ===============================
// SUBJECT FILTER
// ===============================


const filterSubject = document.getElementById(
"filterSubject"
);


const filterTopic = document.getElementById(
"filterTopic"
);



if(filterSubject){



filterSubject.onchange = ()=>{



let subject =
filterSubject.value;



let topicsList=[];



allQuestions.forEach(q=>{



if(

subject==="all"

||

q.subject===subject

){



if(
q.topic &&
!topicsList.includes(q.topic)
){


topicsList.push(q.topic);


}



}



});






filterTopic.innerHTML =

`

<option value="all">
All Topics
</option>

`;






topicsList.forEach(t=>{



filterTopic.innerHTML +=

`

<option value="${t}">
${t}
</option>

`;



});



};



}









// ===============================
// APPLY FILTER
// ===============================


const filterBtn = document.getElementById(
"filterBtn"
);



if(filterBtn){



filterBtn.onclick = ()=>{



let subject =
filterSubject.value;



let topic =
filterTopic.value;





let result = allQuestions.filter(q=>{



let subjectMatch =

subject==="all"

||

q.subject===subject;





let topicMatch =

topic==="all"

||

q.topic===topic;






return subjectMatch && topicMatch;



});






displayQuestions(result);



};


// ===============================
// G THE GENIUS ADMIN JS
// PART 6A - 4
// DELETE + EDIT QUESTION SYSTEM
// ===============================



// ===============================
// DELETE QUESTION
// ===============================


window.deleteQuestion = async function(id){



let confirmDelete = confirm(
"இந்த Question Delete செய்யலாமா?"
);



if(!confirmDelete)

return;



try{


await deleteDoc(

doc(
db,
"questions",
id

)

);



alert(
"✅ Question Deleted"
);



loadQuestions();



loadAdminStats();



}

catch(error){


console.log(
"Delete Error",
error
);



alert(
"❌ Delete Failed"
);



}



};









// ===============================
// EDIT QUESTION
// ===============================


window.editQuestion = function(id){



let q = allQuestions.find(

item => item.id === id

);



if(!q)

return;





document.getElementById(
"editQuestion"
).value = q.question;



document.getElementById(
"editOption1"
).value = q.options[0];



document.getElementById(
"editOption2"
).value = q.options[1];



document.getElementById(
"editOption3"
).value = q.options[2];



document.getElementById(
"editOption4"
).value = q.options[3];



document.getElementById(
"editAnswer"
).value = q.answer;



document.getElementById(
"editId"
).value = id;





document.getElementById(
"editBox"
).style.display =
"block";



};









// ===============================
// UPDATE QUESTION
// ===============================


const updateBtn = document.getElementById(
"updateQuestionBtn"
);



if(updateBtn){



updateBtn.onclick = async()=>{



let id = document.getElementById(
"editId"
).value;



try{



await updateDoc(

doc(
db,
"questions",
id
),

{


question:

document.getElementById(
"editQuestion"
).value,



options:[


document.getElementById(
"editOption1"
).value,


document.getElementById(
"editOption2"
).value,


document.getElementById(
"editOption3"
).value,


document.getElementById(
"editOption4"
).value


],



answer:

Number(

document.getElementById(
"editAnswer"
).value

),



updatedAt:

serverTimestamp()



}

);



alert(
"✅ Question Updated"
);



document.getElementById(
"editBox"
).style.display =
"none";



loadQuestions();



}



catch(error){



console.log(
"Update Error",
error
);



alert(
"❌ Update Failed"
);



}



};



}







console.log(
"✅ Part 6A-4 Edit Delete Ready"
);

  // ===============================
// G THE GENIUS ADMIN JS
// PART 6A - 5
// UPLOAD HISTORY + EXPORT JSON
// ===============================



// ===============================
// SAVE UPLOAD HISTORY
// ===============================


async function saveUploadHistory(data){


try{


await addDoc(

collection(
db,
"uploadHistory"
),

{


uploadId:

data.uploadId,


subject:

data.subject,


topic:

data.topic,


total:

data.total,


added:

data.added,


duplicate:

data.duplicate || 0,


failed:

data.failed,


uploadedAt:

serverTimestamp()



}

);



console.log(
"✅ Upload History Saved"
);



}

catch(error){


console.log(
"History Save Error",
error
);


}



}









// ===============================
// LOAD UPLOAD HISTORY
// ===============================


async function loadUploadHistory(){



const box = document.getElementById(
"uploadHistory"
);



if(!box)

return;




box.innerHTML =
"Loading...";





try{


const snap = await getDocs(

collection(
db,
"uploadHistory"
)

);



box.innerHTML="";





if(snap.empty){


box.innerHTML =
"No Upload History";


return;


}





snap.forEach(item=>{



let data = item.data();




let div = document.createElement(
"div"
);



div.className =
"history-item";



div.innerHTML =

`

<h3>
📂 ${data.uploadId}
</h3>


<p>
📚 Subject :
${data.subject}
</p>


<p>
📌 Topic :
${data.topic}
</p>


<p>
Total :
${data.total}
</p>


<p>
✅ Added :
${data.added}
</p>


<p>
⚠️ Duplicate :
${data.duplicate}
</p>


<p>
❌ Failed :
${data.failed}
</p>


`;



box.appendChild(div);



});



}

catch(error){


console.log(
"History Error",
error
);


}



}









// ===============================
// EXPORT QUESTION JSON
// ===============================


async function exportQuestions(){



try{


const snap = await getDocs(

collection(
db,
"questions"
)

);




let questions=[];



snap.forEach(item=>{


questions.push(

item.data()

);


});







let blob = new Blob(

[

JSON.stringify(
questions,
null,
2
)

],

{

type:
"application/json"

}

);






let url = URL.createObjectURL(
blob
);





let a = document.createElement(
"a"
);



a.href=url;



a.download =
"G_THE_GENIUS_questions.json";



a.click();





URL.revokeObjectURL(
url
);



alert(
"✅ JSON Backup Downloaded"
);



}



catch(error){


console.log(
"Export Error",
error
);



alert(
"❌ Export Failed"
);



}



}









// ===============================
// EXPORT BUTTON
// ===============================


const exportBtn = document.getElementById(
"exportBtn"
);



if(exportBtn){



exportBtn.onclick = ()=>{


exportQuestions();


};


}









// ===============================
// LOAD HISTORY START
// ===============================


window.addEventListener(
"load",
()=>{


loadUploadHistory();



}
);






console.log(
"✅ Part 6A-5 Upload History Ready"
);

  // ===============================
// G THE GENIUS ADMIN JS
// PART 6A - 6
// ADMIN SECURITY + LOGOUT
// ===============================



// ===============================
// ADMIN EMAIL LIST
// ===============================


const adminEmails = [


"gthegenius7@gmail.com"


];









// ===============================
// CHECK ADMIN LOGIN
// ===============================


onAuthStateChanged(

auth,

(user)=>{



if(!user){


alert(
"⚠️ Admin Login Required"
);



window.location.href =
"login.html";



return;


}








if(
!adminEmails.includes(
user.email
)

){



alert(
"❌ Access Denied"
);



window.location.href =
"dashboard.html";



return;


}









// ADMIN NAME


const adminName = document.getElementById(
"adminName"
);



if(adminName){


adminName.innerHTML =
user.email;


}








// STATUS


const adminStatus = document.getElementById(
"adminStatus"
);



if(adminStatus){


adminStatus.innerHTML =
"🟢 Online";


}





console.log(
"✅ Admin Verified"
);



}

);









// ===============================
// ADMIN LOGOUT
// ===============================


const logoutBtn = document.getElementById(
"adminLogoutBtn"
);



if(logoutBtn){



logoutBtn.onclick = async()=>{



try{


await signOut(auth);



alert(
"✅ Logout Successful"
);



window.location.href =
"login.html";



}


catch(error){


console.log(
"Logout Error",
error
);



}



};


}









console.log(
"✅ Part 6A-6 Admin Security Ready"
);


}







console.log(
"✅ Part 6A-3 Question Filter Ready"
);

 // ===============================
// G THE GENIUS ADMIN JS
// PART 6A - 7
// FINAL ERROR CHECK SYSTEM
// ===============================



// ===============================
// SAFE ELEMENT FUNCTION
// ===============================


function getElement(id){


const el = document.getElementById(id);



if(!el){


console.log(
"⚠️ Missing Element :",
id
);



return null;


}



return el;


}









// ===============================
// FIREBASE CONNECTION CHECK
// ===============================


async function checkFirebase(){


try{


const snap = await getDocs(

collection(
db,
"questions"
)

);



console.log(

"🔥 Firebase Connected"

);



console.log(

"Total Questions :",

snap.size

);



}


catch(error){



console.log(

"❌ Firebase Connection Error",

error

);



}



}









// ===============================
// GLOBAL ERROR HANDLER
// ===============================


window.onerror = function(

message,

source,

line

){



console.log(

"Admin JS Error:",

message,

"Line:",

line

);



};









// ===============================
// AUTO START CHECK
// ===============================


window.addEventListener(

"load",

()=>{



checkFirebase();



console.log(

"🚀 G THE GENIUS ADMIN PANEL READY"

);



}

);









// ===============================
// FINAL MESSAGE
// ===============================


console.log(

"✅ Part 6A-7 Error Check Completed"

);

  
