import { status } from "./consts";
import { iterateThroughBoard, getNeighbors, getSquare } from "./utils";

// checkVictory examines the board and sees if the game is done
// This means that every square that doesn't contain a mine
// has been opened
const checkVictory = board => {
  let totalOpened = 0;
  let totalMines = 0;
  let totalSquares = 0;
  iterateThroughBoard(function tally(i, j, board) {
    const { isOpen, isMine } = board[i][j];
    if (isOpen && !isMine) {
      totalOpened++;
    }
    if (isMine) {
      totalMines++;
    }
    totalSquares++;
  })(board);
  return totalSquares === totalMines + totalOpened;
};

// openSquare opens up all neighbors if the current square has
// no neighboring mines -- calls itself recursively
const openSquare = (coord, board) => {
  const { x, y } = coord;
  const { neighboringMinesCount, isOpen } = board[x][y];
  // Halting condition
  if (isOpen) {
    return;
  }

  board[x][y].isOpen = true;
  const neighbors = getNeighbors(x, y, board);

  // Only open neighbors if there are no neighboring mines
  if (neighboringMinesCount > 0) {
    return;
  }

  neighbors.forEach(function processNeighbor(neighborCoords) {
    openSquare(neighborCoords, board);
  });
};

const showMines = iterateThroughBoard((i, j, board) => {
  if (board[i][j].isMine) {
    board[i][j].isOpen = true;
  }
});

const flagAllMines = iterateThroughBoard((i, j, board) => {
  if (board[i][j].isMine && !board[i][j].isFlagged) {
    board[i][j].isFlagged = true;
  }
});

export const handleUncoverAction = (coord, board, gameState) => {
  const { x, y } = coord;
  const { isFlagged, isMine, isOpen } = board[x][y];
  if (isOpen) {
    return gameState;
  }

  if (isFlagged) {
    board[x][y].isFlagged = !isFlagged;
    return {
      ...gameState,
      board
    };
  }

  if (isMine) {
    showMines(board);
    board[x][y].isOpen = true;
    return {
      ...gameState,
      gameStatus: status.LOST
    };
  }

  // Run DFS here
  openSquare(coord, board);

  // check victory condition here
  const isVictory = checkVictory(board);
  if (isVictory) {
    flagAllMines(board);
    return {
      gameStatus: status.WON,
      board
    };
  }

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

export const handleChordAction = (coord, board, gameState) => {
  const { x, y } = coord;
  const { isOpen, neighboringMinesCount } = board[x][y];
  // If it's not opened yet, we can't chord on it
  // If there are no mines around it, you can't chord
  if (!isOpen || neighboringMinesCount === 0) {
    return gameState;
  }

  // Compare number of neighboring flags with number of mines
  const neighbors = getNeighbors(x, y, board);
  let neighboringFlagsCount = 0;
  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = getSquare(board, neighbors[i]);
    if (neighbor.isFlagged) {
      neighboringFlagsCount++;
    }
  }

  // If not equal, then you can't chord
  if (neighboringFlagsCount !== neighboringMinesCount) {
    return gameState;
  }

  // Now, uncover any unopened, unflagged neighbors
  for (let i = 0; i < neighbors.length; i++) {
    const neighborCoord = neighbors[i];
    const { isFlagged, isOpen, isMine } = getSquare(board, neighborCoord);
    if (isFlagged || isOpen) {
      continue;
    }

    if (isMine) {
      // lose game
    }

    openSquare(neighborCoord, board);
  }
  const isVictory = checkVictory(board);
  if (isVictory) {
    flagAllMines(board);
    return {
      gameStatus: status.WON,
      board
    };
  }
  return gameState;
};
