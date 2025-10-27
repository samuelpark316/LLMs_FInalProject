'use client';

import React, { useState, FormEvent } from 'react';
import { Send, Smile, AtSign, Paperclip, Bold, Italic } from 'lucide-react';
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

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      userId: currentUserId,
      channelId,
      timestamp: new Date().toISOString(),
      content: trimmedMessage,
    };

    onMessageSent(optimisticMessage);

    try {
      await postMessage({
        userId: currentUserId,
        channelId,
        content: trimmedMessage,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-5 pb-6 pt-3 bg-white">
      <form onSubmit={handleSubmit} className="relative">
        {/* Slack-style rounded input with shadow */}
        <div className="relative border border-[#E0E0E0] rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Message #project-alpha"
            className="w-full px-3 py-2.5 pr-32 text-[15px] text-[#1D1C1D] placeholder-[#616061] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36C5F0] focus:border-transparent"
            disabled={isSending}
          />
          
          {/* Send button - inside input on right */}
          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#007A5A] text-white rounded hover:bg-[#006644] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Formatting toolbar */}
        <div className="flex items-center gap-1 mt-2 px-2">
          <button
            type="button"
            className="p-1.5 text-[#616061] hover:bg-gray-100 rounded transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-[#616061] hover:bg-gray-100 rounded transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button
            type="button"
            className="p-1.5 text-[#616061] hover:bg-gray-100 rounded transition-colors"
            title="Attach file"
          >
            <Paperclip size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-[#616061] hover:bg-gray-100 rounded transition-colors"
            title="Mention someone"
          >
            <AtSign size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 text-[#616061] hover:bg-gray-100 rounded transition-colors"
            title="Add emoji"
          >
            <Smile size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

