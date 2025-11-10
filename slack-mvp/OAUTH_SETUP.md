# OAuth Setup Guide (Google & Apple)

To enable Google and Apple login, you need to configure OAuth providers in your Supabase dashboard.

## 🔧 Setup Steps

### 1. Go to Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: `LLMs_FinalProject`
3. Navigate to: **Authentication** → **Providers**

---

## 🔵 Google OAuth Setup

### Step 1: Enable Google Provider in Supabase

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click to enable it
3. You'll need to configure:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

### Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to: **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (if not already done):
   - User Type: **External**
   - App name: **Your App Name**
   - User support email: **your-email@example.com**
   - Developer contact: **your-email@example.com**
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Slack MVP**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - Authorized redirect URIs:
     ```
     https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
7. Copy the **Client ID** and **Client Secret**

### Step 3: Add Credentials to Supabase

1. Go back to Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
3. Copy the **Callback URL** shown in Supabase (should look like: `https://your-project.supabase.co/auth/v1/callback`)
4. Make sure this URL is added to **Authorized redirect URIs** in Google Cloud Console
5. Click **Save**

---

## 🍎 Apple OAuth Setup

### Step 1: Enable Apple Provider in Supabase

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** and click to enable it
3. You'll need to configure:
   - **Services ID**
   - **Team ID**
   - **Key ID**
   - **Private Key**

### Step 2: Create Apple OAuth Credentials

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to: **Certificates, Identifiers & Profiles**

#### Create an App ID:

1. Go to **Identifiers** → Click **+** button
2. Select **App IDs** → Continue
3. Fill in:
   - Description: **Your App Name**
   - Bundle ID: `com.yourcompany.yourapp` (reverse domain)
4. Enable **Sign in with Apple**
5. Click **Continue** → **Register**

#### Create a Services ID:

1. Go to **Identifiers** → Click **+** button
2. Select **Services IDs** → Continue
3. Fill in:
   - Description: **Your App Web**
   - Identifier: `com.yourcompany.yourapp.web`
4. Enable **Sign in with Apple**
5. Click **Configure**:
   - Primary App ID: Select the App ID created above
   - Web Domain: `your-supabase-project-ref.supabase.co`
   - Return URLs: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
6. Click **Save** → **Continue** → **Register**

#### Create a Private Key:

1. Go to **Keys** → Click **+** button
2. Fill in:
   - Key Name: **Sign in with Apple Key**
   - Enable **Sign in with Apple**
3. Click **Configure** → Select your App ID
4. Click **Save** → **Continue** → **Register**
5. **Download the .p8 key file** (you can only do this once!)
6. Note the **Key ID** shown

#### Get Your Team ID:

1. In Apple Developer Portal, click your name in top-right
2. Your **Team ID** is shown (it's a 10-character string like `AB12CD34EF`)

### Step 3: Add Credentials to Supabase

1. Go back to Supabase Dashboard → **Authentication** → **Providers** → **Apple**
2. Fill in:
   - **Services ID**: `com.yourcompany.yourapp.web` (from Services ID)
   - **Team ID**: Your 10-character team ID
   - **Key ID**: From the key you created
   - **Private Key**: Open the `.p8` file in a text editor and paste the entire contents
3. Click **Save**

---

## 🧪 Testing OAuth

### Test Locally:

1. Make sure your dev server is running:

   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`

3. Click **Google** or **Apple** button

4. You should be redirected to the OAuth provider

5. After successful authentication, you'll be redirected back to your app

### Common Issues:

- ❌ **"redirect_uri_mismatch"**: Make sure the callback URL in Supabase matches what you set in Google/Apple console
- ❌ **"invalid_client"**: Check that your Client ID and Client Secret are correct
- ❌ **CORS errors**: Make sure your domain is added to authorized origins

---

## 🔐 Update Auth Context for OAuth Users

The current implementation will redirect OAuth users back to the app. You may want to update `AuthContext.tsx` to handle OAuth sessions:

```typescript
// In AuthContext.tsx, add this useEffect to check for existing sessions:
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      setUser({ email: session.user.email || "" });
    }
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      setUser({ email: session.user.email || "" });
    } else {
      setUser(null);
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

---

## 📝 Quick Start (Without Full OAuth Setup)

If you want to test the functionality without setting up OAuth providers:

1. The buttons are now functional and will trigger OAuth
2. Without proper configuration, they'll show an error
3. Users can still use the email verification flow
4. Set up OAuth providers when you're ready to deploy

---

## 🚀 Production Deployment

When deploying to production:

1. Update authorized domains in Google/Apple consoles
2. Add your production domain to Supabase allowed redirect URLs
3. Update the callback URL in your OAuth providers to use your production domain
4. Test the full flow in production

---

Need help? Check the official docs:

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Apple OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)
