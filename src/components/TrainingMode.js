import React from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';

const Container = styled.div`
  text-align: center;
`;

const ExerciseList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ExerciseItem = styled.li`
  margin-bottom: 10px;
`;

const TrainingMode = () => {
  const handleStartTraining = (exercise) => {
    // Logic to start the selected exercise
    console.log(`Starting ${exercise} exercise...`);
  };

  return (
    <Container>
      <h3>Training Mode</h3>
      <ExerciseList>
        <ExerciseItem>
          <ActionButton onClick={() => handleStartTraining('Punching Bag')} text="Punching Bag" />
        </ExerciseItem>
        <ExerciseItem>
          <ActionButton onClick={() => handleStartTraining('Sparring')} text="Sparring" />
        </ExerciseItem>
        {/* Add more exercises */}
      </ExerciseList>
    </Container>
  );
};

export default TrainingMode;
