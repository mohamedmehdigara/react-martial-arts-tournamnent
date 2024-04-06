import React, {useState} from 'react';
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
  const [playerHealth, setPlayerHealth] = useState(100);
  const sanitizedHealth = isNaN(playerHealth) ? 100 : playerHealth;


  return (
    <Container>
      <Bar value={value} {...sanitizedHealth} />
    </Container>
  );
};

export default HealthBar;
