'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Hash } from 'lucide-react';
import { Message as MessageType, Channel } from '../../types';
import { USERS, CHANNELS, MESSAGES } from '../../constants/mockData';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullSearch: (query: string) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose, onOpenFullSearch }) => {
  const { setSelectedChannelId } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    channels: Channel[];
    messages: MessageType[];
  }>({ channels: [], messages: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions({ channels: [], messages: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Find matching channels
    const matchingChannels = CHANNELS.filter(channel => 
      channel.name.toLowerCase().includes(query) ||
      channel.description?.toLowerCase().includes(query)
    ).slice(0, 3);

    // Find matching messages (limited preview)
    const matchingMessages = MESSAGES.filter(message => 
      message.content.toLowerCase().includes(query)
    ).slice(0, 3);

    setSuggestions({
      channels: matchingChannels,
      messages: matchingMessages
    });
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && searchQuery.trim()) {
      onOpenFullSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onOpenFullSearch(searchQuery);
    }
  };

  const handleChannelClick = (channelId: string) => {
    setSelectedChannelId(channelId);
    onClose();
  };

  const getChannelName = (channelId: string) => {
    const channel = CHANNELS.find(ch => ch.id === channelId);
    if (!channel) return '';
    return channelId.startsWith('dm_') ? `${channel.name}` : `#${channel.name}`;
  };

  const getUserName = (userId: string) => {
    const user = USERS.find(u => u.id === userId);
    return user?.name || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[44px] left-0 right-0 bottom-0 z-50" onClick={onClose}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[680px] mt-2">
        <div 
          className="bg-[#1A1D21] rounded-lg shadow-2xl border border-[#565856]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#565856]">
            <Search size={18} className="text-[#D1D2D3]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder-[#ABABAD]"
            />
            {searchQuery && (
              <>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 text-[13px] text-[#D1D2D3] hover:text-white border border-[#565856] rounded hover:bg-[#232529] transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1 text-[13px] text-white hover:text-white rounded transition-colors"
                >
                  ✕
                </button>
              </>
            )}
          </div>

          {/* Suggestions/Results */}
          <div className="max-h-[500px] overflow-y-auto">
            {!searchQuery && (
              <div className="px-4 py-8 text-center text-[#ABABAD] text-[14px]">
                Start typing to search...
              </div>
            )}

            {searchQuery && (
              <>
                {/* Search for "query" option */}
                <div
                  onClick={handleSearchClick}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#232529] cursor-pointer border-b border-[#2C2D31]"
                >
                  <Search size={18} className="text-[#D1D2D3]" />
                  <div>
                    <div className="text-white text-[15px]">
                      <span className="bg-[#444] px-1 rounded">{searchQuery}</span>
                    </div>
                    <div className="text-[#ABABAD] text-[13px]">Search for this</div>
                  </div>
                  <div className="ml-auto text-[#ABABAD] text-[13px] px-2 py-1 border border-[#565856] rounded">
                    Enter
                  </div>
                </div>

                {/* Channel suggestions */}
                {suggestions.channels.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[#ABABAD] text-[12px] font-semibold uppercase">
                      Channels
                    </div>
                    {suggestions.channels.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => handleChannelClick(channel.id)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#232529] cursor-pointer"
                      >
                        <Hash size={18} className="text-[#D1D2D3]" />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-[15px] font-medium">{channel.name}</div>
                          {channel.description && (
                            <div className="text-[#ABABAD] text-[13px] truncate">
                              {channel.description}
                            </div>
                          )}
                          <div className="text-[#ABABAD] text-[12px] mt-0.5">
                            {channel.id.startsWith('dm_') ? 'Direct message' : 'Not in channel'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message preview - shows there are results */}
                {suggestions.messages.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[#ABABAD] text-[12px] font-semibold uppercase">
                      Messages
                    </div>
                    {suggestions.messages.slice(0, 1).map((message) => {
                      const user = USERS.find(u => u.id === message.userId);
                      const channel = getChannelName(message.channelId);
                      
                      return (
                        <div
                          key={message.id}
                          onClick={handleSearchClick}
                          className="px-4 py-2.5 hover:bg-[#232529] cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-[14px] font-medium">{user?.name}</span>
                            <span className="text-[#ABABAD] text-[13px]">{channel}</span>
                          </div>
                          <div className="text-[#D1D2D3] text-[14px] line-clamp-2">
                            {message.content}
                          </div>
                        </div>
                      );
                    })}
                    {suggestions.messages.length > 1 && (
                      <div
                        onClick={handleSearchClick}
                        className="px-4 py-2 text-[#1164A3] text-[13px] hover:underline cursor-pointer"
                      >
                        See all {suggestions.messages.length} message results →
                      </div>
                    )}
                  </div>
                )}

                {/* No results */}
                {searchQuery && suggestions.channels.length === 0 && suggestions.messages.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <div className="text-[#D1D2D3] text-[15px] mb-1">No results found</div>
                    <div className="text-[#ABABAD] text-[13px]">
                      Try different keywords
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-[#565856] bg-[#232529] text-[12px] text-[#ABABAD] flex items-center justify-between">
            <span>↑↓ Select</span>
            <span className="text-[#1164A3] hover:underline cursor-pointer">Give feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
};

