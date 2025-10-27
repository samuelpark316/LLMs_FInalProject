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
      className={`group flex gap-3 px-5 py-2 hover:bg-[#F8F8F8] transition-colors relative ${
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
          <span className="font-bold text-[#1D1C1D] text-[15px] hover:underline cursor-pointer">{user.name}</span>
          <span className="text-[12px] text-[#616061]">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message text with mentions */}
        <div className="text-[#1D1C1D] text-[15px] leading-[1.46668] break-words">
          {segments.map((segment, index) => (
            <span
              key={index}
              className={segment.isMention ? 'bg-[#E8F5FA] text-[#1264A3] font-bold px-0.5 rounded hover:bg-[#D3EFFB] cursor-pointer' : ''}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>

      {/* Hover toolbar - Slack style */}
      {isHovered && !isOptimistic && (
        <div className="absolute top-0 right-5 transform -translate-y-1/2 bg-white border border-[#E0E0E0] rounded-lg shadow-lg flex items-center divide-x divide-[#E0E0E0]">
          <button className="p-2 hover:bg-gray-100 transition-colors" title="Add reaction">
            <Smile size={16} className="text-[#1D1C1D]" />
          </button>
          <button className="p-2 hover:bg-gray-100 transition-colors" title="Reply in thread">
            <MessageSquare size={16} className="text-[#1D1C1D]" />
          </button>
          <button className="p-2 hover:bg-gray-100 transition-colors" title="Save for later">
            <Bookmark size={16} className="text-[#1D1C1D]" />
          </button>
          <button className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg" title="More actions">
            <MoreHorizontal size={16} className="text-[#1D1C1D]" />
          </button>
        </div>
      )}
    </div>
  );
};

