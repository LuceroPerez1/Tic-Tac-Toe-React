import React, { useState } from "react";
import confetti from "canvas-confetti";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  }

  const winnerInfo = calculateWinner(squares);
  const winnerLine = winnerInfo ? winnerInfo.line : null;

  function renderSquare(index) {
    const isWinnerSquare = winnerLine && winnerLine.includes(index);
    return (
      <Square
        key={index}
        value={squares[index]}
        onSquareClick={() => handleClick(index)}
        className={isWinnerSquare ? "winner-square" : ""}
      />
    );
  }

  const board = [0, 1, 2].map((row) => (
    <div className="board-row" key={row}>
      {[0, 1, 2].map((col) => {
        const index = row * 3 + col;
        return renderSquare(index);
      })}
    </div>
  ));

  return (
    <div>
      <div className="status">{getStatusMessage(winnerInfo, xIsNext)}</div>
      <div>{board}</div>
    </div>
  );
}

function getStatusMessage(winnerInfo, xIsNext) {
  if (winnerInfo) {
    return "Winner: " + winnerInfo.winner;
  } else {
    return "Next player: " + (xIsNext ? "X" : "O");
  }
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, location) {
    const nextHistory = history.slice(0, currentMove + 1);
    nextHistory.push({ squares: nextSquares, location });
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const toggleOrder = () => {
    setIsAscending(!isAscending);
  };

  const moves = history.map((step, move) => {
    const currentMove = isAscending ? move : history.length - 1 - move;
    const description = currentMove > 0 ? `Go to move #${currentMove}` : "Go to game start";
    return (
      <li key={currentMove}>
        <button className="my-button" onClick={() => jumpTo(currentMove)}>
          {description}
        </button>
        <div className="try" >
        square: {step.location}
        </div>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={history[currentMove].squares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button className="bottonsortthemoves" onClick={toggleOrder}>
          Sort the moves
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  if (squares.every((square) => square)) {
    return null;
  }
  return null;
}