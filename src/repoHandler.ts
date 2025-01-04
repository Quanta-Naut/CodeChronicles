import simpleGit from "simple-git";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { createFolderInDocuments } from "./localRepoHandler";

const git = simpleGit();

//TODO: Change the folder name
const branchName = "main";
const folderName = "CodeChronicles";

export async function initializeAndPushRepository(
  context: vscode.ExtensionContext
) {
  createFolderInDocuments(folderName, context)
    .then(() => {
      const storedPath = context.globalState.get<string>("codechronicle_repoFolderPath");
      if (!storedPath) {
        vscode.window.showErrorMessage(
          "CodeChronicles: Folder path not found. Please try configuring again."
        );
      }
    })
    .catch((error) => {
      console.error("Error in folder creation:", error);
    });
  let repoDirectory = context.globalState.get<string>("codechronicle_repoFolderPath");

  let githubRepoUrl = context.globalState.get<string>("codechronicle_repoGithubPath");

  if (!githubRepoUrl) {
    const userInput = await vscode.window.showInputBox({
      placeHolder: "https://github.com/user_name/test_repo.git",
      prompt: "Please provide the GitHub repository URL:",
      validateInput: (input) => {
        // Optional: Add a simple validation to check GitHub URL format
        const githubRepoRegex =
          /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\.git)?$/;
        return githubRepoRegex.test(input)
          ? null
          : "Please enter a valid GitHub repository URL.";
      },
    });

    if (userInput) {
      // Store the input in globalState
      await context.globalState.update("codechronicle_repoGithubPath", userInput);
      // vscode.window.showInformationMessage(
      //   `Stored repository URL: ${userInput}`
      // );
      githubRepoUrl = userInput; // Update the variable after storing
    } else {
      vscode.window.showWarningMessage(
        "CodeChronicles: No input provided. Operation canceled. Retry to configure the repository."
      );
      return;
    }
  }

  try {
    // Ensure the directory exists
    if (!repoDirectory) {
      throw new Error("Local Repository folder path not found.");
    }
    const repoPath = path.resolve(repoDirectory);

    // Set Git to the correct working directory
    await git.cwd(repoPath);
    // console.log(`Using repository path: ${repoPath}`);

    // Initialize the Git repository
    await git.init();
    // console.log("Git repository initialized.");

    // Check if the branch exists
    const branchList = await git.branch();
    if (!branchList.all.includes(branchName)) {
      await git.checkoutLocalBranch(branchName);
      // vscode.window.showInformationMessage(`Branch '${branchName}' created.`);
    } else {
      await git.checkout(branchName);
      // console.log(`Checked out to branch '${branchName}'.`);
    }

    // Check if the remote 'origin' exists
    const remotes = await git.getRemotes();
    const remoteExists = remotes.some((remote) => remote.name === "origin");

    if (!remoteExists) {
      if (!githubRepoUrl) {
        throw new Error("GitHub repository URL not provided.");
      }
      await git.addRemote("origin", githubRepoUrl);
      // vscode.window.showInformationMessage(
      //   `Remote 'origin' added: ${githubRepoUrl}`
      // );
    }
    // else {
    //   console.log("Remote 'origin' already exists.");
    // }

    // Perform a git pull to fetch the latest changes
    try {
      await git.pull("origin", branchName);
      // vscode.window.showInformationMessage(
      //   `Pulled the latest changes from 'origin/${branchName}'.`
      // );
    } catch (err) {
      // console.warn(
      //   "Git pull failed. This might happen if the branch does not exist remotely yet.",
      //   err
      // );
      // vscode.window.showErrorMessage(
      //   "Error. This might happen if the branch does not exist remotely yet."
      // );
    }

    // Check if there are files to commit
    const fs = require("fs");
    const files = fs.readdirSync(repoPath);
    if (files.length === 0) {
      // vscode.window.showWarningMessage(
      //   "No files found to commit. Add files to the repository folder."
      // );
      return;
    }

    // Add all files to the staging area
    await git.add(".");
    // console.log("Files added to the staging area.");

    // Commit the changes
    const commitMessage = "Initial commit";
    await git.commit(commitMessage);
    // console.log("Files committed with message:", commitMessage);

    // Push the changes to GitHub
    await git.push("origin", branchName); // Pushes to the correct branch

    const statusData = context.globalState.get<string>("codechronicle_isConfigured");
    if (statusData) {
      vscode.window.showInformationMessage(
        "CodeChronicles: Progress has been merged with the GitHub repository."
      );
    }
    else {
      vscode.window.showInformationMessage(
        "CodeChronicles: Successfully Configured Repository."
      );
    }
    await context.globalState.update("codechronicle_isConfigured", true);
  } catch (error) {
    // console.error("Error initializing and pushing repository:", error);
    vscode.window.showErrorMessage("CodeChronicles: The repository initialization and push attempt failed.");
  }
}
