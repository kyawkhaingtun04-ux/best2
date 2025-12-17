const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serves your index.html

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
