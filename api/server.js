const express = require('express');
const bodyParser = require('body-parser');
const { fetchBlueskyData } = require('./bluesky');
const app = express();

app.use(bodyParser.json());

app.post('/api/check-accounts', async (req, res) => {
  console.log(req.body);  // Log the body being sent
  const { username, appPassword, accounts } = req.body;

  try {
    // Call the function to fetch data from Bluesky API
    const results = await fetchBlueskyData(username, appPassword, accounts);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
