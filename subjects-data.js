
// ==========================================
// G THE GENIUS
// SUBJECTS & TOPICS MASTER DATA
// PART 1 / 5
// ==========================================


const learningData = {


/*
================================
📖 தமிழ்
================================
*/


tamil: {

title:"📖 தமிழ்",

topics:[

"தமிழ் இலக்கணம்",

"எழுத்து இலக்கணம்",

"சொல் இலக்கணம்",

"பொருள் இலக்கணம்",

"யாப்பிலக்கணம்",

"அணி இலக்கணம்",

"திருக்குறள்",

"சங்க இலக்கியம்",

"எட்டுத்தொகை",

"பத்துப்பாட்டு"

]

},



/*
================================
🏃 Physical Tips
================================
*/


physical: {

title:"🏃 Physical Tips",

topics:[

"Running Preparation",

"1500 Meter Running Tips",

"Long Jump Practice",

"Physical Test Rules",

"Daily Workout Plan",

"Warm Up & Stretching",

"Stamina Increase Tips",

"Diet Plan",

"PET Preparation Strategy",

"Exam Day Physical Tips"

]

},



/*
================================
🧠 Psychology
================================
*/


psychology: {

title:"🧠 Psychology",

topics:[

"Self Confidence",

"Exam Fear Control",

"Stress Management",

"Memory Improvement",

"Concentration Tips",

"Positive Thinking",

"Time Management",

"Motivation",

"Interview Psychology",

"Personality Development"

]

}

};


// ==========================================
// 📚 GENERAL SUBJECTS
// PART 2 / 5
// ==========================================


general: {

title:"📚 General Subjects",

subjects:{


/*
========================
🏛️ Indian Polity
========================
*/

indianPolity:{

title:"🏛️ Indian Polity",

topics:[

"Constitution Basics",

"Preamble",

"Fundamental Rights",

"Fundamental Duties",

"Directive Principles",

"President",

"Prime Minister",

"Parliament",

"Supreme Court",

"Important Articles"

]

},



/*
========================
📜 Indian History
========================
*/

indianHistory:{

title:"📜 Indian History",

topics:[

"Ancient India",

"Indus Valley Civilization",

"Maurya Empire",

"Gupta Empire",

"Medieval India",

"British Rule",

"Freedom Movement",

"Indian Independence",

"Important Events"

]

},



/*
========================
🌅 Tamil Nadu History
========================
*/

tamilNaduHistory:{

title:"🌅 Tamil Nadu History",

topics:[

"Sangam Period",

"Chera Chola Pandya",

"Tamil Kings",

"Tamil Culture",

"Social Reformers",

"Tamil Nadu Movements",

"Important Places",

"TN Government Schemes"

]

},



/*
========================
🌍 Geography
========================
*/

geography:{

title:"🌍 Geography",

topics:[

"India Geography",

"World Geography",

"Rivers",

"Mountains",

"Climate",

"Soil",

"Natural Resources",

"Agriculture"

]

},



/*
========================
🔬 General Science
========================
*/

generalScience:{

title:"🔬 General Science",

topics:[

"Physics Basics",

"Chemistry Basics",

"Biology",

"Human Body",

"Diseases",

"Environment",

"Science Technology"

]

}


}

};


// ==========================================
// GENERAL SUBJECTS
// PART 3 / 5
// ==========================================



/*
========================
➗ Mathematics
========================
*/

mathematics:{

title:"➗ Mathematics",

topics:[

"Number System",

"Percentage",

"Ratio & Proportion",

"Profit & Loss",

"Simple Interest",

"Compound Interest",

"Time & Work",

"Speed Distance",

"Mensuration",

"Average"

]

},





/*
========================
🧠 Reasoning
========================
*/

reasoning:{

title:"🧠 Reasoning",

topics:[

"Number Series",

"Alphabet Series",

"Coding Decoding",

"Blood Relation",

"Direction Test",

"Analogy",

"Classification",

"Logical Reasoning",

"Puzzle",

"Venn Diagram"

]

},





/*
========================
💰 Indian Economy
========================
*/

economy:{

title:"💰 Indian Economy",

topics:[

"Basic Economics",

"Indian Economy Basics",

"Budget",

"Banking System",

"RBI",

"Tax System",

"Inflation",

"Government Schemes",

"Economic Planning"

]

},





/*
========================
📰 Current Affairs
========================
*/

currentAffairs:{

title:"📰 Current Affairs",

topics:[

"National News",

"International News",

"Tamil Nadu News",

"Government Schemes",

"Awards",

"Sports Updates",

"Important Appointments",

"Important Days"

]

},





/*
========================
💻 Computer Knowledge
========================
*/

computer:{

title:"💻 Computer Knowledge",

topics:[

"Computer Basics",

"Hardware",

"Software",

"Operating System",

"MS Office",

"Internet",

"Cyber Security",

"Digital India"

]

}


// ==========================================
// GENERAL SUBJECTS
// PART 4 / 5
// ==========================================





/*
========================
🏛️ Indian Administration
========================
*/

indianAdministration:{

title:"🏛️ Indian Administration",

topics:[

"Central Government",

"State Government",

"District Administration",

"Panchayat Raj",

"Local Bodies",

"Government Departments",

"Administrative Structure",

"Civil Services"

]

},





/*
========================
🌱 Environment
========================
*/

environment:{

title:"🌱 Environment",

topics:[

"Ecology",

"Ecosystem",

"Pollution",

"Climate Change",

"Global Warming",

"Wildlife",

"National Parks",

"Environmental Laws",

"Natural Resources"

]

},





/*
========================
🏅 Sports GK
========================
*/

sportsGK:{

title:"🏅 Sports GK",

topics:[

"Olympics",

"Indian Sports Persons",

"Awards",

"Cups & Trophies",

"Sports Rules",

"Important Sports Events",

"World Records",

"Sports Organisations"

]

},





/*
========================
🌐 General Knowledge
========================
*/

generalKnowledge:{

title:"🌐 General Knowledge",

topics:[

"Countries & Capitals",

"World Organisations",

"Important Days",

"Books & Authors",

"Inventions",

"First in India",

"Famous Personalities",

"National Symbols"

]

},





/*
========================
⚖️ Law & Police Knowledge
========================
*/

lawPolice:{

title:"⚖️ Law & Police Knowledge",

topics:[

"Indian Penal Code",

"Criminal Law Basics",

"Police Duties",

"FIR Basics",

"Traffic Rules",

"Human Rights",

"Police Administration",

"Cyber Crime Basics",

"Police Recruitment Rules"

]

}


// ==========================================
// G THE GENIUS
// SUBJECT DATA EXPORT
// PART 5 / 5 FINAL
// ==========================================


// Make data available for other files

window.learningData = learningData;


// ==========================================
// HELPER FUNCTIONS
// ==========================================


// Get Main Categories

function getCategories(){

return Object.keys(learningData);

}



// Get Topics

function getTopics(category){


if(!learningData[category])

return [];


if(learningData[category].topics)

return learningData[category].topics;



return Object.values(
learningData[category].subjects
)
.map(item=>item.title);



}



// Get Subject Topics

function getSubjectTopics(subject){


return subject.topics || [];


}




window.getCategories = getCategories;

window.getTopics = getTopics;

window.getSubjectTopics = getSubjectTopics;


// ==========================================
// FILE LOADED
// ==========================================

console.log(
"G THE GENIUS Subjects Data Loaded"
);
