# 🚀 GitHub Setup Instructions

## Step 1: Install Git (If Not Already Installed)

### Option A: Using Windows Package Manager (Recommended)
\`\`\`powershell
winget install --id Git.Git -e --source winget
\`\`\`

### Option B: Manual Download
1. Visit: https://git-scm.com/download/win
2. Download the installer
3. Run and use default settings

### Option C: Using Chocolatey
\`\`\`powershell
choco install git
\`\`\`

**After installation:** Close and reopen your terminal

---

## Step 2: Configure Git (First Time Only)

\`\`\`bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
\`\`\`

---

## Step 3: Initialize Repository

\`\`\`bash
# Navigate to project directory
cd c:\Users\915in\Downloads\mock_websites

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Aurora Demo Site with all features"
\`\`\`

---

## Step 4: Connect to GitHub

\`\`\`bash
# Add remote repository
git remote add origin https://github.com/Bdkelp/Aurora_demo_site.git

# Verify remote was added
git remote -v
\`\`\`

---

## Step 5: Push to GitHub

### If Repository is Empty (First Push)
\`\`\`bash
# Push to main branch
git branch -M main
git push -u origin main
\`\`\`

### If Repository Already Has Content
\`\`\`bash
# Pull existing content first
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
\`\`\`

---

## Step 6: Verify Upload

1. Visit: https://github.com/Bdkelp/Aurora_demo_site
2. Verify all files are present:
   - index.html
   - styles.css
   - script.js
   - lang/ folder
   - README.md
   - FEATURE_CHECKLIST.md
   - .gitignore

---

## 🔐 Authentication Options

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use it as password when prompted

### Option 2: GitHub CLI
\`\`\`bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Follow prompts
\`\`\`

### Option 3: SSH Key
\`\`\`bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
\`\`\`

---

## 📝 Future Updates

After making changes to the site:

\`\`\`bash
# Check status
git status

# Add changed files
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
\`\`\`

---

## 🐛 Troubleshooting

### "Git not recognized"
- Restart terminal after installation
- Add Git to PATH: `C:\Program Files\Git\cmd`

### "Permission denied"
- Use Personal Access Token instead of password
- Or set up SSH authentication

### "Failed to push"
- Run: `git pull origin main --rebase`
- Then: `git push`

### "Unrelated histories"
- Run: `git pull origin main --allow-unrelated-histories`
- Resolve any conflicts
- Then: `git push`

---

## ✅ Quick Command Reference

\`\`\`bash
# Check git version
git --version

# Check repository status
git status

# View commit history
git log --oneline

# View remote URL
git remote -v

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View all branches
git branch -a
\`\`\`

---

## 🎯 Next Steps After Upload

1. **Enable GitHub Pages** (if you want to host):
   - Go to repository Settings → Pages
   - Select source: main branch / (root)
   - Save and wait 1-2 minutes
   - Site will be live at: https://bdkelp.github.io/Aurora_demo_site

2. **Add Repository Description**:
   - Click "Edit" next to "About" on repo page
   - Add: "Professional Aurora website template with AI chat assistant"
   - Add topics: `website-template`, `ai-chat`, `responsive-design`, `i18n`

3. **Create Development Branch**:
   \`\`\`bash
   git checkout -b development
   git push -u origin development
   \`\`\`

---

**Ready to push? Let me know once Git is installed and I'll help with the commands!** 🚀
