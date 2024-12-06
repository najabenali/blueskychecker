import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [accounts, setAccounts] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !appPassword || !accounts) {
      alert('Please fill in all fields.');
      return;
    }

    const accountList = accounts.split('\n').map((acc) => acc.trim()).filter((acc) => acc);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/check-accounts', {
        username,
        appPassword,
        accounts: accountList,
      });
      setResults(response.data);
    } catch (error) {
      alert('Error fetching account details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Bluesky Account Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Bluesky Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="App Password"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter usernames (one per line)"
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
          rows="10"
          required
        ></textarea>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Check Accounts'}
        </button>
      </form>

      {results && (
        <div className="results">
          <h2>Results</h2>
          {results.map((result) => (
            <div key={result.username} className="result">
              <p>
                <strong>Username:</strong> {result.username}
              </p>
              <p>
                <strong>Banned:</strong> {result.banned ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Followers:</strong> {result.followers}
              </p>
              <p>
                <strong>Posts:</strong> {result.posts}
              </p>
              <p>
                <strong>Likes:</strong> {result.likes.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
