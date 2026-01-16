# 📦 Publishing Updates to npm

## Version Management & Release Process

This guide explains how to publish updates when you make code changes to the library.

---

## 🔢 Understanding npm Versioning

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- **MAJOR** (1.0.0): Breaking changes - users need to update code
- **MINOR** (0.1.0): New features - backward compatible
- **PATCH** (0.0.1): Bug fixes - backward compatible

**Current version**: `0.1.0`

---

## 📝 npm Publishing Rules

### **Critical: npm packages are immutable**

❌ **You CANNOT republish the same version**

```bash
# This will FAIL if 0.1.0 already exists
npm publish
# Error: You cannot publish over the previously published versions
```

✅ **You MUST bump the version first**

```bash
npm version patch  # 0.1.0 -> 0.1.1
npm publish        # Now it works
```

---

## 🚀 Publishing Workflow

### Step 1: Make Your Code Changes

```bash
# Edit files in src/
code src/core/stream-progress/StreamProgress.ts

# Run tests
npm test

# Build all packages
npm run build
cd adapters/react && npm run build
cd ../next && npm run build
cd ../..
```

### Step 2: Decide Version Bump Type

**Bug fix?** → Patch (0.1.0 → 0.1.1)

```bash
npm version patch
```

**New feature?** → Minor (0.1.0 → 0.2.0)

```bash
npm version minor
```

**Breaking change?** → Major (0.1.0 → 1.0.0)

```bash
npm version major
```

### Step 3: Update All Package Versions

**Option A: Manual Update**

Edit these files:

- `package.json` (root)
- `adapters/react/package.json`
- `adapters/next/package.json`

Change version in all three:

```json
{
  "version": "0.1.1" // Changed from 0.1.0
}
```

**Option B: Automated Script**

```bash
# Create update-version.sh
#!/bin/bash
NEW_VERSION=$1

# Update all package.json files
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" adapters/react/package.json
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" adapters/next/package.json

echo "Updated to version $NEW_VERSION"
```

Usage:

```bash
bash update-version.sh 0.1.1
```

### Step 4: Update Changelogs

Edit `CHANGELOG.md` in all three packages:

```markdown
## [0.1.1] - 2026-01-16

### Fixed

- Fixed StreamProgress rate calculation
- Improved TypeScript types for ModelLoader

### Added

- New `showETA` prop for QueueProgress
```

### Step 5: Commit Changes

```bash
git add .
git commit -m "chore: bump version to 0.1.1"
git tag v0.1.1
```

### Step 6: Publish to npm

```bash
# Publish core package
npm publish

# Publish React adapter
cd adapters/react
npm publish
cd ../..

# Publish Next.js adapter
cd adapters/next
npm publish
cd ../..
```

### Step 7: Push to GitHub

```bash
git push origin main
git push origin v0.1.1
```

---

## 🔄 Complete Update Script

Create `publish-update.sh`:

```bash
#!/bin/bash

# Check if version provided
if [ -z "$1" ]; then
  echo "Usage: ./publish-update.sh <version>"
  echo "Example: ./publish-update.sh 0.1.1"
  exit 1
fi

NEW_VERSION=$1

echo "🔄 Starting update process for version $NEW_VERSION..."

# 1. Run tests
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Aborting."
  exit 1
fi

# 2. Build all packages
echo "🔨 Building packages..."
npm run build
cd adapters/react && npm run build && cd ../..
cd adapters/next && npm run build && cd ../..

# 3. Update versions
echo "📝 Updating package versions..."
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" adapters/react/package.json
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" adapters/next/package.json

# 4. Git commit
echo "📦 Committing changes..."
git add .
git commit -m "chore: bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

# 5. Publish to npm
echo "🚀 Publishing to npm..."
npm publish
cd adapters/react && npm publish && cd ../..
cd adapters/next && npm publish && cd ../..

# 6. Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
git push origin "v$NEW_VERSION"

echo "✅ Successfully published version $NEW_VERSION!"
echo "📦 Packages available at:"
echo "   https://www.npmjs.com/package/ai-progress-controls"
echo "   https://www.npmjs.com/package/ai-progress-controls-react"
echo "   https://www.npmjs.com/package/ai-progress-controls-next"
```

Usage:

```bash
chmod +x publish-update.sh
./publish-update.sh 0.1.1
```

---

## 👥 How Users Get Updates

### Default Install (Latest Version)

```bash
npm install ai-progress-controls
# Always gets the latest published version
```

### Update Existing Installation

```bash
# Update to latest
npm update ai-progress-controls

# Or reinstall
npm install ai-progress-controls@latest
```

### Version Pinning

Users can pin to specific versions:

```json
{
  "dependencies": {
    "ai-progress-controls": "0.1.0", // Exact version
    "ai-progress-controls-react": "^0.1.0", // Compatible with 0.1.x
    "ai-progress-controls-next": "~0.1.0" // Compatible with 0.1.x patches
  }
}
```

**Caret (^)**: Allows updates that don't change leftmost non-zero digit

- `^0.1.0` allows `0.1.1`, `0.1.2`, but not `0.2.0`
- `^1.0.0` allows `1.1.0`, `1.2.0`, but not `2.0.0`

**Tilde (~)**: Allows patch updates only

- `~0.1.0` allows `0.1.1`, `0.1.2`, but not `0.2.0`

---

## 📊 Checking Version Status

### See All Published Versions

```bash
npm view ai-progress-controls versions
npm view ai-progress-controls-react versions
npm view ai-progress-controls-next versions
```

### Check Current Published Version

```bash
npm view ai-progress-controls version
# Output: 0.1.0
```

### Check Your Local Version

```bash
npm version
# Shows version from package.json
```

---

## ⚠️ Common Issues

### Issue 1: "Cannot publish over existing version"

**Problem**: Trying to publish version that already exists

**Solution**: Bump version first

```bash
npm version patch
npm publish
```

### Issue 2: "402 Payment Required"

**Problem**: Trying to publish scoped package without paid org

**Solution**: Use unscoped package (already done: `ai-progress-controls` not `@ai-progress-controls/core`)

### Issue 3: "403 Forbidden"

**Problem**: Not logged in or don't have publish rights

**Solution**:

```bash
npm login
npm whoami  # Verify login
```

### Issue 4: Dependencies out of sync

**Problem**: React adapter has wrong core version in dependencies

**Solution**: Update `peerDependencies` in adapter package.json:

```json
{
  "peerDependencies": {
    "ai-progress-controls": "^0.1.1" // Match new version
  }
}
```

---

## 📝 Release Checklist

Before publishing updates, verify:

- [ ] All tests passing (`npm test`)
- [ ] All builds successful (`npm run build`)
- [ ] Version bumped in all 3 package.json files
- [ ] CHANGELOG.md updated in all 3 packages
- [ ] No confidential data in code
- [ ] TypeScript types exported correctly
- [ ] Documentation updated if API changed
- [ ] Examples still work
- [ ] Git committed with descriptive message
- [ ] Git tagged with version number

After publishing:

- [ ] Test installation in fresh project
- [ ] Verify packages appear on npmjs.com
- [ ] Check bundle size hasn't increased significantly
- [ ] Update GitHub release notes
- [ ] Announce on social media (if significant update)

---

## 🎯 Version Strategy

### Current Phase: 0.x.x (Pre-1.0)

- **Patch (0.1.x)**: Bug fixes, performance improvements
- **Minor (0.x.0)**: New components, new features
- Major API changes allowed (still experimental)

### After 1.0.0 Launch

- **Patch (1.0.x)**: Bug fixes only
- **Minor (1.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes only

### Recommended Release Cadence

- **Patches**: As needed for critical bugs
- **Minor**: Every 2-4 weeks with features
- **Major**: Only when necessary (breaking changes)

---

## 🔒 Security Updates

For security issues:

1. Fix the vulnerability
2. Bump **patch** version (even if it's a feature)
3. Publish immediately
4. Add `[Security]` tag in CHANGELOG
5. Consider publishing security advisory on GitHub

---

## 📚 Additional Resources

- **[Semantic Versioning](https://semver.org/)** - Official SemVer spec
- **[npm version command](https://docs.npmjs.com/cli/v10/commands/npm-version)** - Documentation
- **[npm publish command](https://docs.npmjs.com/cli/v10/commands/npm-publish)** - Documentation
- **[Package lifecycle](https://docs.npmjs.com/cli/v10/using-npm/scripts)** - npm scripts
