const axios = require('axios');

const AUTH_URL = 'https://bsky.social/xrpc/com.atproto.server.createSession';
const ACCOUNT_INFO_URL = 'https://bsky.social/xrpc/app.bsky.actor.getProfile';

async function authenticate(username, appPassword) {
  try {
    const response = await axios.post(AUTH_URL, {
      identifier: username,
      password: appPassword,
    });

    return response.data.accessJwt;
  } catch (error) {
    throw new Error('Authentication failed. Check your credentials.');
  }
}

async function fetchAccountData(sessionToken, handle) {
  try {
    const response = await axios.get(ACCOUNT_INFO_URL, {
      headers: { Authorization: `Bearer ${sessionToken}` },
      params: { actor: handle },
    });

    return {
      handle,
      followers: response.data.followersCount || 0,
      followings: response.data.followsCount || 0,
      posts: response.data.postsCount || 0,
      suspended: response.data.did ? false : true,
    };
  } catch (error) {
    throw new Error(`Failed to fetch data for ${handle}`);
  }
}

module.exports = { authenticate, fetchAccountData };
