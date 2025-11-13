# Vercel & Supabase OAuth Configuration

## ✅ Changes Made

### 1. New User Signups Enabled

**Fixed:** Email verification codes now send to **both existing and new users**!

The system automatically creates new users when they enter their email for the first time. No pre-registration required!

### 2. OAuth Redirect URL Fixed for Production

**Fixed:** Google/Apple OAuth now redirects to your Vercel deployment instead of localhost!

Updated `lib/auth.ts` to use production URL in Vercel environment:

```typescript
const redirectUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
  : process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
  : `${window.location.origin}/auth/callback`;
```

---

## 🔧 Required Vercel Configuration

### Step 1: Add Production URL to Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project: `LLMs_FInalProject`
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
NEXT_PUBLIC_APP_URL=https://ll-ms-f-inal-project-7uc834wkf-samuel-parks-projects-e419b87b.vercel.app
```

**OR** Vercel automatically provides `NEXT_PUBLIC_VERCEL_URL` which the code will use first!

### Step 2: Verify All Environment Variables are in Vercel

Make sure these are all set in Vercel:

✅ **Already in Vercel:**

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

⚠️ **Need to add:**

- `NEXT_PUBLIC_SUPABASE_URL` = `https://knikhusdenqbcfkpygce.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key from .env.local)
- `RESEND_API_KEY` = (your Resend key from .env.local)
- `NEXT_PUBLIC_APP_URL` = `https://ll-ms-f-inal-project-7uc834wkf-samuel-parks-projects-e419b87b.vercel.app`

---

## 🔐 Supabase OAuth Redirect Configuration

### Step 3: Update Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `knikhusdenqbcfkpygce`
3. Navigate to: **Authentication** → **URL Configuration**
4. Add these **Site URLs**:

```
http://localhost:3000
https://ll-ms-f-inal-project-7uc834wkf-samuel-parks-projects-e419b87b.vercel.app
```

5. Add these **Redirect URLs**:

```
http://localhost:3000/auth/callback
https://ll-ms-f-inal-project-7uc834wkf-samuel-parks-projects-e419b87b.vercel.app/auth/callback
```

6. Click **Save**

---

## 🍎 Google OAuth Console Configuration

### Step 4: Update Google OAuth Authorized Domains

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add:

```
https://ll-ms-f-inal-project-7uc834wkf-samuel-parks-projects-e419b87b.vercel.app
```

5. Under **Authorized redirect URIs**, add:

```
https://knikhusdenqbcfkpygce.supabase.co/auth/v1/callback
```

(This is your Supabase callback URL, not your app URL)

6. Click **Save**

---

## 🍏 Apple OAuth Configuration (If Using)

### Step 5: Update Apple Services ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to: **Certificates, Identifiers & Profiles** → **Identifiers**
3. Select your Services ID
4. Click **Sign in with Apple** → **Configure**
5. Under **Domains and Subdomains**, add:

```
knikhusdenqbcfkpygce.supabase.co
```

6. Under **Return URLs**, add:

```
https://knikhusdenqbcfkpygce.supabase.co/auth/v1/callback
```

7. Click **Save** → **Continue** → **Save**

---

## 🧪 Testing the Fixes

### Test New User Signup:

1. Go to your Vercel URL
2. Enter a **brand new email** (not in database)
3. Click "Continue"
4. Complete reCAPTCHA
5. ✅ You should receive a verification code email!
6. Enter the code
7. ✅ You're logged in as a new user!

### Test OAuth Redirect:

1. Go to your Vercel URL
2. Click "Google" (or "Apple")
3. Complete OAuth flow
4. ✅ You should be redirected back to your Vercel URL (not localhost!)
5. ✅ Verification code is sent
6. Enter code
7. ✅ You're logged in!

---

## 🚀 Deploy Changes

After adding environment variables:

1. **Redeploy your Vercel project:**

   - Vercel should auto-deploy on git push
   - OR manually redeploy from Vercel dashboard

2. **Test in production:**
   - Visit your Vercel URL
   - Try new user signup
   - Try Google OAuth

---

## 📝 Quick Checklist

- [ ] Add `NEXT_PUBLIC_APP_URL` to Vercel env vars
- [ ] Add all Supabase keys to Vercel env vars
- [ ] Add Resend key to Vercel env vars
- [ ] Update Supabase redirect URLs
- [ ] Update Google OAuth authorized domains
- [ ] (Optional) Update Apple OAuth if using
- [ ] Redeploy Vercel project
- [ ] Test new user signup in production
- [ ] Test OAuth redirect in production

---

## 🎯 What's Fixed

### ✅ New Users Can Sign Up

- No longer restricted to pre-existing database users
- Any email can receive verification codes
- Users automatically created on first verification

### ✅ OAuth Redirects to Production

- Uses `NEXT_PUBLIC_VERCEL_URL` (auto-provided by Vercel)
- Falls back to `NEXT_PUBLIC_APP_URL` if set
- Falls back to `window.location.origin` for local dev
- No more localhost redirects in production!

---

## 🆘 Troubleshooting

### "User not found" error:

- This is now fixed! The code creates new users automatically.
- If you still see this, check the server logs in Vercel.

### OAuth redirects to localhost:

- Make sure `NEXT_PUBLIC_VERCEL_URL` or `NEXT_PUBLIC_APP_URL` is in Vercel
- Redeploy after adding environment variables
- Clear browser cache and try again

### "Redirect URI mismatch" error:

- Check Supabase redirect URLs include your Vercel domain
- Check Google OAuth authorized redirect URIs
- Make sure you saved changes in all consoles

---

Need help? Check:

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/redirect-urls)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
