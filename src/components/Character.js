import React from 'react';

const Character = ({ style }) => {
  // Define the default style
  const defaultStyle = {
    headColor: '#f0d0a4',
    bodyColor: '#000',
    beltColor: '#ff0000',
    armColor: '#000',
    legColor: '#000'
  };

  // Define the styles for each martial arts style
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

  // Get the character style based on the provided style prop or use the default style
  const characterStyle = styles[style] || defaultStyle;

  const { headColor, bodyColor, beltColor, armColor, legColor } = characterStyle;

  // Reusable function to render a line
  const renderLine = (x1, y1, x2, y2, color) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" />
  );

  return (
    <svg width="100" height="150" viewBox="0 0 100 150">
      {/* Head */}
      <circle cx="50" cy="50" r="20" fill={headColor} />
      {/* Body */}
      <rect x="40" y="70" width="20" height="50" fill={bodyColor} />
      {/* Belt */}
      <rect x="40" y="100" width="20" height="5" fill={beltColor} />
      {/* Arms */}
      {renderLine(30, 80, 10, 100, armColor)}
      {renderLine(70, 80, 90, 100, armColor)}
      {/* Legs */}
      {renderLine(45, 120, 40, 145, legColor)}
      {renderLine(55, 120, 60, 145, legColor)}
    </svg>
  );
};

export default Character;
