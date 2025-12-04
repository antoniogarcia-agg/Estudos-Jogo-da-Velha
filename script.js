const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

class TicTacToe {
  constructor() {
    this.cells = Array.from(document.querySelectorAll(".celula"));
    this.scoreX = document.querySelector(".placar1");
    this.scoreO = document.querySelector(".placar2");
    this.resetButton = document.querySelector(".score button");
    this.piecesXWrapper = document.querySelector(".pecas1");
    this.piecesOWrapper = document.querySelector(".pecas2");

    this.initialPieces = { X: 5, O: 4 };
    this.scores = { X: 0, O: 0 };

    this.init();
  }

  init() {
    this.board = Array(9).fill(null);
    this.current = "X";
    this.piecesLeft = { ...this.initialPieces };
    this.renderPieces();
    this.renderBoard();
    this.attachEvents();
    this.updateScoreUI();
  }

  attachEvents() {
    this.cells.forEach((cell, idx) => {
      cell.addEventListener("mouseenter", () => this.onCellHover(cell, idx));
      cell.addEventListener("mouseleave", () => this.onCellLeave(cell));
      cell.addEventListener("click", () => this.onCellClick(cell, idx));
    });

    this.resetButton.addEventListener("click", () => {
      const ok = confirm("Deseja zerar os placares e reiniciar o jogo?");
      if (ok) {
        this.scores = { X: 0, O: 0 };
        this.updateScoreUI();
        this.resetBoard();
      }
    });
  }

  onCellHover(cell, idx) {
    if (this.board[idx] !== null) return;
    if (this.piecesLeft[this.current] <= 0) return;
    if (cell.querySelector(".preview")) return;
    const preview = document.createElement("i");
    preview.className =
      this.current === "X"
        ? "preview fa-solid fa-x"
        : "preview fa-regular fa-circle";
    cell.appendChild(preview);
  }

  onCellLeave(cell) {
    const preview = cell.querySelector(".preview");
    if (preview) preview.remove();
  }

  onCellClick(cell, idx) {
    if (this.board[idx] !== null) return;
    if (this.piecesLeft[this.current] <= 0) return;

    this.placeMark(cell, idx, this.current);
    const winner = this.checkWin();
    if (winner) {
      this.scores[winner]++;
      this.updateScoreUI();
      setTimeout(() => this.resetBoard(), 900);
      return;
    }

    if (this.isDraw()) {
      setTimeout(() => this.resetBoard(), 900);
      return;
    }

    this.togglePlayer();
  }

  placeMark(cell, idx, player) {
    this.board[idx] = player;
    const icon = document.createElement("i");
    icon.className = player === "X" ? "fa-solid fa-x" : "fa-regular fa-circle";
    const prev = cell.querySelector(".preview");
    if (prev) prev.remove();
    cell.appendChild(icon);

    this.decrementPiece(player);
  }

  decrementPiece(player) {
    if (this.piecesLeft[player] <= 0) return;
    this.piecesLeft[player]--;
    const wrapper = player === "X" ? this.piecesXWrapper : this.piecesOWrapper;
    const icons = Array.from(wrapper.querySelectorAll("i"));
    for (const ic of icons) {
      if (ic.style.visibility !== "hidden") {
        ic.style.visibility = "hidden";
        break;
      }
    }
  }

  renderPieces() {
    const resetVisibility = (el) => {
      el.querySelectorAll("i").forEach((i) => (i.style.visibility = "visible"));
    };
    resetVisibility(this.piecesXWrapper);
    resetVisibility(this.piecesOWrapper);
  }

  renderBoard() {
    this.cells.forEach((cell, idx) => {
      cell.innerHTML = "";
    });
  }

  togglePlayer() {
    this.current = this.current === "X" ? "O" : "X";
  }

  checkWin() {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }
    return null;
  }

  isDraw() {
    return this.board.every((cell) => cell !== null);
  }

  resetBoard() {
    this.board = Array(9).fill(null);
    this.renderBoard();
    this.piecesLeft = { ...this.initialPieces };
    this.renderPieces();
    this.current = "X";
  }

  updateScoreUI() {
    this.scoreX.textContent = this.scores.X;
    this.scoreO.textContent = this.scores.O;
  }
}

document.addEventListener("DOMContentLoaded", () => new TicTacToe());
