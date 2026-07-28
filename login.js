import { db, auth } from "./firebase-config.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


document.getElementById("loginBtn").onclick = async function(){

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;


    if(email === "" || password === ""){

        alert("Enter Email and Password");
        return;

    }


    try{


        const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        const uid = userCredential.user.uid;


        // Get Student Details

        const studentRef =
        doc(db,"students",uid);


        const studentSnap =
        await getDoc(studentRef);



        if(studentSnap.exists()){


            const data = studentSnap.data();


            localStorage.setItem(
                "studentName",
                data.name
            );


            localStorage.setItem(
                "district",
                data.district
            );


        }



        alert("Login Successful!");


        window.location.href =
        "dashboard.html";



    }catch(error){


        alert("Invalid Email or Password");


        console.log(error);


    }


};
