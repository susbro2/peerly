class QuizSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timeLeft = 0;
        this.timer = null;
        this.quizStarted = false;
        
        // Sample quiz data - in real app, this would come from backend
        this.quizData = {
            title: "Mathematics - Basic Algebra",
            description: "Test your knowledge of basic algebraic concepts",
            timeLimit: 300, // 5 minutes
            questions: [
                {
                    question: "What is the value of x in the equation: 2x + 5 = 13?",
                    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
                    correct: 1,
                    explanation: "2x + 5 = 13, so 2x = 8, therefore x = 4"
                },
                {
                    question: "Simplify: 3(x + 2) - 2x",
                    options: ["x + 6", "x + 2", "3x + 6", "5x + 6"],
                    correct: 0,
                    explanation: "3(x + 2) - 2x = 3x + 6 - 2x = x + 6"
                },
                {
                    question: "What is the slope of the line y = 2x - 3?",
                    options: ["2", "-3", "3", "-2"],
                    correct: 0,
                    explanation: "In the form y = mx + b, m is the slope. Here m = 2"
                },
                {
                    question: "Factor: x² - 9",
                    options: ["(x - 3)(x - 3)", "(x + 3)(x + 3)", "(x - 3)(x + 3)", "Cannot be factored"],
                    correct: 2,
                    explanation: "x² - 9 is a difference of squares: (x - 3)(x + 3)"
                },
                {
                    question: "If f(x) = 2x + 1, what is f(3)?",
                    options: ["5", "6", "7", "8"],
                    correct: 2,
                    explanation: "f(3) = 2(3) + 1 = 6 + 1 = 7"
                }
            ]
        };
        
        this.showQuizStart();
    }
    
    showQuizStart() {
        this.container.innerHTML = `
            <div class="quiz-start">
                <h2>${this.quizData.title}</h2>
                <p class="quiz-description">${this.quizData.description}</p>
                <div class="quiz-info">
                    <div class="quiz-stat">
                        <i class="fas fa-question-circle"></i>
                        <span>${this.quizData.questions.length} Questions</span>
                    </div>
                    <div class="quiz-stat">
                        <i class="fas fa-clock"></i>
                        <span>${Math.floor(this.quizData.timeLimit / 60)} Minutes</span>
                    </div>
                    <div class="quiz-stat">
                        <i class="fas fa-trophy"></i>
                        <span>Pass: 70%</span>
                    </div>
                </div>
                <button class="start-quiz-btn" onclick="quiz.startQuiz()">Start Quiz</button>
            </div>
        `;
    }
    
    startQuiz() {
        this.quizStarted = true;
        this.timeLeft = this.quizData.timeLimit;
        this.startTimer();
        this.showQuestion();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = document.querySelector('.quiz-timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Add warning class when time is running low
            if (this.timeLeft <= 60) {
                timerElement.classList.add('warning');
            }
        }
    }
    
    showQuestion() {
        const question = this.quizData.questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / this.quizData.questions.length) * 100;
        
        this.container.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">Question ${this.currentQuestionIndex + 1} of ${this.quizData.questions.length}</span>
                </div>
                <div class="quiz-timer">${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}</div>
            </div>
            
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="quiz.selectAnswer(${index})">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="quiz-navigation">
                <button class="quiz-nav-btn" onclick="quiz.previousQuestion()" 
                        ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <button class="quiz-nav-btn primary" onclick="quiz.nextQuestion()" disabled id="next-btn">
                    ${this.currentQuestionIndex === this.quizData.questions.length - 1 ? 'Finish' : 'Next'} 
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }
    
    selectAnswer(answerIndex) {
        // Remove previous selection
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelectorAll('.quiz-option')[answerIndex].classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Enable next button
        document.getElementById('next-btn').disabled = false;
    }
    
    nextQuestion() {
        if (this.userAnswers[this.currentQuestionIndex] === undefined) return;
        
        if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            this.endQuiz();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }
    
    endQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.calculateScore();
        this.showResults();
    }
    
    calculateScore() {
        this.score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.quizData.questions[index].correct) {
                this.score++;
            }
        });
    }
    
    showResults() {
        const percentage = Math.round((this.score / this.quizData.questions.length) * 100);
        const passed = percentage >= 70;
        
        this.container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <span class="score-percentage">${percentage}%</span>
                        <span class="score-label">${this.score}/${this.quizData.questions.length}</span>
                    </div>
                    <h2>${passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
                    <p class="results-message">
                        ${passed ? 'You passed the quiz!' : 'You need 70% to pass. Review the explanations below and try again.'}
                    </p>
                </div>
                
                <div class="results-breakdown">
                    <h3>Question Review</h3>
                    ${this.quizData.questions.map((question, index) => {
                        const userAnswer = this.userAnswers[index];
                        const isCorrect = userAnswer === question.correct;
                        
                        return `
                            <div class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                                <div class="question-header">
                                    <span class="question-number">Q${index + 1}</span>
                                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                </div>
                                <p class="question-text">${question.question}</p>
                                <div class="answer-comparison">
                                    ${userAnswer !== undefined ? `
                                        <p class="user-answer ${isCorrect ? 'correct' : 'incorrect'}">
                                            Your answer: ${question.options[userAnswer]}
                                        </p>
                                    ` : '<p class="user-answer unanswered">Not answered</p>'}
                                    ${!isCorrect ? `
                                        <p class="correct-answer">
                                            Correct answer: ${question.options[question.correct]}
                                        </p>
                                    ` : ''}
                                </div>
                                <p class="explanation">${question.explanation}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="results-actions">
                    <button class="quiz-action-btn" onclick="quiz.retakeQuiz()">
                        <i class="fas fa-redo"></i> Retake Quiz
                    </button>
                    <button class="quiz-action-btn primary" onclick="quiz.goToDashboard()">
                        <i class="fas fa-home"></i> Back to Dashboard
                    </button>
                </div>
            </div>
        `;
    }
    
    retakeQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.quizStarted = false;
        this.showQuizStart();
    }
    
    goToDashboard() {
        window.location.href = 'dashboard.html';
    }
}