# Supabase Auth Email Setup Guide

## ✅ What Changed

We've switched from a custom email service (Resend/SendGrid) to **Supabase Auth's built-in email service**. This means:

- ✅ **No external email service needed** - Supabase handles everything
- ✅ **No API keys to manage** - Just your Supabase project
- ✅ **Works with any email address** - No domain verification required
- ✅ **Automatic user management** - Users are created automatically
- ✅ **Built-in session management** - Sessions are handled by Supabase

## 🚀 How It Works Now

1. **User enters email** → `sendVerificationCode()` calls `supabase.auth.signInWithOtp()`
2. **Supabase sends 6-digit code** → Email is sent automatically via Supabase's email service
3. **User enters code** → `verifyCode()` calls `supabase.auth.verifyOtp()`
4. **Session created** → Supabase automatically creates a session
5. **User logged in** → AuthContext detects the session and updates user state

## ⚙️ Supabase Configuration

### Step 1: Enable Email Auth in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Providers**
4. Make sure **Email** is enabled (it should be by default)
5. Click on **Email** to configure settings

### Step 2: Configure Email Template to Show Code (REQUIRED)

**IMPORTANT:** By default, Supabase sends a "Magic Link" email. We need to change it to show a 6-digit code instead.

1. Go to **Authentication** → **Email Templates**
2. Click on **"Magic Link"** template (this is the template used for OTP)
3. **Replace the template content** to show the code instead of a link:

   **Find this in the template:**
   ```html
   <a href="{{ .ConfirmationURL }}">Log In</a>
   ```

   **Replace it with:**
   ```html
   <h2>Your Verification Code</h2>
   <p>Enter this code to sign in to Stack:</p>
   <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
     {{ .Token }}
   </div>
   <p style="color: #666;">This code will expire in 10 minutes.</p>
   <p style="color: #666;">If you didn't request this code, you can safely ignore this email.</p>
   ```

4. **Update the subject line** to something like: `"Your Verification Code"` or `"Your Stack Verification Code"`

5. **Save** the template

**Key Changes:**
- Use `{{ .Token }}` to display the 6-digit code
- Remove `{{ .ConfirmationURL }}` (the magic link)
- The code will be a 6-digit number that users enter in your app

**Complete Template Example:**

You can use this complete template in Supabase:

**Subject:** `Your Verification Code`

**Body:**
```html
<h2 style="color: #4A154B;">Your Verification Code</h2>
<p>Enter this code to sign in to Stack:</p>
<div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
  {{ .Token }}
</div>
<p style="color: #666;">This code will expire in 10 minutes.</p>
<p style="color: #666;">If you didn't request this code, you can safely ignore this email.</p>
```

**Important:** Make sure you're editing the **"Magic Link"** template, as that's what `signInWithOtp()` uses.

### Step 3: Configure Email Settings

1. Go to **Settings** → **Auth**
2. Under **Email Auth**, configure:

   - **Enable email confirmations**: Can be disabled for OTP flow
   - **Secure email change**: Optional
   - **OTP Expiry**: Default is 3600 seconds (1 hour) - codes expire after this time

### Step 4: Set Up SMTP (Optional - For Production)

By default, Supabase uses their own SMTP service. For production, you can configure custom SMTP:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP provider (SendGrid, AWS SES, etc.)
3. This is optional - Supabase's default email works fine for development/testing

## 📧 Email Limits

**Free Tier:**
- 3 emails per hour per user
- Unlimited total emails (within reason)

**Pro Tier:**
- Higher limits
- Custom SMTP support

## 🧪 Testing

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Enter any email address (e.g., `rbatra210@gmail.com`)
   - Complete reCAPTCHA
   - Click "Continue"
   - Check your email inbox (and spam folder)
   - Enter the 6-digit code
   - You should be logged in!

3. **Check Supabase Dashboard:**
   - Go to **Authentication** → **Users**
   - You should see the user created automatically
   - Check **Authentication** → **Logs** to see email sending activity

## 🔍 Debugging

### Emails Not Arriving?

1. **Check Spam Folder** - Supabase emails sometimes go to spam initially
2. **Check Supabase Logs**:
   - Go to **Authentication** → **Logs**
   - Look for email sending events
   - Check for any errors

3. **Check Rate Limits**:
   - Supabase limits to 3 emails per hour per user
   - Wait an hour if you've hit the limit

4. **Check Email Template**:
   - Go to **Authentication** → **Email Templates**
   - Make sure the template is enabled

### Code Verification Failing?

1. **Check Code Expiry**:
   - Codes expire after 1 hour (default)
   - Request a new code if expired

2. **Check Server Logs**:
   - Look for `[AUTH]` prefixed logs
   - Check for error messages

3. **Verify Supabase Connection**:
   - Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
   - Restart dev server after changing env vars

## 🆚 Comparison: Custom Email vs Supabase Auth

| Feature | Custom Email (Resend/SendGrid) | Supabase Auth |
|---------|-------------------------------|---------------|
| Setup Complexity | Medium (API keys, domain) | Easy (just enable) |
| Email Service | External service needed | Built-in |
| User Management | Manual | Automatic |
| Session Management | Manual | Automatic |
| Cost | Free tier limits | Free tier included |
| Domain Required | Yes (for production) | No |

## ✅ Benefits of Using Supabase Auth

1. **Simpler Setup** - No external services to configure
2. **Automatic User Management** - Users created automatically
3. **Session Handling** - Sessions managed by Supabase
4. **Security** - Built-in security best practices
5. **Scalability** - Handles scaling automatically

## 🎯 Next Steps

1. **Test with multiple email addresses** - Make sure it works for all users
2. **Customize email template** - Make emails match your brand
3. **Set up custom SMTP** (optional) - For production with your own domain
4. **Monitor usage** - Check Supabase dashboard for email sending stats

---

**You're all set!** 🚀 Your email verification now uses Supabase Auth's built-in email service. No external email service needed!

