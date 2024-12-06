import React from 'react';
import './styles/App.css';
import AccountChecker from './components/AccountChecker';

const App = () => (
    <div className="app-container">
        <header>
            <h1>Bluesky Account Checker</h1>
            <p>Check account details, status, and more effortlessly!</p>
        </header>
        <main>
            <AccountChecker />
        </main>
    </div>
);

export default App;
