'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { Message as MessageType, User, Channel } from '../../types';
import { USERS, CHANNELS } from '../../constants/mockData';
import { searchWorkspace } from '../../api/mockApi';
import { formatTimestamp } from '../../utils/formatters';
import Image from 'next/image';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'messages' | 'files';
type SortType = 'relevant' | 'newest' | 'oldest';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { setSelectedChannelId, searchQuery: initialQuery } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MessageType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('messages');
  const [sortType, setSortType] = useState<SortType>('relevant');
  const [selectedFromUser, setSelectedFromUser] = useState<string>('');
  const [selectedInChannel, setSelectedInChannel] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and set initial query when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, initialQuery]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const searchResults = await searchWorkspace({
        query: searchQuery,
        fromUserId: selectedFromUser,
        inChannelId: selectedInChannel,
        sortBy: sortType,
      });
      setResults(searchResults);
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedFromUser, selectedInChannel, sortType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (message: MessageType) => {
    setSelectedChannelId(message.channelId);
    onClose();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <span key={index} className="bg-[#F2C744] text-[#1A1D21] font-semibold px-0.5 rounded">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getChannelName = (channelId: string) => {
    const channel = CHANNELS.find((ch) => ch.id === channelId);
    if (!channel) return channelId;
    
    if (channelId.startsWith('dm_')) {
      return channel.name;
    }
    return `# ${channel.name}`;
  };

  const clearFilters = () => {
    setSelectedFromUser('');
    setSelectedInChannel('');
    setSortType('relevant');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[44px] left-[328px] right-0 bottom-0 z-40 flex flex-col bg-[#1A1D21]">
      {/* Search Header Bar */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[#565856] bg-[#232529]">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-[15px] font-bold text-white">Search:</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder-[#ABABAD]"
          />
        </div>
        <button
          onClick={onClose}
          className="text-[#1164A3] hover:underline text-[13px] font-medium"
        >
          Give feedback
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#565856] bg-[#1A1D21]">
          {/* Filter Type Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-2 py-1.5 rounded text-[13px] bg-[#232529] text-white border border-[#565856] hover:bg-[#2C2D31] outline-none cursor-pointer font-medium flex items-center gap-2"
          >
            <option value="messages">📨 Messages</option>
          </select>

          {/* From Filter */}
          <select
            value={selectedFromUser}
            onChange={(e) => setSelectedFromUser(e.target.value)}
            className="px-2 py-1.5 rounded text-[13px] bg-[#232529] text-white border border-[#565856] hover:bg-[#2C2D31] outline-none cursor-pointer"
          >
            <option value="">From</option>
            {USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {/* In Filter */}
          <select
            value={selectedInChannel}
            onChange={(e) => setSelectedInChannel(e.target.value)}
            className="px-2 py-1.5 rounded text-[13px] bg-[#232529] text-white border border-[#565856] hover:bg-[#2C2D31] outline-none cursor-pointer"
          >
            <option value="">In</option>
            {CHANNELS.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.id.startsWith('dm_') ? `${channel.name}` : `${channel.name}`}
              </option>
            ))}
          </select>

          {/* Only my channels button */}
          <button className="px-3 py-1.5 rounded text-[13px] bg-[#232529] text-white border border-[#565856] hover:bg-[#2C2D31] transition-colors">
            Only my channels
          </button>

          {/* Exclude automations button */}
          <button className="px-3 py-1.5 rounded text-[13px] bg-[#232529] text-white border border-[#565856] hover:bg-[#2C2D31] transition-colors">
            Exclude automations
          </button>

          {/* Filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1.5 rounded text-[13px] bg-[#232529] text-[#1164A3] border border-[#565856] hover:bg-[#2C2D31] transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Sort Filter - Right aligned */}
          <div className="ml-auto">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="px-2 py-1.5 rounded text-[13px] bg-[#232529] text-white border border-[#565856] hover:bg-[#2C2D31] outline-none cursor-pointer"
            >
              <option value="relevant">Sort: Most relevant (default)</option>
              <option value="newest">Sort: Newest first</option>
              <option value="oldest">Sort: Oldest first</option>
            </select>
          </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="px-5 py-2.5 text-[13px] text-[#D1D2D3] bg-[#1A1D21]">
          {isSearching ? (
            'Searching...'
          ) : (
            <span>
              <strong className="text-white">{results.length}</strong> {results.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto bg-[#1A1D21]">
          {!searchQuery && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Search size={48} className="text-[#565856] mb-4" />
              <p className="text-[15px] text-[#D1D2D3] mb-2">Search your workspace</p>
              <p className="text-[13px] text-[#ABABAD]">Find messages, files, and channels</p>
            </div>
          )}

          {searchQuery && results.length === 0 && !isSearching && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <p className="text-[15px] text-[#D1D2D3] mb-2">No results found</p>
              <p className="text-[13px] text-[#ABABAD]">Try different keywords or adjust your filters</p>
            </div>
          )}

          {results.map((message) => {
            const user = USERS.find((u) => u.id === message.userId);
            if (!user) return null;

            const channelName = getChannelName(message.channelId);

            return (
              <div
                key={message.id}
                onClick={() => handleResultClick(message)}
                className="flex gap-3 px-5 py-4 hover:bg-[#232529] cursor-pointer border-b border-[#2C2D31] transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-9 h-9 mt-0.5">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header - Single line with all info */}
                  <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                    <span className="font-bold text-white text-[15px]">{user.name}</span>
                    <span className="text-[13px] text-[#ABABAD]">{channelName}</span>
                    <span className="text-[13px] text-[#ABABAD]">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>

                  {/* Message content with highlighting */}
                  <div className="text-[#D1D2D3] text-[15px] leading-[1.46668] break-words">
                    {highlightText(message.content, searchQuery)}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

