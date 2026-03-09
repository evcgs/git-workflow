#! /usr/bin/env node

/**
 * Git Workflow V2.0 - 自动化 git 提交和推送（增强版）
 *
 * 新增功能：
 * 1. README结构规范检查
 * 2. 技能规范合规性检查
 * 3. 项目清单自动更新
 * 4. 本地-远程差异对比
 * 5. 网络重试机制
 * 6. 更新日志自动生成
 *
 * Usage:
 *   node git-workflow.mjs [commit-message] [--no-push] [--skip-readme-check] [--skip-skill-check]
 *
 * Examples:
 *   node git-workflow.mjs "feat: 优化技能文档"
 *   node git-workflow.mjs "docs: 创建提示词规范" --no-push
 *   node git-workflow.mjs  # 自动生成提交信息
 *   node git-workflow.mjs list # 查看项目清单
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, homedir } from 'path';

// 全局配置
const WORKSPACE_ROOT = join(homedir(), '.openclaw/workspace');
const PROJECT_LIST_PATH = join(WORKSPACE_ROOT, 'project-list.json');

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

// 检查 README 结构是否符合规范
function checkReadmeStructure() {
  if (!hasReadme()) return false;
  
  const content = readFileSync('README.md', 'utf-8');
  const requiredSections = [
    '# ', // 标题
    '## 🎯', // 项目说明
    '## ✨', // 核心特性
    '## 🚀', // 安装方式
    '## 📝', // 更新日志
  ];
  
  return requiredSections.every(section => content.includes(section));
}

// 检查是否是技能项目
function isSkillProject() {
  return existsSync('skill.md') || existsSync('SKILL.md');
}

// 检查技能规范是否符合要求
function checkSkillSpecification() {
  if (!isSkillProject()) return true;
  
  const requiredFiles = [
    'skill.md',
    'README.md',
    'package.json',
    'manifest.json'
  ];
  
  // 检查必要文件是否存在
  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      console.log(`❌ 缺少必要文件：${file}`);
      return false;
    }
  }
  
  // 检查skill.md是否有基本信息
  const skillContent = readFileSync('skill.md', 'utf-8');
  if (!skillContent.includes('name:') || !skillContent.includes('description:')) {
    console.log('❌ skill.md缺少name或description字段');
    return false;
  }
  
  return true;
}

// 检查GitHub网络连通性
function checkGitHubConnectivity() {
  try {
    execSync('curl -s --connect-timeout 5 https://github.com > /dev/null', { encoding: 'utf-8' });
    return true;
  } catch (e) {
    return false;
  }
}

// 带重试的推送功能
function pushWithRetry(branch, maxRetries = 3, retryDelay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      execSync(`git push origin ${branch}`, { encoding: 'utf-8', timeout: 15000 });
      return true;
    } catch (e) {
      console.log(`⚠️  推送失败，正在进行第 ${i + 1}/${maxRetries} 次重试...`);
      if (i < maxRetries - 1) {
        execSync(`sleep ${retryDelay / 1000}`);
      }
    }
  }
  return false;
}

// 获取本地和远程的提交差异
function getLocalRemoteDiff(branch) {
  try {
    execSync('git fetch origin', { encoding: 'utf-8', timeout: 5000 });
    const localCommit = execSync(`git rev-parse ${branch}`, { encoding: 'utf-8' }).trim();
    const remoteCommit = execSync(`git rev-parse origin/${branch}`, { encoding: 'utf-8' }).trim();
    
    if (localCommit === remoteCommit) {
      return { ahead: 0, behind: 0, diff: [] };
    }
    
    const ahead = execSync(`git rev-list --count origin/${branch}..${branch}`, { encoding: 'utf-8' }).trim();
    const behind = execSync(`git rev-list --count ${branch}..origin/${branch}`, { encoding: 'utf-8' }).trim();
    const diff = execSync(`git diff --name-only origin/${branch}..${branch}`, { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
    
    return { ahead: parseInt(ahead), behind: parseInt(behind), diff };
  } catch (e) {
    return { ahead: 0, behind: 0, diff: [] };
  }
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

// 项目清单管理
function loadProjectList() {
  try {
    if (existsSync(PROJECT_LIST_PATH)) {
      return JSON.parse(readFileSync(PROJECT_LIST_PATH, 'utf-8'));
    }
  } catch (e) {
    // ignore
  }
  return [];
}

function saveProjectList(projects) {
  writeFileSync(PROJECT_LIST_PATH, JSON.stringify(projects, null, 2), 'utf-8');
}

function updateProjectList(projectInfo) {
  const projects = loadProjectList();
  const existingIndex = projects.findIndex(p => p.projectId === projectInfo.projectId);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...projects[existingIndex], ...projectInfo };
  } else {
    projects.push(projectInfo);
  }
  
  saveProjectList(projects);
}

function scanAllProjects() {
  console.log('🔍 正在扫描工作区所有项目...');
  const gitDirs = execSync(`find ${WORKSPACE_ROOT} -name ".git" -type d | grep -E "(skill|agent|project)"`, { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
  
  const projects = [];
  for (const gitDir of gitDirs) {
    const projectPath = gitDir.replace('/.git', '');
    const projectId = projectPath.split('/').pop();
    
    let projectName = projectId;
    let projectType = 'common';
    let version = 'v0.0.1';
    
    // 读取README获取项目名称
    const readmePath = join(projectPath, 'README.md');
    if (existsSync(readmePath)) {
      const content = readFileSync(readmePath, 'utf-8');
      const titleMatch = content.match(/#\s+([^\n]+)/);
      if (titleMatch) {
        projectName = titleMatch[1].trim();
      }
    }
    
    // 识别项目类型
    if (projectPath.includes('skills/')) {
      projectType = 'skill';
    } else if (projectPath.includes('agent') || projectPath.includes('agents/')) {
      projectType = 'agent';
    }
    
    // 读取package.json获取版本
    const packagePath = join(projectPath, 'package.json');
    if (existsSync(packagePath)) {
      try {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
        version = pkg.version || version;
      } catch (e) {
        // ignore
      }
    }
    
    projects.push({
      projectId,
      name: projectName,
      type: projectType,
      path: projectPath,
      remoteUrl: '',
      createTime: new Date().toISOString().split('T')[0],
      lastPushTime: '',
      version,
      status: '开发中',
      installMethods: []
    });
  }
  
  saveProjectList(projects);
  console.log(`✅ 共扫描到 ${projects.length} 个项目，已保存到 ${PROJECT_LIST_PATH}`);
  return projects;
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  // 命令：list - 查看项目清单
  if (args[0] === 'list') {
    const projects = loadProjectList();
    if (projects.length === 0) {
      console.log('📋 项目清单为空，先执行扫描：node git-workflow.mjs scan');
      return;
    }
    
    console.log('📋 项目清单：');
    console.log('='.repeat(80));
    console.log('项目ID\t\t类型\t\t版本\t\t状态\t\t路径');
    console.log('-'.repeat(80));
    projects.forEach(p => {
      console.log(`${p.projectId}\t\t${p.type}\t\t${p.version}\t\t${p.status}\t\t${p.path.replace(WORKSPACE_ROOT, '~')}`);
    });
    console.log('='.repeat(80));
    return;
  }
  
  // 命令：scan - 扫描所有项目
  if (args[0] === 'scan') {
    scanAllProjects();
    return;
  }
  
  const noPush = args.includes('--no-push');
  const skipReadmeCheck = args.includes('--skip-readme-check');
  const skipSkillCheck = args.includes('--skip-skill-check');
  const commitMessage = args.filter(a => !['--no-push', '--skip-readme-check', '--skip-skill-check'].includes(a))[0];

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
    
    // 检查README结构是否符合规范
    const readmeValid = checkReadmeStructure();
    if (!readmeValid) {
      console.log('⚠️  README.md 结构不符合规范，建议包含以下章节：');
      console.log('  - # 项目标题');
      console.log('  - ## 🎯 项目说明');
      console.log('  - ## ✨ 核心特性');
      console.log('  - ## 🚀 安装方式');
      console.log('  - ## 📝 更新日志');
      console.log('');
    } else {
      console.log('✅ README.md 结构符合规范');
    }
    console.log('');
  }
  
  // 技能规范检查
  if (!skipSkillCheck && isSkillProject()) {
    console.log('🔍 正在检查技能规范...');
    const skillValid = checkSkillSpecification();
    if (!skillValid) {
      console.log('❌ 技能规范检查未通过，请修复后再提交');
      console.log('如果确认不需要检查，可以使用 --skip-skill-check 跳过此检查。');
      console.log('');
      process.exit(1);
    }
    console.log('✅ 技能规范检查通过');
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
  const projectId = process.cwd().split('/').pop();

  if (!noPush) {
    console.log(`📤 推送到 ${branch}...`);
    
    // 检查网络连通性
    if (!checkGitHubConnectivity()) {
      console.log('⚠️  GitHub网络连接不可用，建议稍后重试或使用 --no-push 只做本地提交');
      process.exit(1);
    }
    
    // 检查本地和远程差异
    const diff = getLocalRemoteDiff(branch);
    if (diff.behind > 0) {
      console.log(`⚠️  本地分支落后远程 ${diff.behind} 个提交，请先拉取最新代码再推送`);
      process.exit(1);
    }
    
    // 带重试推送
    if (!pushWithRetry(branch)) {
      console.log('❌ 推送失败，已尝试3次重试');
      console.log('💡 您可以稍后手动执行：git push origin ' + branch);
      process.exit(1);
    }
    console.log('');

    // 更新项目清单
    updateProjectList({
      projectId,
      lastPushTime: new Date().toISOString(),
      remoteUrl,
      status: '已发布'
    });

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
    
    // 显示差异信息
    if (diff.ahead > 0) {
      console.log('');
      console.log(`本次推送包含 ${diff.ahead} 个新提交`);
    }
  } else {
    console.log('');
    console.log('✅ 提交成功（未推送）！');
    console.log('');
    console.log(`**提交信息：** ${message}`);
    console.log('');
    console.log('**修改的文件：**');
    changedFiles.forEach(file => console.log(`- ${file}`));
    
    // 更新项目清单
    updateProjectList({
      projectId,
      lastBuildTime: new Date().toISOString(),
      status: '已提交未推送'
    });
  }
}

main();
