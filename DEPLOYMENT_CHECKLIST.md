# 🚀 SiteGround Deployment Checklist

## ✅ Pre-Deployment Setup

### Email Configuration
- [ ] Create email account on SiteGround (e.g., `noreply@yourdomain.com`)
- [ ] Create another email for receiving orders (e.g., `orders@yourdomain.com`)
- [ ] Note down the email passwords

### Environment Variables Setup
Update your `.env.local` file:
```env
VITE_MAIL_SERVICE=siteground
VITE_MAIL_HOST=c1120075.sgvps.net
VITE_MAIL_PORT=465
VITE_MAIL_SECURE=true
VITE_MAIL_FROM=noreply@finno45.sg-host.com
MAIL_PASSWORD=your-siteground-email-password
MAIL_TO=orders@finno45.sg-host.com
NODE_ENV=production
```

**Important:** Replace:
- `yourdomain.com` with your actual domain
- `noreply@yourdomain.com` with the email address you created
- `your-actual-siteground-email-password` with the email password

### Local Testing
- [ ] Install dependencies: `npm install`
- [ ] Start local server: `npm run dev` and `node server.js` (in another terminal)
- [ ] Test email endpoint works locally
- [ ] Test checkout form sends email

---

## 📦 Building & Deployment

### Build Application
```bash
npm run build
```

### Upload to SiteGround (Choose one method):

#### Method 1: Git Deployment (Recommended)
- [ ] Create GitHub/GitLab repository
- [ ] Push your code
- [ ] Connect via SiteGround DevOps → Git
- [ ] Deploy to production

#### Method 2: FTP Upload
- [ ] Get FTP credentials from SiteGround
- [ ] Upload `dist/` folder to `public_html/`
- [ ] Upload `server.js`
- [ ] Upload `package.json`
- [ ] DO NOT upload `.env.local` (set env vars in dashboard)

#### Method 3: SiteGround File Manager
- [ ] Use SiteGround dashboard file manager
- [ ] Upload files manually

---

## ⚙️ SiteGround Configuration

### In SiteGround Dashboard/cPanel:

#### 1. Node.js Setup
- [ ] Go to **Node.js Manager**
- [ ] Create new application:
  - App root: `/public_html`
  - Entry point: `server.js`
  - Version: 18+ (recommended)
  - Mode: Production
- [ ] Start the application

#### 2. Environment Variables
- [ ] Set in **Environments** or **Node.js Settings**:
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

#### 3. SSL Certificate
- [ ] Go to **SSL Manager**
- [ ] Install Let's Encrypt SSL (free)
- [ ] Enable HTTPS for your domain

#### 4. Domain Configuration
- [ ] Configure domain to point to application
- [ ] Set up SSL redirect (HTTP → HTTPS)

---

## 🧪 Testing

### Test Email Sending
Use cURL or Postman to test:
```bash
curl -X POST https://yourdomain.com/api/send-order-email \
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
    "remarks": "Test order",
    "cartItems": [{"productName": "Test Product", "quantity": 1}]
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Manual Testing
- [ ] Navigate to https://yourdomain.com
- [ ] Go through product configuration
- [ ] Submit order in checkout
- [ ] Check if email received at `orders@yourdomain.com`
- [ ] Check customer received confirmation

---

## 🔍 Troubleshooting

### If Email Not Sending:

1. **Check Node.js logs:**
   - SiteGround Dashboard → Logs → Error Log
   - Look for email service errors

2. **Verify credentials:**
   ```bash
   # On your local machine, test SMTP connection
   telnet c1120075.sgvps.net 465
   ```

3. **Check email account:**
   - Verify email address exists in SiteGround
   - Verify password is correct
   - Check email is not suspended

4. **Common Issues:**
   | Error | Solution |
   |-------|----------|
   | Authentication failed | Verify email password |
   | Connection timeout | Check firewall/port 465 |
   | TLS error | Verify SSL certificate installed |
   | Email not in inbox | Check spam folder |

---

## 📝 Important Notes

### Security
- ✅ Never commit `.env.local` to version control
- ✅ Use strong passwords for email accounts
- ✅ Enable SSL/HTTPS on your domain
- ✅ Regularly backup your database

### Monitoring
- Check logs weekly: SiteGround Dashboard → Logs
- Monitor email delivery success rate
- Set up uptime monitoring for your domain

### Maintenance
- Update npm packages monthly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Test email functionality monthly

---

## 📞 Quick Reference

**SiteGround SMTP Details (Provided):**
- Incoming Server: c1120075.sgvps.net
- IMAP Port: 993
- Outgoing Server: c1120075.sgvps.net
- SMTP Port: 465

**Files Modified:**
- ✅ `server.js` - Updated to support custom SMTP
- ✅ `.env.example` - Updated with SiteGround settings
- ✅ Created `SITEGROUND_DEPLOYMENT.md` - Full deployment guide

**No Changes Needed:**
- `src/utils/mailService.ts` - Already compatible
- `package.json` - All dependencies present
- UI components - No changes needed

---

## ✨ You're Ready!

Once all checklist items are complete, your application will be live on SiteGround with full email functionality. Good luck! 🎉
