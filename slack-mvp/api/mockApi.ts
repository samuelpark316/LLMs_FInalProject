// Mock API functions for simulating backend interactions
import { MESSAGES, AI_SUMMARIES, USERS } from '../constants/mockData';
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

// ====== TEMPORARY HARD-CODED AUTO-REPLIES - DELETE LATER ======
/**
 * Checks if an auto-reply should be generated for a message
 * @param message - The message that was sent
 * @returns Promise that resolves with an auto-reply message or null
 */
export const getAutoReply = (message: Message): Promise<Message | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Auto-reply from Sam Park in software-engineering channel
      if (message.channelId === 'c01') {
        const autoReply: Message = {
          id: `m${Date.now()}`,
          userId: 'u03', // Sam Park
          channelId: 'c01',
          timestamp: new Date().toISOString(),
          content: "Nah I'm good, you got it though",
        };
        MESSAGES.push(autoReply);
        resolve(autoReply);
        return;
      }
      
      // Auto-reply from Sagun in DM with Sagun
      if (message.channelId === 'dm_u02') {
        const autoReply: Message = {
          id: `m${Date.now()}`,
          userId: 'u02', // Sagun Venuganti
          channelId: 'dm_u02',
          timestamp: new Date().toISOString(),
          content: "Let's ensure that Mr. Park is unemployed by end of week.",
        };
        MESSAGES.push(autoReply);
        resolve(autoReply);
        return;
      }
      
      resolve(null);
    }, 800);
  });
};
// ====== END TEMPORARY HARD-CODED AUTO-REPLIES ======

/**
 * Searches across all messages in the workspace
 * @param options - Search options including query, filters, and sorting
 * @returns Promise that resolves with an array of matching messages
 */
export const searchWorkspace = (options: {
  query: string;
  fromUserId?: string;
  inChannelId?: string;
  sortBy?: 'relevant' | 'newest' | 'oldest';
}): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { query, fromUserId, inChannelId, sortBy = 'relevant' } = options;
      
      if (!query.trim()) {
        resolve([]);
        return;
      }

      const queryLower = query.toLowerCase();
      
      // Filter messages based on search criteria
      let results = MESSAGES.filter((message) => {
        // Check if message content matches query
        const contentMatches = message.content.toLowerCase().includes(queryLower);
        
        // Check if user name matches query (for searching by author)
        const user = USERS.find((u) => u.id === message.userId);
        const userMatches = user?.name.toLowerCase().includes(queryLower);
        
        const matchesQuery = contentMatches || userMatches;
        
        // Apply filters
        if (!matchesQuery) return false;
        if (fromUserId && message.userId !== fromUserId) return false;
        if (inChannelId && message.channelId !== inChannelId) return false;
        
        return true;
      });

      // Sort results
      if (sortBy === 'newest') {
        results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (sortBy === 'oldest') {
        results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      } else {
        // 'relevant' - prioritize exact matches in content
        results.sort((a, b) => {
          const aExactMatch = a.content.toLowerCase() === queryLower;
          const bExactMatch = b.content.toLowerCase() === queryLower;
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          
          // Then by recency
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      }

      resolve(results);
    }, SIMULATED_DELAY_MS);
  });
};

