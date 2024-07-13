import dotenv from 'dotenv';
import MistralClient from '@mistralai/mistralai';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY //|| 'your_api_key';
const client = new MistralClient(apiKey);

// const chatResponse = await client.chat({
//     model: 'mistral-tiny',
//     messages: [{ role: 'user', content: 'Who is the best soccer player?' }],
//     temperature: 0.5 // creativity or randomness of the generated text.
//   });


const chatResponse = await client.chat({ // changing from chat to chat stream makes chatResponse object to an async iterable.
    model: 'mistral-tiny',
    messages: [
        { role: 'user', content: 'You are an expert video game analyst. Reply with JSON' },
        {role: 'user', content: 'Which is the best game in the world?'}
     ],
    temperature: 0.5,
    response_format: {
        type: 'json_object'
    }
  });


// Logs the content of the first choice's message from the chat response to the console

console.log(chatResponse.choices[0].message.content);

// // Check if a second choice exists and log its content if available
// if (chatResponse.choices.length > 1) {
//   console.log(chatResponse.choices[1].message.content);
// } else {
//   console.log("No second choice available in the response.");
// }

// for await (const chunk of chatResponse) {   
//     console.log(chunk.choices[0].delta.content); // delta in place of message.
// }