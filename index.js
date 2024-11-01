const express = require('express');
const axios = require('axios');
const { Readable } = require('stream');

const app = express();
const PORT = 3000;

// Replace this with your actual ElevenLabs API Key
const ELEVENLABS_API_KEY = "sk_daa1716fb62a4554c3203cdab1abfed4c4e7769cbd87ce47";

// Function to get the text-to-speech audio stream from ElevenLabs
async function textToSpeechStream(text) {
  const url = 'https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream';
  
  const config = {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  };

  const data = {
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.0,
      similarity_boost: 1.0,
      style: 0.0,
      use_speaker_boost: true,
    },
    output_format: "mp3_22050_32"
  };

  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error('Error generating speech:', error.message);
    throw new Error('Failed to generate speech');
  }
}

// Route to handle text-to-speech conversion
app.get('/textspeech', async (req, res) => {
  const text = req.query.query;
  if (!text) {
    return res.status(400).send('Query parameter is required');
  }

  try {
    const audioStream = await textToSpeechStream(text);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="output.mp3"',
    });
    audioStream.pipe(res);
  } catch (error) {
    res.status(500).send('Error processing text-to-speech');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});