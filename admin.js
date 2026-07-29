// =========================
// G THE GENIUS ADMIN JS
// PART 1
// =========================


import { db } from "./firebase-config.js";


import { db } from "./firebase-config.js";


import {

collection,
addDoc,
serverTimestamp,
getDocs,
deleteDoc,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// CLEAR FORM


document.getElementById(
"topic"
).value="";



document.getElementById(
"question"
).value="";



document.getElementById(
"optionA"
).value="";



document.getElementById(
"optionB"
).value="";



document.getElementById(
"optionC"
).value="";



document.getElementById(
"optionD"
).value="";



document.getElementById(
"explanation"
).value="";






}



catch(error){



console.log(

"Add Question Error",

error

);



alert(

"❌ Error Adding Question"

);



}





};



}







console.log(

"✅ Admin Single Upload Ready"

);


// =========================
// BULK PASTE UPLOAD
// DUPLICATE CHECK SYSTEM
// =========================


const bulkUploadBtn = 
document.getElementById("bulkUploadBtn");



if(bulkUploadBtn){


bulkUploadBtn.onclick = async ()=>{


let subject = 
document.getElementById("bulkSubject").value;



let topic = 
document.getElementById("bulkTopic").value;



let text =
document.getElementById("bulkText").value.trim();





if(!text){

alert("Please paste questions");

return;

}




let total = 0;

let added = 0;

let skipped = 0;

let failed = 0;





try{


// Existing Questions Load

const snap = await getDocs(

collection(db,"questions")

);



let existingQuestions = [];



snap.forEach(doc=>{


let data = doc.data();


existingQuestions.push(

data.question
.trim()
.toLowerCase()

);


});






// Split Questions

let questions = text.split(/\n\s*\n/);




total = questions.length;




for(let item of questions){


try{



let lines = item.split("\n");



let question = "";

let options = [];

let answer = 0;

let explanation = "";





lines.forEach(line=>{


line=line.trim();



if(
line.match(/^\d+\./)
){

question = line.replace(/^\d+\./,"").trim();

}



else if(
line.startsWith("A)")
){

options[0]=line.replace("A)","").trim();

}



else if(
line.startsWith("B)")
){

options[1]=line.replace("B)","").trim();

}



else if(
line.startsWith("C)")
){

options[2]=line.replace("C)","").trim();

}



else if(
line.startsWith("D)")
){

options[3]=line.replace("D)","").trim();

}



else if(
line.startsWith("Answer:")
){

let ans = line.replace("Answer:","").trim();


answer =

ans.charCodeAt(0)-65;


}



else if(
line.startsWith("Explanation:")
){

explanation =
line.replace("Explanation:","").trim();

}



});







if(!question){

failed++;

continue;

}






// Duplicate Check


if(

existingQuestions.includes(

question.toLowerCase()

)

){


skipped++;

continue;


}






// Add Firebase


await addDoc(

collection(db,"questions"),

{


subject:subject,

topic:topic,

question:question,

options:options,

answer:answer,

explanation:explanation,

createdAt:serverTimestamp()


}

);




existingQuestions.push(

question.toLowerCase()

);



added++;



}



catch(error){


failed++;


}





}






document.getElementById(
"bulkTotal"
).innerHTML = total;



document.getElementById(
"addedCount"
).innerHTML = added;



document.getElementById(
"skippedCount"
).innerHTML = skipped;



document.getElementById(
"failedCount"
).innerHTML = failed;






alert(

`Upload Completed

✅ Added : ${added}

⚠️ Skipped : ${skipped}

❌ Failed : ${failed}`

);





document.getElementById(
"bulkText"
).value="";




}


catch(error){


console.log(
"Bulk Upload Error",
error
);


alert(
"Upload Failed"
);

bulkUploadBtn.innerHTML =
"🚀 Upload Questions";

}



};




}











catch(error){



console.log(

"Bulk Upload Error",

error

);



alert(

"❌ Upload Failed"

);



bulkBtn.innerHTML =

"🚀 Upload Questions";



}



};



}








console.log(

"✅ Bulk Upload System Ready"

);

  // =========================
// QUESTION MANAGEMENT
// PART 3
// =========================


let allQuestions = [];



// =========================
// LOAD QUESTIONS
// =========================


async function loadQuestionsAdmin(){



const list =

document.getElementById(
"questionList"
);



if(!list) return;



list.innerHTML =

"Loading Questions...";





try{



const snap =

await getDocs(

collection(
db,
"questions"
)

);





allQuestions=[];



snap.forEach(item=>{



allQuestions.push({


id:item.id,


...item.data()



});



});





displayQuestions(allQuestions);
loadAdminStats();


}



catch(error){



console.log(

"Load Error",

error

);



list.innerHTML =

"Error Loading Questions";



}



}









// =========================
// DISPLAY QUESTIONS
// =========================


function displayQuestions(data){



let list =

document.getElementById(
"questionList"
);



if(!list) return;




list.innerHTML="";





data.forEach(q=>{



let div =

document.createElement(
"div"
);



div.className=

"question-item";





div.innerHTML=



`

<h3>

${q.question}

</h3>


<p>

📚 Subject :

<span>${q.subject}</span>

</p>


<p>

📌 Topic :

<span>${q.topic}</span>

</p>


<p>

A) ${q.options[0]}

<br>

B) ${q.options[1]}

<br>

C) ${q.options[2]}

<br>

D) ${q.options[3]}

</p>



<p>

✅ Answer :

${q.answer}

</p>

<button

class="edit-btn"

onclick="editQuestion('${q.id}')"

>

✏️ Edit

</button>

<button

class="delete-btn"

onclick="deleteQuestion('${q.id}')"

>

🗑 Delete

</button>

`;


list.appendChild(div);



});



}








// =========================
// DELETE QUESTION
// =========================


window.deleteQuestion = async function(id){



let confirmDelete =

confirm(

"Delete this question?"

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



loadQuestionsAdmin();


}



catch(error){



console.log(

"Delete Error",

error

);



}



};








// =========================
// SEARCH QUESTION
// =========================


const searchBtn =

document.getElementById(
"searchBtn"
);



if(searchBtn){



searchBtn.onclick = ()=>{



let text =

document.getElementById(
"searchQuestion"
).value

.toLowerCase();






let result =

allQuestions.filter(q=>



q.question

.toLowerCase()

.includes(text)



);





displayQuestions(result);



};



}








// =========================
// START ADMIN
// =========================


loadQuestionsAdmin();



console.log(

"✅ Admin Panel Final Ready"

);

// =========================
// ADMIN DASHBOARD STATS
// =========================


async function loadAdminStats(){


try{


const snap = await getDocs(

collection(
db,
"questions"
)

);



let total = 0;

let polity = 0;

let history = 0;

let science = 0;

let tamilnadu = 0;





snap.forEach((doc)=>{


let data = doc.data();



total++;





if(data.subject === "Indian Polity"){

polity++;

}



if(data.subject === "Indian History"){

history++;

}



if(data.subject === "General Science"){

science++;

}



if(data.subject === "Tamil Nadu GK"){

tamilnadu++;

}



});







document.getElementById(
"totalQuestions"
).innerHTML = total;





document.getElementById(
"polityCount"
).innerHTML = polity;





document.getElementById(
"historyCount"
).innerHTML = history;





document.getElementById(
"scienceCount"
).innerHTML = science;





document.getElementById(
"tnCount"
).innerHTML = tamilnadu;





console.log(
"✅ Admin Stats Updated"
);



}



catch(error){


console.log(
"Stats Error",
error
);



}



}




// =========================
// SUBJECT TOPIC FILTER
// =========================


const filterSubject =

document.getElementById(
"filterSubject"
);


const filterTopic =

document.getElementById(
"filterTopic"
);


const filterBtn =

document.getElementById(
"filterBtn"
);







// =========================
// LOAD TOPICS BASED ON SUBJECT
// =========================


if(filterSubject){



filterSubject.onchange = ()=>{


let subject =

filterSubject.value;




let topics = [];





allQuestions.forEach(q=>{


if(

subject==="all" ||

q.subject===subject

){



if(

!topics.includes(q.topic)

){


topics.push(q.topic);


}



}



});






filterTopic.innerHTML =

`<option value="all">
All Topics
</option>`;






topics.forEach(topic=>{



filterTopic.innerHTML +=


`

<option value="${topic}">

${topic}

</option>

`;



});



};



}








// =========================
// FILTER QUESTIONS
// =========================


if(filterBtn){



filterBtn.onclick = ()=>{



let subject =

filterSubject.value;



let topic =

filterTopic.value;





let result =

allQuestions.filter(q=>{



let subjectMatch =


subject==="all" ||

q.subject===subject;






let topicMatch =


topic==="all" ||

q.topic===topic;






return subjectMatch && topicMatch;



});






displayQuestions(result);



};



}







console.log(

"✅ Subject Topic Filter Ready"

);

// =========================
// EDIT QUESTION SYSTEM
// =========================


let editQuestionId = null;





// =========================
// EDIT BUTTON FUNCTION
// =========================


window.editQuestion = function(id){


let q = allQuestions.find(

item => item.id === id

);



if(!q) return;



editQuestionId = id;



document.getElementById("subject").value = q.subject;

document.getElementById("topic").value = q.topic;

document.getElementById("question").value = q.question;


document.getElementById("optionA").value = q.options[0];

document.getElementById("optionB").value = q.options[1];

document.getElementById("optionC").value = q.options[2];

document.getElementById("optionD").value = q.options[3];


document.getElementById("answer").value = q.answer;


document.getElementById("explanation").value = q.explanation;



document.getElementById(
"addQuestionBtn"
).style.display="none";



document.getElementById(
"updateQuestionBtn"
).style.display="block";





window.scrollTo({

top:0,

behavior:"smooth"

});



};








// =========================
// UPDATE QUESTION
// =========================


const updateBtn =

document.getElementById(
"updateQuestionBtn"
);





if(updateBtn){



updateBtn.onclick = async ()=>{



if(!editQuestionId) return;





try{



await updateDoc(

doc(

db,

"questions",

editQuestionId

),

{


subject:

document.getElementById("subject").value,



topic:

document.getElementById("topic").value,



question:

document.getElementById("question").value,



options:[


document.getElementById("optionA").value,


document.getElementById("optionB").value,


document.getElementById("optionC").value,


document.getElementById("optionD").value


],



answer:

Number(

document.getElementById("answer").value

),



explanation:

document.getElementById("explanation").value,



updatedAt:

serverTimestamp()



}



);






alert(

"✅ Question Updated Successfully"

);






editQuestionId=null;





document.getElementById(
"updateQuestionBtn"
).style.display="none";





document.getElementById(
"addQuestionBtn"
).style.display="block";






loadQuestionsAdmin();



// =========================
// CLEAR FORM
// =========================


function clearQuestionForm(){


document.getElementById("topic").value="";


document.getElementById("question").value="";


document.getElementById("optionA").value="";


document.getElementById("optionB").value="";


document.getElementById("optionC").value="";


document.getElementById("optionD").value="";


document.getElementById("explanation").value="";


}
