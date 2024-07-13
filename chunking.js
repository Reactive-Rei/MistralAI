import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { promises as fs } from 'fs';

async function splitDocument() {

    // Read the file content
    const text = await fs.readFile('handbook.txt', 'utf-8');
    console.log(text);  // Log the content or process it as needed
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250, // Maximum chunk size by number of characters
        chunkOverlap: 40
    });

    const output = await splitter.createDocuments([text]);
    console.log(output); // Log the output

}

splitDocument();


// async function splitDocument() {
//     const response = await fetch('handbook.txt');
//     const text = await response.text();
//     console.log(text);
// }

// splitDocument();