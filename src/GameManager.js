import React from "react";
import GameHandler, { actions, difficulties, status } from "./GameHandler";
import GameSquare from "./GameSquare";

export default class GameManager extends React.Component {
  constructor(props) {
    super(props);
    this.gameHandler = new GameHandler(difficulties.EASY);
    this.state = {
      gameState: this.gameHandler.getInitialGameState(),
      rightMouseHeld: false,
      justLeft: null,
      justEntered: null
    };
  }

  onMouseDown = e => {
    if (e.button === 2) {
      console.log("Right mouse down");
      this.setState({ rightMouseHeld: true });
    }
  };

  onMouseUp = e => {
    if (e.button === 2) {
      console.log("Right mouse up");
      this.setState({ rightMouseHeld: false });
    }
  };

  onMouseEnter = (e, coord) => {
    this.setState({
      justEntered: coord
    });
    console.log("Just entered ", coord);
  };
  onMouseLeave = (e, coord) => {
    this.setState({
      justLeft: coord
    });
    console.log("Just left ", coord);
  };

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
      console.log("On right click");
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
            onMouseEnter={e => this.onMouseEnter(e, square.coord)}
            onMouseLeave={e => this.onMouseLeave(e, square.coord)}
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
      gameStatus,
      onMouseDown: this.onMouseDown
    });
  }
}
