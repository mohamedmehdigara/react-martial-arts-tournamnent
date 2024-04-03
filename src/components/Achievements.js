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

const AchievementList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AchievementItem = styled.li`
  margin-bottom: 10px;
`;

const Achievements = ({ playerAchievements }) => {
  return (
    <Container>
      <Title>Achievements</Title>
      <AchievementList>
        {playerAchievements.map((achievement, index) => (
          <AchievementItem key={index}>{achievement}</AchievementItem>
        ))}
      </AchievementList>
    </Container>
  );
};

export default Achievements;
