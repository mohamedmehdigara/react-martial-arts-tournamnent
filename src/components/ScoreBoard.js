// ScoreBoard.js
import React from 'react';

const ScoreBoard = ({ player1Score, player2Score }) => {
  return (
    <div>
      <h3>Score</h3>
      <p>Player 1: {player1Score}</p>
      <p>Player 2: {player2Score}</p>
    </div>
  );
};

export default ScoreBoard;
