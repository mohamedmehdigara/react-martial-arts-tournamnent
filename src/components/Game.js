// src/components/Game.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Player from './Player';
import ActionButton from './ActionButton';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
`;

const PlayersContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Game = () => {
  const [player1, setPlayer1] = useState({
    name: 'Player 1',
    style: 'Karate',
    health: 100,
  });

  const [player2, setPlayer2] = useState({
    name: 'Player 2',
    style: 'Judo',
    health: 100,
  });

  const attackPlayer = (attacker, defender) => {
    // Logic to handle attacks
  };

  return (
    <Container>
      <Title>Martial Arts Fighting Game</Title>
      <PlayersContainer>
        <Player {...player1} />
        <Player {...player2} />
      </PlayersContainer>
      <ActionButton onClick={() => attackPlayer(player1, player2)} text="Attack" primary />
    </Container>
  );
};

export default Game;
