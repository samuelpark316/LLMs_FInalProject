import { Sidebar } from '../components/layout/Sidebar';
import { ChatView } from '../components/layout/ChatView';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ChatView />
    </div>
  );
}
