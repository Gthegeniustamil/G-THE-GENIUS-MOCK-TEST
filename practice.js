/* ==========================================
   G THE GENIUS
   Practice Test JavaScript
   Part 1

   Features:
   - Subject Load
   - Topic Load
   - Question JSON Loading
   - Random Question Setup
========================================== */



/* ==========================================
   Elements
========================================== */


const subjectSelect =
    document.getElementById(
        "subjectSelect"
    );


const topicSelect =
    document.getElementById(
        "topicSelect"
    );


const startPracticeBtn =
    document.getElementById(
        "startPracticeBtn"
    );


const testArea =
    document.getElementById(
        "testArea"
    );





/* ==========================================
   Variables
========================================== */


let allQuestions = [];

let testQuestions = [];

let currentQuestion = 0;

let selectedAnswers = [];

let totalQuestions = 10;





/* ==========================================
   Load Questions JSON
========================================== */


async function loadQuestionData(){


    try{


        const response =
            await fetch(
                "questions/questions.json"
            );


        allQuestions =
            await response.json();



        loadSubjects();



    }

    catch(error){


        console.log(
            "Question Load Error:",
            error
        );


    }


}





loadQuestionData();





/* ==========================================
   Load Subjects
========================================== */


function loadSubjects(){


    const subjects = [

        ...new Set(

            allQuestions.map(
                q=>q.subject
            )

        )

    ];



    subjects.forEach(subject=>{


        const option =
            document.createElement(
                "option"
            );


        option.value =
            subject;


        option.textContent =
            subject;


        subjectSelect.appendChild(
            option
        );


    });


}





/* ==========================================
   Subject Change
========================================== */


if(subjectSelect){


subjectSelect.addEventListener(
"change",
()=>{


    const subject =
        subjectSelect.value;



    topicSelect.innerHTML = `

    <option value="">
    Select Topic
    </option>

    `;



    const topics = [

        ...new Set(

            allQuestions

            .filter(
                q=>
                q.subject===subject
            )

            .map(
                q=>q.topic
            )

        )

    ];



    topics.forEach(topic=>{


        const option =
            document.createElement(
                "option"
            );


        option.value =
            topic;


        option.textContent =
            topic;


        topicSelect.appendChild(
            option
        );


    });



});


}





/* ==========================================
   Start Practice
========================================== */


if(startPracticeBtn){


startPracticeBtn.addEventListener(
"click",
()=>{


    const subject =
        subjectSelect.value;


    const topic =
        topicSelect.value;



    let filtered =
        allQuestions.filter(
            q=>

            q.subject===subject
            &&
            q.topic===topic

        );



    if(filtered.length===0){


        alert(
            "Questions not available"
        );


        return;


    }



    filtered.sort(
        ()=>Math.random()-0.5
    );



    testQuestions =
        filtered.slice(
            0,
            totalQuestions
        );



    selectedAnswers =
        new Array(
            testQuestions.length
        )
        .fill(null);



    currentQuestion=0;



    testArea.style.display =
        "block";



    displayQuestion();


});


}

/* ==========================================
   G THE GENIUS
   Practice Test JavaScript
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


const timerElement =
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



let timer;

let timeLeft = 300;





/* ==========================================
   Display Question
========================================== */


function displayQuestion(){


    if(!testQuestions.length)
        return;



    const question =
        testQuestions[currentQuestion];



    questionText.textContent =
        question.question;



    questionCount.textContent =

    `Question ${currentQuestion + 1} / ${testQuestions.length}`;





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



    updateProgress();



}





/* ==========================================
   Progress
========================================== */


function updateProgress(){


    const percentage =

    (
        (currentQuestion + 1)
        /
        testQuestions.length
    )
    *100;



    progressFill.style.width =
        percentage+"%";


}





/* ==========================================
   Next Button
========================================== */


if(nextBtn){


nextBtn.onclick = ()=>{


    if(
        currentQuestion <
        testQuestions.length-1
    ){


        currentQuestion++;


        displayQuestion();


    }


    else{


        alert(
            "Please Submit Test"
        );


    }


};


}





/* ==========================================
   Previous Button
========================================== */


if(previousBtn){


previousBtn.onclick = ()=>{


    if(currentQuestion>0){


        currentQuestion--;


        displayQuestion();


    }


};


}





/* ==========================================
   Timer Start
========================================== */


function startTimer(){


    clearInterval(timer);



    timeLeft=300;



    timer =
    setInterval(
    ()=>{


        let minutes =
            Math.floor(
                timeLeft/60
            );


        let seconds =
            timeLeft%60;



        timerElement.textContent =

        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;





        timeLeft--;



        if(timeLeft < 0){


            clearInterval(timer);



            alert(
                "Time Over! Test Submitted"
            );



            document
            .getElementById(
                "submitBtn"
            )
            .click();



        }



    },
    1000
    );


}

/* ==========================================
   G THE GENIUS
   Practice Test JavaScript
   Part 3 Final

   Features:
   - Submit Test
   - Marks Calculation
   - Result Display
   - Timer Start Connection
========================================== */



/* ==========================================
   Submit Elements
========================================== */


const submitBtn =
    document.getElementById(
        "submitBtn"
    );


const resultPreview =
    document.getElementById(
        "resultPreview"
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
            ||
            selectedAnswers[index] === undefined
        ){

            skipped++;

        }

        else if(

            selectedAnswers[index]
            ==
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



    if(testArea){

        testArea.style.display =
            "none";

    }



    if(resultPreview){


        resultPreview.style.display =
            "block";


    }




    if(scoreDisplay){


        scoreDisplay.innerHTML = `

        <div>
        🏆 Marks : ${marks}
        </div>

        <div>
        ✅ Correct : ${correct}
        </div>

        <div>
        ❌ Wrong : ${wrong}
        </div>

        <div>
        ⏭️ Skipped : ${skipped}
        </div>

        `;


    }



    saveResult(
        marks,
        correct,
        wrong,
        skipped
    );



};


}





/* ==========================================
   Save Result
   Firebase Ready
========================================== */


async function saveResult(
    marks,
    correct,
    wrong,
    skipped
){


    console.log(

        "Result Saved",

        {
            marks,
            correct,
            wrong,
            skipped
        }

    );


}





/* ==========================================
   Start Timer After Test Start
========================================== */


const oldDisplayQuestion =
    displayQuestion;



displayQuestion = function(){


    oldDisplayQuestion();



    if(
        !timer
        &&
        testQuestions.length > 0
    ){

        startTimer();

    }


};
