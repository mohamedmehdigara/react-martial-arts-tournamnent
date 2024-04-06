import React, { useState } from 'react';
import styled from 'styled-components';
import Player from './Player';
import HealthBar from './HealthBar';
import MatchResult from './MatchResult';
import ScoreBoard from './ScoreBoard';
import OpponentSelection from './OpponentSelection';
import Achievements from './Achievements';
import ActionButton from './ActionButton';
import Inventory from './Inventory';
import Store from './Store';
import StoryMode from './StoryMode';
import TrainingMode from './TrainingMode';
import Tutorial from './Tutorial';
import Character from './Character';
import AnimatedCharacter from './AnimatedCharacter';

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
  const [playerHealth, setPlayerHealth] = useState(100);


  const [player2, setPlayer2] = useState(null);
  const [matchOver, setMatchOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const handlePlayerAttack = (attacker, defender, attackType) => {
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

  const sanitizedHealth = isNaN(playerHealth) ? 100 : playerHealth;


  return (
    <Container>
      <Title>Martial Arts Fighting Game</Title>
      {!matchOver && (
        <>
          <PlayersContainer>
            <Player {...player1} onAttack={(attackType) => handlePlayerAttack(player1, player2, attackType)} health={playerHealth && !isNaN(playerHealth) ? playerHealth : 100} />
            {player2 && (
              <Player
                {...player2}
                onAttack={(attackType) => handlePlayerAttack(player2, player1, attackType)} health={playerHealth && !isNaN(playerHealth) ? playerHealth : 100}
              />
            )}
          </PlayersContainer>
          {!player2 && <OpponentSelection onSelectOpponent={setPlayer2} />}
        </>
      )}
      {matchOver && (
        <MatchResult winner={winner} loser={winner === player1.name ? player2.name : player1.name} />
      )}
      <ScoreBoard player1Score={player1Score} player2Score={player2Score} />
      <HealthBar value={player1 && player1.health} {...sanitizedHealth}/> {/* Check if player1 exists before accessing health */}
      <HealthBar value={player2 && player2.health} {...sanitizedHealth}/> {/* Check if player2 exists before accessing health */}
      <Achievements />
      <ActionButton />
      <Inventory />
      <Store />
      <StoryMode />
      <TrainingMode />
      <Tutorial />
      <Character style={player1 && player1.style} /> {/* Check if player1 exists before accessing style */}
      {player2 && <Character style={player2.style} />}
      {player1 && <AnimatedCharacter style={player1.style} />}
      {player2 && <AnimatedCharacter style={player2.style} />}
    </Container>
  );
};

export default Game;
