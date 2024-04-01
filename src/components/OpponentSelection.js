import React, { useState } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';

const Container = styled.div`
  text-align: center;
`;

const OpponentSelection = ({ onSelectOpponent }) => {
  const [selectedOpponent, setSelectedOpponent] = useState(null);

  const opponents = [
    { name: 'Opponent 1', difficulty: 'Easy' },
    { name: 'Opponent 2', difficulty: 'Medium' },
    { name: 'Opponent 3', difficulty: 'Hard' },
  ];

  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
    onSelectOpponent(opponent);
  };

  return (
    <Container>
      <h3>Select Opponent</h3>
      <div>
        {opponents.map((opponent, index) => (
          <ActionButton
            key={index}
            onClick={() => handleSelectOpponent(opponent)}
            text={`${opponent.name} (${opponent.difficulty})`}
            primary={opponent === selectedOpponent}
          />
        ))}
      </div>
    </Container>
  );
};

export default OpponentSelection;
