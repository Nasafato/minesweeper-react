export const difficulties = {
  HARD: "HARD",
  INTERMEDIATE: "INTERMEDIATE",
  EASY: "EASY"
};

export const status = {
  READY: "READY",
  STARTED: "STARTED",
  LOST: "LOST",
  WON: "WON"
};

export const actions = {
  UNCOVER: "UNCOVER",
  FLAG: "FLAG"
};

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

const getNeighbors = (x, y, board) => {
  const maxX = board.length - 1;
  const maxY = board[0].length - 1;
  const minX = 0;
  const minY = 0;
  const neighborCoords = [];
  if (x - 1 >= minX) {
    neighborCoords.push({ x: x - 1, y });
  }
  if (x + 1 <= maxX) {
    neighborCoords.push({ x: x + 1, y });
  }
  if (y - 1 >= minY) {
    neighborCoords.push({ x, y: y - 1 });
  }
  if (y + 1 <= maxY) {
    neighborCoords.push({ x, y: y + 1 });
  }
  return neighborCoords;
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

const initializeGameState = (maxX, maxY, totalMines) => {
  const board = [];
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

  const mines = createMines(maxX, maxY, totalMines);
  mines.forEach(function addMines(mineCoord) {
    const { x, y } = mineCoord;
    board[x][y].isMine = true;
  });

  updateNeighboringMinesCount(board);

  return {
    board,
    gameStatus: status.READY
  };
};

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
