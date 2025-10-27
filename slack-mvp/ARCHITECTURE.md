# 🏗️ Slack MVP - Architecture Documentation

This document provides a comprehensive overview of the application's architecture, component relationships, and data flow.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Next.js Application                      │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │          App Router (app/)                      │ │ │
│  │  │                                                 │ │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │ │ │
│  │  │  │ layout.  │  │  page.   │  │ globals. │    │ │ │
│  │  │  │   tsx    │  │   tsx    │  │   css    │    │ │ │
│  │  │  └──────────┘  └──────────┘  └──────────┘    │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │       WorkspaceContext (Global State)           │ │ │
│  │  │   • currentUserId                               │ │ │
│  │  │   • selectedChannelId                           │ │ │
│  │  │   • isSidebarOpen                               │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │            ▲                           │              │ │
│  │            │                           ▼              │ │
│  │  ┌─────────────────┐     ┌─────────────────────┐   │ │
│  │  │    Sidebar      │     │      ChatView       │   │ │
│  │  │                 │     │                     │   │ │
│  │  │ • Channels      │     │ • Header            │   │ │
│  │  │ • Users         │     │ • Message Feed      │   │ │
│  │  │ • Active State  │     │ • Message Input     │   │ │
│  │  └─────────────────┘     │ • AI Modal          │   │ │
│  │                          └─────────────────────┘   │ │
│  │                                    │                │ │
│  │                                    ▼                │ │
│  │                          ┌─────────────────────┐   │ │
│  │                          │   Mock API Layer    │   │ │
│  │                          │                     │   │ │
│  │                          │ • fetchMessages     │   │ │
│  │                          │ • postMessage       │   │ │
│  │                          │ • fetchAiSummary    │   │ │
│  │                          └─────────────────────┘   │ │
│  │                                    │                │ │
│  │                                    ▼                │ │
│  │                          ┌─────────────────────┐   │ │
│  │                          │    Mock Data        │   │ │
│  │                          │  (constants/)       │   │ │
│  │                          └─────────────────────┘   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

         Future: Replace Mock API with Real Backend
                            │
                            ▼
           ┌──────────────────────────────────┐
           │         Supabase Cloud           │
           │                                  │
           │  • PostgreSQL Database           │
           │  • Real-time Subscriptions       │
           │  • Authentication                │
           │  • Storage                       │
           └──────────────────────────────────┘
                            │
                            ▼
           ┌──────────────────────────────────┐
           │         OpenAI API               │
           │                                  │
           │  • GPT-4 for Summarization       │
           │  • Streaming Responses           │
           └──────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App (page.tsx)
│
├─ Sidebar (layout/Sidebar.tsx)
│   ├─ Workspace Name
│   ├─ Channels Section
│   │   ├─ Channel Item (Button) x4
│   │   └─ Hash Icon (lucide-react)
│   └─ Direct Messages Section
│       ├─ User Item (Button) x4
│       └─ User Icon (lucide-react)
│
└─ ChatView (layout/ChatView.tsx)
    ├─ Header
    │   ├─ Menu Button (mobile only)
    │   ├─ Channel Name & Description
    │   └─ Summarize Button
    │       └─ Sparkles Icon (lucide-react)
    │
    ├─ Message Feed (scrollable)
    │   ├─ Loading Spinner (if loading)
    │   └─ Message (ui/Message.tsx) x15
    │       ├─ Avatar (Next Image)
    │       ├─ User Name
    │       ├─ Timestamp (formatted)
    │       └─ Content (with mentions)
    │
    ├─ Message Input (layout/MessageInput.tsx)
    │   ├─ Input Field
    │   └─ Send Button
    │       └─ Send Icon (lucide-react)
    │
    └─ AI Summary Modal (ui/Modal.tsx)
        ├─ Modal Backdrop (overlay)
        ├─ Modal Content
        │   ├─ Header
        │   │   ├─ Title
        │   │   └─ Close Button (X icon)
        │   └─ Body
        │       ├─ Loading Spinner (1.5s)
        │       └─ Summary Content (formatted markdown)
        └─ ESC Key Handler
```

---

## 🔄 Data Flow Diagrams

### Message Sending Flow (Optimistic Update)

```
User Types Message
        │
        ▼
[Press Enter / Click Send]
        │
        ├─────────────────┐
        │                 │
        ▼                 ▼
Create Optimistic     Update UI
   Message            Immediately
        │                 │
        └────────┬────────┘
                 │
                 ▼
        Call postMessage()
         (500ms delay)
                 │
                 ▼
         Message Sent
                 │
                 ▼
       Update Message
         (remove temp ID)
```

### AI Summarization Flow

```
User Clicks "Summarize Channel"
             │
             ▼
     Open Modal
             │
             ▼
   Show Loading State
     (LoadingSpinner)
             │
             ▼
   fetchAiSummary(channelId)
     (1500ms delay)
             │
             ▼
   Retrieve Summary from
      Mock Data Store
             │
             ▼
   Parse & Format Content
   (markdown-like rendering)
             │
             ▼
     Display Summary
             │
             ├─── Close Button
             ├─── ESC Key
             └─── Backdrop Click
                     │
                     ▼
               Close Modal
```

### Channel Switching Flow

```
User Clicks Channel in Sidebar
             │
             ▼
   Update selectedChannelId
     (WorkspaceContext)
             │
             ▼
   ChatView useEffect Triggered
             │
             ▼
   setIsLoading(true)
             │
             ▼
   fetchChannelMessages()
     (500ms delay)
             │
             ▼
   setMessages(newMessages)
             │
             ▼
   setIsLoading(false)
             │
             ▼
   Auto-scroll to Bottom
             │
             ▼
   Display New Channel
```

---

## 🗂️ State Management Strategy

### Global State (WorkspaceContext)

```typescript
interface WorkspaceContextType {
  currentUserId: string;        // Who is logged in
  selectedChannelId: string;    // Current active channel
  setSelectedChannelId: (id: string) => void;
  isSidebarOpen: boolean;       // Mobile sidebar toggle
  toggleSidebar: () => void;
  closeSidebar: () => void;
}
```

**Why Global?**
- Needs to be accessed by multiple components
- Should persist across component remounts
- Avoids prop drilling

### Local State (Component-level)

```typescript
// ChatView Component
const [messages, setMessages] = useState<Message[]>([]);
const [isLoadingMessages, setIsLoadingMessages] = useState(true);
const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
const [summaryContent, setSummaryContent] = useState<string>('');
const [isLoadingSummary, setIsLoadingSummary] = useState(false);

// MessageInput Component
const [messageText, setMessageText] = useState('');
const [isSending, setIsSending] = useState(false);
```

**Why Local?**
- Only used within specific components
- Doesn't need to be shared
- Easier to reason about

---

## 📦 Module Dependencies

```
components/layout/ChatView.tsx
    ├─ react (useState, useEffect, useRef)
    ├─ lucide-react (Menu, Sparkles icons)
    ├─ constants/mockData (CHANNELS, USERS)
    ├─ api/mockApi (fetchChannelMessages, fetchAiSummary)
    ├─ components/ui/Message
    ├─ components/layout/MessageInput
    ├─ components/ui/Modal
    ├─ components/ui/LoadingSpinner
    ├─ contexts/WorkspaceContext (useWorkspace hook)
    └─ types (Message type)

components/layout/Sidebar.tsx
    ├─ react
    ├─ lucide-react (Hash, User icons)
    ├─ constants/mockData (CHANNELS, USERS, CURRENT_USER_ID)
    └─ contexts/WorkspaceContext (useWorkspace hook)

components/ui/Modal.tsx
    ├─ react (useEffect)
    └─ lucide-react (X icon)

app/page.tsx
    ├─ components/layout/Sidebar
    └─ components/layout/ChatView
```

---

## 🎯 Design Patterns Used

### 1. Container/Presentational Pattern

**Container Components** (Smart):
- `ChatView` - Manages message state and fetching
- `MessageInput` - Handles form submission and API calls

**Presentational Components** (Dumb):
- `Message` - Just displays data, no logic
- `Button` - Reusable, style variants only
- `LoadingSpinner` - Pure presentation

### 2. Custom Hooks

```typescript
// hooks/useMessages.ts
export const useMessages = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch logic
  }, [channelId]);
  
  return { messages, isLoading, addMessage, removeMessage };
};
```

### 3. Context Provider Pattern

```typescript
// contexts/WorkspaceContext.tsx
export const WorkspaceProvider: React.FC<{ children }> = ({ children }) => {
  const [selectedChannelId, setSelectedChannelId] = useState(CHANNELS[0].id);
  
  return (
    <WorkspaceContext.Provider value={{ selectedChannelId, ... }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
```

### 4. Optimistic UI Pattern

```typescript
// MessageInput.tsx
const handleSubmit = async (e) => {
  const optimisticMessage = {
    id: `temp-${Date.now()}`,
    ...messageData
  };
  
  // 1. Update UI immediately
  onMessageSent(optimisticMessage);
  
  // 2. Call API in background
  await postMessage(messageData);
  
  // 3. Replace optimistic with real (if needed)
};
```

---

## 🔐 Type Safety Architecture

```typescript
// types/index.ts - Single source of truth

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  userId: string;
  channelId: string;
  timestamp: string;
  content: string;
}

// Used everywhere:
import { User, Message } from '../types';

// No `any` types in production code
// All function parameters are typed
// All component props have interfaces
```

---

## 🎨 Styling Architecture

### CSS-in-JS via Tailwind

```typescript
// Instead of separate CSS files:
<div className="flex items-center justify-between px-4 py-3 border-b">
  {/* content */}
</div>

// Responsive modifiers:
<div className="w-64 lg:w-80 hidden lg:block">
  {/* sidebar */}
</div>

// Hover/focus states:
<button className="hover:bg-gray-100 focus:ring-2 focus:ring-accent">
  {/* button */}
</button>
```

### Theme Variables (globals.css)

```css
:root {
  --primary-dark: #1A1D21;
  --accent: #36C5F0;
  /* ... */
}

@theme inline {
  --color-accent: var(--accent);
}

/* Use in Tailwind: */
/* className="bg-accent text-white" */
```

---

## 📱 Responsive Design Strategy

### Breakpoint System

```typescript
// Default (Mobile): < 640px
<div className="hidden"> {/* Hidden on mobile */}

// Small Tablet: >= 640px
<div className="sm:block"> {/* Visible on sm+ */}

// Tablet: >= 768px
<div className="md:w-1/2"> {/* Half width on md+ */}

// Desktop: >= 1024px
<div className="lg:flex"> {/* Flex on lg+ */}

// Large Desktop: >= 1280px
<div className="xl:max-w-7xl"> {/* Max width on xl+ */}
```

### Mobile-First Approach

```typescript
// Sidebar.tsx
<aside className={`
  fixed lg:static           // Fixed on mobile, static on desktop
  w-64                       // Always 64 width
  transform transition       // Smooth animation
  ${isSidebarOpen 
    ? 'translate-x-0'        // Visible when open
    : '-translate-x-full     // Hidden when closed
       lg:translate-x-0'     // But always visible on desktop
  }
`}>
```

---

## 🚀 Performance Optimizations

### 1. Code Splitting (Automatic)

Next.js automatically splits code by route:
```
page.tsx → page-bundle.js (only loads on this route)
```

### 2. Image Optimization

```typescript
import Image from 'next/image';

<Image
  src={avatarUrl}
  alt={userName}
  width={40}
  height={40}
  // Next.js optimizes automatically
/>
```

### 3. Lazy Loading (Future)

```typescript
// For modals/heavy components
const Modal = dynamic(() => import('./Modal'), {
  loading: () => <LoadingSpinner />
});
```

### 4. Memoization (Future Enhancement)

```typescript
// Prevent re-renders
const MemoizedMessage = React.memo(Message);

// Expensive computations
const formattedMessages = useMemo(
  () => messages.map(formatMessage),
  [messages]
);
```

---

## 🔮 Future Architecture Plans

### Backend Integration

```
Current: Mock API
    ↓
Future: Supabase Client
    ↓
Real-time: Supabase Realtime
    ↓
Cache: React Query
```

### Authentication Layer

```
WorkspaceProvider
    ↓
AuthProvider (Supabase Auth)
    ↓
ProtectedRoute HOC
    ↓
Application Components
```

### Real-time Updates

```
useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on('INSERT', handleNewMessage)
    .on('UPDATE', handleUpdateMessage)
    .subscribe();
    
  return () => supabase.removeChannel(channel);
}, []);
```

---

## 📊 Metrics & Monitoring (Future)

```
Vercel Analytics
    ├─ Page Load Times
    ├─ Core Web Vitals
    └─ User Geography

Sentry (Error Tracking)
    ├─ JavaScript Errors
    ├─ Network Errors
    └─ User Sessions

Custom Events
    ├─ Messages Sent
    ├─ AI Summaries Generated
    └─ Channel Switches
```

---

## 🎓 Key Architectural Decisions

### Why Next.js App Router?

✅ **Server Components**: Faster initial loads  
✅ **Streaming**: Progressive rendering  
✅ **Built-in Optimization**: Images, fonts, code splitting  
✅ **TypeScript First**: Better DX  

### Why Context API vs. Redux?

✅ **Simpler**: No boilerplate  
✅ **Built-in**: No dependencies  
✅ **Sufficient**: MVP scope doesn't need Redux  
✅ **Easier to Learn**: Better for demos  

### Why Tailwind CSS?

✅ **Fast Development**: Utility-first approach  
✅ **Consistent**: Design system built-in  
✅ **Small Bundle**: PurgeCSS removes unused styles  
✅ **Responsive**: Mobile-first by default  

### Why Mock Data?

✅ **Demo Stability**: No network failures  
✅ **Controlled Content**: Curated narrative  
✅ **Fast Iteration**: No backend dependency  
✅ **Easy Transition**: Same API shape as real backend  

---

## 📚 Related Documentation

- [Component API Reference](./PROJECT_OVERVIEW.md#-component-library)
- [State Management Deep-Dive](./PROJECT_OVERVIEW.md#-state-management-strategy)
- [Deployment Architecture](./DEPLOYMENT.md#-supabase-backend-setup)
- [Design System](./PROJECT_OVERVIEW.md#-design-system-specifications)

---

*This architecture is designed to scale from MVP to production with minimal refactoring.*

**Version**: 1.0.0  
**Last Updated**: October 2025

