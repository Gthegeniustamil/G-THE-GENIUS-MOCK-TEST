import { auth, db } from "./firebase-config.js";


import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





document.getElementById("loginBtn").onclick = async function(){



let email =
document.getElementById("email").value.trim();



let password =
document.getElementById("password").value;





if(email==="" || password===""){


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




const user =
userCredential.user;






// Get Student Data From Firestore


const userDoc =

await getDoc(

doc(db,"users",user.uid)

);





if(userDoc.exists()){



let data =
userDoc.data();




localStorage.setItem(
"studentName",
data.name
);



localStorage.setItem(
"district",
data.district
);



}





alert("Login Successful 🎉");



window.location.href="dashboard.html";






}

catch(error){


alert("Login Failed : "+error.message);



}




};
