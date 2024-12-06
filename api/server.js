const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Route to check Bluesky account details
app.post('/api/check-accounts', async (req, res) => {
  const { username, appPassword, accounts } = req.body;

  if (!username || !appPassword || !accounts) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const auth = `${username}:${appPassword}`;
    const headers = {
      Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
    };

    const results = [];
    for (const account of accounts) {
      try {
        const profile = await axios.get(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${account}`, { headers });
        results.push({
          username: account,
          status: 'active',
          followers: profile.data.followersCount || 0,
          following: profile.data.followingCount || 0,
          posts: profile.data.postsCount || 0,
        });
      } catch (error) {
        results.push({
          username: account,
          status: error.response?.status === 404 ? 'suspended' : 'unknown error',
          followers: 0,
          following: 0,
          posts: 0,
        });
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Bluesky' });
  }
});

module.exports = app;
