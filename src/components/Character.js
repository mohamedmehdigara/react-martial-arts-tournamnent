import React from 'react';

const Character = ({ style }) => {
  // Define the styles for the character
  const styles = {
    karate: {
      headColor: '#f0d0a4',
      bodyColor: '#000',
      beltColor: '#ff0000',
      armColor: '#000',
      legColor: '#000'
    },
    judo: {
      headColor: '#a0a0a0',
      bodyColor: '#0000ff',
      beltColor: '#ff0000',
      armColor: '#000',
      legColor: '#000'
    },
    taeKwonDo: {
      headColor: '#ffcc00',
      bodyColor: '#ff6600',
      beltColor: '#000',
      armColor: '#ff6600',
      legColor: '#ff6600'
    },
    kickBoxing: {
      headColor: '#cc3333',
      bodyColor: '#ff9933',
      beltColor: '#000',
      armColor: '#ff9933',
      legColor: '#ff9933'
    },
    // Add more styles for other martial arts styles
  };

  // Check if the provided style matches one of the defined styles
  const characterStyle = styles[style] || styles['karate']; // Use default style if not recognized

  const { headColor, bodyColor, beltColor, armColor, legColor } = characterStyle;

  return (
    <svg width="100" height="150" viewBox="0 0 100 150">
      {/* Head */}
      <circle cx="50" cy="50" r="20" fill={headColor} />
      {/* Body */}
      <rect x="40" y="70" width="20" height="50" fill={bodyColor} />
      {/* Belt */}
      <rect x="40" y="100" width="20" height="5" fill={beltColor} />
      {/* Arms */}
      <line x1="30" y1="80" x2="10" y2="100" stroke={armColor} strokeWidth="5" />
      <line x1="70" y1="80" x2="90" y2="100" stroke={armColor} strokeWidth="5" />
      {/* Legs */}
      <line x1="45" y1="120" x2="40" y2="145" stroke={legColor} strokeWidth="5" />
      <line x1="55" y1="120" x2="60" y2="145" stroke={legColor} strokeWidth="5" />
    </svg>
  );
};

export default Character;
