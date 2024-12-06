import React, { useState } from 'react';
import axios from 'axios';
import './styles/App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleCheckAccounts = async () => {
    const accountList = accounts.split('\n').map(account => account.trim()).filter(account => account);
    if (!username || !password || accountList.length === 0) {
      alert('Please provide username, password, and accounts list');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('/api/check-accounts', {
        username,
        password,
        accounts: accountList
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching account data', error);
      alert('Failed to fetch account data');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Bluesky Account Checker</h1>
      <div>
        <label>Bluesky Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
      </div>
      <div>
        <label>Bluesky App Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <div>
        <label>Accounts (One per line):</label>
        <textarea 
          value={accounts} 
          onChange={(e) => setAccounts(e.target.value)} 
        />
      </div>
      <button onClick={handleCheckAccounts} disabled={loading}>
        {loading ? 'Loading...' : 'Check Accounts'}
      </button>
      <div className="results">
        {results.map((result, index) => (
          <div className="account-card" key={index}>
            <h3>{result.username}</h3>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <p>Followers: {result.followersCount}</p>
                <p>Following: {result.followingCount}</p>
                <p>Posts: {result.postsCount}</p>
                <p>Suspended: {result.suspended ? 'Yes' : 'No'}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
