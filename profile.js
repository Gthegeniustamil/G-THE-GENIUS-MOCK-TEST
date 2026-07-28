import { auth, db } from "./firebase-config.js";


import {
doc,
getDoc,
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





async function loadProfile(){


const user = auth.currentUser;



if(!user){

alert("Please Login First");

window.location.href="index.html";

return;

}




// Load User Data

const userDoc = await getDoc(

doc(db,"users",user.uid)

);



if(userDoc.exists()){


let data = userDoc.data();



document.getElementById("studentName").innerHTML =
data.name;


document.getElementById("email").innerHTML =
data.email;


document.getElementById("district").innerHTML =
data.district;


}







// Load Test Results


const resultSnapshot =

await getDocs(

query(

collection(db,"results"),

where("studentName","==",

localStorage.getItem("studentName"))

)

);





let total = 0;

let best = 0;

let totalPercentage = 0;



resultSnapshot.forEach((doc)=>{


let data = doc.data();


total++;


if(data.percentage > best){

best = data.percentage;

}


totalPercentage += data.percentage;



});





let average = 0;



if(total > 0){

average =
Math.round(totalPercentage / total);

}





document.getElementById("totalTests").innerHTML =
total;



document.getElementById("bestScore").innerHTML =
best+"%";



document.getElementById("averageScore").innerHTML =
average+"%";





}



loadProfile();
