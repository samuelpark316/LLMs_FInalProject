'use client';

import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { postMessage } from '../../api/mockApi';
import { Message } from '../../types';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface MessageInputProps {
  channelId: string;
  onMessageSent: (message: Message) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ channelId, onMessageSent }) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { currentUserId } = useWorkspace();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || isSending) return;

    const trimmedMessage = messageText.trim();
    setMessageText('');
    setIsSending(true);

    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      userId: currentUserId,
      channelId,
      timestamp: new Date().toISOString(),
      content: trimmedMessage,
    };

    // Immediately show the message to the user
    onMessageSent(optimisticMessage);

    try {
      // Send to "backend"
      const newMessage = await postMessage({
        userId: currentUserId,
        channelId,
        content: trimmedMessage,
      });

      // In a real app, you'd update the optimistic message with the real one
      // For this demo, the optimistic message is sufficient
    } catch (error) {
      console.error('Failed to send message:', error);
      // In a real app, you'd show an error and potentially remove the optimistic message
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-border-subtle px-4 py-4 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={`Message #${channelId}`}
          className="flex-1 px-4 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!messageText.trim() || isSending}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-[#2bb0d6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

