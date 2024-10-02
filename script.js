// Estado del juego
const gameState = {
    level: 1,
    score: 0,
    streak: 0,
    timeLeft: 60,
    correctCount: 0,
    wrongCount: 0,
    currentMode: 'normal',
    hintsAvailable: 3,
    shufflesAvailable: 3
};

// Base de datos de palabras
const categories = {
    general: [
        { word: 'algoritmo', hint: 'Conjunto de pasos para resolver un problema', difficulty: 2 },
        { word: 'variable', hint: 'Contenedor para almacenar datos', difficulty: 1 },
        { word: 'función', hint: 'Bloque de código reutilizable', difficulty: 1 },
        { word: 'recursión', hint: 'Cuando una función se llama a sí misma', difficulty: 3 },
        { word: 'objeto', hint: 'Estructura de datos con propiedades', difficulty: 2 }
    ]
};

// Variables globales
let currentWord;
let timer;

// Elementos DOM
const elements = {
    wordDisplay: document.querySelector('.word-display'),
    wordInput: document.querySelector('.word-input'),
    submitBtn: document.querySelector('.submit-btn'),
    scoreValue: document.querySelector('.score-value'),
    timeValue: document.querySelector('.time-value'),
    streakValue: document.querySelector('.streak-value'),
    levelNumber: document.querySelector('.level-number'),
    xpFill: document.querySelector('.xp-fill'),
    hintBtn: document.querySelector('.hint-btn'),
    shuffleBtn: document.querySelector('.shuffle-btn'),
    letterButtons: document.querySelector('.letter-buttons'),
    hintText: document.querySelector('.hint-text'),
    correctCount: document.querySelector('.correct-count'),
    wrongCount: document.querySelector('.wrong-count'),
    modeBtns: document.querySelectorAll('.mode-btn')
};

// Funciones del juego
function initGame() {
    selectNewWord();
    setupEventListeners();
    updateStats();
}

function selectNewWord() {
    const categoryWords = categories.general;
    currentWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    displayShuffledWord();
    createLetterButtons();
    updateDifficultyStars();
}

function displayShuffledWord() {
    const shuffled = shuffleWord(currentWord.word);
    elements.wordDisplay.textContent = shuffled;
}

function createLetterButtons() {
    elements.letterButtons.innerHTML = '';
    const letters = currentWord.word.split('');
    letters.sort(() => Math.random() - 0.5).forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('letter-btn');
        button.textContent = letter;
        button.addEventListener('click', () => addLetterToInput(letter));
        elements.letterButtons.appendChild(button);
    });
}

function updateDifficultyStars() {
    const stars = document.querySelectorAll('.difficulty-stars i');
    stars.forEach((star, index) => {
        if (index < currentWord.difficulty) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function addLetterToInput(letter) {
    elements.wordInput.value += letter;
}

function checkWord() {
    const userWord = elements.wordInput.value.toLowerCase().trim();
    
    if (userWord === currentWord.word) {
        handleCorrectGuess();
    } else {
        handleWrongGuess();
    }
}

function handleCorrectGuess() {
    gameState.score += 10 * currentWord.difficulty;
    gameState.streak++;
    gameState.correctCount++;
    
    elements.wordDisplay.textContent = '¡Correcto!';
    elements.wordDisplay.classList.add('correct');
    
    updateStats();
    
    setTimeout(() => {
        elements.wordDisplay.classList.remove('correct');
        selectNewWord();
        elements.wordInput.value = '';
    }, 1000);
}

function handleWrongGuess() {
    gameState.streak = 0;
    gameState.wrongCount++;
    
    elements.wordDisplay.textContent = '¡Incorrecto!';
    elements.wordDisplay.classList.add('incorrect');
    
    updateStats();
    
    setTimeout(() => {
        elements.wordDisplay.classList.remove('incorrect');
        displayShuffledWord();
        elements.wordInput.value = '';
    }, 1000);
}

function updateStats() {
    elements.scoreValue.textContent = gameState.score;
    elements.streakValue.textContent = gameState.streak;
    elements.levelNumber.textContent = gameState.level;
    elements.correctCount.textContent = gameState.correctCount;
    elements.wrongCount.textContent = gameState.wrongCount;
    
    // Actualizar barra de XP
    const xpPercentage = (gameState.score % 100);
    elements.xpFill.style.width = `${xpPercentage}%`;
    
    // Comprobar nivel
    if (gameState.score >= gameState.level * 100) {
        gameState.level++;
        elements.levelNumber.textContent = gameState.level;
    }
}

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        gameState.timeLeft--;
        elements.timeValue.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    elements.wordDisplay.textContent = '¡Tiempo terminado!';
    // Aquí puedes añadir más lógica para el fin del juego
}

// Event Listeners
function setupEventListeners() {
    elements.submitBtn.addEventListener('click', checkWord);
    
    elements.wordInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            checkWord();
        }
    });

    elements.hintBtn.addEventListener('click', () => {
        if (gameState.hintsAvailable > 0) {
            elements.hintText.textContent = currentWord.hint;
            gameState.hintsAvailable--;
            elements.hintBtn.classList.add('used');
        }
    });

    elements.shuffleBtn.addEventListener('click', () => {
        if (gameState.shufflesAvailable > 0) {
            displayShuffledWord();
            gameState.shufflesAvailable--;
            elements.shuffleBtn.classList.add('used');
        }
    });

    elements.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.currentMode = btn.dataset.mode;
            elements.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (gameState.currentMode === 'time') {
                startTimer();
            } else {
                clearInterval(timer);
                elements.timeValue.textContent = '60';
            }
        });
    });
}

function resetGame() {
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.timeLeft = 60;
    gameState.hintsAvailable = 3;
    gameState.shufflesAvailable = 3;
    
    elements.hintBtn.classList.remove('used');
    elements.shuffleBtn.classList.remove('used');
    
    updateStats();
    selectNewWord();
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', initGame);