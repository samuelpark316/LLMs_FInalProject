"use client";

import { Sidebar } from "../components/layout/Sidebar";
import { ChatView } from "../components/layout/ChatView";
import { TopBar } from "../components/layout/TopBar";
import { SearchDropdown } from "../components/ui/SearchDropdown";
import { SearchModal } from "../components/ui/SearchModal";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspace } from "../contexts/WorkspaceContext";
import AuthPage from "../components/AuthPage";
import { LeftIconBar } from '../components/layout/LeftIconBar';


export default function Home() {
  const { user } = useAuth();
  const { isSearchDropdownOpen, isSearchModalOpen, closeSearchDropdown, openSearchModal, closeSearchModal } = useWorkspace();

  // If not logged in, show the auth page
  if (!user) {
    return <AuthPage />;
  }

  // Once logged in, show the main app
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftIconBar />
        <Sidebar />
        <ChatView />
      </div>
      
      {/* Search Components */}
      <SearchDropdown 
        isOpen={isSearchDropdownOpen} 
        onClose={closeSearchDropdown}
        onOpenFullSearch={openSearchModal}
      />
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal}
      />
    </div>
  );
}
