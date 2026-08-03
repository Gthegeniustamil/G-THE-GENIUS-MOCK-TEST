/* ==========================================
   G THE GENIUS
   Topics JavaScript
   Part 1

   Features:
   - Get Subject From URL
   - Topic Database
   - Dynamic Topic Display
========================================== */


/* ==========================================
   Selected Subject
========================================== */


const params =
    new URLSearchParams(
        window.location.search
    );


const selectedSubject =
    params.get("subject");



const subjectTitle =
    document.getElementById(
        "subjectTitle"
    );


const topicList =
    document.getElementById(
        "topicList"
    );



/* ==========================================
   Show Subject Name
========================================== */


if(subjectTitle){


    subjectTitle.textContent =
        selectedSubject ||
        "All Topics";


}




/* ==========================================
   Topic Database
========================================== */


const topics = {


"General Knowledge":[

    "Indian National Symbols",

    "Important Places",

    "World GK",

    "Awards & Honours",

    "Books & Authors"

],



"General Science":[

    "Physics Basics",

    "Chemistry Basics",

    "Biology Basics",

    "Human Body",

    "Scientific Discoveries"

],



"Indian History":[

    "Ancient India",

    "Medieval India",

    "Modern India",

    "Freedom Movement",

    "Important Rulers"

],



"Indian Polity":[

    "Indian Constitution",

    "Fundamental Rights",

    "Parliament",

    "President & Governor",

    "Judiciary"

],



"Psychology":[

    "Human Behaviour",

    "Learning Process",

    "Personality",

    "Motivation",

    "Mental Health"

],



"Physical Fitness":[

    "Running Practice",

    "Strength Training",

    "Endurance",

    "PET Tips",

    "Fitness Diet"

]


};




/* ==========================================
   Default Topics
========================================== */


function getTopics(){


    return topics[selectedSubject]
    ||
    [

        "Important Topics",

        "Previous Year Questions",

        "Exam Preparation",

        "Practice Questions"

    ];



}




/* ==========================================
   Display Topics
========================================== */


function displayTopics(){


    if(!topicList)
        return;



    topicList.innerHTML="";



    const subjectTopics =
        getTopics();



    subjectTopics.forEach(
        (topic,index)=>{


        const card =
        document.createElement(
            "div"
        );



        card.className =
            "topic-card";



        card.innerHTML = `


            <div class="topic-icon">

                📖

            </div>


            <div class="topic-info">


                <h3>

                    ${topic}

                </h3>


                <p>

                    Learn this topic and
                    improve your score

                </p>


                <span>

                    Questions Available

                </span>


            </div>


            <div class="topic-actions">


                <button
                class="learn-btn"
                onclick="learnTopic('${topic}')">

                    Learn

                </button>


                <button
                class="practice-btn"
                onclick="practiceTopic('${topic}')">

                    Practice

                </button>


            </div>


        `;



        topicList.appendChild(card);



    });



}




displayTopics();

/* ==========================================
   G THE GENIUS
   Topics JavaScript
   Part 2 Final

   Features:
   - Learn Topic Function
   - Practice Topic Function
   - Question Filter Support
========================================== */



/* ==========================================
   Learn Topic
========================================== */


function learnTopic(topic){


    const subject =
        encodeURIComponent(
            selectedSubject
        );


    const selectedTopic =
        encodeURIComponent(
            topic
        );



    window.location.href =
        "learn.html?subject="
        + subject
        +
        "&topic="
        + selectedTopic;


}





/* ==========================================
   Practice Topic
========================================== */


function practiceTopic(topic){


    const subject =
        encodeURIComponent(
            selectedSubject
        );


    const selectedTopic =
        encodeURIComponent(
            topic
        );



    window.location.href =
        "practice.html?subject="
        + subject
        +
        "&topic="
        + selectedTopic;


}





/* ==========================================
   Start Topic Practice
========================================== */


function startTopicPractice(){


    if(!selectedSubject){


        alert(
            "Please select a subject"
        );


        return;


    }



    window.location.href =
        "practice.html?subject="
        +
        encodeURIComponent(
            selectedSubject
        );


}





/* ==========================================
   Question Filter Helper
========================================== */


async function getTopicQuestions(
    subject,
    topic
){


    try{


        const response =
            await fetch(
                "questions/questions.json"
            );



        const questions =
            await response.json();



        const filtered =
            questions.filter(
                question =>


                question.subject === subject
                &&
                question.topic === topic


            );



        return filtered;



    }


    catch(error){


        console.log(
            "Topic Question Error:",
            error
        );


        return [];


    }


}





/* ==========================================
   Page Loaded
========================================== */


window.addEventListener(
    "DOMContentLoaded",
    ()=>{


        console.log(
            "Topic Page Ready 📚"
        );


    }
);
