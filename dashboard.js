import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Student Details

document.getElementById("welcomeName").innerHTML =
"👤 Welcome " + (localStorage.getItem("studentName") || "Student");


document.getElementById("welcomeDistrict").innerHTML =
"📍 " + (localStorage.getItem("district") || "");


document.getElementById("welcomeExam").innerHTML =
"🎯 " + (localStorage.getItem("exam") || "");




async function loadMyRank(){


let name = localStorage.getItem("studentName");

let district = localStorage.getItem("district");



const snapshot = await getDocs(
collection(db,"results")
);



let students=[];


snapshot.forEach((doc)=>{

students.push(doc.data());

});



students.sort((a,b)=>{

return b.percentage - a.percentage;

});



let overallRank = 0;


students.forEach((student,index)=>{

if(student.studentName === name){

overallRank = index + 1;

}

});



let districtStudents =
students.filter((student)=>{

return student.district === district;

});


let districtRank = 0;


districtStudents.forEach((student,index)=>{


if(student.studentName === name){

districtRank = index + 1;

}


});



let myResult =
students.find((student)=>{

return student.studentName === name;

});



if(myResult){


document.getElementById("myScore").innerHTML =
"📝 Score : " +
myResult.score +
"/" +
myResult.totalQuestions;



document.getElementById("myRank").innerHTML =
"🌍 Overall Rank : " + overallRank;



document.getElementById("districtRank").innerHTML =
"📍 District Rank : " + districtRank;


}


}


loadMyRank();

function openMaterials(){

    window.location.href="materials.html";

}
