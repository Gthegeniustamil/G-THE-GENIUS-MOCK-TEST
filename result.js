// ============================================================
// G THE GENIUS - UNIVERSAL RESULT PAGE
// Practice + Daily + Weekly + Monthly Mock Test
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // DOM
    // ========================================================

    const scoreValue = document.getElementById("scoreValue");
    const totalCount = document.getElementById("totalCount");
    const correctCount = document.getElementById("correctCount");
    const wrongCount = document.getElementById("wrongCount");
    const skippedCount = document.getElementById("skippedCount");

    const reviewList = document.getElementById("reviewList");

    const resultTitle = document.getElementById("resultTitle");
    const resultSubtitle = document.getElementById("resultSubtitle");
    const resultIcon = document.getElementById("resultIcon");

    const retryBtn = document.getElementById("retryBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");
    const homeBtn = document.getElementById("homeBtn");

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    // ========================================================
    // FIND RESULT
    // ========================================================

    const resultData = findResultData();


    if (!resultData) {

        showNoResult();

        return;

    }


    console.log(
        "G THE GENIUS Result:",
        resultData
    );


    // ========================================================
    // NORMALIZE RESULT
    // ========================================================

    const normalized =
        normalizeResult(resultData);


    // ========================================================
    // DISPLAY SUMMARY
    // ========================================================

    scoreValue.textContent =
        normalized.score;

    totalCount.textContent =
        normalized.total;

    correctCount.textContent =
        normalized.correct;

    wrongCount.textContent =
        normalized.wrong;

    skippedCount.textContent =
        normalized.skipped;


    // ========================================================
    // RESULT MESSAGE
    // ========================================================

    showResultMessage(
        normalized.correct,
        normalized.total
    );


    // ========================================================
    // QUESTIONS
    // ========================================================

    const questions =
        normalized.questions;


    if (
        questions.length > 0
    ) {

        renderQuestions(
            questions,
            "all"
        );

    }

    else {

        reviewList.innerHTML = `
            <div class="empty-review">
                📭 Question review data கிடைக்கவில்லை.
            </div>
        `;

    }


    // ========================================================
    // FILTER BUTTONS
    // ========================================================

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );

                    button.classList.add(
                        "active"
                    );

                    renderQuestions(
                        questions,
                        button.dataset.filter
                    );

                }
            );

        }
    );


    // ========================================================
    // RETRY
    // ========================================================

    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            () => {

                const testType =
                    normalized.testType;

                if (
                    testType === "practice"
                ) {

                    window.location.href =
                        "practice.html";

                }

                else {

                    window.location.href =
                        "mocktest.html";

                }

            }
        );

    }


    // ========================================================
    // DASHBOARD
    // ========================================================

    if (dashboardBtn) {

        dashboardBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    if (homeBtn) {

        homeBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    // ========================================================
    // FIND RESULT DATA
    // ========================================================

    function findResultData() {

        // ----------------------------------------------------
        // 1. Practice result
        // ----------------------------------------------------

        const practice =
            getLocalStorageObject(
                "practiceResult"
            );

        if (
            isValidResult(practice)
        ) {

            return practice;

        }


        // ----------------------------------------------------
        // 2. Common result keys
        // ----------------------------------------------------

        const possibleKeys = [

            "mockTestResult",
            "mocktestResult",
            "testResult",
            "resultData",
            "lastResult",
            "latestResult",
            "result",
            "mockResult",
            "examResult"

        ];


        for (
            const key of possibleKeys
        ) {

            const data =
                getLocalStorageObject(
                    key
                );

            if (
                isValidResult(data)
            ) {

                return data;

            }

        }


        // ----------------------------------------------------
        // 3. Search every localStorage item
        // ----------------------------------------------------

        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const key =
                localStorage.key(i);

            if (!key) continue;


            const data =
                getLocalStorageObject(
                    key
                );


            if (
                isValidResult(data)
            ) {

                return data;

            }

        }


        return null;

    }


    // ========================================================
    // LOCAL STORAGE OBJECT
    // ========================================================

    function getLocalStorageObject(key) {

        try {

            const value =
                localStorage.getItem(
                    key
                );

            if (!value) {

                return null;

            }


            return JSON.parse(
                value
            );

        }

        catch (error) {

            return null;

        }

    }


    // ========================================================
    // VALID RESULT
    // ========================================================

    function isValidResult(data) {

        if (!data) {

            return false;

        }


        // Questions array

        if (
            Array.isArray(
                data.questions
            ) &&
            data.questions.length > 0
        ) {

            return true;

        }


        // Score based result

        if (
            data.score !== undefined &&
            (
                data.total !== undefined ||
                data.correct !== undefined
            )
        ) {

            return true;

        }


        return false;

    }


    // ========================================================
    // NORMALIZE RESULT
    // ========================================================

    function normalizeResult(data) {

        let questions =
            Array.isArray(
                data.questions
            )
                ? data.questions
                : [];


        // ----------------------------------------------------
        // If questions are stored separately
        // ----------------------------------------------------

        if (
            questions.length === 0
        ) {

            const storedQuestions =
                getQuestionsFromStorage();

            if (
                storedQuestions.length > 0
            ) {

                questions =
                    storedQuestions;

            }

        }


        // ----------------------------------------------------
        // Convert question format
        // ----------------------------------------------------

        questions =
            questions.map(
                (q, index) => {

                    const correctAnswer =
                        getCorrectAnswer(q);

                    const userAnswer =
                        getUserAnswer(q, index);


                    return {

                        question:
                            q.question ||
                            q.text ||
                            q.questionText ||
                            "",

                        options:
                            getOptions(q),

                        correctAnswer:
                            correctAnswer,

                        userAnswer:
                            userAnswer,

                        explanation:
                            q.explanation ||
                            q.Explanation ||
                            q.answerExplanation ||
                            "",

                        subject:
                            q.subject ||
                            q.Subject ||
                            ""

                    };

                }
            );


        // ----------------------------------------------------
        // Calculate counts from questions
        // ----------------------------------------------------

        let correct =
            0;

        let wrong =
            0;

        let skipped =
            0;


        questions.forEach(
            q => {

                if (
                    q.userAnswer === null ||
                    q.userAnswer === undefined ||
                    q.userAnswer === ""
                ) {

                    skipped++;

                }

                else if (
                    Number(q.userAnswer) ===
                    Number(q.correctAnswer)
                ) {

                    correct++;

                }

                else {

                    wrong++;

                }

            }
        );


        // ----------------------------------------------------
        // If stored summary exists
        // ----------------------------------------------------

        if (
            questions.length === 0
        ) {

            correct =
                Number(
                    data.correct ||
                    data.correctAnswers ||
                    0
                );

            wrong =
                Number(
                    data.wrong ||
                    data.wrongAnswers ||
                    0
                );

            skipped =
                Number(
                    data.skipped ||
                    data.unanswered ||
                    0
                );

        }


        const total =
            Number(
                data.total ||
                data.totalQuestions ||
                questions.length ||
                (
                    correct +
                    wrong +
                    skipped
                )
            );


        const score =
            Number(
                data.score ??
                data.marks ??
                correct
            );


        return {

            score:
                score,

            total:
                total,

            correct:
                correct,

            wrong:
                wrong,

            skipped:
                skipped,

            questions:
                questions,

            testType:
                data.testType ||
                data.type ||
                getTestTypeFromURL()

        };

    }


    // ========================================================
    // GET OPTIONS
    // ========================================================

    function getOptions(q) {

        if (
            Array.isArray(q.options)
        ) {

            return q.options;

        }


        if (
            Array.isArray(q.choices)
        ) {

            return q.choices;

        }


        return [

            q.optionA || "",
            q.optionB || "",
            q.optionC || "",
            q.optionD || ""

        ];

    }


    // ========================================================
    // GET CORRECT ANSWER
    // ========================================================

    function getCorrectAnswer(q) {

        let answer =
            q.correctAnswer;


        if (
            answer === undefined
        ) {

            answer =
                q.answer;

        }


        if (
            answer === undefined
        ) {

            answer =
                q.correct;

        }


        if (
            typeof answer === "string"
        ) {

            const text =
                answer.trim();


            // A / B / C / D

            const letters = {
                A: 0,
                B: 1,
                C: 2,
                D: 3
            };


            if (
                letters[
                    text.toUpperCase()
                ] !== undefined
            ) {

                return letters[
                    text.toUpperCase()
                ];

            }


            // Number stored as string

            if (
                !isNaN(
                    Number(text)
                )
            ) {

                return Number(text);

            }

        }


        return Number(
            answer ?? 0
        );

    }


    // ========================================================
    // GET USER ANSWER
    // ========================================================

    function getUserAnswer(
        q,
        index
    ) {

        if (
            q.userAnswer !== undefined
        ) {

            return q.userAnswer;

        }


        if (
            q.selectedAnswer !== undefined
        ) {

            return q.selectedAnswer;

        }


        if (
            q.selected !== undefined
        ) {

            return q.selected;

        }


        if (
            q.userAnswers !== undefined
        ) {

            return q.userAnswers;

        }


        return null;

    }


    // ========================================================
    // GET QUESTIONS FROM STORAGE
    // ========================================================

    function getQuestionsFromStorage() {

        const keys = [

            "questions",
            "mockQuestions",
            "practiceQuestions",
            "testQuestions"

        ];


        for (
            const key of keys
        ) {

            const data =
                getLocalStorageObject(
                    key
                );


            if (
                Array.isArray(data) &&
                data.length > 0
            ) {

                return data;

            }

        }


        return [];

    }


    // ========================================================
    // RENDER QUESTIONS
    // ========================================================

    function renderQuestions(
        questions,
        filter
    ) {

        reviewList.innerHTML =
            "";


        let count =
            0;


        questions.forEach(
            (q, index) => {

                const status =
                    getStatus(q);


                if (
                    filter !== "all" &&
                    filter !== status
                ) {

                    return;

                }


                count++;


                reviewList.appendChild(
                    createQuestionCard(
                        q,
                        index,
                        status
                    )
                );

            }
        );


        if (
            count === 0
        ) {

            reviewList.innerHTML = `

                <div class="empty-review">

                    📭 இந்த category-ல்
                    questions இல்லை.

                </div>

            `;

        }

    }


    // ========================================================
    // STATUS
    // ========================================================

    function getStatus(q) {

        if (
            q.userAnswer === null ||
            q.userAnswer === undefined ||
            q.userAnswer === ""
        ) {

            return "skipped";

        }


        if (
            Number(q.userAnswer) ===
            Number(q.correctAnswer)
        ) {

            return "correct";

        }


        return "wrong";

    }


    // ========================================================
    // QUESTION CARD
    // ========================================================

    function createQuestionCard(
        q,
        index,
        status
    ) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            `review-card ${status}`;


        let statusText =
            "— Skipped";

        let statusClass =
            "status-skipped";


        if (
            status === "correct"
        ) {

            statusText =
                "✓ Correct";

            statusClass =
                "status-correct";

        }

        else if (
            status === "wrong"
        ) {

            statusText =
                "✕ Wrong";

            statusClass =
                "status-wrong";

        }


        const options =
            q.options || [];


        const correctAnswer =
            Number(
                q.correctAnswer
            );


        const userAnswer =
            q.userAnswer;


        const letters = [
            "A",
            "B",
            "C",
            "D"
        ];


        let optionsHTML =
            "";


        options.forEach(
            (option, optionIndex) => {

                const isCorrect =
                    optionIndex ===
                    correctAnswer;


                const isUser =
                    userAnswer !== null &&
                    userAnswer !== undefined &&
                    userAnswer !== "" &&
                    Number(userAnswer) ===
                    optionIndex;


                let className =
                    "review-option";


                if (
                    isCorrect &&
                    isUser
                ) {

                    className +=
                        " user-correct";

                }

                else if (
                    isCorrect
                ) {

                    className +=
                        " correct-answer";

                }

                else if (
                    isUser
                ) {

                    className +=
                        " user-answer";

                }


                let marker =
                    "";


                if (
                    isCorrect &&
                    isUser
                ) {

                    marker =
                        " ✓ Your Answer • Correct";

                }

                else if (
                    isCorrect
                ) {

                    marker =
                        " ✓ Correct Answer";

                }

                else if (
                    isUser
                ) {

                    marker =
                        " ✕ Your Answer";

                }


                optionsHTML += `

                    <div class="${className}">

                        <strong>
                            ${letters[optionIndex] || optionIndex + 1}.
                        </strong>

                        ${escapeHTML(option)}

                        <span>
                            ${marker}
                        </span>

                    </div>

                `;

            }
        );


        const correctText =
            options[correctAnswer] ||
            "Answer not available";


        let userText =
            "Not Answered";


        if (
            userAnswer !== null &&
            userAnswer !== undefined &&
            userAnswer !== ""
        ) {

            userText =
                options[
                    Number(userAnswer)
                ] ||
                "Answer not available";

        }


        const explanation =
            q.explanation &&
            String(
                q.explanation
            ).trim()
                ? q.explanation
                : "இந்த கேள்விக்கு explanation வழங்கப்படவில்லை.";


        card.innerHTML = `

            <div class="review-top">

                <div class="review-number">
                    Question ${index + 1}
                </div>

                <div class="status-badge ${statusClass}">
                    ${statusText}
                </div>

            </div>


            <div class="review-question">

                ${escapeHTML(q.question)}

            </div>


            <div class="review-options">

                ${optionsHTML}

            </div>


            <div class="answer-info">

                <div class="answer-box">

                    <span>
                        👤 Your Answer
                    </span>

                    <strong>

                        ${
                            status === "skipped"
                                ? "Not Answered"
                                : escapeHTML(userText)
                        }

                    </strong>

                </div>


                <div class="answer-box">

                    <span>
                        ✅ Correct Answer
                    </span>

                    <strong>

                        ${escapeHTML(correctText)}

                    </strong>

                </div>

            </div>


            <div class="explanation">

                <div class="explanation-title">

                    💡 Explanation

                </div>

                <p>

                    ${escapeHTML(explanation)}

                </p>

            </div>

        `;


        return card;

    }


    // ========================================================
    // RESULT MESSAGE
    // ========================================================

    function showResultMessage(
        correct,
        total
    ) {

        if (
            total > 0 &&
            correct === total
        ) {

            if (resultIcon)
                resultIcon.textContent = "🏆";

            if (resultTitle)
                resultTitle.textContent =
                    "Perfect Score!";

            if (resultSubtitle)
                resultSubtitle.textContent =
                    "🔥 Excellent! எல்லா கேள்விகளுக்கும் சரியான பதில்.";

        }

        else if (
            total > 0 &&
            correct >=
            Math.ceil(total * 0.75)
        ) {

            if (resultIcon)
                resultIcon.textContent = "🎉";

            if (resultTitle)
                resultTitle.textContent =
                    "Excellent Performance!";

            if (resultSubtitle)
                resultSubtitle.textContent =
                    "💪 உங்கள் preparation மிகவும் நல்ல நிலையில் உள்ளது.";

        }

        else if (
            total > 0 &&
            correct >=
            Math.ceil(total * 0.50)
        ) {

            if (resultIcon)
                resultIcon.textContent = "👍";

            if (resultTitle)
                resultTitle.textContent =
                    "Good Attempt!";

            if (resultSubtitle)
                resultSubtitle.textContent =
                    "📚 இன்னும் கொஞ்சம் practice செய்தால் score அதிகரிக்கும்.";

        }

        else {

            if (resultIcon)
                resultIcon.textContent = "📖";

            if (resultTitle)
                resultTitle.textContent =
                    "Keep Practicing!";

            if (resultSubtitle)
                resultSubtitle.textContent =
                    "🔥 தவறுகளை review செய்து மீண்டும் முயற்சி செய்யுங்கள்.";

        }

    }


    // ========================================================
    // NO RESULT
    // ========================================================

    function showNoResult() {

        if (scoreValue)
            scoreValue.textContent = "0";

        if (totalCount)
            totalCount.textContent = "0";

        if (correctCount)
            correctCount.textContent = "0";

        if (wrongCount)
            wrongCount.textContent = "0";

        if (skippedCount)
            skippedCount.textContent = "0";


        if (resultIcon)
            resultIcon.textContent = "⚠️";

        if (resultTitle)
            resultTitle.textContent =
                "Result Not Found";

        if (resultSubtitle)
            resultSubtitle.textContent =
                "Test result கிடைக்கவில்லை.";


        reviewList.innerHTML = `

            <div class="empty-review">

                <div
                    style="
                        font-size:45px;
                        margin-bottom:15px;
                    "
                >
                    📭
                </div>

                <div>

                    Result data கிடைக்கவில்லை.

                </div>

                <div
                    style="
                        margin-top:8px;
                        font-size:12px;
                    "
                >

                    தயவுசெய்து Test-ஐ
                    மீண்டும் attempt செய்யுங்கள்.

                </div>

            </div>

        `;

    }


    // ========================================================
    // TEST TYPE FROM URL
    // ========================================================

    function getTestTypeFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return (
            params.get("type") ||
            "mock"
        );

    }


    // ========================================================
    // ESCAPE HTML
    // ========================================================

    function escapeHTML(value) {

        return String(
            value ?? ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

    }

});
