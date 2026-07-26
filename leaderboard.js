import { db } from "./firebase-config.js";


import {

collection,
getDocs,
query,
orderBy

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const leaderList =
document.getElementById("leaderList");





async function loadLeaderboard(){


try{


const q = query(

collection(db,"results"),

orderBy("score","desc")

);



const snapshot =
await getDocs(q);



leaderList.innerHTML="";



let rank=1;



snapshot.forEach((doc)=>{


let data = doc.data();



leaderList.innerHTML += `


<div class="rank-card">


<h2>

${rank} 🏆

</h2>


<div>

<h3>
${data.studentName}
</h3>


<p>
📍 ${data.district}
</p>


<p>
📝 ${data.testType}
</p>


</div>



<div>

<h2>
${data.score}/${data.totalQuestions}
</h2>


<p>
${data.percentage}%
</p>


</div>



</div>


`;



rank++;


});



}

catch(error){

console.log(error);

leaderList.innerHTML =
"Error Loading Leaderboard";

}


}




loadLeaderboard();
