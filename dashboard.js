/* ==========================================
   G THE GENIUS
   Mock Test JavaScript
   Part 1

   Features:
   - Read Test Type
   - Daily / Weekly / Monthly Settings
   - Load Questions
   - Random Question Setup
========================================== */


/* ==========================================
   Get Test Type From URL
========================================== */


const urlParams =
    new URLSearchParams(
        window.location.search
    );


const testType =
    urlParams.get("type") || "daily";





/* ==========================================
   Test Configuration
========================================== */


const testSettings = {


    daily: {

        title:"🟢 Daily Mock Test",

        questions:25,

        time:5 * 60

    },


    weekly: {

        title:"🟡 Weekly Mock Test",

        questions:50,

        time:10 * 60

    },


    monthly: {

        title:"🔴 Monthly Grand Test",

        questions:100,

        time:30 * 60

    }


};





let currentTest = 
    testSettings[testType];



let allQuestions = [];

let testQuestions = [];

let currentQuestion = 0;

let selectedAnswers = [];

let timer;

let timeLeft = currentTest.time;





/* ==========================================
   Load Questions
========================================== */


async function loadQuestions(){


    try{


        const response =
            await fetch(
                "questions/questions.json"
            );



        allQuestions =
            await response.json();



        prepareTest();



    }

    catch(error){


        console.log(
            "Question Loading Error",
            error
        );


    }


}





/* ==========================================
   Prepare Random Test
========================================== */


function prepareTest(){


    allQuestions.sort(
        ()=>Math.random()-0.5
    );



    testQuestions =
        allQuestions.slice(
            0,
            currentTest.questions
        );



    selectedAnswers =
        new Array(
            testQuestions.length
        )
        .fill(null);



    console.log(
        currentTest.title,
        testQuestions.length,
        "Questions Loaded"
    );


}





/* ==========================================
   Page Load
========================================== */


window.addEventListener(
    "DOMContentLoaded",
    ()=>{


        loadQuestions();


    }
);/* ==========================================
   G THE GENIUS
   Mock Test JavaScript
   Part 2

   Features:
   - Display Question
   - Option Selection
   - Next / Previous
   - Progress Update
   - Timer
========================================== */



/* ==========================================
   Elements
========================================== */


const questionText =
    document.getElementById(
        "questionText"
    );


const optionsContainer =
    document.getElementById(
        "optionsContainer"
    );


const questionCount =
    document.getElementById(
        "questionCount"
    );


const progressFill =
    document.getElementById(
        "progressFill"
    );


const timerDisplay =
    document.getElementById(
        "timer"
    );


const previousBtn =
    document.getElementById(
        "previousBtn"
    );


const nextBtn =
    document.getElementById(
        "nextBtn"
    );





/* ==========================================
   Display Question
========================================== */


function displayQuestion(){


    if(!testQuestions.length)
        return;



    const question =
        testQuestions[currentQuestion];



    if(questionText){


        questionText.textContent =
            question.question;


    }



    if(questionCount){


        questionCount.textContent =

        `Question ${currentQuestion + 1} / ${testQuestions.length}`;


    }




    if(optionsContainer){


        optionsContainer.innerHTML="";



        question.options.forEach(
            (option,index)=>{


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "option-btn";



            button.textContent =
                option;



            if(
                selectedAnswers[currentQuestion]
                === index
            ){

                button.classList.add(
                    "selected"
                );

            }




            button.onclick = ()=>{


                selectedAnswers[currentQuestion]
                    = index;


                displayQuestion();


            };



            optionsContainer.appendChild(
                button
            );


        });


    }



    updateProgress();


}





/* ==========================================
   Progress Bar
========================================== */


function updateProgress(){


    if(!progressFill)
        return;



    let progress =

    (
        (currentQuestion + 1)
        /
        testQuestions.length
    )
    *100;



    progressFill.style.width =
        progress + "%";


}





/* ==========================================
   Next Question
========================================== */


if(nextBtn){


nextBtn.onclick = ()=>{


    if(
        currentQuestion <
        testQuestions.length - 1
    ){


        currentQuestion++;


        displayQuestion();


    }


};


}





/* ==========================================
   Previous Question
========================================== */


if(previousBtn){


previousBtn.onclick = ()=>{


    if(currentQuestion > 0){


        currentQuestion--;


        displayQuestion();


    }


};


}





/* ==========================================
   Timer
========================================== */


function startTimer(){


    clearInterval(timer);



    timer = setInterval(
        ()=>{


        let minutes =
            Math.floor(
                timeLeft / 60
            );


        let seconds =
            timeLeft % 60;



        if(timerDisplay){


            timerDisplay.textContent =

            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;


        }



        timeLeft--;



        if(timeLeft < 0){


            clearInterval(timer);



            alert(
                "Time Over! Test Submitted"
            );



            const submit =
                document.getElementById(
                    "submitBtn"
                );



            if(submit)
                submit.click();



        }



    },1000);


}

/* ==========================================
   G THE GENIUS
   Mock Test JavaScript
   Part 3 Final

   Features:
   - Start Test
   - Timer Connection
   - Submit Test
   - Score Calculation
   - Result Ready
========================================== */



/* ==========================================
   Start Test
========================================== */


function startTest(){


    const setup =
        document.getElementById(
            "setupArea"
        );


    const testArea =
        document.getElementById(
            "testArea"
        );



    if(setup){

        setup.style.display =
            "none";

    }



    if(testArea){

        testArea.style.display =
            "block";

    }



    currentQuestion = 0;



    displayQuestion();



    startTimer();


}





/* ==========================================
   Auto Start After Questions Loaded
========================================== */


function prepareAndStart(){


    if(
        testQuestions.length > 0
    ){

        startTest();

    }


}





/* ==========================================
   Submit Elements
========================================== */


const submitBtn =
    document.getElementById(
        "submitBtn"
    );


const resultBox =
    document.getElementById(
        "resultBox"
    );


const scoreDisplay =
    document.getElementById(
        "scoreDisplay"
    );





/* ==========================================
   Submit Test
========================================== */


if(submitBtn){


submitBtn.onclick = ()=>{


    clearInterval(timer);



    let correct = 0;

    let wrong = 0;

    let skipped = 0;




    testQuestions.forEach(
        (question,index)=>{


        if(
            selectedAnswers[index] === null
        ){

            skipped++;

        }

        else if(

            selectedAnswers[index]
            ===
            question.correctAnswer

        ){

            correct++;

        }

        else{

            wrong++;

        }



    });





    const marks =
        correct;





    if(resultBox){


        resultBox.style.display =
            "block";


    }




    if(scoreDisplay){


        scoreDisplay.innerHTML = `

        🏆 Marks : ${marks}

        <br><br>

        ✅ Correct : ${correct}

        <br>

        ❌ Wrong : ${wrong}

        <br>

        ⏭ Skipped : ${skipped}

        `;


    }



    saveMockResult({

        type:testType,

        marks,

        correct,

        wrong,

        skipped,

        total:testQuestions.length

    });



};

}





/* ==========================================
   Firebase Ready Result Save
========================================== */


async function saveMockResult(data){


    console.log(
        "Mock Test Result",
        data
    );


    /*
    
    Firebase Firestore:

    collection("results")
    addDoc(data)

    Later connect with firebase-config.js

    */


}





/* ==========================================
   Question Load Complete
========================================== */


const oldPrepareTest =
    prepareTest;



prepareTest = function(){


    oldPrepareTest();



    setTimeout(
        ()=>{


            prepareAndStart();


        },
        500
    );


};
/* ==========================================
   G THE GENIUS
   Mock Test JavaScript
   Part 4

   Firebase Result Save
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

    addDoc,

    serverTimestamp

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






/* ==========================================
   Get Student Details
========================================== */


function getStudentData(){


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
   Save Mock Result
========================================== */


async function saveMockResult(data){


    try{


        const student =
            getStudentData();



        await addDoc(

            collection(
                db,
                "results"
            ),


            {


                name:
                student.name,



                district:
                student.district,



                testType:
                data.type,



                testName:
                currentTest.title,



                marks:
                data.marks,



                correct:
                data.correct,



                wrong:
                data.wrong,



                skipped:
                data.skipped,



                totalQuestions:
                data.total,



                createdAt:
                serverTimestamp()



            }

        );



        console.log(
            "Result Saved Successfully"
        );



    }


    catch(error){


        console.log(
            "Result Save Error:",
            error
        );


    }


}

