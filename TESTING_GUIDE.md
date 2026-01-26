# 🧪 EMAIL TESTING GUIDE

After deployment, test the email functionality using these detailed steps.

---

## PRE-TESTING CHECKLIST

Before testing, confirm:

- [ ] Website is live at https://finno45.sg-host.com/
- [ ] All products load on the configurator page
- [ ] Email accounts created on SiteGround:
  - `info@kozijncomfort.nl` ✅
  - `test@kozijncomfort.nl` ✅ (for testing)
- [ ] Environment variables set on SiteGround
- [ ] Node.js application is running
- [ ] No errors in Node.js Manager logs

---

## TEST 1: BASIC EMAIL SUBMISSION

### Goal: Verify both emails send on form submission

### Step-by-step:

1. **Open the application**
   ```
   https://finno45.sg-host.com/
   ```

2. **Configure a product**
   - Select any product (e.g., window style)
   - Customize options (material, colors, size, glazing)
   - Click **Add to Cart**

3. **Proceed to Checkout**
   - Click **Checkout** or **Order** button
   - You see the checkout form

4. **Fill in ALL required fields** (⚠️ ALL must be filled):
   ```
   E-mailadres:        test@kozijncomfort.nl
   Voornaam:           Test
   Achternaam:         User
   Straat:             Teststraat
   Huisnummer:         123
   Postcode:           1234 AB
   Plaats:             Amsterdam
   Telefoonnummer:     +31612345678
   ```

5. **Leave optional field empty** (optional):
   ```
   Opmerkingen:        (leave blank or add note)
   ```

6. **Verify cart has items**
   - Check: "1 item in cart" or similar indicator

7. **Click INDIENEN (Submit)**

### Expected Result:
```
✅ Screen shows: "Bestelling succesvol ingediend!"
✅ Message: "U ontvangt een bevestigingsmail..."
✅ No error messages
```

### If you see an error:
- Note the error message
- Check all fields are filled (8 required fields)
- Verify at least 1 item in cart
- Try again

---

## TEST 2: VERIFY CUSTOMER CONFIRMATION EMAIL

### Goal: Confirm email arrived in customer inbox with correct content

### Step 1: Access test email inbox

**Option A: Webmail (Recommended)**
1. Go to: https://finno45.sg-host.com/webmail
2. OR: https://webmail.sg-host.com
3. Login:
   - Username: `test@kozijncomfort.nl`
   - Password: (your test email password)

**Option B: Email Client**
- Set up your email client to receive from `test@kozijncomfort.nl`
- Use IMAP/POP settings from SiteGround

### Step 2: Check email arrived

- [ ] Email received within 2 minutes
- [ ] Subject line: `Bevestiging van uw kozijnen-aanvraag - Kozijn Comfort`
- [ ] From address: `info@kozijncomfort.nl`
- [ ] Check Inbox (if not there, check Spam folder)

### Step 3: Verify email content

**Header Section:**
- [ ] Personalized greeting: "Beste Test,"
- [ ] Thank you message in Dutch
- [ ] "Wij hebben uw aanvraag ontvangen"

**Configuration Details Section:**
- [ ] Product type (visible)
- [ ] Material selected (visible)
- [ ] Dimensions: Width x Height (visible)
- [ ] Inside color (visible)
- [ ] Outside color (visible)
- [ ] Glazing type (visible)

**Follow-up Section:**
- [ ] Message: "U hoort binnen 24-48 uur van ons"
- [ ] Company contact information visible:
  - Phone: Visible
  - Email: Visible
  - Website: finno45.sg-host.com

**Footer:**
- [ ] Company name: Kozijn Comfort
- [ ] Professional formatting (not broken HTML)

### If content is missing:
1. Check HTML rendering (email might be showing as text)
2. Switch email view to HTML view
3. If still broken, note what's missing
4. Check server logs for email template errors

---

## TEST 3: VERIFY ADMIN NOTIFICATION EMAIL

### Goal: Confirm email arrived in company inbox with correct customer data

### Step 1: Access admin email inbox

**Option A: Webmail**
1. Go to: https://finno45.sg-host.com/webmail
2. OR: https://webmail.sg-host.com
3. Login:
   - Username: `info@kozijncomfort.nl`
   - Password: (your password)

**Option B: Email Client**
- Check your email client for `info@kozijncomfort.nl`

### Step 2: Check email arrived

- [ ] Email received within 2 minutes
- [ ] Subject line: `Nieuwe configurator-aanvraag - Test User`
- [ ] From address: `info@kozijncomfort.nl`
- [ ] Check Inbox (if not there, check Spam folder)

### Step 3: Verify email content

**Action Alert Section:**
- [ ] Red banner with: "ACTIE VEREIST"
- [ ] Message: "Neem contact op met deze klant binnen 24-48 uur"

**Customer Information Section:**
Table should contain:
- [ ] Voornaam: Test
- [ ] Achternaam: User
- [ ] E-mailadres: test@kozijncomfort.nl
- [ ] Telefoonnummer: +31612345678
- [ ] Straat: Teststraat
- [ ] Huisnummer: 123
- [ ] Postcode: 1234 AB
- [ ] Plaats: Amsterdam

**Configuration Details Section:**
Table should contain:
- [ ] Product type (your selection)
- [ ] Material (your selection)
- [ ] Dimensions (your selection)
- [ ] Inside color (your selection)
- [ ] Outside color (your selection)
- [ ] Glazing type (your selection)

**Customer Notes Section** (if you added remarks):
- [ ] Section visible with your remarks text

**Footer:**
- [ ] Professional formatting
- [ ] Company name: Kozijn Comfort

### If content is missing:
1. Check HTML rendering (email might be showing as text)
2. Switch email view to HTML view
3. Check what specific data is missing
4. Review server logs for errors

---

## TEST 4: VALIDATION TESTING

### Goal: Verify form validation works correctly

### Test 4.1: Missing required field

1. Go back to checkout form: https://finno45.sg-host.com/checkout
2. Add product to cart
3. Fill form but **leave one field empty** (e.g., phone number)
4. Click INDIENEN

**Expected Result:**
```
❌ Error message shows
"Volgende velden zijn verplicht: Telefoonnummer"
Form NOT submitted
```

### Test 4.2: Empty email field

1. Fill entire form
2. **Clear the email field**
3. Click INDIENEN

**Expected Result:**
```
❌ Error message shows
"Volgende velden zijn verplicht: E-mailadres"
Form NOT submitted
```

### Test 4.3: No cart items

1. **Clear your cart** (remove all items)
2. Try to submit any form

**Expected Result:**
```
❌ Error message shows
"Voeg minstens 1 artikel toe aan uw winkelwagen"
Form NOT submitted
```

### Test 4.4: All fields valid

1. Fill ALL 8 required fields
2. Add at least 1 item to cart
3. Click INDIENEN

**Expected Result:**
```
✅ Form submitted successfully
✅ Both emails sent
```

---

## TEST 5: MULTIPLE SUBMISSION TEST

### Goal: Verify system handles multiple submissions without errors

### Steps:

1. **First submission** with test data:
   - Email: `test1@kozijncomfort.nl` (create if needed)
   - Name: Test User 1

2. **Wait 2 minutes**
   - Verify emails arrived

3. **Second submission** with different test data:
   - Email: `test2@kozijncomfort.nl` (create if needed)
   - Name: Test User 2

4. **Wait 2 minutes**
   - Verify new emails arrived

5. **Check both submissions are in admin inbox**
   - Should have 2 separate admin notification emails

**Expected Result:**
```
✅ Multiple submissions work correctly
✅ Each submission generates separate emails
✅ No errors or duplicates
```

---

## TEST 6: ERROR SCENARIOS

### Test 6.1: Invalid email address

1. Fill form
2. Enter invalid email: `notanemail`
3. Click INDIENEN

**Expected Result:**
```
✅ Form submission fails (no emails sent)
❌ Error message about invalid email
```

### Test 6.2: Network timeout

1. Fill form
2. Disconnect internet momentarily
3. Click INDIENEN
4. Reconnect internet

**Expected Result:**
```
❌ Error message about network/server issue
OR: Server retries and eventually succeeds
```

### Test 6.3: Spam folder verification

1. Submit valid form
2. Emails may go to spam folder initially
3. Check spam/junk folder in both inboxes

**Expected Result:**
```
✅ Emails might be in spam (configure SPF/DKIM)
✅ Emails still contain all correct information
```

---

## CHECKLIST: COMPLETE TEST PASS

After running all tests, verify:

### Functionality
- [ ] Test 1: Basic submission - PASSED
- [ ] Test 2: Customer email received - PASSED
- [ ] Test 3: Admin email received - PASSED
- [ ] Test 4: Validation works - PASSED
- [ ] Test 5: Multiple submissions work - PASSED
- [ ] Test 6: Error scenarios handled - PASSED

### Email Quality
- [ ] Customer email has correct subject
- [ ] Customer email has all product details
- [ ] Admin email has correct subject
- [ ] Admin email has all customer details
- [ ] Both emails are professionally formatted
- [ ] Both emails are in Dutch
- [ ] No broken HTML or formatting issues

### Timing
- [ ] Customer emails arrive within 2 minutes
- [ ] Admin emails arrive within 2 minutes
- [ ] No delays or queuing issues
- [ ] Timestamps are accurate

### Error Handling
- [ ] Missing field errors show correctly
- [ ] Empty cart error shows correctly
- [ ] Network errors handled gracefully
- [ ] Error messages are in Dutch

---

## COMMON ISSUES & FIXES

### Issue: Emails go to spam folder

**Cause:** SPF/DKIM not configured

**Fix:**
1. In SiteGround cPanel → Email → Authentication
2. Enable SPF record: `v=spf1 include:siteground.eu ~all`
3. Enable DKIM (usually auto-configured)
4. Wait 24 hours for DNS propagation
5. Test again

### Issue: "SMTP authentication failed"

**Cause:** Wrong password or email account doesn't exist

**Fix:**
1. Verify email account exists: cPanel → Email Accounts
2. Verify password is correct
3. Check Node.js Manager environment variables
4. Restart application

### Issue: "Connection refused" errors

**Cause:** SMTP server not accessible or wrong host

**Fix:**
1. Verify host: `c1120075.sgvps.net` ✅
2. Verify port: `465` ✅
3. Verify SSL/TLS: Enabled ✅
4. Try restarting Node.js app

### Issue: Emails received but missing customer data

**Cause:** Form validation not catching empty fields

**Fix:**
1. Check all 8 fields filled on form
2. Verify server validation in server.js
3. Check server logs for validation errors
4. Restart application

### Issue: "Connection timeout" after 30 seconds

**Cause:** SMTP server slow or connection issues

**Fix:**
1. Check SiteGround status page
2. Try submitting again (might be temporary)
3. Check server logs for SMTP errors
4. Contact SiteGround support if persists

---

## AFTER SUCCESSFUL TESTING

Once all tests pass:

1. **Create real email accounts** (if using test accounts)
   - `info@kozijncomfort.nl` ✅ (already created)
   - Any other team member emails

2. **Update email settings** in SiteGround:
   - Change `MAIL_TO` if needed
   - Add multiple recipients if needed

3. **Monitor going forward**:
   - Check logs daily for first week
   - Test submissions weekly
   - Monitor email delivery

4. **Update support documentation**:
   - Save this guide for future reference
   - Document any customizations made
   - Keep password list secure

---

## TESTING SUMMARY

| Test | Status | Notes |
|------|--------|-------|
| Basic Submission | ✅/❌ | Required fields, cart validation |
| Customer Email | ✅/❌ | Confirmation email received |
| Admin Email | ✅/❌ | Notification email received |
| Validation | ✅/❌ | Error messages shown correctly |
| Multiple Submissions | ✅/❌ | No errors on repeated submissions |
| Error Scenarios | ✅/❌ | Graceful error handling |

**All tests passing?** ✅ Your system is ready for production use!

---

## 💡 TIPS

- Test after 1 hour of deployment (DNS propagation)
- Test at different times of day
- Test from different devices/browsers
- Test with different product configurations
- Save successful email screenshots for records
- Document any issues encountered for future reference
