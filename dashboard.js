import { auth } from "./firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Check Login

onAuthStateChanged(auth, (user)=>{


    if(user){


        let name =
        localStorage.getItem("studentName") || "Student";


        document.getElementById("studentName").innerHTML = name;


    }
    else{


        window.location.href = "index.html";


    }


});



// Logout

document.getElementById("logoutBtn").onclick = function(){


    signOut(auth).then(()=>{


        localStorage.clear();

        alert("Logged Out Successfully");


        window.location.href="index.html";


    });


};
