# Quick Start: Upload to GitHub

## 🚀 Fast Track Commands

### 1. Install Git First
Download and install: https://git-scm.com/download/win
Then restart VSCode.

### 2. Configure Git (One-time setup)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Initialize and Upload
```bash
# Initialize repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Kozijn-Comfort project"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/kozijn-comfort.git
git branch -M main
git push -u origin main
```

## 📋 Step-by-Step Checklist

- [ ] Install Git from https://git-scm.com/download/win
- [ ] Restart VSCode
- [ ] Configure Git with your name and email
- [ ] Run `git init` in your project folder
- [ ] Run `git add .` to stage files
- [ ] Run `git commit -m "Initial commit"`
- [ ] Create new repository on GitHub.com
- [ ] Copy the repository URL
- [ ] Run `git remote add origin YOUR_REPO_URL`
- [ ] Run `git branch -M main`
- [ ] Run `git push -u origin main`
- [ ] Verify files on GitHub

## 🔒 Protected Files

These files are automatically excluded (in `.gitignore`):
- ✅ `.env.local` (your email credentials)
- ✅ `node_modules/` (dependencies)
- ✅ `node_modules.zip` (backup)

## 🌐 Deploy After GitHub Upload

### Vercel (Recommended)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `VITE_EMAIL_USER`
   - `VITE_EMAIL_PASS`
   - `VITE_EMAIL_TO`
6. Click "Deploy"

### Netlify
1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables
7. Click "Deploy"

## 🆘 Common Issues

**"git is not recognized"**
→ Install Git and restart VSCode

**"Permission denied"**
→ Use Personal Access Token instead of password
→ GitHub Settings → Developer settings → Personal access tokens

**"Large files error"**
→ Make sure `.gitignore` exists and contains `node_modules/`

## 📞 Need Help?

See full guide: [`GITHUB_DEPLOYMENT.md`](GITHUB_DEPLOYMENT.md)
