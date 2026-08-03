/* ==========================================
   G THE GENIUS
   Leaderboard JavaScript
   Part 1

   Features:
   - Firebase Connect
   - Load Results
   - Sort Ranking
   - Prepare Top 3
========================================== */



/* ==========================================
   Firebase Imports
========================================== */


import {

    db

}

from "./firebase-config.js";



import {

    collection,

    getDocs,

    query,

    orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






/* ==========================================
   Variables
========================================== */


let leaderboardData = [];






/* ==========================================
   Load Results
========================================== */


async function loadLeaderboard(){


    try{


        const resultRef =
            collection(
                db,
                "results"
            );



        const q =
            query(
                resultRef,
                orderBy(
                    "marks",
                    "desc"
                )
            );



        const snapshot =
            await getDocs(q);




        leaderboardData = [];



        snapshot.forEach(
            (doc)=>{


            leaderboardData.push({

                id:doc.id,

                ...doc.data()

            });



        });





        console.log(
            "Leaderboard Loaded",
            leaderboardData
        );



        showTopThree();



    }


    catch(error){


        console.log(
            "Leaderboard Error:",
            error
        );


    }


}







/* ==========================================
   Top 3 Podium
========================================== */


function showTopThree(){


    const first =
        leaderboardData[0];


    const second =
        leaderboardData[1];


    const third =
        leaderboardData[2];




    if(first){


        document.getElementById(
            "firstName"
        ).textContent =
            first.name;



        document.getElementById(
            "firstMark"
        ).textContent =
            first.marks+" Marks";


    }




    if(second){


        document.getElementById(
            "secondName"
        ).textContent =
            second.name;



        document.getElementById(
            "secondMark"
        ).textContent =
            second.marks+" Marks";


    }





    if(third){


        document.getElementById(
            "thirdName"
        ).textContent =
            third.name;



        document.getElementById(
            "thirdMark"
        ).textContent =
            third.marks+" Marks";


    }


}





/* ==========================================
   Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    loadLeaderboard();


}

);

/* ==========================================
   G THE GENIUS
   Leaderboard JavaScript
   Part 2

   Features:
   - Generate Full Ranking List
   - Rank Cards
   - Student Details
========================================== */



/* ==========================================
   Leaderboard List Element
========================================== */


const leaderboardList =
    document.getElementById(
        "leaderboardList"
    );






/* ==========================================
   Display Rankings
========================================== */


function displayLeaderboard(){


    if(!leaderboardList)
        return;



    leaderboardList.innerHTML = "";





    leaderboardData.forEach(
        (student,index)=>{


        const rank =
            index + 1;



        const card =
            document.createElement(
                "div"
            );



        card.className =
            "rank-card";





        card.innerHTML = `


        <div class="rank-number">

            #${rank}

        </div>



        <div class="student-info">


            <h3>

            ${student.name || "Student"}

            </h3>



            <p>

            ${student.district || "Tamil Nadu"}

            • 

            ${student.testType || "Mock Test"}

            </p>


        </div>




        <div class="marks-box">


            <span>

            ${student.marks || 0}

            </span>


            <small>

            Marks

            </small>


        </div>



        `;




        leaderboardList.appendChild(
            card
        );



    });


}





/* ==========================================
   Update Top Three Function
========================================== */


const oldShowTopThree =
    showTopThree;



showTopThree = function(){


    oldShowTopThree();



    displayLeaderboard();


};

/* ==========================================
   G THE GENIUS
   Leaderboard JavaScript
   Part 3 Final

   Features:
   - Current Student Rank
   - District Rank
   - Auto Refresh
   - Final Error Handling
========================================== */



/* ==========================================
   Current Student Rank
========================================== */


function getCurrentStudentRank(){


    const currentName =
        localStorage.getItem(
            "studentName"
        );



    if(!currentName)
        return null;




    const index =
        leaderboardData.findIndex(
            student =>
            student.name === currentName
        );



    if(index !== -1){


        return index + 1;


    }



    return null;


}







/* ==========================================
   District Rank
========================================== */


function getDistrictRank(){


    const district =
        localStorage.getItem(
            "district"
        );



    if(!district)
        return [];




    return leaderboardData.filter(

        student =>

        student.district === district

    );


}






/* ==========================================
   Live Refresh
========================================== */


function refreshLeaderboard(){


    loadLeaderboard();


}






/* ==========================================
   Auto Update Every 60 Seconds
========================================== */


setInterval(

()=>{


    refreshLeaderboard();


},

60000

);







/* ==========================================
   Safe Error Display
========================================== */


window.addEventListener(

"error",

(event)=>{


    console.log(

        "Leaderboard Error:",
        event.message

    );


}

);

