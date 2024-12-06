import React, { useState } from 'react';
import axios from 'axios';
import './App.scss';

const App = () => {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [usernames, setUsernames] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    const usernamesList = usernames.split('\n').map(username => username.trim());
    
    try {
      // Make a POST request to the serverless API
      const response = await axios.post('/api/checker', {
        username,
        appPassword,
        usernames: usernamesList,
      });
      
      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert('Error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>BlueSky Bulk Account Checker</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>BlueSky Username</label>
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
          <label>Usernames (one per line)</label>
          <textarea
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Check Accounts</button>
      </form>

      {loading && <p>Loading...</p>}

      {results && (
        <div>
          <h2>Results</h2>
          {results.map((result, index) => (
            <div key={index}>
              <h3>{result.username}</h3>
              <p>Status: {result.status}</p>
              <p>Followers: {result.followersCount}</p>
              <p>Posts: {result.postsCount}</p>
              <p>Likes: {result.likesCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
