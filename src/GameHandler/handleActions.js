import { status } from "./consts";
import { getNeighbors } from "./utils";

// openSquare opens up all neighbors if the current square has
// no neighboring mines -- calls itself recursively
const openSquare = (coord, board) => {
  const { x, y } = coord;
  const { neighboringMinesCount, isOpen } = board[x][y];
  if (isOpen) {
    return;
  }
  board[x][y].isOpen = true;
  const neighbors = getNeighbors(x, y, board);

  if (neighboringMinesCount > 0) {
    return;
  }

  neighbors.forEach(function processNeighbor(neighborCoords) {
    openSquare(neighborCoords, board);
  });
};

export const handleUncoverAction = (coord, board, gameState) => {
  const { x, y } = coord;
  const { isFlagged, isMine, isOpen, neighboringMinesCount } = board[x][y];
  if (isOpen) {
    return;
  }

  if (isFlagged) {
    board[x][y] = !isFlagged;
    return {
      ...gameState,
      board
    };
  }

  if (isMine) {
    board[x][y].isOpen = true;
    return {
      ...gameState,
      gameStatus: status.LOST
    };
  }

  // Run DFS here
  openSquare(coord, board);
  return {
    ...gameState,
    board
  };
};

export const handleFlagAction = (coord, board, gameState) => {
  const { x, y } = coord;
  const { isOpen, isFlagged } = board[x][y];
  // If already opened, do nothing
  if (isOpen) {
    return gameState;
  }

  board[x][y].isFlagged = !isFlagged;
  return {
    ...gameState,
    board
  };
};
