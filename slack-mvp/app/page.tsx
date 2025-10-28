import { LeftIconBar } from '../components/layout/LeftIconBar';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatView } from '../components/layout/ChatView';

export default function Home() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <LeftIconBar />
      <Sidebar />
      <ChatView />
    </div>
  );
}
