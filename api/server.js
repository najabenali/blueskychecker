const express = require('express');
const cors = require('cors');
const { fetchBlueskyData } = require('./bluesky');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/check-accounts', async (req, res) => {
  const { username, appPassword, accounts } = req.body;
  if (!username || !appPassword || !accounts) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const results = await fetchBlueskyData(username, appPassword, accounts);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
