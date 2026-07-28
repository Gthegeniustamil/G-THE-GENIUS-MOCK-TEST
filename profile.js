import { db, auth } from "./firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


onAuthStateChanged(auth, async (user)=>{


if(user){


const uid = user.uid;


// Student Details

const studentRef = doc(db,"students",uid);

const studentSnap = await getDoc(studentRef);


let studentData;


if(studentSnap.exists()){

studentData = studentSnap.data();


document.getElementById("name").innerHTML =
studentData.name;


document.getElementById("email").innerHTML =
studentData.email;


document.getElementById("district").innerHTML =
studentData.district;

}



// Results Load

const snapshot =
await getDocs(collection(db,"results"));


let allResults = [];

let total = 0;

let best = 0;



snapshot.forEach((doc)=>{

let data = doc.data();

allResults.push(data);



if(data.studentName === studentData.name){

total++;


if(data.percentage > best){

best = data.percentage;

}

}


});



// Best Score

document.getElementById("totalTests").innerHTML =
total;


document.getElementById("bestScore").innerHTML =
best + "%";




// Overall Rank

allResults.sort((a,b)=>{

return b.percentage - a.percentage;

});


let overallRank = 1;


for(let i=0;i<allResults.length;i++){


if(allResults[i].studentName === studentData.name){

break;

}


overallRank++;

}



document.getElementById("overallRank").innerHTML =
overallRank;




// District Rank

let districtResults =
allResults.filter((student)=>{

return student.district === studentData.district;

});


districtResults.sort((a,b)=>{

return b.percentage - a.percentage;

});


let districtRank = 1;


for(let i=0;i<districtResults.length;i++){


if(districtResults[i].studentName === studentData.name){

break;

}


districtRank++;


}



document.getElementById("districtRank").innerHTML =
districtRank;



}
else{


window.location.href="index.html";


}



});
