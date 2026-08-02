// ==========================================
// G THE GENIUS LEARNING PROGRESS SYSTEM v2
// PART 1 / 4
// XP + COINS + LEVEL SYSTEM
// ==========================================


import { auth, db } from "./firebase-config.js";


import {

    doc,
    getDoc,
    updateDoc,
    setDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===============================
// LEVEL SYSTEM
// ===============================


function calculateLevel(xp){


    if(xp >= 1000){

        return "Level 5 Genius";

    }

    else if(xp >= 500){

        return "Level 4 Expert";

    }

    else if(xp >= 250){

        return "Level 3 Scholar";

    }

    else if(xp >= 100){

        return "Level 2 Learner";

    }

    else{

        return "Level 1 Beginner";

    }

}





// ===============================
// GET STUDENT PROGRESS
// ===============================


export async function getStudentProgress(){


    const user =
    auth.currentUser;


    if(!user){

        return null;

    }



    const progressRef =
    doc(

        db,

        "studentProgress",

        user.uid

    );



    const snap =
    await getDoc(progressRef);



    if(snap.exists()){


        return snap.data();


    }

    else{


        const defaultData = {


            xp:0,

            coins:0,

            completedLessons:0,

            totalLessons:0,

            streak:0,

            level:"Level 1 Beginner",

            badges:[]


        };



        await setDoc(

            progressRef,

            defaultData

        );



        return defaultData;


    }


}





// ===============================
// ADD XP + COINS
// ===============================


export async function addLearningReward(){


    const user =
    auth.currentUser;



    if(!user)
    return;



    const progress =
    await getStudentProgress();



    let newXP =
    progress.xp + 10;



    let newCoins =
    progress.coins + 5;



    let completed =
    progress.completedLessons + 1;



    let level =
    calculateLevel(newXP);





    await updateDoc(

        doc(

            db,

            "studentProgress",

            user.uid

        ),

        {


        xp:newXP,


        coins:newCoins,


        completedLessons:completed,


        level:level


        }


    );



    console.log(
    "Reward Added:",
    newXP,
    level
    );


}

 // ==========================================
 // G THE GENIUS LEARNING PROGRESS SYSTEM v2
 // PART 2 / 4
 // DAILY STREAK + BADGES
 // ==========================================



import {

    Timestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===============================
// CHECK DAILY STREAK
// ===============================


export async function updateDailyStreak(){


    const user =
    auth.currentUser;



    if(!user)
    return;



    const progress =
    await getStudentProgress();



    let today =
    new Date();



    let streak =
    progress.streak || 0;



    let lastDate =
    progress.lastLearnDate;



    if(lastDate){


        let last =
        lastDate.toDate();



        let difference =

        Math.floor(

        (today - last)

        /

        (1000*60*60*24)

        );




        if(difference === 1){


            streak++;


        }

        else if(difference > 1){


            streak = 1;


        }


    }

    else{


        streak = 1;


    }





    let badges =
    progress.badges || [];





    // =========================
    // STREAK BADGE
    // =========================


    if(streak >= 7 &&

    !badges.includes(
    "7 Days Streak"
    )){


        badges.push(
        "🔥 7 Days Streak"
        );


    }






    await updateDoc(

        doc(

            db,

            "studentProgress",

            user.uid

        ),

        {


        streak:streak,


        lastLearnDate:
        Timestamp.fromDate(today),


        badges:badges


        }


    );



    console.log(

    "Current Streak:",
    streak

    );


}






// ===============================
// BADGE CHECK SYSTEM
// ===============================


export async function checkBadges(){


    const user =
    auth.currentUser;



    if(!user)
    return;




    const progress =
    await getStudentProgress();




    let badges =
    progress.badges || [];





    // FIRST LESSON


    if(progress.completedLessons >= 1 &&

    !badges.includes(
    "📖 First Step"
    )){


        badges.push(
        "📖 First Step"
        );


    }






    // 50 LESSONS


    if(progress.completedLessons >= 50 &&

    !badges.includes(
    "🏆 Knowledge Hunter"
    )){


        badges.push(
        "🏆 Knowledge Hunter"
        );


    }






    // 100 LESSONS


    if(progress.completedLessons >= 100 &&

    !badges.includes(
    "👑 G THE GENIUS"
    )){


        badges.push(
        "👑 G THE GENIUS"
        );


    }





    await updateDoc(

        doc(

            db,

            "studentProgress",

            user.uid

        ),

        {


        badges:badges


        }


    );


    return badges;


}

 // ==========================================
 // G THE GENIUS LEARNING PROGRESS SYSTEM v2
 // PART 3 / 4
 // PROGRESS BAR + ACHIEVEMENTS
 // ==========================================



// ===============================
// CALCULATE PROGRESS %
// ===============================


export function calculateProgress(
completedLessons,
totalLessons
){



    if(!totalLessons ||
    totalLessons === 0){


        return 0;


    }



    let percentage =

    (

    completedLessons /

    totalLessons

    )

    *100;



    return Math.round(
        percentage
    );



}






// ===============================
// LOAD DASHBOARD PROGRESS
// ===============================


export async function loadProgressUI(){



    const progress =
    await getStudentProgress();



    if(!progress)
    return;





    let percent =

    calculateProgress(

        progress.completedLessons || 0,

        progress.totalLessons || 100

    );






    const progressBar =
    document.getElementById(
    "learningProgressBar"
    );



    const progressText =
    document.getElementById(
    "learningProgressText"
    );





    if(progressBar){


        progressBar.style.width =
        percent + "%";


    }





    if(progressText){


        progressText.innerHTML =

        percent + "% Completed";


    }





    const levelBox =
    document.getElementById(
    "studentLevel"
    );



    if(levelBox){


        levelBox.innerHTML =

        progress.level;


    }




    const xpBox =
    document.getElementById(
    "studentXP"
    );



    if(xpBox){


        xpBox.innerHTML =

        progress.xp + " XP";


    }




    const coinBox =
    document.getElementById(
    "studentCoins"
    );



    if(coinBox){


        coinBox.innerHTML =

        progress.coins;


    }




}







// ===============================
// LOAD BADGES
// ===============================


export async function loadBadges(){



    const progress =
    await getStudentProgress();



    if(!progress)
    return;




    const badgeContainer =
    document.getElementById(
    "badgeContainer"
    );




    if(!badgeContainer)
    return;





    badgeContainer.innerHTML = "";





    let badges =
    progress.badges || [];





    if(badges.length === 0){



        badgeContainer.innerHTML = `


        <div class="achievement-card">


        🎯


        <h3>

        No Badge Yet

        </h3>


        <p>

        Complete lessons to unlock badges

        </p>


        </div>


        `;



        return;


    }





    badges.forEach((badge)=>{



        let div =
        document.createElement(
        "div"
        );



        div.className =
        "achievement-card";



        div.innerHTML = `


        🏆

        <h3>

        ${badge}

        </h3>


        <p>

        Achievement Unlocked

        </p>


        `;



        badgeContainer.appendChild(
        div
        );



    });



}

// ==========================================
// G THE GENIUS LEARNING PROGRESS SYSTEM v2
// PART 4 / 4 FINAL
// COMPLETE INTEGRATION
// ==========================================



// ===============================
// COMPLETE LESSON ACTION
// ===============================


export async function completeLearningLesson(){


    const user =
    auth.currentUser;



    if(!user){

        alert(
        "Please Login First"
        );

        return;

    }



    try{


        // Add XP + Coins

        await addLearningReward();



        // Update Streak

        await updateDailyStreak();



        // Check Badges

        await checkBadges();



        // Reload UI

        await loadProgressUI();


        await loadBadges();



        alert(
        "🎉 Lesson Completed!\n+10 XP\n+5 Coins"
        );



    }


    catch(error){


        console.log(
        "Completion Error:",
        error
        );


    }


}







// ===============================
// AUTO LOAD SYSTEM
// ===============================


window.addEventListener(
"load",
async()=>{


    if(auth.currentUser){


        await loadProgressUI();


        await loadBadges();


    }


});






// ===============================
// EXPORT STATUS
// ===============================


console.log(

"🚀 G THE GENIUS Progress System v2 Loaded"

);
