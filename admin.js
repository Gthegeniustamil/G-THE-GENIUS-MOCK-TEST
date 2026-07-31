// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// ADMIN JS
// PART 1 / 5
// AUTH + INITIAL SETUP
// ==========================================


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
getDocs,
addDoc,
doc,
deleteDoc,
updateDoc,
getDoc,
query,
orderBy,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ==========================================
// HTML ELEMENTS
// ==========================================


const adminName =
document.getElementById("adminName");


const adminEmail =
document.getElementById("adminEmail");


const totalStudents =
document.getElementById("totalStudents");


const totalQuestions =
document.getElementById("totalQuestions");


const totalTests =
document.getElementById("totalTests");


const totalResults =
document.getElementById("totalResults");


const logoutBtn =
document.getElementById("logoutBtn");



const questionList =
document.getElementById("questionList");


const searchQuestion =
document.getElementById("searchQuestion");


const subjectFilter =
document.getElementById("subjectFilter");




// ==========================================
// GLOBAL VARIABLES
// ==========================================


let adminUser = null;

let questionsData = [];
// ==========================================
// ADMIN JS
// PART 2 / 5
// AUTH CHECK + DASHBOARD STATS
// ==========================================





// ===============================
// ADMIN AUTH CHECK
// ===============================


onAuthStateChanged(auth, async(user)=>{


    if(!user){


        window.location.href = "login.html";

        return;


    }


    adminUser = user;



    adminName.textContent =

    user.displayName || "Admin";



    adminEmail.textContent =

    user.email || "-";



    await loadDashboardStats();


    await loadQuestions();


});






// ===============================
// LOAD DASHBOARD STATISTICS
// ===============================


async function loadDashboardStats(){


try{


// STUDENTS COUNT

const studentsSnap = await getDocs(

collection(db,"students")

);


totalStudents.textContent =

studentsSnap.size;





// QUESTIONS COUNT

const questionsSnap = await getDocs(

collection(db,"questions")

);


totalQuestions.textContent =

questionsSnap.size;





// RESULTS COUNT

const resultsSnap = await getDocs(

collection(db,"results")

);


totalResults.textContent =

resultsSnap.size;





// TEST COUNT

let testCount = 0;


resultsSnap.forEach(()=>{

    testCount++;

});


totalTests.textContent =

testCount;



}
catch(error){


console.error(

"Dashboard Stats Error:",

error

);


}


  }
// ==========================================
// ADMIN JS
// PART 3 / 5
// ADD QUESTION + BULK UPLOAD
// DUPLICATE CHECK
// ==========================================





// ==========================================
// HTML ELEMENTS
// ==========================================


const uploadQuestionsBtn =

document.getElementById("uploadQuestionsBtn");


const bulkQuestionInput =

document.getElementById("bulkQuestionInput");


const uploadStatus =

document.getElementById("uploadStatus");



const saveQuestionBtn =

document.getElementById("saveQuestionBtn");






// ===============================
// DUPLICATE CHECK
// ===============================


async function checkDuplicateQuestion(questionData){


const snapshot = await getDocs(

collection(db,"questions")

);



let duplicate = false;



snapshot.forEach((doc)=>{


const oldQuestion = doc.data();



if(

oldQuestion.question
?.trim()
.toLowerCase()

===

questionData.question
?.trim()
.toLowerCase()

&&

oldQuestion.subject === questionData.subject

){


duplicate = true;


}



});



return duplicate;


}






// ===============================
// ADD SINGLE QUESTION
// ===============================


saveQuestionBtn.addEventListener(

"click",

async()=>{


const questionData = {


question:

document.getElementById("questionText").value,


options:[


document.getElementById("option1").value,


document.getElementById("option2").value,


document.getElementById("option3").value,


document.getElementById("option4").value


],


answer:

document.getElementById("correctAnswer").value,


subject:

document.getElementById("questionSubject").value,


topic:

document.getElementById("questionTopic").value,


createdAt:

serverTimestamp()


};




const exists = await checkDuplicateQuestion(

questionData

);



if(exists){


alert(

"Duplicate Question Found!"

);


return;


}





await addDoc(

collection(db,"questions"),

questionData

);



alert(

"Question Added Successfully"

);


await loadDashboardStats();


await loadQuestions();



});

// ==========================================
// ADMIN JS
// PART 4 / 5
// BULK UPLOAD + QUESTION MANAGEMENT
// ==========================================





// ===============================
// BULK QUESTION UPLOAD
// ===============================


uploadQuestionsBtn.addEventListener(

"click",

async()=>{


try{


const jsonText =

bulkQuestionInput.value.trim();



if(!jsonText){


alert(

"Paste Questions JSON"

);


return;


}



const questions =

JSON.parse(jsonText);



let added = 0;

let duplicate = 0;

let error = 0;




for(const questionData of questions){



try{



const exists = await checkDuplicateQuestion(

questionData

);



if(exists){


duplicate++;


continue;


}



await addDoc(

collection(db,"questions"),

{

...questionData,

createdAt:serverTimestamp()

}

);



added++;



}

catch(e){


error++;


}



}





uploadStatus.innerHTML = `

✅ Added : ${added}<br>

♻️ Duplicate : ${duplicate}<br>

❌ Error : ${error}

`;



bulkQuestionInput.value = "";



await loadDashboardStats();

await loadQuestions();



}

catch(error){


uploadStatus.textContent =

"Invalid JSON Format";


console.error(error);



}



});







// ===============================
// LOAD QUESTIONS
// ===============================


async function loadQuestions(){



try{


const snapshot = await getDocs(

query(

collection(db,"questions"),

orderBy("createdAt","desc")

)

);



questionsData = [];



snapshot.forEach((doc)=>{


questionsData.push({


id:doc.id,

...doc.data()


});



});



displayQuestions(questionsData);



}

catch(error){


console.error(

"Question Load Error",

error

);


}



  }

// ==========================================
// ADMIN JS
// PART 5 / 5
// SEARCH + EDIT + DELETE + LOGOUT
// ==========================================





// ===============================
// DISPLAY QUESTIONS
// ===============================


function displayQuestions(data){


questionList.innerHTML = "";



if(data.length === 0){


questionList.innerHTML = `

<p style="text-align:center">

No Questions Found

</p>

`;

return;


}



data.forEach(item=>{



questionList.innerHTML += `


<div class="question-item">


<h3>

${item.question}

</h3>


<p>

Subject: ${item.subject || "-"}

</p>


<p>

Topic: ${item.topic || "-"}

</p>



<div class="question-actions">


<button

class="edit-btn"

onclick="editQuestion('${item.id}')">

✏️ Edit

</button>



<button

class="delete-btn"

onclick="deleteQuestion('${item.id}')">

🗑 Delete

</button>



</div>


</div>


`;



});


}







// ===============================
// SEARCH QUESTION
// ===============================


searchQuestion.addEventListener(

"input",

()=>{


const keyword =

searchQuestion.value
.toLowerCase();



const filtered = questionsData.filter(item=>


item.question

.toLowerCase()

.includes(keyword)



);



displayQuestions(filtered);



});







// ===============================
// SUBJECT FILTER
// ===============================


subjectFilter.addEventListener(

"change",

()=>{


const subject =

subjectFilter.value;



if(subject==="all"){


displayQuestions(questionsData);


return;


}



const filtered =

questionsData.filter(item=>

item.subject === subject

);



displayQuestions(filtered);



});








// ===============================
// DELETE QUESTION
// ===============================


window.deleteQuestion = async(id)=>{


const confirmDelete = confirm(

"Delete this question?"

);



if(!confirmDelete)

return;



await deleteDoc(

doc(db,"questions",id)

);



alert(

"Question Deleted"

);



await loadDashboardStats();

await loadQuestions();



};








// ===============================
// EDIT QUESTION
// ===============================


window.editQuestion = async(id)=>{


const questionRef =

doc(db,"questions",id);



const snapshot = await getDoc(

questionRef

);



const data = snapshot.data();



const newQuestion = prompt(

"Edit Question",

data.question

);



if(!newQuestion)

return;



await updateDoc(

questionRef,

{

question:newQuestion

}

);



alert(

"Question Updated"

);



await loadQuestions();



};








// ===============================
// LOGOUT
// ===============================


logoutBtn.addEventListener(

"click",

async()=>{


await signOut(auth);


localStorage.clear();


sessionStorage.clear();



window.location.href =

"login.html";



});








console.log(

"G THE GENIUS Admin JS Loaded Successfully"

);
