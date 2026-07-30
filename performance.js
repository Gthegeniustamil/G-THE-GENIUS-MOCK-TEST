// =========================
// G THE GENIUS PERFORMANCE JS
// PART 1
// =========================


import { auth, db } from "./firebase-config.js";


import {

collection,
query,
where,
getDocs,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// AUTH CHECK
// =========================


auth.onAuthStateChanged(async(user)=>{


    if(!user){

        window.location.href="login.html";

        return;

    }


    await loadPerformance();


});






// =========================
// LOAD PERFORMANCE
// =========================


async function loadPerformance(){


try{


const user = auth.currentUser;



document.getElementById("studentName").innerHTML =

localStorage.getItem("studentName") || "Student";



document.getElementById("studentDistrict").innerHTML =

localStorage.getItem("district") || "-";



document.getElementById("studentExam").innerHTML =

localStorage.getItem("examGoal") || "TNUSRB";


const q = query(
collection(db,"results"),
where(
"studentId",
"==",
user.uid
)
);


const snap = await getDocs(q);



if(snap.empty){


document.getElementById("recentTests").innerHTML =

"<p class='loading'>No Performance Data Found</p>";


return;


}



let totalTests = 0;

let totalMarks = 0;

let bestScore = 0;


let daily = 0;

let weekly = 0;

let monthly = 0;


let recentData = [];

  
// =========================
// READ RESULT DATA
// PART 2
// =========================


snap.forEach(doc=>{


    const data = doc.data();



    totalTests++;



    let score =
    Number(data.score) || 0;



    totalMarks += score;



    if(score > bestScore){

        bestScore = score;

    }




    // Test Type Count

    if(data.testType === "daily"){

        daily++;

    }


    else if(data.testType === "weekly"){

        weekly++;

    }


    else if(data.testType === "monthly"){

        monthly++;

    }





    recentData.push(data);



});





// =========================
// SUMMARY UPDATE
// =========================


document.getElementById("totalTests").innerHTML =
totalTests;



document.getElementById("totalMarks").innerHTML =
totalMarks;



document.getElementById("bestScore").innerHTML =
bestScore;




document.getElementById("dailyCount").innerHTML =
daily;



document.getElementById("weeklyCount").innerHTML =
weekly;



document.getElementById("monthlyCount").innerHTML =
monthly;



// Recent 5 Tests

recentData =
recentData.slice(0,5);


displayRecentTests(recentData);

  // =========================
// DISPLAY RECENT TESTS
// PART 3
// =========================


function displayRecentTests(dataList){


    const box =
    document.getElementById("recentTests");



    box.innerHTML = "";



    dataList.forEach(data=>{


        let type = "Mock Test";



        if(data.testType === "daily"){

            type = "🟢 Daily Mock Test";

        }

        else if(data.testType === "weekly"){

            type = "🟡 Weekly Mock Test";

        }

        else if(data.testType === "monthly"){

            type = "🔴 Monthly Grand Test";

        }





        let date = "-";



        if(data.timestamp && data.timestamp.toDate){

date =
data.timestamp.toDate()
.toLocaleDateString();

}
else{

date = "Recent Test";

}





        const card =
        document.createElement("div");



        card.className =
        "performance-item";



        card.innerHTML = `


        <h3>
        ${type}
        </h3>


        <p>
        📅 Date : ${date}
        </p>


        <p>
        🎯 Score : ${data.score || 0}/${data.total || 0}
        </p>


        <p>
        ✅ Correct : ${data.correct || 0}
        </p>


        <p>
        ❌ Wrong : ${data.wrong || 0}
        </p>


        <p>
        ⏭ Skipped : ${data.skipped || 0}
        </p>


        `;



        box.appendChild(card);



    });



}

 // =========================
// ERROR HANDLING
// PART 4
// =========================


}

catch(error){


    console.error(
        "Performance Error:",
        error
    );


    alert(
        "Performance Loading Failed"
    );


}


}



// =========================
// PAGE READY
// =========================


console.log(
"✅ G THE GENIUS PERFORMANCE READY"
);
