const express = require('express');
const { BskyAgent } = require('@atproto/api');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/check-accounts', async (req, res) => {
  const { username, appPassword, accounts } = req.body;

  if (!username || !appPassword || !accounts || accounts.length === 0) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const agent = new BskyAgent({ service: 'https://bsky.social' });

  try {
    await agent.login({ identifier: username, password: appPassword });
    console.log('Logged in to Bluesky API.');

    const results = [];

    for (const account of accounts) {
      try {
        const profile = await agent.getProfile({ actor: account });
        const posts = await agent.getPosts({ actor: account, limit: 50 });

        results.push({
          username: account,
          banned: false,
          followers: profile.data.followersCount,
          posts: posts.data.posts.length,
          likes: posts.data.posts.map((post) => post.likeCount || 0),
        });
      } catch {
        results.push({
          username: account,
          banned: true,
          followers: 'N/A',
          posts: 'N/A',
          likes: [],
        });
      }
    }

    return res.json(results);
  } catch (error) {
    console.error('Error logging in to Bluesky API:', error.message);
    return res.status(500).json({ error: 'Failed to authenticate.' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
