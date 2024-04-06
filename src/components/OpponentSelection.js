import React, { useState } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';

const Container = styled.div`
  text-align: center;
`;

const OpponentCard = styled.div`
  border: 2px solid ${({ $isselected }) => ($isselected ? '#007bff' : '#ccc')};
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #007bff;
  }
`;

const OpponentName = styled.h4`
  margin-bottom: 5px;
`;

const OpponentDifficulty = styled.p`
  font-size: 0.8rem;
  color: #6c757d;
`;

const OpponentSelection = ({ onSelectOpponent }) => {
  const [selectedOpponent, setSelectedOpponent] = useState(null);

  const opponents = [
    { id: 1, name: 'Opponent 1', difficulty: 'Easy' },
    { id: 2, name: 'Opponent 2', difficulty: 'Medium' },
    { id: 3, name: 'Opponent 3', difficulty: 'Hard' },
  ];

  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
    onSelectOpponent(opponent); // Call onSelectOpponent with the selected opponent
  };

  return (
    <Container>
      <h3>Select Opponent</h3>
      <div>
        {opponents.map((opponent) => (
          <OpponentCard
            key={opponent.id}
            $isselected={selectedOpponent && selectedOpponent.id === opponent.id}
            onClick={() => handleSelectOpponent(opponent)}
          >
            <OpponentName>{opponent.name}</OpponentName>
            <OpponentDifficulty>Difficulty: {opponent.difficulty}</OpponentDifficulty>
          </OpponentCard>
        ))}
      </div>
      <ActionButton onClick={() => handleSelectOpponent(null)} text="Clear Selection" />
    </Container>
  );
};

export default OpponentSelection;
