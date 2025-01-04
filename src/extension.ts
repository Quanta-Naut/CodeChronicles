import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as https from "https";
const { exec } = require("child_process");
import { initializeAndPushRepository } from "./repoHandler";
import { generateMarkdownSummary } from "./summaryHandler";

function checkInternetConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    https
      .get("https://www.google.com", (res) => {
        if (res.statusCode === 200) {
          resolve(true); // Internet is available
        } else {
          resolve(false); // Internet is not available
        }
      })
      .on("error", () => {
        resolve(false); // Internet is not available
      });
  });
}

async function executeAtIntervals(context: vscode.ExtensionContext) {
  const isConfigured = context.globalState.get<boolean>(
    "codechronicle_isConfigured"
  );

  if (!isConfigured) {
    vscode.window
      .showInformationMessage(
        "CodeChronicle: Please configure the extension.",
        "Configure"
      )
      .then((selected) => {
        if (selected === "Configure") {
          // Open the configuration/settings page or perform configuration logic
          vscode.commands.executeCommand("codechronicles.configure");
          // initializeAndPushRepository(context);
        }
      });
  } else {
    if (!(await checkInternetConnection())) {
      vscode.window.showErrorMessage(
        "CodeChronicle: No internet connection. Please check your connection."
      );
      return;
    }
    const proceed = await generateMarkdownSummary(context);
    if (proceed) {
      await initializeAndPushRepository(context);
    }
  }
}

//main function starts here

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "codechronicle" is now active!');

  const isConfigured = context.globalState.get<boolean>(
    "codechronicle_isConfigured"
  );

  if (!isConfigured) {
    vscode.window
      .showInformationMessage(
        "CodeChronicle: Please configure the extension.",
        "Configure"
      )
      .then((selected) => {
        if (selected === "Configure") {
          // Open the configuration/settings page or perform configuration logic
          vscode.commands.executeCommand("codechronicles.configure");
          // initializeAndPushRepository(context);
        }
      });
  }
  let intervalTime = context.globalState.get<number>("codechronicle_interval");

  // Check if the stored interval is available
  if (!intervalTime) {
    context.globalState.update("codechronicle_interval", 1500000); // Default interval: 25 minutes
  }

  const intervalId = setInterval(() => {
    executeAtIntervals(context);
    intervalTime =
      context.globalState.get<number>("codechronicle_interval") || 1500000;
  }, intervalTime); // Interval set to 25 minutes by default

  context.subscriptions.push({
    dispose: () => {
      clearInterval(intervalId);
    },
  });

  // Command to generate Markdown summary
  const generateMarkdownDisposable = vscode.commands.registerCommand(
    "codechronicles.generateMarkdownSummary",
    async () => {
      const proceed = await generateMarkdownSummary(context);
      if (proceed) {
        await initializeAndPushRepository(context);
      }
    }
  );

  const showRepository = vscode.commands.registerCommand(
    "codechronicles.viewRepository",
    async () => {
      vscode.window
        .showInformationMessage(
          "CodeChronicle: Select the repository you want to visit:",
          "GitHub Repo",
          "Local Repo"
        )
        .then((selected) => {
          if (selected === "GitHub Repo") {
            const storedPath = context.globalState.get<string>(
              "codechronicle_repoGithubPath"
            );
            if (storedPath) {
              vscode.env.openExternal(vscode.Uri.parse(storedPath));
            } else {
              vscode.window.showErrorMessage(
                "CodeChronicle: GitHub Repository path not found."
              );
            }
          } else if (selected === "Local Repo") {
            const storedPath = context.globalState.get<string>(
              "codechronicle_repoFolderPath"
            );
            if (storedPath) {
              // Open the file/folder using the system's file explorer
              if (process.platform === "win32") {
                exec(`explorer "${storedPath}"`);
              } else if (process.platform === "darwin") {
                exec(`open "${storedPath}"`);
              } else if (process.platform === "linux") {
                exec(`xdg-open "${storedPath}"`);
              }
            } else {
              vscode.window.showErrorMessage(
                "CodeChronicle: Local Repository path not found."
              );
            }
          }
        });
    }
  );

  const configure = vscode.commands.registerCommand(
    "codechronicles.configure",
    async () => {
      const isConfigured = context.globalState.get<boolean>(
        "codechronicle_isConfigured"
      );
      if (isConfigured) {
        vscode.window.showInformationMessage(
          "CodeChronicle: Already configured."
        );
        const reConfigure = await vscode.window.showInputBox({
          placeHolder: "Enter y/n",
          prompt:
            "CodeChronicle is already configured. Do you want to re-configure?? Y/n", //FIXME: My Ext
          validateInput: (input) => {
            if (!input) {
              return "Input cannot be empty";
            }
            return null;
          },
        });
        if (
          reConfigure === "n" ||
          reConfigure === "N" ||
          reConfigure === "no" ||
          reConfigure === "No" ||
          !reConfigure
        ) {
          return;
        } else {
          await vscode.commands.executeCommand(
            "codechronicles.resetGlobalValues"
          );
          await initializeAndPushRepository(context);
        }
      } else {
        // await vscode.commands.executeCommand("codechronicle.resetGlobalValues");
        await initializeAndPushRepository(context);
      }
    }
  );

  const clearAllData = vscode.commands.registerCommand(
    "codechronicles.resetGlobalValues",
    async () => {
      const storedPath = context.globalState.get<string>(
        "codechronicle_repoFolderPath"
      );
      if (storedPath) {
        deleteDirectory(storedPath);
      }
      // Clear the global values
      context.globalState.update("codechronicle_repoFolderPath", undefined);
      context.globalState.update("codechronicle_repoGithubPath", undefined);
      context.globalState.update("codechronicle_isConfigured", undefined);
      vscode.window.showInformationMessage(
        "CodeChronicle: All Data Cleared!!."
      );
    }
  );

  const reConfInterval = vscode.commands.registerCommand(
    "codechronicles.configureInterval",
    async () => {
      const interval = await vscode.window.showInputBox({
        placeHolder: "Enter in minutes",
        prompt:
          "Please enter an interval between 25 and 80 minutes (whole number):",
        validateInput: (input) => {
          if (!input) {
            return "Input cannot be empty";
          }
          const minutes = parseInt(input);
          if (isNaN(minutes) || minutes < 25 || minutes > 80) {
            return "Please enter a valid interval between 25 and 80 minutes.";
          }
          return null;
        },
      });
      if (interval) {
        intervalTime = parseInt(interval) * 60000;
        context.globalState.update("codechronicle_interval", intervalTime);
        vscode.window.showInformationMessage(
          `CodeChronicle: Interval set to ${interval} minutes.`
        );
      }
    }
  );

  // Push all disposables to the subscriptions array
  context.subscriptions.push(generateMarkdownDisposable);
  context.subscriptions.push(showRepository);
  context.subscriptions.push(reConfInterval);
  context.subscriptions.push(clearAllData);
  context.subscriptions.push(configure);
}

export function deactivate() {}

function deleteDirectory(directory: string) {
  try {
    if (fs.existsSync(directory)) {
      // Remove all files and subdirectories
      fs.rmSync(directory, { recursive: true, force: true });
      console.log(`Directory ${directory} has been deleted.`);
    } else {
      console.log(`Directory ${directory} does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting directory ${directory}:`, error);
  }
}
