import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const MAX_TOKENS = 8000;

export async function mainFileFetcher(fileName: string): Promise<string> {
  try {
    // Select a Copilot chat model
    const [model] = await vscode.lm.selectChatModels({
      vendor: "copilot",
      family: "gpt-4o",
    });

    // Create the prompt for Copilot
    const messages = [
      vscode.LanguageModelChatMessage.User(
        `You are a code assistant. In the give files, which is the main coding file or the file that contains all the main code/program? just give the main file and nothing else.`
      ),
      vscode.LanguageModelChatMessage.User(`File name: ${fileName}`),
    ];

    // Send the request to Copilot
    const response = await model.sendRequest(
      messages,
      {},
      new vscode.CancellationTokenSource().token
    );

    // Collect all text fragments from the response
    let fullResponse = "";
    for await (const fragment of response.text) {
      fullResponse += fragment; // Append each fragment
    }

    // Return the concatenated response as the description
    return fullResponse.trim(); // Trim any leading or trailing whitespace
  } catch (err) {
    console.error("Error fetching description from Copilot:", err);
    return "Description not available";
  }
}

export async function mainFileDescriber(filePath: string): Promise<string> {

    try {
        const content = await findFileInWorkspace(filePath);
        const data = await readFileContent(content);
    
        // Split the data into manageable chunks based on token limits.
        const codeChunks = chunkCode(data, MAX_TOKENS);
    
        // Select a Copilot chat model
        const [model] = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o'
        });
    
        let fullResponse = '';
    
        // Send each chunk separately, requesting a response from the model
        for (const chunk of codeChunks) {
            const messages = [
                vscode.LanguageModelChatMessage.User(`You are a code assistant. In the given code, explain what the code is about and what does the code do. Also give valuable statistics about the code like the number of lines, number of functions, number of classes, etc. Don't provide any code snippets. Keep the explanation short and concise to 15 lines and 5 lines of number of functions, classes, lines of code, etc.`),
                vscode.LanguageModelChatMessage.User(`Code: ${chunk}`)
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

async function readCodeFromNotebook(filePath: string): Promise<string[]> {
    try {
      // Read the file content
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      
      // Parse the JSON content of the notebook
      const notebook = JSON.parse(fileContent);
  
      // Extract code cells
      const codeCells = notebook.cells.filter((cell: any) => cell.cell_type === 'code');
  
      // Get the code from each code cell
      const code = codeCells.map((cell: any) => cell.source.join('\n')).join('\n');
  
      return code.split('\n');  // Return each line of code in an array
    } catch (error) {
      console.error('Error reading notebook:', error);
      return [];
    }
}
  

async function readFileContent(filePath: string): Promise<string> {
    try {
        if (filePath.endsWith('.ipynb')) { 
            const content = await readCodeFromNotebook(filePath);
            return content.join('\n');
        }
    const content = await fs.promises.readFile(filePath, "utf-8"); // Read file as UTF-8
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    // vscode.window.showErrorMessage("Failed to read the file.");
    return "";
  }
}

async function findFileInWorkspace(fileName: string): Promise<string> {
  // Check if workspace is opened
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("CodeChronicles: No workspace folder is open.");
    return "";
  }

  // Get the workspace folder path
  const workspaceFolderPath = workspaceFolders[0].uri.fsPath;

  // Recursively search for the file within the workspace folder
  const filePath = await searchFile(workspaceFolderPath, fileName);

  if (filePath) {
    console.log(`File found at: ${filePath}`);
    return filePath;
  } else {
    // vscode.window.showErrorMessage(
    //   `File '${fileName}' not found in workspace. '${workspaceFolderPath}'`
    // );
    return "";
  }
}

// Function to recursively search for the file in a directory
async function searchFile(
  directory: string,
  fileName: string
): Promise<string | null> {
  try {
    const files = await fs.promises.readdir(directory, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(directory, file.name);

      if (file.isDirectory()) {
        // Recursively search in subdirectories
        const result = await searchFile(fullPath, fileName);
        if (result) {
          return result; // Return the file path if found
        }
      } else if (file.name === fileName) {
        // If file is found, return the file path
        return fullPath;
      }
    }
    return null; // File not found in this directory
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return null;
  }
}
