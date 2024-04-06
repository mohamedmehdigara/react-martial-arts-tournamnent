import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define keyframes for punch animation
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

// Define keyframes for kick animation
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

// Styled component for animated character
const Character = styled.div`
  width: 100px; /* Adjust width as needed */
  height: 100px; /* Adjust height as needed */
  background-color: #f00; /* Placeholder color */
  border-radius: 50%; /* Assuming the character is circular */
  animation-duration: 0.5s; /* Duration of the animation */
  animation-timing-function: ease-in-out; /* Timing function for smooth animation */
  animation-name: ${({ animation }) => animation}; /* Apply specified animation */
`;

const AnimatedCharacter = ({ attackType }) => {
  let animation = 'none'; // Default animation is none

  // Determine the animation based on the attackType
  if (attackType === 'punch') {
    animation = punchAnimation;
  } else if (attackType === 'kick') {
    animation = kickAnimation;
  }
  
  return <Character animation={animation} />;
};

export default AnimatedCharacter;
