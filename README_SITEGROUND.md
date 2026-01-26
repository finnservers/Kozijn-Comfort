# 📊 SiteGround Deployment - Quick Summary

## What You Need to Do

### 1️⃣ **Create Email Accounts on SiteGround**
- Login to cPanel
- Create sending email: `noreply@yourdomain.com`
- Create receiving email: `orders@yourdomain.com`
- Set strong passwords

### 2️⃣ **Update `.env.local`**
Replace placeholders with your SiteGround credentials:

```env
VITE_MAIL_SERVICE=siteground
VITE_MAIL_HOST=c1120075.sgvps.net
VITE_MAIL_PORT=465
VITE_MAIL_SECURE=true
VITE_MAIL_FROM=noreply@yourdomain.com
MAIL_PASSWORD=your-email-password
MAIL_TO=orders@yourdomain.com
NODE_ENV=production
```

### 3️⃣ **Build & Upload**
```bash
npm run build
# Upload dist/ folder to SiteGround public_html/
# Upload server.js to root
# Upload package.json to root
```

### 4️⃣ **Configure on SiteGround Dashboard**
- Go to **Node.js Manager**
- Create new app:
  - Entry point: `server.js`
  - Mode: Production
  - Root: `/public_html`
- Set environment variables (same as `.env.local`)
- Install SSL certificate
- Start application

### 5️⃣ **Test**
- Visit your domain
- Complete an order
- Check email received

---

## 🔗 Configuration Reference

### Email Server Details (Your SiteGround Info)
```
Server:  c1120075.sgvps.net
Port:    465 (SMTP)
Security: SSL/TLS
```

### Environment Variables Needed
```
VITE_MAIL_SERVICE=siteground
VITE_MAIL_HOST=c1120075.sgvps.net
VITE_MAIL_PORT=465
VITE_MAIL_SECURE=true
VITE_MAIL_FROM=[your-email]
MAIL_PASSWORD=[password]
MAIL_TO=[receiving-email]
NODE_ENV=production
```

---

## 📁 Files to Know About

| File | Purpose | Update? |
|------|---------|---------|
| `.env.local` | Your secrets & SiteGround config | ✏️ Yes |
| `server.js` | Backend API server | ✅ Already done |
| `package.json` | Dependencies | ✅ All there |
| `src/utils/mailService.ts` | Email utility functions | ✅ Compatible |
| `.env.example` | Template for env vars | ✅ Updated |

### New Documentation Files Created
- 📖 `SITEGROUND_DEPLOYMENT.md` - Full step-by-step guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Checklist to follow
- 🔧 `SITEGROUND_CONFIG_TEMPLATE.md` - Configuration template

---

## 🎯 Email Flow

```
User submits order
        ↓
React form sends to /api/send-order-email
        ↓
Node.js server (server.js)
        ↓
nodemailer connects to SiteGround SMTP
        ↓
SiteGround sends email from noreply@finno45.sg-host.com
        ↓
Email received at orders@finno45.sg-host.com
```

---

## ⚡ Key Information

### SMTP Server (SiteGround)
- **Host:** c1120075.sgvps.net
- **Port:** 465 (SSL)
- **Security:** SSL/TLS encryption

### Email Addresses to Create
1. **Sending Email:** noreply@yourdomain.com
2. **Receiving Email:** orders@yourdomain.com

### Technologies Used
- **Backend:** Node.js with Express.js
- **Email:** Nodemailer library
- **Server:** SiteGround hosting

---

## ✅ Verification Checklist

Before going live:
- [ ] Email accounts created on SiteGround
- [ ] `.env.local` updated with SiteGround credentials
- [ ] Application builds successfully (`npm run build`)
- [ ] `server.js` updated (✓ already done)
- [ ] Files uploaded to SiteGround
- [ ] Node.js application configured in SiteGround
- [ ] Environment variables set on SiteGround
- [ ] SSL certificate installed
- [ ] Test order sends email successfully
- [ ] Email received in inbox

---

## 🚨 Common Issues & Fixes

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Email not sending | Wrong credentials | Verify password in SiteGround |
| Connection timeout | Port blocked | Contact SiteGround support |
| TLS error | No SSL certificate | Install SSL in SiteGround |
| Auth failed | Wrong email | Verify email exists on SiteGround |
| 404 endpoint error | Server not running | Restart Node.js in SiteGround |

---

## 📞 Support Resources

- **SiteGround Support:** https://www.siteground.com/support (24/7)
- **Documentation:** See `SITEGROUND_DEPLOYMENT.md`
- **Template Config:** See `SITEGROUND_CONFIG_TEMPLATE.md`
- **Checklist:** See `DEPLOYMENT_CHECKLIST.md`

---

## 🎉 That's It!

Your project is ready for SiteGround. The code is already updated to support custom SMTP. Just:
1. Create email accounts
2. Update `.env.local`
3. Deploy to SiteGround
4. Configure Node.js
5. Test

You're all set! 🚀
