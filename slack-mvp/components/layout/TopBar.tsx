'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Search, HelpCircle, Minimize2, Maximize2, X } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export const TopBar: React.FC = () => {
  const { openSearchDropdown } = useWorkspace();

  const handleSearchClick = () => {
    openSearchDropdown();
  };

  return (
    <div className="h-11 bg-[#522653] flex items-center gap-3 border-b border-[#401A3F]">
      {/* Left section - Navigation - Aligned with chat content (328px from left) */}
      <div className="flex items-center gap-1 ml-[328px] pl-5">
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <ArrowLeft size={16} className="text-white" />
        </button>
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <ArrowRight size={16} className="text-white" />
        </button>
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <Clock size={16} className="text-white" />
        </button>
      </div>

      {/* Search bar - Center */}
      <div className="flex-1 max-w-[680px]">
        <button
          onClick={handleSearchClick}
          className="w-full h-[28px] pl-9 pr-16 bg-[#3F1E3E] border border-transparent hover:bg-[#4A2449] rounded text-[13px] text-left text-[#D1D2D3] relative transition-colors"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={16} className="text-[#D1D2D3]" />
          </div>
          <span className="text-[#D1D2D3]">Search Golden</span>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.1)] text-[11px] text-[#D1D2D3] rounded">⌘K</kbd>
          </div>
        </button>
      </div>

      {/* Right section - Window controls */}
      <div className="flex items-center gap-1 ml-auto pr-3">
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <HelpCircle size={16} className="text-white" />
        </button>
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <Minimize2 size={16} className="text-white" />
        </button>
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <Maximize2 size={16} className="text-white" />
        </button>
        <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors">
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

