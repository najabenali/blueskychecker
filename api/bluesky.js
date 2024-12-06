const axios = require('axios');

async function fetchBlueskyData(username, appPassword, accounts) {
  const results = [];

  for (let account of accounts) {
    try {
      // Authenticate with Bluesky
      const authResponse = await axios.post('https://bsky.social/xrpc/com.atproto.server.createSession', {
        identifier: username,
        password: appPassword
      });

      const authToken = authResponse.data.accessJwt;

      // Fetch account data for each username
      const accountData = await axios.get(`https://bsky.social/xrpc/com.atproto.repo.getRecord`, {
        params: { repo: account },
        headers: { Authorization: `Bearer ${authToken}` }
      });

      results.push({
        username: account,
        followers: accountData.data.followersCount,
        followings: accountData.data.followingCount,
        posts: accountData.data.postsCount,
        suspended: accountData.data.suspended || false
      });
    } catch (err) {
      results.push({
        username: account,
        error: 'Failed to fetch data'
      });
    }
  }

  return results;
}

module.exports = { fetchBlueskyData };
