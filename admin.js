/* ==========================================
   G THE GENIUS
   Admin JavaScript
   Part 1

   Features:
   - Firebase Connect
   - Admin Access Check
   - Add Question Setup
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

    getDocs,

    query,

    where,

    serverTimestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







/* ==========================================
   Admin Email
========================================== */


const ADMIN_EMAIL =

"admin@gthegenius.com";







/* ==========================================
   Check Admin Access
========================================== */


function checkAdminAccess(){


    const email =

    localStorage.getItem(
        "userEmail"
    );




    const status =

    document.getElementById(
        "adminStatus"
    );





    if(

        email === ADMIN_EMAIL

    ){


        if(status)

        status.textContent =
        "✅ Admin Access Granted";



    }

    else{


        if(status)

        status.textContent =
        "❌ Access Restricted";


    }


}







/* ==========================================
   Get Question Data
========================================== */


function getQuestionData(){


    return {


        subject:

        document.getElementById(
            "subjectSelect"
        ).value,



        topic:

        document.getElementById(
            "topicSelect"
        ).value,



        question:

        document.getElementById(
            "questionText"
        ).value,



        options:{


            A:
            document.getElementById(
                "optionA"
            ).value,


            B:
            document.getElementById(
                "optionB"
            ).value,


            C:
            document.getElementById(
                "optionC"
            ).value,


            D:
            document.getElementById(
                "optionD"
            ).value


        },



        answer:

        document.getElementById(
            "correctAnswer"
        ).value,



        explanation:

        document.getElementById(
            "explanation"
        ).value,


        createdAt:

        serverTimestamp()


    };


}







/* ==========================================
   Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    checkAdminAccess();


}

);

/* ==========================================
   G THE GENIUS
   Admin JavaScript
   Part 2

   Features:
   - Duplicate Check
   - Add Question
   - Firestore Save
========================================== */



/* ==========================================
   Check Duplicate Question
========================================== */


async function checkDuplicate(questionText){


    const snapshot =

    await getDocs(

        collection(
            db,
            "questions"
        )

    );




    let duplicate = false;




    snapshot.forEach(

        (doc)=>{


        const data =
            doc.data();



        if(

            data.question ===
            questionText

        ){


            duplicate = true;


        }



    });





    return duplicate;


}







/* ==========================================
   Add Question
========================================== */


const addQuestionBtn =

document.getElementById(
    "addQuestionBtn"
);





if(addQuestionBtn){


addQuestionBtn.onclick = async ()=>{


    try{


        const questionData =

        getQuestionData();





        if(

            !questionData.question ||

            !questionData.answer

        ){


            alert(
                "Please fill required fields"
            );


            return;


        }






        const duplicate =

        await checkDuplicate(

            questionData.question

        );





        if(duplicate){


            alert(

            "⚠️ Question already exists"

            );


            return;


        }







        await addDoc(

            collection(
                db,
                "questions"
            ),

            questionData

        );






        alert(

        "✅ Question Added Successfully"

        );






        clearQuestionForm();



    }


    catch(error){


        console.log(
            "Add Question Error:",
            error
        );


        alert(
            "Upload Failed"
        );


    }



};


}







/* ==========================================
   Clear Form
========================================== */


function clearQuestionForm(){


    document
    .querySelectorAll(
        "input, textarea"
    )
    .forEach(

        field=>{

            field.value="";

        }

    );



    document.getElementById(
        "correctAnswer"
    ).value="";



}

/* ==========================================
   G THE GENIUS
   Admin JavaScript
   Part 3 Final

   Features:
   - Bulk Upload
   - Upload Progress
   - Topic Master
   - Final Connection
========================================== */



/* ==========================================
   Topic Master
========================================== */


const topicData = {


    "Tamil":[

        "Grammar",
        "Literature",
        "Authors"

    ],



    "General Knowledge":[

        "Current Affairs",
        "India GK",
        "World GK"

    ],



    "History":[

        "Ancient India",
        "Modern India"

    ],



    "Geography":[

        "India Geography",
        "World Geography"

    ],



    "Polity":[

        "Indian Constitution",
        "Government"

    ],



    "Science":[

        "Physics",
        "Chemistry",
        "Biology"

    ]


};







/* ==========================================
   Subject Change
========================================== */


const subjectSelect =

document.getElementById(
    "subjectSelect"
);



if(subjectSelect){


subjectSelect.onchange = ()=>{


    const topicSelect =

    document.getElementById(
        "topicSelect"
    );



    topicSelect.innerHTML =

    `<option value="">
    Select Topic
    </option>`;





    topicData[
        subjectSelect.value
    ]
    ?.forEach(

        topic=>{


        topicSelect.innerHTML += `


        <option value="${topic}">

        ${topic}

        </option>


        `;


    });


};


}







/* ==========================================
   Bulk Upload
========================================== */


const uploadBtn =

document.getElementById(
    "uploadBtn"
);





if(uploadBtn){


uploadBtn.onclick = async ()=>{


    const file =

    document.getElementById(
        "bulkFile"
    ).files[0];





    const status =

    document.getElementById(
        "uploadStatus"
    );





    if(!file){


        alert(
            "Select File"
        );


        return;


    }






    const text =

    await file.text();






    try{


        const questions =

        JSON.parse(text);





        let count = 0;





        for(

            const item of questions

        ){



            const duplicate =

            await checkDuplicate(
                item.question
            );





            if(!duplicate){


                await addDoc(

                    collection(
                        db,
                        "questions"
                    ),

                    {

                        ...item,

                        createdAt:
                        serverTimestamp()

                    }

                );



                count++;


            }



        }







        status.textContent =

        `✅ ${count} Questions Uploaded`;



    }


    catch(error){


        console.log(
            "Bulk Upload Error",
            error
        );



        status.textContent =

        "❌ Upload Failed";


    }



};


}







/* ==========================================
   Final Admin Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    checkAdminAccess();


});
