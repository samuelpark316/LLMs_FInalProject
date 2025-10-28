'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { CHANNELS, USERS } from '../../constants/mockData';
import { fetchChannelMessages, fetchAiSummary } from '../../api/mockApi';
import { Message as MessageComponent } from '../ui/Message';
import { MessageInput } from './MessageInput';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { Message as MessageType } from '../../types';

export const ChatView: React.FC = () => {
  const { selectedChannelId, toggleSidebar } = useWorkspace();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChannel = CHANNELS.find((ch) => ch.id === selectedChannelId);
  const isDm = selectedChannelId.startsWith('dm_');
  const dmUserId = isDm ? selectedChannelId.replace('dm_', '') : '';
  const dmUser = isDm ? USERS.find((u) => u.id === dmUserId) : undefined;

  // Fetch messages when channel changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoadingMessages(true);
      const channelMessages = await fetchChannelMessages(selectedChannelId);
      setMessages(channelMessages);
      setIsLoadingMessages(false);
    };

    loadMessages();
  }, [selectedChannelId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageSent = (newMessage: MessageType) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSummarizeClick = async () => {
    setIsSummaryModalOpen(true);
    setIsLoadingSummary(true);
    setSummaryContent('');

    const summary = await fetchAiSummary(selectedChannelId);
    setIsLoadingSummary(false);

    if (summary) {
      setSummaryContent(summary.content);
    } else {
      setSummaryContent('No summary available for this channel.');
    }
  };

  const handleCloseSummaryModal = () => {
    setIsSummaryModalOpen(false);
    setSummaryContent('');
  };

  // Helper function to render markdown-like content
  const renderSummaryContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headings
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-[18px] font-bold text-white mt-0 mb-3">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        // Check for emoji at start
        const emojiMatch = text.match(/^([\u{1F300}-\u{1F9FF}])\s*/u);
        return (
          <h2 key={index} className="text-[15px] font-bold text-white mt-4 mb-2 flex items-center gap-2">
            {emojiMatch && <span className="text-[16px]">{emojiMatch[1]}</span>}
            <span>{text.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, '')}</span>
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-[14px] font-semibold text-white mt-3 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bullet points
      if (line.startsWith('- ')) {
        const content = line.replace('- ', '');
        // Check if line contains bold text
        if (content.includes('**')) {
          const parts = content.split('**');
          return (
            <li key={index} className="ml-5 text-[14px] text-[#D1D2D3] mb-1 leading-relaxed list-disc">
              {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part))}
            </li>
          );
        }
        return (
          <li key={index} className="ml-5 text-[14px] text-[#D1D2D3] mb-1 leading-relaxed list-disc">
            {content}
          </li>
        );
      }
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="text-[14px] text-[#D1D2D3] mb-1 leading-relaxed">
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part))}
          </p>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular text
      return (
        <p key={index} className="text-[14px] text-[#D1D2D3] mb-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  if (!selectedChannel) {
    return <div className="flex-1 flex items-center justify-center">Channel not found</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#1A1D21]">
      {/* Header */}
      <header className="flex flex-col border-b border-[#565856] bg-[#1A1D21]">
        {/* Top bar */}
        <div className="h-[44px] flex items-center justify-between px-5 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
            >
              <Menu size={20} className="text-[#D1D2D3]" />
            </button>

            {/* History buttons */}
            <div className="hidden sm:flex items-center gap-1">
              <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#D1D2D3]">
                  <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#D1D2D3]">
                  <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-[732px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Golden"
                  className="w-full h-[28px] px-3 pr-8 bg-[#522653] border border-transparent hover:border-[#663F68] focus:border-[#1164A3] focus:shadow-[0_0_0_1px_#1164A3] rounded text-[13px] placeholder-[#D1D2D3] text-[#D1D2D3] outline-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <kbd className="text-[12px] text-[#D1D2D3] font-normal">⌘</kbd>
                  <kbd className="text-[12px] text-[#D1D2D3] font-normal">K</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 mr-4">
            {/* AI Summarize button */}
            <button
              onClick={handleSummarizeClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A5A] text-white rounded hover:bg-[#148567] transition-colors text-[13px] font-medium"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">Summarize</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>

        {/* Channel info */}
        <div className="h-[44px] flex items-center justify-between px-5 border-b border-[#565856]">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 py-1 px-2 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors group">
              {isDm ? (
                <span className="text-[18px] font-black text-white">@ {dmUser?.name || selectedChannel.name}</span>
              ) : (
                <span className="text-[18px] font-black text-white"># {selectedChannel.name}</span>
              )}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#D1D2D3]">
                <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-[#232529]">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size={32} text="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="py-2 pb-4">
            {messages.map((message) => {
              const user = USERS.find((u) => u.id === message.userId);
              if (!user) return null;
              return <MessageComponent key={message.id} message={message} user={user} />;
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <MessageInput channelId={selectedChannelId} channelName={selectedChannel.name} onMessageSent={handleMessageSent} />

      {/* AI Summary Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={handleCloseSummaryModal}
        title={`AI Summary: #${selectedChannel.name}`}
        maxWidth="2xl"
      >
        {isLoadingSummary ? (
          <div className="py-12">
            <LoadingSpinner size={40} text="Analyzing channel messages..." />
          </div>
        ) : (
          <div className="max-w-none leading-relaxed">{renderSummaryContent(summaryContent)}</div>
        )}
      </Modal>
    </div>
  );
};

