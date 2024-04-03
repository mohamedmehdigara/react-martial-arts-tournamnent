import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InstructionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const InstructionItem = styled.li`
  margin-bottom: 10px;
`;

const Tutorial = () => {
  return (
    <Container>
      <Title>How to Play</Title>
      <InstructionList>
        <InstructionItem>Use arrow keys or WASD to move your character.</InstructionItem>
        <InstructionItem>Press the spacebar to jump.</InstructionItem>
        <InstructionItem>Use mouse click or keyboard keys to perform attacks.</InstructionItem>
      </InstructionList>
      <Title>Tips for Success</Title>
      <InstructionList>
        <InstructionItem>Master timing and combos to defeat opponents efficiently.</InstructionItem>
        <InstructionItem>Watch out for opponent's attack patterns and react accordingly.</InstructionItem>
        <InstructionItem>Collect power-ups and items to gain an advantage during matches.</InstructionItem>
      </InstructionList>
    </Container>
  );
};

export default Tutorial;
