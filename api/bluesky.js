import axios from 'axios';

export async function checkAccount(username, password, accountList) {
  const loginUrl = 'https://bsky.social/xrpc/com.atproto.server.createSession';
  
  // Authenticate with Bluesky using the username and app password
  const loginResponse = await axios.post(loginUrl, {
    identifier: username,
    password: password
  });

  if (loginResponse.status !== 200) {
    throw new Error('Failed to authenticate');
  }

  const authToken = loginResponse.data.accessJwt;

  // API endpoint to check account data
  const accountDataUrl = 'https://bsky.social/xrpc/com.atproto.app.bsky.actor.getProfile';

  // Store the results of each account in an array
  const results = [];
  for (const account of accountList) {
    try {
      const response = await axios.get(accountDataUrl, {
        params: { actor: account },
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // Check if the account exists and if suspended
      if (response.data) {
        const accountInfo = {
          username: account,
          suspended: response.data?.profile?.suspended || false,
          followersCount: response.data?.profile?.followersCount || 0,
          followingCount: response.data?.profile?.followingCount || 0,
          postsCount: response.data?.profile?.postsCount || 0
        };
        results.push(accountInfo);
      }
    } catch (error) {
      console.error('Error fetching account data for', account, error);
      results.push({ username: account, error: 'Account not found' });
    }
  }

  return results;
}
