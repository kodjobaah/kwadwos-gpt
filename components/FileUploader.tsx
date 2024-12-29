'use client';

import { useState } from 'react';
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import DisplayChunks from './documents/DisplayChunks';

export default function FileUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);

        // Filter files to include only PDF and Word documents
        const validFiles = newFiles.filter(file => {
            const fileType = file.type;
            return (
                fileType === 'application/pdf' ||
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                fileType === 'application/msword'
            );
        });

        if (validFiles.length < newFiles.length) {
            alert('Only PDF and Microsoft Word documents are allowed.');
        }

        setFiles(prev => [...prev, ...validFiles]);
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };

    const removeFile = (fileToRemove: File) => {
        setFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setProgress(0);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setResults(data.results);
                setProgress(100);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process files: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex-grow  p-4 border-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                </div>

                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h3 className="font-medium">Selected Files ({files.length})</h3>
                        <ul className="divide-y divide-gray-200">
                            {files.map((file, index) => (
                                <li key={`${file.name}-${index}`} className="py-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-800 font-semibold">{file.name}</span>
                                        <span className="text-xs text-gray-800">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                        disabled={isProcessing}
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isProcessing || files.length === 0}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md
                    hover:bg-blue-600 disabled:bg-gray-400 w-full"
                >
                    {isProcessing ? 'Processing...' : `Process ${files.length} File${files.length !== 1 ? 's' : ''}`}
                </button>

                {isProcessing && (
                    <div className="space-y-2">
                        <Progress />
                        <p className="text-sm text-gray-600 text-center">
                            Processing files... This may take a few minutes.
                        </p>
                    </div>
                )}
            </form>

            {results.length > 0 && (
                <DisplayChunks chunks={results}/>
            )}
        </div>
    );
}
