let highScores = JSON.parse(localStorage.getItem("highScores")) || {
    easy: 0,
    medium: 0,
    hard: 0,
};
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {
    easy: [],
    medium: [],
    hard: [],
};
let selectedLevel = "";
let reviewData = [];
let timeLeft = 0;
let timer;
let currentQuestionIndex = 0;
let score = 0;
let question = [];
let playerName = ""; 
let answerHistory = [];
let usedQuestions = JSON.parse(localStorage.getItem("usedQuestions") || "null") || {
    easy: [],
    medium: [],
    hard: [],
};
let lifelines = {
    fifty: true,
    hint: true,
    skip: true,
};

let unlocklevels = {
    easy: true,
    medium: false,
    hard: false,
};

if (highScores.easy >= 3) {
    unlocklevels.medium = true;
}

if (highScores.medium >= 3) {
    unlocklevels.hard = true;
}

const questions = { 
    easy: [
        {
            question: "HTML stands for?",
            hint: "It's the standard markup language for creating web pages.",
            answer: [
                { option: "HyperText Markup Language", correct: true },
                { option: "High Text Markup Language", correct: false },
                { option: "Home Tool Markup Language", correct: false },
                { option: "Hyperlinks and Text Markup Language", correct: false },
            ],
        },
        {
            question: "CSS stands for?",
            hint: "It's used to style and layout web pages.",
            answer: [
                { option: "Cascading Style Sheets", correct: true },
                { option: "Computer Style Sheets", correct: false },
                { option: "Colorful Style Sheets", correct: false },
                { option: "Complete Style Sheets", correct: false },
            ],
        },
        {
            question: "CSS is used for?",
            hint: "It describes how HTML elements are to be displayed on screen.",
            answer: [
                { option: "Styling web pages", correct: true },
                { option: "Creating web applications", correct: false },
                { option: "Building databases", correct: false },
                { option: "Writing server-side code", correct: false },
            ],
        },
        {
            question: "javascript is a?",
            hint: "It's a programming language that allows you to implement complex features on web pages.",
            answer: [
                { option: "Programming language", correct: true },
                { option: "Markup language", correct: false },
                { option: "Style sheet language", correct: false },
                { option: "Database language", correct: false },
            ],
        },
        {
            question: "Which of the following is true about JavaScript?",
            hint: "It's a versatile language that can be used for both client-side and server-side development.",
            answer: [
                { option: "It is a Case-Sensitive language", correct: true },
                { option: "It is  not interpreted", correct: false },
                { option: "It is a compiled language", correct: false },
                { option: "It is a statically typed language", correct: false },
            ],
        },
    ],

    medium: [
        {
            question: "C++ was developed by?",
            hint: "The creator of C++ is a Danish computer scientist known for his work on programming languages.",
            answer: [
                { option: "Bjarne Stroustrup", correct: true },
                { option: "James Gosling", correct: false },
                { option: "Guido van Rossum", correct: false },
                { option: "Dennis Ritchie", correct: false },
            ],
        },
        {
            question: "Python was developed by?",
            hint: "The creator of Python is a Dutch programmer who named the language after a comedy group.",
            answer: [
                { option: "Guido van Rossum", correct: true },
                { option: "James Gosling", correct: false },
                { option: "Bjarne Stroustrup", correct: false },
                { option: "Dennis Ritchie", correct: false },
            ],
        },
        {
            question: "Java was developed by?",
            hint: "The creator of Java is an American computer scientist who also worked on the development of the C++ programming language.",
            answer: [
                { option: "James Gosling", correct: true },
                { option: "Guido van Rossum", correct: false },
                { option: "Bjarne Stroustrup", correct: false },
                { option: "Dennis Ritchie", correct: false },
            ],
        },
        {
            question: "JavaScript was developed by?",
            hint: "The creator of JavaScript is an American computer programmer who developed the language in just 10 days while working at Netscape Communications Corporation.",
            answer: [
                { option: "Brendan Eich", correct: true },
                { option: "James Gosling", correct: false },
                { option: "Guido van Rossum", correct: false },
                { option: "Dennis Ritchie", correct: false },
            ],
        },
        {
            question: "C# was developed by?",
            hint: "The creator of C# is a Danish computer scientist who also created the Turbo Pascal programming language.",
            answer: [
                { option: "Anders Hejlsberg", correct: true },
                { option: "James Gosling", correct: false },
                { option: "Guido van Rossum", correct: false },
                { option: "Dennis Ritchie", correct: false },
            ],
        },
    ],

    hard: [
        {
            question: "C++ was developed in which year?",
            hint: "C++ was first released in the early 1980s as an extension of the C programming language.",
            answer: [
                { option: "1985", correct: true },
                { option: "1995", correct: false },
                { option: "2005", correct: false },
                { option: "2015", correct: false },
            ],
        },
        {
            question: "Python was developed in which year?",
            hint: "Python was first released in the early 1990s and has since become one of the most popular programming languages in the world.",
            answer: [
                { option: "1991", correct: true },
                { option: "1995", correct: false },
                { option: "2000", correct: false },
                { option: "2005", correct: false },
            ],
        },
        {
            question: "Java was developed in which year?",
            hint: "Java was first released in the mid-1990s and has since become one of the most widely used programming languages in the world.",
            answer: [
                { option: "1995", correct: true },
                { option: "1991", correct: false },
                { option: "2000", correct: false },
                { option: "2005", correct: false },
            ],
        },
        {
            question: "JavaScript was developed in which year?",
            hint: "JavaScript was first released in the mid-1990s and has since become one of the most popular programming languages for web development.",
            answer: [
                { option: "1995", correct: true },
                { option: "1991", correct: false },
                { option: "2000", correct: false },
                { option: "2005", correct: false },
            ],
        },
        {
            question: "C# was developed in which year?",
            hint: "C# was first released in the early 2000s as part of Microsoft's .NET initiative.",
            answer: [
                { option: "2001", correct: true },
                { option: "1995", correct: false },
                { option: "2000", correct: false },
                { option: "2005", correct: false },
            ],
        },
    ],
};

// VARIABLES
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const backButton = document.getElementById("back-btn");
const levelButtons = document.querySelectorAll(".level");

refreshUnlockedLevels();

document.getElementById("fifty").addEventListener("click", () => {
    if (!lifelines.fifty) return;

    let wrongAnswers = [];

    Array.from(answerButtons.children).forEach((btn) => {
        if (btn.dataset.correct !== "true") {
            wrongAnswers.push(btn);
        }
    });

    shuffleArray(wrongAnswers)
        .slice(0, 2)
        .forEach((btn) => {
            btn.style.display = "none";
        });

    lifelines.fifty = false;
    document.getElementById("fifty").disabled = true;
});

document.getElementById("hint").addEventListener("click", () => {
    if (!lifelines.hint) return;

    let current = question[currentQuestionIndex];

    alert(current.hint || "No hint available");

    lifelines.hint = false;
    document.getElementById("hint").disabled = true;
});

document.getElementById("skip").addEventListener("click", () => {
    if (!lifelines.skip) return;

    lifelines.skip = false;
    document.getElementById("skip").disabled = true;
    clearInterval(timer);
    saveQuestionResult({
        userAnswer: "Skipped",
        isCorrect: false,
    });
    handleNextButton();
});

const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
    // FIX 1: capture player name on start
    const input = document.getElementById("username").value.trim();
    if (input === "") {
        alert("Please enter your name!");
        return;
    }
    playerName = input;

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("difficulty-box").style.display = "block";
});

const leaderboardBtn = document.getElementById("leaderboard-btn");

leaderboardBtn.addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("leaderboard-screen").style.display = "block";
    showLeaderboard();
});

const backToStartBtn = document.getElementById("back-to-start");

backToStartBtn.addEventListener("click", () => {
    document.getElementById("leaderboard-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
});

levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const level = button.dataset.level;
        if (!unlocklevels[level]) {
            alert("This level is locked! Please complete the previous level to unlock it.");
            return;
        }

        selectedLevel = level;
        question = shuffleArray(getNewQuestions(selectedLevel));
        if (selectedLevel === "easy") timeLeft = 15;
        else if (selectedLevel === "medium") timeLeft = 10;
        else timeLeft = 5;
        nextButton.dataset.next = "";
        document.getElementById("difficulty-box").style.display = "none";
        document.querySelector(".Quiz").style.display = "block";

        startQuiz();
    });
});

function startQuiz() {
    // FIRST FUNCTION TO CALL TO START/RESTART QUIZ
    lifelines = {
        fifty: true,
        hint: true,
        skip: true,
    };

    document.getElementById("fifty").disabled = false;
    document.getElementById("hint").disabled = false;
    document.getElementById("skip").disabled = false;
    reviewData = [];
    currentQuestionIndex = 0;
    score = 0;
    answerHistory = [];
    nextButton.innerHTML = "Next";
    nextButton.dataset.next = "";
    showQuestion();
}

backButton.addEventListener("click", () => {
    clearInterval(timer);
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
    // FIX 4: re-enable lifelines when going back so they work correctly per question
    document.getElementById("fifty").disabled = !lifelines.fifty ? true : false;
    document.getElementById("hint").disabled = !lifelines.hint ? true : false;
    document.getElementById("skip").disabled = !lifelines.skip ? true : false;
});

function startTimer() {
    //SECOND FUNCTION TO CALL TO START TIMER FOR EACH QUESTION
    clearInterval(timer);

    let currentTime = timeLeft;
    document.getElementById("timer").innerHTML = "Time: " + currentTime;
    document.getElementById("timer").style.color = "black";

    timer = setInterval(() => {
        currentTime--;
        document.getElementById("timer").innerHTML = "Time: " + currentTime;

        if (currentTime <= 3) {
            document.getElementById("timer").style.color = "red";
        }

        if (currentTime <= 0) {
            clearInterval(timer);
            saveQuestionResult({
                userAnswer: "Time Out",
                isCorrect: false,
            });
            Array.from(answerButtons.children).forEach((btn) => {
                if (btn.dataset.correct === "true") btn.classList.add("correct");
                btn.disabled = true;
            });
            nextButton.style.display = "block";
        }
    }, 1000);
}

function showQuestion() {
    // THIRD FUNCTION TO CALL TO SHOW EACH QUESTION AND ITS ANSWERS
    const questionElement = document.getElementById("question");
    resetState();

    backButton.style.display = currentQuestionIndex > 0 ? "block" : "none";

    let current = question[currentQuestionIndex];
    if (!current) {
        console.error("No question found at index", currentQuestionIndex);
        questionElement.innerHTML = "Error loading question";
        return;
    }

    if (current && current.question) {
        questionElement.innerHTML = currentQuestionIndex + 1 + ". " + current.question;
    } else {
        console.error("Question data missing at index", currentQuestionIndex, current);
        questionElement.innerHTML = "Error loading question";
    }

    shuffleArray([...current.answer]).forEach((ans) => {
        const btn = document.createElement("button");
        btn.innerHTML = ans.option;
        btn.classList.add("option");

        if (ans.correct) btn.dataset.correct = true;

        btn.addEventListener("click", selectAnswer);
        answerButtons.appendChild(btn);
    });

    const savedAnswer = answerHistory[currentQuestionIndex];
    if (savedAnswer) {
        renderSavedAnswer(savedAnswer);
        document.getElementById("timer").innerHTML = "Time: 0";
        document.getElementById("timer").style.color = "black";
    } else {
        document.getElementById("timer").style.color = "black";
        startTimer();
    }

    updateProgressBar();
}

function resetState() {
    // FIFTH FUNCTION TO CALL TO RESET STATE BEFORE SHOWING NEW QUESTION
    nextButton.style.display = "none";
    nextButton.dataset.review = "";
    answerButtons.innerHTML = "";
}

function shuffleArray(array) {
    // Six FUNCTION Utility function to shuffle answer options
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function selectAnswer(e) {
    // SEVENTH FUNCTION TO CALL WHEN AN ANSWER IS SELECTED
    if (answerHistory[currentQuestionIndex]) return;
    clearInterval(timer);

    const correct = e.target.dataset.correct === "true";
    saveQuestionResult({
        userAnswer: e.target.innerText,
        isCorrect: correct,
    });
    renderSavedAnswer(answerHistory[currentQuestionIndex]);

    nextButton.style.display = "block";
}

function handleNextButton() {
    // EIGHTH FUNCTION TO CALL TO HANDLE NEXT BUTTON LOGIC (GO TO NEXT QUESTION OR SHOW SCORE)
    currentQuestionIndex++;

    if (currentQuestionIndex < question.length) {
        showQuestion();
    } else {
        document.getElementById("timer").innerHTML = "Time: 0";
        document.getElementById("timer").style.color = "black";
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    // FIX 3: handle review screen via dataset flag instead of onclick
    if (nextButton.dataset.review === "true") {
        nextButton.dataset.review = "";
        showReview();
        nextButton.innerHTML = nextButton.dataset.pendingLabel || "Continue";
        nextButton.dataset.next = nextButton.dataset.pendingNext || "";
        nextButton.style.display = "block";
        return;
    }

    if (nextButton.dataset.intro === "true") {
        nextButton.dataset.intro = "";
        const level = nextButton.dataset.next;
        selectedLevel = level;
        question = shuffleArray(getNewQuestions(selectedLevel));
        if (selectedLevel === "easy") timeLeft = 15;
        else if (selectedLevel === "medium") timeLeft = 10;
        else timeLeft = 5;
        startQuiz();
        updateProgressBar();
        return;
    }

    if (currentQuestionIndex < question.length) {
        handleNextButton();
        return;
    }

    const nextLevel = nextButton.dataset.next;

    if (nextLevel) {
        showLevelIntro(nextLevel);
    } else {
        // restart same level
        question = shuffleArray(getNewQuestions(selectedLevel));
        currentQuestionIndex = 0;
        score = 0;
        startQuiz();
    }
});

function showScore() {
    // NINTH FUNCTION TO CALL TO SHOW SCORE AND HANDLE LEVEL PROGRESSION LOGIC
    score = answerHistory.filter((item) => item && item.isCorrect).length;

    // Save high score
    if (score > highScores[selectedLevel]) {
        highScores[selectedLevel] = score;
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }

    // Add to leaderboard
    leaderboard[selectedLevel].push({ name: playerName, score: score });
    leaderboard[selectedLevel].sort((a, b) => b.score - a.score);
    leaderboard[selectedLevel] = leaderboard[selectedLevel].slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    resetState();
    clearInterval(timer);

    // RESET timer color safely
    document.getElementById("timer").style.color = "black";

    // SHOW SCORE + HIGH SCORE
    questionElement.innerHTML = `
    ${playerName ? `${playerName}, ` : ""}you scored ${score} out of ${question.length}! <br><br>
         High Score (${selectedLevel}): ${highScores[selectedLevel]}
    `;

    let pendingLabel;
    let pendingNext;

    if (score >= 3) {
        if (selectedLevel === "easy") {
            unlocklevels.medium = true;

            const mediumBtn = document.getElementById("medium-btn");
            if (mediumBtn) mediumBtn.innerHTML = "Medium";

            pendingLabel = "Next Level";
            pendingNext = "medium";
        } else if (selectedLevel === "medium") {
            unlocklevels.hard = true;

            const hardBtn = document.getElementById("hard-btn");
            if (hardBtn) hardBtn.innerHTML = "Hard";

            pendingLabel = "Next Level";
            pendingNext = "hard";
        } else {
            pendingLabel = "Play Again";
            pendingNext = "";
        }
    } else {
        pendingLabel = "Try Again";
        pendingNext = "";
    }

    nextButton.dataset.review = "true";
    nextButton.dataset.pendingLabel = pendingLabel;
    nextButton.dataset.pendingNext = pendingNext;
    nextButton.innerHTML = "View Review";
    nextButton.style.display = "block";
    refreshUnlockedLevels();
}

function getNewQuestions(level) {
    // TENTH FUNCTION TO CALL TO GET NEW QUESTIONS WITHOUT REPEATS (CALLED WHEN LEVEL IS SELECTED)
    let all = questions[level];

    let used = usedQuestions[level];

    let filtered = all.filter((q) => !used.includes(q.question));

    // If all used reset
    if (filtered.length === 0) {
        usedQuestions[level] = [];
        localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
        return all;
    }

    return filtered;
}

function updateProgressBar() {
    // ELEVENTH FUNCTION TO CALL TO UPDATE PROGRESS BAR BASED ON CURRENT QUESTION INDEX
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    let progress = (currentQuestionIndex / question.length) * 100;
    bar.style.width = progress + "%";
}
function showReviewLegacy() {
    // TWELFTH FUNCTION TO CALL TO SHOW REVIEW OF ANSWERS AFTER QUIZ IS COMPLETED

    const wrongAnswers = reviewData.filter((item) => !item.isCorrect);

    if (wrongAnswers.length === 0) {
        questionElement.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <div style="font-size:40px;">🎉</div>
                <h2 style="color:#4caf50; margin:10px 0;">Perfect Score!</h2>
                <p style="color:#333;">You got all answers correct!</p>
            </div>
        `;
        return;
    }

    let html = `<h2 style="color:#e74c3c; margin-bottom:15px;">❌ Wrong Answers (${wrongAnswers.length})</h2>`;

    wrongAnswers.forEach((item, index) => {
        html += `
            <div style="margin-bottom:15px; padding:12px; border-radius:8px; background:#f4f4f4; color:#333; text-align:left; border-left: 4px solid #e74c3c;">
                <b>Q${index + 1}:</b> ${item.question} <br><br>
                <b>Your Answer:</b>
                <span style="color:red;">❌ ${item.userAnswer}</span><br>
                <b>Correct Answer:</b>
                <span style="color:green;">✅ ${item.correctAnswer}</span>
            </div>
        `;
    });

    questionElement.innerHTML = html;
}

function showLevelIntro(level) {
    const messages = {
        medium: {
            title: "Wow! Easy Level Cleared!",
            sub: "Welcome to Medium Level",
            desc: "Questions are trickier now. You have only 10 seconds per question. Good luck! ",
            color: "#f39c12",
        },
        hard: {
            title: "Wow! Medium Level Cleared!",
            sub: "Welcome to Hard Level",
            desc: "This is the final challenge! Only 5 seconds per question. Stay sharp! ",
            color: "#e74c3c",
        },
    };

    const msg = messages[level];

    resetState();
    clearInterval(timer);

    document.getElementById("timer").innerHTML = "";

    questionElement.innerHTML = `
        <div style="text-align:center; padding: 10px;">
            <div style="font-size: 36px; margin-bottom: 10px;">${msg.title}</div>
            <div style="font-size: 20px; font-weight: bold; color: ${msg.color}; margin-bottom: 12px;">${msg.sub}</div>
            <div style="font-size: 14px; color: #aaa;">${msg.desc}</div>
        </div>
    `;

    nextButton.innerHTML = "Start " + level.charAt(0).toUpperCase() + level.slice(1) + " Level";
    nextButton.dataset.next = level;
    nextButton.dataset.intro = "true";
    nextButton.style.display = "block";
}

function saveQuestionResult({ userAnswer, isCorrect }) {
    const current = question[currentQuestionIndex];
    if (!current) return;

    if (!usedQuestions[selectedLevel].includes(current.question)) {
        usedQuestions[selectedLevel].push(current.question);
        localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
    }

    answerHistory[currentQuestionIndex] = {
        question: current.question,
        correctAnswer: current.answer.find((a) => a.correct).option,
        userAnswer,
        isCorrect,
    };

    reviewData = answerHistory.filter(Boolean);
    score = reviewData.filter((item) => item.isCorrect).length;
}

function renderSavedAnswer(savedAnswer) {
    Array.from(answerButtons.children).forEach((btn) => {
        const isSelected = btn.innerText === savedAnswer.userAnswer;

        if (btn.dataset.correct === "true") {
            btn.classList.add("correct");
        }

        if (
            isSelected &&
            !savedAnswer.isCorrect &&
            savedAnswer.userAnswer !== "Time Out" &&
            savedAnswer.userAnswer !== "Skipped"
        ) {
            btn.classList.add("incorrect");
        }

        btn.disabled = true;
    });

    nextButton.style.display = "block";
}

function refreshUnlockedLevels() {
    const mediumBtn = document.getElementById("medium-btn");
    const hardBtn = document.getElementById("hard-btn");

    if (mediumBtn) {
        mediumBtn.innerHTML = unlocklevels.medium ? "Medium" : "Medium Locked";
    }

    if (hardBtn) {
        hardBtn.innerHTML = unlocklevels.hard ? "Hard" : "Hard Locked";
    }
}

function showReview() {
    const wrongAnswers = reviewData.filter((item) => !item.isCorrect);

    if (wrongAnswers.length === 0) {
        questionElement.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <div style="font-size:40px;">Great Job!</div>
                <h2 style="color:#4caf50; margin:10px 0;">Perfect Score!</h2>
                <p style="color:#333;">You got all answers correct!</p>
            </div>
        `;
        return;
    }

    let html = `<h2 style="color:#e74c3c; margin-bottom:15px;">Wrong Answers (${wrongAnswers.length})</h2>`;

    wrongAnswers.forEach((item, index) => {
        html += `
            <div style="margin-bottom:15px; padding:12px; border-radius:8px; background:#f4f4f4; color:#333; text-align:left; border-left: 4px solid #e74c3c;">
                <b>Q${index + 1}:</b> ${item.question} <br><br>
                <b>Your Answer:</b>
                <span style="color:red;">${item.userAnswer}</span><br>
                <b>Correct Answer:</b>
                <span style="color:green;">${item.correctAnswer}</span>
            </div>
        `;
    });

    questionElement.innerHTML = html;
}

function showLeaderboard() {
    let html = '<h3 class = "level-title">Easy Level</h3>';
    if (leaderboard.easy.length === 0) {
        html += '<p class = "level-title">No scores yet.</p>';
    } else {
        html += '<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>';
        leaderboard.easy.forEach((entry, index) => {
            html += `<tr id = "leaderboard"><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
        });
        html += '</table>';
    }

    html += '<h3 class = "level-title">Medium Level</h3>';
    if (leaderboard.medium.length === 0) {
        html += '<p class = "level-title">No scores yet.</p>';
    } else {
        html += '<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>';
        leaderboard.medium.forEach((entry, index) => {
            html += `<tr id = "leaderboard"><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
        });
        html += '</table>';
    }

    html += '<h3 class = "level-title">Hard Level</h3>';
    if (leaderboard.hard.length === 0) {
        html += '<p class = "level-title">No scores yet.</p>';
    } else {
        html += '<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>';
        leaderboard.hard.forEach((entry, index) => {
            html += `<tr id = "leaderboard"><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
        });
        html += '</table>';
    }

    document.getElementById("leaderboard-content").innerHTML = html;
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}
