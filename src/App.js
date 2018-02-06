import React, { Component } from "react";
import logo from "./logo.svg";
import GameManager from "./GameManager";
import "./App.css";
import styled from "styled-components";
import { status } from "./GameHandler";

const Board = styled.div`
  width: 400px;
  height: 400px;
  margin: 0 auto;
  background-color: grey;
  display: flex;
  flex-wrap: wrap;
`;

const Header = styled.div`
  height: 200px;
`;
// return <Board>{squares}</Board>;
class App extends Component {
  render() {
    return (
      <GameManager>
        {({ squares, gameStatus, resetGame }) => (
          <div className="App">
            <Header>
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">{gameStatus}</h1>
              <button onClick={resetGame}>Reset</button>
            </Header>
            <Board>{squares}</Board>
          </div>
        )}
      </GameManager>
    );
  }
}

export default App;
