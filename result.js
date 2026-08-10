// ============================================================
// G THE GENIUS
// UNIVERSAL RESULT PAGE
// Practice + Daily + Weekly + Monthly
// ============================================================


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeResultPage();

    }
);


// ============================================================
// INITIALIZE
// ============================================================

function initializeResultPage() {

    const resultData =
        findResultData();


    console.log(
        "FINAL RESULT DATA:",
        resultData
    );


    if (!resultData) {

        showNoResult();

        return;

    }


    const result =
        normalizeResult(
            resultData
        );


    displaySummary(
        result
    );


    displayResultMessage(
        result.correct,
        result.total
    );


    displayQuestions(
        result.questions,
        "all"
    );


    setupFilters(
        result.questions
    );


    setupButtons(
        result
    );

}


// ============================================================
// FIND RESULT
// ============================================================

function findResultData() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const type =
        (
            params.get("type") ||
            ""
        ).toLowerCase();


    // ========================================================
    // PRACTICE RESULT
    // ========================================================

    if (
        type === "practice"
    ) {

        const practice =
            getLocalStorageObject(
                "practiceResult"
            );


        if (
            isValidResult(
                practice
            )
        ) {

            return practice;

        }

    }


    // ========================================================
    // MOCK RESULT
    // ========================================================

    if (
        type === "daily" ||
        type === "weekly" ||
        type === "monthly"
    ) {

        const mock =
            getLocalStorageObject(
                "mockTestResult"
            );


        if (
            isValidResult(
                mock
            )
        ) {

            return mock;

        }

    }


    // ========================================================
    // LAST RESULT FALLBACK
    // ========================================================

    const last =
        getLocalStorageObject(
            "lastResult"
        );


    if (
        isValidResult(
            last
        )
    ) {

        return last;

    }


    return null;

}


// ============================================================
// GET LOCAL STORAGE OBJECT
// ============================================================

function getLocalStorageObject(
    key
) {

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

        console.error(
            "Storage Parse Error:",
            key,
            error
        );


        return null;

    }

}


// ============================================================
// VALID RESULT
// ============================================================

function isValidResult(
    data
) {

    if (!data) {

        return false;

    }


    if (
        Array.isArray(
            data.questions
        ) &&
        data.questions.length > 0
    ) {

        return true;

    }


    if (
        data.score !== undefined &&
        (
            data.total !== undefined ||
            data.totalQuestions !== undefined
        )
    ) {

        return true;

    }


    return false;

}


// ============================================================
// NORMALIZE RESULT
// ============================================================

function normalizeResult(
    data
) {

    let questions =
        Array.isArray(
            data.questions
        )
            ? data.questions
            : [];


    // ========================================================
    // QUESTIONS
    // ========================================================

    questions =
        questions.map(
            (
                question
            ) => {

                const options =
                    getOptions(
                        question
                    );


                const correctAnswer =
                    getCorrectAnswer(
                        question
                    );


                const userAnswer =
                    getUserAnswer(
                        question
                    );


                return {

                    id:
                        question.id ||
                        "",

                    question:
                        question.question ||
                        question.questionText ||
                        question.text ||
                        "",

                    options:
                        options,

                    correctAnswer:
                        correctAnswer,

                    userAnswer:
                        userAnswer,

                    explanation:
                        question.explanation ||
                        question.Explanation ||
                        question.answerExplanation ||
                        "இந்த கேள்விக்கு explanation வழங்கப்படவில்லை.",

                    subject:
                        question.subject ||
                        question.Subject ||
                        ""

                };

            }
        );


    // ========================================================
    // CALCULATE
    // ========================================================

    let correct = 0;

    let wrong = 0;

    let skipped = 0;


    questions.forEach(
        (
            question
        ) => {

            if (
                question.userAnswer === null ||
                question.userAnswer === undefined ||
                question.userAnswer === ""
            ) {

                skipped++;

            }

            else if (
                Number(
                    question.userAnswer
                ) ===
                Number(
                    question.correctAnswer
                )
            ) {

                correct++;

            }

            else {

                wrong++;

            }

        }
    );


    // ========================================================
    // FALLBACK SUMMARY
    // ========================================================

    if (
        questions.length === 0
    ) {

        correct =
            Number(
                data.correct ||
                0
            );


        wrong =
            Number(
                data.wrong ||
                0
            );


        skipped =
            Number(
                data.skipped ||
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


    const score = correct;


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
            "mock"

    };

}


// ============================================================
// GET OPTIONS
// ============================================================

function getOptions(
    question
) {

    if (
        Array.isArray(
            question.options
        )
    ) {

        return question.options;

    }


    return [

        question.optionA || "",

        question.optionB || "",

        question.optionC || "",

        question.optionD || ""

    ];

}


// ============================================================
// GET CORRECT ANSWER
// ============================================================

function getCorrectAnswer(
    question
) {

    let answer =
        question.correctAnswer;


    if (
        answer === undefined
    ) {

        answer =
            question.answer;

    }


    if (
        answer === undefined
    ) {

        answer =
            question.correct;

    }


    if (
        typeof answer === "string"
    ) {

        const text =
            answer.trim()
                .toUpperCase();


        const letters = {

            A: 0,

            B: 1,

            C: 2,

            D: 3

        };


        if (
            letters[text] !== undefined
        ) {

            return letters[text];

        }


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


// ============================================================
// GET USER ANSWER
// ============================================================

function getUserAnswer(
    question
) {

    if (
        question.userAnswer !== undefined
    ) {

        return question.userAnswer;

    }


    if (
        question.selectedAnswer !== undefined
    ) {

        return question.selectedAnswer;

    }


    if (
        question.selected !== undefined
    ) {

        return question.selected;

    }


    return null;

}


// ============================================================
// DISPLAY SUMMARY
// ============================================================

function displaySummary(
    result
) {

    setText(
        "scoreValue",
        result.score
    );


    setText(
        "totalCount",
        result.total
    );


    setText(
        "correctCount",
        result.correct
    );


    setText(
        "wrongCount",
        result.wrong
    );


    setText(
        "skippedCount",
        result.skipped
    );


    // ========================================================
    // TEST NAME
    // ========================================================

    let title =
        "Mock Test Result";


    if (
        result.testType ===
        "practice"
    ) {

        title =
            "Practice Test Result";

    }

    else if (
        result.testType ===
        "daily"
    ) {

        title =
            "Daily Mock Test Result";

    }

    else if (
        result.testType ===
        "weekly"
    ) {

        title =
            "Weekly Mock Test Result";

    }

    else if (
        result.testType ===
        "monthly"
    ) {

        title =
            "Monthly Grand Test Result";

    }


    setText(
        "resultTitle",
        title
    );

}


// ============================================================
// RESULT MESSAGE
// ============================================================

function displayResultMessage(
    correct,
    total
) {

    const icon =
        document.getElementById(
            "resultIcon"
        );


    const title =
        document.getElementById(
            "resultTitle"
        );


    const subtitle =
        document.getElementById(
            "resultSubtitle"
        );


    if (
        total > 0 &&
        correct === total
    ) {

        if (icon)
            icon.textContent =
                "🏆";


        if (subtitle)
            subtitle.textContent =
                "🔥 Perfect Score! Excellent performance.";

    }

    else if (
        total > 0 &&
        correct >=
        Math.ceil(
            total * 0.75
        )
    ) {

        if (icon)
            icon.textContent =
                "🎉";


        if (subtitle)
            subtitle.textContent =
                "💪 Excellent Performance!";

    }

    else if (
        total > 0 &&
        correct >=
        Math.ceil(
            total * 0.50
        )
    ) {

        if (icon)
            icon.textContent =
                "👍";


        if (subtitle)
            subtitle.textContent =
                "📚 Good Attempt! இன்னும் practice செய்யுங்கள்.";

    }

    else {

        if (icon)
            icon.textContent =
                "📖";


        if (subtitle)
            subtitle.textContent =
                "🔥 Keep Practicing! மீண்டும் முயற்சி செய்யுங்கள்.";

    }

}


// ============================================================
// DISPLAY QUESTIONS
// ============================================================

function displayQuestions(
    questions,
    filter
) {

    const reviewList =
        document.getElementById(
            "reviewList"
        );


    if (!reviewList) {

        return;

    }


    reviewList.innerHTML =
        "";


    let count = 0;


    questions.forEach(
        (
            question,
            index
        ) => {

            const status =
                getStatus(
                    question
                );


            if (
                filter !== "all" &&
                filter !== status
            ) {

                return;

            }


            count++;


            const card =
                createQuestionCard(
                    question,
                    index,
                    status
                );


            reviewList.appendChild(
                card
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


// ============================================================
// STATUS
// ============================================================

function getStatus(
    question
) {

    if (
        question.userAnswer === null ||
        question.userAnswer === undefined ||
        question.userAnswer === ""
    ) {

        return "skipped";

    }


    if (
        Number(
            question.userAnswer
        ) ===
        Number(
            question.correctAnswer
        )
    ) {

        return "correct";

    }


    return "wrong";

}


// ============================================================
// QUESTION CARD
// ============================================================

function createQuestionCard(
    question,
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
        "🟡 Skipped";


    let statusClass =
        "status-skipped";


    if (
        status === "correct"
    ) {

        statusText =
            "✅ Correct";

        statusClass =
            "status-correct";

    }


    else if (
        status === "wrong"
    ) {

        statusText =
            "❌ Wrong";

        statusClass =
            "status-wrong";

    }


    const options =
        question.options || [];


    const correctAnswer =
        Number(
            question.correctAnswer
        );


    const userAnswer =
        question.userAnswer;


    const letters = [
        "A",
        "B",
        "C",
        "D"
    ];


    let optionsHTML =
        "";


    options.forEach(
        (
            option,
            optionIndex
        ) => {

            const isCorrect =
                optionIndex ===
                correctAnswer;


            const isUser =
                userAnswer !== null &&
                userAnswer !== undefined &&
                userAnswer !== "" &&
                Number(
                    userAnswer
                ) ===
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


            let marker = "";


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
        options[
            correctAnswer
        ] ||
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
                Number(
                    userAnswer
                )
            ] ||
            "Answer not available";

    }


    const explanation =
        question.explanation &&
        String(
            question.explanation
        ).trim()
            ? question.explanation
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

            ${escapeHTML(
                question.question
            )}

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
                            : escapeHTML(
                                userText
                            )
                    }

                </strong>

            </div>


            <div class="answer-box">

                <span>
                    ✅ Correct Answer
                </span>

                <strong>

                    ${escapeHTML(
                        correctText
                    )}

                </strong>

            </div>

        </div>


        <div class="explanation">

            <div class="explanation-title">

                💡 Explanation

            </div>

            <p>

                ${escapeHTML(
                    explanation
                )}

            </p>

        </div>

    `;


    return card;

}

// ============================================================
// FILTER BUTTONS
// ============================================================

function setupFilters(
    questions
) {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(
        (
            button
        ) => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    displayQuestions(
                        questions,
                        button.dataset.filter
                    );

                }
            );

        }
    );

}


// ============================================================
// BUTTONS
// ============================================================

function setupButtons(
    result
) {

    const retryBtn =
        document.getElementById(
            "retryBtn"
        );


    const dashboardBtn =
        document.getElementById(
            "dashboardBtn"
        );


    const homeBtn =
        document.getElementById(
            "homeBtn"
        );


    // ========================================================
    // RETRY
    // ========================================================

    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            () => {

                if (
                    result.testType ===
                    "practice"
                ) {

                    window.location.href =
                        "practice.html";

                }

                else {

                    window.location.href =
                        "mocktest.html?type=" +
                        encodeURIComponent(
                            result.testType
                        );

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


    // ========================================================
    // HOME
    // ========================================================

    if (homeBtn) {

        homeBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "dashboard.html";

            }
        );

    }

}


// ============================================================
// NO RESULT
// ============================================================

function showNoResult() {

    setText(
        "scoreValue",
        "0"
    );


    setText(
        "totalCount",
        "0"
    );


    setText(
        "correctCount",
        "0"
    );


    setText(
        "wrongCount",
        "0"
    );


    setText(
        "skippedCount",
        "0"
    );


    const icon =
        document.getElementById(
            "resultIcon"
        );


    const title =
        document.getElementById(
            "resultTitle"
        );


    const subtitle =
        document.getElementById(
            "resultSubtitle"
        );


    if (icon)
        icon.textContent =
            "⚠️";


    if (title)
        title.textContent =
            "Result Not Found";


    if (subtitle)
        subtitle.textContent =
            "Test result கிடைக்கவில்லை.";


    const reviewList =
        document.getElementById(
            "reviewList"
        );


    if (reviewList) {

        reviewList.innerHTML = `

            <div class="empty-review">

                <div style="
                    font-size:45px;
                    margin-bottom:15px;
                ">

                    📭

                </div>

                Result data கிடைக்கவில்லை.

                <div style="
                    margin-top:8px;
                    font-size:12px;
                ">

                    தயவுசெய்து Test-ஐ
                    மீண்டும் attempt செய்யுங்கள்.

                </div>

            </div>

        `;

    }

}


// ============================================================
// SET TEXT
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(
    value
) {

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

