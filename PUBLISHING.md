# 📦 Publishing Guide - DeswalTech

This guide explains how to publish DeswalTech to GitHub and npm for easy distribution.

---

## Prerequisites

1. **GitHub Account**
   - Repository: https://github.com/pratikdeswal/deswaltech
   - Access: Owner or Admin permissions

2. **npm Account**
   - Registry: https://www.npmjs.com
   - Verified email
   - 2FA enabled (recommended)

3. **Local Setup**
   - Git configured
   - npm authenticated (`npm login`)
   - All changes committed

---

## Step 1: Prepare for Publishing

### 1.1 Update Version

Edit `package.json`:
```json
{
  "name": "deswaltech",
  "version": "1.0.0",  // Increment: major.minor.patch
  ...
}
```

Version semantics:
- **Major (1.x.x)**: Breaking changes
- **Minor (x.1.x)**: New features, backwards compatible
- **Patch (x.x.1)**: Bug fixes

### 1.2 Update CHANGELOG

Create or update `CHANGELOG.md`:
```markdown
# Changelog

## [1.0.0] - 2025-10-18

### Added
- npx create-deswaltech-app command for easy project initialization
- AI_AGENT_GUIDE.md for AI agents
- Complete documentation for GitHub publishing
- .npmignore for proper package distribution

### Changed
- Simplified installation process
- Updated README with new workflow

### Fixed
- Various bug fixes and improvements
```

### 1.3 Test Package Locally

```bash
# Build the package
npm run build

# Test installation locally
npm pack
npm install -g deswaltech-1.0.0.tgz

# Test create command
npx create-deswaltech-app test-project

# Verify it works
cd test-project
cat AI_AGENT_GUIDE.md
cat .cursorules

# Cleanup
cd ..
rm -rf test-project
npm uninstall -g deswaltech
rm deswaltech-1.0.0.tgz
```

---

## Step 2: Publish to GitHub

### 2.1 Create/Update Repository

```bash
# Initialize git (if not already)
git init

# Add remote
git remote add origin https://github.com/pratikdeswal/deswaltech.git

# Check status
git status
```

### 2.2 Commit and Push

```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: Add npx create-deswaltech-app and improve AI agent experience

- Add npx-compatible initialization script
- Create comprehensive AI_AGENT_GUIDE.md
- Update README with new installation workflow
- Add .npmignore for npm publishing
- Simplify project setup process"

# Push to main branch
git push -u origin main
```

### 2.3 Create GitHub Release

1. Go to https://github.com/pratikdeswal/deswaltech/releases
2. Click "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `DeswalTech v1.0.0 - NPX Installation & AI Agent Experience`
5. Description:
   ```markdown
   ## 🚀 Major Release: NPX Installation & Enhanced AI Experience
   
   ### New Features
   - **NPX Installation**: Create new projects with `npx create-deswaltech-app`
   - **AI Agent Guide**: Comprehensive guide for AI agents in `AI_AGENT_GUIDE.md`
   - **Simplified Setup**: One-command project initialization
   - **Better Documentation**: Clear instructions for both humans and AI
   
   ### Installation
   ```bash
   # Create new project
   npx create-deswaltech-app my-project
   
   # Or add to existing project
   npx create-deswaltech-app .
   ```
   
   ### Documentation
   - [README.md](https://github.com/pratikdeswal/deswaltech#readme)
   - [AI Agent Guide](https://github.com/pratikdeswal/deswaltech/blob/main/AI_AGENT_GUIDE.md)
   - [Complete Guide](https://github.com/pratikdeswal/deswaltech/blob/main/DESWALTECH_COMPLETE_GUIDE.md)
   
   ### Breaking Changes
   None - fully backwards compatible
   
   ### What's Next
   - Enhanced MCP integrations
   - More project templates
   - Improved monitoring dashboard
   ```
6. Click "Publish release"

---

## Step 3: Publish to npm

### 3.1 Login to npm

```bash
# Login to npm
npm login

# Enter credentials:
# - Username
# - Password
# - Email
# - 2FA code (if enabled)

# Verify login
npm whoami
```

### 3.2 Verify Package

```bash
# Check what files will be included
npm pack --dry-run

# Expected files:
# - bin/
# - agents/
# - Infrastructure/
# - mcp-server/
# - Templates/
# - Tools/
# - scripts/
# - *.md files
# - mcp.json
# - railway.json
# - package.json
```

### 3.3 Publish Package

```bash
# Publish to npm (public package)
npm publish --access public

# If you need to publish a specific tag
npm publish --tag beta --access public
npm publish --tag next --access public
```

### 3.4 Verify Publication

```bash
# Check npm registry
npm view deswaltech

# Check on website
# https://www.npmjs.com/package/deswaltech

# Test installation
npx create-deswaltech-app test-verify
cd test-verify
cat AI_AGENT_GUIDE.md
```

---

## Step 4: Post-Publishing

### 4.1 Update Repository

Add npm badge to README:
```markdown
[![npm version](https://badge.fury.io/js/deswaltech.svg)](https://badge.fury.io/js/deswaltech)
[![npm downloads](https://img.shields.io/npm/dm/deswaltech.svg)](https://www.npmjs.com/package/deswaltech)
```

### 4.2 Announce Release

1. **GitHub Discussions**
   - Post in Announcements
   - Explain new features
   - Share installation instructions

2. **Social Media** (if applicable)
   - Twitter/X
   - LinkedIn
   - Dev.to

3. **Community**
   - Discord
   - Slack
   - Forums

---

## Updating Versions

### Patch Release (1.0.1)
Bug fixes, no new features:
```bash
npm version patch
git push --tags
npm publish
```

### Minor Release (1.1.0)
New features, backwards compatible:
```bash
npm version minor
git push --tags
npm publish
```

### Major Release (2.0.0)
Breaking changes:
```bash
npm version major
git push --tags
npm publish
```

---

## Troubleshooting

### Issue: "Package already exists"
- Version not incremented
- Solution: Update version in package.json

### Issue: "You do not have permission"
- Not logged into npm
- Solution: `npm login`

### Issue: "2FA required"
- 2FA enabled on npm account
- Solution: Provide 2FA code when publishing

### Issue: "Files missing in package"
- Check `.npmignore`
- Solution: Remove files from `.npmignore` or update `files` in package.json

### Issue: "npx command not working"
- Bin path incorrect
- Solution: Verify `bin` field in package.json and file permissions

---

## Maintenance

### Regular Updates
1. Monitor issues on GitHub
2. Review pull requests
3. Update dependencies monthly
4. Publish security patches immediately

### Version Strategy
- **Patch (x.x.N)**: Weekly if needed
- **Minor (x.N.0)**: Monthly with new features
- **Major (N.0.0)**: Yearly or with breaking changes

### Documentation
- Keep README up-to-date
- Update CHANGELOG with every release
- Maintain AI_AGENT_GUIDE.md
- Add examples for new features

---

## Security

### Before Publishing
- [ ] No secrets in code (API keys, passwords, tokens)
- [ ] No `.env` files included
- [ ] Dependencies audited (`npm audit`)
- [ ] Security vulnerabilities fixed
- [ ] 2FA enabled on npm account

### After Publishing
- Monitor security advisories
- Respond to security issues within 24 hours
- Publish security patches immediately
- Document security fixes in CHANGELOG

---

## Checklist

Before publishing, ensure:

- [ ] Version incremented in package.json
- [ ] CHANGELOG updated
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No linter errors (`npm run lint`)
- [ ] Package tested locally (`npm pack`)
- [ ] Git committed and pushed
- [ ] GitHub release created
- [ ] npm logged in
- [ ] npm package published
- [ ] Installation verified
- [ ] Documentation updated
- [ ] Badges updated (if needed)

---

## Quick Reference

```bash
# Full publishing workflow
npm version minor              # Increment version
npm run build                  # Build package
npm test                       # Run tests
git add .                      # Stage changes
git commit -m "release: v1.1.0"  # Commit
git push origin main           # Push to GitHub
git tag v1.1.0                 # Create tag
git push --tags                # Push tags
npm publish --access public    # Publish to npm

# Verify
npm view deswaltech
npx create-deswaltech-app test-project
```

---

## Support

If you encounter issues:
- GitHub Issues: https://github.com/pratikdeswal/deswaltech/issues
- npm support: https://www.npmjs.com/support
- Documentation: https://github.com/pratikdeswal/deswaltech#readme

---

**Ready to publish? Follow the checklist and you're good to go!** 🚀

