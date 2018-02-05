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

const getRandomMine = (maxX, maxY) => {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY)
  return { x, y }
}

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
  }

  let createdMines = 0;
  while (createdMines < totalMines) {
    const coord = getRandomMine(maxX, maxY);
    if (!isDuplicate(coord)) {
      mines.push(coord);
      createdMines++;
    }
  }
  return mines;
}

const initializeGameState = (maxX, maxY, totalMines) => {
  const board = []
  for (let i = 0; i < maxX; i++) {
    board.push([])
    for (let j = 0; j < maxY; j++) {
      board[i].push({
        coord: {
          x: i,
          y: j,
        },
        isMine: false,
        isOpen: false,
        isFlagged: false
      })
    }
  }

  const mines = createMines(maxX, maxY, totalMines);
  mines.forEach(function addMines(mineCoord) {
    const { x, y } = mineCoord;
    board[x][y].isMine = true;
  });
  return {
    board,
    gameStatus: status.READY
  }
}

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
  }

  getNextGameState = () => {

  }
}