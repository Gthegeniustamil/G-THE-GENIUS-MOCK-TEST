// ==========================================
// G THE GENIUS
// ADMIN BULK UPLOAD JS
// ==========================================


import { db } from "./firebase-config.js";


import {

collection,
getDocs,
addDoc,
serverTimestamp

} from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// MASTER DATA

const learningData =
window.learningData;





// ELEMENTS


const categorySelect =
document.getElementById(
"categorySelect"
);


const subjectSelect =
document.getElementById(
"subjectSelect"
);


const topicSelect =
document.getElementById(
"topicSelect"
);


const questionInput =
document.getElementById(
"questionInput"
);


const uploadBtn =
document.getElementById(
"uploadBtn"
);


const uploadResult =
document.getElementById(
"uploadResult"
);








// ==========================================
// LOAD CATEGORY
// ==========================================


function loadCategories(){


categorySelect.innerHTML =

`
<option value="">
Select Category
</option>
`;




Object.keys(learningData)
.forEach(key=>{


let option =
document.createElement(
"option"
);


option.value = key;


option.textContent =
learningData[key].title;



categorySelect.appendChild(
option
);



});



}








// ==========================================
// LOAD SUBJECT
// ==========================================


categorySelect.onchange = ()=>{


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






let category =
categorySelect.value;





if(!category)

return;






let data =
learningData[category];





// Direct topics

if(data.topics){



let option =
document.createElement(
"option"
);


option.value =
data.title;


option.textContent =
data.title;



subjectSelect.appendChild(
option
);



}






// General subjects

if(data.subjects){



Object.keys(data.subjects)
.forEach(key=>{


let subject =
data.subjects[key];



let option =
document.createElement(
"option"
);



option.value =
subject.title;



option.textContent =
subject.title;



subjectSelect.appendChild(
option
);



});



}


};









// ==========================================
// LOAD TOPICS
// ==========================================


subjectSelect.onchange = ()=>{


topicSelect.innerHTML =

`
<option value="">
Select Topic
</option>
`;





let category =
categorySelect.value;



let subject =
subjectSelect.value;




let data =
learningData[category];





// Direct category


if(data.topics){



data.topics.forEach(topic=>{


addTopic(topic);



});


}







// General subject


if(data.subjects){



Object.values(
data.subjects
)
.forEach(item=>{



if(item.title === subject){



item.topics.forEach(topic=>{


addTopic(topic);



});



}



});



}



};







function addTopic(topic){


let option =
document.createElement(
"option"
);


option.value =
topic;


option.textContent =
topic;



topicSelect.appendChild(
option
);


}









// ==========================================
// DUPLICATE CHECK
// ==========================================


async function checkDuplicate(question){



let snap =

await getDocs(

collection(
db,
"questions"
)

);





let duplicate = false;





snap.forEach(doc=>{


let data =
doc.data();




if(

data.question.trim()

===

question.trim()

){


duplicate = true;


}



});





return duplicate;



}









// ==========================================
// UPLOAD QUESTIONS
// ==========================================


uploadBtn.onclick = async()=>{


try{



let questions =

JSON.parse(

questionInput.value

);





let added = 0;

let duplicate = 0;

let failed = 0;







for(let q of questions){





let exists =

await checkDuplicate(
q.question
);






if(exists){


duplicate++;


continue;


}







await addDoc(

collection(
db,
"questions"
),

{


category:

categorySelect.value,



subject:

subjectSelect.value,



topic:

topicSelect.value,



question:

q.question,



options:

q.options,



answer:

q.answer,



createdAt:

serverTimestamp()



}


);





added++;





}






uploadResult.innerHTML =

`

<h3>
Upload Completed
</h3>

<p>
Total : ${questions.length}
</p>

<p>
✅ Added : ${added}
</p>

<p>
⚠️ Duplicate : ${duplicate}
</p>

<p>
❌ Failed : ${failed}
</p>

`;





}

catch(error){



console.error(error);



uploadResult.innerHTML =

"❌ Invalid JSON Format";



}



};








// START

loadCategories();


console.log(
"G THE GENIUS BULK UPLOAD READY"
);
