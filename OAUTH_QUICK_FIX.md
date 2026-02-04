# Quick OAuth Fix Checklist

## ✅ Server Restarted
The development server has been restarted and is now running with your environment variables loaded.

## 🔍 Common OAuthSignin Error Causes

The `error=OAuthSignin` typically means one of these issues:

### 1. Redirect URI Mismatch (Most Common)
**Check in Google Cloud Console:**
- Go to: https://console.cloud.google.com/apis/credentials
- Click on your OAuth 2.0 Client ID
- Under "Authorized redirect URIs", you MUST have EXACTLY:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
  ⚠️ **Important**: 
  - Must be `http://` not `https://`
  - No trailing slash
  - Exact port `:3000`
  - Exact path `/api/auth/callback/google`

### 2. OAuth Consent Screen Not Configured
- Go to: https://console.cloud.google.com/apis/credentials/consent
- Make sure the consent screen is configured
- If in "Testing" mode, add your email as a test user

### 3. Authorized JavaScript Origins
**Also check in Google Cloud Console:**
- Under "Authorized JavaScript origins", add:
  ```
  http://localhost:3000
  ```

## 🧪 Test Now

1. **Open**: http://localhost:3000
2. **Click**: "Sign in with Google"
3. **Expected**: Should redirect to Google login page

## 📋 If Still Not Working

Please check and tell me:
1. What happens when you click "Sign in with Google"?
2. Do you see a Google login page or an error immediately?
3. What's the exact error message?

## 🔧 Quick Fixes

### If you see "redirect_uri_mismatch":
```
The redirect URI in the request: http://localhost:3000/api/auth/callback/google
does not match the ones authorized for the OAuth client.
```
**Fix**: Add the exact URI shown in the error to your Google Cloud Console

### If you see "Access blocked":
**Fix**: Add yourself as a test user in OAuth consent screen

### If nothing happens:
**Fix**: Check browser console for errors (F12 → Console tab)
