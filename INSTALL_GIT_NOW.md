# Install Git - Step by Step

## Step 1: Download Git

1. **Click this link to download Git for Windows:**
   https://git-scm.com/download/win
   
2. The download should start automatically (Git-2.xx.x-64-bit.exe)

## Step 2: Install Git

1. **Run the downloaded installer** (Git-2.xx.x-64-bit.exe)

2. **Installation Settings** (use these recommended settings):
   - ✅ Click "Next" on the welcome screen
   - ✅ Keep default installation location → Click "Next"
   - ✅ Keep default components selected → Click "Next"
   - ✅ Start Menu folder → Click "Next"
   - ✅ Choose default editor: Select "Use Visual Studio Code as Git's default editor" → Click "Next"
   - ✅ Adjusting PATH: Select "Git from the command line and also from 3rd-party software" → Click "Next"
   - ✅ HTTPS transport: "Use the OpenSSL library" → Click "Next"
   - ✅ Line endings: "Checkout Windows-style, commit Unix-style" → Click "Next"
   - ✅ Terminal emulator: "Use MinTTY" → Click "Next"
   - ✅ Keep all other default settings → Click "Next" through remaining screens
   - ✅ Click "Install"

3. **Wait for installation to complete** (takes 1-2 minutes)

4. **Click "Finish"**

## Step 3: Restart VSCode

**IMPORTANT:** Close and reopen VSCode completely for Git to be recognized.

## Step 4: Verify Git Installation

After reopening VSCode, open a new terminal and run:

```bash
git --version
```

You should see something like: `git version 2.xx.x`

## Step 5: Configure Git

Run these commands in the terminal (replace with YOUR information):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Example:
```bash
git config --global user.name "Usama Khan"
git config --global user.email "usama@example.com"
```

## Step 6: Initialize Repository

```bash
git init
```

## Step 7: Stage All Files

```bash
git add .
```

## Step 8: Create First Commit

```bash
git commit -m "Initial commit: Kozijn-Comfort project"
```

## Step 9: Create GitHub Repository

1. **Go to GitHub:** https://github.com/new
2. **Sign in** (or create account if needed)
3. **Repository name:** `kozijn-comfort`
4. **Description:** "Kozijn-Comfort - Window and door configurator application"
5. **Choose:** Public or Private
6. **IMPORTANT:** Do NOT check any boxes (no README, no .gitignore, no license)
7. **Click:** "Create repository"

## Step 10: Connect and Push

After creating the repository, GitHub will show you commands. Copy YOUR repository URL and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kozijn-comfort.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

Example:
```bash
git remote add origin https://github.com/usamakhan/kozijn-comfort.git
git branch -M main
git push -u origin main
```

## Step 11: Verify

1. Go to your GitHub repository URL
2. You should see all your project files
3. ✅ Verify `.env.local` is NOT there (it's protected)
4. ✅ Verify `node_modules/` is NOT there (it's protected)

---

## 🎉 Success!

Your project is now on GitHub!

## Next: Deploy Your Application

After uploading to GitHub, deploy to **Vercel** (recommended):

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your `kozijn-comfort` repository
5. Add environment variables:
   - `VITE_EMAIL_USER` = your email
   - `VITE_EMAIL_PASS` = your app password
   - `VITE_EMAIL_TO` = recipient email
6. Click "Deploy"
7. Your site will be live in 2-3 minutes!

---

## Troubleshooting

**Git still not recognized after install?**
- Make sure you completely closed and reopened VSCode
- Try restarting your computer

**Authentication error when pushing?**
- GitHub may ask for credentials
- Use your GitHub username
- For password, use a Personal Access Token:
  - Go to: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token → Select "repo" scope → Generate
  - Copy the token and use it as your password

**Need help?**
Let me know which step you're on and I'll assist!
