// =====================================
// G THE GENIUS
// RESULT JS
// PART 1
// =====================================


import { auth, db } from "./firebase-config.js";


import {

doc,
getDoc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// =====================================
// GET RESULT DATA
// =====================================


const params =

new URLSearchParams(

window.location.search

);



const score =

Number(

params.get("score")

)||0;



const total =

Number(

params.get("total")

)||0;




const percentage =

total

?

Math.round(

(score / total) * 100

)

:

0;





// =====================================
// DOM
// =====================================


const scoreText =

document.getElementById("score");


const totalText =

document.getElementById("total");


const percentageText =

document.getElementById("percentage");


const correctText =

document.getElementById("correct");


const wrongText =

document.getElementById("wrong");





// DISPLAY RESULT


scoreText.innerHTML = score;


totalText.innerHTML = total;


percentageText.innerHTML =

percentage + "%";



correctText.innerHTML = score;


wrongText.innerHTML =

total - score;





// =====================================
// UPDATE STUDENT XP
// =====================================


onAuthStateChanged(auth,async(user)=>{


if(!user) return;



try{


const userRef =

doc(

db,

"students",

user.uid

);



const snap =

await getDoc(userRef);



if(snap.exists()){


const data = snap.data();



let oldXP =

data.xp || 0;



let earnedXP = score * 5;



await updateDoc(

userRef,

{


xp:

oldXP + earnedXP



}

);



const xpBox =

document.getElementById("earnedXP");



if(xpBox){


xpBox.innerHTML =

earnedXP;


}



}



}

catch(error){


console.log(

"XP Update Error",

error

);


}



});

// =====================================
// G THE GENIUS
// RESULT JS
// PART 2 FINAL
// =====================================



// =====================================
// PERFORMANCE MESSAGE
// =====================================


const resultText =

document.getElementById("resultText");



if(resultText){


if(percentage >= 90){


resultText.innerHTML =

"🏆 Excellent Performance!";


}


else if(percentage >= 70){


resultText.innerHTML =

"🔥 Great Job! Keep Going";


}


else if(percentage >= 50){


resultText.innerHTML =

"👍 Good Attempt. Practice More";


}


else{


resultText.innerHTML =

"📚 Need More Practice";


}



}





// =====================================
// UPDATE LEVEL
// =====================================


async function updateLevel(){


const user = auth.currentUser;



if(!user) return;



const userRef =

doc(

db,

"students",

user.uid

);



const snap =

await getDoc(userRef);



if(snap.exists()){


const data = snap.data();



const xp =

data.xp || 0;



const level =

Math.floor(xp / 100) + 1;



await updateDoc(

userRef,

{


level:level


}

);



}



}



onAuthStateChanged(auth,()=>{


updateLevel();


});





// =====================================
// PAGE READY
// =====================================


console.log(

"G THE GENIUS RESULT LOADED"

);
