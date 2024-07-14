import dotenv from 'dotenv';
import MistralClient from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const mistralClient = new MistralClient(process.env.MISTRAL_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// 1. Getting the user input
const input = "December 25th is on a Sunday, do I get any extra time off to account for that?";

// 2. Creating an embedding of the input
const embedding = await createEmbedding(input);

// 3. Retrieving similar embeddings / text chunks (aka "context")
const context = await retrieveMatches(embedding);
// console.log(context);
// 4. Combining the input and the context in a prompt 
// and using the chat API to generate a response 
const response = await generateChatResponse(context, input);
console.log(response);

async function createEmbedding(input) {
  const embeddingResponse = await mistralClient.embeddings({
      model: 'mistral-embed',
      input: [input]
  });
  return embeddingResponse.data[0].embedding;
}

async function retrieveMatches(embedding) {
    const { data } = await supabase.rpc('match_handbook_docs', {
        query_embedding: embedding,
        match_threshold: 0.78,
        match_count: 5
    });
    return data.map(chunk => chunk.content).join(" ");
}


async function generateChatResponse(context, query) {
    const response = await mistralClient.chat({
        model: 'mistral-large-latest',
        messages: [{
            role: 'user',
            content: `Handbook context: ${context} - Question: ${query}`
        }]
    });
    return response.choices[0].message.content;
}