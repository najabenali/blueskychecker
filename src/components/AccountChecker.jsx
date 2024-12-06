import React, { useState } from 'react';

const AccountChecker = () => {
    const [blueskyUsername, setBlueskyUsername] = useState('');
    const [appPassword, setAppPassword] = useState('');
    const [accountUsernames, setAccountUsernames] = useState('');
    const [results, setResults] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usernames = accountUsernames.split(',').map((u) => u.trim());

        const response = await fetch('/api/checkAccounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blueskyUsername, appPassword, accountUsernames: usernames }),
        });

        const data = await response.json();
        setResults(data);
    };

    return (
        <div>
            <h1>Bluesky Account Checker</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Bluesky Username:</label>
                    <input
                        type="text"
                        value={blueskyUsername}
                        onChange={(e) => setBlueskyUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>App Password:</label>
                    <input
                        type="password"
                        value={appPassword}
                        onChange={(e) => setAppPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Account Usernames (comma-separated):</label>
                    <textarea
                        value={accountUsernames}
                        onChange={(e) => setAccountUsernames(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Check Accounts</button>
            </form>
            <div>
                <h2>Results:</h2>
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            {result.error ? (
                                <span>{result.username}: {result.error}</span>
                            ) : (
                                <span>
                                    {result.username} - Suspended: {result.isSuspended ? 'Yes' : 'No'}, 
                                    Followers: {result.followersCount}, 
                                    Following: {result.followsCount}, 
                                    Posts: {result.postsCount}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AccountChecker;
