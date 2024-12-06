import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [file, setFile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const usernames = text.split('\n').map((line) => line.trim()).filter((line) => line);
      setAccounts(usernames);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !appPassword || accounts.length === 0) {
      alert('Please provide all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/check-accounts', {
        username,
        appPassword,
        accounts,
      });
      setResults(response.data);
    } catch (error) {
      alert('Failed to fetch account details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Bluesky Account Checker</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Bluesky Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="App Password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className={`w-full py-2 text-white rounded ${
              isLoading ? 'bg-gray-500' : 'bg-blue-500'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Check Accounts'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Results</h2>
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result.username} className="p-4 bg-gray-100 rounded shadow">
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
