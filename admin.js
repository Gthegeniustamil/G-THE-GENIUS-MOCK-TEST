// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
// PART 1
// =========================


import { db } from "./firebase-config.js";


import {

collection,
addDoc,
getDocs,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// SUBJECT → TOPIC SYSTEM
// =========================


const topics = {


"Indian Polity":[

"Constitution",
"Preamble",
"Citizenship",
"Fundamental Rights",
"Fundamental Duties",
"DPSP",
"Parliament",
"President",
"Prime Minister",
"Governor",
"Supreme Court",
"High Court",
"Emergency",
"Amendments",
"Important Articles"

],



"Indian History":[

"Ancient India",
"Medieval India",
"Modern India",
"Freedom Struggle",
"Governor Generals",
"Viceroys",
"INC",
"Important Movements",
"Important Personalities"

],



"Geography":[

"Indian Geography",
"World Geography",
"Tamil Nadu Geography",
"Climate",
"Rivers",
"Mountains",
"Soil",
"Agriculture",
"Minerals"

],



"General Science":[

"Physics",
"Chemistry",
"Biology",
"Human Body",
"Diseases",
"Environment",
"Science Technology"

],



"Tamil Nadu GK":[

"History",
"Geography",
"Districts",
"Schemes",
"Culture",
"Administration"

],



"Current Affairs":[

"National",
"International",
"Sports",
"Awards",
"Appointments",
"Science",
"Defence"

],



"Aptitude":[

"Percentage",
"Ratio",
"Average",
"Profit Loss",
"Time Work",
"Time Distance",
"Simple Interest"

],



"Reasoning":[

"Analogy",
"Coding Decoding",
"Blood Relation",
"Direction",
"Series",
"Puzzle"

],



"Tamil":[

"இலக்கணம்",
"இலக்கியம்",
"சங்க இலக்கியம்",
"செய்யுள்",
"உரைநடை"

],



"English":[

"Grammar",
"Vocabulary",
"Tenses",
"Synonyms",
"Antonyms"

]


};






// =========================
// LOAD TOPICS
// =========================


const subjectSelect =

document.getElementById(
"bulkSubject"
);



const topicSelect =

document.getElementById(
"bulkTopic"
);




if(subjectSelect){



subjectSelect.onchange = ()=>{


let subject =
subjectSelect.value;



topicSelect.innerHTML =

`
<option value="">
Select Topic
</option>
`;



if(topics[subject]){


topics[subject].forEach(topic=>{


let option =
document.createElement(
"option"
);



option.value = topic;

option.textContent = topic;



topicSelect.appendChild(
option
);



});


}



};



}


// =========================
// BULK UPLOAD FINAL SYSTEM
// FILE + COPY PASTE
// =========================


const bulkUploadBtn = 
document.getElementById("bulkUploadBtn");



if(bulkUploadBtn){


bulkUploadBtn.onclick = async()=>{


let subject = 
document.getElementById("bulkSubject").value;


let topic =
document.getElementById("bulkTopic").value;



let pasteData =
document.getElementById("bulkText")?.value.trim();



let questions = [];





// =========================
// GET JSON FILE
// =========================


let fileInput =
document.getElementById("jsonFile");





if(fileInput && fileInput.files.length > 0){


let file =
fileInput.files[0];



let text =
await file.text();



try{


questions =
JSON.parse(text);


}

catch(error){


alert("Invalid JSON File");

return;


}



}





// =========================
// GET COPY PASTE
// =========================


else if(pasteData){



try{


questions =
JSON.parse(pasteData);


}

catch(error){


alert("Invalid JSON Paste Format");

return;


}



}




else{


alert(
"Upload JSON File or Paste Questions"
);


return;


}







if(!subject || !topic){


alert(
"Select Subject and Topic"
);


return;


}







let total =
questions.length;


let added = 0;

let duplicate = 0;

let failed = 0;





// =========================
// EXISTING QUESTIONS
// =========================


const snap = await getDocs(

collection(
db,
"questions"
)

);



let existing=[];




snap.forEach(doc=>{


let data =
doc.data();



existing.push(

data.question
?.toLowerCase()
.trim()

);



});









// =========================
// UPLOAD LOOP
// =========================


for(let q of questions){



try{


if(
!q.question ||
!q.options ||
q.options.length!==4
){


failed++;

continue;


}





let cleanQuestion =

q.question
.toLowerCase()
.trim();





if(
existing.includes(cleanQuestion)
){


duplicate++;

continue;


}








await addDoc(

collection(
db,
"questions"
),

{


questionId:

"GTG-Q-"+Date.now(),



subject:

subject,



topic:

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





existing.push(
cleanQuestion
);



added++;




}

catch(error){


failed++;


}


}








// =========================
// REPORT
// =========================



if(document.getElementById("bulkTotal"))

document.getElementById("bulkTotal").innerHTML =
total;



if(document.getElementById("addedCount"))

document.getElementById("addedCount").innerHTML =
added;



if(document.getElementById("skippedCount"))

document.getElementById("skippedCount").innerHTML =
duplicate;



if(document.getElementById("failedCount"))

document.getElementById("failedCount").innerHTML =
failed;






alert(

`Upload Completed

✅ Added : ${added}

⚠️ Duplicate : ${duplicate}

❌ Failed : ${failed}`

);





// CLEAR


if(document.getElementById("bulkText"))

document.getElementById("bulkText").value="";


if(fileInput)

fileInput.value="";



};



}


console.log(
"✅ Final Bulk Upload Ready"
);











// =========================
// LOAD QUESTIONS
// =========================


async function loadQuestions(){


const list =

document.getElementById(
"questionList"
);



if(!list) return;



list.innerHTML =
"Loading Questions...";



try{


const snap = await getDocs(

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





displayQuestions(
allQuestions
);



}



catch(error){


console.log(
"Question Load Error",
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



const list =

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



div.className =
"question-item";




div.innerHTML = `


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



let confirmDelete = confirm(

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
"✅ Deleted Successfully"
);



loadQuestions();



}



catch(error){


console.log(
"Delete Error",
error
);


alert(
"Delete Failed"
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



let value =

document.getElementById(
"searchQuestion"
)
.value
.toLowerCase();




let result =

allQuestions.filter(q=>


q.question
.toLowerCase()
.includes(value)



);



displayQuestions(
result
);



};



}








// =========================
// SUBJECT FILTER
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







if(filterSubject){



filterSubject.onchange = ()=>{



let subject =

filterSubject.value;




let topicArray=[];





allQuestions.forEach(q=>{



if(

subject==="all"

||

q.subject===subject

){



if(

!topicArray.includes(q.topic)

){


topicArray.push(
q.topic
);


}



}



});






filterTopic.innerHTML = `

<option value="all">

All Topics

</option>

`;






topicArray.forEach(t=>{


filterTopic.innerHTML += `

<option value="${t}">

${t}

</option>

`;


});




};



}








// =========================
// APPLY FILTER
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

subject==="all"

||

q.subject===subject;




let topicMatch =

topic==="all"

||

q.topic===topic;




return subjectMatch && topicMatch;



});






displayQuestions(
result
);



};



}







// =========================
// START
// =========================


loadQuestions();



console.log(
"✅ Question Management Ready"
);

// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
// PART 3
// DASHBOARD STATS
// =========================



// =========================
// LOAD ADMIN STATS
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


let counts = {

"Indian Polity":0,

"Indian History":0,

"Geography":0,

"General Science":0,

"Tamil Nadu GK":0,

"Current Affairs":0,

"Economics":0,

"Computer Science":0,

"Aptitude":0,

"Reasoning":0,

"Tamil":0,

"English":0

};





snap.forEach(item=>{


let data = item.data();



total++;




if(
counts.hasOwnProperty(data.subject)
){


counts[data.subject]++;


}



});







// TOTAL QUESTIONS


let totalBox =

document.getElementById(
"totalQuestions"
);



if(totalBox)

totalBox.innerHTML = total;







// SUBJECT COUNTS



let map = {


"polityCount":
"Indian Polity",


"historyCount":
"Indian History",


"scienceCount":
"General Science",


"tnCount":
"Tamil Nadu GK"


};







Object.keys(map).forEach(id=>{


let box =

document.getElementById(
id
);



if(box){


box.innerHTML =

counts[map[id]] || 0;


}



});







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
// UPLOAD DATE FORMAT
// =========================


function formatDate(timestamp){


if(!timestamp)

return "-";



try{


return timestamp
.toDate()
.toLocaleString(
"en-IN",
{

timeZone:
"Asia/Kolkata",

day:
"2-digit",

month:
"2-digit",

year:
"numeric",

hour:
"2-digit",

minute:
"2-digit"

}

);



}

catch(error){


return "-";


}



}









// =========================
// SAFE ELEMENT CHECK
// =========================


function setText(id,value){


let el =

document.getElementById(id);



if(el)

el.innerHTML=value;


}









// =========================
// ADMIN READY
// =========================


window.addEventListener(

"load",

()=>{


loadQuestions();


loadAdminStats();


console.log(

"🚀 G THE GENIUS ADMIN PANEL READY"

);



}

);

// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
// PART 4
// JSON FILE PREVIEW SYSTEM
// =========================



const jsonFile =

document.getElementById(
"jsonFile"
);



const previewBox =

document.getElementById(
"questionCount"
);



let previewQuestions = [];





// =========================
// JSON FILE CHANGE
// =========================


if(jsonFile){


jsonFile.onchange = (event)=>{


let file =

event.target.files[0];



if(!file)

return;




let reader =

new FileReader();





reader.onload = (e)=>{


try{


let data =

JSON.parse(
e.target.result
);





if(!Array.isArray(data)){


alert(
"JSON Format Wrong"
);


return;


}






previewQuestions = data;






if(previewBox){


previewBox.innerHTML =

data.length;


}





alert(

`Preview Ready

Total Questions : ${data.length}`

);







console.log(
data
);



}



catch(error){


alert(
"Invalid JSON File"
);



}



};





reader.readAsText(file);



};



}









// =========================
// JSON VALIDATION
// =========================


function validateQuestion(q){



if(!q.question)

return false;



if(!q.options)

return false;



if(q.options.length !==4)

return false;



if(q.answer===undefined)

return false;



return true;



}








// =========================
// PREVIEW DISPLAY
// =========================


function showPreview(){



const box =

document.getElementById(
"previewList"
);



if(!box)

return;



box.innerHTML="";





previewQuestions.forEach((q,index)=>{



let div =

document.createElement(
"div"
);



div.className =
"preview-item";





div.innerHTML = `


<h4>

${index+1}. ${q.question}

</h4>



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

Answer :

${q.answer}

</p>


`;



box.appendChild(div);



});



}








// =========================
// PREVIEW BUTTON
// =========================


const previewBtn =

document.getElementById(
"previewBtn"
);





if(previewBtn){



previewBtn.onclick = ()=>{



if(
previewQuestions.length===0
){


alert(
"Upload JSON First"
);


return;


}



showPreview();



};



}








// =========================
// CHECK VALID QUESTIONS
// =========================


function checkQuestions(){



let valid=0;

let invalid=0;





previewQuestions.forEach(q=>{



if(
validateQuestion(q)
){


valid++;


}

else{


invalid++;


}



});






alert(

`Validation Report

✅ Valid : ${valid}

❌ Invalid : ${invalid}`

);



}








const validateBtn =

document.getElementById(
"validateBtn"
);




if(validateBtn){



validateBtn.onclick = ()=>{


checkQuestions();


};



}




console.log(
"✅ JSON Preview System Ready"
);

// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
// PART 5
// FIRESTORE JSON UPLOAD
// =========================



import {

addDoc,
collection,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// =========================
// GENERATE IDS
// =========================


function generateId(prefix){


return (

prefix +

"-" +

Date.now()

);



}









// =========================
// JSON UPLOAD BUTTON
// =========================


const jsonUploadBtn =

document.getElementById(
"bulkUploadBtn"
);






if(jsonUploadBtn){



jsonUploadBtn.onclick = async()=>{



let subject =

document.getElementById(
"bulkSubject"
).value;



let topic =

document.getElementById(
"bulkTopic"
).value;






if(!subject || !topic){


alert(
"Select Subject and Topic"
);



return;


}






if(
previewQuestions.length===0
){


alert(
"Load JSON File First"
);



return;


}







let uploadId =

generateId(
"GTG-UP"
);






let added = 0;

let failed = 0;

let skipped = 0;







for(
let i=0;
i<previewQuestions.length;
i++
){



let q =

previewQuestions[i];





try{



if(
!validateQuestion(q)
){


failed++;

continue;


}






let questionId =

generateId(
"GTG-Q"
);







await addDoc(

collection(
db,
"questions"
),

{


questionId:


questionId,



uploadId:


uploadId,



subject:


subject,



topic:


topic,



question:


q.question,



options:


q.options,



answer:


q.answer,



explanation:


q.explanation || "",



createdAt:


serverTimestamp()


}


);





added++;





}



catch(error){


failed++;


}



}







// REPORT UPDATE



document.getElementById(
"bulkTotal"
).innerHTML =

previewQuestions.length;



document.getElementById(
"addedCount"
).innerHTML =

added;



document.getElementById(
"failedCount"
).innerHTML =

failed;





alert(

`Upload Completed

Upload ID:
${uploadId}

✅ Added:
${added}

❌ Failed:
${failed}`

);







// CLEAR


previewQuestions=[];



document.getElementById(
"jsonFile"
).value="";



if(document.getElementById(
"questionCount"
)){


document.getElementById(
"questionCount"
).innerHTML="0";


}



};




}








console.log(
"✅ JSON Firestore Upload Ready"
);

// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
// PART 6
// ADVANCED DUPLICATE + UPLOAD HISTORY
// =========================



import {

query,
where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// =========================
// CLEAN TEXT
// =========================


function cleanText(text){


return text

.toLowerCase()

.trim()

.replace(/\s+/g," ");


}








// =========================
// CHECK DUPLICATE QUESTION
// =========================


async function checkDuplicate(question){



let q = query(

collection(
db,
"questions"
),

where(

"question",

"==",

question

)

);





let snap =

await getDocs(q);





return !snap.empty;



}









// =========================
// UPLOAD HISTORY SAVE
// =========================


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

data.duplicate,



failed:

data.failed,



uploadedDate:

serverTimestamp()



}



);



console.log(
"Upload History Saved"
);



}


catch(error){


console.log(
"History Save Error",
error
);



}



}









// =========================
// GET UPLOAD HISTORY
// =========================


async function loadUploadHistory(){



const box =

document.getElementById(
"uploadHistory"
);



if(!box)

return;





box.innerHTML =
"Loading...";






try{



const snap =

await getDocs(

collection(
db,
"uploadHistory"
)

);





box.innerHTML="";





snap.forEach(item=>{



let data =
item.data();





let div =

document.createElement(
"div"
);





div.className =
"history-card";





div.innerHTML = `


<h3>

📂 ${data.uploadId}

</h3>


<p>

📚 ${data.subject}

</p>


<p>

📌 ${data.topic}

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
"History Load Error",
error
);



}




}







// =========================
// EXPORT QUESTIONS JSON
// =========================


async function exportQuestions(){



const snap =

await getDocs(

collection(
db,
"questions"
)

);



let data=[];




snap.forEach(item=>{


data.push(item.data());


});





let blob =

new Blob(

[

JSON.stringify(
data,
null,
2
)

],

{

type:
"application/json"

}

);





let url =

URL.createObjectURL(blob);





let a =

document.createElement(
"a"
);



a.href=url;



a.download=

"G_THE_GENIUS_questions.json";



a.click();





URL.revokeObjectURL(url);



}





const exportBtn =

document.getElementById(
"exportBtn"
);



if(exportBtn){


exportBtn.onclick = ()=>{


exportQuestions();


};


}







console.log(
"✅ Advanced Duplicate + Upload History Ready"
);

// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
// PART 7
// ADMIN SECURITY + FINAL
// =========================


import { auth } from "./firebase-config.js";


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
// ADMIN SECURITY CHECK
// =========================


onAuthStateChanged(
auth,
(user)=>{



if(!user){


alert(
"Admin Login Required"
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
"Access Denied"
);



window.location.href =
"dashboard.html";



return;



}







// ADMIN DETAILS



let nameBox =

document.getElementById(
"adminName"
);



if(nameBox)

nameBox.innerHTML =

user.email;







let statusBox =

document.getElementById(
"adminStatus"
);



if(statusBox)

statusBox.innerHTML =

"🟢 Online";





console.log(
"✅ Admin Verified"
);



}

);









// =========================
// LOGOUT
// =========================


const logoutBtn =

document.getElementById(
"adminLogoutBtn"
);





if(logoutBtn){



logoutBtn.onclick = async()=>{


try{


await signOut(auth);



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









// =========================
// GLOBAL ERROR HANDLER
// =========================


window.onerror = function(

message,

source,

line

){


console.log(

"Admin Error:",

message,

"Line:",

line

);


};









// =========================
// FINAL READY
// =========================


console.log(

"🚀 G THE GENIUS ADMIN PANEL FINAL READY"

);
