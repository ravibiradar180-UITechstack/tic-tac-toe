
import { useState } from "react";
import "./App.css";

import {
  getWinner,
  getComputerMove,
  getWinningCombination,
} from "./gameLogic";

// Creates a fresh board containing nine empty cells.
const emptyBoard = () => Array(9).fill(null);

// Pure function: returns a new board and updated move history.
function applyMove(currentBoard, player, cellIndex, history) {
  const nextBoard = [...currentBoard];
  nextBoard[cellIndex] = player;

  const nextHistory = [
    ...history,
    { player, cellIndex },
  ];

  return {
    nextBoard,
    nextHistory,
  };
}

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameMode, setGameMode] = useState("TwoPlayer");
  const [moveHistory, setMoveHistory] = useState([]);
  const [scoreboard, setScoreboard] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  // Derived values: these are calculated from the current board.
  const winner = getWinner(board);
  const draw = !winner && board.every(Boolean);
  const gameOver = Boolean(winner) || draw;
  const winningCells = getWinningCombination(board);

  // Updates the scoreboard for a completed game.
  // Returns true if the supplied board ends the game.
  function updateScore(nextBoard) {
    const nextWinner = getWinner(nextBoard);
    const nextDraw = !nextWinner && nextBoard.every(Boolean);

    if (nextWinner) {
      setScoreboard((previous) => ({
        ...previous,
        [nextWinner]: previous[nextWinner] + 1,
      }));
    } else if (nextDraw) {
      setScoreboard((previous) => ({
        ...previous,
        draws: previous.draws + 1,
      }));
    }

    return Boolean(nextWinner) || nextDraw;
  }

  function handleCellClick(index) {
    // Ignore occupied cells, completed games, and
    // prevent human input during the computer's turn.
    if (
      board[index] ||
      gameOver ||
      (gameMode === "Computer" && currentPlayer !== "X")
    ) {
      return;
    }

    // Apply the human move.
    const humanMove = applyMove(
      board,
      currentPlayer,
      index,
      moveHistory
    );

    setBoard(humanMove.nextBoard);
    setMoveHistory(humanMove.nextHistory);

    // Stop if the human move completes the game.
    if (updateScore(humanMove.nextBoard)) {
      return;
    }

    // Two-player mode: switch between X and O.
    if (gameMode === "TwoPlayer") {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      return;
    }

    // Computer mode: O is controlled by the computer.
    const computerIndex = getComputerMove(humanMove.nextBoard);

    if (computerIndex === -1) {
      return;
    }

    const computerMove = applyMove(
      humanMove.nextBoard,
      "O",
      computerIndex,
      humanMove.nextHistory
    );

    setBoard(computerMove.nextBoard);
    setMoveHistory(computerMove.nextHistory);

    // Stop if the computer wins or draws.
    if (updateScore(computerMove.nextBoard)) {
      return;
    }

    // The human plays X again.
    setCurrentPlayer("X");
  }

  function undoMove() {
    if (moveHistory.length === 0) {
      return;
    }

    // Remove the previous result from the scoreboard
    // if undoing reopens a completed game.
    if (winner) {
      setScoreboard((previous) => ({
        ...previous,
        [winner]: Math.max(0, previous[winner] - 1),
      }));
    } else if (draw) {
      setScoreboard((previous) => ({
        ...previous,
        draws: Math.max(0, previous.draws - 1),
      }));
    }

    // Two-player mode removes one move.
    // Computer mode removes up to the last two moves.
    const movesToRemove =
      gameMode === "Computer"
        ? Math.min(2, moveHistory.length)
        : 1;

    const removedMoves = moveHistory.slice(-movesToRemove);
    const remainingHistory = moveHistory.slice(0, -movesToRemove);

    const updatedBoard = [...board];

    for (const move of removedMoves) {
      updatedBoard[move.cellIndex] = null;
    }

    setBoard(updatedBoard);
    setMoveHistory(remainingHistory);

    // Restore the turn to the earliest removed move's player.
    setCurrentPlayer(removedMoves[0].player);
  }

  function resetGame() {
    setBoard(emptyBoard());
    setCurrentPlayer("X");
    setMoveHistory([]);

    // The scoreboard intentionally remains unchanged.
  }

  function resetScoreboard() {
    setScoreboard({
      X: 0,
      O: 0,
      draws: 0,
    });
  }

  function handleModeChange(event) {
    setGameMode(event.target.value);
    resetGame();
    resetScoreboard();
  }

  return (
    <main className="game-container">
      <h1>Tic-Tac-Toe</h1>

      <div className="mode-selector">
        <label htmlFor="game-mode">Game mode:</label>

        <select
          id="game-mode"
          value={gameMode}
          onChange={handleModeChange}
        >
          <option value="TwoPlayer">Two Players</option>
          <option value="Computer">Play Against Computer</option>
        </select>
      </div>

      <p className="game-status" aria-live="polite">
        {winner
          ? `Player ${winner} wins!`
          : draw
            ? "It's a draw!"
            : `Player ${currentPlayer}'s turn`}
      </p>

      <div
        className="board"
        role="group"
        aria-label="Tic-Tac-Toe board"
      >
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className={`cell ${
              winningCells.includes(index) ? "winning-cell" : ""
            }`}
            onClick={() => handleCellClick(index)}
            aria-label={`Cell ${index + 1}${
              cell ? `, ${cell}` : ", empty"
            }`}
            disabled={Boolean(cell) || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="game-actions">
        <button
          type="button"
          className="undo-button"
          onClick={undoMove}
          disabled={moveHistory.length === 0}
        >
          Undo Move
        </button>

        <button
          type="button"
          className="reset-button"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>

      <section className="history-section">
        <h2>Move History</h2>

        {moveHistory.length === 0 ? (
          <p className="empty-history">No moves yet.</p>
        ) : (
          <ol className="history-list">
            {moveHistory.map((move, index) => (
              <li key={`${move.cellIndex}-${index}`}>
                <strong>{move.player}</strong>
                {" — "}Row {Math.floor(move.cellIndex / 3) + 1},
                {" "}Column {(move.cellIndex % 3) + 1}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="scoreboard">
        <h2>Scoreboard</h2>

        <div className="score-grid">
          <div className="score-item">
            <span>Player X</span>
            <strong>{scoreboard.X}</strong>
          </div>

          <div className="score-item">
            <span>Player O</span>
            <strong>{scoreboard.O}</strong>
          </div>

          <div className="score-item">
            <span>Draws</span>
            <strong>{scoreboard.draws}</strong>
          </div>
        </div>

        <button
          type="button"
          className="score-reset-button"
          onClick={resetScoreboard}
        >
          Reset Scoreboard
        </button>
      </section>
    </main>
  );
}

export default App;
