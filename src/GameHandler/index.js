import { initializeGameState } from "./initialization";
import { status, difficulties, actions } from "./consts";
import { handleFlagAction, handleUncoverAction } from "./handleActions";
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

    if (action === actions.UNCOVER) {
      handleUncoverAction(coord, board, this.gameState);
    } else if (action === actions.FLAG) {
      handleFlagAction(coord, board, this.gameState);
    }

    return this.gameState;
  };
}
