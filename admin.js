// ===================================
// G THE GENIUS ADMIN PANEL
// BULK QUESTION UPLOAD SYSTEM
// ===================================


import { db } from "./firebase-config.js";


import {

collection,
addDoc,
getDocs,
query,
where

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ===================================
// SUBJECT - TOPIC LIST
// ===================================


const topics = {

"Indian Polity":[
"Constitution",
"Fundamental Rights",
"Fundamental Duties",
"President",
"Prime Minister",
"Parliament",
"Supreme Court"
],


"Science":[
"Physics",
"Chemistry",
"Biology",
"Human Body",
"Environment"
],


"History":[
"Ancient History",
"Medieval History",
"Modern History",
"Freedom Struggle"
],


"Geography":[
"Indian Geography",
"World Geography",
"Rivers",
"Climate"
],


"General Knowledge":[
"Indian GK",
"World GK",
"Books",
"Awards",
"Sports"
],


"Tamil Nadu GK":[
"Tamil History",
"Tamil Culture",
"District Information",
"Government Schemes"
],


"Aptitude":[
"Number System",
"Percentage",
"Profit Loss",
"Time Work"
],


"Reasoning":[
"Analogy",
"Coding Decoding",
"Series",
"Blood Relation"
],


"Current Affairs":[
"National News",
"International News",
"Tamil Nadu News"
],


"TNUSRB Special":[
"Police Act",
"Criminal Law",
"Police Administration"
]

};





// ===================================
// ELEMENTS
// ===================================


const subject =
document.getElementById("subject");


const topic =
document.getElementById("topic");


const uploadBtn =
document.getElementById("uploadBtn");


const bulkQuestions =
document.getElementById("bulkQuestions");


const progressBar =
document.getElementById("progressBar");


const result =
document.getElementById("result");


const questionCount =
document.getElementById("questionCount");


const sampleBtn =
document.getElementById("sampleBtn");





// ===================================
// SUBJECT TO TOPIC LOAD
// ===================================


subject.addEventListener("change",()=>{


topic.innerHTML =
`
<option>
Select Topic
</option>
`;



let list =
topics[subject.value];



if(list){


list.forEach(t=>{


let option =
document.createElement("option");


option.value=t;

option.textContent=t;


topic.appendChild(option);


});


}



});






// ===================================
// QUESTION COUNT
// ===================================


async function loadQuestionCount(){


try{


let snap =
await getDocs(
collection(db,"questions")
);



questionCount.innerHTML =

`
<h2>${snap.size}</h2>
Total Questions
`;



}

catch(e){


questionCount.innerHTML =
"Count Error";


}


}



loadQuestionCount();






// ===================================
// DUPLICATE CHECK
// ===================================


async function checkDuplicate(question){


let q =
query(

collection(db,"questions"),

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







// ===================================
// UPLOAD HISTORY
// ===================================


async function saveUploadHistory(data){


await addDoc(

collection(db,"uploadHistory"),

{


...data,


date:new Date()


}


);


}








// ===================================
// BULK UPLOAD
// ===================================


uploadBtn.onclick = async ()=>{


try{


let data =
JSON.parse(
bulkQuestions.value
);



let added=0;

let duplicate=0;

let error=0;



let total =
data.length;



for(let i=0;i<total;i++){



try{


let q =
data[i];



if(!q.question)
{

error++;

continue;

}




let already =
await checkDuplicate(
q.question
);




if(already){


duplicate++;


}

else{



await addDoc(

collection(db,"questions"),

{


subject:
q.subject ||
subject.value,


topic:
q.topic ||
topic.value,


question:
q.question,


options:
q.options || [],


answer:
q.answer,


explanation:
q.explanation || "",


createdAt:
new Date()


}


);



added++;


}






let percent =
Math.round(
((i+1)/total)*100
);



progressBar.style.width =
percent+"%";



result.innerHTML =

`
Uploading ${percent}%<br>

✅ Added : ${added}<br>

⚠ Duplicate : ${duplicate}<br>

❌ Error : ${error}

`;



}



catch(e){


error++;


}



}





await saveUploadHistory({

subject:subject.value,

topic:topic.value,

added,

duplicate,

error

});





result.innerHTML =

`
🎉 Upload Completed

<br><br>

✅ Added : ${added}

<br>

⚠ Duplicate : ${duplicate}

<br>

❌ Error : ${error}

`;



loadQuestionCount();



}



catch(e){


alert(
"JSON Format Error"
);


console.log(e);


}


};







// ===================================
// SAMPLE JSON DOWNLOAD
// ===================================


if(sampleBtn){


sampleBtn.onclick=()=>{


let sample=[

{

subject:"Indian Polity",

topic:"Fundamental Rights",

question:"அடிப்படை உரிமைகள் எந்த பகுதியில் உள்ளது?",

options:[

"Part I",

"Part II",

"Part III",

"Part IV"

],


answer:"Part III",

explanation:
"அடிப்படை உரிமைகள் Part IIIல் உள்ளது"


}

];



let blob =
new Blob(

[
JSON.stringify(sample,null,2)

],

{
type:"application/json"
}

);



let link =
document.createElement("a");


link.href =
URL.createObjectURL(blob);


link.download =
"sample_questions.json";


link.click();



};


}
