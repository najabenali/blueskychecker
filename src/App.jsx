import React, { useState } from 'react';
import './styles/App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [accountList, setAccountList] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const checkAccounts = async () => {
    setLoading(true);
    setResults([]);
    const accounts = accountList.split('\n').filter((acc) => acc.trim() !== '');
    
    try {
      const response = await fetch('/api/check-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, appPassword, accounts }),
      });
      const data = await response.json();
      setResults(data);
      setConnected(true);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Bluesky Account Checker</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Bluesky Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="App Password"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
        />
        <textarea
          placeholder="Enter account usernames (one per line)"
          value={accountList}
          onChange={(e) => setAccountList(e.target.value)}
        />
        <button onClick={checkAccounts} disabled={loading}>
          {loading ? 'Checking...' : 'Check Accounts'}
        </button>
      </div>
      {connected && <p className="notification">Connected to Bluesky API!</p>}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
              <th>Followers</th>
              <th>Following</th>
              <th>Posts</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx}>
                <td>{result.username}</td>
                <td>{result.status}</td>
                <td>{result.followers}</td>
                <td>{result.following}</td>
                <td>{result.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
