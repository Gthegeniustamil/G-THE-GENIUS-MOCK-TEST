import { db } from "./firebase-config.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


async function loadProfile(){


// Local Storage Data

const studentName = localStorage.getItem("studentName");
const email = localStorage.getItem("email");
const district = localStorage.getItem("district");



if(!studentName){

alert("Please Login First");

window.location.href="index.html";

return;

}



// Show Profile


document.getElementById("studentName").innerHTML =
studentName;


document.getElementById("email").innerHTML =
email || "-";


document.getElementById("district").innerHTML =
district || "-";





// Load Test Results


try{


const resultSnapshot = await getDocs(

query(

collection(db,"results"),

where("studentName","==",studentName)

)

);



let totalTests = 0;

let bestScore = 0;



resultSnapshot.forEach((doc)=>{


const data = doc.data();


totalTests++;



const percentage = data.percentage || 0;



if(percentage > bestScore){

bestScore = percentage;

}



});





// Convert Percentage to Marks

let bestMarks =
Math.round((bestScore / 100) * 20);





// Display Data


document.getElementById("totalTests").innerHTML =
totalTests;



document.getElementById("bestScore").innerHTML =
bestMarks + " / 20";





}


catch(error){


console.log(error);


alert("Failed to load profile.");


}



}



loadProfile();
