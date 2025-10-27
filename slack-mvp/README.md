# Slack MVP - Communication into Knowledge

A simplified team communication platform with AI-powered channel summarization, built for demonstration purposes.

## 🚀 Features

- **Clean, Intuitive UI**: Three-pane layout familiar to communication tool users
- **Real-time Messaging**: Send and receive messages with optimistic UI updates
- **AI Channel Summarization**: Get instant AI-generated summaries of channel discussions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Professional Design**: Modern color palette and typography using Inter font

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
slack-mvp/
├── api/              # Mock API functions for backend simulation
├── app/              # Next.js app directory (pages and layouts)
├── assets/           # Static assets
├── components/
│   ├── ui/          # Reusable UI components (Button, Modal, Message, etc.)
│   └── layout/      # Layout components (Sidebar, ChatView, MessageInput)
├── constants/        # Mock data and application constants
├── contexts/         # React Context providers (WorkspaceContext)
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── utils/            # Utility functions (formatters, helpers)
```

## 🎨 Design System

### Color Palette
- **Primary Dark**: `#1A1D21` (Sidebar background)
- **Primary Light**: `#FFFFFF` (Main content background)
- **Accent**: `#36C5F0` (Highlights, buttons, active states)
- **Text Primary**: `#1D1D1D` (Primary text on light backgrounds)
- **Text Secondary**: `#616061` (Subtle text, timestamps)
- **Text Inverted**: `#D1D2D3` (Text on dark backgrounds)
- **Border Subtle**: `#DDDDDD` (Borders and dividers)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Spacing**: 4px grid system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project:
```bash
cd slack-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Demo Flow

The application is pre-configured with a complete demo narrative:

1. **Initial State**: The `#project-alpha` channel is pre-selected with 15 realistic messages
2. **Message Interaction**: Type and send messages with instant optimistic updates
3. **AI Summarization**: Click "Summarize Channel" to see an AI-generated summary with:
   - Key decisions made
   - Completed tasks
   - In-progress items
   - Upcoming events
   - Active contributors
   - Notable wins

## 🎯 Key User Flows

### Desktop Experience
- Three-pane layout with persistent sidebar
- Channel selection in left sidebar
- Main chat view with message history
- AI summarization button in header

### Mobile Experience
- Collapsible sidebar with hamburger menu
- Full-screen chat view
- Responsive message input
- Touch-optimized interactions

## 🔧 Mock Data

The application uses curated mock data to demonstrate a coherent project narrative:

- **5 Users**: Alice (demo user), Bob, Carol, David, Emma
- **4 Channels**: project-alpha, general, random, design
- **15+ Messages**: Realistic project discussion in #project-alpha
- **AI Summaries**: Pre-written summaries for demonstration

## 📦 Deployment to Vercel

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy with one click

Alternatively, use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

## 🔮 Future Enhancements (Supabase Integration)

When ready to add a real backend, integrate Supabase:

1. Create a Supabase project
2. Set up database tables for users, channels, messages
3. Replace mock API calls in `api/mockApi.ts` with Supabase queries
4. Add authentication using Supabase Auth
5. Implement real-time subscriptions for live message updates

### Example Supabase Schema

```sql
-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Channels table
create table channels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  channel_id uuid references channels(id),
  content text not null,
  created_at timestamp with time zone default now()
);
```

## 🎨 Customization

### Update Colors
Modify the color palette in `app/globals.css`:

```css
:root {
  --primary-dark: #1A1D21;
  --accent: #36C5F0;
  /* ... other colors */
}
```

### Add New Channels
Update `constants/mockData.ts`:

```typescript
export const CHANNELS: Channel[] = [
  // Add your new channel
  { id: 'c05', name: 'engineering', description: 'Engineering discussions' },
];
```

## 📄 License

This project is created for demonstration purposes as part of a final project.

## 🙏 Acknowledgments

- Built with Next.js, React, and Tailwind CSS
- Icons by Lucide React
- Avatars by DiceBear
- Fonts by Google Fonts (Inter)
