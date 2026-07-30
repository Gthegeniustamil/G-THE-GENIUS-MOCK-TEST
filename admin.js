// ===================================
// QUESTION BANK COUNT
// ===================================


import {

doc,
setDoc,
getDoc

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const questionCount =
document.getElementById("questionCount");


const uploadHistory =
document.getElementById("uploadHistory");





async function loadQuestionCount(){


try{


let snap =
await getDocs(
collection(db,"questions")
);



let total =
snap.size;



questionCount.innerHTML =

`
<h2>
${total}
</h2>

Total Questions

`;



}

catch(e){


questionCount.innerHTML =
"Count Loading Error";


}


}





loadQuestionCount();







// ===================================
// SAMPLE JSON DOWNLOAD
// ===================================


document
.getElementById("sampleBtn")
.onclick=()=>{



let sample =

[

{

subject:"Indian Polity",

topic:"Fundamental Rights",

question:
"அடிப்படை உரிமைகள் எந்த பகுதியில் உள்ளது?",


options:[

"Part I",

"Part II",

"Part III",

"Part IV"

],


answer:
"Part III",


explanation:
"அரசியலமைப்பின் Part IIIல் அடிப்படை உரிமைகள் உள்ளன"


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







// ===================================
// SAVE UPLOAD HISTORY
// ===================================



async function saveUploadHistory(data){



await addDoc(

collection(db,"uploadHistory"),

{

...data,

date:
new Date()

}

);



}







// Upload complete place this code:


/*

await saveUploadHistory({

subject:subject.value,

topic:topic.value,

added:added,

duplicate:duplicate,

error:error

});

*/


loadQuestionCount();

