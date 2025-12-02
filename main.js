const restartBtn = document.getElementById("restart");
const movesDisplay = document.getElementById("moves");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameBoard = document.getElementById("gameBoard");

const popup = document.getElementById("popup");
const resultMessage = document.getElementById("resultMessage");
const closePopup = document.getElementById("closePopup");

const idlePopup = document.getElementById("idlePopup");
const resumeGameBtn = document.getElementById("resumeGame");
const idleRestartBtn = document.getElementById("idleRestart");

let moves = 0;
let score = 0;
let time = 0;
let timer = null;
let firstClick = false;
let gameCompleted = false;

let cards = ["🐶", "🐱", "🐸", "🐵", "🐼", "🦁", "🐯", "🐮", "🐰", "🐷"];
let gameCards = [...cards, ...cards];
let flippedCards = [];
let lockBoard = false;

let inactivityTimer;

//FORMAT TIME
function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

//Timer
function startTimer() {
  timer = setInterval(() => {
    time++;
    timeDisplay.textContent = "Time: " + formatTime(time);
  }, 1000);
}

// RESET INACTIVITY TIMER
function resetInactivity() {
  if (gameCompleted) return;

  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (!gameCompleted) {
      idlePopup.style.display = "flex"; // Only idle popup
      clearInterval(timer);
    }
  }, 10000);
}

// CREATE GAME BOARD
function createBoard() {
  gameCompleted = false;

  gameBoard.innerHTML = "";
  gameCards = shuffle([...gameCards]);

  gameCards.forEach((value) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });

  moves = 0;
  score = 0;
  time = 0;
  firstClick = false;

  movesDisplay.textContent = "Moves: 0";
  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time: 00:00";

  clearInterval(timer);
  timer = null;

  winPopup.style.display = "none";
  idlePopup.style.display = "none";
  resetInactivity();
}

// SHUFFLE
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// FLIP CARD
function flipCard() {
  resetInactivity();

  if (lockBoard || this.classList.contains("flipped")) return;

  if (!firstClick) {
    startTimer();
    firstClick = true;
  }

  this.classList.add("flipped");
  this.textContent = this.dataset.value;

  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = "Moves: " + moves;
    checkMatch();
  }
}

// MATCH CHECK
function checkMatch() {
  lockBoard = true;
  const [card1, card2] = flippedCards;

  if (card1.dataset.value === card2.dataset.value) {
    card1.classList.add("matched");
    card2.classList.add("matched");

    score += 10;
    scoreDisplay.textContent = "Score: " + score;

    flippedCards = [];
    lockBoard = false;

    // WIN CHECK
    if (document.querySelectorAll(".matched").length === gameCards.length) {
      showWinPopup();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

//SHOW WIN POPUP
function showWinPopup() {
  gameCompleted = true;
  clearTimeout(inactivityTimer);
  clearInterval(timer);
  popup.style.display = "flex";
  resultMessage.textContent = `You completed the game in ${moves} moves and ${time} seconds! 🎉`;
}

// Close popup
closePopup.addEventListener("click", () => {
  createBoard();
});

// Restart button
restartBtn.addEventListener("click", () => {
  popup.style.display = "none";
  showWinPopup(false);
  score = 0;
  createBoard();

  //   showWinPopup(flase);
  //   resetInactivity(false);
});

// IDLE POPUP BUTTONS
resumeGameBtn.addEventListener("click", () => {
  idlePopup.style.display = "none";
  resetInactivity();
  startTimer();
});

idleRestartBtn.addEventListener("click", () => {
  idlePopup.style.display = "none";
  createBoard();
});

// Start game
createBoard();
