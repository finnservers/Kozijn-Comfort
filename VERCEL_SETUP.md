# Vercel Deployment Setup Guide

## Critical: Environment Variables Configuration

Your application will NOT work on Vercel until you set up these environment variables in the Vercel dashboard.

### Required Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables and add:

### ✅ Recommended: Gmail SMTP with Custom "From" Address

**This configuration works reliably with Vercel and sends emails appearing as "From: info@kozijncomfort.nl"**

| Variable Name | Value | Example |
|--------------|-------|---------|
| `VITE_MAIL_FROM` | Your business email address | `info@kozijncomfort.nl` |
| `MAIL_PASSWORD` | Gmail App Password | [16-char app password] |
| `MAIL_TO` | Recipient email for orders | `finnservers@gmail.com` |
| `VITE_MAIL_HOST` | Gmail SMTP server | `smtp.gmail.com` |
| `VITE_MAIL_PORT` | Gmail SMTP port | `465` |
| `VITE_MAIL_SECURE` | Use secure connection | `true` |
| `NODE_ENV` | Environment type | `production` |

### 📋 Gmail Setup Steps (Required):

#### Step 1: Add Business Email to Gmail
1. Log into **finnservers@gmail.com**
2. Go to Settings → Accounts and Import
3. Find "Send mail as:" section → Click "Add another email address"
4. Enter: `info@kozijncomfort.nl`
5. Configure SMTP using SiteGround credentials:
   - SMTP Server: `c1120075.sgvps.net`
   - Port: `587`
   - Username: `info@kozijncomfort.nl`
   - Password: `tec#4+211&k6`
6. Verify the email (Gmail will send a code to info@kozijncomfort.nl)

#### Step 2: Get Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in to **finnservers@gmail.com**
3. Enable 2-Step Verification if not already enabled
4. Create app password for "Mail"
5. Copy the 16-character password
6. Use this as `MAIL_PASSWORD` in Vercel

### ⚠️ SiteGround SMTP (Not Recommended for Vercel)

SiteGround SMTP does not work with Vercel due to authentication issues (Error 535). Use Gmail SMTP instead.

<details>
<summary>Click to see SiteGround SMTP config (for reference only)</summary>

| Variable Name | Value |
|--------------|-------|
| `VITE_MAIL_FROM` | `info@kozijncomfort.nl` |
| `MAIL_PASSWORD` | `tec#4+211&k6` |
| `VITE_MAIL_HOST` | `c1120075.sgvps.net` |
| `VITE_MAIL_PORT` | `587` or `465` |
| `VITE_MAIL_SECURE` | `false` or `true` |

**Note:** This configuration will fail with Error 535 on Vercel.
</details>

### How to Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: **Kozijnen Configurator**
3. Click **Settings** in the top menu
4. Click **Environment Variables** in the left sidebar
5. For each variable above:
   - Enter the **Name** (e.g., `VITE_MAIL_FROM`)
   - Enter the **Value** (e.g., `info@kozijncomfort.nl`)
   - Select **All** environments (Production, Preview, Development)
   - Click **Add**

### Important Notes

- ⚠️ Variables with `VITE_` prefix are needed for the frontend build
- ⚠️ Variables without `VITE_` prefix are for backend/serverless functions
- ⚠️ After adding environment variables, you MUST redeploy your application
- ⚠️ Your `.env.local` file is NOT used by Vercel - only the dashboard settings matter

## Redeployment Steps

After setting up environment variables:

### Option 1: Redeploy via Vercel Dashboard
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" is OFF
5. Click **Redeploy**

### Option 2: Redeploy via Git Push
1. Make any small change to your code (or just push the fixes from this session)
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Fix email configuration for Vercel"
   git push
   ```
3. Vercel will automatically redeploy

## 📧 Email Features

The application now sends **TWO emails** for each order:

1. **Customer Confirmation Email:**
   - Sent to: Customer's email address
   - Subject: "Bevestiging van uw aanvraag - Kozijnen Comfort"
   - Content: Friendly confirmation with order summary, what happens next, and contact info
   - Appears from: info@kozijncomfort.nl

2. **Admin Notification Email:**
   - Sent to: finnservers@gmail.com (configured in `MAIL_TO`)
   - Subject: "Nieuwe Orderaanvraag - [Customer Name]"
   - Content: Detailed order information with all product specs and customer details
   - Appears from: info@kozijncomfort.nl

## Verify Email Functionality

After redeployment:

1. Go to your live site: `https://your-app.vercel.app`
2. Configure a product and add to cart
3. Go to checkout and fill in the form
4. Submit the order
5. Check Vercel logs:
   - Go to **Deployments** → Click on latest deployment
   - Click **Functions** tab
   - Find `/api/send-order-email` function
   - Click on it to see logs
   - Look for:
     - ✅ "Email configuration validated"
     - ✅ "Email sent successfully"
     - ❌ Any error messages

## Common Issues & Solutions

### Issue 1: "Email configuration missing"
**Solution:** Environment variables not set in Vercel dashboard. Follow steps above.

### Issue 2: SMTP Connection Timeout
**Possible causes:**
- SiteGround SMTP server blocking Vercel's IP addresses
- Incorrect SMTP credentials
- Port 465 blocked

**Solutions:**
- Contact SiteGround support to whitelist Vercel IP ranges
- Try using port 587 with STARTTLS instead
- Verify SMTP credentials are correct

### Issue 3: SSL/TLS Errors
**Solution:** The code has been updated to use TLSv1.2 instead of deprecated SSLv3.

### Issue 4: API Route Returns HTML Instead of JSON
**Solution:** Fixed in `vercel.json` - API routes now properly routed to serverless functions.

## Testing Email Configuration

To test if SMTP credentials work:

1. Check Vercel function logs for detailed error messages
2. Look for SMTP error codes:
   - `535`: Authentication failed (wrong password)
   - `550`: Mailbox unavailable
   - `ETIMEDOUT`: Connection timeout (firewall/port blocked)
   - `ECONNREFUSED`: Connection refused (wrong host/port)

## Alternative SMTP Providers

If SiteGround SMTP continues to have issues, consider these alternatives:

### Gmail SMTP (Free)
```
VITE_MAIL_HOST=smtp.gmail.com
VITE_MAIL_PORT=465
VITE_MAIL_SECURE=true
MAIL_PASSWORD=[App-specific password]
```
Note: Requires [App Password](https://support.google.com/accounts/answer/185833)

### SendGrid (Free tier: 100 emails/day)
```
VITE_MAIL_HOST=smtp.sendgrid.net
VITE_MAIL_PORT=465
VITE_MAIL_FROM=[verified sender email]
MAIL_PASSWORD=[SendGrid API Key]
```

### Mailgun (Free tier: 100 emails/day)
```
VITE_MAIL_HOST=smtp.mailgun.org
VITE_MAIL_PORT=465
MAIL_PASSWORD=[Mailgun SMTP password]
```

## Support

If issues persist after following this guide:

1. Check Vercel function logs for specific error messages
2. Verify SMTP credentials work by testing with a desktop email client
3. Contact your email provider (SiteGround) about SMTP access from Vercel's servers
4. Consider switching to a cloud email service (SendGrid, Mailgun, etc.)

---

**Last Updated:** 2026-01-27
**Fixes Applied:**
- ✅ Fixed `vercel.json` API routing
- ✅ Updated TLS configuration (SSLv3 → TLSv1.2)
- ✅ Added environment variable validation
- ✅ Improved error logging
- ✅ Increased timeout limits
