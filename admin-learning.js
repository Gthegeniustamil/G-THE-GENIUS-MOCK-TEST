// ==========================================
// G THE GENIUS
// ADMIN LEARNING JS
// PART 1 / 5
// ==========================================

// Firebase Config
import { auth, db } from "./firebase-config.js";

// Firebase
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

    collection,
    addDoc,
    getDocs,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const subject = document.getElementById("subject");

const topic = document.getElementById("topic");

const title = document.getElementById("title");

const content = document.getElementById("content");

const image = document.getElementById("image");

const pdf = document.getElementById("pdf");

const youtube = document.getElementById("youtube");

const saveLesson = document.getElementById("saveLesson");

const clearForm = document.getElementById("clearForm");

const lessonTable = document.getElementById("lessonTable");

const lessonCount = document.getElementById("lessonCount");

const subjectCount = document.getElementById("subjectCount");

const topicCount = document.getElementById("topicCount");

const todayUploads = document.getElementById("todayUploads");


// ==========================================
// LOGIN CHECK
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    if (user.email !== "gthegenius7@gmail.com") {

        alert("Access Denied");

        window.location.href = "dashboard.html";

        return;

    }

    loadLessons();

});


// ==========================================
// SAVE LESSON
// ==========================================

saveLesson.addEventListener("click", async () => {

    if (
        subject.value === "" ||
        topic.value === "" ||
        title.value === "" ||
        content.value === ""
    ) {

        alert("Please fill all required fields.");

        return;

    }

    try {

        await addDoc(
            collection(db, "learning"),
            {

                subject: subject.value,

                topic: topic.value,

                title: title.value,

                content: content.value,

                image: image.value,

                pdf: pdf.value,

                youtube: youtube.value,

                createdAt: serverTimestamp()

            }
        );

        alert("✅ Lesson Saved Successfully");

        clearLessonForm();

        loadLessons();

    }

    catch (error) {

        console.error(error);

        alert("Failed to Save Lesson");

    }

});
// ==========================================
// ADMIN LEARNING JS
// PART 2 / 5
// LOAD LESSONS + DASHBOARD STATS
// ==========================================

async function loadLessons() {

    try {

        const snapshot = await getDocs(
            collection(db, "learning")
        );

        lessonTable.innerHTML = "";

        let count = 0;

        const subjects = new Set();

        const topics = new Set();

        let today = 0;

        const todayDate = new Date().toDateString();

        snapshot.forEach((doc) => {

            count++;

            const data = doc.data();

            subjects.add(data.subject);

            topics.add(data.topic);

            // Today's Upload Count
            if (data.createdAt) {

                const uploadDate =
                    data.createdAt.toDate().toDateString();

                if (uploadDate === todayDate) {

                    today++;

                }

            }

            lessonTable.innerHTML += `

<tr>

<td>${count}</td>

<td>${data.subject || "-"}</td>

<td>${data.topic || "-"}</td>

<td>${data.title || "-"}</td>

<td>

${data.pdf
? "📄"
: "-"}

</td>

<td>

${data.youtube
? "▶"
: "-"}

</td>

<td>

<button
class="edit-btn"
onclick="editLesson('${doc.id}')">

✏ Edit

</button>

<button
class="delete-btn"
onclick="deleteLesson('${doc.id}')">

🗑 Delete

</button>

</td>

</tr>

`;

        });

        // Dashboard Cards

        lessonCount.innerHTML = count;

        subjectCount.innerHTML = subjects.size;

        topicCount.innerHTML = topics.size;

        todayUploads.innerHTML = today;

        // Empty Message

        if (count === 0) {

            lessonTable.innerHTML = `

<tr>

<td colspan="7">

No Lessons Found

</td>

</tr>

`;

        }

    }

    catch (error) {

        console.log(

            "Load Lesson Error",

            error

        );

    }

}

// ==========================================
// ADMIN LEARNING JS
// PART 3 / 5
// EDIT + DELETE + CLEAR FORM
// ==========================================

import {

doc,
getDoc,
updateDoc,
deleteDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let editingId = null;

// ==========================================
// EDIT LESSON
// ==========================================

window.editLesson = async function(id){

    try{

        const lessonRef = doc(db,"learning",id);

        const lessonSnap = await getDoc(lessonRef);

        if(!lessonSnap.exists()){

            alert("Lesson Not Found");

            return;

        }

        const data = lessonSnap.data();

        subject.value = data.subject || "";

        topic.value = data.topic || "";

        title.value = data.title || "";

        content.value = data.content || "";

        image.value = data.image || "";

        pdf.value = data.pdf || "";

        youtube.value = data.youtube || "";

        editingId = id;

        saveLesson.innerHTML = "💾 Update Lesson";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.log(error);

        alert("Unable to Load Lesson");

    }

};


// ==========================================
// UPDATE LESSON
// ==========================================

saveLesson.addEventListener("click", async()=>{

    if(editingId===null) return;

    try{

        await updateDoc(doc(db,"learning",editingId),{

            subject:subject.value,

            topic:topic.value,

            title:title.value,

            content:content.value,

            image:image.value,

            pdf:pdf.value,

            youtube:youtube.value

        });

        alert("✅ Lesson Updated");

        editingId = null;

        saveLesson.innerHTML = "💾 Save Lesson";

        clearLessonForm();

        loadLessons();

    }

    catch(error){

        console.log(error);

        alert("Update Failed");

    }

});


// ==========================================
// DELETE LESSON
// ==========================================

window.deleteLesson = async function(id){

    const ok = confirm(

        "Delete this Lesson?"

    );

    if(!ok) return;

    try{

        await deleteDoc(

            doc(db,"learning",id)

        );

        alert("🗑 Lesson Deleted");

        loadLessons();

    }

    catch(error){

        console.log(error);

        alert("Delete Failed");

    }

};


// ==========================================
// CLEAR FORM
// ==========================================

function clearLessonForm(){

    subject.value="";

    topic.value="";

    title.value="";

    content.value="";

    image.value="";

    pdf.value="";

    youtube.value="";

}

clearForm.addEventListener("click",()=>{

    editingId=null;

    saveLesson.innerHTML="💾 Save Lesson";

    clearLessonForm();

});

console.log("Edit/Delete Module Ready ✅");

// ==========================================
// ADMIN LEARNING JS
// PART 4 / 5
// SAVE / UPDATE (FINAL)
// ==========================================

saveLesson.addEventListener("click", async () => {

    if (
        subject.value.trim() === "" ||
        topic.value.trim() === "" ||
        title.value.trim() === "" ||
        content.value.trim() === ""
    ) {
        alert("Please fill all required fields.");
        return;
    }

    try {

        // UPDATE
        if (editingId) {

            await updateDoc(doc(db, "learning", editingId), {

                subject: subject.value,
                topic: topic.value,
                title: title.value,
                content: content.value,
                image: image.value,
                pdf: pdf.value,
                youtube: youtube.value

            });

            alert("✅ Lesson Updated Successfully");

            editingId = null;

            saveLesson.innerHTML = "💾 Save Lesson";

        }

        // SAVE
        else {

            await addDoc(collection(db, "learning"), {

                subject: subject.value,
                topic: topic.value,
                title: title.value,
                content: content.value,
                image: image.value,
                pdf: pdf.value,
                youtube: youtube.value,
                createdAt: serverTimestamp()

            });

            alert("✅ Lesson Added Successfully");

        }

        clearLessonForm();

        loadLessons();

    }

    catch (error) {

        console.log(error);

        alert("Operation Failed");

    }

});

// ==========================================
// G THE GENIUS
// ADMIN LEARNING JS
// PART 5 / 5
// SEARCH + BULK UPLOAD + FINAL
// ==========================================

// ---------- SEARCH ----------

const searchBox = document.getElementById("searchLesson");

if (searchBox) {

    searchBox.addEventListener("keyup", () => {

        const value = searchBox.value.toLowerCase();

        const rows = lessonTable.querySelectorAll("tr");

        rows.forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display =
                text.includes(value)
                ? ""
                : "none";

        });

    });

}

// ---------- BULK UPLOAD ----------

const bulkFile = document.getElementById("bulkFile");

const uploadBulkBtn =
document.getElementById("uploadBulkBtn");

const uploadStatus =
document.getElementById("uploadStatus");

if(uploadBulkBtn){

uploadBulkBtn.addEventListener("click",()=>{

if(!bulkFile.files.length){

uploadStatus.innerHTML =
"❌ Please Select CSV File";

return;

}

uploadStatus.innerHTML =
"✅ Bulk Upload Module Ready";

alert(

"Bulk Upload Integration will be connected in next update."

);

});

}

// ---------- REFRESH ----------

window.refreshLessons=function(){

loadLessons();

}

// ---------- DASHBOARD ----------

setInterval(()=>{

loadLessons();

},60000);

// ---------- READY ----------

console.log(
"================================"
);

console.log(
"G THE GENIUS"
);

console.log(
"Learning Admin Ready"
);

console.log(
"Version : 1.0"
);

console.log(
"================================");
// ==========================================
// BULK CSV UPLOAD
// PART 1
// ==========================================

uploadBulkBtn.addEventListener("click", () => {

    if (!bulkFile.files.length) {

        alert("Please Select CSV File");

        return;

    }

    const file = bulkFile.files[0];

    Papa.parse(file, {

        header: true,

        skipEmptyLines: true,

        complete: async function(results) {

            const lessons = results.data;

            let success = 0;

            let failed = 0;

            uploadStatus.innerHTML =
            "Uploading...";

            for (const lesson of lessons) {

                try {

                    await addDoc(

                        collection(db, "learning"),

                        {

                            subject:
                            lesson.Subject || "",

                            topic:
                            lesson.Topic || "",

                            title:
                            lesson.Title || "",

                            content:
                            lesson.Content || "",

                            image:
                            lesson.Image || "",

                            pdf:
                            lesson.PDF || "",

                            youtube:
                            lesson.YouTube || "",

                            createdAt:
                            serverTimestamp()

                        }

                    );

                    success++;

                }

                catch (e) {

                    console.log(e);

                    failed++;

                }

            }

            uploadStatus.innerHTML =

            `✅ Success : ${success}
            ❌ Failed : ${failed}`;

            loadLessons();

        }

    });

});

