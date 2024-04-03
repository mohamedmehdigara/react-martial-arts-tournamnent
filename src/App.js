// App.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import ScoreBoard from './components/ScoreBoard';
import MatchResult from './components/MatchResult';
import ActionButton from './components/ActionButton';
import Tutorial from './components/Tutorial'; // Import the Tutorial component

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const App = () => {
  const [showTutorial, setShowTutorial] = useState(false); // State to track tutorial visibility

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  return (
    <Container>
      <Title>Martial Arts Fighting Tournament</Title>
      {!showTutorial && <Game />}
      {showTutorial && <Tutorial />}
      {!showTutorial && <ScoreBoard player1Score={0} player2Score={0} />}
      {!showTutorial && <MatchResult winner="" loser="" />}
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ActionButton onClick={toggleTutorial} text={showTutorial ? 'Close Tutorial' : 'View Tutorial'} />
        {/* Add other action buttons */}
      </div>
    </Container>
  );
};

export default App;
