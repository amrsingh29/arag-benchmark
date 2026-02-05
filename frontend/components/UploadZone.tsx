"use client";

import { useState } from "react";

interface UploadZoneProps {
    onUploadComplete: (docId: string, filename: string) => void;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file.");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed. Make sure backend is running.");
            }

            const data = await response.json();
            onUploadComplete(data.doc_id, data.filename);
        } catch (err: any) {
            setError(err.message || "An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                className={`glass-card relative flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed transition-colors ${dragActive ? "border-purple-400 bg-white/10" : "border-white/20"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleChange}
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="text-center animate-pulse">
                        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xl font-medium">Reading & Indexing...</p>
                        <p className="text-sm text-white/60 mt-2">This usually takes 5-10 seconds.</p>
                    </div>
                ) : (
                    <div className="text-center group">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <svg className="w-20 h-20 text-white/50 mb-6 group-hover:text-purple-300 transition-colors duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-2xl font-semibold mb-2">Drop your PDF here</p>
                            <p className="text-white/60 mb-6">or click to browse</p>
                            <span className="glass-btn px-8 py-3 group-hover:bg-white/20">
                                Select File
                            </span>
                        </label>
                        {error && <p className="text-red-400 mt-4 bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
