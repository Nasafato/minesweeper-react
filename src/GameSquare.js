import React from "react";
import styled, { css } from "styled-components";

const squareColor = ({ isOpen, isMine, isFlagged }) => {
  let color = "inherit";
  if (isOpen && isMine) {
    color = "red";
  } else if (isOpen) {
    color = "lightgrey";
  } else if (isFlagged) {
    color = "yellow";
  }
  return css`
    background-color: ${color};
  `;
};

const Square = styled.div`
  user-select: none;
  border: 1px solid black;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${squareColor};
`;

const colors = {
  1: "#0200fb",
  2: "#008012",
  3: "#ff0e17",
  4: "#00007f",
  5: "#7f0306",
  6: "#007f7f",
  7: "#000",
  8: "#808080"
};

const numberColor = ({ count }) => {
  return css`
    color: ${colors[count]};
  `;
};

const Number = styled.span`
  font-size: 24px;
  ${numberColor};
  display: ${props => (props.isOpen ? "inline" : "none")};
`;

class GameSquare extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { isFlagged, isMine, isOpen } = this.props;
    if (
      isFlagged === nextProps.isFlagged &&
      isMine === nextProps.isMine &&
      isOpen === nextProps.isOpen
    ) {
      return false;
    }
    return true;
  }

  render() {
    const {
      onClick,
      isOpen,
      isFlagged,
      isMine,
      onMouseUp,
      onMouseDown,
      neighboringMinesCount
    } = this.props;
    return (
      <Square
        onClick={onClick}
        onContextMenu={onClick}
        isOpen={isOpen}
        isFlagged={isFlagged}
        isMine={isMine}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
      >
        {!isOpen || isMine ? null : (
          <Number count={neighboringMinesCount} isOpen={isOpen}>
            <strong>
              {neighboringMinesCount === 0 || isMine
                ? " "
                : neighboringMinesCount}
            </strong>
          </Number>
        )}
      </Square>
    );
  }
}

export default GameSquare;
