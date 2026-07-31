
// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// ADMIN BULK UPLOAD JS
// PART 1 / 5
// ==========================================


import "./subjects-data.js";




// Elements


const categorySelect =
document.getElementById("categorySelect");


const subjectSelect =
document.getElementById("subjectSelect");


const topicSelect =
document.getElementById("topicSelect");





// ==========================================
// CATEGORY CHANGE
// ==========================================


categorySelect.addEventListener(
"change",
()=>{


let category =
categorySelect.value;



subjectSelect.innerHTML =
`
<option value="">
Select Subject
</option>
`;



topicSelect.innerHTML =
`
<option value="">
Select Topic
</option>
`;





if(!category)

return;




let data =
learningData[category];





// Tamil / Physical / Psychology


if(data.topics){



data.topics.forEach(topic=>{


let option =
document.createElement("option");


option.value = topic;


option.textContent = topic;


topicSelect.appendChild(option);


});



}





// General Subjects


else if(data.subjects){



Object.keys(data.subjects)
.forEach(key=>{



let subject =
data.subjects[key];



let option =
document.createElement("option");


option.value = key;


option.textContent =
subject.title;



subjectSelect.appendChild(option);



});



}


});


// ==========================================
// SUBJECT CHANGE
// PART 2 / 5
// ==========================================



subjectSelect.addEventListener(
"change",
()=>{


let category =
categorySelect.value;



let subject =
subjectSelect.value;



topicSelect.innerHTML =
`
<option value="">
Select Topic
</option>
`;



if(!category || !subject)

return;





let data =
learningData[category];





// General Subjects Topic Load


if(data.subjects && data.subjects[subject]){


let topics =
data.subjects[subject].topics;




topics.forEach(topic=>{


let option =
document.createElement("option");


option.value = topic;


option.textContent = topic;


topicSelect.appendChild(option);



});


}





});








// ==========================================
// TOPIC SELECT STATUS
// ==========================================



topicSelect.addEventListener(
"change",
()=>{


let topic =
topicSelect.value;



let display =
document.getElementById(
"selectedTopicName"
);



if(display){


display.innerText =
topic || "-";


}



});


// ==========================================
// JSON PARSE + QUESTION PREVIEW
// PART 3 / 5
// ==========================================



const bulkInput = 
document.getElementById(
"bulkQuestionsInput"
);



const previewBox =
document.getElementById(
"questionPreview"
);



const uploadStatus =
document.getElementById(
"uploadStatus"
);





// ==========================================
// SHOW PREVIEW
// ==========================================


function previewQuestions(){


try{


let questions =
JSON.parse(
bulkInput.value
);





if(!Array.isArray(questions)){


throw new Error(
"JSON must be Array"
);


}






previewBox.innerHTML="";





questions.forEach(
(q,index)=>{


let div =
document.createElement("div");



div.style.marginBottom="15px";



div.innerHTML = `

<strong>

${index+1}. ${q.question}

</strong>


<br>


Subject:
${q.subject || "-"}


<br>


Topic:
${q.topic || "-"}


`;



previewBox.appendChild(div);



});






uploadStatus.innerText =

"✅ Preview Loaded : "
+ questions.length
+ " Questions";




}

catch(error){



previewBox.innerHTML =
"❌ Invalid JSON Format";



uploadStatus.innerText =
"Please check JSON format";


}



}





// Preview while typing


if(bulkInput){


bulkInput.addEventListener(
"change",
previewQuestions
);


}


// ==========================================
// DUPLICATE CHECK SYSTEM
// PART 4 / 5
// ==========================================



import {

collection,
getDocs

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

db

} from "./firebase-config.js";






const duplicateBtn =
document.getElementById(
"checkDuplicateBtn"
);






let duplicateQuestions = [];







duplicateBtn.addEventListener(
"click",
async()=>{


try{


let newQuestions =
JSON.parse(
bulkInput.value
);





let snapshot =
await getDocs(
collection(db,"questions")
);





let existingQuestions =
[];





snapshot.forEach(doc=>{


let data =
doc.data();


existingQuestions.push(
data.question
);


});






duplicateQuestions=[];






newQuestions.forEach(q=>{



if(
existingQuestions.includes(
q.question
)

){


duplicateQuestions.push(
q.question
);


}



});







if(duplicateQuestions.length){


uploadStatus.innerText =

"⚠️ Duplicate Found : "
+
duplicateQuestions.length
+
" Questions";


}

else{


uploadStatus.innerText =

"✅ No Duplicate Found. Ready Upload";


}



}

catch(error){


console.error(error);


uploadStatus.innerText =
"❌ Duplicate Check Error";


}



});


// ==========================================
// FIRESTORE BULK UPLOAD
// PART 5 / 5 FINAL
// ==========================================


import {

addDoc,

collection,

serverTimestamp

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const uploadBtn =
document.getElementById(
"uploadBulkBtn"
);







uploadBtn.addEventListener(
"click",
async()=>{


try{


let questions =
JSON.parse(
bulkInput.value
);




if(!questions.length){


uploadStatus.innerText =
"❌ No Questions Found";


return;


}






let uploaded = 0;

let skipped = 0;






// Existing duplicate list

let duplicateList =
duplicateQuestions;






for(let q of questions){



if(
duplicateList.includes(
q.question
)

){


skipped++;

continue;


}





await addDoc(

collection(
db,
"questions"
),

{


question:q.question,


options:q.options,


answer:q.answer,



subject:
q.subject ||
subjectSelect.value,



topic:
q.topic ||
topicSelect.value,



createdAt:
serverTimestamp()


}

);



uploaded++;


}








uploadStatus.innerText =

"✅ Uploaded : "
+ uploaded
+
" | Skipped Duplicate : "
+ skipped;







// Clear After Upload


bulkInput.value="";


previewBox.innerHTML =
"Upload Completed";





}

catch(error){


console.error(error);


uploadStatus.innerText =
"❌ Upload Failed";


}



});







console.log(
"G THE GENIUS BULK UPLOAD SYSTEM READY"
);
