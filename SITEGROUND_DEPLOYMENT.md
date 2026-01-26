# SiteGround Deployment Guide for Kozijnen Configurator

## Overview
This guide explains how to deploy your Kozijnen Configurator application to SiteGround with proper email (SMTP) configuration.

## Prerequisites
- SiteGround hosting account
- Access to cPanel or SiteGround dashboard
- Your domain configured on SiteGround
- Email account created on SiteGround

---

## Step 1: Create Email Account on SiteGround

1. **Log in to your SiteGround cPanel**
2. **Go to Email Management:**
   - Navigate to **Email Accounts** or **Create Email Account**
3. **Create these email addresses:**
   - `noreply@finno45.sg-host.com` (for sending order confirmations)
   - `orders@finno45.sg-host.com` (to receive orders)
4. **Set a strong password** for the email account
5. **Note down the email credentials** - you'll need them in Step 3

---

## Step 2: Update Environment Variables for SiteGround SMTP

Create or update your `.env.local` file with the following SiteGround SMTP configuration:

```env
# SiteGround SMTP Configuration
VITE_MAIL_SERVICE=siteground
VITE_MAIL_HOST=c1120075.sgvps.net
VITE_MAIL_PORT=465
VITE_MAIL_SECURE=true
VITE_MAIL_FROM=noreply@finno45.sg-host.com
MAIL_PASSWORD=your-siteground-email-password
MAIL_TO=orders@finno45.sg-host.com
NODE_ENV=production
```

### Configuration Details:

| Setting | Value | Description |
|---------|-------|-------------|
| **VITE_MAIL_SERVICE** | siteground | Identifies the email service |
| **VITE_MAIL_HOST** | c1120075.sgvps.net | SiteGround SMTP server (provided) |
| **VITE_MAIL_PORT** | 465 | Secure SSL/TLS port (provided) |
| **VITE_MAIL_SECURE** | true | Use SSL encryption |
| **VITE_MAIL_FROM** | noreply@yourdomain.com | Email to send from (must be SiteGround hosted) |
| **MAIL_PASSWORD** | [password] | Password for the email account |
| **MAIL_TO** | orders@yourdomain.com | Where order emails are received |
| **NODE_ENV** | production | Set to production |

---

## Step 3: Update server.js for SiteGround

Your `server.js` is already configured to handle custom SMTP hosts. The current configuration will automatically use the settings from `.env.local`.

**However, ensure your transporter configuration includes:**

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.VITE_MAIL_HOST || 'smtp.gmail.com',
  port: process.env.VITE_MAIL_PORT || 587,
  secure: process.env.VITE_MAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.VITE_MAIL_FROM,
    pass: process.env.MAIL_PASSWORD,
  },
});
```

---

## Step 4: Deploy Your Application to SiteGround

### Option A: Using Git (Recommended)

1. **Initialize a Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to a repository (GitHub, GitLab, etc.)**

3. **In SiteGround Dashboard:**
   - Go to **DevOps** → **Git**
   - Connect your repository
   - Deploy to production

### Option B: Using FTP/SFTP

1. **Build your application:**
   ```bash
   npm run build
   ```

2. **Upload files using FTP:**
   - Upload `dist/` folder contents to `public_html/`
   - Upload `server.js` to root
   - Upload `package.json` and `.env.local` (keep `.env.local` private)

### Option C: Using SiteGround File Manager

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload via SiteGround File Manager:**
   - Create folder structure in `public_html/`
   - Upload `dist/` contents
   - Upload server files

---

## Step 5: Configure Node.js on SiteGround

1. **Access your SiteGround cPanel**
2. **Go to Node.js section:**
   - Navigate to **Node.js Manager** or **Node.js**
3. **Create a new Node.js application:**
   - **Version:** Use Node.js 18+ (recommended)
   - **App mode:** Production
   - **Application root:** `/public_html` or your app directory
   - **Entry point:** `server.js`
   - **Port:** Auto-assigned (usually 3000+)
4. **Start the application**

---

## Step 6: Configure SSL Certificate

1. **In SiteGround cPanel:**
   - Go to **SSL Manager**
   - Install a free Let's Encrypt SSL certificate
   - This is required for secure SMTP connections

---

## Step 7: Set Up Environment Variables on Server

**Important:** Never commit `.env.local` to version control!

### If using Git deployment:

1. **In SiteGround Dashboard:**
   - Go to **Environments**
   - Add environment variables:
     ```
     VITE_MAIL_SERVICE=siteground
     VITE_MAIL_HOST=c1120075.sgvps.net
     VITE_MAIL_PORT=465
     VITE_MAIL_SECURE=true
     VITE_MAIL_FROM=noreply@yourdomain.com
     MAIL_PASSWORD=your-password
     MAIL_TO=orders@yourdomain.com
     NODE_ENV=production
     ```

### If using FTP deployment:

1. **Upload `.env.local` securely:**
   - Ensure it's in the root directory
   - Make sure server can read it

---

## Step 8: Configure Domain & Reverse Proxy

1. **In SiteGround Dashboard:**
   - Go to **SSL & HTTPS**
   - Set up SSL for your domain
2. **Configure reverse proxy** to route requests to your Node.js app:
   - Your Node.js app should be accessible via your domain

---

## Step 9: Test Email Functionality

### Test via cURL or Postman:

```bash
curl -X POST http://yourdomain.com:3001/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "0612345678",
    "firstName": "Test",
    "lastName": "User",
    "street": "Teststraat",
    "houseNumber": "1",
    "postcode": "1234AB",
    "place": "Amsterdam",
    "country": "Netherlands",
    "cartItems": [{"productName": "Test Product", "quantity": 1}]
  }'
```

### Expected Response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

## Troubleshooting

### Email Not Sending?

1. **Check email credentials:**
   - Verify username and password are correct
   - Ensure email account exists on SiteGround

2. **Check port connectivity:**
   - Port 465 should be open on SiteGround
   - Contact SiteGround if blocked

3. **Check logs:**
   - In SiteGround Dashboard → **Logs** → **Error Log**
   - Check Node.js application logs

4. **Test SMTP connection:**
   ```bash
   telnet c1120075.sgvps.net 465
   ```

### Common Issues:

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Verify email credentials in `.env.local` |
| "Connection refused" | Check if port 465 is accessible |
| "SSL certificate error" | Install SSL on SiteGround |
| "Email not received" | Check spam folder, verify recipient email |

---

## Monitoring & Maintenance

1. **Monitor application status:**
   - In SiteGround Dashboard → **Node.js Manager**
   - Check "Running" status

2. **Check logs regularly:**
   - SiteGround Dashboard → **Logs**
   - Monitor for errors

3. **Backup regularly:**
   - Set up daily backups in SiteGround

4. **Update dependencies:**
   ```bash
   npm update
   npm audit fix
   ```

---

## Summary of Changes Needed

1. ✅ Update `.env.local` with SiteGround SMTP settings
2. ✅ Verify `server.js` supports custom SMTP host (already done)
3. ✅ Build and deploy to SiteGround
4. ✅ Configure Node.js application in SiteGround
5. ✅ Set environment variables on production server
6. ✅ Install SSL certificate
7. ✅ Test email functionality

---

## Support

For SiteGround-specific issues:
- Contact SiteGround support: https://www.siteground.com/support
- Their support team can help with Node.js configuration and SMTP issues
