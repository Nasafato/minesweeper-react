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
    if (this.state.gameState.gameStatus === status.LOST) {
      return;
    }
    let nextState = this.state.gameState;
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

    return this.props.children({ squares });
  }
}