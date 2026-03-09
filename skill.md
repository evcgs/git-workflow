---
name: git-workflow
description: Git工作流自动化技能 - 自动化Git提交和推送流程，包含README规范检查、技能质量管控、项目清单管理等功能
category: 开发工具
tags:
  - Git
  - 工作流
  - 自动化
  - 项目管理
  - 开发效率
version: 2.0.0
author: OpenClaw Community
minimum_openclaw_version: 1.0.0
---
# Git Workflow
## 描述
全自动化Git提交和推送工作流技能，包含项目资产管理、质量规范检查、网络稳定性保障等增强功能，帮助开发者规范项目管理流程，提升提交效率。
## 适用场景
适用于所有Git项目的提交、推送、版本管理，特别适合OpenClaw技能/Agent项目的打包发布。
---
## 🎯 核心功能
### 1. 质量管控
- README.md更新强制检查，防止忘记更新文档
- README结构规范自动校验，符合统一模板要求
- 技能项目规范合规性检查，确保可安装、可运行
- 敏感信息扫描，防止API密钥、密码等泄露

### 2. 项目管理
- 工作区项目自动扫描与发现，一键生成项目清单
- 统一项目清单管理，记录所有项目元数据
- 项目状态自动更新（开发中/已提交/已发布）
- 版本号自动管理与升级

### 3. 智能推送
- GitHub网络连通性预检查，网络不好时提前提示
- 推送失败自动重试（最多3次），避免手动操作
- 本地/远程分支差异自动对比，防止冲突
- 网络不可用时自动提示，给出手动解决方案

### 4. 流程标准化
- Conventional Commits提交信息规范，版本追溯清晰
- 更新日志自动生成与维护，按时间倒序排列
- 推送结果自动验证与报告，确保推送完整
- 全流程可追溯、可审计
---
## 🚀 快速开始
### 触发方式
在项目目录下直接使用命令：
```bash
# 提交并推送当前项目
git-workflow "feat: 新增功能"
```

### 支持的命令
```bash
# 1. 提交并推送（自动生成提交信息）
git-workflow

# 2. 指定提交信息提交并推送
git-workflow "feat: 新增项目管理功能"

# 3. 仅本地提交，不推送到远程
git-workflow "fix: 修复网络重试逻辑" --no-push

# 4. 跳过README检查
git-workflow "chore: 调整配置" --skip-readme-check

# 5. 查看项目清单
git-workflow list

# 6. 扫描所有项目
git-workflow scan
```
---
## ⚙️ 配置说明
### 命令参数
| 参数 | 说明 |
|------|------|
| `--no-push` | 仅本地提交，不推送到远程 |
| `--skip-readme-check` | 跳过README更新检查 |
| `--skip-skill-check` | 跳过技能规范检查 |
---
## 📋 典型使用场景
### 1. 技能发布
> 开发完成新技能后，一键提交并发布到GitHub
```bash
git-workflow "feat: release v1.0.0"
```

### 2. 批量项目管理
> 扫描所有项目，查看所有技能/Agent的状态
```bash
git-workflow scan
git-workflow list
```

### 3. 本地开发提交
> 开发过程中本地提交，不需要推送
```bash
git-workflow "fix: 修复登录逻辑" --no-push
```
---
## 🔒 安全机制
### 强制检查项
1. README.md必须更新（可配置跳过）
2. 技能项目必须符合规范（可配置跳过）
3. 本地分支不能落后于远程分支
4. 网络连通性检查通过才会推送
---
## 📝 更新日志
### v2.0.0 (2026-03-09)
- 🌟 新增：项目自动扫描与清单管理功能
- 🌟 新增：README结构规范自动检查
- 🌟 新增：技能项目规范合规性检查
- 🌟 新增：GitHub网络连通性预检查
- 🌟 新增：推送失败自动重试机制
- 🌟 新增：本地/远程分支差异自动对比
- 优化：重构脚本架构，模块化设计
- 优化：提升错误提示友好度

### v1.0.0 (2026-02-28)
- ✅ 基础功能：README.md更新强制检查
- ✅ 基础功能：自动生成规范提交信息
- ✅ 基础功能：一键提交并推送
---
## 🤝 支持
- GitHub仓库：https://github.com/evcgs/git-workflow
- 问题反馈：https://github.com/evcgs/git-workflow/issues
