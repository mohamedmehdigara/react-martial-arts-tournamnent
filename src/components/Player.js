// src/components/Player.js
import React from 'react';
import styled from 'styled-components';

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
  background-color: #5cb85c;
  height: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const HealthLabel = styled.p`
  font-weight: bold;
`;

const Player = ({ name, style, health }) => {
  return (
    <Container>
      <Name>{name}</Name>
      <p>Style: {style}</p>
      <HealthBar style={{ width: `${health}%` }} />
      <HealthLabel>Health: {health}</HealthLabel>
    </Container>
  );
};

export default Player;
