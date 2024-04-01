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
  width: ${({ value }) => value}%;
  height: 100%;
  background-color: ${({ value }) =>
    value > 70 ? '#5cb85c' : value > 30 ? '#ffc107' : '#dc3545'};
`;

const HealthBar = ({ value }) => {
  return (
    <Container>
      <Bar value={value} />
    </Container>
  );
};

export default HealthBar;
