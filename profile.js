import { db, auth } from "./firebase-config.js";


import {

doc,

getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// LEVEL CALCULATION
// =========================


function calculateLevel(xp){


return Math.floor(xp / 100) + 1;


}





// =========================
// LOAD PROFILE DATA
// =========================


async function loadProfile(){


try{


const user =
auth.currentUser;



if(!user){

return;

}



const userRef =
doc(
db,
"students",
user.uid
);



const snap =
await getDoc(userRef);



if(!snap.exists()){

return;

}



const data =
snap.data();





// NAME


const name =
document.getElementById(
"studentName"
);


if(name){

name.innerHTML =
data.name || "Student";

}





// EXAM GOAL


const exam =
document.getElementById(
"examGoal"
);


if(exam){

exam.innerHTML =
data.examGoal || "TNUSRB";

}






// DISTRICT


const district =
document.getElementById(
"district"
);



if(district){

district.innerHTML =
data.district || "-";

}






// XP


let xp =
data.xp || 0;



let level =
calculateLevel(xp);





document.getElementById(
"xp"
).innerHTML =
xp;




document.getElementById(
"level"
).innerHTML =
level;






let nextXP =
level * 100;



document.getElementById(
"nextXP"
).innerHTML =
nextXP;






// XP BAR


let percent =
(xp / nextXP) * 100;



const bar =
document.getElementById(
"xpProgress"
);



if(bar){


bar.style.width =
percent + "%";


}



}


catch(error){


console.log(
"Profile Load Error",
error
);


}



}





// =========================
// START
// =========================


auth.onAuthStateChanged(
(user)=>{


if(user){


loadProfile();


}



});

// =========================
// LOAD BADGES
// =========================


function loadBadges(){


let badges =

JSON.parse(

localStorage.getItem("badges")

) || [];



const gallery =

document.getElementById(
"badgeGallery"
);



if(!gallery) return;



gallery.innerHTML="";



if(badges.length===0){


gallery.innerHTML =

`

<p>
🏅 No Badges Earned Yet
</p>

`;


return;


}



badges.forEach((badge)=>{


gallery.innerHTML +=


`

<div class="badge-item">


🏅


<p>

${badge}

</p>


</div>


`;


});



}





// =========================
// LOAD PERFORMANCE
// =========================


function loadPerformance(){


let practice =

localStorage.getItem(
"totalPractice"
) || 0;



let accuracy =

localStorage.getItem(
"accuracy"
) || 0;



let tests =

localStorage.getItem(
"mockTests"
) || 0;





const practiceBox =

document.getElementById(
"totalPractice"
);



const accuracyBox =

document.getElementById(
"accuracy"
);



const testBox =

document.getElementById(
"mockTests"
);





if(practiceBox)

practiceBox.innerHTML =
practice;



if(accuracyBox)

accuracyBox.innerHTML =
accuracy+"%";



if(testBox)

testBox.innerHTML =
tests;



}







// =========================
// PRACTICE HISTORY
// =========================


function loadPracticeHistory(){


const history =

JSON.parse(

localStorage.getItem(
"practiceHistory"
)

) || [];



const box =

document.getElementById(
"practiceHistory"
);



if(!box) return;



box.innerHTML="";



if(history.length===0){


box.innerHTML =

`
<p>
No Practice History
</p>
`;

return;

}



history.slice(0,10).forEach((item)=>{


box.innerHTML +=


`

<div class="history-card">


<h3>

📚 ${item.subject}

</h3>


<p>

📂 ${item.topic}

</p>


<p>

Score:
${item.score || 0}

</p>



</div>


`;


});



}





// =========================
// TEST HISTORY
// =========================


function loadTestHistory(){


const history =

JSON.parse(

localStorage.getItem(
"testHistory"
)

) || [];



const box =

document.getElementById(
"testHistory"
);



if(!box) return;



box.innerHTML="";



if(history.length===0){


box.innerHTML =

`
<p>
No Tests Taken
</p>

`;

return;

}



history.slice(0,10).forEach((test)=>{


box.innerHTML +=


`

<div class="history-card">


<h3>

📝 ${test.type}

</h3>


<p>

Score:
${test.score}/${test.total}

</p>


<p>

Percentage:
${test.percentage}%

</p>


</div>

`;



});


}







// =========================
// INITIAL LOAD
// =========================


document.addEventListener(

"DOMContentLoaded",

()=>{


loadBadges();


loadPerformance();


loadPracticeHistory();


loadTestHistory();


}

);

// =========================
// LOGOUT SYSTEM
// =========================


const logoutBtn =

document.getElementById(
"logoutBtn"
);



if(logoutBtn){


logoutBtn.onclick = async function(){


try{


await auth.signOut();



alert(
"Logout Successfully"
);



location.href =
"login.html";



}

catch(error){


console.log(
"Logout Error",
error
);


}


};


}





// =========================
// LOGIN SECURITY CHECK
// =========================


auth.onAuthStateChanged(

(user)=>{


if(!user){


location.href =
"login.html";


}


}

);







// =========================
// AUTO REFRESH PROFILE
// =========================


setInterval(()=>{


if(auth.currentUser){


loadProfile();


loadPerformance();


loadBadges();


}


},30000);







// =========================
// BOTTOM NAV ACTIVE
// =========================


const navItems =

document.querySelectorAll(
".bottom-nav a"
);



navItems.forEach(item=>{


item.addEventListener(
"click",
function(){


navItems.forEach(nav=>{


nav.classList.remove(
"active"
);


});



this.classList.add(
"active"
);



});


});







// =========================
// PROFILE READY
// =========================


console.log(
"✅ G THE GENIUS PROFILE READY"
);

