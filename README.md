# git-workflow

Git workflow automation - Automate git commit and push, with README.md enforcement check.

---

## Features

- ✅ **README.md enforcement check** (MANDATORY!)
- ✅ **Auto-check git status**
- ✅ **Auto-add modified files**
- ✅ **Generate conventional commit messages**
- ✅ **Auto-commit and push**
- ✅ **Auto-return remote repo URL**

---

## Installation

```bash
# Clone the repo
git clone https://github.com/evcgs/git-workflow.git
cd git-workflow

# Add execution permission
chmod +x scripts/git-workflow.mjs
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

## Important: README.md First! ⭐⭐⭐ (MANDATORY!)

**BEFORE committing and pushing, ALWAYS confirm:**

- [ ] **README.md is fully updated?**
- [ ] **Important updates are recorded in README.md?**
- [ ] **README.md structure is reasonable?**

**If README.md is not updated, the script will refuse to commit and remind you to update it first!**

---

## Commit Message Convention

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

## Project Structure

```
git-workflow/
├── SKILL.md              # OpenClaw skill definition
├── README.md             # This file (for GitHub users)
└── scripts/
    └── git-workflow.mjs  # Main automation script
```

---

## More Info

For OpenClaw skill usage, see [SKILL.md](./SKILL.md)

---

## License

MIT

---

*Created: 2026-02-28*
