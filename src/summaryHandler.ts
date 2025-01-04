import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import os from "os";
import { fetchFileDescriptionCopilot } from "./descriptionLM";
import { mainFileFetcher, mainFileDescriber } from "./mainFileFetcherLM";

function mainFileValidator(fileNameData: string, mainFileLine: string): string {
  const fileName = fileNameData.split(" ");
  const mainFileData = mainFileLine.split(" ");
  let mainFile = "";
  for (const file of fileName) {
    for (const main of mainFileData) {
      if (file === main) {
        mainFile = file;
        break;
      }
    }
  }
  return mainFile;
}

async function getUsername(): Promise<string> {
  const systemUsername = os.userInfo().username;
  const formattedUsername =
    systemUsername.charAt(0).toUpperCase() +
    systemUsername.slice(1).toLowerCase();
  return formattedUsername;
}

export async function generateMarkdownSummary(
  context: vscode.ExtensionContext
) {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage(
      "CodeChronicles: No workspace folder is open."
    );
    return false;
  }

  try {
    // Get all files in the workspace, excluding `node_modules`
    const files = await vscode.workspace.findFiles(
      "**/*",
      "**/node_modules/**"
    );

    if (files.length === 0) {
      // vscode.window.showInformationMessage("My Extension: No files found in the workspace.");
      return false;
    }
    console.log(files);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("en-US", {
      weekday: "long", // "Monday"
      year: "numeric", // "2024"
      month: "long", // "December"
      day: "numeric", // "29"
      hour: "numeric", // "12"
      minute: "numeric", // "30"
      second: "numeric", // "45"
    });

    const username = await getUsername();
    let markdownContent = `# ${username}'s Workspace File Summary\n`;
    markdownContent += `## Generated On: ${formattedDate}\n`; // Add the date and time here
    markdownContent += `This summary lists all files in the workspace with brief descriptions.\n`;
    markdownContent += `---\n`;

    // Generate descriptions for each file
    let filesNames = "";
    for (const file of files) {
      const fileName = file.fsPath.split(/[/\\]/).pop(); // Extract the file name
      if (!fileName) {
        console.error(`Could not extract file name for ${file.fsPath}`);
        continue; // Skip files without a name
      }
      filesNames += fileName;
      filesNames += " ";
    }
    // vscode.window.showInformationMessage(`'${filesNames}'`);
    // console.log(filesNames);
    let description = await fetchFileDescriptionCopilot(filesNames); // Safe because fileName is ensured to be a string
    markdownContent += `${description} \n`;
    description = await mainFileFetcher(filesNames); // Safe because fileName is ensured to be a string
    const mainFile = mainFileValidator(filesNames, description);
    // markdownContent += `\nMain FIle: | ${description} |\n`;
    description = await mainFileDescriber(mainFile);
    markdownContent += `### Project Description:\n ${
      description || "Description not available"
    }\n`;

    // Save the Markdown file
    const workspacePath = context.globalState.get<string>("codechronicle_repoFolderPath");

    if (!workspacePath) {
      vscode.window.showErrorMessage(
        "CodeChronicles: Please configure the extension. "
      );
      return;
    }

    const day = String(currentDate.getDate()).padStart(2, "0"); // Two digits for day
    const month = currentDate.toLocaleString("en-US", { month: "short" }); // "Dec"
    const year = currentDate.getFullYear(); // "2024"
    const hours = String(currentDate.getHours()).padStart(2, "0"); // Two digits for hours
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    const formattedDateMDFolder = `${day}_${month}_${year}`;
    const formattedDateMD = `${day}_${month}_${year}_${hours}_${minutes}`;

    const summaryFilePath = path.join(
      workspacePath,
      formattedDateMDFolder,
      `${formattedDateMD}.md`
    );
    // Get the directory from the file path
    const directoryPath = path.dirname(summaryFilePath);

    try {
      // Ensure the directory exists
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // Create directory recursively
      }
    } catch (err) {
      console.error("Error creating file:", err);
    }

    fs.writeFileSync(summaryFilePath, markdownContent);

    //TODO:
    // vscode.window.showInformationMessage(
    //   `Markdown summary created at: ${summaryFilePath}`
    //   );
    return true;
  } catch (error) {
    console.error("CodeChronicles: Error generating Markdown summary:", error);
    // vscode.window.showErrorMessage(
    //   "An error occurred while generating the Markdown summary."
    // );
  }
}
