import React from 'react';
import { Message as MessageType, User } from '../../types';
import { formatTimestamp, parseMessageContent } from '../../utils/formatters';
import Image from 'next/image';

interface MessageProps {
  message: MessageType;
  user: User;
  isOptimistic?: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, user, isOptimistic = false }) => {
  const segments = parseMessageContent(message.content);

  return (
    <div
      className={`flex gap-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
        isOptimistic ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10">
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={40}
          height={40}
          className="rounded"
        />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Header: Name and timestamp */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-text-primary text-sm">{user.name}</span>
          <span className="text-xs text-text-secondary">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message text with mentions */}
        <div className="text-text-primary text-sm leading-relaxed">
          {segments.map((segment, index) => (
            <span
              key={index}
              className={segment.isMention ? 'bg-blue-100 text-accent font-medium px-1 rounded' : ''}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

