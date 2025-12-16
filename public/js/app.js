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

function nextQuiz() {
  const card = PRACTICE_DATA[Math.floor(Math.random() * PRACTICE_DATA.length)];
  const distractors = shuffle(PRACTICE_DATA).filter((item) => item.symbol !== card.symbol).slice(0, 3);
  const options = shuffle([card, ...distractors]);

  quizSymbol.textContent = card.symbol;
  quizOptions.innerHTML = '';
  quizFeedback.textContent = 'Pronto para testar?';
  quizFeedback.style.color = '';

  options.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = option.romanization;
    button.addEventListener('click', () => {
      if (option.symbol === card.symbol) {
        score += 1;
        streak += 1;
        quizFeedback.textContent = 'Correto! ⚡ continue.';
        quizFeedback.style.color = '#ff9f1c';
      } else {
        streak = 0;
        quizFeedback.textContent = `Errou — era ${card.romanization}.`;
        quizFeedback.style.color = '#f87171';
      }
      scoreEl.textContent = score;
      streakEl.textContent = streak;
      nextQuiz();
    });
    quizOptions.appendChild(button);
  });
}

revealBtn.addEventListener('click', revealCard);
nextBtn.addEventListener('click', pickCard);

pickCard();
nextQuiz();
