# 🚀 DEPLOYMENT GUIDE: KOZIJNEN CONFIGURATOR

**Target**: Deploy to SiteGround (finno45.sg-host.com)  
**Domain**: https://finno45.sg-host.com/  
**Email**: info@kozijncomfort.nl  

---

## ⚡ QUICK SUMMARY

| Step | Task | Time |
|------|------|------|
| 1 | Build the project | 2 min |
| 2 | Prepare upload files | 5 min |
| 3 | Upload to SiteGround | 10-15 min |
| 4 | Configure Node.js app | 5 min |
| 5 | Set environment variables | 3 min |
| 6 | Start the application | 2 min |
| 7 | Test email functionality | 5 min |

**Total Time: ~30-35 minutes**

---

## STEP 1: BUILD THE PROJECT

### What this does:
Compiles your React code into optimized files for production

### Commands:

```bash
cd "c:\Users\usama\Downloads\Kozijnen Configurator"
npm run build
```

### What to expect:
✅ New folder created: `dist/`  
✅ Folder structure should look like:
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js (your compiled code)
│   ├── index-xxxxx.css (your styles)
│   └── (other asset files)
└── vite.svg
```

### If you see errors:
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build` shows them clearly
- Don't proceed until ✅ build successful

---

## STEP 2: PREPARE FILES FOR UPLOAD

### Files you MUST upload:

1. **Entire `dist/` folder** (your compiled frontend)
2. **`server.js`** (your backend API server)
3. **`package.json`** (dependency list)
4. **`package-lock.json`** (dependency versions)

### Files you MUST NOT upload:

❌ `.env.local` - Set environment variables directly in SiteGround instead  
❌ `node_modules/` - SiteGround will install this automatically  
❌ `src/` - Source code not needed in production  
❌ `.gitignore`, `.git/` - Not needed  

### Checklist:
```
□ dist/ folder ready (has index.html, assets/, etc.)
□ server.js in root directory
□ package.json in root directory
□ package-lock.json in root directory
```

---

## STEP 3: UPLOAD TO SITEGROUND

### 3.1 Log into SiteGround cPanel

1. Open browser: https://finno45.sg-host.com/cpanel
2. Username: `finno45`
3. Password: (your SiteGround password)

### 3.2 Navigate to File Manager

1. In cPanel, find **File Manager** (or **Files** section)
2. Click to open
3. Find folder: `public_html`
4. **Click into** `public_html` folder

### 3.3 Upload Files

**Option A: Web Upload (Easiest)**

1. In File Manager, inside `public_html`:
   - Right-click → **Upload**
   - Or click **Upload** button

2. Upload these items:
   ```
   📁 dist/          (entire folder with all contents)
   📄 server.js      (single file)
   📄 package.json   (single file)
   📄 package-lock.json (single file)
   ```

3. Wait for upload to complete ✅

**Option B: FTP Upload (If web upload fails)**

1. Use FTP client (like FileZilla, WinSCP)
2. Connect to: `c1120075.sgvps.net`
3. Username: Your SiteGround FTP username
4. Upload same files to `/public_html/` folder

### 3.4 Verify Upload

After upload completes:
```
/public_html/
├── dist/
│   ├── index.html
│   └── assets/
├── server.js
├── package.json
└── package-lock.json
```

✅ If this structure exists, upload is successful!

---

## STEP 4: CONFIGURE NODE.JS APPLICATION

### 4.1 Go to Node.js Manager

1. In SiteGround cPanel, find **Node.js Manager** or **Node.js**
2. Look under: **Software** or **Development** section
3. Click to open

### 4.2 Create New Node.js App

Click **Create Node.js App** or **+ Add Application**

### 4.3 Fill in the Settings

Fill these fields exactly:

| Field | Value |
|-------|-------|
| **Node Version** | 18.x or 20.x (latest recommended) |
| **Application Mode** | Production |
| **Application Root** | `/public_html` |
| **Application URL** | `https://finno45.sg-host.com/api` |
| **Entry Point** | `server.js` |
| **Application Startup File** | `server.js` |

### 4.4 Create Application

Click **Create** button

✅ You should see:
```
Application created successfully
Status: Stopped (next step will start it)
```

---

## STEP 5: SET ENVIRONMENT VARIABLES

### 5.1 Find Environment Variables Section

In Node.js Manager:
1. Find your created application
2. Click **Edit** or **Settings**
3. Look for **Environment Variables** section

### 5.2 Add Each Variable

Add these variables one by one:

```
VITE_MAIL_SERVICE          → siteground
VITE_MAIL_HOST             → c1120075.sgvps.net
VITE_MAIL_PORT             → 465
VITE_MAIL_SECURE           → true
VITE_MAIL_FROM             → info@kozijncomfort.nl
MAIL_PASSWORD              → tec#4+211&k6
MAIL_TO                    → info@kozijncomfort.nl
NODE_ENV                   → production
```

### 5.3 Save Settings

Click **Save** button after entering all variables

✅ Variables are now saved

---

## STEP 6: START THE APPLICATION

### 6.1 Start Node.js App

In Node.js Manager:
1. Find your application
2. Click **Start** button
3. Wait 10-20 seconds for startup

### 6.2 Check Status

Status should change to:
```
Status: Running ✅
```

### 6.3 Verify It's Working

Open your browser:
```
https://finno45.sg-host.com/
```

You should see:
- Your Kozijnen Configurator interface
- Products load
- No error messages

If you see errors:
1. Click **View Logs** in Node.js Manager
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Wrong file paths
   - Port already in use

---

## STEP 7: TEST EMAIL FUNCTIONALITY

### ⚠️ IMPORTANT: Create Email Accounts First

**You MUST create these email accounts on SiteGround BEFORE testing:**

1. In cPanel → **Email Accounts**
2. Create: `info@kozijncomfort.nl`
   - Password: `tec#4+211&k6` (or your choice)
3. Create: `test@kozijncomfort.nl` (for testing)
4. Wait 5-10 minutes for accounts to activate

### 7.1 Test Email Submission

1. Open: https://finno45.sg-host.com/
2. Click **Order** or **Checkout**
3. Fill in the form:
   ```
   E-mailadres:        test@kozijncomfort.nl
   Voornaam:           Test
   Achternaam:         User
   Straat:             Teststraat
   Huisnummer:         123
   Postcode:           1234 AB
   Plaats:             Amsterdam
   Telefoonnummer:     0123456789
   Opmerkingen:        Test order (optional)
   ```

4. Add at least 1 product to cart
5. Click **Indienen** (Submit)

### 7.2 Check for Success Message

You should see:
```
✅ Bestelling succesvol ingediend!
U ontvangt een bevestigingsmail op uw e-mailadres.
```

### 7.3 Verify Emails Arrived

**Check 2 inboxes:**

1. **test@kozijncomfort.nl inbox** (Customer email)
   - Subject: `Bevestiging van uw kozijnen-aanvraag - Kozijn Comfort`
   - Contains: Your order details, product configuration, company contact info
   - Should arrive within 1-2 minutes

2. **info@kozijncomfort.nl inbox** (Admin/Company email)
   - Subject: `Nieuwe configurator-aanvraag - Test User`
   - Contains: Customer details, full configuration, action alert
   - Should arrive within 1-2 minutes

### 7.4 What if Emails Don't Arrive?

**Check these things:**

1. **Spam folder** - Check both email accounts' spam/junk folders
2. **Email accounts exist** - Verify accounts were created in SiteGround
3. **View logs** - In Node.js Manager → View Logs
   - Look for error messages about SMTP
   - Copy error message and check what's wrong

4. **Restart application**:
   - In Node.js Manager → Stop → Wait 5 sec → Start

5. **Test locally first** (optional):
   - On your computer: `npm run dev`
   - Test form submission locally before assuming it's broken

### 7.5 Success Indicators

✅ Both emails received  
✅ Customer email has correct product details  
✅ Admin email has customer information  
✅ Both emails are formatted nicely (not broken HTML)  
✅ Email subjects are in Dutch  

---

## TROUBLESHOOTING

### Problem: Website shows blank page

**Solution:**
1. Check Node.js app is running (Status: Running)
2. View logs for errors
3. Restart application
4. Wait 30 seconds and refresh browser

### Problem: "Cannot find module" errors

**Solution:**
1. Check all files uploaded to `/public_html/`:
   - dist/ folder
   - server.js
   - package.json
   - package-lock.json
2. Verify Entry Point is `server.js`
3. Restart application

### Problem: Emails not sending

**Solution:**
1. Check email accounts exist: cPanel → Email Accounts
2. Verify environment variables are set correctly
3. Check MAIL_PASSWORD is correct
4. Look at application logs for SMTP errors
5. Try restarting the application

### Problem: "Port already in use"

**Solution:**
1. Stop the application
2. Wait 10 seconds
3. Start again

### Problem: CSS/Images not loading

**Solution:**
1. Verify `dist/` folder uploaded completely
2. Check `dist/` has `assets/` subfolder
3. Rebuild locally: `npm run build`
4. Re-upload `dist/` folder

---

## ✅ DEPLOYMENT CHECKLIST

Before considering deployment complete, verify:

- [ ] Ran `npm run build` successfully
- [ ] All files uploaded to `/public_html/`:
  - [ ] dist/ folder with all contents
  - [ ] server.js
  - [ ] package.json
  - [ ] package-lock.json
- [ ] Node.js application created
- [ ] Entry Point set to `server.js`
- [ ] Application Mode set to `Production`
- [ ] All 8 environment variables added
- [ ] Application Status shows "Running"
- [ ] Website loads at https://finno45.sg-host.com/
- [ ] Email accounts created (info@kozijncomfort.nl)
- [ ] Test form submission successful
- [ ] Both emails received (customer + admin)
- [ ] Emails contain correct information
- [ ] No error messages in browser console

---

## 📞 SUPPORT CONTACTS

**SiteGround Support:**
- Website: https://www.siteground.com/support
- Email: support@siteground.com
- Phone: Available in SiteGround account panel

**Common Issues Resources:**
- Node.js troubleshooting: https://www.siteground.com/kb/how-to-install-and-deploy-nodejs-applications/
- Email configuration: https://www.siteground.com/kb/email-setup/

---

## 🎉 AFTER SUCCESSFUL DEPLOYMENT

Once live and working:

1. **Monitor** - Check application logs daily for first week
2. **Test** - Periodically submit test orders to verify emails work
3. **Backup** - Regularly backup your application files
4. **Updates** - Update dependencies monthly: `npm update`
5. **Security** - Run security audit: `npm audit`

---

**Questions?** Refer back to these sections or contact SiteGround support.

**Ready to start?** Begin with **STEP 1: BUILD THE PROJECT**
