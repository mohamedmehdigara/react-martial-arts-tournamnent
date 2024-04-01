// App.js
import React from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import ScoreBoard from './components/ScoreBoard';
import MatchResult from './components/MatchResult';
import ActionButton from './components/ActionButton';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const App = () => {
  return (
    <Container>
      <Title>Martial Arts Fighting Tournament</Title>
      <Game />
      <ScoreBoard player1Score={0} player2Score={0} />
      <MatchResult winner="" loser="" />
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ActionButton onClick={() => {}} text="Normal Button" />
        <ActionButton onClick={() => {}} text="Primary Button" primary />
        <ActionButton onClick={() => {}} text="Danger Button" danger />
      </div>
    </Container>
  );
};

export default App;
