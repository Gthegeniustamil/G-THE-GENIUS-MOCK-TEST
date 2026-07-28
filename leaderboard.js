import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadLeaderboard(){


const leaderList =
document.getElementById("leaderList");


leaderList.innerHTML = "Loading...";



const snapshot =
await getDocs(collection(db,"results"));



let students = [];



snapshot.forEach((doc)=>{

let data = doc.data();

students.push(data);

});



// Score high to low sort

students = students.filter(student => student.testType === currentType);

students.sort((a,b)=>{
    return b.percentage - a.percentage;
});



leaderList.innerHTML = "";



let rank = 1;



students.forEach((student)=>{


leaderList.innerHTML += `

<div class="leader-card">


<h2>

${rank <= 3 
? ["🥇","🥈","🥉"][rank-1]
: "🏅"
}

Rank ${rank}

</h2>


<h3>
👤 ${student.studentName}
</h3>


<p>
📍 ${student.district}
</p>


<p>
🎯 Test : ${student.testType}
</p>


<p>
📝 Score : ${student.score}/${student.totalQuestions}
</p>


<p>
📈 ${student.percentage}%

</p>


</div>


`;


rank++;


});


}



loadLeaderboard();
