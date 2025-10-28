"use client";

import { Sidebar } from "../components/layout/Sidebar";
import { ChatView } from "../components/layout/ChatView";
import { useAuth } from "../contexts/AuthContext";
import AuthPage from "../components/AuthPage";

export default function Home() {
  const { user } = useAuth();

  // If not logged in, show the auth page
  if (!user) {
    return <AuthPage />;
  }

  // Once logged in, show the main app
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ChatView />
    </div>
  );
}
