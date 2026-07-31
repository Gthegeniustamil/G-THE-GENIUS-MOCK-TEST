// =====================================
// G THE GENIUS
// ADMIN JS
// PART 1
// =====================================


import { auth, db } from "./firebase-config.js";


import {

onAuthStateChanged,
signOut

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
addDoc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// =====================================
// DOM
// =====================================


const questionForm =

document.getElementById("questionForm");


const message =

document.getElementById("adminMessage");


const logoutBtn =

document.getElementById("logoutBtn");





// =====================================
// ADMIN AUTH CHECK
// =====================================


const ADMIN_UID = "YOUR_ADMIN_FIREBASE_UID";


onAuthStateChanged(auth,(user)=>{


if(!user){


window.location.href="login.html";

return;


}



if(user.uid !== ADMIN_UID){


alert("❌ Access Denied");


window.location.href="dashboard.html";


return;


}



});



// =====================================
// ADD QUESTION
// =====================================


if(questionForm){



questionForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();




const question =

document.getElementById("question").value.trim();



const options = [


document.getElementById("optionA").value.trim(),


document.getElementById("optionB").value.trim(),


document.getElementById("optionC").value.trim(),


document.getElementById("optionD").value.trim()


];




const correctAnswer =

Number(

document.getElementById("correctAnswer").value

);



const category =

document.getElementById("category").value;



const explanation =

document.getElementById("explanation").value;





try{



await addDoc(

collection(db,"questions"),

{


question:question,


options:options,


correctAnswer:correctAnswer,


category:category,


explanation:explanation,


createdAt:serverTimestamp()



}

);



message.innerHTML=

"✅ Question Added Successfully";


questionForm.reset();



}



catch(error){


message.innerHTML=

"❌ "+error.message;



}



}



);

}

// =====================================
// G THE GENIUS
// ADMIN JS
// PART 2 FINAL
// =====================================



// =====================================
// BULK UPLOAD
// =====================================


const bulkBtn =

document.getElementById("bulkUploadBtn");



if(bulkBtn){


bulkBtn.addEventListener(

"click",

async()=>{


const bulkText =

document.getElementById("bulkQuestions").value.trim();



if(!bulkText){


message.innerHTML=

"❌ Paste JSON Questions";


return;


}



try{



const questions =

JSON.parse(bulkText);



let count=0;



for(const item of questions){



await addDoc(

collection(db,"questions"),

{


question:item.question,


options:item.options,


correctAnswer:Number(item.correctAnswer),


category:item.category || "General Knowledge",


explanation:item.explanation || "",


createdAt:serverTimestamp()



}

);



count++;



}




message.innerHTML=

"✅ "+count+" Questions Uploaded Successfully";



document.getElementById(

"bulkQuestions"

).value="";



}



catch(error){


message.innerHTML=

"❌ Invalid JSON Format";


console.log(error);


}



}



);


}





// =====================================
// LOGOUT
// =====================================


if(logoutBtn){


logoutBtn.addEventListener(

"click",

async()=>{


await signOut(auth);


window.location.href="login.html";


}


);


}





console.log(

"G THE GENIUS ADMIN LOADED"

);
