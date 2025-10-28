"use client";

import React from "react";
import {
  Hash,
  ChevronDown,
  Plus,
  MessageSquare,
  Clock,
  Bookmark,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import { CHANNELS, USERS, CURRENT_USER_ID } from "../../constants/mockData";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar: React.FC = () => {
  const {
    selectedChannelId,
    setSelectedChannelId,
    isSidebarOpen,
    closeSidebar,
  } = useWorkspace();
  const { user, logout } = useAuth();

  const handleChannelClick = (channelId: string) => {
    setSelectedChannelId(channelId);
    closeSidebar();
  };

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

      {/* Sidebar - Slack Aubergine Theme */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[260px] flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{ backgroundColor: "#4D394B" }}
      >
        {/* Workspace Header */}
        <div className="px-4 py-3 border-b border-[#3E313C]">
          <button className="w-full flex items-center justify-between text-white hover:bg-[#3E313C] rounded px-2 py-1 transition-colors">
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-bold">My Workspace</span>
            </div>
            <ChevronDown size={18} className="text-white opacity-70" />
          </button>
        </div>

        {/* New Message Button */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-white text-[#1D1C1D] rounded-md hover:bg-gray-100 transition-colors text-sm font-bold">
            <MessageSquare size={18} />
            <span>New message</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors">
            <Clock size={18} />
            <span className="text-[15px]">Activity</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors">
            <Bookmark size={18} />
            <span className="text-[15px]">Later</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors">
            <MoreHorizontal size={18} />
            <span className="text-[15px]">More</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {/* Channels section */}
          <div className="mb-4">
            <button className="w-full flex items-center gap-2 px-3 py-1 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors">
              <ChevronDown size={14} />
              <span className="text-[13px] font-bold">Channels</span>
            </button>
            <div className="mt-1 space-y-px">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-1
                    rounded transition-colors text-left group
                    ${
                      selectedChannelId === channel.id
                        ? "bg-[#38978D] text-white font-bold"
                        : "text-[#D1B8CF] hover:bg-[#3E313C]"
                    }
                  `}
                >
                  <Hash size={16} className="shrink-0" />
                  <span className="text-[15px] truncate flex-1">
                    {channel.name}
                  </span>
                </button>
              ))}
              <button className="w-full flex items-center gap-2 px-3 py-1 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors text-[15px]">
                <Plus size={16} />
                <span>Add channels</span>
              </button>
            </div>
          </div>

          {/* Direct Messages section */}
          <div>
            <button className="w-full flex items-center gap-2 px-3 py-1 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors">
              <ChevronDown size={14} />
              <span className="text-[13px] font-bold">Direct messages</span>
            </button>
            <div className="mt-1 space-y-px">
              {dmUsers.map((user) => (
                <button
                  key={user.id}
                  className="w-full flex items-center gap-2 px-3 py-1 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors text-left"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="text-[15px] truncate">{user.name}</span>
                </button>
              ))}
              <button className="w-full flex items-center gap-2 px-3 py-1 text-[#D1B8CF] hover:bg-[#3E313C] rounded transition-colors text-[15px]">
                <Plus size={16} />
                <span>Add teammates</span>
              </button>
            </div>
          </div>
        </div>

        {/* User section with logout - Fixed at bottom */}
        <div className="px-3 py-3 border-t border-[#3E313C]">
          <div className="flex items-center justify-between px-3 py-2 bg-[#3E313C] rounded">
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-white truncate">
                {user?.email || "User"}
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
