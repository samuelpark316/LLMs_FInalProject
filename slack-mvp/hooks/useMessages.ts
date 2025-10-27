import { useState, useEffect } from 'react';
import { fetchChannelMessages } from '../api/mockApi';
import { Message } from '../types';

/**
 * Custom hook for managing channel messages
 * @param channelId - The ID of the channel to fetch messages for
 * @returns Object containing messages, loading state, and helper functions
 */
export const useMessages = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const channelMessages = await fetchChannelMessages(channelId);
        setMessages(channelMessages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load messages'));
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [channelId]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m))
    );
  };

  return {
    messages,
    isLoading,
    error,
    addMessage,
    removeMessage,
    updateMessage,
  };
};

