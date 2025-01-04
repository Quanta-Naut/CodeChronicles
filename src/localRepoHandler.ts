import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function getDocumentsFolderPath(): string {
    const homeDir = os.homedir();

    // Determine the "Documents" folder path for each OS
    if (process.platform === 'win32') {
        // Windows
        return path.join(homeDir, 'Documents');
    } else if (process.platform === 'darwin') {
        // macOS
        return path.join(homeDir, 'Documents');
    } else {
        // Linux and other UNIX-like systems
        return path.join(homeDir, 'Documents');
    }
}

export async function createFolderInDocuments(folderName: string, context: vscode.ExtensionContext): Promise<void> {
    const documentsPath = getDocumentsFolderPath();
    const folderPath = path.join(documentsPath, folderName);

    try {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            // console.log(`Folder created at: ${folderPath}`);
        } 
        // else {
        //     console.log(`Folder already exists at: ${folderPath}`);
        // }

        // Store the folder path in global state
        await context.globalState.update('codechronicle_repoFolderPath', folderPath);
        // console.log(`Folder path stored in global state: ${folderPath}`);
    } catch (error) {
        // console.error(`Error creating folder: ${error}`);
        vscode.window.showErrorMessage(`CodeChronicles: Failed to create local repository folder. Try Again.`);
    }
}