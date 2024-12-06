const { BskyAgent } = require('@atproto/api');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bskyUsername, appPassword, usernames } = req.body;

  if (!bskyUsername || !appPassword || !Array.isArray(usernames)) {
    return res.status(400).json({ error: 'Missing or invalid input.' });
  }

  const agent = new BskyAgent({ service: 'https://bsky.social' });

  try {
    // Authenticate using the app password
    await agent.login({ identifier: bskyUsername, password: appPassword });

    const results = [];
    for (const username of usernames) {
      try {
        const profile = await agent.getProfile({ actor: username });
        results.push({
          username,
          banned: false,
          followers: profile.data.followersCount,
          followings: profile.data.followsCount,
          posts: profile.data.postsCount,
        });
      } catch (err) {
        results.push({
          username,
          banned: true,
          followers: 0,
          followings: 0,
          posts: 0,
        });
      }
    }

    return res.status(200).json({ results });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Authentication failed or Bluesky API error.' });
  }
};
