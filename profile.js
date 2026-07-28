import { db, auth } from "./firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



onAuthStateChanged(auth, async (user)=>{


    if(user){


        const uid = user.uid;


        // Student Details

        const studentRef = doc(db,"students",uid);

        const studentSnap = await getDoc(studentRef);



        if(studentSnap.exists()){


            const data = studentSnap.data();


            document.getElementById("name").innerHTML =
            data.name;


            document.getElementById("email").innerHTML =
            data.email;


            document.getElementById("district").innerHTML =
            data.district;


        }



        // Test Results

        const snapshot =
        await getDocs(collection(db,"results"));


        let total = 0;
        let best = 0;



        snapshot.forEach((doc)=>{


            let result = doc.data();


            if(result.studentName === 
            localStorage.getItem("studentName")){


                total++;


                if(result.percentage > best){

                    best = result.percentage;

                }

            }


        });



        document.getElementById("totalTests").innerHTML =
        total;


        document.getElementById("bestScore").innerHTML =
        best + "%";



    }
    else{


        window.location.href="index.html";


    }


});
