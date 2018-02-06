import React from "react";
import GameHandler, { actions, difficulties, status } from "./GameHandler";
import GameSquare from "./GameSquare";

export default class GameManager extends React.Component {
  constructor(props) {
    super(props);
    this.gameHandler = new GameHandler(difficulties.EASY);
    this.state = {
      gameState: this.gameHandler.getInitialGameState(),
      justChorded: false,
      rightMouseHeld: false
    };
  }

  onMouseDown = e => {
    if (e.button === 2) {
      this.setState({ rightMouseHeld: true });
    }
  };

  onMouseUp = (e, coord) => {
    if (
      this.state.gameState.gameStatus === status.LOST ||
      this.state.gameState.gameStatus === status.WON
    ) {
      return;
    }

    let action = actions.UNCOVER;
    // If left click and right is held, chord
    if (e.button === 0 && this.state.rightMouseHeld) {
      action = actions.CHORD;
      this.setState({
        justChorded: true
      });
      // If normal left click, uncover
    } else if (e.button === 0) {
      action = actions.UNCOVER;
    } else if (e.button === 2 && !this.state.justChorded) {
      // if right button up and haven't just chorded (meaning we didn't hold down left click), then normal right click
      action = actions.FLAG;
      this.setState({
        rightMouseHeld: false
      });

      // Otherwise, means we don't need to do anything
    } else if (e.button === 2) {
      action = actions.NONE;
      this.setState({
        justChorded: false,
        rightMouseHeld: false
      });
    }

    this.setState({
      gameState: this.gameHandler.getNextGameState(coord, action)
    });
  };

  onSquareClick = e => {
    e.preventDefault();
    // If game is lost, don't allow further board changes
  };

  resetGame = () => {
    this.setState({
      justChorded: false,
      rightMouseHeld: false,
      gameState: this.gameHandler.resetGame()
    });
  };

  render() {
    const squares = [];
    this.state.gameState.board.forEach(function handleRow(row) {
      row.forEach(function handleSquare(square) {
        squares.push(
          <GameSquare
            onMouseDown={e => this.onMouseDown(e, square.coord)}
            onMouseUp={e => this.onMouseUp(e, square.coord)}
            onClick={this.onSquareClick}
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
      gameStatus,
      onMouseDown: this.onMouseDown
    });
  }
}
