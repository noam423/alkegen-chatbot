const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const N8N_WEBHOOK = 'https://noam42.app.n8n.cloud/webhook/20f4050c-2283-466c-9fe7-15635393b6e3/chat';

// Proxy vers n8n
app.post('/chat', async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Alkegen sur port ${PORT}`));
