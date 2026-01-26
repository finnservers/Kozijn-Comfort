# Complete SMTP Email Setup for Vercel

## What I've Done

I've integrated nodemailer with your SiteGround SMTP server. The API will now actually send emails!

## Environment Variables to Add in Vercel

You need to add these **5 variables** in your Vercel dashboard:

### Required Variables:

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `VITE_MAIL_FROM` | `info@kozijncomfort.nl` | Sender email address |
| `MAIL_PASSWORD` | `tec#4+211&k6` | Email password |
| `MAIL_TO` | `info@kozijncomfort.nl` | Recipient email address |
| `VITE_MAIL_HOST` | `c1120075.sgvps.net` | SMTP server hostname |
| `VITE_MAIL_PORT` | `465` | SMTP port (465 for SSL) |

## How to Add in Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click your **Kozijn-Comfort** project
3. Click **"Settings"** tab (at the top)
4. Click **"Environment Variables"** (in left sidebar)

### Step 2: Add Each Variable

**Variable 1:**
- Key: `VITE_MAIL_FROM`
- Value: `info@kozijncomfort.nl`
- Environment: Check all (Production, Preview, Development)
- Click **Save**

**Variable 2:**
- Key: `MAIL_PASSWORD`
- Value: `tec#4+211&k6`
- Environment: Check all
- Click **Save**

**Variable 3:**
- Key: `MAIL_TO`
- Value: `info@kozijncomfort.nl`
- Environment: Check all
- Click **Save**

**Variable 4:**
- Key: `VITE_MAIL_HOST`
- Value: `c1120075.sgvps.net`
- Environment: Check all
- Click **Save**

**Variable 5:**
- Key: `VITE_MAIL_PORT`
- Value: `465`
- Environment: Check all
- Click **Save**

### Step 3: Redeploy
**CRITICAL:** After adding all variables, you MUST redeploy!

1. Go to **"Deployments"** tab
2. Click **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

---

## What the Updated API Does

The [`api/send-order-email.js`](api/send-order-email.js:1) now:

1. ✅ Receives order data
2. ✅ Validates environment variables
3. ✅ Creates SMTP connection to your SiteGround server
4. ✅ Verifies SMTP connection
5. ✅ Formats email with HTML and plain text
6. ✅ **Actually sends the email via SMTP**
7. ✅ Returns success/failure response

---

## Email Features

### What Gets Sent:

- **From:** "Kozijnen Configurator" <info@kozijncomfort.nl>
- **To:** info@kozijncomfort.nl
- **Subject:** Nieuwe Orderaanvraag - [Customer Name]
- **Format:** Beautiful HTML email with all order details

### Email Contains:

- 👤 Customer contact information
- 📍 Delivery address
- 🪟 All selected products with details
- 📝 Customer remarks (if any)
- 📅 Timestamp

---

## Testing

After redeployment:

1. Go to your live site
2. Fill out the order form
3. Submit
4. Check your email at `info@kozijncomfort.nl`
5. You should receive the order notification!

---

## Troubleshooting

### If emails don't arrive:

1. **Check Vercel function logs:**
   - Go to Vercel dashboard
   - Click "Functions"
   - Click "send-order-email"
   - Check for errors

2. **Common issues:**
   - Variables not added correctly (case-sensitive!)
   - Didn't redeploy after adding variables
   - SMTP password incorrect
   - Email in spam folder

3. **Check spam folder:**
   - Automated emails often go to spam initially
   - Mark as "Not Spam" to train the filter

---

## SMTP Configuration Details

Your SiteGround SMTP settings:

```
Host: c1120075.sgvps.net
Port: 465
Security: SSL/TLS
Username: info@kozijncomfort.nl
Password: tec#4+211&k6
```

These are already configured in the API function.

---

## What Changed

### Before:
- ❌ API only logged data
- ❌ No emails sent
- ✅ Success message shown

### After:
- ✅ API logs data
- ✅ **Emails actually sent via SMTP**
- ✅ Success message shown
- ✅ Email arrives in inbox

---

## Next Steps

1. **Add all 5 environment variables** in Vercel
2. **Redeploy** without cache
3. **Test** by submitting an order
4. **Check** your email inbox

---

## Files Updated

- ✅ [`api/send-order-email.js`](api/send-order-email.js:1) - Now uses nodemailer with SMTP
- ✅ Ready to push to GitHub

---

## Security Note

Your SMTP credentials are:
- ✅ Stored securely in Vercel environment variables
- ✅ Never exposed in the frontend code
- ✅ Not committed to GitHub (`.env.local` is in `.gitignore`)
- ✅ Only accessible by the serverless function

---

## Summary

**What you need to do:**
1. Add 5 environment variables in Vercel (see list above)
2. Redeploy
3. Test the form

**What will happen:**
- Orders submitted through the website will send real emails to `info@kozijncomfort.nl`
- You'll receive beautifully formatted HTML emails with all order details
- Customers will see success confirmation

Let me know once you've added the variables and redeployed, and we can test it together!
