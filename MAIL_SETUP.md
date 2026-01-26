# Mail Configuration Setup Guide

This guide explains how to set up email functionality for your Kozijnen Configurator.

## Quick Start

### Step 1: Install Dependencies

```bash
npm install nodemailer dotenv
npm install --save-dev @types/nodemailer
```

### Step 2: Create Environment Variables

Copy `.env.example` to `.env.local` and fill in your mail configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_MAIL_SERVICE=gmail
VITE_MAIL_FROM=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_TO=recipient@example.com
```

### Step 3: Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Find "App passwords"
   - Select Mail and Windows Computer
   - Copy the generated 16-character password
3. **Use that password** in `MAIL_PASSWORD` in `.env.local`

### Step 4: Create Backend API Handler

You need to create a backend endpoint to handle email sending. Here's an example using Express.js:

```javascript
// server.js or api.js
import nodemailer from 'nodemailer';
import { formatOrderForEmail, getEmailTemplate } from './src/utils/mailService.js';

const transporter = nodemailer.createTransport({
  service: process.env.VITE_MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.VITE_MAIL_FROM,
    pass: process.env.MAIL_PASSWORD,
  },
});

app.post('/api/send-order-email', async (req, res) => {
  try {
    const orderData = req.body;

    const mailOptions = {
      from: process.env.VITE_MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Nieuwe orderaanvraag van ${orderData.firstName} ${orderData.lastName}`,
      html: getEmailTemplate(orderData),
      replyTo: orderData.email,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Step 5: Update CheckoutPage Component

Update the `handleSubmit` function in `CheckoutPage.tsx`:

```tsx
import { sendOrderEmail } from '../utils/mailService';

const handleSubmit = async () => {
  try {
    const emailSent = await sendOrderEmail({
      ...formData,
      cartItems: cartItems,
    });

    if (emailSent) {
      alert('Bedankt voor uw aanvraag! We nemen zo snel mogelijk contact met u op.');
      navigate('/overview');
    } else {
      alert('Er was een probleem met het verzenden. Probeer het later opnieuw.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Er was een fout. Probeer het later opnieuw.');
  }
};
```

## Alternative Mail Services

### SendGrid (Cloud Service)

```env
VITE_MAIL_SERVICE=sendgrid
VITE_MAIL_FROM=noreply@yourdomain.com
MAIL_API_KEY=SG.xxxxx
MAIL_TO=recipient@example.com
```

### Custom SMTP Server

```env
VITE_MAIL_HOST=smtp.example.com
VITE_MAIL_PORT=587
VITE_MAIL_USER=your-email@example.com
MAIL_PASSWORD=your-password
VITE_MAIL_FROM=noreply@example.com
MAIL_TO=recipient@example.com
```

## Files Created

1. **`.env.example`** - Template for environment variables
2. **`src/utils/mailService.ts`** - Mail utility functions and templates
3. **`MAIL_SETUP.md`** - This setup guide

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` or actual passwords to version control
- Add `.env.local` to `.gitignore`
- Use app-specific passwords (not your main password)
- For production, use environment management services (Vercel, Netlify, etc.)

## Troubleshooting

### "Less secure app access" error
- Gmail now requires App Passwords instead of your main password
- Follow the Gmail Setup instructions above

### "Error: Invalid login" 
- Check that your email address and password are correct
- Ensure 2FA is enabled on Gmail
- Generate a new App Password

### "ECONNREFUSED"
- Your mail service might not be available
- Check your internet connection
- Verify SMTP host and port are correct

## Next Steps

1. Set up your backend server with the API handler
2. Add `.env.local` to `.gitignore`
3. Test the email functionality
4. Configure for your production mail service
