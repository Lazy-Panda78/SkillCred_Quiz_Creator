
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { QuizOutput } from './components/QuizOutput';
import type { MultipleChoiceQuestion, TrueFalseQuestion, QuizData } from './types';
import { generateQuizFromText } from './services/geminiService';
import { generateUUID } from './utils/uuid';

const App: React.FC = () => {
    const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
    const [pastedText, setPastedText] = useState<string>('');
    const [extractedText, setExtractedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<MultipleChoiceQuestion[]>([]);
    const [trueFalseQuestions, setTrueFalseQuestions] = useState<TrueFalseQuestion[]>([]);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    const handleGenerateQuiz = useCallback(async () => {
        const textToProcess = inputMode === 'paste' ? pastedText : extractedText;
        if (!textToProcess.trim()) {
            setError('Please provide some text to generate a quiz.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setMultipleChoiceQuestions([]);
        setTrueFalseQuestions([]);

        try {
            const quizData: QuizData = await generateQuizFromText(textToProcess);
            setMultipleChoiceQuestions(quizData.multipleChoice || []);
            setTrueFalseQuestions(quizData.trueFalse || []);
        } catch (err) {
            console.error(err);
            setError('Failed to generate quiz. The AI might be busy or the format was unexpected. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [inputMode, pastedText, extractedText]);

    const handleAddQuestion = (type: 'mcq' | 'tf') => {
        if (type === 'mcq') {
            const newQuestion: MultipleChoiceQuestion = {
                id: generateUUID(),
                question: '',
                options: { a: '', b: '', c: '', d: '' },
                answer: 'a',
            };
            setMultipleChoiceQuestions(prev => [newQuestion, ...prev]);
            setEditingQuestionId(newQuestion.id);
        } else {
            const newQuestion: TrueFalseQuestion = {
                id: generateUUID(),
                question: '',
                answer: true,
            };
            setTrueFalseQuestions(prev => [newQuestion, ...prev]);
            setEditingQuestionId(newQuestion.id);
        }
    };
    
    const handleDeleteQuestion = (id: string, type: 'mcq' | 'tf') => {
        if (type === 'mcq') {
            setMultipleChoiceQuestions(prev => prev.filter(q => q.id !== id));
        } else {
            setTrueFalseQuestions(prev => prev.filter(q => q.id !== id));
        }
    };

    const handleSaveQuestion = (question: MultipleChoiceQuestion | TrueFalseQuestion, type: 'mcq' | 'tf') => {
         if (type === 'mcq') {
            setMultipleChoiceQuestions(prev => prev.map(q => q.id === question.id ? question as MultipleChoiceQuestion : q));
        } else {
            setTrueFalseQuestions(prev => prev.map(q => q.id === question.id ? question as TrueFalseQuestion : q));
        }
        setEditingQuestionId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Header />
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <InputSection
                        inputMode={inputMode}
                        setInputMode={setInputMode}
                        pastedText={pastedText}
                        setPastedText={setPastedText}
                        extractedText={extractedText}
                        setExtractedText={setExtractedText}
                        onGenerateQuiz={handleGenerateQuiz}
                        isLoading={isLoading}
                    />
                    <div className="lg:mt-0">
                        {isLoading && (
                            <div className="w-full h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-6">
                                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-4 text-lg font-medium text-gray-600">AI is generating your questions...</p>
                                <p className="text-sm text-gray-500">This may take a moment.</p>
                            </div>
                        )}
                        {error && (
                             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        {!isLoading && (multipleChoiceQuestions.length > 0 || trueFalseQuestions.length > 0) && (
                            <QuizOutput
                                multipleChoiceQuestions={multipleChoiceQuestions}
                                trueFalseQuestions={trueFalseQuestions}
                                onAddQuestion={handleAddQuestion}
                                onDeleteQuestion={handleDeleteQuestion}
                                onSaveQuestion={handleSaveQuestion}
                                editingQuestionId={editingQuestionId}
                                setEditingQuestionId={setEditingQuestionId}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
