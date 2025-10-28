import React, { useState } from 'react';
import { Message as MessageType, User } from '../../types';
import { formatTimestamp, parseMessageContent } from '../../utils/formatters';
import Image from 'next/image';
import { Smile, MessageSquare, Bookmark, MoreHorizontal } from 'lucide-react';

interface MessageProps {
  message: MessageType;
  user: User;
  isOptimistic?: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, user, isOptimistic = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const segments = parseMessageContent(message.content);

  return (
    <div
      className={`group flex gap-3 px-4 py-2 hover:bg-[rgba(255,255,255,0.04)] transition-colors relative ${
        isOptimistic ? 'opacity-60' : 'opacity-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Header: Name and timestamp */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-bold text-white text-[15px] hover:underline cursor-pointer">{user.name}</span>
          <span className="text-[12px] text-[#ABABAD]">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message text with mentions */}
        <div className="text-[#D1D2D3] text-[15px] leading-[1.46668] break-words">
          {segments.map((segment, index) => (
            <span
              key={index}
              className={segment.isMention ? 'bg-[#1264A3] text-white font-medium px-1 rounded hover:bg-[#0B4C8C] cursor-pointer' : ''}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>

      {/* Hover toolbar - Slack style */}
      {isHovered && !isOptimistic && (
        <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#1A1D21] border border-[#565856] rounded-lg shadow-lg flex items-center divide-x divide-[#565856]">
          <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors" title="Add reaction">
            <Smile size={16} className="text-[#D1D2D3]" />
          </button>
          <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors" title="Reply in thread">
            <MessageSquare size={16} className="text-[#D1D2D3]" />
          </button>
          <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors" title="Save for later">
            <Bookmark size={16} className="text-[#D1D2D3]" />
          </button>
          <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded-r-lg" title="More actions">
            <MoreHorizontal size={16} className="text-[#D1D2D3]" />
          </button>
        </div>
      )}
    </div>
  );
};

