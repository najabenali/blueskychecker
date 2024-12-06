import React, { useState } from 'react';

const AccountChecker = () => {
    const [blueskyUsername, setBlueskyUsername] = useState('');
    const [appPassword, setAppPassword] = useState('');
    const [accountUsernames, setAccountUsernames] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const usernames = accountUsernames.split(',').map((u) => u.trim());

        try {
            const response = await fetch('/api/checkAccounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blueskyUsername, appPassword, accountUsernames: usernames }),
            });

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-checker">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Bluesky Username</label>
                    <input
                        type="text"
                        value={blueskyUsername}
                        onChange={(e) => setBlueskyUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>App Password</label>
                    <input
                        type="password"
                        value={appPassword}
                        onChange={(e) => setAppPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Account Usernames (comma-separated)</label>
                    <textarea
                        value={accountUsernames}
                        onChange={(e) => setAccountUsernames(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Checking...' : 'Check Accounts'}
                </button>
            </form>
            {results.length > 0 && (
                <div className="results">
                    <h2>Results:</h2>
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>
                                {result.error ? (
                                    <span>{result.username}: {result.error}</span>
                                ) : (
                                    <span>
                                        <strong>{result.username}</strong> - 
                                        Suspended: {result.isSuspended ? 'Yes' : 'No'}, 
                                        Followers: {result.followersCount}, 
                                        Following: {result.followsCount}, 
                                        Posts: {result.postsCount}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AccountChecker;
