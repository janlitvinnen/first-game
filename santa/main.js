// Santa Quiz - Placeholder Implementation
// This will contain the quiz logic

// Quiz questions (Placeholder - to be filled in later)
const questions = [
  {
    type: "text", // Text input question
    question: "Wie ist 'Hallo' auf Ladinisch?",
    correctAnswers: ["bun di", "bundi"], // Accepted variations (normalized)
    placeholder: "Deine Antwort hier eingeben..."
  },
  {
    type: "choice", // Multiple choice question
    question: "Wie alt bist du?",
    options: [
      "12",
      "13",
      "14",
      "15"
    ],
    correct: 1 // Index 1 = 13
  },
  {
    type: "choice", // Multiple choice question
    question: "Wie heißt du?",
    options: [
      "Konstantin",
      "Stepan",
      "Mischa",
      "Anton"
    ],
    correct: 0 // Index 0 = Konstantin
  },
  {
    type: "choice", // Multiple choice question
    question: "Hast du einen Bruder?",
    options: [
      "Ja",
      "Nein"
    ],
    correct: 0, // Index 0 = Ja
    showHintAfter: true, // Show special hint after this question
    hintMessage: "🎮 Schau bei Litvinovs PS5 und du siehst einen Code! 🎮"
  },
  {
    type: "text", // Text input question
    question: "Gib den Code ein, den du gefunden hast:",
    correctAnswers: ["1540"], // The code found at the PS
    placeholder: "Code hier eingeben..."
  }
];

// Secret message that will be revealed at the end
const secretMessage = "im Keller von Litvinov! 🏠";

// Current quiz state
let currentQuestion = 0;
let selectedAnswer = null;
let correctAnswers = 0;

// Initialize quiz
function startQuiz() {
  showScreen('quiz-screen');
  currentQuestion = 0;
  correctAnswers = 0;
  selectedAnswer = null;
  updateProgress();
  loadQuestion();
}

// Load current question
function loadQuestion() {
  const questionData = questions[currentQuestion];
  const questionContainer = document.getElementById('question-container');
  const nextBtn = document.getElementById('next-btn');
  
  selectedAnswer = null;
  nextBtn.disabled = true;
  
  if (questionData.type === 'text') {
    // Text input question
    questionContainer.innerHTML = `
      <div class="question">
        ${questionData.question}
      </div>
      <div class="text-answer-container">
        <input 
          type="text" 
          id="text-answer" 
          class="text-input" 
          placeholder="${questionData.placeholder}"
          oninput="handleTextInput()"
          onkeydown="if(event.key === 'Enter' && !document.getElementById('next-btn').disabled) nextQuestion()"
        />
      </div>
    `;
    // Focus on input field
    setTimeout(() => document.getElementById('text-answer').focus(), 100);
  } else {
    // Multiple choice question
    questionContainer.innerHTML = `
      <div class="question">
        ${questionData.question}
      </div>
      <div class="options" id="options">
        ${questionData.options.map((option, index) => `
          <div class="option" onclick="selectAnswer(${index})" data-index="${index}">
            ${option}
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Handle text input
function handleTextInput() {
  const textInput = document.getElementById('text-answer');
  const nextBtn = document.getElementById('next-btn');
  
  // Enable button if there's any text
  if (textInput && textInput.value.trim().length > 0) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
}

// Normalize text for comparison (remove punctuation, extra spaces, lowercase)
function normalizeAnswer(text) {
  return text
    .toLowerCase()
    .replace(/[.!?,;:]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')      // Normalize spaces
    .trim();
}

// Handle answer selection (for multiple choice)
function selectAnswer(index) {
  // Remove previous selections
  const options = document.querySelectorAll('.option');
  options.forEach(opt => opt.classList.remove('selected'));
  
  // Mark selected option
  const selectedOption = document.querySelector(`[data-index="${index}"]`);
  selectedOption.classList.add('selected');
  
  selectedAnswer = index;
  document.getElementById('next-btn').disabled = false;
}

// Move to next question or finish quiz
function nextQuestion() {
  const questionData = questions[currentQuestion];
  let isCorrect = false;
  
  if (questionData.type === 'text') {
    // Text input question
    const textInput = document.getElementById('text-answer');
    const userAnswer = normalizeAnswer(textInput.value);
    
    // Check if answer matches any of the correct answers
    isCorrect = questionData.correctAnswers.some(correctAnswer => 
      normalizeAnswer(correctAnswer) === userAnswer
    );
    
    // Show feedback
    if (isCorrect) {
      textInput.classList.add('correct-input');
      correctAnswers++;
    } else {
      textInput.classList.add('wrong-input');
    }
    textInput.disabled = true;
    
  } else {
    // Multiple choice question
    isCorrect = selectedAnswer === questionData.correct;
    
    if (isCorrect) {
      correctAnswers++;
    }
    
    // Show correct answer feedback
    const options = document.querySelectorAll('.option');
    options.forEach((opt, index) => {
      if (index === questionData.correct) {
        opt.classList.add('correct');
      } else if (index === selectedAnswer && index !== questionData.correct) {
        opt.classList.add('wrong');
      }
      opt.style.pointerEvents = 'none';
    });
  }
  
  // Wait a moment, then check if answer was correct
  setTimeout(() => {
    if (!isCorrect) {
      // Wrong answer - show fail screen
      showScreen('fail-screen');
    } else {
      // Correct answer - continue
      // Check if this question has a hint to show
      if (questionData.showHintAfter) {
        showHint(questionData.hintMessage);
      } else {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
          updateProgress();
          loadQuestion();
        } else {
          finishQuiz();
        }
      }
    }
  }, 1000);
}

// Show hint screen
function showHint(message) {
  document.getElementById('hint-message').innerHTML = message;
  showScreen('hint-screen');
}

// Continue to next question after hint
function continueToNextQuestion() {
  currentQuestion++;
  
  if (currentQuestion < questions.length) {
    updateProgress();
    loadQuestion();
    showScreen('quiz-screen');
  } else {
    finishQuiz();
  }
}

// Update progress bar
function updateProgress() {
  const progress = (currentQuestion / questions.length) * 100;
  document.getElementById('progress').style.width = progress + '%';
}

// Finish quiz and show results
function finishQuiz() {
  // Update the secret message
  document.getElementById('secret-location').innerHTML = `
    🎁 Dein Geschenk findest du... 🎁
    <br><br>
    <span style="font-size: 1.8rem;">📍 ${secretMessage}</span>
  `;
  
  showScreen('final-screen');
}

// Helper function to switch between screens
function showScreen(screenId) {
  const screens = document.querySelectorAll('.quiz-section');
  screens.forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Optional: Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const nextBtn = document.getElementById('next-btn');
    if (!nextBtn.disabled && nextBtn.offsetParent !== null) {
      nextQuestion();
    }
  }
});

