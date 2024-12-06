import express from 'express';
import { checkAccount } from './bluesky.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to check Bluesky account data
app.post('/api/check-accounts', async (req, res) => {
  const { username, password, accounts } = req.body;

  if (!username || !password || !accounts) {
    return res.status(400).json({ error: 'Please provide username, password, and accounts list' });
  }

  try {
    const results = await checkAccount(username, password, accounts);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Bluesky' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
