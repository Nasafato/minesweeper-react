import React, { Component } from "react";
import logo from "./logo.svg";
import GameManager from "./GameManager";
import "./App.css";
import styled from "styled-components";

const Board = styled.div`
  width: 400px;
  height: 400px;
  margin: 0 auto;
  background-color: grey;
  display: flex;
  flex-wrap: wrap;
`;
// return <Board>{squares}</Board>;
class App extends Component {
  render() {
    return (
      <GameManager>
        {({ squares, onSquareClick }) => (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <Board>{squares}</Board>
          </div>
        )}
      </GameManager>
    );
  }
}

export default App;
