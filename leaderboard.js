
// ==========================================
// G THE GENIUS MOCK TEST PORTAL v5.0
// LEADERBOARD JS
// PART 1 / 5
// ==========================================



import { db } from "./firebase-config.js";



import {

collection,

getDocs,

query,

orderBy

} from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// ELEMENTS



const leaderboardBody =

document.getElementById(
"leaderboardBody"
);





const testFilter =

document.getElementById(
"testFilter"
);







let results = [];







// ==========================================
// LOAD RESULTS
// ==========================================



async function loadLeaderboard(){



try{



let q =

query(

collection(
db,
"results"
),


orderBy(
"percentage",
"desc"
)

);







let snapshot =

await getDocs(q);






results = [];






snapshot.forEach(doc=>{


results.push({

id:doc.id,

...doc.data()

});


});






console.log(

"Leaderboard Loaded:",

results.length

);






displayLeaderboard(results);




}

catch(error){



console.error(

"Leaderboard Error",

error

);


}



}
// ==========================================
// LOAD TAMIL NADU DISTRICTS
// ==========================================


const tamilNaduDistricts = [

"Ariyalur",
"Chengalpattu",
"Chennai",
"Coimbatore",
"Cuddalore",
"Dharmapuri",
"Dindigul",
"Erode",
"Kallakurichi",
"Kancheepuram",
"Kanniyakumari",
"Karur",
"Krishnagiri",
"Madurai",
"Mayiladuthurai",
"Nagapattinam",
"Namakkal",
"Perambalur",
"Pudukkottai",
"Ramanathapuram",
"Ranipet",
"Salem",
"Sivaganga",
"Tenkasi",
"Thanjavur",
"Theni",
"Thoothukudi",
"Tiruchirappalli",
"Tirunelveli",
"Tirupathur",
"Tiruppur",
"Tiruvallur",
"Tiruvannamalai",
"Tiruvarur",
"Vellore",
"Viluppuram",
"Virudhunagar"

];





const districtFilter =
document.getElementById(
"districtFilter"
);





if(districtFilter){


tamilNaduDistricts.forEach(
(district)=>{


let option =
document.createElement("option");


option.value =
district;


option.textContent =
district;



districtFilter.appendChild(option);



});


}
// ==========================================
// DISPLAY LEADERBOARD TABLE
// PART 2 / 5
// ==========================================



function displayLeaderboard(data){



if(!leaderboardBody)

return;






leaderboardBody.innerHTML = "";







data.forEach((student,index)=>{





let row =

document.createElement("tr");






row.innerHTML = `


<td>

${index + 1}

</td>



<td>

${student.studentName || "-"}

</td>



<td>

${student.district || "-"}

</td>



<td>

${student.testType || "-"}

</td>



<td>

${student.score || 0}

</td>



<td>

${student.percentage || 0}%

</td>



`;







leaderboardBody.appendChild(row);





});



}

// ==========================================
// FILTER SYSTEM
// PART 3 / 5
// ==========================================



const districtFilter =

document.getElementById(
"districtFilter"
);






function applyFilters(){



let filtered = [...results];







// TEST TYPE FILTER


if(
testFilter &&
testFilter.value !== ""

){



filtered =

filtered.filter(

(item)=>

item.testType ===
testFilter.value


);



}








// DISTRICT FILTER


if(

districtFilter &&

districtFilter.value !== ""

){



filtered =

filtered.filter(

(item)=>

item.district ===

districtFilter.value


);



}







displayLeaderboard(filtered);



}








// TEST FILTER CHANGE


if(testFilter){


testFilter.addEventListener(

"change",

applyFilters

);



}








// DISTRICT FILTER CHANGE


if(districtFilter){


districtFilter.addEventListener(

"change",

applyFilters

);



}


// ==========================================
// TOP 3 + CURRENT STUDENT RANK
// PART 4 / 5
// ==========================================





function highlightTopRank(){



const rows =

document.querySelectorAll(

"#leaderboardBody tr"

);






rows.forEach((row,index)=>{



if(index === 0){


row.classList.add(
"rank-gold"
);


}



else if(index === 1){


row.classList.add(
"rank-silver"
);


}




else if(index === 2){


row.classList.add(
"rank-bronze"
);


}



});



}







// ==========================================
// CURRENT USER RANK
// ==========================================



function showMyRank(){



let myName =

localStorage.getItem(
"studentName"
);





let myRank =

results.findIndex(

(student)=>

student.studentName === myName

)

+1;







const myRankBox =

document.getElementById(
"myRank"
);






if(myRankBox){


myRankBox.innerText =

myRank > 0

?

"🏆 Rank : " + myRank

:

"Rank Not Found";


}



}







// UPDATE DISPLAY


const oldDisplay =
displayLeaderboard;



displayLeaderboard = function(data){


oldDisplay(data);


highlightTopRank();


showMyRank();


};


// ==========================================
// FINAL LEADERBOARD INITIALIZATION
// PART 5 / 5 FINAL
// ==========================================





// ==========================================
// LOAD ON PAGE OPEN
// ==========================================


window.addEventListener(

"load",

()=>{


loadLeaderboard();



}

);







// ==========================================
// EXPORT FOR OTHER FILES
// ==========================================


window.loadLeaderboard =

loadLeaderboard;






console.log(

`
================================

G THE GENIUS LEADERBOARD READY ✅

Rank System
District Filter
Test Filter

================================
`

);

