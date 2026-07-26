import {

signOut

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { db } from "./firebase-config.js";
import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const saveButton =
document.getElementById("saveQuestion");





saveButton.onclick = async function(){


let question =
document.getElementById("question").value;


let options = [


document.getElementById("option0").value,

document.getElementById("option1").value,

document.getElementById("option2").value,

document.getElementById("option3").value


];



let answer =
Number(document.getElementById("answer").value);



let explanation =
document.getElementById("explanation").value;





if(
question==="" ||
options.includes("") ||
isNaN(answer)
){

alert("Please fill all fields");

return;

}





try{


await addDoc(

collection(db,"questions"),

{


question:question,


options:options,


answer:answer,


explanation:explanation,


createdAt:serverTimestamp()


}

);



alert("✅ Question Added Successfully");



// Clear Form


document.getElementById("question").value="";


options.forEach((x,index)=>{

document.getElementById("option"+index).value="";

});


document.getElementById("answer").value="";


document.getElementById("explanation").value="";



}


catch(error){


console.log(error);


alert("❌ Error Saving Question");


}



};

const logoutBtn =
document.getElementById("logoutBtn");


logoutBtn.onclick = async function(){

await signOut(auth);


window.location.href =
"admin-login.html";

};
document.getElementById("uploadBtn").onclick = async function () {

const text = document.getElementById("bulkJson").value;

if(text.trim() === ""){

alert("Paste JSON First");

return;

}

try{

const questions = JSON.parse(text);

let count = 0;

for(const q of questions){

await addDoc(collection(db,"questions"),{

question:q.question,
options:q.options,
answer:q.answer,
explanation:q.explanation,
createdAt:serverTimestamp()

});

count++;

}

document.getElementById("uploadStatus").innerHTML =
"✅ " + count + " Questions Uploaded Successfully";

}
catch(error){

console.log(error);

document.getElementById("uploadStatus").innerHTML =
"❌ Invalid JSON";

}

};
