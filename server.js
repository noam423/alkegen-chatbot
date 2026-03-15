const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const N8N_WEBHOOK = 'https://noam42.app.n8n.cloud/webhook/20f4050c-2283-466c-9fe7-15635393b6e3/chat';

app.post('/chat', async (req, res) => {
  try {
    console.log('Message reçu:', req.body);
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    console.log('Réponse n8n brute:', text);
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.json({ output: text });
    }
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ output: 'Erreur serveur: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Alkegen sur port ${PORT}`));
