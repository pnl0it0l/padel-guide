# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Padel Guide")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in app name: "Padel Guide"
   - Add your email as support email
   - Add authorized domains if needed
   - Save and continue
4. Back to creating OAuth client ID:
   - Application type: "Web application"
   - Name: "Padel Guide Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - Your production URL (e.g., `https://padel-guide.vercel.app`)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-production-url.com/api/auth/callback/google`
5. Click "Create"
6. Copy your Client ID and Client Secret

## Step 4: Create .env.local File

1. In your project root, create a file named `.env.local`
2. Add the following content:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

3. Replace the values:
   - `NEXTAUTH_SECRET`: Generate a random string (you can use: `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID`: Paste your Client ID from Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: Paste your Client Secret from Google Cloud Console

## Step 5: Restart Development Server

After creating `.env.local`, restart your development server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
# or
pnpm dev
```

## Step 6: Test Authentication

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Select your Google account
4. Grant permissions
5. You should be redirected back and see your profile in the header

## Production Deployment

For production (e.g., Vercel):

1. Add environment variables in your hosting platform:
   - `NEXTAUTH_URL`: Your production URL
   - `NEXTAUTH_SECRET`: Same secret or generate a new one
   - `GOOGLE_CLIENT_ID`: Same as development
   - `GOOGLE_CLIENT_SECRET`: Same as development

2. Update Google Cloud Console:
   - Add your production URL to authorized origins
   - Add your production callback URL to authorized redirect URIs

## Troubleshooting

- **Error: redirect_uri_mismatch**: Make sure the redirect URI in Google Cloud Console exactly matches `http://localhost:3000/api/auth/callback/google`
- **Error: invalid_client**: Check that your Client ID and Secret are correct in `.env.local`
- **Session not persisting**: Make sure `NEXTAUTH_SECRET` is set and the server was restarted
