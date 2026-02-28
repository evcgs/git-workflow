# Git Workflow

Git workflow automation - Automate git commit and push, with README.md enforcement check.

---

## Features

- ✅ **README.md First!** - Mandatory README.md update check before committing
- ✅ **Git Status Check** - Automatically check git status
- ✅ **Auto-Add Files** - Automatically add modified files
- ✅ **Conventional Commits** - Follow conventional commit message format
- ✅ **Auto-Commit & Push** - One command to commit and push
- ✅ **Remote Repo URL** - Automatically return remote repo URL after push

---

## Quick Start

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

## Installation

### As OpenClaw Skill

Copy to OpenClaw skills directory:
```bash
cp -r git-workflow ~/.openclaw/workspace/skills/
```

### As Independent Tool

Clone and install:
```bash
git clone https://github.com/evcgs/git-workflow.git
cd git-workflow
npm install
```

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

*Project created: 2026-02-28*
*Last updated: 2026-02-28*
