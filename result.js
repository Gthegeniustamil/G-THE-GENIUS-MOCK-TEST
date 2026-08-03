/* ==========================================
   G THE GENIUS
   Result JavaScript
   Part 1

   Features:
   - Firebase Connect
   - Load Latest Result
   - Student Data
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

    where,

    orderBy,

    limit

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







/* ==========================================
   Variables
========================================== */


let resultData = null;

let allResults = [];







/* ==========================================
   Student Details
========================================== */


function getStudentInfo(){


    return {


        name:

        localStorage.getItem(
            "studentName"
        )
        ||
        "Student",




        district:

        localStorage.getItem(
            "district"
        )
        ||
        "Tamil Nadu"



    };


}







/* ==========================================
   Load Latest Result
========================================== */


async function loadResult(){


    try{


        const student =
            getStudentInfo();




        const resultRef =
            collection(
                db,
                "results"
            );




        const q =
            query(

                resultRef,

                where(
                    "name",
                    "==",
                    student.name
                ),

                orderBy(
                    "createdAt",
                    "desc"
                ),

                limit(1)

            );





        const snapshot =
            await getDocs(q);





        snapshot.forEach(
            (doc)=>{


            resultData = {

                id:doc.id,

                ...doc.data()

            };


        });





        if(resultData){


            showBasicResult();


        }



    }


    catch(error){


        console.log(
            "Result Load Error:",
            error
        );


    }


}







/* ==========================================
   Display Basic Result
========================================== */


function showBasicResult(){


    document.getElementById(
        "studentName"
    ).textContent =
        resultData.name;




    document.getElementById(
        "testName"
    ).textContent =
        resultData.testName;




    document.getElementById(
        "marks"
    ).textContent =
        resultData.marks;



}







/* ==========================================
   Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    loadResult();


}

);

/* ==========================================
   G THE GENIUS
   Result JavaScript
   Part 2

   Features:
   - Answer Summary
   - Overall Rank
   - District Rank
========================================== */



/* ==========================================
   Load All Results
========================================== */


async function loadAllResults(){


    try{


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "results"
                )
            );



        allResults = [];



        snapshot.forEach(
            (doc)=>{


            allResults.push({

                id:doc.id,

                ...doc.data()

            });



        });




        calculateRanks();


    }


    catch(error){


        console.log(
            "All Results Error:",
            error
        );


    }


}







/* ==========================================
   Show Answer Summary
========================================== */


function showAnswerSummary(){


    if(!resultData)
        return;



    document.getElementById(
        "correctCount"
    ).textContent =
        resultData.correct || 0;




    document.getElementById(
        "wrongCount"
    ).textContent =
        resultData.wrong || 0;




    document.getElementById(
        "skippedCount"
    ).textContent =
        resultData.skipped || 0;


}







/* ==========================================
   Calculate Rank
========================================== */


function calculateRanks(){


    if(!resultData)
        return;



    let sorted =

    [...allResults].sort(

        (a,b)=>

        b.marks - a.marks

    );





    const overallIndex =

    sorted.findIndex(

        item=>

        item.id === resultData.id

    );





    document.getElementById(
        "overallRank"
    ).textContent =


    overallIndex >= 0

    ?

    "#"+(overallIndex+1)

    :

    "N/A";







    const districtResults =

    sorted.filter(

        item =>

        item.district === resultData.district

    );






    const districtIndex =

    districtResults.findIndex(

        item =>

        item.id === resultData.id

    );





    document.getElementById(
        "districtRank"
    ).textContent =


    districtIndex >= 0

    ?

    "#"+(districtIndex+1)

    :

    "N/A";



}







/* ==========================================
   Connect Functions
========================================== */


const oldShowBasicResult =
    showBasicResult;



showBasicResult = function(){


    oldShowBasicResult();



    showAnswerSummary();



    loadAllResults();



};

/* ==========================================
   G THE GENIUS
   Result JavaScript
   Part 3 Final

   Features:
   - Share Result
   - Test History
   - Retry Handling
   - Final UI Connection
========================================== */



/* ==========================================
   Share Result
========================================== */


const shareBtn =
    document.getElementById(
        "shareBtn"
    );




if(shareBtn){


shareBtn.onclick = async ()=>{


    if(!resultData)
        return;



    const shareText = `

🏆 G THE GENIUS Result

👤 Name: ${resultData.name}

📝 Test: ${resultData.testName}

⭐ Marks: ${resultData.marks}

✅ Correct: ${resultData.correct}

❌ Wrong: ${resultData.wrong}

🔥 Keep Learning!

`;



    if(
        navigator.share
    ){


        await navigator.share({

            title:
            "G THE GENIUS Result",

            text:
            shareText

        });


    }

    else{


        navigator.clipboard.writeText(
            shareText
        );


        alert(
            "Result copied!"
        );


    }



};


}







/* ==========================================
   Load History
========================================== */


async function loadHistory(){


    try{


        const student =
            getStudentInfo();




        const q =
            query(

                collection(
                    db,
                    "results"
                ),


                where(
                    "name",
                    "==",
                    student.name
                ),


                orderBy(
                    "createdAt",
                    "desc"
                )

            );





        const snapshot =
            await getDocs(q);





        const historyList =
            document.getElementById(
                "historyList"
            );





        if(!historyList)
            return;





        historyList.innerHTML="";





        snapshot.forEach(
            (doc)=>{


            const data =
                doc.data();




            historyList.innerHTML += `


            <div class="history-item">


            <strong>

            ${data.testName || "Mock Test"}

            </strong>



            <span>

            ${data.marks} Marks

            </span>


            </div>


            `;



        });



    }


    catch(error){


        console.log(
            "History Error:",
            error
        );


    }


}







/* ==========================================
   Final Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    loadResult();


    loadHistory();


}

);
