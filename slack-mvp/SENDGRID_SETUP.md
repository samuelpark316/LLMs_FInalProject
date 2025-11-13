# SendGrid Email Setup Guide

## ✅ Why SendGrid?

SendGrid's free tier allows you to:
- ✅ Send to **any email address** (no domain verification required)
- ✅ Send **100 emails per day** (perfect for development/testing)
- ✅ Use your own email address as the sender
- ✅ No credit card required for free tier

## 🚀 Quick Setup

### Step 1: Create SendGrid Account

1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Click **"Start for free"** or **"Sign Up"**
3. Fill out the signup form
4. Verify your email address

### Step 2: Create API Key

1. Once logged in, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it (e.g., "Slack MVP")
4. Select **"Full Access"** or **"Restricted Access"** with "Mail Send" permissions
5. Click **"Create & View"**
6. **Copy the API key immediately** (you won't be able to see it again!)

### Step 3: Add to Environment Variables

Add these to your `.env.local` file in the `slack-mvp` directory:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=samuelpark316@gmail.com  # Optional: Your email address
SENDGRID_FROM_NAME=Stack  # Optional: Display name
```

**Example:**
```bash
SENDGRID_API_KEY=SG.abc123xyz789...
SENDGRID_FROM_EMAIL=samuelpark316@gmail.com
SENDGRID_FROM_NAME=Stack
```

### Step 4: Restart Your Dev Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ That's It!

Now you can send verification emails to **any email address**, including:
- ✅ `rbatra210@gmail.com`
- ✅ `samuelpark316@gmail.com`
- ✅ Any other email address

## 🔍 Testing

1. Try logging in with `rbatra210@gmail.com`
2. Check your server logs - you should see `[EMAIL SUCCESS]`
3. Check the email inbox (and spam folder if needed)

## 📊 SendGrid Dashboard

You can monitor your emails at:
- **Activity Feed**: See all sent emails
- **Stats**: View delivery rates, opens, clicks
- **Settings**: Manage API keys, sender verification

## ⚠️ Important Notes

1. **Free Tier Limits**: 100 emails/day
2. **Sender Verification**: You can use your own email address without verification (emails will show "via sendgrid.net")
3. **Spam Folder**: Some emails may go to spam initially. This improves as SendGrid builds reputation.
4. **Rate Limits**: Don't exceed 100 emails/day on free tier

## 🆚 Comparison: Resend vs SendGrid

| Feature | Resend (Free) | SendGrid (Free) |
|---------|---------------|-----------------|
| Domain Required | ✅ Yes | ❌ No |
| Send to Any Email | ❌ Only account owner | ✅ Yes |
| Daily Limit | Limited | 100/day |
| Setup Complexity | Easy | Easy |

## 🐛 Troubleshooting

### "No SendGrid API key configured"
- Make sure `.env.local` exists in `slack-mvp` directory
- Check that `SENDGRID_API_KEY` is set correctly
- Restart your dev server after adding the key

### Emails not arriving
- Check spam folder
- Verify API key is correct in SendGrid dashboard
- Check SendGrid Activity Feed for delivery status
- Look at server logs for error messages

### "Invalid API Key"
- Regenerate API key in SendGrid dashboard
- Update `.env.local` with new key
- Restart dev server

## 🎯 Next Steps (Optional)

1. **Verify Your Domain** (for better deliverability):
   - Go to SendGrid → Settings → Sender Authentication
   - Add and verify your domain
   - Update `SENDGRID_FROM_EMAIL` to use your domain

2. **Upgrade Plan** (if needed):
   - If you exceed 100 emails/day
   - SendGrid offers paid plans with higher limits

---

**You're all set!** 🚀 Your email verification should now work for all email addresses.

