
import { useState } from "react";
import "./App.css";
import { getWinner, isDraw, winningCombinations, findStrategicMove,
  getComputerMove, getWinningCombination } from "./gameLogic";


const emptyBoard = () => Array(9).fill(null);



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

  const winningCells = getWinningCombination(board);
  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const gameOver = Boolean(winner) || isDraw;

  
function handleCellClick(index) {
  if (board[index] || gameOver) {
    return;
  }

  // Apply a move and record it in history.
  function applyMove(currentBoard, player, cellIndex, history) {
    const nextBoard = [...currentBoard];
    nextBoard[cellIndex] = player;

    const nextHistory = [
      ...history,
      { player, cellIndex },
    ];

    return { nextBoard, nextHistory };
  }

  // Record a completed game's result exactly once per move.
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

  const humanMove = applyMove(board, currentPlayer, index, moveHistory);
  setBoard(humanMove.nextBoard);
  setMoveHistory(humanMove.nextHistory);

  const humanGameOver = updateScore(humanMove.nextBoard);

  if (humanGameOver) {
    return;
  }

  // In two-player mode, alternate turns normally.
  if (gameMode === "TwoPlayer") {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    return;
  }

  // Computer mode: X is the human and O is the computer.
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

  const computerGameOver = updateScore(computerMove.nextBoard);

  if (!computerGameOver) {
    setCurrentPlayer("X");
  }
}

  
function findStrategicMove(board, player) {
  for (const [a, b, c] of winningCombinations) {
    const cells = [a, b, c];
    const playerCells = cells.filter((index) => board[index] === player);
    const emptyCells = cells.filter((index) => board[index] === null);

    if (playerCells.length === 2 && emptyCells.length === 1) {
      return emptyCells[0];
    }
  }

  return -1;
}

function getComputerMove(board) {
  // Priority 1: Win if possible.
  const winningMove = findStrategicMove(board, "O");
  if (winningMove !== -1) return winningMove;

  // Priority 2: Block X from winning.
  const blockingMove = findStrategicMove(board, "X");
  if (blockingMove !== -1) return blockingMove;

  // Priority 3: Take the center.
  if (board[4] === null) return 4;

  // Priority 4: Take a corner.
  const corners = [0, 2, 6, 8];
  const availableCorner = corners.find((index) => board[index] === null);
  if (availableCorner !== undefined) return availableCorner;

  // Priority 5: Take any available cell.
  return board.findIndex((cell) => cell === null);
}

  

function undoMove() {
  if (moveHistory.length === 0) {
    return;
  }

  const previousWinner = getWinner(board);
  const previousDraw = !previousWinner && board.every(Boolean);

  // Reverse the result if this undo reopens a completed game.
  if (previousWinner) {
    setScoreboard((previous) => ({
      ...previous,
      [previousWinner]: Math.max(0, previous[previousWinner] - 1),
    }));
  } else if (previousDraw) {
    setScoreboard((previous) => ({
      ...previous,
      draws: Math.max(0, previous.draws - 1),
    }));
  }

  // In computer mode, undo the computer's response and
  // the human move that triggered it.
  const movesToRemove = gameMode === "Computer"
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

  // The player who made the earliest removed move gets the turn back.
  setCurrentPlayer(removedMoves[0].player);
}



  function resetGame() {
    setBoard(emptyBoard());
    setCurrentPlayer("X");
    setMoveHistory([]);
  }

  function resetScoreboard() {
    setScoreboard({ X: 0, O: 0, draws: 0 });
  }

  return (
    <main className="game-container">
      <h1>Tic-Tac-Toe</h1>
      <div className="mode-selector">
  <label htmlFor="game-mode">Game mode:</label>

  <select
    id="game-mode"
    value={gameMode}
    onChange={(event) => {
      setGameMode(event.target.value);
      resetGame();
    }}
  >
    <option value="TwoPlayer">Two Players</option>
    <option value="Computer">Play Against Computer</option>
  </select>
</div>
      <p className="game-status" aria-live="polite">
        {winner
          ? `Player ${winner} wins!`
          : isDraw
            ? "It's a draw!"
            : `Player ${currentPlayer}'s turn`}
      </p>

      <div className="board" role="group" aria-label="Tic-Tac-Toe board">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className={`cell ${winningCells.includes(index) ? "winning-cell" : ""}`}
            onClick={() => handleCellClick(index)}
            aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
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

        <button type="button" className="reset-button" onClick={resetGame}>
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
