# OAuth Troubleshooting - Error 401: invalid_client

## What This Error Means

The error "OAuth client was not found" (Error 401: invalid_client) means one of the following:

1. ✗ The `.env.local` file doesn't have the correct Google OAuth credentials
2. ✗ The credentials are incorrect or incomplete
3. ✗ The development server wasn't restarted after adding credentials
4. ✗ The Google Cloud Console project isn't configured correctly

## Quick Fix Steps

### Step 1: Verify Your `.env.local` File

Your `.env.local` file should look like this:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-actual-secret-here

GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-here
```

**Check:**
- [ ] File is named exactly `.env.local` (not `.env.local.txt` or `.env.local.example`)
- [ ] `GOOGLE_CLIENT_ID` starts with numbers and ends with `.apps.googleusercontent.com`
- [ ] `GOOGLE_CLIENT_SECRET` starts with `GOCSPX-`
- [ ] No quotes around the values
- [ ] No spaces around the `=` sign

### Step 2: Get Google OAuth Credentials

If you haven't set up Google OAuth yet:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name: "Padel Guide"
   - Click "Create"

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External"
   - App name: "Padel Guide"
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

4. **Create OAuth Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Padel Guide Web"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click "Create"
   - **COPY** your Client ID and Client Secret

5. **Update `.env.local`**
   - Paste the Client ID and Client Secret
   - Generate a secret: Run in PowerShell:
     ```powershell
     -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
     ```
   - Or use any random 32+ character string

### Step 3: Restart Development Server

**IMPORTANT:** You MUST restart the server after changing `.env.local`

```bash
# In your terminal, press Ctrl+C to stop the server
# Then restart:
pnpm dev
```

### Step 4: Test Again

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Should redirect to Google login

## Common Issues

### Issue: "redirect_uri_mismatch"
**Solution:** Make sure the redirect URI in Google Cloud Console is EXACTLY:
```
http://localhost:3000/api/auth/callback/google
```
(No trailing slash, must be http not https for localhost)

### Issue: "Access blocked: This app's request is invalid"
**Solution:** 
- Make sure OAuth consent screen is configured
- Add yourself as a test user if the app is in testing mode

### Issue: Still getting "invalid_client"
**Solution:**
1. Double-check Client ID and Secret have no extra spaces
2. Make sure you copied the FULL Client ID (should be long)
3. Verify the `.env.local` file is in the project root
4. Restart the dev server

## Need Help?

If you're still stuck, check:
1. Is the `.env.local` file in the correct location? (project root: `d:\01-Projects\padel-guide\.env.local`)
2. Did you restart the development server after creating/editing `.env.local`?
3. Are there any typos in the environment variable names?

## Quick Test

Run this command to check if environment variables are loaded:

```powershell
# This should show your variables (without values for security)
Get-Content .env.local
```

The file should have 4 lines with no placeholder text like "your-google-client-id-here".
