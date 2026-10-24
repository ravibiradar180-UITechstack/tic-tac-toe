
import { describe, it, expect } from "vitest";
import { getWinner, isDraw, getComputerMove, getWinningCombination } from "./gameLogic";

describe("getWinner", () => {
  it("detects a winning row for X", () => {
    const board = ["X", "X", "X", "O", "O", null, null, null, null];

    expect(getWinner(board)).toBe("X");
  });

  it("detects a winning column for O", () => {
    const board = ["O", "X", null, "O", "X", null, "O", null, "X"];

    expect(getWinner(board)).toBe("O");
  });

  it("detects a diagonal win for X", () => {
    const board = ["X", "O", null, "O", "X", null, null, null, "X"];

    expect(getWinner(board)).toBe("X");
  });

  it("returns null when there is no winner", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];

    expect(getWinner(board)).toBeNull();
  });
});

describe("isDraw", () => {
  it("detects a full board without a winner", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];

    expect(isDraw(board)).toBe(true);
  });

  it("does not report a draw when a cell is empty", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", null];

    expect(isDraw(board)).toBe(false);
  });
  

// Add these inside your existing describe block, or create a new one.

describe("getComputerMove", () => {
  it("takes a winning move when O has two in a row", () => {
    const board = ["O", "O", null, "X", "X", null, null, null, null];

    expect(getComputerMove(board)).toBe(2);
  });

  it("blocks X when X has two in a row", () => {
    const board = ["X", "X", null, "O", null, null, null, null, null];

    expect(getComputerMove(board)).toBe(2);
  });

  it("chooses the center when it is available", () => {
    const board = Array(9).fill(null);

    expect(getComputerMove(board)).toBe(4);
  });

  it("returns -1 when the board is full", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];

    expect(getComputerMove(board)).toBe(-1);
  });
});


describe("getWinningCombination", () => {
  it("returns the winning row indexes", () => {
    const board = [
      "X", "X", "X",
      "O", null, "O",
      null, null, null,
    ];

    expect(getWinningCombination(board)).toEqual([0, 1, 2]);
  });

  it("returns an empty array when there is no winner", () => {
    const board = [
      "X", "O", "X",
      "O", "X", "O",
      "O", "X", null,
    ];

    expect(getWinningCombination(board)).toEqual([]);
  });
});


});
