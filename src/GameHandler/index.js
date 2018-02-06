import { initializeGameState } from "./initialization";
import { status, difficulties, actions } from "./consts";
export * from "./consts";

export default class GameHandler {
  constructor(difficulty) {
    let maxX = 8;
    let maxY = 8;
    let totalMines = 10;
    switch (difficulty) {
      case difficulties.HARD: {
        maxX = 30;
        maxY = 16;
        totalMines = 99;
        break;
      }
      case difficulties.INTERMEDIATE: {
        maxX = 16;
        maxY = 16;
        totalMines = 40;
        break;
      }
      case difficulties.EASY:
      default: {
        maxX = 8;
        maxY = 8;
        totalMines = 10;
      }
    }
    this.gameState = initializeGameState(maxX, maxY, totalMines);
  }

  getInitialGameState = () => {
    return this.gameState;
  };

  getNextGameState = (coord, action) => {
    const { board } = this.gameState;
    const { x, y } = coord;

    console.log("Action is ", action);
    if (action === actions.UNCOVER) {
      if (board[x][y].isFlagged) {
        board[x][y].isFlagged = false;
        return {
          ...this.gameState,
          board
        };
      }
      // If coord is a mine, set game state to lost
      // Set all mines' state to isOpen
      if (board[x][y].isMine) {
        board[x][y].isOpen = true;
        return {
          board: board,
          gameStatus: status.LOST
        };
      }

      // If coord is empty, set square state to open
      if (!board[x][y].isOpen) {
        // TODO: Deep copy the board?
        board[x][y].isOpen = true;
        return {
          ...this.gameState,
          board
        };
      }
    } else if (action === actions.FLAG) {
      // If it's already been flagged, unflag the square
      if (board[x][y].isOpen) {
        return this.gameState;
      }

      board[x][y].isFlagged = !board[x][y].isFlagged;
      return {
        ...this.gameState,
        board
      };
    }

    return this.gameState;
  };
}
