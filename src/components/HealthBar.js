import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
`;

const Bar = styled.div`
  background-color: ${({ $health }) =>
    $health > 70
      ? '#5cb85c'
      : $health > 30
      ? '#ffc107'
      : '#dc3545'};
  height: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;


const HealthBar = ({ value }) => {
  return (
    <Container>
      <Bar value={value} />
    </Container>
  );
};

export default HealthBar;
