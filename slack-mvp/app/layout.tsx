import type { Metadata } from "next";
import "./globals.css";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";

export const metadata: Metadata = {
  title: "Slack MVP - Communication into Knowledge",
  description: "A simplified team communication platform with AI-powered summarization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </body>
    </html>
  );
}
