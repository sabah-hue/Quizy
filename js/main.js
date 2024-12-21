document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome');
    const quizBox = document.getElementById('quiz');
    const questionEl = document.querySelector('.question');
    const answersEl = document.querySelector('.answers');
    const timerEl = document.querySelector('.timer span');
    const submitBtn = document.querySelector('.submit-btn');
    const scoreEl = document.querySelector('.score');

    let questions = [];
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 180; // 3 minutes

    async function loadQuestions() {
        const response = await fetch('questions.json');
        const data = await response.json();
        questions = data.questions;
        return questions;
    }

    async function startQuiz() {
        questions = await loadQuestions();
        welcomeScreen.style.display = 'none';
        quizBox.style.display = 'block';
        showQuestion();
        startTimer();
    }

    function showQuestion() {
        const question = questions[currentQuestion];
        questionEl.textContent = question.title;
        
        answersEl.innerHTML = question.answers
            .map((answer, index) => `
                <div class="answer" data-answer="${answer}">
                    ${answer}
                </div>
            `).join('');
    }

    function checkAnswer() {
        const selected = document.querySelector('.answer.selected');
        const currentQ = questions[currentQuestion];
        
        if (selected && currentQ && selected.dataset.answer === currentQ.rightAnswer) {
            score++;
        }
        
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            clearInterval(timer);
            showFinalScore();
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                showTimeUpScore();
            }
        }, 1000);
    }

    function showTimeUpScore() {
        questionEl.style.display = 'none';
        answersEl.style.display = 'none';
        submitBtn.style.display = 'none';
        timerEl.parentElement.style.display = 'none';
        
        scoreEl.innerHTML = `
            <h2>Time's Up!</h2>
            <p>Your Final Score: ${score}/${questions.length}</p>
            <p>Questions Completed: ${currentQuestion}/${questions.length}</p>
            <button onclick="location.reload()" class="restart-btn">
                Try Again
            </button>
        `;
    }

    function showFinalScore() {
        questionEl.style.display = 'none';
        answersEl.style.display = 'none';
        submitBtn.style.display = 'none';
        timerEl.parentElement.style.display = 'none';
        
        scoreEl.innerHTML = `
            <h2>Quiz Completed!</h2>
            <p>Your Final Score: ${score}/${questions.length}</p>
            <button onclick="location.reload()" class="restart-btn">
                Take Quiz Again
            </button>
        `;
    }

    document.getElementById('start-btn').addEventListener('click', startQuiz);
    submitBtn.addEventListener('click', checkAnswer);
    answersEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('answer')) {
            document.querySelectorAll('.answer').forEach(a => a.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
});
