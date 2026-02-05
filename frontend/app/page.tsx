"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [docId, setDocId] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleUploadComplete = (id: string, name: string) => {
    setDocId(id);
    setFilename(name);
  };

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/80 to-white/40 tracking-tight">
          A-RAG Visualizer
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Benchmark <span className="text-blue-300 font-semibold">Standard RAG</span> vs{" "}
          <span className="text-purple-300 font-semibold">Agentic RAG</span> in real-time.
          Upload a PDF to see the difference in reasoning and retrieval quality.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="w-full transition-all duration-500">
        {!docId ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <UploadZone onUploadComplete={handleUploadComplete} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8 animate-in slide-in-from-top-4 duration-500">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/80">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Active Document: <span className="font-semibold text-white">{filename}</span>
                <button
                  onClick={() => setDocId(null)}
                  className="ml-2 hover:text-red-300 transition-colors"
                  title="Remove file"
                >
                  ×
                </button>
              </span>
            </div>

            <ChatInterface docId={docId} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-white/20 text-sm">
        <p>Built for Agentic RAG Benchmarking</p>
      </footer>
    </main>
  );
}
