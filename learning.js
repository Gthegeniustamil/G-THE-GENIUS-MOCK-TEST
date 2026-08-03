/* ==========================================
   G THE GENIUS
   Learning Zone JavaScript
   Part 1

   Features:
   - 30 Subject Data
   - Dynamic Subject Cards
   - Subject Search
========================================== */



/* ==========================================
   Subject Database
========================================== */


const subjects = [

    {
        name:"General Knowledge",
        icon:"🌍",
        description:"Important GK Topics"
    },

    {
        name:"General Science",
        icon:"🔬",
        description:"Physics Chemistry Biology"
    },

    {
        name:"Indian History",
        icon:"📜",
        description:"Ancient to Modern History"
    },

    {
        name:"Indian Polity",
        icon:"⚖️",
        description:"Constitution & Governance"
    },

    {
        name:"Indian Economy",
        icon:"💰",
        description:"Economy Basics"
    },

    {
        name:"Indian Geography",
        icon:"🗺️",
        description:"Maps & Places"
    },

    {
        name:"Tamil Nadu History",
        icon:"🏛️",
        description:"TN Important Events"
    },

    {
        name:"Tamil Nadu Geography",
        icon:"🌄",
        description:"TN Geography"
    },

    {
        name:"Current Affairs",
        icon:"📰",
        description:"Latest Updates"
    },

    {
        name:"Aptitude",
        icon:"🧮",
        description:"Maths Practice"
    },

    {
        name:"Mental Ability",
        icon:"🧠",
        description:"Reasoning Skills"
    },

    {
        name:"Psychology",
        icon:"🧠",
        description:"Human Behaviour"
    },

    {
        name:"Physical Fitness",
        icon:"💪",
        description:"PET Preparation"
    },

    {
        name:"Computer",
        icon:"💻",
        description:"Computer Knowledge"
    },

    {
        name:"Environment",
        icon:"🌱",
        description:"Ecology & Nature"
    },

    {
        name:"Art & Culture",
        icon:"🎨",
        description:"Indian Culture"
    },

    {
        name:"Indian National Movement",
        icon:"🇮🇳",
        description:"Freedom Movement"
    },

    {
        name:"Constitution",
        icon:"📖",
        description:"Indian Constitution"
    },

    {
        name:"Reasoning",
        icon:"🧩",
        description:"Logical Ability"
    },

    {
        name:"Biology",
        icon:"🧬",
        description:"Life Science"
    },

    {
        name:"Physics",
        icon:"⚡",
        description:"Basic Physics"
    },

    {
        name:"Chemistry",
        icon:"🧪",
        description:"Basic Chemistry"
    },

    {
        name:"Zoology",
        icon:"🐾",
        description:"Animal Science"
    },

    {
        name:"Botany",
        icon:"🌿",
        description:"Plant Science"
    },

    {
        name:"Sports",
        icon:"🏅",
        description:"Sports GK"
    },

    {
        name:"Awards",
        icon:"🏆",
        description:"Important Awards"
    },

    {
        name:"Books & Authors",
        icon:"📚",
        description:"Famous Books"
    },

    {
        name:"Important Days",
        icon:"📅",
        description:"National & International Days"
    },

    {
        name:"Government Schemes",
        icon:"🏢",
        description:"Important Schemes"
    },

    {
        name:"Miscellaneous",
        icon:"⭐",
        description:"Other Topics"
    }

];




/* ==========================================
   Elements
========================================== */


const subjectsGrid =
    document.getElementById("subjectsGrid");


const searchInput =
    document.getElementById("subjectSearch");




/* ==========================================
   Display Subjects
========================================== */


function displaySubjects(data){


    if(!subjectsGrid)
        return;



    subjectsGrid.innerHTML="";



    data.forEach(subject=>{


        const card =
        document.createElement("div");



        card.className =
            "subject-card";



        card.onclick = ()=>{


            openSubject(
                subject.name
            );


        };



        card.innerHTML = `


            <div class="subject-icon">

                ${subject.icon}

            </div>


            <h3>

                ${subject.name}

            </h3>


            <p>

                ${subject.description}

            </p>


        `;



        subjectsGrid.appendChild(card);



    });


}



displaySubjects(subjects);





/* ==========================================
   Subject Search
========================================== */


if(searchInput){


    searchInput.addEventListener(
        "input",
        ()=>{


            const value =
                searchInput.value
                .toLowerCase();



            const filtered =
                subjects.filter(
                    subject=>

                    subject.name
                    .toLowerCase()
                    .includes(value)

                );



            displaySubjects(
                filtered
            );


        }
    );


}

/* ==========================================
   G THE GENIUS
   Learning Zone JavaScript
   Part 2 Final

   Features:
   - Subject Open
   - Topic Navigation
   - Question Data Connection
========================================== */


/* ==========================================
   Open Subject
========================================== */


function openSubject(subjectName){


    const encodedSubject =
        encodeURIComponent(subjectName);



    window.location.href =
        "topics.html?subject=" + encodedSubject;


}





/* ==========================================
   Get Selected Subject
   For Topic Page
========================================== */


function getSelectedSubject(){


    const params =
        new URLSearchParams(
            window.location.search
        );



    return params.get("subject");


}





/* ==========================================
   Question Collection Helper
========================================== */


function filterQuestionsBySubject(
    questions,
    subject
){


    if(!subject)
        return [];



    return questions.filter(
        question =>

        question.subject === subject

    );


}





/* ==========================================
   Local JSON Question Loading
========================================== */


async function loadQuestions(){


    try{


        const response =
            await fetch(
                "questions/questions.json"
            );



        const data =
            await response.json();



        return data;


    }

    catch(error){


        console.log(
            "Question Loading Error:",
            error
        );



        return [];


    }


}





/* ==========================================
   Get Subject Questions
========================================== */


async function getSubjectQuestions(subject){


    const allQuestions =
        await loadQuestions();



    const result =
        filterQuestionsBySubject(
            allQuestions,
            subject
        );



    return result;


}





/* ==========================================
   Learning Page Ready
========================================== */


window.addEventListener(
    "DOMContentLoaded",
    ()=>{


        console.log(
            "Learning Zone Ready 📚"
        );


    }
);





