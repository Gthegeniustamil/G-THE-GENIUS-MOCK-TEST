let allMaterials = [];


// LOAD MATERIALS

document.addEventListener("DOMContentLoaded", function(){

    fetch("materials.json")

    .then(response => response.json())

    .then(data => {

        allMaterials = data;

        displayMaterials(allMaterials);

    })

    .catch(error=>{

        console.log(error);

        document.getElementById("materialsContainer").innerHTML =
        "❌ Failed to Load Materials";

    });


});




// DISPLAY MATERIALS

function displayMaterials(materials){


    const container =
    document.getElementById("materialsContainer");


    container.innerHTML = "";


    if(materials.length === 0){

        container.innerHTML =
        "No Materials Found";

        return;

    }



    materials.forEach(item=>{


        container.innerHTML += `

        <div class="material-card">


            <h3>
            📚 ${item.title}
            </h3>


            <p>
            📂 Category : ${item.category}
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


}






// SEARCH MATERIALS

function searchMaterials(){


    let text =
    document.getElementById("searchInput").value.toLowerCase();



    let filtered =
    allMaterials.filter(item=>


        item.title.toLowerCase().includes(text) ||

        item.category.toLowerCase().includes(text)


    );


    displayMaterials(filtered);


}






// CATEGORY FILTER

function filterCategory(category){


    if(category === "All"){

        displayMaterials(allMaterials);

        return;

    }



    let filtered =

    allMaterials.filter(item=>


        item.category === category


    );


    displayMaterials(filtered);


}






// OPEN PDF INSIDE PAGE

function openPDF(url){


    document.getElementById("pdfViewerBox").style.display="block";


    document.getElementById("pdfViewer").src=url;



    window.scrollTo({

        top:document.body.scrollHeight,

        behavior:"smooth"

    });


}






// BACK TO DASHBOARD

function goDashboard(){


    window.location.href="dashboard.html";


}
