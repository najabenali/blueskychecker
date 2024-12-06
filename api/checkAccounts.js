const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { blueskyUsername, appPassword, accountUsernames } = req.body;

    if (!blueskyUsername || !appPassword || !accountUsernames) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Authenticate with the Bluesky API
        const loginResponse = await axios.post('https://bsky.social/xrpc/com.atproto.server.createSession', {
            identifier: blueskyUsername,
            password: appPassword,
        });

        const { accessJwt } = loginResponse.data;

        // Fetch account details for each username
        const results = await Promise.all(
            accountUsernames.map(async (username) => {
                try {
                    const accountDetails = await axios.get(
                        `https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=${username}`,
                        {
                            headers: { Authorization: `Bearer ${accessJwt}` },
                        }
                    );

                    const { handle, followersCount, followsCount, postsCount, isSuspended } = accountDetails.data;
                    return { username: handle, followersCount, followsCount, postsCount, isSuspended };
                } catch {
                    return { username, error: 'Failed to fetch details' };
                }
            })
        );

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
