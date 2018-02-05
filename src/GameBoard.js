import React from 'react';
import GameHandler, { difficulties, status } from './GameHandler';
import GameSquare from './GameSquare';
import styled from 'styled-components';

const Board = styled.div`
  width: 400px;
  height: 400px;
  margin: 0 auto;
  background-color: grey;
  display: flex;
  flex-wrap: wrap;

`

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.gameHandler = new GameHandler(difficulties.EASY);
    this.state = {
      gameState: this.gameHandler.getInitialGameState(),
    };
  }

  onSquareClick = (e, coord) => {
    console.log(coord);
  }

  render() {
    const squares = []
    this.state.gameState.board.forEach(function handleRow(row) {
      row.forEach(function handleSquare(square) {
        squares.push(<GameSquare onClick={this.onSquareClick} key={`${square.coord.x}-${square.coord.y}`} {...square} />)
      }, this)
    }, this)

    return (
      <Board>
        {squares}
      </Board>
    );
  }

}
