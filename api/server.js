const express = require('express');
const bodyParser = require('body-parser');
const { authenticate, fetchAccountData } = require('./bluesky');

const app = express();
app.use(bodyParser.json());

app.post('/api/authenticate', async (req, res) => {
  const { username, appPassword } = req.body;

  try {
    const token = await authenticate(username, appPassword);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/check-accounts', async (req, res) => {
  const { token, handles } = req.body;

  try {
    const results = [];
    for (const handle of handles) {
      const accountData = await fetchAccountData(token, handle);
      results.push(accountData);
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
