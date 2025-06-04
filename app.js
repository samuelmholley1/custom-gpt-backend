const express = require('express');
const axios = require('axios');
const cors = require('cors'); // For Cross-Origin Resource Sharing
require('dotenv').config(); // To load environment variables from .env file locally

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log('Attempting to read OPENAI_API_KEY. Value:', OPENAI_API_KEY ? 'Key Found (masked for security)' : 'Key NOT Found');

// Simple root route to confirm server is up
app.get('/', (req, res) => {
  res.send('Chatbot backend is running!');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured on the server.');
    return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
  }

  if (!userMessage) {
    console.warn('Received request to /chat without a message.');
    return res.status(400).json({ error: 'Message is required in the request body.' });
  }

  console.log(`Received message for /chat: "${userMessage}"`);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o', // Using your desired model
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log(`Successfully got reply from OpenAI: "${reply}"`);
    res.json({ reply: reply });

  } catch (error) {
    console.error(
      'Error calling OpenAI API:',
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    if (error.response && error.response.status === 401) {
        console.error('OpenAI API Key is invalid or not authorized.');
        res.status(401).json({ error: 'OpenAI API Key is invalid or not authorized.'});
    } else {
        res.status(500).json({ error: 'Failed to get response from AI service.' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}. Ready to receive requests.`);
  console.log(`Test GET / endpoint: https://YOUR_RAILWAY_APP_URL/`);
  console.log(`Test POST /chat endpoint: https://YOUR_RAILWAY_APP_URL/chat`);
});
