import { auth, db } from "./firebase-config.js";


import {
doc,
setDoc,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



document.getElementById("registerBtn").onclick = async function(){



let name =
document.getElementById("name").value.trim();



let email =
document.getElementById("email").value.trim();



let password =
document.getElementById("password").value;



let district =
document.getElementById("district").value;






if(name==="" || email==="" || password==="" || district===""){


alert("Please Fill All Details");


return;


}






try{



// Create Firebase Account


const userCredential =

await createUserWithEmailAndPassword(

auth,

email,

password

);



const user =
userCredential.user;







// Save User Data


await setDoc(

doc(db,"students",user.uid),

{

name:name,

email:email,

district:district,

xp:0,

level:1,

createdAt:serverTimestamp()

}

);







alert("Registration Successful 🎉");



window.location.href="index.html";





}

catch(error){



alert(error.message);



}





};
