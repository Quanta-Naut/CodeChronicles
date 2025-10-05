# Contributing to CodeChronicles — Hacktoberfest 2025 Guide

Thank you for your interest in contributing to CodeChronicles! This document walks you through a friendly, step-by-step Hacktoberfest 2025 contribution workflow — from forking the repository to submitting a clean pull request. It includes terminal commands, branch/commit conventions, an example change, and common troubleshooting notes.

## Quick Overview

- **Prepare**: Fork + clone + set upstream
- **Work**: Create a feature branch, make changes, run tests/lint (if available)
- **Commit**: Write a clear commit message and push
- **PR**: Open a pull request, describe changes, tag/label appropriately

## Prerequisites

- A GitHub account (linked to Hacktoberfest if you're participating)
- Git installed locally and configured with your name/email
- A code editor like VS Code

If you haven't configured Git locally, run:

```bash
# Replace with your name/email
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Step 1 — Fork the Repository on GitHub

- Go to the repository page: [Quanta-Naut/CodeChronicles](https://github.com/Quanta-Naut/CodeChronicles)
- Click "Fork" (top-right) to create a copy under your account.

## Step 2 — Clone Your Fork

- On your fork's page, click "Code" → copy the HTTPS URL.
- In your terminal (choose a folder where you keep projects), run:

```bash
# Replace with your fork URL
git clone https://github.com/<your-username>/CodeChronicles.git
cd CodeChronicles
```

## Step 3 — Add the Upstream Remote (the Original Repo)

```bash
git remote add upstream https://github.com/Quanta-Naut/CodeChronicles.git
git fetch upstream
```

Now `origin` points to your fork, and `upstream` points to the original project.

## Step 4 — Create a Branch for Your Change

- Always make a feature branch — don't work on `main`.

```bash
# Good branch names: fix/readme-typo, feat/add-summary-command, docs/hacktoberfest2025
git checkout -b fix/readme-typo
```

## Step 5 — Make Your Change

- Small, self-contained changes are easiest to review and qualify for Hacktoberfest.
- Example: Fix a typo in `README.md` or add a short helper script.

Example change: Create a new file `scripts/hello.ts` with:

```ts
// scripts/hello.ts
export function hello(name: string) {
    return `Hello, ${name}! Welcome to CodeChronicles.`;
}

// Simple usage (not run here):
// console.log(hello('Hacktoberfest'))
```

After editing or adding files, stage your changes:

```bash
git add README.md scripts/hello.ts
# Or to add all changed files:
git add -A
```

## Step 6 — Commit with a Clear Message

Write a concise, descriptive commit message. Use present-tense, imperative style.

```bash
git commit -m "docs: fix typo in README and add hello helper script"
```

If your commit needs to be split or amended, use interactive rebase or `git commit --amend` before pushing.

## Step 7 — Keep Your Branch Up-to-Date (Optional but Recommended)

Before pushing, sync with upstream `main` to avoid merge conflicts:

```bash
git fetch upstream
git checkout main
git pull upstream main
git checkout fix/readme-typo
git rebase main
```

## Step 8 — Push Your Branch to Your Fork

```bash
git push origin fix/readme-typo
```

## Step 9 — Open a Pull Request (PR)

- Go to your fork on GitHub — you'll often see a "Compare & pull request" button. Click it.
- Base repository: `Quanta-Naut/CodeChronicles`, base branch: `main`
- Head repository: `your-username/CodeChronicles`, compare: `fix/readme-typo`
- Title: Short descriptive title (same as commit or slightly expanded)
- Description: Explain the why and what. Link any relevant issues.

PR description template (copy into the PR body):

```text
Summary: (one-line)

What I changed:
- Bullet list of edits

Why this change is needed:
- Short rationale

How I tested:
- Steps you ran or manual checks

Notes for maintainers:
- Anything they should know (optional)
```

## Step 10 — Labels, Hacktoberfest Eligibility, and Notes

- If this repo maintains a "good first issue" or "Hacktoberfest" label, mention it in your PR or ask maintainers to add the label.
- Hacktoberfest rules change from year to year. Ensure the PR is a valid, meaningful contribution. If the project and maintainers agree the PR qualifies but it isn't merged by the event deadline, maintainers can apply a label such as `hacktoberfest-accepted` so it counts according to the event rules in effect.

## Checklist Before Requesting Review

- [ ] Branch created from latest `main`
- [ ] Clear commit message(s)
- [ ] Small, focused changes
- [ ] No confidential data or secrets
- [ ] Code builds/lints (if applicable) and unit tests (if any) pass locally

## Common Git Commands (Cheat Sheet)

```bash
# Create a new branch
git checkout -b feat/my-feature

# Stage changes
git add <file>

# Commit
git commit -m "feat: add my feature"

# Push branch
git push origin feat/my-feature

# Update branch from upstream main
git fetch upstream
git rebase upstream/main

# Force-push after rebase (only for your topic branch)
git push --force-with-lease origin feat/my-feature
```

## Troubleshooting

- "Permission denied" on push: Make sure you're pushing to your fork (`origin`). If the remote is wrong, check `git remote -v`.
- Merge conflicts during rebase: Resolve files, `git add` the resolved files, then `git rebase --continue`.
- Forgot to include a file in a commit: Use `git add` then `git commit --amend` (if you haven't pushed yet) or create a new commit.

## Maintainers: How to Mark a PR as Hacktoberfest-Eligible

- If a PR qualifies but isn't merged by the event's deadline, projects often apply the `hacktoberfest-accepted` label to count it. Follow your project policy for labeling.

## Security

- Do not include secrets, credentials, or personal data in PRs.

## Further Resources

- Git basics: [git-scm tutorial](https://git-scm.com/docs/gittutorial)
- Hacktoberfest official: [hacktoberfest.com](https://hacktoberfest.com)

Thanks for contributing! If you want, leave a note in the PR about Hacktoberfest and which issue you worked on — we love to see new contributors.

---

Requirements coverage

- Add step-by-step fork→PR guide: Done
- Include code and terminal commands: Done (examples and cheat-sheet included)
- Tailored for Hacktoberfest 2025: Done (notes about labeling and rules)

If you'd like, I can also:

- Add a `good-first-issue` template and a label set in the repo,
- Create one or two small starter issues for Hacktoberfest (with reproduction steps), or
- Provide a sample unit test and test-run instructions for the TypeScript code in `src/`.

