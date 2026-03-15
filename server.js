const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const N8N_WEBHOOK = 'https://noam42.app.n8n.cloud/webhook/20f4050c-2283-466c-9fe7-15635393b6e3/chat';

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    console.log('Réponse brute:', text);

    // Assembler le texte depuis le stream n8n
    let output = '';
    const lines = text.split('\n').filter(l => l.trim());
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'item' && obj.content) {
          output += obj.content;
        }
      } catch {}
    }

    if (!output) {
      try {
        const data = JSON.parse(text);
        output = data?.output || data?.text || data?.message || text;
      } catch {
        output = text;
      }
    }

    res.json({ output });
  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ output: 'Erreur: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Alkegen sur port ${PORT}`));
