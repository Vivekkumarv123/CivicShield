import React from "react";
import { ChatInterface } from "../components/ChatInterface";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-cyan-50 to-white selection:bg-blue-100 font-sans">
      <ChatInterface />
    </main>
  );
}
