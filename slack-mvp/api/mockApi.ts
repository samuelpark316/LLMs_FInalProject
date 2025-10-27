// Mock API functions for simulating backend interactions
import { MESSAGES, AI_SUMMARIES } from '../constants/mockData';
import { Message, AiSummary } from '../types';

const SIMULATED_DELAY_MS = 500;
const AI_SIMULATED_DELAY_MS = 1500;

/**
 * Fetches all messages for a specific channel
 * @param channelId - The ID of the channel
 * @returns Promise that resolves with an array of messages
 */
export const fetchChannelMessages = (channelId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const messages = MESSAGES.filter((m) => m.channelId === channelId);
      resolve(messages);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Fetches the AI-generated summary for a specific channel
 * @param channelId - The ID of the channel
 * @returns Promise that resolves with the AI summary or undefined
 */
export const fetchAiSummary = (channelId: string): Promise<AiSummary | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary = AI_SUMMARIES.find((s) => s.channelId === channelId);
      resolve(summary);
    }, AI_SIMULATED_DELAY_MS);
  });
};

/**
 * Posts a new message to a channel
 * @param message - The message data (without id and timestamp)
 * @returns Promise that resolves with the created message
 */
export const postMessage = (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        ...message,
        id: `m${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      // In a real app, this would be added to the state/database.
      // For the mock, we just resolve with the created message.
      resolve(newMessage);
    }, SIMULATED_DELAY_MS);
  });
};

