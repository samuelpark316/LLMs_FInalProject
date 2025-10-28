'use client';

import React, { useState, FormEvent } from 'react';
import { Smile, AtSign, Bold, Italic, Strikethrough, Link2, List, ListOrdered, AlignLeft, Code } from 'lucide-react';
import { postMessage } from '../../api/mockApi';
import { Message } from '../../types';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface MessageInputProps {
  channelId: string;
  channelName?: string;
  onMessageSent: (message: Message) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ channelId, channelName, onMessageSent }) => {
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
    <div className="px-4 pb-4 pt-2 bg-[#1A1D21]">
      <form onSubmit={handleSubmit} className="relative">
        {/* Slack-style input box */}
        <div className="relative border border-[#565856] rounded-lg bg-[#1A1D21] focus-within:border-[#1164A3] focus-within:shadow-[0_0_0_1px_#1164A3] transition-all">
          {/* Formatting toolbar - Top */}
          <div className="flex items-center gap-0 px-2 py-1 border-b border-[#565856]">
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Bold"
            >
              <Bold size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Italic"
            >
              <Italic size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Strikethrough"
            >
              <Strikethrough size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Link"
            >
              <Link2 size={15} strokeWidth={2.5} />
            </button>
            <div className="w-px h-4 bg-[#565856] mx-1" />
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Ordered list"
            >
              <ListOrdered size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Bulleted list"
            >
              <List size={15} strokeWidth={2.5} />
            </button>
            <div className="w-px h-4 bg-[#565856] mx-1" />
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Quote"
            >
              <AlignLeft size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Code"
            >
              <Code size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
              title="Code block"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
              </svg>
            </button>
          </div>

          {/* Text input area */}
          <div className="relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`${channelId.startsWith('dm_') ? 'Message ' + (channelName || channelId) : 'Message #' + (channelName || channelId)}`}
              className="w-full px-3 py-2 text-[15px] text-white placeholder-[#ABABAD] outline-none bg-transparent"
              disabled={isSending}
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-0">
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Add attachment"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Format"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16M10 20h4M12 7v13"/>
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Emoji"
              >
                <Smile size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Mention"
              >
                <AtSign size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Video"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                  <polyline points="23 10 17 7 17 17 23 14 23 10"/>
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Voice message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
              </button>
            
            </div>

            {/* Right side - Send button */}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!messageText.trim() || isSending}
                className="p-1.5 bg-[#007A5A] text-white rounded hover:bg-[#148567] disabled:opacity-30 disabled:cursor-not-allowed transition-colors disabled:hover:bg-[#007A5A]"
                title="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-45 -translate-y-0.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Schedule send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

