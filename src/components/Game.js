import React, { useState } from 'react';
import styled from 'styled-components';
import Player from './Player';
import ActionButton from './ActionButton';
import HealthBar from './HealthBar';
import MatchResult from './MatchResult';
import ScoreBoard from './ScoreBoard';
import OpponentSelection from './OpponentSelection';
import TrainingMode from './TrainingMode';
import Achievements from './Achievements';
import Tutorial from './Tutorial';
import Store from './Store';
import StoryMode from './StoryMode';
import Inventory from './Inventory';
import Character from './Character';

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
  const [trainingMode, setTrainingMode] = useState(false);
  const [playerAchievements, setPlayerAchievements] = useState([]);
  const [currencyBalance, setCurrencyBalance] = useState(1000);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [player1Combo, setPlayer1Combo] = useState([]);
  const [player2Combo, setPlayer2Combo] = useState([]);

  const handlePlayerAttack = (attackType) => {
    // Implement attack logic and combo system here
    // Add attack type to combo sequence
    // Check for combo sequence and apply damage accordingly
  };

  const handleOpponentSelection = () => {
    const techniques = ['Karate', 'Tae Kwon Do', 'Kick Boxing'];
    const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
    setPlayer2({
      name: 'Opponent',
      style: randomTechnique,
      health: 100,
    });
  };

  const toggleTrainingMode = () => {
    setTrainingMode(!trainingMode);
  };

  const handlePurchase = (item) => {
    setCurrencyBalance(currencyBalance - item.price);
    setPlayerAchievements([...playerAchievements, `Purchased ${item.name}`]);
  };

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
      setPlayerAchievements([...playerAchievements, 'Won a match']);
    }
  };

  return (
    <Container>
      <Title>Martial Arts Fighting Game</Title>
      {!showStoryMode && !trainingMode && !matchOver && (
        <>
          <PlayersContainer>
            <Player
              {...player1}
              onAttack={handlePlayerAttack}
              combo={player1Combo}
              setCombo={setPlayer1Combo}
              isPlayer1
            />
            {player2 && (
              <Player
                {...player2}
                onAttack={handlePlayerAttack}
                combo={player2Combo}
                setCombo={setPlayer2Combo}
              />
            )}
          </PlayersContainer>
          {!player2 && <OpponentSelection onSelectOpponent={handleOpponentSelection} />}
          {player2 && (
            <ActionButton onClick={() => attackPlayer(player1, player2)} text="Attack" primary />
          )}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <HealthBar value={player1.health} />
              {player2 && <HealthBar value={player2.health} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <ActionButton onClick={toggleTrainingMode} text="Training Mode" />
            </div>
          </div>
        </>
      )}
      {matchOver && (
        <MatchResult winner={winner} loser={winner === player1.name ? player2.name : player1.name} />
      )}
      <ScoreBoard player1Score={player1Score} player2Score={player2Score} />
      {trainingMode && <TrainingMode />}
      <Achievements playerAchievements={playerAchievements} />
      <Store currencyBalance={currencyBalance} onPurchase={handlePurchase} />
      <Tutorial />
      <StoryMode />
      <Inventory />
      <Character />
      {!showStoryMode && (
        <ActionButton onClick={() => setShowStoryMode(true)} text="Start Story Mode" primary />
      )}
    </Container>
  );
};

export default Game;
