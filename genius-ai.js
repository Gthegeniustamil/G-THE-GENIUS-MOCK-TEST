// ==========================================
// GENIUS AI v1.0
// PART 1 / 5
// G THE GENIUS
// ==========================================

import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// ==========================================
// HTML ELEMENTS
// ==========================================

const chatMessages =
document.getElementById("chatMessages");

const userInput =
document.getElementById("userInput");

const sendBtn =
document.getElementById("sendBtn");

const typingIndicator =
document.getElementById("typingIndicator");

const loadingScreen =
document.getElementById("loadingScreen");

const newChatBtn =
document.getElementById("newChatBtn");

const clearBtn =
document.getElementById("clearBtn");




// ==========================================
// CURRENT USER
// ==========================================

let currentUser = null;

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href =
        "login.html";

        return;

    }

    currentUser = user;

    if(loadingScreen){

        loadingScreen.style.display =
        "none";

    }

});




// ==========================================
// ADD USER MESSAGE
// ==========================================

function addUserMessage(message){

    chatMessages.innerHTML += `

    <div class="message user-message">

        <div class="message-avatar">
        👨‍🎓
        </div>

        <div class="message-content">

            ${message}

        </div>

    </div>

    `;

    scrollBottom();

}





// ==========================================
// ADD AI MESSAGE
// ==========================================

function addAIMessage(message){

    chatMessages.innerHTML += `

    <div class="message ai-message">

        <div class="message-avatar">
        🤖
        </div>

        <div class="message-content">

            <h4>
            GENIUS AI
            </h4>

            <p>

            ${message}

            </p>

        </div>

    </div>

    `;

    scrollBottom();

}





// ==========================================
// SCROLL CHAT
// ==========================================

function scrollBottom(){

    chatMessages.scrollTop =
    chatMessages.scrollHeight;

}





// ==========================================
// SHOW / HIDE TYPING
// ==========================================

function showTyping(){

    typingIndicator.style.display =
    "flex";

    scrollBottom();

}

function hideTyping(){

    typingIndicator.style.display =
    "none";

}





// ==========================================
// QUICK QUESTION BUTTONS
// ==========================================

window.askSuggestion =
function(question){

    userInput.value =
    question;

    userInput.focus();

};




// ==========================================
// CLEAR CHAT
// ==========================================

clearBtn.addEventListener("click",()=>{

    chatMessages.innerHTML = "";

    addAIMessage(
    "👋 Welcome back! Ask me anything about Government Exams."
    );

});




// ==========================================
// NEW CHAT
// ==========================================

newChatBtn.addEventListener("click",()=>{

    chatMessages.innerHTML = "";

    addAIMessage(
    "🧠 New Chat Started. How can I help you today?"
    );

});




// ==========================================
// SEND BUTTON
// ==========================================

sendBtn.addEventListener("click",()=>{

    const question =
    userInput.value.trim();

    if(question==="") return;

    addUserMessage(question);

    userInput.value = "";

    showTyping();

    // AI Response வரும் Part 2-ல்

});

// ==========================================
// GENIUS AI v1.0
// PART 2 / 5
// AI ENGINE
// ==========================================


// Backend API URL
const API_URL =
"YOUR_API_ENDPOINT";




// ==========================================
// SYSTEM PROMPT
// ==========================================

const SYSTEM_PROMPT = `

You are GENIUS AI.

You are an expert Government Exam Assistant.

Your specialization:

- TNUSRB
- TNPSC
- SSC
- Railway
- Banking
- UPSC Basics
- TET
- Current Affairs
- Indian Constitution
- Indian History
- Tamil Nadu History
- Geography
- Economy
- Science
- Computer
- Aptitude
- Reasoning
- Tamil Grammar

Rules:

1. Reply in simple Tamil whenever possible.

2. If user asks in English,
reply in English.

3. Explain clearly.

4. Give short tricks whenever possible.

5. Mention important exam points.

6. If suitable,
give 3 Practice MCQs.

7. Never invent facts.

8. If Current Affairs is asked,
answer using the latest available information.

9. Keep answers exam oriented.

`;




// ==========================================
// SEND MESSAGE TO AI
// ==========================================

async function askAI(question){

    showTyping();

    try{

        const response =
        await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify({

                systemPrompt:
                SYSTEM_PROMPT,

                message:
                question,

                user:
                currentUser?.uid || ""

            })

        });

        const data =
        await response.json();

        hideTyping();

        addAIMessage(

            data.answer ||

            "⚠️ No response received."

        );

    }

    catch(error){

        console.error(error);

        hideTyping();

        addAIMessage(

        "❌ Unable to connect to GENIUS AI. Please try again."

        );

    }

}




// ==========================================
// SEND BUTTON
// ==========================================

sendBtn.onclick = async()=>{

    const question =
    userInput.value.trim();

    if(question==="") return;

    addUserMessage(question);

    userInput.value="";

    await askAI(question);

};




// ==========================================
// ENTER KEY
// ==========================================

userInput.addEventListener(

"keydown",

async(e)=>{

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendBtn.click();

    }

});

// ==========================================
// GENIUS AI v1.0
// PART 3 / 5
// PREMIUM FEATURES
// ==========================================


// ==========================================
// HTML ELEMENTS
// ==========================================

const voiceBtn =
document.getElementById("voiceBtn");

const copyBtn =
document.getElementById("copyBtn");

const shareBtn =
document.getElementById("shareBtn");

const bookmarkBtn =
document.getElementById("bookmarkBtn");



// ==========================================
// LAST AI RESPONSE
// ==========================================

let lastAIResponse = "";



// Override AI Message Function
function addAIMessage(message){

    lastAIResponse = message;

    chatMessages.innerHTML += `

    <div class="message ai-message">

        <div class="message-avatar">

        🤖

        </div>

        <div class="message-content">

            <h4>

            GENIUS AI

            </h4>

            <p>

            ${message}

            </p>

        </div>

    </div>

    `;

    scrollBottom();

}



// ==========================================
// VOICE INPUT
// ==========================================

voiceBtn.addEventListener("click",()=>{

    if(!("webkitSpeechRecognition" in window)){

        alert("Voice input is not supported.");

        return;

    }

    const recognition =
    new webkitSpeechRecognition();

    recognition.lang = "ta-IN";

    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event)=>{

        const text =
        event.results[0][0].transcript;

        userInput.value = text;

    };

});




// ==========================================
// COPY RESPONSE
// ==========================================

copyBtn.addEventListener(

"click",

async()=>{

    if(lastAIResponse===""){

        alert("No response available.");

        return;

    }

    await navigator.clipboard.writeText(
    lastAIResponse
    );

    alert("Response Copied.");

});




// ==========================================
// SHARE RESPONSE
// ==========================================

shareBtn.addEventListener(

"click",

async()=>{

    if(lastAIResponse==="") return;

    if(navigator.share){

        navigator.share({

            title:"GENIUS AI",

            text:lastAIResponse

        });

    }

});




// ==========================================
// BOOKMARK
// ==========================================

bookmarkBtn.addEventListener(

"click",()=>{

    if(lastAIResponse===""){

        alert("Nothing to bookmark.");

        return;

    }

    const bookmarks =

    JSON.parse(

    localStorage.getItem(
    "geniusBookmarks"
    ) || "[]"

    );

    bookmarks.push({

        text:lastAIResponse,

        date:new Date().toLocaleString()

    });

    localStorage.setItem(

    "geniusBookmarks",

    JSON.stringify(bookmarks)

    );

    alert("Bookmarked Successfully.");

});




// ==========================================
// READ ALOUD
// ==========================================

function speak(text){

    speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(text);

    speech.lang = "ta-IN";

    speech.rate = 1;

    speech.pitch = 1;

    speechSynthesis.speak(speech);

}


// ==========================================
// GENIUS AI v1.0
// PART 5 / 5 FINAL
// G THE GENIUS
// ==========================================


// ==========================================
// AUTO RESIZE TEXTAREA
// ==========================================

userInput.addEventListener("input",()=>{

    userInput.style.height = "60px";

    userInput.style.height =
    userInput.scrollHeight + "px";

});




// ==========================================
// WELCOME MESSAGE
// ==========================================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        addAIMessage(`

👋 வணக்கம்!

நான் GENIUS AI.

Government Exam Assistant.

📚 TNUSRB

🏛 TNPSC

🚆 Railway

🏦 Banking

💼 SSC

🌍 Current Affairs

📖 History

⚖ Constitution

🔬 Science

💻 Computer

➗ Aptitude

🧩 Reasoning

உங்கள் கேள்வியை தமிழிலோ அல்லது ஆங்கிலத்திலோ கேளுங்கள்.

`);

    },800);

});




// ==========================================
// SAMPLE QUESTIONS
// ==========================================

const sampleQuestions = [

"TNUSRB Syllabus",

"Today's Current Affairs",

"Indian Constitution",

"Indian History",

"Geography Notes",

"Science MCQ",

"Reasoning Tricks",

"Group 4 Study Plan",

"Police Exam Tips",

"Economy Notes"

];




// ==========================================
// RANDOM QUESTION
// ==========================================

function showRandomSuggestion(){

    const random =

    sampleQuestions[
    Math.floor(
    Math.random() *
    sampleQuestions.length
    )
    ];

    userInput.placeholder =
    "💬 " + random;

}

setInterval(

showRandomSuggestion,

5000

);




// ==========================================
// SAVE LAST QUESTION
// ==========================================

function saveLastQuestion(question){

    localStorage.setItem(

        "lastQuestion",

        question

    );

}




// ==========================================
// RESTORE LAST QUESTION
// ==========================================

const lastQuestion =

localStorage.getItem(
"lastQuestion"
);

if(lastQuestion){

    userInput.value =
    lastQuestion;

}




// ==========================================
// SAVE BEFORE SEND
// ==========================================

const oldAskAI = askAI;

askAI = async(question)=>{

    saveLastQuestion(question);

    await oldAskAI(question);

};




// ==========================================
// NETWORK CHECK
// ==========================================

window.addEventListener(

"offline",

()=>{

addAIMessage(

"❌ Internet connection lost."

);

});



window.addEventListener(

"online",

()=>{

addAIMessage(

"✅ Internet connected."

);

});




// ==========================================
// SYSTEM READY
// ==========================================

console.log(

"🧠 GENIUS AI Loaded Successfully."

);

console.log(

"G THE GENIUS v5.0"

);
