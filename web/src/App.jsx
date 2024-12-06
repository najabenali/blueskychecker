import React, { useState } from 'react';
import './App.scss';
import { BskyAgent } from '@atproto/api';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernames, setUsernames] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let skyAgent = null;

  const getAgent = async () => {
    if (skyAgent) return skyAgent;
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    try {
      await agent.login({ identifier: username, password });
      toast.success('Connected to Bluesky!');
      skyAgent = agent;
      return agent;
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Use an app password instead.');
      return null;
    }
  };

  const handleFetchDetails = async () => {
    setIsLoading(true);
    const agent = await getAgent();
    if (!agent) {
      setIsLoading(false);
      return;
    }

    const usernamesList = usernames.split(',').map((u) => u.trim());
    const resultsList = [];

    for (const user of usernamesList) {
      try {
        const { data } = await agent.getProfile({ actor: user });
        resultsList.push({
          username: user,
          followers: data.followersCount || 0,
          followings: data.followsCount || 0,
          posts: data.postsCount || 0,
          suspended: data.viewer?.blockedBy || false,
        });
      } catch (error) {
        console.error(`Failed to fetch data for ${user}:`, error);
        resultsList.push({
          username: user,
          error: 'Failed to fetch data',
        });
      }
    }

    setResults(resultsList);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Bluesky Account Info Fetcher</h1>
        <p>Enter multiple usernames to retrieve their stats.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFetchDetails();
        }}
        className="form"
      >
        <div className="input-group">
          <label>Bluesky Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourusername.bsky.social"
            required
          />
        </div>

        <div className="input-group">
          <label>App Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="abcd-efgh-hijk-lmno"
            required
          />
        </div>

        <div className="input-group">
          <label>Target Usernames (comma-separated)</label>
          <textarea
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            placeholder="username1.bsky.social, username2.bsky.social"
            rows={3}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Fetching...' : 'Fetch Details'}
        </button>
      </form>

      <div className="results">
        {results.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Followers</th>
                <th>Followings</th>
                <th>Posts</th>
                <th>Suspended</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.username}</td>
                  <td>{result.followers || 'N/A'}</td>
                  <td>{result.followings || 'N/A'}</td>
                  <td>{result.posts || 'N/A'}</td>
                  <td>{result.suspended ? 'Yes' : 'No'}</td>
                  <td>{result.error || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
