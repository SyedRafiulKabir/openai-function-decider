import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());

app.post('/decide-function', async (req, res) => {
  const { prompt, functionNames } = req.body;

  if (!prompt || !Array.isArray(functionNames) || functionNames.length === 0) {
    return res.status(400).send('Invalid request body');
  }

  try {
    // Prepare the OpenAI prompt
    const openaiPrompt = `
      Based on the following prompt: "${prompt}", choose the most appropriate function from the list below:
      ${functionNames.join(', ')}.
      Respond with the name of the function that should be triggered.
    `;

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      prompt: openaiPrompt,
      
    });

    const chosenFunction = response.data.choices[0].text.trim();
    res.json({ function: chosenFunction });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
