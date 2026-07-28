import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadDashboardStats(){


let studentName =
localStorage.getItem("studentName");



if(!studentName){
return;
}



const snapshot =
await getDocs(collection(db,"results"));



let totalTests = 0;

let bestScore = 0;

let totalPercentage = 0;

let rankList = [];



snapshot.forEach((doc)=>{


let data = doc.data();


rankList.push(data);



if(data.studentName === studentName){


totalTests++;


if(data.percentage > bestScore){

bestScore = data.percentage;

}


totalPercentage += data.percentage;


}


});




// Average

let average = 0;


if(totalTests > 0){

average =
Math.round(totalPercentage / totalTests);

}




// Rank Calculation


rankList.sort((a,b)=>{

return b.percentage - a.percentage;

});



let myRank = "-";


rankList.forEach((student,index)=>{


if(student.studentName === studentName){

myRank = index + 1;

}


});





document.getElementById("totalTests").innerHTML =
totalTests;



// Convert Percentage to Marks (20 Questions)

let bestMarks = Math.round((bestScore / 100) * 20);

let averageMarks = Math.round((average / 100) * 20);



document.getElementById("bestScore").innerHTML =
bestMarks + " / 20";


document.getElementById("averageScore").innerHTML =
averageMarks + " / 20";



document.getElementById("myRank").innerHTML =
"#"+myRank;



}



loadDashboardStats();
