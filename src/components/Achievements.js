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
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const AchievementIcon = styled.svg`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const AchievementDescription = styled.p`
  flex: 1;
`;

const Achievements = ({ playerAchievements }) => {
  // Define achievements with SVG icons and descriptions
  const achievementsData = [
    { id: 1, name: 'Victory', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /><path d="M12 16.5V14" /></svg>, description: 'Won a match' },
    { id: 2, name: 'Combo Master', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10v3h-3m0 0v3h-3m3-6h-3m0 0H7.88C6.79 10 6 9.11 6 8s.79-2 1.88-2H9" /><path d="M3 21l4-4" /><path d="M3 17l4-4" /><path d="M11 21l4-4" /><path d="M11 17l4-4" /></svg>, description: 'Performed a 10-hit combo' },
    // Add more achievements as needed
  ];

  return (
    <Container>
      <Title>Achievements</Title>
      <AchievementList>
        {playerAchievements.map((achievementId) => {
          const achievement = achievementsData.find((data) => data.id === achievementId);
          return (
            <AchievementItem key={achievement.id}>
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <AchievementDescription>{achievement.description}</AchievementDescription>
            </AchievementItem>
          );
        })}
      </AchievementList>
    </Container>
  );
};

export default Achievements;
