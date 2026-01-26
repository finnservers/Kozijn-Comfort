# SiteGround SMTP Configuration Template

This file contains the exact configuration you need for SiteGround deployment.

## 📋 Quick Copy-Paste Configuration

Replace the values in brackets `[]` with your actual information.

### `.env.local` for SiteGround (Production)

```env
# ========================================
# SiteGround SMTP Configuration
# ========================================

# Mail Service Configuration
VITE_MAIL_SERVICE=siteground
VITE_MAIL_HOST=c1120075.sgvps.net
VITE_MAIL_PORT=465
VITE_MAIL_SECURE=true

# Email Credentials
# Replace with the email address you created on SiteGround
VITE_MAIL_FROM=noreply@finno45.sg-host.com

# Replace with the password for the above email account
MAIL_PASSWORD=[your-siteground-email-password]

# Email to receive orders
# Replace with the email address that will receive order emails
MAIL_TO=orders@finno45.sg-host.com

# Environment
NODE_ENV=production
PORT=3001
```

---

## 🔧 Step-by-Step SiteGround Email Setup

### Step 1: Create Sending Email Account
1. Log in to SiteGround cPanel
2. Go to **Email Accounts**
3. Create a new email: `noreply@finno45.sg-host.com`
4. Set password: `[your-siteground-email-password]`
5. Copy this email to `VITE_MAIL_FROM` in `.env.local`

### Step 2: Create Receiving Email Account (Optional)
1. Create another email account: `orders@finno45.sg-host.com`
2. This is where order confirmations will be sent
3. Copy this email to `MAIL_TO` in `.env.local`

### Step 3: Update `.env.local`
Replace these values in your `.env.local`:

```env
VITE_MAIL_FROM=noreply@finno45.sg-host.com
MAIL_PASSWORD=[Password for that email]
MAIL_TO=orders@finno45.sg-host.com
```

**Example:**
```env
VITE_MAIL_FROM=noreply@finno45.sg-host.com
MAIL_PASSWORD=MySecurePassword123!
MAIL_TO=orders@finno45.sg-host.com
```

---

## 📤 SiteGround SMTP Server Details

| Setting | Value | Notes |
|---------|-------|-------|
| **Service** | SiteGround | Email provider |
| **SMTP Host** | c1120075.sgvps.net | Outgoing server |
| **SMTP Port** | 465 | Secure SSL port |
| **Security** | SSL/TLS | Encrypted connection |
| **IMAP Host** | c1120075.sgvps.net | Incoming server (for reference) |
| **IMAP Port** | 993 | Secure IMAP port (for reference) |

---

## 🔐 Email Account Password Requirements

SiteGround typically requires:
- Minimum 8 characters
- Mix of uppercase and lowercase letters
- At least one number
- At least one special character

**Good password example:** `Kozijnen2025!Config`

---

## ✅ Deployment Configuration Files

### Files that need updating:
- ✅ `.env.local` - Update with SiteGround credentials
- ✅ `server.js` - Already updated ✓
- ✅ `.env.example` - Already updated ✓

### Files that don't need changes:
- ✅ `package.json` - All dependencies present
- ✅ `src/utils/mailService.ts` - Already compatible
- ✅ All React components - No changes needed

---

## 🚀 Deployment Command

Once `.env.local` is configured:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build the application
npm run build

# 3. Upload to SiteGround (via Git or FTP)
# Follow instructions in SITEGROUND_DEPLOYMENT.md

# 4. Configure Node.js in SiteGround dashboard
# Set environment variables and start application

# 5. Test email functionality
# Use the test endpoint provided in SITEGROUND_DEPLOYMENT.md
```

---

## 📧 Testing Your Configuration

### Test Email Endpoint

Once deployed on SiteGround, test with:

```bash
curl -X POST https://yourdomain.com/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@example.com",
    "phone": "0612345678",
    "firstName": "Test",
    "lastName": "Customer",
    "street": "Main Street",
    "houseNumber": "123",
    "postcode": "1234AB",
    "place": "Amsterdam",
    "country": "Netherlands",
    "remarks": "This is a test order",
    "cartItems": [
      {
        "productName": "Wooden Window",
        "type": "Sliding",
        "quantity": 1
      }
    ]
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

## ⚠️ Important Security Notes

### DO NOT:
- ❌ Commit `.env.local` to GitHub
- ❌ Share your `MAIL_PASSWORD` with anyone
- ❌ Use weak passwords for email accounts
- ❌ Leave `.env.local` in publicly accessible folders

### DO:
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use strong, unique passwords
- ✅ Set environment variables on SiteGround dashboard
- ✅ Regularly change email passwords
- ✅ Enable SSL/HTTPS on your domain
- ✅ Keep a backup of your configuration

---

## 🆘 Troubleshooting

### Email Not Sending?

**Check 1: Verify credentials**
```
Email: noreply@yourdomain.com (or your sending email)
Password: [password you set in SiteGround]
Server: c1120075.sgvps.net
Port: 465
```

**Check 2: Verify .env.local**
```bash
# On SiteGround, check if environment variables are set:
# 1. Go to Node.js Manager
# 2. View Application Settings
# 3. Verify all environment variables are present
```

**Check 3: Check logs**
```
SiteGround Dashboard → Logs → Error Log
Look for email-related errors
```

**Check 4: Test SMTP connection**
```bash
# From your computer:
telnet c1120075.sgvps.net 465
# Should connect successfully
```

---

## 📞 SiteGround Support

If you encounter issues:
- **SiteGround Help:** https://www.siteground.com/support
- **Live Chat:** Available 24/7
- **Email:** support@siteground.com

Provide them with:
- Domain name
- Error message from logs
- Configuration details (server, port, etc.)

---

## ✨ Next Steps

1. **Read:** `SITEGROUND_DEPLOYMENT.md` - Full deployment guide
2. **Prepare:** Gather your SiteGround credentials
3. **Configure:** Update `.env.local` with SiteGround settings
4. **Test:** Test locally with `npm run dev`
5. **Build:** Run `npm run build`
6. **Deploy:** Upload to SiteGround
7. **Configure:** Set up Node.js in SiteGround dashboard
8. **Test:** Test email functionality on live site
9. **Monitor:** Check logs and email delivery

You're all set! Good luck with your deployment! 🚀
