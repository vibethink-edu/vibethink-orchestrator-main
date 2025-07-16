import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import './styles.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Login />
      </div>
    </BrowserRouter>
  );
};

export default App; 