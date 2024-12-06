import { BskyAgent } from '@atproto/api';

export default async function handler(req, res) {
  const { usernames, appPassword, username } = req.body;

  if (!usernames || !appPassword || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const agent = new BskyAgent({ service: 'https://bsky.social' });

  try {
    await agent.login({ identifier: username, password: appPassword });
    
    const accountData = [];
    
    for (const user of usernames) {
      const userData = await agent.getProfile(user);

      if (userData?.data?.blocked) {
        accountData.push({ username: user, status: 'Banned' });
      } else {
        const followers = await agent.getFollowers({ actor: user });
        const posts = await agent.getPosts({ actor: user });
        
        accountData.push({
          username: user,
          status: 'Active',
          followersCount: followers.data.length,
          postsCount: posts.data.length,
          likesCount: posts.data.reduce((acc, post) => acc + post.likes, 0),
        });
      }
    }
    
    res.status(200).json(accountData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data from BlueSky' });
  }
}
