"use client";

import React, { useState } from 'react';
import { Hash, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { CHANNELS, USERS, CURRENT_USER_ID } from '../../constants/mockData';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export const Sidebar: React.FC = () => {
  const { selectedChannelId, setSelectedChannelId, isSidebarOpen, closeSidebar, closeSearchModal, closeSearchDropdown } = useWorkspace();
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const currentUser = USERS.find((u) => u.id === CURRENT_USER_ID);
  const logout = () => {
    // Placeholder logout for demo; in a real app, call auth signOut
    console.log('Logout clicked');
  };

  const handleChannelClick = (channelId: string) => {
    setSelectedChannelId(channelId);
    closeSidebar(); // Close sidebar on mobile after selection
    closeSearchModal(); // Close search modal if open
    closeSearchDropdown(); // Close search dropdown if open
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
          w-[240px] bg-[#19171D] text-[#CFC9C2] pt-0 border-r border-[#2B2C31]
          flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Workspace name */}
        <div className="h-[52px] px-4 mt-3 flex items-center border-b border-[#2B2C31]">
          <button className="flex items-center justify-between w-full hover:bg-[rgba(255,255,255,0.06)] rounded px-2 py-1">
            <h1 className="text-[15px] font-bold text-white">Golden</h1>
            <span className="text-[20px] text-[#D1D2D3] font-light">⌄</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Channels section */}
          <div className="pt-3">
            <button 
              onClick={() => setChannelsExpanded(!channelsExpanded)}
              className="w-full flex items-center gap-1.5 px-3 py-[3px] hover:bg-[rgba(255,255,255,0.06)] rounded group"
            >
              {channelsExpanded ? (
                <ChevronDown size={14} className="text-[#ABABAD] group-hover:text-white flex-shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-[#ABABAD] group-hover:text-white flex-shrink-0" />
              )}
              <h2 className="text-[15px] font-normal text-[#ABABAD] group-hover:text-white">Channels</h2>
            </button>
            {channelsExpanded && (
              <div className="mt-[2px]">
                {CHANNELS.filter((ch) => !ch.id.startsWith('dm_')).map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelClick(channel.id)}
                    className={`
                      w-full flex items-center gap-1.5 pl-4 pr-3 py-[3px] text-left group
                      ${
                        selectedChannelId === channel.id
                          ? 'bg-[#1164A3] text-white'
                          : 'text-[#D1D2D3] hover:bg-[rgba(255,255,255,0.06)]'
                      }
                    `}
                  >
                    <Hash 
                      size={16} 
                      className={`flex-shrink-0 ${
                        selectedChannelId === channel.id ? 'opacity-100' : 'opacity-60'
                      }`} 
                    />
                    <span className="text-[15px] truncate font-normal">{channel.name}</span>
                  </button>
                ))}
                <button className="w-full flex items-center gap-1.5 pl-4 pr-3 py-[3px] text-left text-[#ABABAD] hover:text-white hover:bg-[rgba(255,255,255,0.06)] group">
                  <span className="text-[20px] leading-none flex-shrink-0">+</span>
                  <span className="text-[15px] font-normal">Add channels</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct Messages section */}
          <div className="pt-4">
            <button 
              onClick={() => setDmsExpanded(!dmsExpanded)}
              className="w-full flex items-center gap-1.5 px-3 py-[3px] hover:bg-[rgba(255,255,255,0.06)] rounded group"
            >
              {dmsExpanded ? (
                <ChevronDown size={14} className="text-[#ABABAD] group-hover:text-white flex-shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-[#ABABAD] group-hover:text-white flex-shrink-0" />
              )}
              <h2 className="text-[15px] font-normal text-[#ABABAD] group-hover:text-white">Direct messages</h2>
            </button>
            {dmsExpanded && (
              <div className="mt-[2px]">
                {dmUsers.map((user) => {
                  const dmChannelId = `dm_${user.id}`;
                  const isSelected = selectedChannelId === dmChannelId;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleChannelClick(dmChannelId)}
                      className={`w-full flex items-center gap-2 pl-4 pr-3 py-[3px] text-left group ${
                        isSelected ? 'bg-[#1164A3] text-white' : 'text-[#D1D2D3] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                      }`}
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-[15px] truncate font-normal">{user.name}</span>
                    </button>
                  );
                })}
                <button className="w-full flex items-center gap-1.5 pl-4 pr-3 py-[3px] text-left text-[#ABABAD] hover:text-white hover:bg-[rgba(255,255,255,0.06)] group">
                  <span className="text-[20px] leading-none flex-shrink-0">+</span>
                  <span className="text-[15px] font-normal">Invite people</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* User section with logout - Fixed at bottom */}
        <div className="px-3 py-3 border-t border-[#3E313C]">
          <div className="flex items-center justify-between px-3 py-2 bg-[#3E313C] rounded">
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-white truncate">
                {currentUser?.name || "User"}
              </span>
              <span className="text-[11px] text-[#D1B8CF]">Active</span>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-1.5 text-[#D1B8CF] hover:text-white hover:bg-[#4D394B] rounded transition-colors"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
