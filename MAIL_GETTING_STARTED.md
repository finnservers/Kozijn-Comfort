# 📧 Mail Setup Complete - Next Steps

Your mail system is now set up! Follow these steps to get it working:

## Step 1: Configure Gmail (Recommended for Development)

### 1.1 Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. In the left menu, click **"How you sign in to Google"**
3. Enable **2-Step Verification** if not already enabled

### 1.2 Generate App Password
1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. In the left menu, click **"App passwords"** (only appears if 2FA is enabled)
3. Select **Mail** and **Windows Computer**
4. Click **Generate**
5. Copy the 16-character password shown

### 1.3 Update `.env.local`
Edit `.env.local` in your project root:

```env
VITE_MAIL_SERVICE=gmail
VITE_MAIL_FROM=your-gmail@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_TO=your-email@gmail.com
```

Replace:
- `your-gmail@gmail.com` - Your Gmail address
- `xxxx xxxx xxxx xxxx` - The 16-character app password (with spaces)
- `MAIL_TO` - Where order emails will be sent (can be different from FROM)

## Step 2: Run the Mail Server

### Option A: Run Vite + Mail Server Together
```bash
npm run dev:full
```
This starts both the Vite dev server (http://localhost:5173) and mail server (http://localhost:3001)

### Option B: Run Mail Server Only
```bash
npm run server
```
Runs on http://localhost:3001

### Option C: Run Vite Only (for testing)
```bash
npm run dev
```
Runs on http://localhost:5173

## Step 3: Test the Email Functionality

1. Start the servers: `npm run dev:full`
2. Open http://localhost:5173 in your browser
3. Go to Checkout page
4. Fill in the form with test data
5. Click "Bevestig & vraag aan"
6. Check your mail inbox for the order confirmation email

## 🔧 Troubleshooting

### "Invalid login" Error
- ✅ Ensure 2FA is enabled on your Gmail account
- ✅ Generate a new app password (old ones may expire)
- ✅ Use the 16-character password with spaces: `xxxx xxxx xxxx xxxx`
- ✅ Make sure it's an **App Password**, not your main Gmail password

### "ECONNREFUSED" Error
- ✅ Check internet connection
- ✅ Verify Gmail credentials are correct
- ✅ Check that `.env.local` file exists and has correct values

### No email received
- ✅ Check the terminal for error messages
- ✅ Verify `MAIL_TO` email address is correct
- ✅ Check spam/trash folder
- ✅ Allow Gmail to accept app passwords from your location

### "Cannot POST /api/send-order-email"
- ✅ Ensure mail server is running on port 3001
- ✅ Check that server.js started without errors
- ✅ Verify frontend is trying to send to `http://localhost:3001/api/send-order-email`

## 📁 Files Created/Modified

**New Files:**
- `.env.local` - Environment configuration (⚠️ Never commit this!)
- `server.js` - Mail server handler

**Modified Files:**
- `package.json` - Added server scripts and dependencies
- `src/components/CheckoutPage.tsx` - Integrated email sending
- `src/utils/mailService.ts` - Email utilities

**Existing Files:**
- `.env.example` - Template for configuration
- `MAIL_SETUP.md` - Detailed setup guide

## 🚀 Production Deployment

For production, you'll need to:

1. **Deploy the backend server** to a hosting service like:
   - Vercel (recommended)
   - Heroku
   - AWS Lambda
   - DigitalOcean

2. **Update API endpoint** in `src/utils/mailService.ts`:
   ```typescript
   const endpoint = process.env.NODE_ENV === 'production' 
     ? 'https://your-production-api.com/api/send-order-email'
     : 'http://localhost:3001/api/send-order-email';
   ```

3. **Use environment variables** in production:
   - Never hardcode API URLs or credentials
   - Use hosting platform's environment variable settings

## 📚 More Information

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Help](https://support.google.com/accounts/answer/185833)
- [Express.js Documentation](https://expressjs.com/)

---

✅ **Setup Complete!** Your email system is ready to use. Start with `npm run dev:full` and test the checkout form.
