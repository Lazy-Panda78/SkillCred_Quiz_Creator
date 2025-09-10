import React from 'react';
import { FileUpload } from './FileUpload';
import { QuizConfigPanel } from './QuizConfigPanel';

interface InputSectionProps {
    inputMode: 'paste' | 'upload';
    setInputMode: (mode: 'paste' | 'upload') => void;
    pastedText: string;
    setPastedText: (text: string) => void;
    extractedText: string;
    setExtractedText: (text: string) => void;
    onGenerateQuiz: () => void;
    onGenerateSampleQuiz: () => void;
    isLoading: boolean;
    numMultipleChoice: number;
    setNumMultipleChoice: (num: number) => void;
    numTrueFalse: number;
    setNumTrueFalse: (num: number) => void;
    quizFocus: string;
    setQuizFocus: (focus: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
    inputMode,
    setInputMode,
    pastedText,
    setPastedText,
    extractedText,
    setExtractedText,
    onGenerateQuiz,
    onGenerateSampleQuiz,
    isLoading,
    numMultipleChoice,
    setNumMultipleChoice,
    numTrueFalse,
    setNumTrueFalse,
    quizFocus,
    setQuizFocus,
}) => {
    const isGenerateButtonDisabled = (inputMode === 'paste' && !pastedText.trim()) || (inputMode === 'upload' && !extractedText.trim()) || isLoading;

    return (
        <div className="glass-pane p-6 sm:p-8">
            <div className="flex space-x-2 bg-black/20 p-1 rounded-full">
                <button
                    onClick={() => setInputMode('paste')}
                    className={`relative flex-1 py-2.5 text-sm font-bold text-center transition-all duration-300 rounded-full ${inputMode === 'paste' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    aria-pressed={inputMode === 'paste'}
                >
                    {inputMode === 'paste' && <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-500/30" style={{zIndex: -1}}></span>}
                    Paste Text
                </button>
                <button
                    onClick={() => setInputMode('upload')}
                    className={`relative flex-1 py-2.5 text-sm font-bold text-center transition-all duration-300 rounded-full ${inputMode === 'upload' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    aria-pressed={inputMode === 'upload'}
                >
                     {inputMode === 'upload' && <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-500/30" style={{zIndex: -1}}></span>}
                    Upload File
                </button>
            </div>

            <div className="mt-6">
                {inputMode === 'paste' ? (
                    <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste your source material here. A chapter from a textbook, an article, or your own notes all work great!"
                        className="w-full h-80 p-4 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition duration-200 resize-y text-gray-300 placeholder-gray-500"
                        disabled={isLoading}
                        aria-label="Paste text content here"
                    />
                ) : (
                    <>
                        <FileUpload onTextExtracted={setExtractedText} disabled={isLoading} />
                        {extractedText && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-300 mb-2">File Content Preview:</h3>
                                <textarea
                                    value={extractedText}
                                    readOnly
                                    className="w-full h-48 p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-gray-400"
                                    aria-label="File content preview"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <QuizConfigPanel
                numMultipleChoice={numMultipleChoice}
                setNumMultipleChoice={setNumMultipleChoice}
                numTrueFalse={numTrueFalse}
                setNumTrueFalse={setNumTrueFalse}
                quizFocus={quizFocus}
                setQuizFocus={setQuizFocus}
                isLoading={isLoading}
            />

            <div className="mt-6 space-y-4">
                <button
                    onClick={onGenerateQuiz}
                    disabled={isGenerateButtonDisabled}
                    className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-full shadow-lg text-base font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                    ) : '✨ Generate Quiz'}
                </button>
                <button
                    onClick={onGenerateSampleQuiz}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-6 border border-white/20 rounded-full text-sm font-bold text-white bg-black/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                    🧪 Generate a Sample Quiz
                </button>
            </div>
        </div>
    );
};