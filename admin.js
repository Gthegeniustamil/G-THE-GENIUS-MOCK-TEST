// =========================
// G THE GENIUS ADMIN JS
// PART 1
// =========================


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



// =========================
// ADD SINGLE QUESTION
// =========================


const addBtn =

document.getElementById(
"addQuestionBtn"
);






if(addBtn){



addBtn.onclick = async ()=>{



try{



let subject =

document.getElementById(
"subject"
).value;





let topic =

document.getElementById(
"topic"
).value;





let question =

document.getElementById(
"question"
).value;





let options = [



document.getElementById(
"optionA"
).value,



document.getElementById(
"optionB"
).value,



document.getElementById(
"optionC"
).value,



document.getElementById(
"optionD"
).value



];





let answer =

Number(

document.getElementById(
"answer"
).value

);





let explanation =

document.getElementById(
"explanation"
).value;







if(

!question ||

!topic

){


alert(
"Please fill Question and Topic"
);


return;


}








await addDoc(

collection(

db,

"questions"

),

{


subject:

subject,


topic:

topic,


question:

question,


options:

options,


answer:

answer,


explanation:

explanation,



createdAt:

serverTimestamp()



}



);







alert(

"✅ Question Added Successfully"

);







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
// BULK QUESTION UPLOAD
// PART 2
// =========================



let bulkQuestions = [];




// =========================
// READ JSON FILE
// =========================


const jsonFile =

document.getElementById(
"jsonFile"
);



if(jsonFile){



jsonFile.onchange = (event)=>{


let file =

event.target.files[0];



if(!file) return;




let reader =

new FileReader();





reader.onload = ()=>{



try{


bulkQuestions =

JSON.parse(

reader.result

);





document.getElementById(
"questionCount"
).innerHTML =

bulkQuestions.length;






alert(

"✅ JSON Loaded Successfully"

);



}



catch(error){


alert(

"❌ Invalid JSON File"

);



}



};





reader.readAsText(file);



};



}








// =========================
// BULK UPLOAD TO FIREBASE
// =========================


const bulkBtn =

document.getElementById(
"bulkUploadBtn"
);





if(bulkBtn){



bulkBtn.onclick = async ()=>{



if(

bulkQuestions.length===0

){


alert(

"Please Select JSON File"

);


return;


}







let subject =

document.getElementById(
"bulkSubject"
).value;





let topic =

document.getElementById(
"bulkTopic"
).value;






try{



bulkBtn.innerHTML =

"Uploading...";






for(let q of bulkQuestions){



await addDoc(

collection(

db,

"questions"

),

{


subject:

q.subject || subject,



topic:

q.topic || topic,



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



}






alert(

"🎉 All Questions Uploaded Successfully"

);





bulkQuestions=[];



document.getElementById(
"questionCount"
).innerHTML="0";



bulkBtn.innerHTML =

"🚀 Upload Questions";



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


import {

getDocs,
deleteDoc,
doc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







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








// LOAD STATS

loadAdminStats();


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



clearQuestionForm();





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
