function startPortal(){

const name=document.getElementById("studentName").value.trim();

const district=document.getElementById("district").value;

if(name==="" || district===""){

alert("Please Enter Name and Select District");

return;

}

localStorage.setItem("studentName",name);

localStorage.setItem("district",district);

window.location.href="dashboard.html";

}
