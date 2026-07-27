document.addEventListener("DOMContentLoaded", function(){


fetch("materials.json")

.then(response => response.json())

.then(materials => {


const container = document.getElementById("materialsContainer");


container.innerHTML = "";


materials.forEach(item => {


container.innerHTML += `

<div class="material-card">


<h3>
📚 ${item.title}
</h3>


<p>
<b>Category:</b> ${item.category}
</p>


<p>
${item.description}
</p>


<button onclick="openPDF('${item.pdf}')">

📖 Read Now

</button>


</div>

`;


});


})


.catch(error => {


console.log(error);


document.getElementById("materialsContainer").innerHTML =
"Failed to Load Materials";


});


});



function goDashboard(){

window.location.href="dashboard.html";

}


function openPDF(url){

document.getElementById("pdfViewerBox").style.display="block";

document.getElementById("pdfViewer").src=url;

window.scrollTo({
top:document.body.scrollHeight,
behavior:"smooth"
});

}
