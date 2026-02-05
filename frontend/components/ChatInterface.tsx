"use client";

import { useState } from "react";
import MetricsChart from "./MetricsChart";

interface ChatInterfaceProps {
    docId: string;
}

export default function ChatInterface({ docId }: ChatInterfaceProps) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("http://localhost:8080/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, doc_id: docId }),
            });
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about the document..."
                    className="glass-input flex-1 text-lg"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !query}
                    className="glass-btn bg-purple-600/50 hover:bg-purple-600/70 border-purple-500/30"
                >
                    {loading ? "Thinking..." : "Compare Approaches"}
                </button>
            </form>

            {/* Results Arena */}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Standard RAG Card */}
                    <div className="glass-card border-blue-400/30 bg-blue-900/10 backdrop-blur-xl">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span>
                            Standard RAG
                        </h3>

                        <div className="mb-6 min-h-[100px] text-gray-200 leading-relaxed">
                            {result.standard.answer}
                        </div>

                        <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-white/40 block">Steps Taken</span>
                                <span className="font-mono text-blue-300">{result.standard.metrics.steps}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block">Retrieved Docs</span>
                                <span className="font-mono text-blue-300">{result.standard.metrics.retrieved_docs}</span>
                            </div>
                        </div>
                    </div>

                    {/* Agentic RAG Card */}
                    <div className="glass-card border-purple-400/30 bg-purple-900/10 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/30 transition-all"></div>

                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-pulse"></span>
                            Agentic RAG (A-RAG)
                        </h3>

                        <div className="mb-6 min-h-[100px] text-gray-200 leading-relaxed">
                            {result.arag.answer}
                        </div>

                        <div className="border-t border-white/10 pt-4 grid grid-cols-1 gap-4 text-sm">
                            <div>
                                <span className="text-white/40 block">Agent Steps</span>
                                <span className="font-mono text-purple-300 text-lg">{result.arag.metrics.steps}</span>
                            </div>
                            {/* Visualizing the "Thought Process" roughly */}
                            <div className="max-h-32 overflow-y-auto glass p-2 rounded text-xs font-mono text-white/50">
                                {result.arag.metrics.intermediate_steps}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <MetricsChart
                    standardMetrics={result.standard.metrics}
                    aragMetrics={result.arag.metrics}
                />
            )}
        </div>
    );
}
