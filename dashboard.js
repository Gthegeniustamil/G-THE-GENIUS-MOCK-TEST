import { auth } from "./firebase-config.js";

import {
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const nameBox = document.getElementById("studentName");


onAuthStateChanged(auth,(user)=>{


    if(user){

        let name =
        localStorage.getItem("studentName") || "Student";


        nameBox.innerHTML = name;


    }else{


        window.location.href="index.html";


    }


});



document.getElementById("logoutBtn").onclick = function(){


    signOut(auth).then(()=>{


        localStorage.clear();


        window.location.href="index.html";


    });


};
