# GitHub Deployment Guide

This guide will help you upload your Kozijnen Configurator project to GitHub.

## Prerequisites

1. **Install Git**
   - Download Git from: https://git-scm.com/download/win
   - Run the installer and follow the setup wizard
   - After installation, restart your terminal/VSCode

2. **Create a GitHub Account**
   - Go to: https://github.com
   - Sign up for a free account if you don't have one

## Step 1: Install Git (If Not Already Installed)

1. Download Git for Windows from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart VSCode after installation

## Step 2: Configure Git

Open a new terminal in VSCode and run these commands (replace with your information):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize Git Repository

In your project directory, run:

```bash
git init
```

## Step 4: Add Files to Git

```bash
git add .
```

This will stage all files except those listed in `.gitignore` (like `.env.local` and `node_modules/`).

## Step 5: Create Initial Commit

```bash
git commit -m "Initial commit: Kozijnen Configurator project"
```

## Step 6: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `kozijnen-configurator` (or your preferred name)
3. Description: "Window and door configurator application"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 7: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kozijnen-configurator.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 8: Verify Upload

1. Go to your GitHub repository URL
2. You should see all your project files
3. Verify that `.env.local` and `node_modules/` are NOT uploaded (they're in `.gitignore`)

## Important Security Notes

✅ **Protected Files (NOT uploaded to GitHub):**
- `.env.local` - Contains your sensitive email credentials
- `node_modules/` - Large dependency folder (can be reinstalled)
- `node_modules.zip` - Backup file

⚠️ **Never commit sensitive information like:**
- Email passwords
- API keys
- Database credentials

## Future Updates

When you make changes to your project:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Deploying to Hosting Services

Once your code is on GitHub, you can deploy to services that support Node.js applications:

### Recommended Hosting Options:

1. **Vercel** (Recommended for React/Vite projects)
   - Go to: https://vercel.com
   - Sign in with GitHub
   - Import your repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

2. **Netlify**
   - Go to: https://netlify.com
   - Sign in with GitHub
   - Import your repository
   - Configure build settings
   - Add environment variables
   - Deploy

3. **Railway**
   - Go to: https://railway.app
   - Sign in with GitHub
   - Deploy from repository
   - Add environment variables
   - Supports Node.js backend

4. **Render**
   - Go to: https://render.com
   - Sign in with GitHub
   - Create new Web Service
   - Connect repository
   - Add environment variables

### Environment Variables for Hosting

When deploying, you'll need to add these environment variables in your hosting platform's dashboard:

```
VITE_EMAIL_USER=your-email@gmail.com
VITE_EMAIL_PASS=your-app-password
VITE_EMAIL_TO=recipient@example.com
```

## Troubleshooting

### Git not recognized
- Make sure Git is installed
- Restart VSCode/terminal after installation
- Check installation: `git --version`

### Authentication Issues
- GitHub may require a Personal Access Token instead of password
- Go to: GitHub Settings → Developer settings → Personal access tokens
- Generate new token with `repo` scope
- Use token as password when pushing

### Large Files Error
- The `.gitignore` file prevents large files from being uploaded
- If you get errors, make sure `node_modules/` is in `.gitignore`

## Next Steps

1. Install Git if not already installed
2. Follow steps 2-7 above
3. Choose a hosting platform (Vercel recommended)
4. Deploy your application
5. Configure environment variables on the hosting platform

## Support

If you encounter issues:
1. Check that Git is properly installed
2. Verify your GitHub credentials
3. Ensure `.gitignore` is working correctly
4. Check that sensitive files are not being committed

---

**Your project is now ready to be uploaded to GitHub!**
