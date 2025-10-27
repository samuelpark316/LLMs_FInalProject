# Deployment Guide - Slack MVP

This guide covers deploying your Slack MVP to Vercel and preparing for Supabase backend integration.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Slack MVP"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd slack-mvp
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## 📊 Build Configuration

The project uses the following build settings (auto-detected by Vercel):

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## 🔐 Environment Variables (Future)

When integrating with Supabase, add these environment variables in Vercel:

1. Go to Project Settings → Environment Variables
2. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Supabase Backend Setup

### Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database provisioning

### Step 2: Set Up Database Schema

Run this SQL in the Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  avatar_url text,
  email text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Channels table
create table public.channels (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Messages table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  channel_id uuid references public.channels(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AI Summaries table (for caching summaries)
create table public.ai_summaries (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references public.channels(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index messages_channel_id_idx on public.messages(channel_id);
create index messages_user_id_idx on public.messages(user_id);
create index messages_created_at_idx on public.messages(created_at desc);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.ai_summaries enable row level security;

-- Policies (allow all for demo - customize for production)
create policy "Allow all on users" on public.users for all using (true);
create policy "Allow all on channels" on public.channels for all using (true);
create policy "Allow all on messages" on public.messages for all using (true);
create policy "Allow all on ai_summaries" on public.ai_summaries for all using (true);
```

### Step 3: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 4: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 5: Replace Mock API

Update `api/mockApi.ts` to use Supabase:

```typescript
import { supabase } from '../lib/supabase';
import { Message } from '../types';

export const fetchChannelMessages = async (channelId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const postMessage = async (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        user_id: message.userId,
        channel_id: message.channelId,
        content: message.content,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Step 6: Enable Real-time Updates

Subscribe to new messages:

```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `channel_id=eq.${channelId}`,
    },
    (payload) => {
      // Add new message to state
      setMessages((prev) => [...prev, payload.new as Message]);
    }
  )
  .subscribe();
```

## 🤖 AI Integration (Optional)

For real AI summaries, integrate with OpenAI:

### 1. Install OpenAI SDK

```bash
npm install openai
```

### 2. Add Environment Variable

```
OPENAI_API_KEY=your_openai_api_key
```

### 3. Create API Route

Create `app/api/summarize/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const prompt = `Summarize this project channel discussion. Include:
- Key decisions
- Completed tasks
- In-progress items
- Upcoming events
- Active contributors

Messages:
${messages.map((m: any) => `${m.user.name}: ${m.content}`).join('\n')}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({
    summary: completion.choices[0].message.content,
  });
}
```

## 📈 Performance Optimization

### Enable Next.js Image Optimization

Images are automatically optimized by Next.js on Vercel.

### Enable Caching

Add ISR (Incremental Static Regeneration) for channel data:

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Add Loading States

All components already implement loading states for better UX.

## 🔍 Monitoring

Vercel provides built-in analytics:

- **Real-time Analytics**: Project → Analytics
- **Web Vitals**: Track Core Web Vitals automatically
- **Error Tracking**: See runtime errors in the dashboard

## 🛡️ Security Checklist

Before production:

- [ ] Set up proper Row Level Security policies in Supabase
- [ ] Add authentication (Supabase Auth)
- [ ] Validate all user inputs
- [ ] Rate limit API endpoints
- [ ] Add CORS configuration
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only
- [ ] Add Content Security Policy headers

## 📱 Testing on Multiple Devices

Use Vercel Preview Deployments:

1. Push to a branch
2. Create a Pull Request
3. Vercel automatically creates a preview deployment
4. Test on mobile, tablet, desktop

## 🔄 Continuous Deployment

Every push to `main` branch automatically deploys to production on Vercel.

For staging environment:
- Create a `staging` branch
- Vercel will create a separate deployment
- Configure in Vercel dashboard

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Ensure all dependencies are in `package.json`

### Environment Variables Not Working

1. Restart the development server after adding variables
2. Prefix client-side variables with `NEXT_PUBLIC_`
3. Redeploy after adding variables in Vercel

### Supabase Connection Issues

1. Check URL and API key are correct
2. Verify Row Level Security policies
3. Check browser console for CORS errors

