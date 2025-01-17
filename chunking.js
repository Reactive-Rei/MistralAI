import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { promises as fs } from 'fs';
import MistralClient from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const mistralClient = new MistralClient(process.env.MISTRAL_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

async function splitDocument(path) {

    // Read the file content
    const text = await fs.readFile(path, 'utf-8');
    // console.log(text);  // Log the content or process it as needed
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250, // Maximum chunk size by number of characters
        chunkOverlap: 40
    });

    const output = await splitter.createDocuments([text]);
    const textArr = output.map(chunk => chunk.pageContent);
    return textArr;

}
const handbookChunks = await splitDocument('handbook.txt');

async function createEmbeddings(chunks) {
    const embeddings = await mistralClient.embeddings({
        model: 'mistral-embed',
        input: chunks
    });
    const data = chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embeddings.data[i].embedding
        }
    });
    return data;
}

const data = await createEmbeddings(handbookChunks);
await supabase.from('handbook_docs').insert(data);
console.log("Upload complete!");