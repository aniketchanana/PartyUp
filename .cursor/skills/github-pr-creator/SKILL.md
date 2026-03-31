---
name: github-pr-creator
description: Creates a GitHub PR from the current branch to main, and auto-writes a concise 3–4 line PR description based on the branch’s actual code changes.
---

# GitHub PR Creator (current branch → main)

This skill helps when the user wants a pull request created for the work currently on their checked-out branch. It gathers the real changes (status/diff/log), drafts a short PR summary from those changes, then creates the PR targeting `main` using the GitHub MCP tools (or `gh` if that’s the project standard).

## When to Use

- Use this skill when the user asks to **create/open a PR**, **raise a PR**, **make a pull request**, or **create a GitHub PR** for the **current branch**.
- Use this skill when the user wants an **auto-written PR description** (3–4 lines) based on what changed.
- Do not use this skill for release workflows, multi-branch stacking, or large PR re-organization (those need planning).

## Instructions

### Requirements / assumptions
- **Base branch**: `main`
- **Head branch**: the currently checked-out branch (`HEAD`)
- **PR description**: **3–4 lines max**, derived from actual diffs/commits (no speculation)
- **No commits**: this skill **does not create commits** unless the user explicitly asks
- **No force pushes**: never rewrite history

### Workflow
1. **Sanity check current branch**
   - Confirm you are not on `main`.
   - Ensure there are commits on this branch that differ from `main`.

2. **Collect change context (must do all)**
   - `git status` (untracked/modified/staged)
   - `git diff` (unstaged + staged)
   - `git log --oneline --decorate -n 20` (recent messages)
   - `git diff main...HEAD` (full PR diff since divergence)

3. **Draft PR title**
   - Prefer a concise, action-oriented title matching existing repo conventions.
   - If commit messages are clean, you may use the top commit summary as the title.

4. **Draft PR body (3–4 lines)**
   - Exactly **3–4 short lines**, focused on **what changed + why it matters**.
   - Mention key areas/files touched only if high-signal (avoid exhaustive lists).
   - If there are user-facing changes, include one line describing the UX impact.
   - If tests were added/updated, include one line noting that.

   Example format (keep it short):
   - Summary: <main change>
   - Behavior: <notable behavior/UX change>
   - Tests: <what ran/added or “not added” if relevant>
   - Notes: <risk/rollout or follow-up, optional>

5. **Ensure remote branch exists**
   - If the branch is not pushed, push with upstream tracking (`git push -u origin HEAD`).

6. **Create the PR to main using GitHub MCP**
   - Create a PR with:
     - base: `main`
     - head: current branch
     - title: drafted title
     - body: drafted 3–4 lines
   - If the GitHub MCP is unavailable or not authenticated, fall back to `gh pr create`
     (only if that’s acceptable for this repository; otherwise ask to authenticate MCP).

7. **Return results**
   - Output the PR URL and the final title + the 3–4 line description used.
   - Do not include large diffs in chat.

### Safety rules
- Never push/PR to a different base branch unless the user explicitly requests it.
- Never include secrets or `.env`-like files in the PR; if detected, warn and stop.
- If there are failing checks already visible, mention them in the PR body as “known issues” only when confirmed by tooling output.