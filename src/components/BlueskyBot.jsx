import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlueskyBot = ({ username, appPassword, accounts }) => {
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAccounts = async () => {
      setLoading(true);
      const data = [];

      for (let account of accounts) {
        if (account.trim()) {
          try {
            // Bluesky API request to get account information
            const response = await axios.get(
              `https://bsky.social/xrpc/com.atproto.server.getAccount`,
              {
                headers: {
                  'Authorization': `Basic ${btoa(username + ':' + appPassword)}`,
                },
                params: {
                  handle: account.trim(),
                },
              }
            );
            
            const { data: accountInfo } = response;
            const { suspended, followers_count, following_count, posts_count } = accountInfo;

            data.push({
              account,
              suspended,
              followers_count,
              following_count,
              posts_count,
            });
          } catch (error) {
            console.error(`Error fetching data for ${account}: `, error);
            data.push({ account, error: 'Failed to retrieve data' });
          }
        }
      }

      setAccountData(data);
      setLoading(false);
    };

    if (username && appPassword) {
      checkAccounts();
    }
  }, [username, appPassword, accounts]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {accountData.length > 0 ? (
            accountData.map((data, index) => (
              <div key={index}>
                <h3>{data.account}</h3>
                {data.suspended !== undefined ? (
                  <p>Status: {data.suspended ? 'Suspended' : 'Active'}</p>
                ) : (
                  <p>{data.error}</p>
                )}
                <p>Followers: {data.followers_count}</p>
                <p>Following: {data.following_count}</p>
                <p>Posts: {data.posts_count}</p>
              </div>
            ))
          ) : (
            <p>No accounts to check.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BlueskyBot;
