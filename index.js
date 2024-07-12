import dotenv from 'dotenv';
import MistralClient from '@mistralai/mistralai';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY //|| 'your_api_key';
const client = new MistralClient(apiKey);

const chatResponse = await client.chat({
    model: 'mistral-tiny',
    messages: [{ role: 'user', content: 'Who is the best soccer player?' }],
    temperature: 0.5 // creativity or randomness of the generated text.
  });

console.log(chatResponse.choices[0].message.content); // Logs the content of the first choice's message from the chat response to the console

//console.log(chatResponse.choices[1].message.content); // If you want to log the second choice, you can modify the code to access choices[1]