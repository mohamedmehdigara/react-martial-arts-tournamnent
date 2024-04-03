import React, { useState } from 'react';
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

const Chapter = styled.div`
  margin-bottom: 20px;
`;

const Dialogue = styled.p`
  margin-bottom: 10px;
`;

const ChoiceButton = styled.button`
  margin-right: 10px;
  cursor: pointer;
`;

const StoryMode = () => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [choicesMade, setChoicesMade] = useState([]);

  const chapters = [
    {
      dialogue: 'You are a young martial artist seeking to prove your skills in the tournament.',
      choices: [
        { text: 'Enter the tournament', nextChapter: 1 },
        { text: 'Train harder', nextChapter: 2 },
      ],
    },
    {
      dialogue: 'You enter the tournament and face your first opponent. The crowd cheers as the match begins.',
      choices: [
        { text: 'Fight bravely', nextChapter: 3 },
        { text: 'Use cunning tactics', nextChapter: 4 },
      ],
    },
    // Additional chapters and choices
  ];

  const handleChoice = (nextChapter) => {
    setChapterIndex(nextChapter);
    setChoicesMade([...choicesMade, nextChapter]);
  };

  const renderChapter = () => {
    const chapter = chapters[chapterIndex];
    return (
      <Chapter>
        <Dialogue>{chapter.dialogue}</Dialogue>
        {chapter.choices.map((choice, index) => (
          <ChoiceButton key={index} onClick={() => handleChoice(choice.nextChapter)}>
            {choice.text}
          </ChoiceButton>
        ))}
      </Chapter>
    );
  };

  return (
    <Container>
      <Title>Story Mode</Title>
      {renderChapter()}
    </Container>
  );
};

export default StoryMode;
