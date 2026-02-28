---
name: git-workflow
description: "Git workflow automation - Automate git commit and push, with README.md enforcement check. Use when you need to commit and push changes to GitHub, or when you want to ensure README.md is updated before committing."
---

# Git Workflow Skill

Automate git commit and push workflow, with mandatory README.md update check.

---

## Quick Start

### Commit and Push Current Changes

When user says:
```
"帮我提交并推送当前项目"
"Commit and push this project"
```

The skill will:
1. **Check if README.md is updated** (MANDATORY!)
2. Check git status
3. Add all modified files
4. Generate or use provided commit message
5. Commit locally
6. Push to remote
7. Return result with remote repo URL

---

### Skip README Check (Use with Caution!)

If README.md really doesn't need updating:
```bash
node scripts/git-workflow.mjs "feat: optimize" --skip-readme-check
```

---

## Core Principles

### 1. README.md First! ⭐⭐⭐ (MANDATORY!)

**BEFORE committing and pushing, ALWAYS confirm:**

- [ ] **README.md is fully updated?**
- [ ] **Important updates are recorded in README.md?**
- [ ] **README.md structure is reasonable?**

**If README.md is not updated, the skill will refuse to commit and remind you to update it first!**

---

### 2. Commit Message Convention

Follow conventional commits format:

```
<type>: <subject>
```

**Type options:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code style change
- `refactor`: Refactor
- `test`: Testing
- `chore`: Build/tools

**Examples:**
```
feat: add README.md enforcement check
docs: update skill documentation
fix: correct git status check
```

---

## Workflow

```
User requests commit/push
    ↓
⚠️ Check if README.md is updated?
    ↓
    ├─ No → Remind user to update README.md first
    │
    └─ Yes → Check git status
              ↓
         Has changes?
              ├─ No → Tell user no changes
              │
              └─ Yes → Add modified files
                        ↓
                   Generate/get commit message
                        ↓
                   Commit locally
                        ↓
                   Need to push?
                        ├─ No → Done, return commit result
                        │
                        └─ Yes → Push to remote
                                  ↓
                             Done, return result with remote repo URL
```

---

## Usage

### As OpenClaw Skill

**Scenario 1: Commit and push current directory**
```
"帮我提交并推送当前项目"
"Commit and push this project"
```

**Scenario 2: Specify commit message**
```
"帮我提交并推送，提交信息是：feat: 优化技能文档"
"Commit and push with message: feat: optimize skill docs"
```

**Scenario 3: Commit only, no push**
```
"帮我提交到本地，先不推送"
"Commit locally only, don't push"
```

---

### As Independent Script

```bash
# Auto-generate commit message and push
node scripts/git-workflow.mjs

# Specify commit message and push
node scripts/git-workflow.mjs "feat: optimize skill docs"

# Commit only, no push
node scripts/git-workflow.mjs "docs: update docs" --no-push

# Skip README check (use with caution!)
node scripts/git-workflow.mjs "feat: optimize" --skip-readme-check
```

---

## Bundled Resources

### Scripts (`scripts/`)

- **`git-workflow.mjs`** - Main automation script

**Features:**
- README.md enforcement check
- Git status checking
- Auto-add modified files
- Conventional commit message generation
- Auto-commit and push
- Remote repo URL return

---

## Important: README.md Update Checklist

**Before committing and pushing, confirm:**

- [ ] **README.md is fully updated**
- [ ] **Important updates are recorded in README.md**
- [ ] **README.md structure is reasonable**

**Remember: Update README first, then commit and push!**

---

## Summary

This skill helps you:

1. **Enforce README.md updates** - Must confirm README is updated before committing
2. **Simplify git workflow** - No need to remember multiple commands
3. **Standardize commit messages** - Use conventional commit format
4. **Auto-return remote URL** - Includes GitHub repo URL after push

---

*Skill created: 2026-02-28*
*Last updated: 2026-02-28*
