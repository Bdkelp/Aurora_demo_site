# Aurora Demo Site - GitHub Push Script
# Run this after Git is installed

Write-Host "`n🚀 Aurora Demo Site - GitHub Deployment Script`n" -ForegroundColor Cyan

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install Git and restart your terminal`n" -ForegroundColor Yellow
    exit
}

# Check if Git is configured
$userName = git config --global user.name
$userEmail = git config --global user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "⚙️  Git Configuration Required`n" -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    
    git config --global user.name "$name"
    git config --global user.email "$email"
    
    Write-Host "`n✅ Git configured successfully!`n" -ForegroundColor Green
} else {
    Write-Host "✅ Git already configured:" -ForegroundColor Green
    Write-Host "   Name:  $userName" -ForegroundColor White
    Write-Host "   Email: $userEmail`n" -ForegroundColor White
}

# Initialize repository if needed
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Repository initialized`n" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized`n" -ForegroundColor Green
}

# Stage all files
Write-Host "📝 Staging files..." -ForegroundColor Cyan
git add .
$stagedFiles = git diff --cached --name-only | Measure-Object -Line
Write-Host "✅ Staged $($stagedFiles.Lines) files`n" -ForegroundColor Green

# Show what will be committed
Write-Host "📋 Files to be committed:" -ForegroundColor Cyan
git diff --cached --name-status
Write-Host ""

# Create initial commit
$proceed = Read-Host "Create initial commit? (y/n)"
if ($proceed -eq 'y' -or $proceed -eq 'Y') {
    Write-Host "`n💾 Creating commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: Aurora Demo Site with AI Genie and all features"
    Write-Host "✅ Commit created`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Commit skipped. Run 'git commit -m ""your message""' manually`n" -ForegroundColor Yellow
    exit
}

# Check if remote exists
$remoteExists = git remote | Select-String "origin"

if (-not $remoteExists) {
    Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
    git remote add origin https://github.com/Bdkelp/Aurora_demo_site.git
    Write-Host "✅ Remote added: https://github.com/Bdkelp/Aurora_demo_site.git`n" -ForegroundColor Green
} else {
    Write-Host "✅ Remote already configured`n" -ForegroundColor Green
}

# Set main branch
Write-Host "🌿 Setting branch to 'main'..." -ForegroundColor Cyan
git branch -M main
Write-Host "✅ Branch set to main`n" -ForegroundColor Green

# Push to GitHub
Write-Host "🚀 Ready to push to GitHub!`n" -ForegroundColor Magenta
Write-Host "⚠️  IMPORTANT: When prompted for password, use a Personal Access Token!" -ForegroundColor Yellow
Write-Host "   Get one at: GitHub.com → Settings → Developer settings → Personal access tokens`n" -ForegroundColor Gray

$push = Read-Host "Push to GitHub now? (y/n)"
if ($push -eq 'y' -or $push -eq 'Y') {
    Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ SUCCESS! Aurora Demo Site is now on GitHub! 🎉" -ForegroundColor Green
        Write-Host "   View at: https://github.com/Bdkelp/Aurora_demo_site`n" -ForegroundColor Cyan
        
        # Optional: Enable GitHub Pages
        Write-Host "💡 TIP: Enable GitHub Pages to host your site:" -ForegroundColor Yellow
        Write-Host "   1. Go to repository Settings → Pages" -ForegroundColor White
        Write-Host "   2. Select source: main branch / (root)" -ForegroundColor White
        Write-Host "   3. Save and wait 1-2 minutes" -ForegroundColor White
        Write-Host "   4. Site will be live at: https://bdkelp.github.io/Aurora_demo_site`n" -ForegroundColor White
    } else {
        Write-Host "`n❌ Push failed. Common issues:" -ForegroundColor Red
        Write-Host "   • Authentication failed - Use Personal Access Token as password" -ForegroundColor Yellow
        Write-Host "   • Repository not empty - Run: git pull origin main --allow-unrelated-histories" -ForegroundColor Yellow
        Write-Host "   • Network issues - Check your internet connection`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⚠️  Push skipped. Run 'git push -u origin main' when ready`n" -ForegroundColor Yellow
}

Write-Host "📚 For more help, see GITHUB_SETUP.md`n" -ForegroundColor Cyan
