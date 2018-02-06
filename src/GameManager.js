import React from "react";
import GameHandler, { actions, difficulties, status } from "./GameHandler";
import GameSquare from "./GameSquare";

export default class GameManager extends React.Component {
  constructor(props) {
    super(props);
    this.gameHandler = new GameHandler(difficulties.EASY);
    this.state = {
      gameState: this.gameHandler.getInitialGameState()
    };
  }

  onSquareClick = (e, coord) => {
    // If game is lost, don't allow further board changes
    if (
      this.state.gameState.gameStatus === status.LOST ||
      this.state.gameState.gameStatus === status.WON
    ) {
      return;
    }
    let action = actions.UNCOVER;
    if (e.type === "contextmenu") {
      // right click
      action = actions.FLAG;
      // preventDefault is necessary because context menu will still
      // open on the element itself
      e.preventDefault();
    } else if (e.type === "click") {
      action = actions.UNCOVER;
    }
    this.setState({
      gameState: this.gameHandler.getNextGameState(coord, action)
    });
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
        squares.push(
          <GameSquare
            onClick={e => this.onSquareClick(e, square.coord)}
            key={`${square.coord.x}-${square.coord.y}`}
            {...square}
          />
        );
      }, this);
    }, this);

    const { gameStatus } = this.state.gameState;
    return this.props.children({
      squares,
      resetGame: this.resetGame,
      gameStatus
    });
  }
}
