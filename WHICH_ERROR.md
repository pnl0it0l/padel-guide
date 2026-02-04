# OAuth Error Diagnostic Guide

## Tell me which error you're seeing:

### Error 1: "redirect_uri_mismatch"
**Full message:** "The redirect URI in the request does not match..."

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add EXACTLY:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Click Save
5. Try logging in again (no server restart needed)

---

### Error 2: "invalid_client" or "OAuth client was not found"
**Full message:** "Error 401: invalid_client"

**Fix:**
1. Check your `.env.local` file has the correct credentials
2. Make sure `GOOGLE_CLIENT_ID` ends with `.apps.googleusercontent.com`
3. Make sure `GOOGLE_CLIENT_SECRET` starts with `GOCSPX-`
4. Restart the server: Stop (Ctrl+C) and run `pnpm dev`

---

### Error 3: "Access blocked: This app's request is invalid"
**Full message:** "Access blocked: This app's request is invalid"

**Fix:**
1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Make sure OAuth consent screen is configured
3. If app is in "Testing" mode, add your email as a test user
4. Try again

---

### Error 4: "OAuthSignin" (generic error)
**Shows in URL:** `?error=OAuthSignin`

**Common causes:**
- Missing or incorrect redirect URI
- OAuth consent screen not configured
- Missing authorized JavaScript origins

**Fix:**
1. Add to "Authorized JavaScript origins":
   ```
   http://localhost:3000
   ```
2. Add to "Authorized redirect URIs":
   ```
   http://localhost:3000/api/auth/callback/google
   ```
3. Save and try again

---

### Error 5: Nothing happens when clicking "Sign in"
**No error, button doesn't work**

**Fix:**
1. Open browser console (F12)
2. Look for errors in Console tab
3. Share the error message with me

---

### Error 6: "Configuration" error
**Full message:** Shows configuration issues

**Fix:**
Check that your `.env.local` has all 4 variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here
```

---

## Quick Test

**Can you tell me:**
1. What happens when you click "Sign in with Google"?
2. Do you get redirected to Google?
3. What's the exact error message or URL you see?

**Example answers:**
- "I click the button and nothing happens"
- "I get redirected to Google but then see error X"
- "The page shows: [error message]"
- "The URL changes to: http://localhost:3000/?error=..."

This will help me give you the exact fix!
