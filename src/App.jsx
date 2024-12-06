import React, { useState } from 'react';
import './styles/App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [accounts, setAccounts] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckAccounts = async () => {
    setLoading(true);
    const accountsList = accounts.split('\n');
    try {
      const response = await axios.post('/api/check-accounts', { username, appPassword, accounts: accountsList });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Bluesky Account Checker</h1>
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Bluesky Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="App Password" 
          value={appPassword} 
          onChange={e => setAppPassword(e.target.value)} 
        />
        <textarea
          placeholder="List of Account Usernames (separate by new line)"
          value={accounts}
          onChange={e => setAccounts(e.target.value)}
        />
        <button onClick={handleCheckAccounts} disabled={loading}>
          {loading ? 'Checking...' : 'Check Accounts'}
        </button>
      </div>

      <div className="results">
        {results.length > 0 && results.map((account, idx) => (
          <div key={idx} className="account-card">
            <h3>{account.username}</h3>
            {account.error ? (
              <p>Error: {account.error}</p>
            ) : (
              <>
                <p>Followers: {account.followers}</p>
                <p>Following: {account.followings}</p>
                <p>Posts: {account.posts}</p>
                <p>Status: {account.suspended ? 'Suspended' : 'Active'}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
