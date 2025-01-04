import * as vscode from 'vscode';

export async function fetchFileDescriptionCopilot(fileName: string): Promise<string> {
    try {
        // Select a Copilot chat model
        const [model] = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o'
        });

        // Create the prompt for Copilot
        const messages = [
            vscode.LanguageModelChatMessage.User(`You are a code assistant. Provide a brief description of the following files based on its name and common coding practices. If it's a common file like README.md, explain its purpose. And also provide a description of what project it belongs to and explain the project. And give a brief description of wether the files are created to learn new skill or they are building a project. Give all the details in well formated markdown. Ignore the files that are not related to the project and is very obvious like datasets, pdf, images, etc. Only provide information about relevant files..`),
            vscode.LanguageModelChatMessage.User(`File name: ${fileName}`)
        ];

        // Send the request to Copilot
        const response = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

        // Collect all text fragments from the response
        let fullResponse = '';
        for await (const fragment of response.text) {
            fullResponse += fragment; // Append each fragment
        }

        // Return the concatenated response as the description
        return fullResponse.trim(); // Trim any leading or trailing whitespace
    } catch (err) {
        // console.error('Error fetching description from Copilot:', err);
        vscode.window.showErrorMessage("CodeChronicles: Not able to access Copilot.");
        return 'Description not available';
    }
}
