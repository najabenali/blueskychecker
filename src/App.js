import React, { useState } from 'react';
import './App.scss';

function App() {
  const [bskyUsername, setBskyUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [usernames, setUsernames] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bskyUsername,
          appPassword,
          usernames: usernames.split('\n').filter(Boolean),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Bluesky Bulk Checker</h1>
      <p>Enter your Bluesky username and <strong>App Password</strong> below.</p>
      <div className="credentials">
        <input
          type="text"
          placeholder="Bluesky Username"
          value={bskyUsername}
          onChange={(e) => setBskyUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="App Password"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
        />
      </div>
      <textarea
        placeholder="Enter usernames, one per line..."
        value={usernames}
        onChange={(e) => setUsernames(e.target.value)}
      />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? 'Checking...' : 'Check Accounts'}
      </button>
      {error && <div className="error">{error}</div>}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Banned</th>
              <th>Followers</th>
              <th>Followings</th>
              <th>Posts</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.username}>
                <td>{result.username}</td>
                <td>{result.banned ? 'Yes' : 'No'}</td>
                <td>{result.followers}</td>
                <td>{result.followings}</td>
                <td>{result.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
