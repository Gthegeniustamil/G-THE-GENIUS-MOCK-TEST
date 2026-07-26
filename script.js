function startPortal() {

    const studentName = document.getElementById("studentName").value.trim();
    const district = document.getElementById("district").value;

    if (studentName === "") {
        alert("Please Enter Student Name");
        return;
    }

    if (district === "") {
        alert("Please Select District");
        return;
    }

    localStorage.setItem("studentName", studentName);
    localStorage.setItem("district", district);

    window.location.href = "dashboard.html";
}
