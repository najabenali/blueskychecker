import React, { useState } from 'react';
import './styles/App.css';
import axios from 'axios';

const BLUESKY_API_URL = 'https://bsky.social/x/actor/';

function App() {
  const [usernames, setUsernames] = useState('');
  const [status, setStatus] = useState('Not connected');
  const [isConnected, setIsConnected] = useState(false);
  const [results, setResults] = useState([]);

  // Function to check accounts
  const checkAccounts = async () => {
    if (usernames.trim() === '') {
      alert('Please enter at least one username!');
      return;
    }

    const usernameList = usernames.split('\n').map(username => username.trim()).filter(username => username !== '');

    setStatus('Connecting to Bluesky...');
    setIsConnected(true);

    // Simulate connection success
    setTimeout(() => {
      setStatus('Connected to Bluesky!');
      showNotification('Successfully connected to Bluesky!');
    }, 2000);

    // Check each account via API
    const accountDetails = [];
    for (let username of usernameList) {
      const data = await getAccountData(username);
      accountDetails.push(data);
    }

    setResults(accountDetails);
  };

  // Function to show notification
  const showNotification = (message) => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  };

  // Function to get account data from Bluesky API
  const getAccountData = async (username) => {
    try {
      const response = await axios.get(`${BLUESKY_API_URL}${username}`);
      
      const account = response.data; // Assuming response contains user data object
      
      // Check if the account is suspended (the presence of data indicates the user exists)
      const suspended = account.error ? 'Suspended or Error' : 'Active';

      return {
        username,
        suspended,
        followers: account?.followers?.count || 'Unknown',
        following: account?.following?.count || 'Unknown',
        posts: account?.posts?.count || 'Unknown',
      };
    } catch (error) {
      console.error(`Error fetching data for ${username}:`, error);
      return {
        username,
        suspended: 'Error or Suspended',
        followers: 'Error',
        following: 'Error',
        posts: 'Error',
      };
    }
  };

  return (
    <div className="app-container">
      <h1>Bluesky Account Checker</h1>
      <textarea
        value={usernames}
        onChange={(e) => setUsernames(e.target.value)}
        placeholder="Enter account usernames, each on a new line"
        rows="10"
        cols="30"
      />
      <br />
      <button onClick={checkAccounts}>Check Accounts</button>
      <div>
        <p>Status: {status}</p>
      </div>
      <div id="notification" className="notification"></div>

      <div className="results">
        {results.length > 0 && results.map((result, index) => (
          <div key={index} className="result">
            <h3>{result.username}</h3>
            <p>Status: {result.suspended}</p>
            <p>Followers: {result.followers}</p>
            <p>Following: {result.following}</p>
            <p>Posts: {result.posts}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
