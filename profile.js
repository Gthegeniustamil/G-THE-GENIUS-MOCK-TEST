/* ==========================================
   G THE GENIUS
   Profile JavaScript
   Part 1

   Features:
   - Firebase Connect
   - Load Student Details
   - Display Profile
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

    where

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







/* ==========================================
   Student Data
========================================== */


let studentData = {

    name:"Student",

    district:"Tamil Nadu"

};







/* ==========================================
   Get Local Student Info
========================================== */


function getStudentInfo(){


    studentData.name =

    localStorage.getItem(
        "studentName"
    )
    ||
    "Student";




    studentData.district =

    localStorage.getItem(
        "district"
    )
    ||
    "Tamil Nadu";



    showProfile();



}







/* ==========================================
   Show Profile
========================================== */


function showProfile(){


    const name =
        document.getElementById(
            "studentName"
        );



    const district =
        document.getElementById(
            "studentDistrict"
        );




    if(name){

        name.textContent =
            studentData.name;

    }




    if(district){

        district.textContent =
            studentData.district;

    }


}







/* ==========================================
   Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    getStudentInfo();


}

);

/* ==========================================
   G THE GENIUS
   Profile JavaScript
   Part 2

   Features:
   - Load Test Results
   - Total Tests
   - Total Marks
   - Best Score
   - History Display
========================================== */



/* ==========================================
   Load Student Results
========================================== */


let studentResults = [];





async function loadProfileResults(){


    try{


        const snapshot =

        await getDocs(

            collection(
                db,
                "results"
            )

        );





        studentResults = [];




        snapshot.forEach(
            (doc)=>{


            const data =
                doc.data();



            if(

                data.name ===
                studentData.name

            ){


                studentResults.push({

                    id:doc.id,

                    ...data

                });


            }



        });





        calculatePerformance();


        displayHistory();



    }


    catch(error){


        console.log(
            "Profile Result Error:",
            error
        );


    }


}







/* ==========================================
   Calculate Performance
========================================== */


function calculatePerformance(){



    let totalTests =
        studentResults.length;




    let totalMarks = 0;



    let bestScore = 0;





    studentResults.forEach(

        result=>{


        totalMarks +=

        Number(
            result.marks || 0
        );



        if(

            result.marks >

            bestScore

        ){

            bestScore =
                result.marks;

        }



    });







    document.getElementById(
        "totalTests"
    ).textContent =

    totalTests;






    document.getElementById(
        "totalMarks"
    ).textContent =

    totalMarks;






    document.getElementById(
        "bestScore"
    ).textContent =

    bestScore;



}







/* ==========================================
   Display History
========================================== */


function displayHistory(){


    const history =

    document.getElementById(
        "profileHistory"
    );



    if(!history)
        return;




    history.innerHTML = "";




    studentResults.forEach(

        result=>{



        history.innerHTML += `


        <div class="history-card">


            <strong>

            ${result.testName || "Mock Test"}

            </strong>



            <span>

            ${result.marks || 0} Marks

            </span>



        </div>


        `;



    });


}







/* ==========================================
   Connect After Profile Load
========================================== */


const oldGetStudentInfo =
    getStudentInfo;



getStudentInfo = function(){


    oldGetStudentInfo();



    loadProfileResults();


};

/* ==========================================
   G THE GENIUS
   Profile JavaScript
   Part 3 Final

   Features:
   - Rank Calculation
   - Edit Profile
   - Logout
   - Final Connection
========================================== */



/* ==========================================
   Calculate Rank
========================================== */


async function calculateProfileRank(){


    try{


        const snapshot =

        await getDocs(

            collection(
                db,
                "results"
            )

        );




        let allData = [];




        snapshot.forEach(
            (doc)=>{


            allData.push({

                id:doc.id,

                ...doc.data()

            });



        });





        allData.sort(

            (a,b)=>

            b.marks - a.marks

        );





        const overallIndex =

        allData.findIndex(

            item =>

            item.name ===
            studentData.name

        );





        const overallRank =

        document.getElementById(
            "overallRank"
        );



        if(overallRank){


            overallRank.textContent =

            overallIndex >= 0

            ?

            "#"+(overallIndex+1)

            :

            "N/A";


        }






        const districtData =

        allData.filter(

            item =>

            item.district ===
            studentData.district

        );





        const districtIndex =

        districtData.findIndex(

            item =>

            item.name ===
            studentData.name

        );






        const districtRank =

        document.getElementById(
            "districtRank"
        );



        if(districtRank){


            districtRank.textContent =

            districtIndex >=0

            ?

            "#"+(districtIndex+1)

            :

            "N/A";


        }




    }


    catch(error){


        console.log(
            "Rank Error:",
            error
        );


    }


}







/* ==========================================
   Edit Profile
========================================== */


const editProfileBtn =

document.getElementById(
    "editProfileBtn"
);




if(editProfileBtn){


editProfileBtn.onclick = ()=>{


    const newName =

    prompt(

        "Enter Student Name",

        studentData.name

    );



    if(newName){


        localStorage.setItem(

            "studentName",

            newName

        );



        location.reload();


    }


};


}







/* ==========================================
   Logout
========================================== */


const logoutBtn =

document.getElementById(
    "logoutBtn"
);




if(logoutBtn){


logoutBtn.onclick = ()=>{


    localStorage.clear();



    location.href =
        "login.html";


};


}







/* ==========================================
   Final Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    calculateProfileRank();


}

);
