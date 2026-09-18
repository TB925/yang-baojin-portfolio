import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ClickSpark from './ClickSpark';
import './styles.css';
import './refinement.css';
import './expertise.css';
import './archive.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClickSpark sparkColor="#FFC6E0" sparkSize={10} sparkRadius={20} sparkCount={9} duration={400}>
      <App />
    </ClickSpark>
  </React.StrictMode>,
);
