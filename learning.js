// ==========================================
// G THE GENIUS LEARNING ZONE JS
// PART 1 / 5
// ==========================================


// Firebase Import

import { auth, db } from "./firebase-config.js";


import {
    collection,
    getDocs,
    query,
    where,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// ===============================
// ELEMENTS
// ===============================


const studentName =
document.getElementById("studentName");


const studentDistrict =
document.getElementById("studentDistrict");


const greeting =
document.getElementById("greeting");


const coins =
document.getElementById("coins");


const level =
document.getElementById("level");


const completedLessons =
document.getElementById("completedLessons");


const xpValue =
document.getElementById("xpValue");


const coinValue =
document.getElementById("coinValue");


const completedValue =
document.getElementById("completedValue");




// ===============================
// GREETING FUNCTION
// ===============================


function loadGreeting(){


    let hour =
    new Date().getHours();



    if(hour < 12){


        greeting.innerHTML =
        "Good Morning ☀️";


    }

    else if(hour < 17){


        greeting.innerHTML =
        "Good Afternoon 🌤️";


    }

    else{


        greeting.innerHTML =
        "Good Evening 🌙";


    }


}



loadGreeting();




// ===============================
// DEFAULT DATA
// ===============================


let studentData = {


    name:"Student",


    district:"Tamil Nadu",


    coins:0,


    xp:0,


    completed:0


};




// ===============================
// LOAD STUDENT PROFILE
// ===============================


onAuthStateChanged(auth, async(user)=>{


    if(user){



        try{


            const userRef =
            doc(
                db,
                "students",
                user.uid
            );



            const snap =
            await getDoc(userRef);



            if(snap.exists()){


                studentData =
                snap.data();



                studentName.innerHTML =
                studentData.name || "Student";



                studentDistrict.innerHTML =
                studentData.district || "Tamil Nadu";



                updateProgress();



            }



        }

        catch(error){


            console.log(
            "Profile Load Error:",
            error
            );


        }



    }

    else{


        studentName.innerHTML =
        "Guest Student";


        studentDistrict.innerHTML =
        "Login Required";


    }



});





// ===============================
// UPDATE PROGRESS
// ===============================


function updateProgress(){



    coins.innerHTML =
    studentData.coins || 0;



    coinValue.innerHTML =
    studentData.coins || 0;



    xpValue.innerHTML =
    (studentData.xp || 0)
    +" XP";



    completedLessons.innerHTML =
    studentData.completed || 0;



    completedValue.innerHTML =
    studentData.completed || 0;



    let xp =
    studentData.xp || 0;



    let currentLevel =
    Math.floor(xp / 100) + 1;



    level.innerHTML =
    "Level "
    + currentLevel;



                  }

// ==========================================
// G THE GENIUS LEARNING ZONE JS
// PART 2 / 5
// ==========================================


import {

    collection,
    getDocs,
    query,
    where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ===============================
// VARIABLES
// ===============================


let selectedCategory = "";



const topicSection =
document.getElementById("topicSection");


const topicList =
document.getElementById("topicList");



const lessonSection =
document.getElementById("lessonSection");





// ===============================
// OPEN CATEGORY
// ===============================


window.openCategory = async function(category){


    selectedCategory = category;



    topicSection.classList.remove("hidden");


    lessonSection.classList.add("hidden");



    topicList.innerHTML = `

    <div class="topic-card">

    ⏳ Loading Topics...

    </div>

    `;



    await loadTopics(category);



    topicSection.scrollIntoView({

        behavior:"smooth"

    });



};





// ===============================
// LOAD TOPICS FROM FIREBASE
// ===============================


async function loadTopics(category){


    try{


        topicList.innerHTML = "";



        const q = query(

            collection(
                db,
                "learning"
            ),

            where(
                "category",
                "==",
                category
            )

        );



        const snapshot =
        await getDocs(q);



        if(snapshot.empty){



            topicList.innerHTML = `


            <div class="topic-card">


            <h3>No Topics Added</h3>


            <p>

            Admin will add lessons soon.

            </p>


            </div>


            `;



            return;


        }




        snapshot.forEach((doc)=>{


            let data =
            doc.data();



            let card =
            document.createElement(
                "div"
            );



            card.className =
            "topic-card";



            card.innerHTML = `


            <h3>

            📘 ${data.topic}

            </h3>


            <p>

            ${data.description || 
            "Start Learning"}

            </p>


            `;



            card.onclick = ()=>{


                loadLesson(
                    doc.id,
                    data
                );


            };



            topicList.appendChild(card);



        });



    }

    catch(error){


        console.log(
        "Topic Error:",
        error
        );



        topicList.innerHTML = `


        <div class="topic-card">

        Error Loading Topics

        </div>


        `;


    }


}






// ===============================
// SEARCH FUNCTION
// ===============================


const searchBox =
document.getElementById(
"searchBox"
);



if(searchBox){


searchBox.addEventListener(
"input",
()=>{


let value =
searchBox.value.toLowerCase();



let cards =
document.querySelectorAll(
".subject-card"
);



cards.forEach(card=>{


let text =
card.innerText.toLowerCase();



if(text.includes(value)){


card.style.display =
"block";


}

else{


card.style.display =
"none";


}



});



});


}
  
 // ==========================================
 // G THE GENIUS LEARNING ZONE JS
 // PART 3 / 5
 // ==========================================



const lessonTitle =
document.getElementById("lessonTitle");


const lessonContent =
document.getElementById("lessonContent");


const lessonImage =
document.getElementById("lessonImage");


const pdfBtn =
document.getElementById("pdfBtn");


const videoBtn =
document.getElementById("videoBtn");


const completeLessonBtn =
document.getElementById("completeLessonBtn");


const lessonProgress =
document.getElementById("lessonProgress");



let currentLesson = null;





// ===============================
// LOAD LESSON
// ===============================


window.loadLesson = function(id,data){


    currentLesson = {


        id:id,

        ...data


    };



    lessonSection.classList.remove(
        "hidden"
    );



    lessonTitle.innerHTML =
    data.title ||
    data.topic;



    lessonContent.innerHTML =
    data.content ||
    "Lesson content will be updated soon.";



    lessonProgress.innerHTML =
    "0%";





    // IMAGE LOAD


    if(data.image){


        lessonImage.src =
        data.image;


        lessonImage.style.display =
        "block";


    }

    else{


        lessonImage.style.display =
        "none";


    }





    // PDF BUTTON


    if(data.pdf){


        pdfBtn.href =
        data.pdf;


        pdfBtn.style.display =
        "inline-flex";


    }

    else{


        pdfBtn.style.display =
        "none";


    }





    // VIDEO BUTTON


    if(data.video){


        videoBtn.href =
        data.video;


        videoBtn.style.display =
        "inline-flex";


    }

    else{


        videoBtn.style.display =
        "none";


    }



    lessonSection.scrollIntoView({

        behavior:"smooth"

    });



};







// ===============================
// COMPLETE LESSON
// ===============================



if(completeLessonBtn){



completeLessonBtn.addEventListener(
"click",
async()=>{


    if(!currentLesson){


        alert(
        "Please select a lesson first"
        );


        return;


    }





    completeLessonBtn.innerHTML =
    "✅ Completed";



    completeLessonBtn.disabled =
    true;



    lessonProgress.innerHTML =
    "100%";



    await updateStudentProgress();



    alert(
    "Lesson Completed 🎉"
    );



});


}






// ===============================
// UPDATE XP + COINS
// ===============================


async function updateStudentProgress(){


    if(!auth.currentUser)
    return;



    try{


        const userRef =
        doc(

            db,

            "students",

            auth.currentUser.uid

        );



        let newXP =
        (studentData.xp || 0)
        + 10;



        let newCoins =
        (studentData.coins || 0)
        + 5;



        let newCompleted =
        (studentData.completed || 0)
        + 1;




        await updateDoc(
            userRef,
            {


            xp:newXP,


            coins:newCoins,


            completed:newCompleted



            }

        );




        studentData.xp =
        newXP;


        studentData.coins =
        newCoins;


        studentData.completed =
        newCompleted;



        updateProgress();



    }

    catch(error){


        console.log(
        "Progress Update Error",
        error
        );


    }


          }

 // ==========================================
 // G THE GENIUS LEARNING ZONE JS
 // PART 4 / 5
 // ==========================================



const recentLessons =
document.getElementById(
"recentLessons"
);


const practiceBtn =
document.getElementById(
"practiceBtn"
);




// ===============================
// LOAD RECENT LESSONS
// ===============================


async function loadRecentLessons(){


    try{


        recentLessons.innerHTML =
        `

        <div class="recent-card">

        ⏳ Loading Recent Lessons...

        </div>

        `;



        const snap =
        await getDocs(

            collection(
                db,
                "learning"
            )

        );



        recentLessons.innerHTML = "";



        let count = 0;



        snap.forEach((doc)=>{


            if(count >= 6)
            return;



            let data =
            doc.data();



            let card =
            document.createElement(
                "div"
            );



            card.className =
            "recent-card";



            card.innerHTML = `


            <h3>

            📚 ${data.topic}

            </h3>


            <p>

            ${data.category || 
            "General"}

            </p>


            `;



            card.onclick = ()=>{


                loadLesson(
                    doc.id,
                    data
                );


            };



            recentLessons.appendChild(card);



            count++;



        });




    }

    catch(error){


        console.log(
        "Recent Error:",
        error
        );


    }


}



loadRecentLessons();







// ===============================
// PRACTICE TEST BUTTON
// ===============================



if(practiceBtn){



practiceBtn.addEventListener(
"click",
()=>{


    if(!currentLesson){


        alert(
        "Select lesson first"
        );


        return;


    }



    let category =
    currentLesson.category;



    window.location.href =

    `mocktest.html?type=learning&category=${category}`;



});


}







// ===============================
// SAVE LESSON HISTORY
// ===============================



async function saveLessonHistory(){



    if(!auth.currentUser ||
    !currentLesson)
    return;




    try{


        await addDoc(

            collection(
                db,
                "lessonHistory"
            ),

            {


            userId:
            auth.currentUser.uid,


            lessonId:
            currentLesson.id,


            title:
            currentLesson.title ||
            currentLesson.topic,


            category:
            currentLesson.category,


            completed:true,


            date:
            new Date()



            }


        );



    }

    catch(error){


        console.log(
        "History Error",
        error
        );


    }



}

// ==========================================
// G THE GENIUS LEARNING ZONE JS
// PART 5 / 5 FINAL
// ==========================================



// ===============================
// PAGE LOADING EFFECT
// ===============================


window.addEventListener(
"load",
()=>{


    document.body.classList.add(
        "loaded"
    );


});




// ===============================
// SAVE COMPLETE LESSON HISTORY
// ===============================


const originalComplete =
updateStudentProgress;



async function completeAndSave(){


    await originalComplete();


    await saveLessonHistory();



}





// ===============================
// NETWORK ERROR CHECK
// ===============================


window.addEventListener(
"offline",
()=>{


    alert(
    "⚠️ Internet connection unavailable"
    );


});



window.addEventListener(
"online",
()=>{


    console.log(
    "Internet Connected"
    );


});





// ===============================
// AUTO RESTORE LAST LESSON
// ===============================


const lastLesson =
localStorage.getItem(
"lastLesson"
);



if(lastLesson){


    const continueLesson =
    document.getElementById(
    "continueLesson"
    );


    if(continueLesson){


        continueLesson.innerHTML =
        lastLesson;


    }


}





// ===============================
// CONTINUE BUTTON
// ===============================


const continueBtn =
document.getElementById(
"continueBtn"
);



if(continueBtn){


continueBtn.onclick =
()=>{


    document
    .querySelector(
    ".subject-section"
    )
    .scrollIntoView({

        behavior:"smooth"

    });


};


}






// ===============================
// STORE LAST LESSON
// ===============================


function saveLastLesson(title){


    localStorage.setItem(

        "lastLesson",

        title

    );


}





// ===============================
// FINAL READY MESSAGE
// ===============================


console.log(
"🚀 G THE GENIUS Learning Zone Loaded Successfully"
);
