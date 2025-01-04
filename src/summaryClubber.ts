import * as vscode from 'vscode';

export async function summaryClub(data: string): Promise<string> {

    try {
        // Split the data into manageable chunks based on token limits.
        const codeChunks = chunkCode(data, 8000);
    
        // Select a Copilot chat model
        const [model] = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o'
        });
    
        let fullResponse = '';
    
        // Send each chunk separately, requesting a response from the model
        for (const chunk of codeChunks) {
            const messages = [
                vscode.LanguageModelChatMessage.User(`You are a code analyst agent. You are provided with summaries of the same code block, your job is to understand what the code is about from the provided summaries and craft a summary. Keep the summary short and concise. Also there are data like no of lines of code, no of functions, no of classes, etc. Use this data to craft and extract and provide it in the output. I need all information like the code summary, no of lines of code, no of functions, no of classes, etc.`),
                vscode.LanguageModelChatMessage.User(`File name: ${chunk}`)
            ];
    
            // Send the request to Copilot
            const response = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
    
            // Collect all text fragments from the response
            for await (const fragment of response.text) {
                fullResponse += fragment; // Append each fragment
            }
        }
    
        // Return the concatenated response as the description
        return fullResponse.trim(); // Trim any leading or trailing whitespace
    } catch (err) {
        console.error('Error fetching description from Copilot:', err);
        return 'Description not available';
    }
}

function chunkCode(code: string, maxTokens: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    console.log(code.length);

    // Split the code into chunks, considering token limits.
    for (let i = 0; i < code.length; i++) {
        currentChunk += code[i];
        if (currentChunk.length >= maxTokens) {
            chunks.push(currentChunk);
            currentChunk = ''; // Start a new chunk
        }
    }
    
    if (currentChunk.length > 0) {
        chunks.push(currentChunk); // Add remaining chunk
    }

    return chunks;
}