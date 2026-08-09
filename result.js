// ============================================================
// G THE GENIUS - RESULT PAGE JS
// Practice Test Result + Full Question Review
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // DOM
    // ========================================================

    const scoreValue =
        document.getElementById("scoreValue");

    const totalCount =
        document.getElementById("totalCount");

    const correctCount =
        document.getElementById("correctCount");

    const wrongCount =
        document.getElementById("wrongCount");

    const skippedCount =
        document.getElementById("skippedCount");

    const reviewList =
        document.getElementById("reviewList");

    const resultTitle =
        document.getElementById("resultTitle");

    const resultSubtitle =
        document.getElementById("resultSubtitle");

    const resultIcon =
        document.getElementById("resultIcon");

    const retryBtn =
        document.getElementById("retryBtn");

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const homeBtn =
        document.getElementById("homeBtn");

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    // ========================================================
    // GET RESULT
    // ========================================================

    let resultData = null;

    try {

        const savedResult =
            localStorage.getItem(
                "practiceResult"
            );

        if (savedResult) {

            resultData =
                JSON.parse(
                    savedResult
                );

        }

    }

    catch (error) {

        console.error(
            "Result data error:",
            error
        );

    }


    // ========================================================
    // NO RESULT
    // ========================================================

    if (
        !resultData ||
        !Array.isArray(
            resultData.questions
        )
    ) {

        showNoResult();

        return;

    }


    // ========================================================
    // RESULT VALUES
    // ========================================================

    const total =
        Number(
            resultData.total ||
            resultData.questions.length
        );

    const correct =
        Number(
            resultData.correct || 0
        );

    const wrong =
        Number(
            resultData.wrong || 0
        );

    const skipped =
        Number(
            resultData.skipped || 0
        );

    const score =
        Number(
            resultData.score ||
            correct
        );


    // ========================================================
    // DISPLAY SUMMARY
    // ========================================================

    scoreValue.textContent =
        score;

    totalCount.textContent =
        total;

    correctCount.textContent =
        correct;

    wrongCount.textContent =
        wrong;

    skippedCount.textContent =
        skipped;


    // ========================================================
    // RESULT MESSAGE
    // ========================================================

    if (
        total > 0 &&
        correct === total
    ) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "Perfect Score!";

        resultSubtitle.textContent =
            "🔥 Excellent! எல்லா கேள்விகளுக்கும் சரியான பதில்.";

    }

    else if (
        total > 0 &&
        correct >=
        Math.ceil(total * 0.75)
    ) {

        resultIcon.textContent =
            "🎉";

        resultTitle.textContent =
            "Excellent Performance!";

        resultSubtitle.textContent =
            "💪 உங்கள் preparation மிகவும் நல்ல நிலையில் உள்ளது.";

    }

    else if (
        total > 0 &&
        correct >=
        Math.ceil(total * 0.50)
    ) {

        resultIcon.textContent =
            "👍";

        resultTitle.textContent =
            "Good Attempt!";

        resultSubtitle.textContent =
            "📚 இன்னும் கொஞ்சம் practice செய்தால் score அதிகரிக்கும்.";

    }

    else {

        resultIcon.textContent =
            "📖";

        resultTitle.textContent =
            "Keep Practicing!";

        resultSubtitle.textContent =
            "🔥 தவறுகளை review செய்து மீண்டும் முயற்சி செய்யுங்கள்.";

    }


    // ========================================================
    // STORE QUESTIONS
    // ========================================================

    const questions =
        resultData.questions;


    // ========================================================
    // INITIAL REVIEW
    // ========================================================

    renderQuestions(
        questions,
        "all"
    );


    // ========================================================
    // FILTER
    // ========================================================

    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.dataset.filter;


                    renderQuestions(
                        questions,
                        filter
                    );

                }
            );

        }
    );


    // ========================================================
    // RENDER QUESTIONS
    // ========================================================

    function renderQuestions(
        questionArray,
        filter
    ) {

        reviewList.innerHTML =
            "";


        let displayedCount =
            0;


        questionArray.forEach(
            (q, index) => {

                const status =
                    getQuestionStatus(
                        q
                    );


                if (
                    filter !== "all" &&
                    status !== filter
                ) {

                    return;

                }


                displayedCount++;


                const card =
                    createReviewCard(
                        q,
                        index,
                        status
                    );


                reviewList.appendChild(
                    card
                );

            }
        );


        if (
            displayedCount === 0
        ) {

            reviewList.innerHTML = `
                <div class="empty-review">
                    இந்த category-ல் questions இல்லை.
                </div>
            `;

        }

    }


    // ========================================================
    // QUESTION STATUS
    // ========================================================

    function getQuestionStatus(q) {

        const userAnswer =
            q.userAnswer;


        const correctAnswer =
            Number(
                q.correctAnswer
            );


        // SKIPPED

        if (
            userAnswer === null ||
            userAnswer === undefined ||
            userAnswer === ""
        ) {

            return "skipped";

        }


        // CORRECT

        if (
            Number(userAnswer) ===
            correctAnswer
        ) {

            return "correct";

        }


        // WRONG

        return "wrong";

    }


    // ========================================================
    // CREATE REVIEW CARD
    // ========================================================

    function createReviewCard(
        q,
        originalIndex,
        status
    ) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            `review-card ${status}`;


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        let statusText = "";
        let statusClass = "";


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

        else {

            statusText =
                "— Skipped";

            statusClass =
                "status-skipped";

        }


        // ----------------------------------------------------
        // ANSWERS
        // ----------------------------------------------------

        const userAnswer =
            q.userAnswer;


        const correctAnswer =
            Number(
                q.correctAnswer
            );


        const options =
            Array.isArray(q.options)
                ? q.options
                : [];


        const correctText =
            options[correctAnswer] ??
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
                ] ??
                "Answer not available";

        }


        // ----------------------------------------------------
        // OPTIONS HTML
        // ----------------------------------------------------

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

                let optionClass =
                    "review-option";


                const isCorrect =
                    optionIndex ===
                    correctAnswer;


                const isUserAnswer =
                    userAnswer !== null &&
                    userAnswer !== undefined &&
                    userAnswer !== "" &&
                    Number(userAnswer) ===
                    optionIndex;


                if (
                    isCorrect &&
                    isUserAnswer
                ) {

                    optionClass +=
                        " user-correct";

                }

                else if (
                    isCorrect
                ) {

                    optionClass +=
                        " correct-answer";

                }

                else if (
                    isUserAnswer
                ) {

                    optionClass +=
                        " user-answer";

                }


                let marker = "";


                if (
                    isCorrect &&
                    isUserAnswer
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
                    isUserAnswer
                ) {

                    marker =
                        " ✕ Your Answer";

                }


                optionsHTML += `
                    <div class="${optionClass}">
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


        // ----------------------------------------------------
        // EXPLANATION
        // ----------------------------------------------------

        const explanation =
            q.explanation &&
            String(
                q.explanation
            ).trim()
                ? q.explanation
                : "இந்த கேள்விக்கு explanation வழங்கப்படவில்லை.";


        // ----------------------------------------------------
        // CARD
        // ----------------------------------------------------

        card.innerHTML = `

            <div class="review-top">

                <div class="review-number">
                    Question ${originalIndex + 1}
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

                    <strong
                        class="${
                            status === "skipped"
                                ? "not-answered"
                                : "your-answer"
                        }"
                    >
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

                    <strong class="correct-answer-text">
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
    // RETRY
    // ========================================================

    retryBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "practice.html";

        }
    );


    // ========================================================
    // DASHBOARD
    // ========================================================

    dashboardBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";

        }
    );


    homeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";

        }
    );


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


    // ========================================================
    // NO RESULT
    // ========================================================

    function showNoResult() {

        scoreValue.textContent =
            "0";

        totalCount.textContent =
            "0";

        correctCount.textContent =
            "0";

        wrongCount.textContent =
            "0";

        skippedCount.textContent =
            "0";


        resultIcon.textContent =
            "⚠️";

        resultTitle.textContent =
            "Result Not Found";

        resultSubtitle.textContent =
            "Practice Test result கிடைக்கவில்லை.";


        reviewList.innerHTML = `

            <div class="empty-review">

                <div
                    style="
                        font-size:35px;
                        margin-bottom:10px;
                    "
                >
                    📭
                </div>

                Result data கிடைக்கவில்லை.<br>

                தயவுசெய்து Practice Test-ஐ
                மீண்டும் attempt செய்யுங்கள்.

            </div>

        `;

    }

});
