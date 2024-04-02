// Game.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Player from './Player';
import ActionButton from './ActionButton';
import HealthBar from './HealthBar';
import MatchResult from './MatchResult';
import ScoreBoard from './ScoreBoard';
import OpponentSelection from './OpponentSelection';
import TrainingMode from './TrainingMode';
import Inventory from './Inventory'; // Import the Inventory component

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

  const [player2, setPlayer2] = useState(null);
  const [matchOver, setMatchOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [trainingMode, setTrainingMode] = useState(false); // State to track training mode
  const [showInventory, setShowInventory] = useState(false); // State to track inventory visibility

  const attackPlayer = (attacker, defender) => {
    const damage = Math.floor(Math.random() * 20) + 1;
    const updatedDefender = { ...defender, health: Math.max(defender.health - damage, 0) };
    if (defender === player1) {
      setPlayer1(updatedDefender);
    } else {
      setPlayer2(updatedDefender);
    }
    if (updatedDefender.health === 0) {
      setMatchOver(true);
      setWinner(attacker.name);
      if (attacker === player1) {
        setPlayer1Score(player1Score + 1);
      } else {
        setPlayer2Score(player2Score + 1);
      }
    }
  };

  const handleSelectOpponent = (opponent) => {
    setPlayer2({
      name: opponent.name,
      style: 'Judo', // Set opponent style as needed
      health: 100, // Set opponent health
    });
  };

  const toggleTrainingMode = () => {
    setTrainingMode(!trainingMode);
  };

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  return (
    <Container>
      <Title>Martial Arts Fighting Game</Title>
      <PlayersContainer>
        <Player {...player1} />
        {player2 && <Player {...player2} />}
      </PlayersContainer>
      {!player2 && !trainingMode && <OpponentSelection onSelectOpponent={handleSelectOpponent} />}
      {!matchOver && player2 && !trainingMode && (
        <ActionButton onClick={() => attackPlayer(player1, player2)} text="Attack" primary />
      )}
      {!trainingMode && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <HealthBar value={player1.health} />
            {player2 && <HealthBar value={player2.health} />}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <ActionButton onClick={toggleTrainingMode} text="Training Mode" />
            <ActionButton onClick={toggleInventory} text={showInventory ? 'Close Inventory' : 'View Inventory'} />
          </div>
        </div>
      )}
      {matchOver && (
        <MatchResult winner={winner} loser={winner === player1.name ? player2.name : player1.name} />
      )}
      <ScoreBoard player1Score={player1Score} player2Score={player2Score} />
      {trainingMode && <TrainingMode />}
      {showInventory && <Inventory />} {/* Render Inventory component when showInventory is true */}
    </Container>
  );
};

export default Game;

