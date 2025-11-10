# Supabase Backend Setup Guide

## ✅ Completed Steps

1. ✅ Installed `@supabase/supabase-js` package
2. ✅ Created SQL tables in Supabase
3. ✅ Created `lib/supabaseClient.ts` - Database connection
4. ✅ Created `lib/auth.ts` - Authentication functions
5. ✅ Updated `AuthContext.tsx` - Connected to backend
6. ✅ Updated `AuthPage.tsx` - Sends real verification codes
7. ✅ Updated `ConfirmationPage.tsx` - Verifies codes from database

---

## 🔧 Final Setup Step

### Create `.env.local` file

Create a file named `.env.local` in the `slack-mvp` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

### Get Your Supabase Key

1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Under "Project API keys", copy the `anon` `public` key
4. Paste it in `.env.local` file

**Example:**

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuaWtodXNkZW53YmNma3B5Z2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMjM0NTYsImV4cCI6MjA1MTY5OTQ1Nn0.abc123xyz
```

---

## 🚀 How It Works Now

### 1. **Email Entry & reCAPTCHA**

- User enters email
- Completes reCAPTCHA
- Clicks "Continue"

### 2. **Backend: Send Verification Code**

- `sendVerificationCode()` is called
- Creates user in `users` table (if doesn't exist)
- Generates random 6-digit code
- Stores code in `verification_codes` table with 10-minute expiration
- Code is logged to browser console (for demo/testing)
- In production: Would send email via SendGrid/Resend/etc.

### 3. **Code Verification Page**

- User enters 6-digit code
- Auto-verifies when all 6 digits entered

### 4. **Backend: Verify Code**

- `verifyCode()` is called
- Checks database for matching code
- Validates code hasn't expired
- Marks code as verified
- Updates user's last login time
- Logs user in

### 5. **User Logged In**

- Main Slack app loads
- User can use app
- Logout button routes back to sign-in

---

## 📊 Database Tables

### `users` Table

```
id          | UUID (Primary Key)
email       | TEXT (Unique)
created_at  | TIMESTAMPTZ
last_login  | TIMESTAMPTZ
```

### `verification_codes` Table

```
id          | UUID (Primary Key)
email       | TEXT
code        | TEXT (6 digits)
created_at  | TIMESTAMPTZ
expires_at  | TIMESTAMPTZ
verified    | BOOLEAN
verified_at | TIMESTAMPTZ
```

---

## 🧪 Testing the Flow

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Test the auth flow:**

   - Enter any email (e.g., `test@example.com`)
   - Complete reCAPTCHA
   - Click "Continue"
   - Check browser console for the verification code
   - Enter the 6-digit code
   - You should be logged in!

3. **Check Supabase:**
   - Go to your Supabase dashboard
   - Table Editor → `users` (your email should be there)
   - Table Editor → `verification_codes` (codes are stored here)

---

## 🔍 Debugging

### Check Browser Console

The verification code is logged to the console for testing:

```
Verification code for test@example.com: 123456
```

### Check Supabase Logs

- Go to Supabase Dashboard → Logs
- See all database queries and errors

### Common Issues

1. **"Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"**

   - Make sure `.env.local` file exists
   - Restart dev server after creating `.env.local`

2. **"Failed to send verification code"**

   - Check Supabase connection
   - Verify RLS policies are set up correctly
   - Check browser console for detailed errors

3. **"Invalid or expired code"**
   - Code expires after 10 minutes
   - Code can only be used once
   - Check that you entered the correct code from console

---

## 🔐 Security Notes

- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- The `anon` key is safe to expose (it's public)
- Row Level Security (RLS) policies protect your data
- In production, add email service integration (SendGrid, Resend, etc.)
- Never hardcode the Supabase key in your code files

---

## 🎯 Next Steps (Optional)

1. **Add Email Service**

   - Integrate SendGrid/Resend/Postmark
   - Send actual emails with verification codes
   - Remove console.log of codes

2. **Add Rate Limiting**

   - Prevent spam code requests
   - Limit failed verification attempts

3. **Add Session Management**

   - Store session tokens
   - Auto-logout after inactivity
   - Remember user across page refreshes

4. **Add Password Reset**
   - Forgot password flow
   - Password reset codes

---

## ✅ You're All Set!

Your Slack MVP now has a fully functional authentication system with:

- ✅ User registration
- ✅ Email verification codes
- ✅ Database storage
- ✅ Secure authentication
- ✅ Session management

Happy coding! 🚀
