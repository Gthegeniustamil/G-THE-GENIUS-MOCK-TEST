import { auth } from "./firebase-config.js";


import {

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





const loginBtn =
document.getElementById("loginBtn");





loginBtn.onclick = async function(){


let email =
document.getElementById("email").value;


let password =
document.getElementById("password").value;



let message =
document.getElementById("message");





if(email==="" || password===""){


message.innerHTML =
"⚠️ Enter Email and Password";


return;


}





try{


await signInWithEmailAndPassword(

auth,

email,

password

);



message.innerHTML =
"✅ Login Successful";



setTimeout(()=>{


window.location.href="admin.html";


},1000);



}



catch(error){


console.log(error);


message.innerHTML =
"❌ Invalid Email or Password";


}



};
