export const getNeighbors = (x, y, board) => {
  const maxX = board.length - 1;
  const maxY = board[0].length - 1;
  const minX = 0;
  const minY = 0;
  const neighborCoords = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i < minX || i > maxX || j < minY || j > maxY) {
        continue;
      }
      if (x === i && y === j) {
        continue;
      }
      neighborCoords.push({ x: i, y: j });
    }
  }
  return neighborCoords;
};

export const iterateThroughBoard = func => {
  return function(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        func(i, j, board);
      }
    }
  };
};
