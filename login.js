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



if(email === "" || password === ""){

alert("Enter Email and Password");

return;

}



try{


let result =
await signInWithEmailAndPassword(
auth,
email,
password
);



let user = result.user;



let userData =
await getDoc(
doc(db,"students",user.uid)
);



if(userData.exists()){


localStorage.setItem(
"studentName",
userData.data().name
);

localStorage.setItem(
"email",
user.email
);
  
localStorage.setItem(
"district",
userData.data().district
);


}



alert("Login Successful 🎉");


window.location.href="dashboard.html";


}


catch(error){


alert(
"Login Failed : "+error.code
);


console.log(error);


}


};
