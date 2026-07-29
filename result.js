// =========================
// G THE GENIUS RESULT JS
// PART 1
// =========================


import { db, auth } from "./firebase-config.js";


import {

collection,
query,
where,
orderBy,
limit,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// LOAD RESULT
// =========================


async function loadResult(){


const user =

auth.currentUser;



if(!user){

console.log(
"User Not Login"
);

return;

}





try{


const q = query(

collection(db,"results"),

where(
"studentId",
"==",
user.uid
),

orderBy(
"timestamp",
"desc"
),

limit(1)

);





const snap =

await getDocs(q);





snap.forEach(doc=>{


let data = doc.data();




displayResult(data);



});





}

catch(error){


console.log(
"Result Error",
error
);



}


}








// =========================
// DISPLAY RESULT
// =========================


function displayResult(data){



document.getElementById(
"score"
).innerHTML =

data.score;





document.getElementById(
"total"
).innerHTML =

data.total;





document.getElementById(
"percentage"
).innerHTML =

data.percentage+"%";






document.getElementById(
"testType"
).innerHTML =

data.testType;



document.getElementById(
"examName"
).innerHTML =

data.examType;





calculateAnalysis(data);





}







// =========================
// ANSWER ANALYSIS
// =========================


function calculateAnalysis(data){



let correct =

data.score;



let total =

data.total;



let wrong =

total - correct;



let skipped = 0;






document.getElementById(
"correctCount"
).innerHTML =

correct;





document.getElementById(
"wrongCount"
).innerHTML =

wrong;





document.getElementById(
"skipCount"
).innerHTML =

skipped;



}








// =========================
// PAGE LOAD
// =========================


auth.onAuthStateChanged(

(user)=>{


if(user){


loadResult();


}



});

// =========================
// RANK SYSTEM
// =========================


async function calculateRank(){


const rankQuery =

query(

collection(db,"results"),

orderBy(
"percentage",
"desc"
)

);




const snap =

await getDocs(rankQuery);



let rank = 1;


let districtRank = 1;



let currentUser =

auth.currentUser;



let myDistrict =

localStorage.getItem(
"district"
);





for(let doc of snap.docs){


let data = doc.data();





if(
data.studentId === currentUser.uid
){


document.getElementById(
"rank"
).innerHTML =

rank;



}

else{


rank++;


}





if(
data.district === myDistrict
){



if(
data.studentId === currentUser.uid
){


document.getElementById(
"districtRank"
).innerHTML =

districtRank;



}


districtRank++;


}



}



}








// =========================
// SHARE RESULT
// =========================


const shareBtn =

document.getElementById(
"shareResult"
);



if(shareBtn){



shareBtn.onclick = async()=>{



let text =


`🏆 G THE GENIUS MOCK TEST RESULT

🎯 Score : ${document.getElementById("score").innerHTML}/${document.getElementById("total").innerHTML}

📊 Percentage : ${document.getElementById("percentage").innerHTML}

🚀 Prepare More With G THE GENIUS`;






if(
navigator.share
){



await navigator.share({

title:
"G THE GENIUS Result",

text:text


});



}

else{


navigator.clipboard.writeText(
text
);



alert(
"Result Copied"
);



}



};



}








// =========================
// RETRY TEST
// =========================


const retryBtn =

document.getElementById(
"retryTest"
);



if(retryBtn){



retryBtn.onclick = ()=>{


window.location.href =
"dashboard.html";



};



}








// =========================
// PROFILE XP UPDATE
// =========================


function updateProfileXP(){



let xp =

Number(

localStorage.getItem(
"xp"

)

)||0;




let oldLevel =

Math.floor(
xp/100
)+1;




xp += 20;



localStorage.setItem(
"xp",
xp
);




let newLevel =

Math.floor(
xp/100
)+1;





if(
newLevel > oldLevel
){


localStorage.setItem(

"levelUp",

"true"

);



}




}







// =========================
// LOAD RANK AFTER RESULT
// =========================


const oldDisplayResult =

displayResult;



displayResult = function(data){



oldDisplayResult(data);



setTimeout(()=>{


calculateRank();


updateProfileXP();



},1000);



};






console.log(

"✅ G THE GENIUS RESULT READY"

);
