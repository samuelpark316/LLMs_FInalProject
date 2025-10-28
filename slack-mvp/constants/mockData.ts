// Mock data for the Slack MVP demo narrative
import { User, Channel, Message, AiSummary } from '../types';

export const USERS: User[] = [
  {
    id: 'u01',
    name: 'Ronit Batra',
    avatarUrl: '/Ronit.jpeg',
  },
  {
    id: 'u02',
    name: 'Sagun Venuganti',
    avatarUrl: '/Sagun.jpeg',
  },
  {
    id: 'u03',
    name: 'Sam Park',
    avatarUrl: '/Sam.jpeg',
  },
];

export const CURRENT_USER_ID = 'u01'; // Ronit Batra is the main user

export const CHANNELS: Channel[] = [
  {
    id: 'c01',
    name: 'software-engineering',
    description: 'Software engineering team discussions',
  },
  {
    id: 'c02',
    name: 'outbound',
    description: 'Outbound sales and marketing',
  },
  {
    id: 'c03',
    name: 'inbound',
    description: 'Inbound leads and inquiries',
  },
  // Direct message pseudo-channels (used for rendering DM threads)
  {
    id: 'dm_u02',
    name: 'Sagun Venuganti',
    description: 'Direct message with Sagun Venuganti',
  },
  {
    id: 'dm_u03',
    name: 'Sam Park',
    description: 'Direct message with Sam Park',
  },
];

export const MESSAGES: Message[] = [
  // Software Engineering channel - Main demo channel
  {
    id: 'm01',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T08:30:00Z',
    content: 'Morning! Quick update: backend API deployment went smoothly last night. All endpoints are now live on staging.',
  },
  {
    id: 'm02',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T08:45:00Z',
    content: 'Great work @Sagun! I\'ve started testing the authentication flow. Found one small issue with the password reset email - the link is returning a 404.',
  },
  {
    id: 'm03',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T08:50:00Z',
    content: 'Thanks for catching that @Ronit! I\'ll look into the routing config. Should have a fix by noon.',
  },
  {
    id: 'm04',
    userId: 'u03',
    channelId: 'c01',
    timestamp: '2025-10-27T09:15:00Z',
    content: 'FYI - I\'ve updated the database schema to support user roles. Migration scripts are in the repo. Please run them on your local environments.',
  },
  {
    id: 'm05',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T09:30:00Z',
    content: 'Design files for the new dashboard are ready! Check Figma for the latest mockups. Would love your feedback on the color scheme @Sagun.',
  },
  {
    id: 'm06',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T10:00:00Z',
    content: 'Looking at the designs now - they look fantastic! The color palette is much more accessible than v1.',
  },
  {
    id: 'm07',
    userId: 'u01',
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
    userId: 'u03',
    channelId: 'c01',
    timestamp: '2025-10-27T11:45:00Z',
    content: 'Database performance is looking good after the optimization. Query time reduced by 60%. Stats dashboard shows everything in the green.',
  },
  {
    id: 'm10',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T12:30:00Z',
    content: 'Just merged the new icon set into main. Matches our updated brand guidelines perfectly.',
  },
  {
    id: 'm11',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T13:00:00Z',
    content: 'Team sync at 2 PM today - let\'s review the sprint progress and plan for next week\'s release.',
  },
  {
    id: 'm12',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T13:15:00Z',
    content: 'Added test coverage for the new authentication module. We\'re now at 87% overall coverage 🎉',
  },
  {
    id: 'm13',
    userId: 'u02',
    channelId: 'c01',
    timestamp: '2025-10-27T13:45:00Z',
    content: '@Ronit can you review PR #234? It\'s the role-based access control implementation.',
  },
  {
    id: 'm14',
    userId: 'u01',
    channelId: 'c01',
    timestamp: '2025-10-27T14:00:00Z',
    content: 'On it @Sagun! Will review and provide feedback within the hour.',
  },
  {
    id: 'm15',
    userId: 'u03',
    channelId: 'c01',
    timestamp: '2025-10-27T14:30:00Z',
    content: 'User research session scheduled for Thursday. We\'ll be testing the new onboarding flow with 5 participants.',
  },

  // Outbound channel
  {
    id: 'm16',
    userId: 'u01',
    channelId: 'c02',
    timestamp: '2025-10-27T09:00:00Z',
    content: 'New outbound campaign launching next week. Targeting enterprise clients in the fintech space.',
  },
  {
    id: 'm17',
    userId: 'u03',
    channelId: 'c02',
    timestamp: '2025-10-27T11:00:00Z',
    content: 'Updated the pitch deck with latest product features. Link in thread.',
  },

  // Inbound channel
  {
    id: 'm18',
    userId: 'u02',
    channelId: 'c03',
    timestamp: '2025-10-27T12:00:00Z',
    content: 'Got 5 new inbound leads from the latest blog post. Will follow up this afternoon.',
  },
  {
    id: 'm19',
    userId: 'u01',
    channelId: 'c03',
    timestamp: '2025-10-27T13:30:00Z',
    content: 'Great! Let me know if you need any technical resources for the demos.',
  },

  // Direct Messages with Sagun (dm_u02)
  {
    id: 'm20',
    userId: 'u02',
    channelId: 'dm_u02',
    timestamp: '2025-10-27T07:45:00Z',
    content: 'Morning! Want to pair on the RBAC review later today?',
  },
  {
    id: 'm21',
    userId: 'u01',
    channelId: 'dm_u02',
    timestamp: '2025-10-27T07:50:00Z',
    content: 'Yep, I have time after lunch. Shoot me the latest branch.',
  },

  // Direct Messages with Sam (dm_u03)
  {
    id: 'm22',
    userId: 'u03',
    channelId: 'dm_u03',
    timestamp: '2025-10-27T10:10:00Z',
    content: 'Metrics look better after the DB tweaks. I\'ll share the chart.',
  },
  {
    id: 'm23',
    userId: 'u01',
    channelId: 'dm_u03',
    timestamp: '2025-10-27T10:12:00Z',
    content: 'Awesome, thanks! Let\'s add it to the deck.',
  },
];

export const AI_SUMMARIES: AiSummary[] = [
  {
    channelId: 'c01',
    content: `# Software Engineering - Daily Summary

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
- Ronit Batra: Project coordination, design feedback, QA testing, test coverage
- Sagun Venuganti: Backend development, API fixes, error logging
- Sam Park (External): Database optimization, user research planning

## 🎉 Wins
- 60% improvement in database query performance
- 87% test coverage achieved
- Successful staging deployment with zero downtime`,
  },
  {
    channelId: 'c02',
    content: `# Outbound Channel Summary

## 📢 Key Updates
- New outbound campaign launching next week targeting fintech enterprise clients
- Pitch deck updated with latest product features`,
  },
  {
    channelId: 'c03',
    content: `# Inbound Channel Summary

## 📢 Key Updates
- 5 new inbound leads from latest blog post
- Follow-up scheduled for this afternoon
- Technical resources available for demos`,
  },
];

