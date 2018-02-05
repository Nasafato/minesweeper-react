import React from 'react';
import styled, { css } from 'styled-components';

const squareColor = ({ isOpen, isMine, isFlagged }) => {
  let color = 'inherit';
  if (isOpen && isMine) {
    color = 'red';
  } else if (isOpen) {
    color = 'blue';
  } else if (isFlagged) {
    color = 'yellow';
  }
  return css`
    background-color: ${color};
  `;
}

const Square = styled.div`
  border: 1px solid black;
  height: 50px;
  width: 50px;
  ${squareColor};
`

const GameSquare = ({ isOpen, isMine, isFlagged, onClick, coord }) =>
  <Square onClick={(e) => onClick(e, coord)} isOpen={isOpen} isFlagged={isFlagged} isMine={isMine} />

export default GameSquare;