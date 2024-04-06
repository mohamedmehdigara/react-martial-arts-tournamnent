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
  background-color: ${({ health }) =>
    health > 70
      ? '#5cb85c'
      : health > 30
      ? '#ffc107'
      : '#dc3545'};
  height: 100%;
  width: ${({ health }) => `${health}%`}; /* Adjust width based on health percentage */
  border-radius: 5px;
`;

const HealthBar = ({ value }) => {
  const health = isNaN(value) ? 100 : Math.max(0, Math.min(value, 100)); // Ensure health is between 0 and 100

  return (
    <Container>
      <Bar health={health} />
    </Container>
  );
};

export default HealthBar;
