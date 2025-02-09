import simpleGit from "simple-git";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { createFolderInDocuments } from "./localRepoHandler";

const git = simpleGit();

const branchName = "main";
const folderName = "CodeChronicles";
const demoFileName = "demo.txt";
const demoFileContent = "This is a demo file for CodeChronicles.";

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
        return; // Stop execution if path is not found
      }
    })
    .catch((error) => {
      console.error("Error in folder creation:", error);
      vscode.window.showErrorMessage(`CodeChronicles: Error creating folder: ${error.message}`);
      return; // Stop execution if folder creation fails
    });

  let repoDirectory = context.globalState.get<string>("codechronicle_repoFolderPath");
  let githubRepoUrl = context.globalState.get<string>("codechronicle_repoGithubPath");

  if (!githubRepoUrl) {
    const userInput = await vscode.window.showInputBox({
      placeHolder: "https://github.com/user_name/test_repo.git",
      prompt: "Please provide the GitHub repository URL:",
      validateInput: (input) => {
        const githubRepoRegex =
          /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\.git)?$/;
        return githubRepoRegex.test(input)
          ? null
          : "Please enter a valid GitHub repository URL.";
      },
    });

    if (userInput) {
      await context.globalState.update("codechronicle_repoGithubPath", userInput);
      githubRepoUrl = userInput;
    } else {
      vscode.window.showWarningMessage(
        "CodeChronicles: No input provided. Operation canceled. Retry to configure the repository."
      );
      return;
    }
  }

  try {
    if (!repoDirectory) {
      throw new Error("Local Repository folder path not found.");
    }
    const repoPath = path.resolve(repoDirectory);

    await git.cwd(repoPath);
    await git.init();

    const branchList = await git.branch();
    if (!branchList.all.includes(branchName)) {
      await git.checkoutLocalBranch(branchName);
    } else {
      await git.checkout(branchName);
    }

    const remotes = await git.getRemotes();
    const remoteExists = remotes.some((remote) => remote.name === "origin");

    if (!remoteExists) {
      if (!githubRepoUrl) {
        throw new Error("GitHub repository URL not provided.");
      }
      await git.addRemote("origin", githubRepoUrl);
    }

    let pullSuccessful = true;
    try {
      await git.pull("origin", branchName);
    } catch (pullError) {
      pullSuccessful = false;
      console.warn("Git pull failed (likely empty repo):", pullError);
    }

    const filesAfterPull = fs.readdirSync(repoPath);

    if (!pullSuccessful || filesAfterPull.length === 0) {
      const demoFilePath = path.join(repoPath, demoFileName);
      fs.writeFileSync(demoFilePath, demoFileContent);
      await git.add(".");
      await git.commit("Added initial demo file");

      try {
        await git.push("origin", branchName);
        vscode.window.showInformationMessage("CodeChronicles: Initial demo file pushed. Make sure the repository exists on GitHub.");
      } catch (pushError) {
        vscode.window.showErrorMessage("CodeChronicles: Failed to push initial commit. Ensure the repository exists on GitHub and is not empty. You might need to create the repo manually on GitHub first.");
        return;
      }
    }

    const files = fs.readdirSync(repoPath);
    if (files.length > 1 || (files.length === 1 && !files.includes(demoFileName))) {
      await git.add(".");
      await git.commit("Adding/updating project files");
      await git.push("origin", branchName);
    }

    const statusData = context.globalState.get<string>("codechronicle_isConfigured");
    if (statusData) {
      vscode.window.showInformationMessage("CodeChronicles: Progress has been merged with the GitHub repository.");
    } else {
      vscode.window.showInformationMessage("CodeChronicles: Successfully Configured Repository.");
    }
    await context.globalState.update("codechronicle_isConfigured", true);

  } catch (error) {
    console.error("Error initializing and pushing repository:", error);
    vscode.window.showErrorMessage(`CodeChronicles: The repository operation failed`);
  }
}