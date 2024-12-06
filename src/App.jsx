import React, { useState } from 'react';
import axios from 'axios';
import './styles/App.css';

function App() {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [accounts, setAccounts] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setResult(null);

    try {
      const accountsArray = accounts.split('\n').map(account => account.trim());
      const response = await axios.post('/api/check-accounts', {
        username,
        appPassword,
        accounts: accountsArray,
      });
      setResult(response.data);
    } catch (error) {
      setStatus('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Bluesky Account Checker</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username or Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>App Password</label>
          <input
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Accounts (one per line)</label>
          <textarea
            value={accounts}
            onChange={(e) => setAccounts(e.target.value)}
            required
          />
        </div>
        <button type="submit">Check Accounts</button>
      </form>
      {loading && <div>Loading...</div>}
      {status && <div>{status}</div>}
      {result && (
        <div>
          <h2>Account Details</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
