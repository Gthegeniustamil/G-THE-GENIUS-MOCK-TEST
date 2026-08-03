/* ==========================================
   G THE GENIUS
   Dashboard JavaScript
   Part 1

   Features:
   - Firebase Auth User
   - Student Name
   - Time Based Greeting
   - Live Date & Time
========================================== */


import {
    auth,
    db
} from "./firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



/* ==========================================
   DOM Elements
========================================== */


const studentName =
    document.getElementById("studentName");


const greeting =
    document.getElementById("greeting");


const currentDate =
    document.getElementById("currentDate");


const currentTime =
    document.getElementById("currentTime");



/* ==========================================
   Firebase User Load
========================================== */


onAuthStateChanged(auth, async(user)=>{


    if(user){


        try{


            const userRef =
                doc(db,"students",user.uid);


            const userSnap =
                await getDoc(userRef);



            if(userSnap.exists()){


                const data =
                    userSnap.data();



                studentName.textContent =
                    data.name || "Student";


            }

            else{


                studentName.textContent =
                    "Student";


            }


        }

        catch(error){


            console.log(
                "User Load Error:",
                error
            );


            studentName.textContent =
                "Student";


        }


    }

    else{


        studentName.textContent =
            "Guest";


    }


});



/* ==========================================
   Time Based Greeting
========================================== */


function updateGreeting(){


    const hour =
        new Date().getHours();



    let message;



    if(hour >=5 && hour <12){


        message =
            "Good Morning ☀️";


    }


    else if(hour >=12 && hour <17){


        message =
            "Good Afternoon 🌤️";


    }


    else if(hour >=17 && hour <21){


        message =
            "Good Evening 🌆";


    }


    else{


        message =
            "Good Night 🌙";


    }



    if(greeting){


        greeting.textContent =
            message;


    }


}



updateGreeting();



/* ==========================================
   Live Date & Time
========================================== */


function updateDateTime(){


    const now =
        new Date();



    const options = {

        weekday:"long",

        day:"2-digit",

        month:"long",

        year:"numeric"

    };



    if(currentDate){


        currentDate.textContent =
            now.toLocaleDateString(
                "en-IN",
                options
            );


    }



    if(currentTime){


        currentTime.textContent =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour:"2-digit",
                    minute:"2-digit",
                    second:"2-digit"
                }
            );


    }


}



updateDateTime();


setInterval(
    updateDateTime,
    1000
);


setInterval(
    updateGreeting,
    60000
);

/* ==========================================
   G THE GENIUS
   Dashboard JavaScript
   Part 2

   Features:
   - Tamil Daily Quotes
   - Random Quote Display
   - Auto Quote Change
========================================== */


/* ==========================================
   Daily Quotes
========================================== */


const dailyQuotes = [

    "வெற்றி என்பது ஒரே நாளில் கிடைப்பது இல்லை. தினமும் செய்யும் சிறிய முயற்சிகளின் பலன் தான் வெற்றி. 💪",

    "கனவு காணுங்கள், முயற்சி செய்யுங்கள், ஒரு நாள் வெற்றி உங்களை தேடி வரும். 🚀",

    "தோல்வி என்பது முடிவு அல்ல, வெற்றிக்கான முதல் பாடம். 📚",

    "உங்கள் எதிர்காலத்தை மாற்றும் சக்தி உங்கள் கைகளில் தான் உள்ளது. 🔥",

    "இன்று நீங்கள் படிக்கும் ஒரு பக்கம், நாளைய வெற்றிக்கு ஒரு படி. ⭐",

    "கடின உழைப்புக்கு மாற்று எதுவும் இல்லை. தொடர்ந்து முயற்சி செய்யுங்கள். 🏆",

    "நேரத்தை மதிப்பவன் தான் வாழ்க்கையில் உயரத்தை அடைவான். ⏰",

    "சிறிய முன்னேற்றம் கூட பெரிய வெற்றிக்கான தொடக்கம். 🌱",

    "உங்களை நீங்கள் நம்புங்கள், உலகம் உங்களை நம்ப ஆரம்பிக்கும். 💯",

    "ஒரு நாள் வெற்றி பெறுவோம் என்று நினைக்காதீர்கள், இன்று வெற்றிக்காக உழையுங்கள். 🎯"

];



/* ==========================================
   Quote Element
========================================== */


const quoteElement =
    document.getElementById("dailyQuote");



/* ==========================================
   Show Random Quote
========================================== */


function showDailyQuote(){


    if(!quoteElement){

        return;

    }



    const randomIndex =
        Math.floor(
            Math.random() *
            dailyQuotes.length
        );



    quoteElement.textContent =
        dailyQuotes[randomIndex];


}



showDailyQuote();



/* ==========================================
   Auto Change Quote
   Every 30 Minutes
========================================== */


setInterval(

    showDailyQuote,

    30 * 60 * 1000

);



/* ==========================================
   Smooth Button Protection
========================================== */


document
.querySelectorAll(".start-btn")
.forEach(button=>{


    button.addEventListener(
        "click",
        (event)=>{


            event.stopPropagation();


        }
    );


});

/* ==========================================
   G THE GENIUS
   Dashboard JavaScript
   Part 3 Final

   Features:
   - Firestore Leaderboard Top 3
   - Student Ranking Preview
   - Final Dashboard Init
========================================== */


import {

    collection,
    getDocs,
    query,
    orderBy,
    limit

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



/* ==========================================
   Leaderboard Elements
========================================== */


const firstName =
    document.getElementById("firstName");


const secondName =
    document.getElementById("secondName");


const thirdName =
    document.getElementById("thirdName");



/* ==========================================
   Load Top 3 Students
========================================== */


async function loadTopLeaderboard(){


    try{


        const resultQuery = query(

            collection(db,"results"),

            orderBy(
                "marks",
                "desc"
            ),

            limit(3)

        );



        const snapshot =
            await getDocs(resultQuery);



        let students = [];



        snapshot.forEach((doc)=>{


            students.push(
                doc.data()
            );


        });



        if(firstName){


            firstName.textContent =
                students[0]?.name ||
                "No Student";


        }



        if(secondName){


            secondName.textContent =
                students[1]?.name ||
                "No Student";


        }



        if(thirdName){


            thirdName.textContent =
                students[2]?.name ||
                "No Student";


        }



    }

    catch(error){


        console.log(
            "Leaderboard Error:",
            error
        );



        if(firstName)
            firstName.textContent="--";


        if(secondName)
            secondName.textContent="--";


        if(thirdName)
            thirdName.textContent="--";


    }


}



loadTopLeaderboard();




/* ==========================================
   Dashboard Ready
========================================== */


window.addEventListener(
    "load",
    ()=>{


        console.log(
            "G THE GENIUS Dashboard Loaded Successfully 🚀"
        );


    }
);
