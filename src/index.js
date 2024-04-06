import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import App from './App';

// Use createRoot to render your application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap your root component with StyleSheetManager and specify which props to forward
root.render(
  <StyleSheetManager shouldForwardProp={(prop) => prop !== 'primary' && prop !== 'danger' && prop !== 'health' && prop !== 'animation'}>
    <App />
  </StyleSheetManager>
);
