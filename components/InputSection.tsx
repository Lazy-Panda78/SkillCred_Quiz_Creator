
import React, { useState } from 'react';
import { FileUpload } from './FileUpload';

interface InputSectionProps {
    inputMode: 'paste' | 'upload';
    setInputMode: (mode: 'paste' | 'upload') => void;
    pastedText: string;
    setPastedText: (text: string) => void;
    extractedText: string;
    setExtractedText: (text: string) => void;
    onGenerateQuiz: () => void;
    isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
    inputMode,
    setInputMode,
    pastedText,
    setPastedText,
    extractedText,
    setExtractedText,
    onGenerateQuiz,
    isLoading,
}) => {
    const isGenerateButtonDisabled = (inputMode === 'paste' && !pastedText.trim()) || (inputMode === 'upload' && !extractedText.trim()) || isLoading;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setInputMode('paste')}
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-colors duration-200 ${inputMode === 'paste' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Paste Text
                </button>
                <button
                    onClick={() => setInputMode('upload')}
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-colors duration-200 ${inputMode === 'upload' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Upload File
                </button>
            </div>

            <div className="mt-6">
                {inputMode === 'paste' ? (
                    <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste your text content here..."
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 resize-y"
                        disabled={isLoading}
                    />
                ) : (
                    <>
                        <FileUpload onTextExtracted={setExtractedText} disabled={isLoading} />
                        {extractedText && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">File Content Preview:</h3>
                                <textarea
                                    value={extractedText}
                                    readOnly
                                    className="w-full h-40 p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-6">
                <button
                    onClick={onGenerateQuiz}
                    disabled={isGenerateButtonDisabled}
                    className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                    ) : 'Generate Quiz'}
                </button>
            </div>
        </div>
    );
};
