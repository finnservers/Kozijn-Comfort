# Vercel Environment Variables Setup

## What Are These Variables?

Based on your [`.env.local`](.env.local:1) file, here are your email credentials:

| Variable Name | Value | What It Is |
|---------------|-------|------------|
| `VITE_MAIL_FROM` | `info@kozijncomfort.nl` | Your email address (sender) |
| `MAIL_PASSWORD` | `tec#4+211&k6` | Your email password |
| `MAIL_TO` | `info@kozijncomfort.nl` | Where orders are sent (recipient) |

## How to Add to Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com
2. Click on your project: **Kozijn-Comfort**
3. Click **"Settings"** tab

### Step 2: Add Environment Variables
1. In Settings, click **"Environment Variables"** in the left sidebar
2. Add each variable one by one:

#### Variable 1:
- **Name:** `VITE_MAIL_FROM`
- **Value:** `info@kozijncomfort.nl`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 2:
- **Name:** `MAIL_PASSWORD`
- **Value:** `tec#4+211&k6`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 3:
- **Name:** `MAIL_TO`
- **Value:** `info@kozijncomfort.nl`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

### Step 3: Redeploy
**IMPORTANT:** After adding variables, you MUST redeploy!

1. Go to **"Deployments"** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

---

## Visual Guide

```
Vercel Dashboard
├── Your Project (Kozijn-Comfort)
│   ├── Settings
│   │   └── Environment Variables
│   │       ├── Add: VITE_MAIL_FROM = info@kozijncomfort.nl
│   │       ├── Add: MAIL_PASSWORD = tec#4+211&k6
│   │       └── Add: MAIL_TO = info@kozijncomfort.nl
│   └── Deployments
│       └── Redeploy (without cache)
```

---

## What These Do

### `VITE_MAIL_FROM`
- **Purpose:** The email address that sends the order notifications
- **Your Value:** `info@kozijncomfort.nl`
- **Used For:** "From" field in emails

### `MAIL_PASSWORD`
- **Purpose:** Password for your email account
- **Your Value:** `tec#4+211&k6`
- **Used For:** Authenticating with your email server
- **Security:** This is kept secret on Vercel's servers

### `MAIL_TO`
- **Purpose:** Where order notifications are sent
- **Your Value:** `info@kozijncomfort.nl`
- **Used For:** "To" field in emails (where you receive orders)

---

## After Setup

Once you've added the variables and redeployed:

1. ✅ The error will be gone
2. ✅ Orders will be logged in Vercel function logs
3. ⚠️ Emails still won't be sent (need email service integration)

---

## Why Emails Won't Send Yet

Vercel serverless functions can't send emails directly. You need an email service like:

1. **EmailJS** (Recommended - Free & Easy)
2. **Resend** (Professional)
3. **SendGrid** (Enterprise)

See [`EMAIL_SETUP_VERCEL.md`](EMAIL_SETUP_VERCEL.md:1) for email service setup.

---

## Quick Checklist

- [ ] Go to Vercel dashboard
- [ ] Open your project settings
- [ ] Add `VITE_MAIL_FROM` = `info@kozijncomfort.nl`
- [ ] Add `MAIL_PASSWORD` = `tec#4+211&k6`
- [ ] Add `MAIL_TO` = `info@kozijncomfort.nl`
- [ ] Redeploy without cache
- [ ] Test the form

---

## Testing

After redeployment:
1. Go to your live site
2. Fill out the order form
3. Submit
4. Should see success message (no error)
5. Check Vercel function logs to see the order data

---

## Security Note

⚠️ **Never commit `.env.local` to GitHub!**

Your [`.gitignore`](.gitignore:1) file already protects it, but make sure:
- `.env.local` is in `.gitignore` ✅
- Never share your password publicly ✅
- Only add sensitive data to Vercel dashboard ✅

---

## Need Help?

If you see any errors after adding variables:
1. Check the variable names are exactly correct (case-sensitive)
2. Make sure you redeployed without cache
3. Check Vercel function logs for error messages
4. Let me know the error message

---

## Summary

**Your Email Credentials:**
- Email: `info@kozijncomfort.nl`
- Password: `tec#4+211&k6`
- Server: `c1120075.sgvps.net` (SiteGround)

**Add these 3 variables to Vercel:**
1. `VITE_MAIL_FROM`
2. `MAIL_PASSWORD`
3. `MAIL_TO`

**Then redeploy** and the error will be fixed!
