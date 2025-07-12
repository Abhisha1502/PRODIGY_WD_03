let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xScore = 0;
let oScore = 0;
let mode = "ai"; // default

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("status");
const xScoreDisplay = document.getElementById("x-score");
const oScoreDisplay = document.getElementById("o-score");
const toggle = document.getElementById("theme-toggle");
const label = document.getElementById("mode-label");
const modeRadios = document.querySelectorAll('input[name="game-mode"]');

// Add event listeners
cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    mode = document.querySelector('input[name="game-mode"]:checked').value;
    resetGame();
  });
});

toggle.addEventListener("change", () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
  label.innerText = document.body.classList.contains("light") ? "Light Mode" : "Dark Mode";
});

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkGameOver(currentPlayer)) return;

  if (mode === "ai" && currentPlayer === "X") {
    currentPlayer = "O";
    statusDisplay.textContent = "AI is thinking...";
    setTimeout(aiMove, 500);
  } else if (mode === "pvp") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function aiMove() {
  const emptyIndexes = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  const move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

  if (move !== undefined) {
    board[move] = "O";
    document.querySelector(`[data-index="${move}"]`).textContent = "O";
    if (checkGameOver("O")) return;
  }

  currentPlayer = "X";
  statusDisplay.textContent = "Your turn (X)";
}

function checkGameOver(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      document.querySelector(`[data-index="${a}"]`).classList.add("win");
      document.querySelector(`[data-index="${b}"]`).classList.add("win");
      document.querySelector(`[data-index="${c}"]`).classList.add("win");

      gameActive = false;
      statusDisplay.textContent = `Player ${player} wins!`;

      if (player === "X") xScore++;
      else oScore++;

      xScoreDisplay.textContent = xScore;
      oScoreDisplay.textContent = oScore;

      return true;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    statusDisplay.textContent = "It's a draw!";
    return true;
  }

  return false;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusDisplay.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
}
