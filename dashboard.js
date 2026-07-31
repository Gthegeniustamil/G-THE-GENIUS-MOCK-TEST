// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// DASHBOARD JS
// PART 1 / 2
// ==========================================



// Firebase Config

import {

auth,
db

} from "./firebase-config.js";







// Firebase Functions

import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";









// HTML Elements


const studentName =
document.getElementById("studentName");


const studentDistrict =
document.getElementById("studentDistrict");


const testCount =
document.getElementById("testCount");


const studentRank =
document.getElementById("studentRank");


const totalMarks =
document.getElementById("totalMarks");


const completedTests =
document.getElementById("completedTests");









// Check Login Status


onAuthStateChanged(auth, async(user)=>{



if(!user){


window.location.href="login.html";


return;


}






try{



// Get Student Document


const studentRef = doc(

db,

"students",

user.uid

);



const studentSnap =

await getDoc(studentRef);








if(studentSnap.exists()){



const data = studentSnap.data();







// Display Student Details



if(studentName){

studentName.innerHTML =

data.name || "Student";

}





if(studentDistrict){

studentDistrict.innerHTML =

data.district || "-";

}








if(totalMarks){

totalMarks.innerHTML =

data.totalMarks || 0;

}



if(studentRank){

studentRank.innerHTML =

data.rank || "-";

}



if(completedTests){

completedTests.innerHTML =

data.testsCompleted || 0;

}





}






}



catch(error){


console.log(

"Dashboard Data Error",

error

);


}



});

// ==========================================
// DASHBOARD JS
// PART 2 / 2
// FINAL
// ==========================================






// LOGOUT SYSTEM


const logoutBtn = document.getElementById("logoutBtn");



if(logoutBtn){


logoutBtn.addEventListener("click", async()=>{



try{



await signOut(auth);



// Clear Local Storage


localStorage.removeItem("student");





window.location.href="login.html";





}

catch(error){


console.log(

"Logout Error",

error

);


}



});



}









// SAVE LAST VISIT


localStorage.setItem(

"lastPage",

"dashboard"

);







// BUTTON PROTECTION


document.querySelectorAll("a")

.forEach(link=>{


link.addEventListener("click",()=>{


console.log(

"Opening:",

link.href

);


});


});






console.log(

"G THE GENIUS Dashboard Loaded Successfully"

);
const quotes = [

"வெற்றி ஒரே நாளில் கிடைக்காது... தினமும் முயற்சி செய்தால் நிச்சயம் கிடைக்கும்.",

"இன்று படிக்கும் ஒவ்வொரு பக்கமும் நாளைய வெற்றிக்கான படிக்கட்டு.",

"கனவு அரசு வேலை என்றால் முயற்சி தினமும் தொடர வேண்டும்.",

"முயற்சி செய்பவர்களுக்கு வெற்றி நிச்சயம்.",

"நேரத்தை சரியாக பயன்படுத்துபவன் வாழ்க்கையில் உயர்வான்."

];


const quote = quotes[
Math.floor(Math.random()*quotes.length)
];


document.getElementById("dailyQuote").innerText = quote;
