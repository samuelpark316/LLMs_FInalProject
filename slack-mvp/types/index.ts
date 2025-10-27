// Core type definitions for the Slack MVP application

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
}

export interface Message {
  id: string;
  userId: string;
  channelId: string;
  timestamp: string; // ISO 8601 format
  content: string;
}

export interface AiSummary {
  channelId: string;
  content: string; // Can be Markdown formatted
}

