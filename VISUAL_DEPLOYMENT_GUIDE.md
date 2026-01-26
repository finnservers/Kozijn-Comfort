# 🖼️ SiteGround Deployment - Visual Guide

## Step 1: SiteGround cPanel - Email Setup

```
cPanel Dashboard
├── Email Accounts
│   ├── Create Email #1
│   │   ├── Email: noreply@yourdomain.com
│   │   ├── Password: [strong-password-123]
│   │   └── Status: Active ✓
│   │
│   └── Create Email #2
│       ├── Email: orders@yourdomain.com
│       ├── Password: [strong-password-456]
│       └── Status: Active ✓
```

---

## Step 2: Update `.env.local` (On Your Computer)

```
.env.local (NOT on GitHub!)
├── VITE_MAIL_SERVICE=siteground
├── VITE_MAIL_HOST=c1120075.sgvps.net
├── VITE_MAIL_PORT=465
├── VITE_MAIL_SECURE=true
├─ VITE_MAIL_FROM=noreply@finno45.sg-host.com ← Email from Step 1
├─ MAIL_PASSWORD=strong-password-123 ← Password from Step 1
├─ MAIL_TO=orders@finno45.sg-host.com ← Email from Step 1
└── NODE_ENV=production
```

---

## Step 3: Build & Deploy

```
Your Computer
├── npm run build
│   └── Creates: dist/ folder
│
├── Upload to SiteGround:
│   ├── dist/* → public_html/
│   ├── server.js → root
│   └── package.json → root
│
└── (DO NOT upload: .env.local)
```

---

## Step 4: SiteGround Dashboard - Node.js Setup

```
SiteGround Dashboard
├── Node.js Manager
│   └── Create Application
│       ├── App Name: Kozijnen-Configurator
│       ├── Application Root: /public_html
│       ├── Entry Point: server.js
│       ├── Node Version: 18+ (Latest)
│       ├── Mode: Production
│       └── Status: Running ✓
│
├── Environments/Settings
│   ├── VITE_MAIL_SERVICE=siteground
│   ├── VITE_MAIL_HOST=c1120075.sgvps.net
│   ├── VITE_MAIL_PORT=465
│   ├── VITE_MAIL_SECURE=true
│   ├── VITE_MAIL_FROM=noreply@yourdomain.com
│   ├── MAIL_PASSWORD=[password]
│   ├── MAIL_TO=orders@yourdomain.com
│   └── NODE_ENV=production
│
└── SSL Manager
    └── Install Let's Encrypt SSL ✓
```

---

## Step 5: Email Sending Flow

```
┌─────────────────────────────────────────────────┐
│  User's Browser (yourdomain.com)               │
│  ┌───────────────────────────────────┐          │
│  │ Product Configurator              │          │
│  │ ├── Select options                │          │
│  │ └── Submit Order → [Send Button]  │          │
│  └───────────────────────────────────┘          │
└──────────────────┬──────────────────────────────┘
                   │ POST /api/send-order-email
                   │
┌──────────────────▼──────────────────────────────┐
│  Node.js Server (server.js on SiteGround)       │
│  ├── Receive order data                         │
│  ├── Format email template                      │
│  ├── Connect to nodemailer                      │
│  └── Pass to SMTP...                            │
└──────────────────┬──────────────────────────────┘
                   │ Using SiteGround SMTP config
                   │ Host: c1120075.sgvps.net
                   │ Port: 465
                   │ Auth: noreply@yourdomain.com
                   │
┌──────────────────▼──────────────────────────────┐
│  SiteGround SMTP Server                         │
│  (c1120075.sgvps.net:465)                       │
│  ├── Authenticate user                          │
│  ├── Send email FROM noreply@yourdomain.com    │
│  └── Route TO orders@yourdomain.com             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Recipient Email Inbox                          │
│  📧 orders@finno45.sg-host.com                        │
│  ├── Subject: Nieuwe orderaanvraag van...       │
│  ├── Body: Full order details                   │
│  └── Received: ✓                                │
└─────────────────────────────────────────────────┘
```

---

## File Structure After Deployment

```
SiteGround public_html/
├── index.html
├── assets/
├── dist/
│   ├── *.js (bundled)
│   ├── *.css (bundled)
│   └── ...
├── server.js
├── package.json
├── package-lock.json
│   (node_modules/ installed via npm install)
└── .env.local ← Set via Environment Variables
```

---

## Configuration Reference Card

### Copy This Table

| Setting | Value | Where to Get |
|---------|-------|--------------|
| Mail Service | `siteground` | Fixed |
| SMTP Host | `c1120075.sgvps.net` | SiteGround (given) |
| SMTP Port | `465` | SiteGround (given) |
| Use TLS | `true` | Fixed (Port 465) |
| From Email | `noreply@yourdomain.com` | Create in SiteGround |
| Email Password | `[your-password]` | You set it |
| To Email | `orders@yourdomain.com` | Create in SiteGround |
| Environment | `production` | Fixed |

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (React)                       │
│  ├── No sensitive data                  │
│  ├── No passwords stored                │
│  └── Safe to distribute                 │
└────────────┬────────────────────────────┘
             │
             │ HTTPS (SSL Encrypted)
             ▼
┌─────────────────────────────────────────┐
│  Backend (Node.js)                      │
│  ├── Server-side ONLY                   │
│  ├── Passwords hidden                   │
│  ├── .env.local NOT public              │
│  └── nodemailer library (trusted)       │
└────────────┬────────────────────────────┘
             │
             │ SSL/TLS Port 465 (Encrypted)
             ▼
┌─────────────────────────────────────────┐
│  SiteGround SMTP Server                 │
│  ├── Encrypted connection               │
│  ├── Authentication verified            │
│  └── Email sent securely                │
└─────────────────────────────────────────┘
```

---

## Deployment Timeline

```
Day 1:
├── 🔧 Create SiteGround email accounts
├── ✏️ Update .env.local locally
├── ✔️ Test locally (npm run dev)
└── 📦 Run: npm run build

Day 2:
├── 📤 Upload files to SiteGround
├── ⚙️ Configure Node.js in dashboard
├── 📋 Set environment variables
├── 🔒 Install SSL certificate
└── ▶️ Start application

Day 3+:
├── 🧪 Test live email functionality
├── 📊 Monitor logs
├── ✅ Go live!
└── 📞 Monitor for issues
```

---

## Testing the Email Endpoint

```bash
# From your computer, test the API endpoint

curl -X POST https://yourdomain.com/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "phone": "0612345678",
    "firstName": "John",
    "lastName": "Doe",
    "street": "Main Street",
    "houseNumber": "123",
    "postcode": "1234AB",
    "place": "Amsterdam",
    "country": "Netherlands",
    "remarks": "Test message",
    "cartItems": [
      {
        "productName": "Wooden Window",
        "type": "Casement",
        "configuration": "Left opening",
        "width": "600",
        "height": "800",
        "quantity": 1
      }
    ]
  }'

# Expected Success Response:
{
  "success": true,
  "message": "Email sent successfully"
}

# Check logs if it fails:
# SiteGround Dashboard → Logs → Error Log
```

---

## Troubleshooting Decision Tree

```
❌ Email not sending?
│
├─ Check 1: Credentials correct?
│  ├─ YES → Go to Check 2
│  └─ NO → Update .env in SiteGround dashboard
│
├─ Check 2: Server running?
│  ├─ YES → Go to Check 3
│  └─ NO → Restart Node.js app in dashboard
│
├─ Check 3: Port 465 accessible?
│  ├─ YES → Go to Check 4
│  └─ NO → Contact SiteGround support
│
├─ Check 4: SSL certificate installed?
│  ├─ YES → Go to Check 5
│  └─ NO → Install in SSL Manager
│
└─ Check 5: Check application logs
   ├─ SiteGround Dashboard → Logs → Error Log
   └─ Look for nodemailer error messages
```

---

## Success Indicators

✅ You're ready when:
- [ ] SiteGround cPanel shows 2 active emails
- [ ] `.env.local` has all SiteGround values
- [ ] `npm run build` completes without errors
- [ ] Files uploaded to SiteGround
- [ ] Node.js app showing "Running"
- [ ] SSL certificate installed (HTTPS works)
- [ ] Test email sends successfully
- [ ] Email appears in inbox

🎉 **Congratulations! Your site is live!**

---

## 📞 Quick Help

**SiteGround Support:** https://www.siteground.com/support (24/7 available)

**Common Issues Contact:**
- Email not sending → Check credentials + logs
- Connection refused → Check port 465
- 404 error → Check server.js path
- SSL issues → Reinstall certificate

You've got this! 🚀
