# Contact Form Email Setup

This guide explains how to configure the email functionality for the contact form.

## Gmail Configuration (Recommended for Development)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Create App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character password

### Step 3: Configure Environment Variables

Add to your `.env.local` file:

```bash
EMAIL_USER="pntrigo@gmail.com"
EMAIL_PASS="your-16-char-app-password"
```

## Production Setup Options

### Option 1: Resend (Recommended)

Resend is a modern email API built for developers.

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key
4. Update `/app/api/contact/route.ts` to use Resend

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "noreply@padelguide.pt",
  to: "pntrigo@gmail.com",
  subject: `[Padel Guide] ${subject}`,
  replyTo: email,
  html: emailHtml,
});
```

### Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Update environment variables:

```bash
SENDGRID_API_KEY="your-sendgrid-api-key"
```

### Option 3: Amazon SES

1. Set up AWS SES
2. Verify your email/domain
3. Configure nodemailer with SES credentials

## Testing

Test the contact form locally:

1. Start development server: `pnpm dev`
2. Navigate to `/contacto`
3. Fill out and submit the form
4. Check your email inbox

## Security Notes

- Never commit `.env.local` to git
- Use App Passwords instead of your actual Gmail password
- For production, use a dedicated email service
- Implement rate limiting to prevent spam (TODO)

## Troubleshooting

### "Less secure app access" error

- Gmail requires App Password with 2FA enabled
- Don't use regular Gmail password

### Emails not sending

- Check EMAIL_USER and EMAIL_PASS in .env.local
- Verify App Password is correct (no spaces)
- Check spam folder

### In production (Vercel)

1. Add environment variables in Vercel dashboard
2. Redeploy after adding variables
3. Check Vercel logs for errors
