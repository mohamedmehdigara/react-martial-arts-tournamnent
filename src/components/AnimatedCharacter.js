import React from 'react';
import styled, { keyframes } from 'styled-components';

const punchAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const kickAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const Character = styled.div`
  width: 100px;
  height: 100px;
  background-color: #f00;
  border-radius: 50%;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;

  /* Apply punch animation when attackType is 'punch' */
  animation-name: ${({ attackType }) => (attackType === 'punch' ? punchAnimation : 'none')};

  /* Apply kick animation when attackType is 'kick' */
  animation-name: ${({ attackType }) => (attackType === 'kick' ? kickAnimation : 'none')};
`;

const AnimatedCharacter = ({ attackType }) => {
  return <Character attackType={attackType} />;
};

export default AnimatedCharacter;
