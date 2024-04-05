import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Character from './Character';

const Container = styled.div`
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  text-align: center;
  background-color: #f9f9f9;
`;

const Name = styled.h2`
  margin-bottom: 10px;
`;

const HealthBar = styled.div`
  background-color: ${({ health }) =>
    health > 70 ? '#5cb85c' : health > 30 ? '#ffc107' : '#dc3545'};
  height: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const HealthLabel = styled.p`
  font-weight: bold;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const bounceAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const SpecialMoveButton = styled(Button)`
  background-color: #dc3545;
  animation: ${bounceAnimation} 0.5s infinite alternate;
`;

// Define a simple AttackAnimation component
const AttackAnimation = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  margin: 10px auto;
`;

const Player = ({ name, style, health, onAttack, combo, setCombo, isPlayer1 }) => {
  const [specialMoveEnabled, setSpecialMoveEnabled] = useState(false);
  const [selectedAttackType, setSelectedAttackType] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);

  const handleAttack = (attackType) => {
    onAttack(attackType);
    setCombo([...combo, attackType]);
  };

  const handleSpecialMove = () => {
    // Implement logic for special move
    setSpecialMoveEnabled(false); // Disable special move after use
  };

  const handlePlayerAttack = (attackType) => {
    setSelectedAttackType(attackType);
    if (attackType === 'Punch') {
      setSelectedBodyPart('hands');
    } else if (attackType === 'Kick') {
      setSelectedBodyPart('legs');
    }
  };

  return (
    <Container>
      <Name>{name}</Name>
      <Character style={style} />
      <HealthBar health={health} style={{ width: `${health}%` }} />
      <HealthLabel>Health: {health}</HealthLabel>
      <div>
        <Button onClick={() => handleAttack('Punch')}>Punch</Button>
        <Button onClick={() => handleAttack('Kick')}>Kick</Button>
        {specialMoveEnabled && (
          <SpecialMoveButton onClick={handleSpecialMove}>Special Move</SpecialMoveButton>
        )}
      </div>
      {selectedAttackType && (
        <AttackAnimation bodyPart={selectedBodyPart} attackType={selectedAttackType} />
      )}
    </Container>
  );
};

export default Player;
