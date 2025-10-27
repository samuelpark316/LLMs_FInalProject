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
          <h1 key={index} className="text-2xl font-bold text-text-primary mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold text-text-primary mt-4 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-text-primary mt-3 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bullet points
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-text-primary mb-1">
            {line.replace('- ', '')}
          </li>
        );
      }
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="text-text-primary mb-1">
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
          </p>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular text
      return (
        <p key={index} className="text-text-primary mb-1">
          {line}
        </p>
      );
    });
  };

  if (!selectedChannel) {
    return <div className="flex-1 flex items-center justify-center">Channel not found</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-primary-light">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-white">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Menu size={20} className="text-text-primary" />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              # {selectedChannel.name}
            </h2>
            <p className="text-xs text-text-secondary">{selectedChannel.description}</p>
          </div>
        </div>

        {/* AI Summarize button */}
        <button
          onClick={handleSummarizeClick}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-[#2bb0d6] transition-colors text-sm font-medium"
        >
          <Sparkles size={18} />
          <span className="hidden sm:inline">Summarize Channel</span>
          <span className="sm:hidden">AI</span>
        </button>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size={32} text="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="py-4">
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
      <MessageInput channelId={selectedChannelId} onMessageSent={handleMessageSent} />

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
          <div className="prose prose-sm max-w-none">{renderSummaryContent(summaryContent)}</div>
        )}
      </Modal>
    </div>
  );
};

