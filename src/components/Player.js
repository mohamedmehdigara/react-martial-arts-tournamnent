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

const punchAnimation = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(20px) translateY(-20px);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
`;

const kickAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
`;

const AnimatedCharacter = styled(Character)`
  animation: ${({ attackType }) => (attackType === 'punch' ? punchAnimation : kickAnimation)} 0.5s
    ease-in-out;
`;

const Player = ({ name, style, health, onAttack }) => {
  const [selectedAttackType, setSelectedAttackType] = useState(null);

  const handleAttack = (attackType) => {
    setSelectedAttackType(attackType);
    setTimeout(() => {
      setSelectedAttackType(null); // Reset attack animation after 0.5s
    }, 500);
    onAttack(attackType); // Call the onAttack function with the selected attack type
  };

  return (
    <Container>
      <Name>{name}</Name>
      <AnimatedCharacter style={style} attackType={selectedAttackType} />
      <HealthBar health={health} style={{ width: `${health}%` }} />
      <HealthLabel>Health: {health}</HealthLabel>
      <div>
        <Button onClick={() => handleAttack('punch')}>Punch</Button>
        <Button onClick={() => handleAttack('kick')}>Kick</Button>
      </div>
    </Container>
  );
};

export default Player;
