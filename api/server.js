const express = require('express');
const cors = require('cors');
const bluesky = require('./bluesky'); // Make sure bluesky.js contains API logic

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/check-accounts', async (req, res) => {
  const { username, appPassword, accounts } = req.body;

  try {
    const result = await bluesky.checkAccounts(username, appPassword, accounts);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch account data', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
