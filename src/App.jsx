import React, { useState } from 'react';
import BlueskyBot from './BlueskyBot';

const App = () => {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [accounts, setAccounts] = useState('');
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    if (username && appPassword) {
      setConnected(true);
    } else {
      alert('Please provide both Bluesky username and app password.');
    }
  };

  return (
    <div className="container">
      <h1>Bluesky Account Checker</h1>
      <div className="input-box">
        <input
          type="text"
          placeholder="Enter your Bluesky username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your Bluesky app password"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
        />
        <textarea
          placeholder="Enter Bluesky account usernames (one per line)"
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
        />
        <button className="button" onClick={handleConnect}>
          Connect to Bluesky
        </button>
      </div>

      {connected && (
        <div className="status">
          <BlueskyBot
            username={username}
            appPassword={appPassword}
            accounts={accounts.split('\n')}
          />
        </div>
      )}
    </div>
  );
};

export default App;
