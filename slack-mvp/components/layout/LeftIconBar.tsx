'use client';

import React from 'react';
import { Home, MessageSquare, AtSign, Bookmark, FileText, MoreHorizontal, Plus } from 'lucide-react';

export const LeftIconBar: React.FC = () => {
  return (
    <div
      className="hidden lg:flex w-[72px] flex-col items-center pt-3 pb-3 gap-1 flex-shrink-0 border-r border-[#2B2C31]"
      style={{ background: 'linear-gradient(180deg, #3F0E40 0%, #2C0432 100%)' }}
    >
      {/* Workspace avatar - Golden */}
      <button className="w-[36px] h-[36px] rounded-lg bg-white flex items-center justify-center mb-3 mt-5 hover:rounded-xl transition-all duration-100 group relative">
        <span className="text-[#3F0E40] text-[16px] font-bold">G</span>
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Golden
        </div>
      </button>

      {/* Main navigation icons */}
      <button className="w-[36px] h-[36px] rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors group relative">
        <Home size={20} className="text-white" />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Home
        </div>
      </button>

      <button className="w-[36px] h-[36px] rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors group relative">
        <MessageSquare size={20} className="text-white" />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          DMs
        </div>
      </button>

      <button className="w-[36px] h-[36px] rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors group relative">
        <AtSign size={20} className="text-white" />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Activity
        </div>
      </button>

      <button className="w-[36px] h-[36px] rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors group relative">
        <Bookmark size={20} className="text-white" />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Later
        </div>
      </button>

      <button className="w-[36px] h-[36px] rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors group relative">
        <MoreHorizontal size={20} className="text-white" />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          More
        </div>
      </button>

      {/* Spacer to push profile to bottom */}
      <div className="flex-1"></div>

      {/* User profile at bottom */}
      <button className="w-[36px] h-[36px] rounded hover:rounded-xl transition-all duration-100 group relative mb-4 overflow-hidden">
        <img 
          src="/Ronit.jpeg" 
          alt="Ronit Batra"
          className="w-full h-full object-cover"
        />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[12px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Ronit Batra (you)
        </div>
      </button>
    </div>
  );
};

