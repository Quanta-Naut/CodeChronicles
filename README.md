![CodeChronicles.png](images/CodeChronicles.png)
<h1 align="center" style="border-bottom: none">
    <b>
        <p>CodeChronicles</p>
    </b>
    Transforming Your Code into a Timeless Journey! <br>
</h1>

<h3 align="center">
    Effortlessly merge code summaries and watch your GitHub charts shine! This powerful VS Code extension automatically generates summaries of your code and seamlessly merges them into your GitHub repository as commit logs.
</h3>

___
<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=QuantaNaut.codechronicles"><img src="https://img.shields.io/badge/VS Code Ext-CodeChronicles-7303fc.svg" alt="Repository: GitHub"></a>
<a href="https://github.com/Quanta-Naut/CodeChronicles"><img src="https://img.shields.io/badge/Repository-GitHub-fc0394.svg" alt="Repository: GitHub"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-orange.svg" alt="License: MIT"></a>
<a href="https://www.linkedin.com/in/tarun-kumar-s-676a74267/"><img src="https://img.shields.io/badge/LinkedIn-Profile-035afc.svg" alt="LinkedIn: Profile"></a>
</p>

---

#### Search **"CodeChronicles"** on the **VS Code Extension** or click the above extension link to download.

### **Table of Contents:**

1. [Introduction](#introduction)
2. [Features](#features)
3. [Why CodeChronicles?](#why-codechronicles)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [FAQ's](#faq's)
7. [Contributing](#contributing)
8. [License](#license)

### **Introduction:**
> Every line of code has a story, and every commit builds your legacy. CodeChronicles, a VS Code extension, ensures you never lose track of your progress. It automatically generates summaries of your code, merges them into your GitHub repository, keeps your GitHub chart alive, and lets you focus on what truly matters—creating something extraordinary.

> Start documenting your coding adventures effortlessly, one commit at a time, and watch your story unfold in the chronicles of GitHub!

#### **Head to [Installation](#installation) to setup CodeChronicles!**

#### **Want to contribute?, check out [CONTRIBUTION.md](CONTRIBUTION.md)!**


### **Features:**

- **Code Summaries:** Automatically generates simple summaries of your workspace, describing what the files and code do, every 25 minutes.
- **GitHub Integration:** Commits and merges these summaries into your GitHub repository automatically.
- **Keeps GitHub Active:** Helps keep your GitHub contribution chart active whenever you code, accurately reflecting when and what you worked on.
- **Lightweight Logging:** Creates a Markdown file with a brief overview of your workspace without going into every detail.
- **Customizable Timing:** Adjust the summary interval to suit your workflow.

### **Why CodeChronicles?**

- **Keep GitHub Charts Active:** The main benefit of CodeChronicles is keeping your GitHub contribution chart updated by merging summaries, ensuring your coding streaks and activity are accurately recorded.
- **Track Your Coding Journey:** Easily look back at your repository to see when and what you worked on, with summaries providing a quick understanding of your workspace.
- **Focus on Coding:** CodeChronicles handles summary creation and merging automatically, so you can focus on coding without worrying about manually updating GitHub activity.


### **Installation:**

- ##### Requirements:
	For **CodeChronicles** to function properly, you will need the following installed on your system:
	- **Git**
	- **GitHub Copilot (VS Code Extension)**

#### **If you have all the requirements installed already, head to [Configuration](#configuration).**

##### **The installation might take a moment, but it's beginner-friendly and a one-time process. Once done, your GitHub charts will shine effortlessly!**

- **Installing Requirements:**
	Follow the steps below to ensure all necessary requirements are installed and configured properly:
	
	- **Git**
		1. Install **Git** from [here](https://git-scm.com/downloads).
		2. During the Git installation, simply click 'Next' until the installation is complete.
		3. After completing the Git installation, go to your GitHub profile, click on your avatar in the top-right corner, navigate to **Settings**, and select **Emails** from the left-hand menu.
		4. Now, copy the noreply email, which will look something like this: `123456789+Quanta-Naut@users.noreply.github.com`. The one highlighted in red box.
		
		![git-noreply-email.png](images/git-noreply-email.png)
		
		5. Open the command prompt and run the following commands to set your Git username and email:
		
			`git config --global user.name "Your Name"
			`git config --global user.email "noreply_email@users.noreply.github.com"`
			
			In place of `Your Name`, add your name, and in place of `noreply_email@users.noreply.github.com`, paste the noreply email you copied.
			
		6. That's all with **Git**.
		
	- **GitHub Copilot**
		1. Open **VS Code**, go to the Extensions view, and install **GitHub Copilot**.
		
		![copilot.png](images/copilot.png)
		
		2. Click on the Copilot icon in the bottom right of VS Code, and you will be prompted to log in to GitHub. Click 'Allow' and log in to complete the process.
		
		![copilot-login.png](images/copilot-login.png)
		
		3. Click on **Accounts** to confirm your login.
		
		![github-confirm.png](images/github-confirm.png)
		
### **Configuration:**

1. Either through **File > Open Folder** or from the **welcome page**, open a folder in your workspace in VS Code.

	![open-folder.png](images/open-folder.png)

2. Open GitHub in your browser, create a new **public** repository, and then copy the repository link. It must be similar to (https://github.com/Quanta-Naut/CodeChronicles) or (https://github.com/Quanta-Naut/CodeChronicles.git).
3. Now, go back to VS Code and press **F1** or **Ctrl + Shift + P**, and type 
	**`CodeChronicles: Configure

	![configure.png](images/configure.png)

3. Once you hit Enter, you will be prompted to enter your repository link. Paste the link and make sure to add `.git` at the end, then hit Enter. Your link should look something like this: https://github.com/Quanta-Naut/CodeChronicles.git (with `.git` at the end).

	![link-configure.png](images/link-configure.png)

4. Now, a window will appear asking you to sign in to GitHub. Please click **Sign In**, and you will be redirected to your browser to log in.

	![confirn-github.png](images/confirn-github.png)

5. If you followed all the above steps correctly, you will be greeted with the message: 
	`CodeChronicles: Successfully Configured Repository.`

	![cofigure-msg.png](images/cofigure-msg.png)

6. Just to test, create a program file (e.g., `main.py`), type a simple program like `print("Hello World")`, and save the file.
7. Now, press **F1** or **Ctrl + Shift + P**, and type **`CodeChronicles: Generate Summary`** and hit **Enter**

	![test-case-gensum.png](images/test-case-gensum.png)

8. Make sure you have internet connection.
9. Wait for **10-15 seconds**. If everything is set up correctly, you will receive a notification saying **`CodeChronicles: Progress has been merged with the GitHub repository.`**

	![test-run-confirm.png](images/test-run-confirm.png)


### **If you've reached this far, Congratulations! Your GitHub chart is about to look beautiful!

### **Please follow the steps below. Here are the commands to use CodeChronicles:**


### **Commands:**

All the commands listed can be executed by pressing **F1** or **Ctrl + Shift + P**.

1. **`CodeChronicles: Set Interval`**
	 **Set Interval** command allows you to set the interval at which the summary should be merged. The range of the interval is from 25 minutes to 80 minutes.
	 Every **x** minutes (within the range of 25 to 80 minutes), the summary is merged.
	 ![setInterval1.png](images/setInterval1.png)
	 
	 Hit **Enter**. And type in a valid minute between **25 - 80 minutes** 
	 ![setInterval2.png](images/setInterval2.png)
	 

2. **`CodeChronicles: Show Repository`**
	 **Show Repository** command allows you to view both the GitHub repository and the local repository.
	 
	![showRepo1.png](images/showRepo1.png)
	
	Hit **Enter**. Here in the dialog box below, you can select:
	- **GitHub Repo**: Opens the GitHub repository in your browser where the summary is stored.
	- **Local Repo**: Opens the folder on your system where all the summaries are stored locally.
	
	![showRepo2.png](images/showRepo2.png)

3. **`CodeChronicles: Clear Configuration`**
	**Clear Configuration** removes the stored GitHub repository and deletes the local folder where all summaries are stored (located in the local documents folder). This can be used if any mistakes are made during the setup.
	
	![clearConf1.png](images/clearConf1.png)
	
	All data gets cleared.
	
	![clearConf2.png](images/clearConf2.png)

4. **`CodeChronicles: Configure`**
	**Configure** command is used to set up the GitHub repository where all the summary merging happens. In the background, it automatically creates a local folder to store all the summaries.
	
	![conf1.png](images/conf1.png)
	
	If the configuration is already set, the command will ask for confirmation:
	- **Yes (Y):** Proceeds with reconfiguration.
	- **No (N):** Cancels the configuration process."
	
	![conf2.png](images/conf2.png)
	
	While configuring, you will be prompted to enter your GitHub repository link. Ensure the link ends with `.git` (e.g., `https://github.com/Quanta-Naut/CodeChronicles.git`)
	
	![conf4.png](images/conf4.png)
	
	If everything is configured correctly, you will receive the message: 
	**`CodeChronicles: Successfully Configured Repository.`**
	
	![conf3.png](images/conf3.png)

5. **`CodeChronicles: Generate Summary`**
	**Generate Summary** command forces the generation of the summary and merges it to the GitHub repository, bypassing the set interval.
	
	![gen-sum1.png](images/gen-sum1.png)
	
	If everything is configured correctly, you will receive the following message:
	**`CodeChronicles: Progress has been merged with the GitHub repository.`**
	
	![gen-sum2.png](images/gen-sum2.png)


### **Contributors:**

-  [<img src="https://avatars.githubusercontent.com/u/123290216" width="50" height="50">](https://github.com/Quanta-Naut)

### **Want to contribute?, check out [CONTRIBUTION.md](CONTRIBUTION.md)!** Will be updated soon!!.

---
### **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
