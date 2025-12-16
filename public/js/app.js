const flashSymbol = document.getElementById('flash-symbol');
const flashHint = document.getElementById('flash-hint');
const flashAnswer = document.getElementById('flash-answer');
const revealBtn = document.getElementById('reveal-btn');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const seenEl = document.getElementById('seen');
const quizSymbol = document.getElementById('quiz-symbol');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');

let currentCard = 0;
let score = 0;
let streak = 0;
let seen = 0;

function pickCard() {
  currentCard = Math.floor(Math.random() * PRACTICE_DATA.length);
  const card = PRACTICE_DATA[currentCard];
  flashSymbol.textContent = card.symbol;
  flashHint.textContent = card.hint;
  flashAnswer.textContent = card.romanization;
  flashAnswer.classList.remove('visible');
  seen += 1;
  seenEl.textContent = seen;
}

function revealCard() {
  flashAnswer.classList.add('visible');
}

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

let quizLocked = false;

function handleQuizGuess(buttons, button, option, card) {
  if (quizLocked) return;
  quizLocked = true;

  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  const isCorrect = option.symbol === card.symbol;

  if (isCorrect) {
    score += 1;
    streak += 1;
    quizFeedback.textContent = 'Correto! ⚡ continue.';
    quizFeedback.classList.remove('is-error');
    quizFeedback.classList.add('is-success');
    button.classList.add('is-correct');
  } else {
    streak = 0;
    quizFeedback.textContent = `Errou — era ${card.romanization}.`;
    quizFeedback.classList.remove('is-success');
    quizFeedback.classList.add('is-error');
    button.classList.add('is-incorrect');
    const correctButton = buttons.find((btn) => btn.dataset.symbol === card.symbol);
    if (correctButton) {
      correctButton.classList.add('is-correct');
    }
  }

  scoreEl.textContent = score;
  streakEl.textContent = streak;

  setTimeout(() => {
    quizFeedback.classList.remove('is-success', 'is-error');
    nextQuiz();
  }, 900);
}

function nextQuiz() {
  const card = PRACTICE_DATA[Math.floor(Math.random() * PRACTICE_DATA.length)];
  const distractors = shuffle(PRACTICE_DATA).filter((item) => item.symbol !== card.symbol).slice(0, 3);
  const options = shuffle([card, ...distractors]);

  quizSymbol.textContent = card.symbol;
  quizOptions.innerHTML = '';
  quizFeedback.textContent = 'Pronto para testar?';
  quizFeedback.classList.remove('is-success', 'is-error');
  quizLocked = false;

  const buttons = [];

  options.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = option.romanization;
    button.dataset.symbol = option.symbol;
    button.addEventListener('click', () => handleQuizGuess(buttons, button, option, card));
    buttons.push(button);
    quizOptions.appendChild(button);
  });
}

revealBtn.addEventListener('click', revealCard);
nextBtn.addEventListener('click', pickCard);

pickCard();
nextQuiz();