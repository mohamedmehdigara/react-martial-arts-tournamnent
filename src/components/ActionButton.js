import React from 'react';
import styled, { css } from 'styled-components';

const Button = styled.button`
  padding: ${({ size }) => (size === 'large' ? '12px 24px' : '10px 20px')};
  font-size: ${({ size }) => (size === 'large' ? '1.2rem' : '1rem')};
  background-color: ${({ danger, primary }) =>
    danger ? '#dc3545' : primary ? '#28a745' : '#007bff'};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ danger, primary }) =>
      danger ? '#c82333' : primary ? '#218838' : '#0056b3'};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

const ActionButton = ({ onClick, text, primary, danger, size, disabled }) => {
  return (
    <Button
      onClick={onClick}
      primary={primary ? 'true' : 'false'} // Convert boolean value to string
      danger={danger ? 'true' : 'false'} // Convert boolean value to string
      size={size}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ActionButton;
