'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CURRENT_USER_ID, CHANNELS } from '../constants/mockData';

interface WorkspaceContextType {
  currentUserId: string;
  selectedChannelId: string;
  setSelectedChannelId: (channelId: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isSearchDropdownOpen: boolean;
  isSearchModalOpen: boolean;
  searchQuery: string;
  openSearchDropdown: () => void;
  closeSearchDropdown: () => void;
  openSearchModal: (query?: string) => void;
  closeSearchModal: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(CHANNELS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSearchDropdown = () => {
    setIsSearchDropdownOpen(true);
    setIsSearchModalOpen(false);
  };

  const closeSearchDropdown = () => {
    setIsSearchDropdownOpen(false);
  };

  const openSearchModal = (query: string = '') => {
    setSearchQuery(query);
    setIsSearchDropdownOpen(false);
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const value: WorkspaceContextType = {
    currentUserId: CURRENT_USER_ID,
    selectedChannelId,
    setSelectedChannelId,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    isSearchDropdownOpen,
    isSearchModalOpen,
    searchQuery,
    openSearchDropdown,
    closeSearchDropdown,
    openSearchModal,
    closeSearchModal,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

