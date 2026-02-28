#! /usr/bin/env node

/**
 * Git Workflow - 自动化 git 提交和推送
 *
 * Usage:
 *   node git-workflow.mjs [commit-message] [--no-push]
 *
 * Examples:
 *   node git-workflow.mjs "feat: 优化技能文档"
 *   node git-workflow.mjs "docs: 创建提示词规范" --no-push
 *   node git-workflow.mjs  # 自动生成提交信息
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

// 检查是否是 git 仓库
function isGitRepo() {
  return existsSync('.git');
}

// 检查 README.md 是否存在
function hasReadme() {
  return existsSync('README.md');
}

// 检查 README.md 是否在 git 修改列表中
function isReadmeChanged(changedFiles) {
  return changedFiles.some(file => file.toLowerCase().includes('readme'));
}

// 询问用户是否确认 README 已更新
function confirmReadmeUpdated() {
  // 这里我们通过命令行参数来控制，如果用户传了 --force-readme，则跳过检查
  // 否则，我们直接提示用户
  return !process.argv.includes('--skip-readme-check');
}

// 获取 git 状态
function getGitStatus() {
  try {
    return execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  } catch (e) {
    return '';
  }
}

// 获取修改的文件列表
function getChangedFiles() {
  try {
    return execSync('git diff --name-only', { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
  } catch (e) {
    return [];
  }
}

// 获取远程仓库地址
function getRemoteUrl() {
  try {
    return execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  } catch (e) {
    return '';
  }
}

// 获取当前分支
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch (e) {
    return 'main';
  }
}

// 自动生成提交信息
function generateCommitMessage(changedFiles) {
  if (changedFiles.length === 0) {
    return 'chore: update';
  }

  // 根据文件类型判断 type
  let type = 'chore';
  const file = changedFiles[0];

  if (file.includes('README') || file.includes('.md') || file.includes('docs')) {
    type = 'docs';
  } else if (file.includes('SKILL')) {
    type = 'feat';
  } else if (file.includes('fix') || file.includes('bug')) {
    type = 'fix';
  }

  // 生成 subject
  const subject = changedFiles.length === 1
    ? `update ${changedFiles[0]}`
    : `update ${changedFiles.length} files`;

  return `${type}: ${subject}`;
}

// 添加所有修改的文件
function addAllFiles() {
  try {
    execSync('git add .', { encoding: 'utf-8' });
    return true;
  } catch (e) {
    console.error('❌ 添加文件失败:', e.message);
    return false;
  }
}

// 提交
function commit(message) {
  try {
    execSync(`git commit -m "${message}"`, { encoding: 'utf-8' });
    return true;
  } catch (e) {
    console.error('❌ 提交失败:', e.message);
    return false;
  }
}

// 推送
function push(branch) {
  try {
    execSync(`git push origin ${branch}`, { encoding: 'utf-8' });
    return true;
  } catch (e) {
    console.error('❌ 推送失败:', e.message);
    return false;
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const noPush = args.includes('--no-push');
  const skipReadmeCheck = args.includes('--skip-readme-check');
  const commitMessage = args.filter(a => a !== '--no-push' && a !== '--skip-readme-check')[0];

  // 检查是否是 git 仓库
  if (!isGitRepo()) {
    console.error('❌ 当前目录不是 git 仓库');
    process.exit(1);
  }

  // 检查 README.md 是否已更新（强制！）
  if (!skipReadmeCheck) {
    const changedFiles = getChangedFiles();
    const readmeChanged = isReadmeChanged(changedFiles);

    if (!readmeChanged) {
      console.log('🔴 重要警告！README.md 未更新！');
      console.log('');
      console.log('⚠️  在提交和推送之前，必须先更新 README.md！');
      console.log('');
      console.log('请确认：');
      console.log('  - [ ] README.md 已全量更新？');
      console.log('  - [ ] 重要更新已记录在 README.md 中？');
      console.log('  - [ ] README.md 的结构合理？');
      console.log('');
      console.log('如果 README.md 确实不需要更新，可以使用 --skip-readme-check 跳过此检查。');
      console.log('');
      process.exit(1);
    }

    console.log('✅ README.md 已更新，继续...');
    console.log('');
  }

  // 检查 git 状态
  const status = getGitStatus();
  if (!status) {
    console.log('✅ 没有修改需要提交');
    process.exit(0);
  }

  // 获取修改的文件
  const changedFiles = getChangedFiles();
  console.log('📝 修改的文件:');
  changedFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');

  // 添加文件
  console.log('📦 添加文件...');
  if (!addAllFiles()) {
    process.exit(1);
  }

  // 生成/获取提交信息
  const message = commitMessage || generateCommitMessage(changedFiles);
  console.log(`✍️  提交信息: ${message}`);
  console.log('');

  // 提交
  console.log('🚀 提交...');
  if (!commit(message)) {
    process.exit(1);
  }

  // 推送（如果需要）
  const branch = getCurrentBranch();
  const remoteUrl = getRemoteUrl();

  if (!noPush) {
    console.log(`📤 推送到 ${branch}...`);
    if (!push(branch)) {
      process.exit(1);
    }
    console.log('');

    // 输出结果
    console.log('✅ 提交并推送成功！');
    console.log('');
    if (remoteUrl) {
      console.log(`**GitHub 仓库：** ${remoteUrl}`);
      console.log('');
    }
    console.log(`**提交信息：** ${message}`);
    console.log('');
    console.log('**修改的文件：**');
    changedFiles.forEach(file => console.log(`- ${file}`));
  } else {
    console.log('');
    console.log('✅ 提交成功（未推送）！');
    console.log('');
    console.log(`**提交信息：** ${message}`);
    console.log('');
    console.log('**修改的文件：**');
    changedFiles.forEach(file => console.log(`- ${file}`));
  }
}

main();
