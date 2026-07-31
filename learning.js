
// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// LEARNING JS
// PART 1 / 5
// ==========================================


import "./subjects-data.js";



// Elements


const subjectSection = 
document.getElementById("subjectSection");


const topicSection = 
document.getElementById("topicSection");


const studySection = 
document.getElementById("studySection");


const subjectList =
document.getElementById("subjectList");


const topicList =
document.getElementById("topicList");


const selectedTopic =
document.getElementById("selectedTopic");




// Current Data

let currentCategory = "";

let currentSubject = "";





// ==========================================
// OPEN CATEGORY
// ==========================================


window.openCategory = function(category){


currentCategory = category;



subjectSection.classList.add("hidden");

topicSection.classList.add("hidden");

studySection.classList.add("hidden");



subjectList.innerHTML="";

topicList.innerHTML="";





let data = learningData[category];



if(!data) return;





// Tamil / Physical / Psychology

if(data.topics){


showTopics(data.topics);


}






// General Subjects

else if(data.subjects){


showSubjects(data.subjects);


}



}


// ==========================================
// SHOW GENERAL SUBJECTS
// PART 2 / 5
// ==========================================



function showSubjects(subjects){


subjectSection.classList.remove("hidden");



Object.keys(subjects).forEach(key=>{



let subject = subjects[key];



let card = document.createElement("div");


card.className="subject-card";



card.innerHTML = `

<h3>

${subject.title}

</h3>


<p>

Topic Wise Preparation

</p>

`;





card.onclick = ()=>{


currentSubject = key;


showTopics(subject.topics);


};



subjectList.appendChild(card);



});


}







// ==========================================
// SHOW TOPICS
// ==========================================



function showTopics(topics){



topicSection.classList.remove("hidden");



subjectSection.classList.add("hidden");



topicList.innerHTML="";





topics.forEach(topic=>{



let card = document.createElement("div");



card.className="topic-card";




card.innerHTML = `

<h3>

📖 ${topic}

</h3>


`;





card.onclick = ()=>{


openStudy(topic);


};




topicList.appendChild(card);



});



}


// ==========================================
// STUDY AREA
// PART 3 / 5
// ==========================================



function openStudy(topic){


studySection.classList.remove("hidden");


topicSection.classList.add("hidden");



selectedTopic.innerText = topic;



// Save Selected Topic

localStorage.setItem(
"selectedTopic",
topic
);



localStorage.setItem(
"selectedCategory",
currentCategory
);




}





// ==========================================
// NOTES BUTTON
// ==========================================


const notesBtn = 
document.getElementById("notesBtn");



if(notesBtn){


notesBtn.onclick = ()=>{


let topic = localStorage.getItem(
"selectedTopic"
);



alert(

"📖 Notes Coming Soon\n\nTopic: "
+ topic

);


};


}







// ==========================================
// PRACTICE TEST BUTTON
// ==========================================


const practiceBtn = 
document.getElementById("practiceBtn");



if(practiceBtn){


practiceBtn.onclick = ()=>{


let topic = localStorage.getItem(
"selectedTopic"
);



let category = localStorage.getItem(
"selectedCategory"
);





window.location.href =

"mocktest.html?category="

+category

+"&topic="

+encodeURIComponent(topic);



};


}


// ==========================================
// PAGE NAVIGATION + DATA RESTORE
// PART 4 / 5
// ==========================================



// ==========================================
// LOAD LAST SELECTED TOPIC
// ==========================================


window.addEventListener(
"load",
()=>{


let savedTopic = 
localStorage.getItem("selectedTopic");



if(savedTopic){


selectedTopic.innerText = savedTopic;


}



});







// ==========================================
// CLEAR STUDY DATA
// ==========================================


function clearLearningData(){


localStorage.removeItem(
"selectedTopic"
);


localStorage.removeItem(
"selectedCategory"
);


}





// ==========================================
// CATEGORY RESET
// ==========================================


window.backToCategories = function(){


subjectSection.classList.add("hidden");


topicSection.classList.add("hidden");


studySection.classList.add("hidden");



clearLearningData();


};







// ==========================================
// PRACTICE REDIRECT LOG
// ==========================================


console.log(
"G THE GENIUS Learning Module Ready"
);

// ==========================================
// FINAL CHECK + ERROR HANDLING
// PART 5 / 5 FINAL
// ==========================================



// ==========================================
// CHECK DATA LOADED
// ==========================================


if(typeof learningData === "undefined"){


console.error(
"Learning Data Not Loaded"
);


alert(
"Subject data loading error"
);


}

else{


console.log(
"✅ Learning Data Connected"
);


}






// ==========================================
// SAFE CLICK HANDLER
// ==========================================


function safeOpen(url){


try{


window.location.href = url;


}

catch(error){


console.error(error);


}


}




// ==========================================
// MODULE READY
// ==========================================


console.log(
`
================================
G THE GENIUS LEARNING SYSTEM
READY ✅

Category
Subject
Topic
Practice Test

================================
`
);

