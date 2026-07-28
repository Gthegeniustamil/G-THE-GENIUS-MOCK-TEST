import { db, auth } from "./firebase-config.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("registerBtn").onclick = async function(){

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const district = document.getElementById("district").value;
    const password = document.getElementById("password").value;

    if(!name || !email || !mobile || !district || !password){
        alert("Please fill all fields");
        return;
    }

    try{

        const userCredential =
        await createUserWithEmailAndPassword(auth,email,password);

        await setDoc(doc(db,"students",userCredential.user.uid),{

            name:name,
            email:email,
            mobile:mobile,
            district:district,
            createdAt:serverTimestamp()

        });

        alert("Registration Successful!");

        window.location.href="index.html";

    }catch(error){

        alert(error.message);

    }

};
