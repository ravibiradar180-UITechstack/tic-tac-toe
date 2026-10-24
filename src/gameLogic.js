
export const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(board) {
  for (const [a, b, c] of winningCombinations) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

export function isDraw(board) {
  return !getWinner(board) && board.every((cell) => cell !== null);
}


export function findStrategicMove(board, player) {
  for (const [a, b, c] of winningCombinations) {
    const cells = [a, b, c];

    const playerCells = cells.filter(
      (index) => board[index] === player
    );

    const emptyCells = cells.filter(
      (index) => board[index] === null
    );

    if (playerCells.length === 2 && emptyCells.length === 1) {
      return emptyCells[0];
    }
  }

  return -1;
}

export function getComputerMove(board) {
  // 1. Win if possible.
  const winningMove = findStrategicMove(board, "O");
  if (winningMove !== -1) return winningMove;

  // 2. Block X from winning.
  const blockingMove = findStrategicMove(board, "X");
  if (blockingMove !== -1) return blockingMove;

  // 3. Take the center.
  if (board[4] === null) return 4;

  // 4. Take a corner.
  const corners = [0, 2, 6, 8];
  const availableCorner = corners.find(
    (index) => board[index] === null
  );
  if (availableCorner !== undefined) return availableCorner;

  // 5. Take any remaining cell.
  return board.findIndex((cell) => cell === null);
}


export function getWinningCombination(board) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      return combination;
    }
  }

  return [];
}

