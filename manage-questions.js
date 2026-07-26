import { db } from "./firebase-config.js";


import {

collection,
getDocs,
deleteDoc,
doc,
orderBy,
query

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const questionList =
document.getElementById("questionList");





async function loadQuestions(){


try{


const q = query(

collection(db,"questions"),

orderBy("createdAt","desc")

);



const snapshot =
await getDocs(q);



questionList.innerHTML="";



let count = 1;



snapshot.forEach((item)=>{


let data = item.data();


let id = item.id;



questionList.innerHTML += `


<div class="question-card">


<h3>

${count}. ${data.question}

</h3>


<p>
A) ${data.options[0]}
</p>


<p>
B) ${data.options[1]}
</p>


<p>
C) ${data.options[2]}
</p>


<p>
D) ${data.options[3]}
</p>



<p class="answer">

✅ Correct Answer:

${data.options[data.answer]}

</p>



<p class="explanation">

📖 ${data.explanation}

</p>




<button 
class="delete-btn"
onclick="deleteQuestion('${id}')">

🗑 Delete Question

</button>



</div>


`;



count++;


});



}

catch(error){

console.log(error);

questionList.innerHTML =
"Error Loading Questions";

}



}





// DELETE QUESTION


window.deleteQuestion = async function(id){


let confirmDelete =
confirm(
"Delete this question?"
);



if(!confirmDelete){

return;

}



try{


await deleteDoc(

doc(db,"questions",id)

);



alert(
"Question Deleted Successfully"
);



loadQuestions();



}


catch(error){


console.log(error);


alert(
"Delete Failed"
);


}



};





loadQuestions();
