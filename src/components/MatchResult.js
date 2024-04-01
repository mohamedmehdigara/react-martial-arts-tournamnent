// MatchResult.js
import React from 'react';

const MatchResult = ({ winner, loser }) => {
  return (
    <div>
      <h3>Match Result</h3>
      <p>{winner} wins!</p>
      <p>{loser} loses!</p>
    </div>
  );
};

export default MatchResult;
