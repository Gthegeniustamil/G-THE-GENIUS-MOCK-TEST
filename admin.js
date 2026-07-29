// =========================
// G THE GENIUS ADMIN JS
// FINAL VERSION
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
// BULK PASTE UPLOAD
// DUPLICATE CHECK
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

alert("Paste Questions First");

return;

}



let total = 0;
let added = 0;
let skipped = 0;
let failed = 0;




try{



// Existing Questions

const snap = await getDocs(

collection(db,"questions")

);



let existing = [];



snap.forEach(item=>{


let data = item.data();


existing.push(

data.question
.trim()
.toLowerCase()

);


});




// Split Questions

let questionBlocks =

text.split(/\n\s*\n/);



total = questionBlocks.length;





for(let block of questionBlocks){


try{


let lines = block.split("\n");


let question="";
let options=[];
let answer=0;
let explanation="";




lines.forEach(line=>{


line=line.trim();



if(line.match(/^\d+\./)){


question =

line.replace(/^\d+\./,"").trim();


}



else if(line.startsWith("A)")){


options[0]=

line.replace("A)","").trim();


}



else if(line.startsWith("B)")){


options[1]=

line.replace("B)","").trim();


}



else if(line.startsWith("C)")){


options[2]=

line.replace("C)","").trim();


}



else if(line.startsWith("D)")){


options[3]=

line.replace("D)","").trim();


}



else if(line.startsWith("Answer:")){


let ans =

line.replace("Answer:","").trim();


answer =

ans.charCodeAt(0)-65;


}



else if(line.startsWith("Explanation:")){


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

existing.includes(

question.toLowerCase()

)

){


skipped++;

continue;

}





// Firebase Add


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



existing.push(

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



}



};



}




console.log(
"✅ Bulk Paste Upload Ready"
);

// =========================
// QUESTION MANAGEMENT
// PART 2
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



list.innerHTML = "Loading Questions...";



try{


const snap = await getDocs(

collection(db,"questions")

);



allQuestions=[];



snap.forEach(item=>{


allQuestions.push({


id:item.id,


...item.data()


});


});





displayQuestions(allQuestions);



// Stats Load

loadAdminStats();



}



catch(error){


console.log(

"Load Question Error",

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





div.innerHTML =


`

<h3>
${q.question}
</h3>


<p>
📚 Subject :
${q.subject}
</p>


<p>
📌 Topic :
${q.topic}
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



let ok = confirm(

"Delete this question?"

);



if(!ok) return;



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
// SEARCH
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
)
.value
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







if(filterSubject){



filterSubject.onchange = ()=>{


let subject =

filterSubject.value;




let topics=[];




allQuestions.forEach(q=>{


if(

subject==="all"

||

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

`

<option value="all">

All Topics

</option>

`;






topics.forEach(t=>{


filterTopic.innerHTML +=


`

<option value="${t}">

${t}

</option>


`;



});



};



}








if(filterBtn){



filterBtn.onclick = ()=>{


let subject =

filterSubject.value;



let topic =

filterTopic.value;






let result =

allQuestions.filter(q=>{



let s =

subject==="all"

||

q.subject===subject;




let t =

topic==="all"

||

q.topic===topic;



return s && t;



});





displayQuestions(result);



};



}








// =========================
// START ADMIN
// =========================


loadQuestionsAdmin();



console.log(

"✅ Question Management Ready"

);


// =========================
// ADMIN DASHBOARD STATS
// PART 3
// =========================


async function loadAdminStats(){


try{


const snap = await getDocs(

collection(db,"questions")

);



let total = 0;

let polity = 0;

let history = 0;

let science = 0;

let tamilnadu = 0;





snap.forEach(item=>{


let data = item.data();


total++;




if(data.subject==="Indian Polity"){

polity++;

}



if(data.subject==="Indian History"){

history++;

}



if(data.subject==="General Science"){

science++;

}



if(data.subject==="Tamil Nadu GK"){

tamilnadu++;

}



});






let totalBox =
document.getElementById("totalQuestions");


if(totalBox)

totalBox.innerHTML = total;




let polityBox =
document.getElementById("polityCount");


if(polityBox)

polityBox.innerHTML = polity;





let historyBox =
document.getElementById("historyCount");


if(historyBox)

historyBox.innerHTML = history;





let scienceBox =
document.getElementById("scienceCount");


if(scienceBox)

scienceBox.innerHTML = science;





let tnBox =
document.getElementById("tnCount");


if(tnBox)

tnBox.innerHTML = tamilnadu;




console.log(
"✅ Stats Updated"
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
// EDIT QUESTION
// =========================


let editQuestionId = null;




window.editQuestion = function(id){



let q = allQuestions.find(

item=>item.id===id

);




if(!q) return;



editQuestionId=id;



// If old edit form exists

if(document.getElementById("subject")){


document.getElementById("subject").value=q.subject;

document.getElementById("topic").value=q.topic;

document.getElementById("question").value=q.question;


document.getElementById("optionA").value=q.options[0];

document.getElementById("optionB").value=q.options[1];

document.getElementById("optionC").value=q.options[2];

document.getElementById("optionD").value=q.options[3];


document.getElementById("answer").value=q.answer;


document.getElementById("explanation").value=q.explanation;


}



if(document.getElementById("updateQuestionBtn")){


document.getElementById(
"updateQuestionBtn"
).style.display="block";


}



if(document.getElementById("addQuestionBtn")){


document.getElementById(
"addQuestionBtn"
).style.display="none";


}




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



if(!editQuestionId)

return;






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

"✅ Question Updated"

);






editQuestionId=null;



if(document.getElementById("updateQuestionBtn")){


document.getElementById(
"updateQuestionBtn"
).style.display="none";


}



if(document.getElementById("addQuestionBtn")){


document.getElementById(
"addQuestionBtn"
).style.display="block";


}




loadQuestionsAdmin();



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



let ids=[

"topic",

"question",

"optionA",

"optionB",

"optionC",

"optionD",

"explanation"

];




ids.forEach(id=>{


let el=document.getElementById(id);


if(el)

el.value="";


});



}








console.log(

"✅ G THE GENIUS ADMIN FINAL READY"

);
