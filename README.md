# Tic-Tac-Toe — React

## Overview

A Tic-Tac-Toe game built with React. It supports two-player gameplay and a computer opponent, along with move history, undo functionality, a scoreboard, and game reset options.

## Features

- Interactive 3×3 game board.
- Two-player mode and computer mode.
- Turn tracking and invalid-move prevention.
- Win detection for rows, columns, and diagonals.
- Highlighting of winning cells.
- Draw detection and prevention of moves after game completion.
- Computer AI that prioritizes winning, blocking the opponent, choosing the center, choosing a corner, and then selecting another available cell.
- Move history and undo functionality.
- Scoreboard for wins and draws.
- Separate options to reset the current game and the scoreboard.

## Prerequisites

- Node.js
- npm

## Installation

Clone or download the project, navigate to its root directory, and install dependencies:

```bash
npm install
```

## Run the application

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Run tests

Run tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

## Technical implementation

- **React:** Builds the interactive user interface and manages game state.
- **JavaScript:** Implements game rules and computer move selection.
- **CSS:** Styles the board, controls, and winning-cell highlights.
- **Vitest:** Runs unit and component tests.
- **React Testing Library:** Tests user interactions and rendered UI behavior.

## Computer AI strategy

The computer evaluates available moves in this order:

1. Take a winning move if one is available.
2. Block the player's immediate winning move.
3. Choose the center cell.
4. Choose an available corner.
5. Choose another available cell.

## Testing

The project currently has 21 passing automated tests covering game logic and UI behavior. Additional scenarios have been manually verified.

## Future improvements

- Improve AI decision-making using the minimax algorithm.
- Add difficulty levels.
- Improve responsive styling and accessibility.
