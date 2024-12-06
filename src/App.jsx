import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import AccountCard from './components/AccountCard';
import Loader from './components/Loader';

const App = () => {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [accountList, setAccountList] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkAccounts = async () => {
    setLoading(true);
    setResults([]);
    const accounts = accountList.split('\n').filter((a) => a.trim() !== '');

    try {
      const response = await fetch('/api/check-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, appPassword, accounts }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="form">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="App Password" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} />
        <textarea placeholder="Accounts (one per line)" value={accountList} onChange={(e) => setAccountList(e.target.value)} />
        <button onClick={checkAccounts} disabled={loading}>
          {loading ? 'Checking...' : 'Check Accounts'}
        </button>
      </div>
      {loading && <Loader />}
      <div className="results">
        {results.map((result, idx) => (
          <AccountCard key={idx} {...result} />
        ))}
      </div>
    </div>
  );
};

export default App;
