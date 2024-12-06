const axios = require('axios');

/**
 * Authenticate and fetch account data from Bluesky API
 * @param {string} username - Bluesky username or email
 * @param {string} appPassword - App password for Bluesky
 * @param {Array<string>} accounts - List of accounts to check
 * @returns {Promise<Array>} - Array of account data
 */
async function fetchBlueskyData(username, appPassword, accounts) {
  const auth = `${username}:${appPassword}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
  };

  const results = [];
  for (const account of accounts) {
    try {
      const { data } = await axios.get(
        `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${account}`,
        { headers }
      );
      results.push({
        username: account,
        status: 'active',
        followers: data.followersCount || 0,
        following: data.followingCount || 0,
        posts: data.postsCount || 0,
      });
    } catch (error) {
      results.push({
        username: account,
        status: error.response?.status === 404 ? 'suspended' : 'unknown error',
      });
    }
  }

  return results;
}

module.exports = { fetchBlueskyData };
