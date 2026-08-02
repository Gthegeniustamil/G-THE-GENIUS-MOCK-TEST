// ==========================================
// G THE GENIUS CERTIFICATE SYSTEM
// PART 1 / 3
// STUDENT DATA + CERTIFICATE GENERATION
// ==========================================


import { auth, db } from "./firebase-config.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





// ===============================
// ELEMENTS
// ===============================


const studentName =
document.getElementById(
"studentName"
);



const lessonCount =
document.getElementById(
"lessonCount"
);



const certificateLevel =
document.getElementById(
"certificateLevel"
);



const certificateDate =
document.getElementById(
"certificateDate"
);



const certificateId =
document.getElementById(
"certificateId"
);






// ===============================
// GENERATE CERTIFICATE ID
// ===============================


function generateCertificateId(){


    let year =
    new Date().getFullYear();



    let random =
    Math.floor(
        100000 +
        Math.random()*900000
    );



    return (

        "GTG-"
        +
        year
        +
        "-"
        +
        random

    );


}





// ===============================
// CERTIFICATE LEVEL
// ===============================


function getCertificateLevel(count){


    if(count >= 100){


        return "👑 G THE GENIUS Achiever";


    }


    else if(count >= 50){


        return "🥇 Silver Knowledge Hunter";


    }


    else if(count >= 25){


        return "🥉 Bronze Learner";


    }


    else{


        return "Learning In Progress";


    }


}





// ===============================
// LOAD STUDENT CERTIFICATE
// ===============================


onAuthStateChanged(
auth,
async(user)=>{


if(user){


    try{


        const ref =
        doc(

            db,

            "studentProgress",

            user.uid

        );



        const snap =
        await getDoc(ref);



        if(snap.exists()){


            let data =
            snap.data();



            let completed =

            data.completedLessons || 0;



            studentName.innerHTML =

            data.name ||
            "Student";



            lessonCount.innerHTML =

            completed;



            certificateLevel.innerHTML =

            getCertificateLevel(
                completed
            );



            certificateDate.innerHTML =

            new Date()
            .toLocaleDateString();



            certificateId.innerHTML =

            generateCertificateId();



        }



    }

    catch(error){


        console.log(
        "Certificate Load Error",
        error
        );


    }


}


});

 // ==========================================
 // G THE GENIUS CERTIFICATE SYSTEM
 // PART 2 / 3
 // SAVE CERTIFICATE + DOWNLOAD
 // ==========================================


import {

    collection,
    addDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const downloadBtn =

document.getElementById(

"downloadCertificateBtn"

);






// ===============================
// SAVE CERTIFICATE DATA
// ===============================


async function saveCertificate(){



    const user =

    auth.currentUser;



    if(!user){


        alert(
        "Please Login First"
        );


        return;


    }





    try{



        await addDoc(


            collection(

                db,

                "certificates"

            ),



            {



            userId:

            user.uid,



            studentName:

            document.getElementById(

            "studentName"

            ).innerHTML,



            level:

            document.getElementById(

            "certificateLevel"

            ).innerHTML,



            lessons:

            document.getElementById(

            "lessonCount"

            ).innerHTML,



            certificateId:

            document.getElementById(

            "certificateId"

            ).innerHTML,



            createdAt:

            serverTimestamp()



            }



        );



        console.log(

        "Certificate Saved"

        );



    }



    catch(error){



        console.log(

        "Save Error",

        error

        );


    }


}







// ===============================
// DOWNLOAD CERTIFICATE
// ===============================


if(downloadBtn){



downloadBtn.addEventListener(

"click",

async()=>{


    await saveCertificate();



    window.print();



}



);



}


 // ==========================================
 // G THE GENIUS CERTIFICATE SYSTEM
 // PART 3 / 3 FINAL
 // HISTORY + SECURITY + COMPLETE
 // ==========================================



import {

    query,
    where,
    getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ===============================
// SECURITY CHECK
// ===============================


function checkCertificateEligibility(count){



    if(count >= 25){


        return true;


    }


    return false;


}







// ===============================
// LOAD CERTIFICATE HISTORY
// ===============================


async function loadCertificateHistory(){


    const user =

    auth.currentUser;



    if(!user)
    return;



    try{


        const q =

        query(

            collection(

                db,

                "certificates"

            ),


            where(

                "userId",

                "==",

                user.uid

            )

        );





        const snapshot =

        await getDocs(q);





        console.log(

        "Certificates Found:",

        snapshot.size

        );





    }


    catch(error){


        console.log(

        "History Error",

        error

        );


    }



}







// ===============================
// AUTO START
// ===============================


onAuthStateChanged(

auth,

async(user)=>{


    if(user){


        await loadCertificateHistory();


    }


});






// ===============================
// FINAL MESSAGE
// ===============================


console.log(

"🏆 G THE GENIUS Certificate System Loaded Successfully"

);


