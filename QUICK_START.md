# 📋 QUICK START: 7-STEP DEPLOYMENT CHECKLIST

**Print this page and check off each step as you complete it!**

---

## STEP 1: BUILD ✅
```
cd "c:\Users\usama\Downloads\Kozijnen Configurator"
npm run build
```
**Verify:** `dist/` folder created with `index.html` inside  
**Time:** 2 minutes

---

## STEP 2: PREPARE FILES ✅
**Upload to SiteGround `/public_html/`:**
- [ ] `dist/` (entire folder)
- [ ] `server.js`
- [ ] `package.json`
- [ ] `package-lock.json`

**DO NOT upload:**
- ❌ `.env.local`
- ❌ `node_modules/`
- ❌ `src/`

**Time:** 5 minutes (via File Manager)

---

## STEP 3: UPLOAD TO SITEGROUND ✅

1. Log into: https://finno45.sg-host.com/cpanel
2. Open: **File Manager**
3. Navigate to: `public_html`
4. Upload the 4 items from Step 2

**Verify:** Files visible in File Manager  
**Time:** 10-15 minutes

---

## STEP 4: CREATE NODE.JS APP ✅

1. In cPanel: **Node.js Manager**
2. Click: **Create Node.js App**
3. Fill in:
   - **Application Root:** `/public_html`
   - **Entry Point:** `server.js`
   - **Application Mode:** Production
   - **Node Version:** 18.x or 20.x

4. Click: **Create**

**Verify:** App created, shows "Stopped" status  
**Time:** 5 minutes

---

## STEP 5: SET ENVIRONMENT VARIABLES ✅

In Node.js Manager, click **Edit**, then add these:

| Variable | Value |
|----------|-------|
| `VITE_MAIL_SERVICE` | `siteground` |
| `VITE_MAIL_HOST` | `c1120075.sgvps.net` |
| `VITE_MAIL_PORT` | `465` |
| `VITE_MAIL_SECURE` | `true` |
| `VITE_MAIL_FROM` | `info@kozijncomfort.nl` |
| `MAIL_PASSWORD` | `tec#4+211&k6` |
| `MAIL_TO` | `info@kozijncomfort.nl` |
| `NODE_ENV` | `production` |

**Click:** **Save**

**Verify:** All 8 variables saved  
**Time:** 3 minutes

---

## STEP 6: START APPLICATION ✅

1. In Node.js Manager
2. Click: **Start**
3. Wait 15 seconds
4. Status should change to: **Running** ✅

**Verify:** Open https://finno45.sg-host.com/ → Website loads  
**Time:** 2 minutes

---

## STEP 7: TEST EMAILS ✅

### Pre-test: Create email accounts
1. cPanel → **Email Accounts**
2. Create: `info@kozijncomfort.nl` (password: `tec#4+211&k6`)
3. Create: `test@kozijncomfort.nl` (any password)
4. Wait 5 minutes

### Test submission:
1. Go to: https://finno45.sg-host.com/
2. Configure product → Add to cart
3. Go to Checkout
4. Fill form with test data:
   ```
   E-mail: test@kozijncomfort.nl
   Voornaam: Test
   Achternaam: User
   Straat: Teststraat
   Huisnummer: 123
   Postcode: 1234 AB
   Plaats: Amsterdam
   Telefoonnummer: 0612345678
   ```
5. Click: **INDIENEN**

### Verify emails:
1. Check `test@kozijncomfort.nl` inbox
   - ✅ Confirmation email received
   - ✅ Contains your product details

2. Check `info@kozijncomfort.nl` inbox
   - ✅ Admin notification received
   - ✅ Contains customer data

**Success message:** "Bestelling succesvol ingediend!"  
**Time:** 5 minutes

---

## ✅ YOU'RE LIVE!

If all checkboxes are ✅, your application is deployed and working!

---

## 🆘 TROUBLESHOOTING QUICK FIXES

| Problem | Fix |
|---------|-----|
| Website blank | Restart Node.js app, wait 30 sec |
| Emails not sending | Verify email accounts created, check environment variables |
| "Cannot find module" | Verify files uploaded to `/public_html/` |
| Page shows error | Check Node.js Manager logs |
| Emails in spam | Normal initially, configure SPF/DKIM |

---

## 📞 RESOURCES

- **Full Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Testing Guide:** See `TESTING_GUIDE.md`
- **SiteGround Support:** support@siteground.com
- **Your domain:** https://finno45.sg-host.com/

---

**Need help?** Check the full guides in your project folder!
