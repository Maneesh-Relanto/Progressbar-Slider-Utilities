# Lighthouse Audit Guide

## 📊 Running Lighthouse Audits

### Prerequisites
Make sure the dev server is running:
```bash
npm run dev
```

### Quick Start

**Option 1: Chrome DevTools (Recommended for Development)**
1. Open http://localhost:5173 in Chrome
2. Press `F12` to open DevTools
3. Click "Lighthouse" tab
4. Select categories to audit
5. Click "Analyze page load"

**Option 2: CLI (Automated Reports)**
```bash
# Run both index and examples pages
npm run lighthouse

# Or individually:
npm run lighthouse:index
npm run lighthouse:examples
```

Reports will be saved to `lighthouse-reports/` and opened automatically.

**Option 3: CI/CD Integration**
```bash
# Build first, then run CI audit
npm run build
npm run preview
# In another terminal:
npm run lighthouse:ci
```

---

## 📈 Score Targets

| Category | Target | Notes |
|----------|--------|-------|
| Performance | ≥ 90 | Fast load times |
| Accessibility | ≥ 95 | WCAG AA compliant |
| Best Practices | ≥ 90 | Security, console errors |
| SEO | ≥ 80 | Search optimization |

---

## 🎯 Common Issues & Fixes

### Performance
- ✅ Already optimized: TypeScript, Vite, tree-shaking
- ⚠️ Consider: Image optimization, lazy loading

### Accessibility
- ✅ Fixed: WCAG contrast ratios
- ✅ Working: ARIA labels, keyboard navigation
- ⚠️ Check: Focus indicators, screen reader testing

### Best Practices
- ✅ Using HTTPS (in production)
- ✅ No console errors
- ✅ Secure dependencies

---

## 🔄 CI/CD Integration

The `lighthouserc.json` config allows automated audits:

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:4173", ...]
    },
    "assert": {
      "preset": "lighthouse:recommended"
    }
  }
}
```

Add to GitHub Actions:
```yaml
- name: Run Lighthouse CI
  run: |
    npm run build
    npm run preview &
    sleep 5
    npm run lighthouse:ci
```

---

## 📝 Report Locations

- `lighthouse-reports/index.html` - Homepage audit
- `lighthouse-reports/examples.html` - Examples gallery audit
- `.lighthouseci/` - CI run artifacts (gitignored)

---

## 🛠️ Tools Installed

- `lighthouse` - Google's auditing tool
- `@lhci/cli` - Lighthouse CI for automation

**Version**: Check with `npx lighthouse --version`
