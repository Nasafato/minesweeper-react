import { getNeighbors } from "./utils";
import { status } from "./consts";

const getRandomMine = (maxX, maxY) => {
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return { x, y };
};

const createMines = (maxX, maxY, totalMines) => {
  const mines = [];
  const isDuplicate = ({ x: testX, y: testY }) => {
    for (let i = 0; i < mines.length; i++) {
      const { x, y } = mines[i];
      if (x === testX && y === testY) {
        return true;
      }
    }
    return false;
  };

  let createdMines = 0;
  while (createdMines < totalMines) {
    const coord = getRandomMine(maxX, maxY);
    if (!isDuplicate(coord)) {
      mines.push(coord);
      createdMines++;
    }
  }
  return mines;
};

const updateNeighboringMinesCount = board => {
  const updateNeighbors = (x, y) => {
    const neighbors = getNeighbors(x, y, board);
    if (!board[x][y].isMine) {
      return;
    }
    neighbors.forEach(function updateNeighbor({ x: neighborX, y: neighborY }) {
      board[neighborX][neighborY].neighboringMinesCount++;
    });
  };
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      updateNeighbors(i, j);
    }
  }
};

export const initializeGameState = (maxX, maxY, totalMines) => {
  const board = [];
  // 1) Create all squares
  for (let i = 0; i < maxX; i++) {
    board.push([]);
    for (let j = 0; j < maxY; j++) {
      board[i].push({
        coord: {
          x: i,
          y: j
        },
        neighboringMinesCount: 0,
        isMine: false,
        isOpen: false,
        isFlagged: false
      });
    }
  }

  // 2) Create the mine coordinates
  const mines = createMines(maxX, maxY, totalMines);
  mines.forEach(function addMines(mineCoord) {
    const { x, y } = mineCoord;
    board[x][y].isMine = true;
  });

  // 3) Update the neighboring mines count for each square
  updateNeighboringMinesCount(board);

  return {
    board,
    gameStatus: status.READY
  };
};
