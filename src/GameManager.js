import React from "react";
import GameHandler, { difficulties, status } from "./GameHandler";
import ClickManager from "./ClickManager";
import GameSquare from "./GameSquare";

export default class GameManager extends React.Component {
  constructor(props) {
    super(props);
    this.gameHandler = new GameHandler(difficulties.EASY);
    this.clickManager = new ClickManager();
    this.state = {
      gameState: this.gameHandler.getInitialGameState(),
      justChorded: false,
      rightMouseHeld: false
    };
  }

  onMouseDown = e => {
    this.clickManager.onMouseDown(e);
  };

  // This should all be outside of the gameManager, for performance reasons
  onMouseUp = (e, coord) => {
    if (
      this.state.gameState.gameStatus === status.LOST ||
      this.state.gameState.gameStatus === status.WON
    ) {
      return;
    }

    const action = this.clickManager.onMouseUp(e, coord);

    this.setState({
      gameState: this.gameHandler.getNextGameState(coord, action)
    });
  };

  onSquareClick = e => {
    e.preventDefault();
  };

  resetGame = () => {
    this.setState({
      gameState: this.gameHandler.resetGame()
    });
  };

  render() {
    const squares = [];
    this.state.gameState.board.forEach(function handleRow(row) {
      row.forEach(function handleSquare(square) {
        const { isFlagged, isOpen, isMine, neighboringMinesCount } = square;
        squares.push(
          <GameSquare
            onMouseDown={e => this.onMouseDown(e, square.coord)}
            onMouseUp={e => this.onMouseUp(e, square.coord)}
            onClick={this.onSquareClick}
            key={`${square.coord.x}-${square.coord.y}`}
            isFlagged={isFlagged}
            isOpen={isOpen}
            isMine={isMine}
            neighboringMinesCount={neighboringMinesCount}
          />
        );
      }, this);
    }, this);

    const { gameStatus } = this.state.gameState;
    return this.props.children({
      squares,
      resetGame: this.resetGame,
      gameStatus,
      onMouseDown: this.onMouseDown
    });
  }
}
