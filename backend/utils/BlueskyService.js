const { BskyAgent } = require('@atproto/api');

class BlueskyService {
  constructor(username, appPassword) {
    this.username = username;
    this.appPassword = appPassword;
    this.agent = new BskyAgent({ service: 'https://bsky.social' });
  }

  async login() {
    await this.agent.login({ identifier: this.username, password: this.appPassword });
  }

  async fetchProfileData(account) {
    try {
      const profile = await this.agent.getProfile({ actor: account });
      const posts = await this.agent.getPosts({ actor: account, limit: 50 });
      return {
        username: account,
        banned: false,
        followers: profile.data.followersCount,
        posts: posts.data.posts.length,
        likes: posts.data.posts.map((post) => post.likeCount || 0),
      };
    } catch {
      return {
        username: account,
        banned: true,
        followers: 'N/A',
        posts: 'N/A',
        likes: [],
      };
    }
  }
}

module.exports = BlueskyService;
