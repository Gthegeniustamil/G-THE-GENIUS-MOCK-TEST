// ==========================================
// GENIUS AI BACKEND
// PART 2 / 5
// G THE GENIUS
// ==========================================

const functions =
require("firebase-functions");

const admin =
require("firebase-admin");

const cors =
require("cors")({
    origin: true
});

require("dotenv").config();

const OpenAI =
require("openai");



// ==========================================
// FIREBASE INIT
// ==========================================

admin.initializeApp();

const db =
admin.firestore();



// ==========================================
// OPENAI
// ==========================================

const client =
new OpenAI({

    apiKey:
    process.env.OPENAI_API_KEY

});




// ==========================================
// GENIUS AI API
// ==========================================

exports.geniusAI =

functions.https.onRequest(

(req,res)=>{

cors(req,res,async()=>{

try{

    if(req.method!=="POST"){

        return res.status(405).json({

            success:false,

            message:
            "Only POST requests are allowed."

        });

    }

    const {

        message,

        user,

        systemPrompt

    } = req.body;



    if(!message){

        return res.status(400).json({

            success:false,

            message:
            "Message is required."

        });

    }

    // Part 3:
    // OpenAI Chat Completion வரும்

}
catch(error){

    console.error(error);

    res.status(500).json({

        success:false,

        message:
        "Internal Server Error"

    });

}

});

});
// ==========================================
// GENIUS AI BACKEND
// PART 3 / 5
// OPENAI RESPONSE
// ==========================================

const completion = await client.responses.create({

    model: "gpt-5.5",

    input: [
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: message
        }
    ],

    temperature: 0.5,

    max_output_tokens: 1200

});



// ==========================================
// AI RESPONSE
// ==========================================

const aiAnswer =

completion.output_text ||

"Sorry, I couldn't generate a response.";





// ==========================================
// SAVE CHAT
// ==========================================

await db
.collection("ai_chats")
.add({

    uid: user || "guest",

    question: message,

    answer: aiAnswer,

    createdAt:
    admin.firestore.FieldValue.serverTimestamp()

});




// ==========================================
// RETURN RESPONSE
// ==========================================

return res.status(200).json({

    success: true,

    answer: aiAnswer

});

// ==========================================
// GENIUS AI BACKEND
// PART 4 / 5
// SECURITY
// ==========================================


// ==========================================
// DAILY LIMIT
// ==========================================

const today = new Date();

today.setHours(0,0,0,0);

const usageQuery = await db
.collection("ai_chats")
.where("uid","==",user)
.where(
    "createdAt",
    ">=",
    today
)
.get();

const dailyUsage =
usageQuery.size;

if(dailyUsage >= 100){

    return res.status(429).json({

        success:false,

        answer:
        "⚠️ Daily AI limit reached. Please try again tomorrow."

    });

}



// ==========================================
// QUESTION VALIDATION
// ==========================================

if(message.length > 3000){

    return res.status(400).json({

        success:false,

        answer:
        "Question is too long."

    });

}



// ==========================================
// SAVE ANALYTICS
// ==========================================

await db
.collection("ai_analytics")
.add({

    uid:user,

    questionLength:
    message.length,

    createdAt:
    admin.firestore.FieldValue.serverTimestamp(),

    model:"gpt-5.5"

});




// ==========================================
// RESPONSE LOG
// ==========================================

console.log({

    user,

    question:

    message.substring(0,100),

    usage:

    dailyUsage + 1

});




// ==========================================
// ERROR RESPONSE
// ==========================================

}catch(error){

    console.error(

    "GENIUS AI Error:",

    error

    );

    return res.status(500).json({

        success:false,

        answer:
        "❌ GENIUS AI is temporarily unavailable. Please try again later."

    });

}

