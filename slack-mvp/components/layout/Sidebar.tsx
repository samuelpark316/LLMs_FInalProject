'use client';

import React from 'react';
import { Hash, User } from 'lucide-react';
import { CHANNELS, USERS, CURRENT_USER_ID } from '../../constants/mockData';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export const Sidebar: React.FC = () => {
  const { selectedChannelId, setSelectedChannelId, isSidebarOpen, closeSidebar } = useWorkspace();

  const handleChannelClick = (channelId: string) => {
    setSelectedChannelId(channelId);
    closeSidebar(); // Close sidebar on mobile after selection
  };

  // Filter out current user from DM list
  const dmUsers = USERS.filter((user) => user.id !== CURRENT_USER_ID);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-primary-dark text-text-inverted
          flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Workspace name */}
        <div className="px-4 py-5 border-b border-gray-700">
          <h1 className="text-lg font-bold text-white">My Workspace</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Channels section */}
          <div className="mb-6">
            <div className="px-4 mb-2">
              <h2 className="text-sm font-semibold text-text-inverted opacity-70">Channels</h2>
            </div>
            <div className="space-y-0.5">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className={`
                    w-full flex items-center gap-2 px-4 py-1.5
                    hover:bg-gray-700 transition-colors text-left
                    ${
                      selectedChannelId === channel.id
                        ? 'bg-accent text-white font-semibold'
                        : 'text-text-inverted'
                    }
                  `}
                >
                  <Hash size={18} className="flex-shrink-0" />
                  <span className="text-sm truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages section */}
          <div>
            <div className="px-4 mb-2">
              <h2 className="text-sm font-semibold text-text-inverted opacity-70">
                Direct Messages
              </h2>
            </div>
            <div className="space-y-0.5">
              {dmUsers.map((user) => (
                <button
                  key={user.id}
                  className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-gray-700 transition-colors text-left text-text-inverted"
                >
                  <User size={18} className="flex-shrink-0" />
                  <span className="text-sm truncate">{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

