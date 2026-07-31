// ===========================================================
// G THE GENIUS MOCK TEST PORTAL
// COMMON.JS
// PART 1
// ===========================================================


// ===========================================================
// SPLASH SCREEN
// ===========================================================

window.addEventListener("load", () => {

    const splash =
        document.getElementById("splashScreen");

    if (!splash) return;

    setTimeout(() => {

        splash.style.opacity = "0";

        splash.style.pointerEvents = "none";

        setTimeout(() => {

            splash.remove();

        }, 600);

    }, 1800);

});



// ===========================================================
// ACTIVE BOTTOM NAVIGATION
// ===========================================================

const currentPage =
    window.location.pathname
    .split("/")
    .pop();

document.querySelectorAll(".bottom-nav a")
.forEach(link => {

    const href =
        link.getAttribute("href");

    if (href === currentPage) {

        link.classList.add("active");

    }

});



// ===========================================================
// SCROLL TO TOP
// ===========================================================

export function scrollTopPage() {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// ===========================================================
// SHOW MESSAGE
// ===========================================================

export function showToast(message){

    let toast =
        document.getElementById("toast");

    if(!toast){

        toast =
            document.createElement("div");

        toast.id="toast";

        document.body.appendChild(toast);

    }

    toast.innerHTML=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}



// ===========================================================
// LOADING
// ===========================================================

export function showLoading(){

    let loading =
        document.getElementById("loading");

    if(loading){

        loading.style.display="flex";

    }

}

export function hideLoading(){

    let loading =
        document.getElementById("loading");

    if(loading){

        loading.style.display="none";

    }

}

// ===========================================================
// COMMON.JS
// PART 2
// ===========================================================


// ===========================================================
// LOGOUT
// ===========================================================

import { auth } from "./firebase-config.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


export async function logout(){

    const ok = confirm(
        "Are you sure you want to logout?"
    );

    if(!ok) return;

    try{

        await signOut(auth);

        localStorage.clear();

        sessionStorage.clear();

        window.location.href = "login.html";

    }

    catch(error){

        console.error(error);

        alert("Logout Failed");

    }

}



// ===========================================================
// SHARE RESULT
// ===========================================================

export async function shareText(text){

    try{

        if(navigator.share){

            await navigator.share({

                title:"G THE GENIUS",

                text:text

            });

        }

        else{

            copyText(text);

        }

    }

    catch(error){

        console.log(error);

    }

}



// ===========================================================
// COPY TEXT
// ===========================================================

export function copyText(text){

    navigator.clipboard
    .writeText(text)
    .then(()=>{

        showToast("Copied Successfully");

    });

}



// ===========================================================
// OPEN LINKS
// ===========================================================

export function openYoutube(){

window.open(

"https://youtube.com/@gthegeniustamil?si=i7kSyD_2rmnE7zH7",

"_blank"

);

}



export function openTelegram(){

window.open(

"https://t.me/gthegenius",

"_blank"

);

}



export function sendMail(){

window.location.href=

"mailto:gthegenius7@gmail.com";

}



// ===========================================================
// DATE FORMAT
// ===========================================================

export function formatDate(date){

const d=new Date(date);

return d.toLocaleDateString(

"en-IN",

{

day:"2-digit",

month:"short",

year:"numeric"

}

);

}



// ===========================================================
// TIME FORMAT
// ===========================================================

export function formatTime(seconds){

const min=Math.floor(seconds/60);

const sec=seconds%60;

return

`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}



// ===========================================================
// RANDOM NUMBER
// ===========================================================

export function random(min,max){

return Math.floor(

Math.random()*(max-min+1)

)+min;

}



// ===========================================================
// SHUFFLE ARRAY
// ===========================================================

export function shuffle(array){

for(

let i=array.length-1;

i>0;

i--

){

const j=Math.floor(

Math.random()*(i+1)

);

[array[i],array[j]]=

[array[j],array[i]];

}

return array;

}

// ===========================================================
// COMMON.JS
// PART 3 (FINAL)
// ===========================================================


// ===========================================================
// NETWORK STATUS
// ===========================================================

window.addEventListener("online",()=>{

    showToast("✅ Internet Connected");

});


window.addEventListener("offline",()=>{

    showToast("❌ No Internet Connection");

});



// ===========================================================
// CHECK INTERNET
// ===========================================================

export function isOnline(){

    return navigator.onLine;

}



// ===========================================================
// APP VERSION
// ===========================================================

export const APP_INFO={

    name:"G THE GENIUS",

    version:"6.0.0",

    developer:"G THE GENIUS",

    year:new Date().getFullYear()

};



// ===========================================================
// FOOTER COPYRIGHT YEAR
// ===========================================================

document.addEventListener("DOMContentLoaded",()=>{

    const year=document.getElementById("copyrightYear");

    if(year){

        year.textContent=new Date().getFullYear();

    }

});



// ===========================================================
// CONFIRM DIALOG
// ===========================================================

export function confirmAction(message){

    return confirm(message);

}



// ===========================================================
// SAFE JSON PARSE
// ===========================================================

export function parseJSON(data){

    try{

        return JSON.parse(data);

    }

    catch{

        return null;

    }

}



// ===========================================================
// LOCAL STORAGE HELPERS
// ===========================================================

export function saveLocal(key,value){

    localStorage.setItem(

        key,

        JSON.stringify(value)

    );

}



export function loadLocal(key){

    const data=

        localStorage.getItem(key);

    if(!data) return null;

    return parseJSON(data);

}



export function removeLocal(key){

    localStorage.removeItem(key);

}



// ===========================================================
// PAGE LOADER
// ===========================================================

document.addEventListener("DOMContentLoaded",()=>{

    hideLoading();

});



// ===========================================================
// PAGE TOP BUTTON
// ===========================================================

window.addEventListener("scroll",()=>{

    const btn=

        document.getElementById("topButton");

    if(!btn) return;

    if(window.scrollY>300){

        btn.style.display="flex";

    }

    else{

        btn.style.display="none";

    }

});



// ===========================================================
// GO TO TOP
// ===========================================================

export function goTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// ===========================================================
// FINAL INITIALIZATION
// ===========================================================

console.log(

"===================================="

);

console.log(

"G THE GENIUS v6.0 Loaded"

);

console.log(

"===================================="

);
