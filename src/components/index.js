import React from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import App from './components/App'; // Correct path to the App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
