// =========================
// G THE GENIUS ADMIN JS
// PART 1A-1
// Imports + Topic System
// =========================

import { db, auth } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
