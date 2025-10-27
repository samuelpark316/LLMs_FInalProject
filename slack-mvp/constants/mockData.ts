// Mock data for the Slack MVP demo narrative
import { User, Channel, Message, AiSummary } from '../types';

export const USERS: User[] = [
  {
    id: 'u01',
    name: 'Alice Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: 'u02',
    name: 'Bob Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    id: 'u03',
    name: 'Carol Martinez',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
  },
  {
    id: 'u04',
    name: 'David Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    id: 'u05',
    name: 'Emma Wilson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
];

export const CURRENT_USER_ID = 'u01'; // Alice is the user for the demo

export const CHANNELS: Channel[] = [
  {
    id: 'c01',
    name: 'project-alpha',
    description: 'Project Alpha development and coordination',
  },
  {
    id: 'c02',
    name: 'general',
    description: 'Company-wide announcements and general discussion',
  },
  {
    id: 'c03',
    name: 'random',
    description: 'Non-work-related conversations and fun',
  },
  {
    id: 'c04',
    name: 'design',
    description: 'Design team collaboration',
  },
];

export const MESSAGES: Message[] = [
  // Project Alpha channel - The star of the demo
  {
    id: 'm01',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T08:30:00Z',
    content: 'Morning team! Quick update: backend API deployment went smoothly last night. All endpoints are now live on staging.',
  },
  {
    id: 'm02',
    userId: 'u03',
    channelId: 'c01',
    timestamp: '2025-10-27T08:45:00Z',
    content: 'Great work @Bob! I\'ve started testing the authentication flow. Found one small issue with the password reset email - the link is returning a 404.',
  },
  {
    id: 'm03',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T08:50:00Z',
    content: 'Thanks for catching that @Carol. I\'ll look into the routing config. Should have a fix by noon.',
  },
  {
    id: 'm04',
    userId: 'u04',
    channelId: 'c01',
    timestamp: '2025-10-27T09:15:00Z',
    content: 'FYI - I\'ve updated the database schema to support user roles. Migration scripts are in the repo. Please run them on your local environments.',
  },
  {
    id: 'm05',
    userId: 'u05',
    channelId: 'c01',
    timestamp: '2025-10-27T09:30:00Z',
    content: 'Design files for the new dashboard are ready! Check Figma for the latest mockups. @Alice would love your feedback on the color scheme.',
  },
  {
    id: 'm06',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T10:00:00Z',
    content: 'Looking at the designs now @Emma - they look fantastic! The color palette is much more accessible than v1.',
  },
  {
    id: 'm07',
    userId: 'u03',
    channelId: 'c01',
    timestamp: '2025-10-27T10:45:00Z',
    content: 'Quick heads up: QA testing revealed that the mobile layout breaks on devices smaller than 375px width. Adding a fix to the sprint.',
  },
  {
    id: 'm08',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T11:20:00Z',
    content: 'Password reset bug is fixed! Also added better error logging so we can catch these earlier. Deployed to staging.',
  },
  {
    id: 'm09',
    userId: 'u04',
    channelId: 'c01',
    timestamp: '2025-10-27T11:45:00Z',
    content: 'Database performance is looking good after the optimization. Query time reduced by 60%. Stats dashboard shows everything in the green.',
  },
  {
    id: 'm10',
    userId: 'u05',
    channelId: 'c01',
    timestamp: '2025-10-27T12:30:00Z',
    content: 'Just merged the new icon set into main. Matches our updated brand guidelines perfectly.',
  },
  {
    id: 'm11',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T13:00:00Z',
    content: 'Team sync at 2 PM today - let\'s review the sprint progress and plan for next week\'s release.',
  },
  {
    id: 'm12',
    userId: 'u03',
    channelId: 'c01',
    timestamp: '2025-10-27T13:15:00Z',
    content: 'Added test coverage for the new authentication module. We\'re now at 87% overall coverage 🎉',
  },
  {
    id: 'm13',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T13:45:00Z',
    content: '@David can you review PR #234? It\'s the role-based access control implementation.',
  },
  {
    id: 'm14',
    userId: 'u04',
    channelId: 'c01',
    timestamp: '2025-10-27T14:00:00Z',
    content: 'On it @Bob! Will review and provide feedback within the hour.',
  },
  {
    id: 'm15',
    userId: 'u05',
    channelId: 'c01',
    timestamp: '2025-10-27T14:30:00Z',
    content: 'User research session scheduled for Thursday. We\'ll be testing the new onboarding flow with 5 participants.',
  },

  // General channel - a few messages for context
  {
    id: 'm16',
    userId: 'u02',
    channelId: 'c02',
    timestamp: '2025-10-27T09:00:00Z',
    content: 'Reminder: Company all-hands meeting is tomorrow at 10 AM.',
  },
  {
    id: 'm17',
    userId: 'u05',
    channelId: 'c02',
    timestamp: '2025-10-27T11:00:00Z',
    content: 'New coffee machine in the break room! ☕',
  },

  // Random channel
  {
    id: 'm18',
    userId: 'u03',
    channelId: 'c03',
    timestamp: '2025-10-27T12:00:00Z',
    content: 'Anyone want to grab lunch? Thinking of trying that new taco place.',
  },

  // Design channel
  {
    id: 'm19',
    userId: 'u05',
    channelId: 'c04',
    timestamp: '2025-10-27T10:30:00Z',
    content: 'Updated the design system documentation. Check it out at /design-system',
  },
];

export const AI_SUMMARIES: AiSummary[] = [
  {
    channelId: 'c01',
    content: `# Project Alpha - Daily Summary

## 🎯 Key Decisions
- Backend API successfully deployed to staging environment
- Database schema updated to support user role management
- New design system with improved accessibility approved and implemented

## ✅ Completed Tasks
- **Backend**: API deployment complete, password reset bug fixed, error logging improved
- **Database**: Schema migration for user roles, performance optimization (60% faster queries)
- **Design**: New dashboard mockups finalized, icon set merged, brand guidelines updated
- **QA**: Test coverage increased to 87%, mobile layout issue identified

## 🚧 In Progress
- Role-based access control implementation (PR #234 under review)
- Mobile layout fix for devices <375px width
- Database migration scripts being deployed to local environments

## 📅 Upcoming
- Team sync meeting at 2 PM to review sprint progress
- User research session scheduled for Thursday (testing onboarding flow)
- Sprint planning for next week's release

## 👥 Active Contributors
- Bob: Backend development and API fixes
- Carol: QA testing and test coverage
- David: Database optimization and PR reviews
- Emma: Design system and user research
- Alice: Project coordination and design feedback

## 🎉 Wins
- 60% improvement in database query performance
- 87% test coverage achieved
- Successful staging deployment with zero downtime`,
  },
  {
    channelId: 'c02',
    content: `# General Channel Summary

## 📢 Announcements
- Company all-hands meeting scheduled for tomorrow at 10 AM
- New coffee machine installed in the break room`,
  },
];

