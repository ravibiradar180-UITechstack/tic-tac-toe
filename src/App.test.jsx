
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("Tic-Tac-Toe", () => {
    
  it("renders the game board with nine cells", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Tic-Tac-Toe" })
    ).toBeInTheDocument();

    const cells = screen.getAllByRole("button", {
      name: /^Cell \d+/,
    });

    expect(cells).toHaveLength(9);
  });

  it("alternates turns between X and O in two-player mode", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: "Cell 1, empty" })
    );

    expect(
      screen.getByRole("button", { name: "Cell 1, X" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Player O's turn")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Cell 2, empty" })
    );

    expect(
      screen.getByRole("button", { name: "Cell 2, O" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Player X's turn")
    ).toBeInTheDocument();
  });

  it("does not allow a player to overwrite an occupied cell", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: "Cell 1, empty" })
    );

    const occupiedCell = screen.getByRole("button", {
      name: "Cell 1, X",
    });

    expect(occupiedCell).toBeDisabled();
    expect(occupiedCell).toHaveTextContent("X");
  });
  
it("undoes the last move in two-player mode", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Cell 1, empty" }));
  fireEvent.click(screen.getByRole("button", { name: "Cell 2, empty" }));

  fireEvent.click(screen.getByRole("button", { name: "Undo Move" }));

  expect(screen.getByRole("button", { name: "Cell 1, X" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cell 2, empty" })).toBeInTheDocument();
  expect(screen.getByText("Player O's turn")).toBeInTheDocument();
});

it("undoes both the player and computer moves in computer mode", () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText("Game mode:"), {
    target: { value: "Computer" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Cell 1, empty" }));

  // The computer should respond after X's move.
  expect(screen.getByRole("button", { name: /^Cell \d+, O$/ })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Undo Move" }));

  expect(screen.getAllByRole("button", { name: /^Cell \d+, empty$/ })).toHaveLength(9);
  expect(screen.getByText("Player X's turn")).toBeInTheDocument();
});

it("resets the board and move history", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Cell 1, empty" }));
  fireEvent.click(screen.getByRole("button", { name: "Reset Game" }));

  expect(screen.getAllByRole("button", { name: /^Cell \d+, empty$/ })).toHaveLength(9);
  expect(screen.getByText("No moves yet.")).toBeInTheDocument();
  expect(screen.getByText("Player X's turn")).toBeInTheDocument();
});

it("resets the scoreboard", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Reset Scoreboard" }));

  const scoreboard = screen.getByRole("heading", { name: "Scoreboard" }).parentElement;
  expect(scoreboard).toHaveTextContent("Player X0");
  expect(scoreboard).toHaveTextContent("Player O0");
  expect(scoreboard).toHaveTextContent("Draws0");
});

it("highlights the three winning cells", () => {
  render(<App />);

  // X: top row
  fireEvent.click(screen.getByRole("button", { name: /cell 1/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 4/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 2/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 5/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 3/i }));

  expect(
    screen.getByRole("button", { name: /cell 1/i })
  ).toHaveClass("winning-cell");

  expect(
    screen.getByRole("button", { name: /cell 2/i })
  ).toHaveClass("winning-cell");

  expect(
    screen.getByRole("button", { name: /cell 3/i })
  ).toHaveClass("winning-cell");

  expect(
    screen.getByRole("button", { name: /cell 4/i })
  ).not.toHaveClass("winning-cell");
});

it("prevents further moves after a player wins", () => {
  render(<App />);

  // X wins across the top row
  fireEvent.click(screen.getByRole("button", { name: /cell 1/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 4/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 2/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 5/i }));
  fireEvent.click(screen.getByRole("button", { name: /cell 3/i }));

  // Attempt to play after the win
  fireEvent.click(screen.getByRole("button", { name: /cell 6/i }));

  expect(
    screen.getByRole("button", { name: /cell 6/i })
  ).toHaveTextContent("");

  expect(screen.getByText(/x wins/i)).toBeInTheDocument();
});

});
