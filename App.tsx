import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { QuizOutput } from './components/QuizOutput';
import type { MultipleChoiceQuestion, TrueFalseQuestion, QuizData } from './types';
import { generateQuizFromText } from './services/geminiService';
import { generateUUID } from './utils/uuid';
import { SparklesIcon } from './components/icons';
import { sampleQuiz } from './data/sampleQuizData';

const App: React.FC = () => {
    const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
    const [pastedText, setPastedText] = useState<string>('');
    const [extractedText, setExtractedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<MultipleChoiceQuestion[]>([]);
    const [trueFalseQuestions, setTrueFalseQuestions] = useState<TrueFalseQuestion[]>([]);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    
    // New state for quiz configuration
    const [numMultipleChoice, setNumMultipleChoice] = useState<number>(5);
    const [numTrueFalse, setNumTrueFalse] = useState<number>(5);
    const [quizFocus, setQuizFocus] = useState<string>('');

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
            const quizData: QuizData = await generateQuizFromText(
                textToProcess,
                numMultipleChoice,
                numTrueFalse,
                quizFocus
            );
            setMultipleChoiceQuestions(quizData.multipleChoice || []);
            setTrueFalseQuestions(quizData.trueFalse || []);
        } catch (err) {
            console.error(err);
            setError('Failed to generate quiz. The AI might be busy or the format was unexpected. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [inputMode, pastedText, extractedText, numMultipleChoice, numTrueFalse, quizFocus]);

    const handleGenerateSampleQuiz = useCallback(() => {
        setError(null);
        setIsLoading(false);
        setMultipleChoiceQuestions(
            sampleQuiz.multipleChoice.map(q => ({...q, id: generateUUID()}))
        );
        setTrueFalseQuestions(
            sampleQuiz.trueFalse.map(q => ({...q, id: generateUUID()}))
        );
    }, []);

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
        <div className="min-h-screen font-sans text-gray-200">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Header />
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <InputSection
                        inputMode={inputMode}
                        setInputMode={setInputMode}
                        pastedText={pastedText}
                        setPastedText={setPastedText}
                        extractedText={extractedText}
                        setExtractedText={setExtractedText}
                        onGenerateQuiz={handleGenerateQuiz}
                        onGenerateSampleQuiz={handleGenerateSampleQuiz}
                        isLoading={isLoading}
                        numMultipleChoice={numMultipleChoice}
                        setNumMultipleChoice={setNumMultipleChoice}
                        numTrueFalse={numTrueFalse}
                        setNumTrueFalse={setNumTrueFalse}
                        quizFocus={quizFocus}
                        setQuizFocus={setQuizFocus}
                    />
                    <div className="lg:mt-0 relative">
                        {isLoading && (
                            <div className="w-full min-h-[30rem] flex flex-col items-center justify-center glass-pane p-6">
                                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500"></div>
                                <p className="mt-6 text-2xl font-bold text-gray-100 tracking-wider">AI is crafting your quiz...</p>
                                <p className="text-gray-400">This may take a few moments.</p>
                            </div>
                        )}
                        {error && (
                             <div className="glass-pane border-red-500/50 text-red-300 p-4 rounded-xl shadow-lg" role="alert">
                                <strong className="font-bold">An Error Occurred: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        {!isLoading && !error && multipleChoiceQuestions.length === 0 && trueFalseQuestions.length === 0 && (
                            <div className="w-full min-h-[30rem] flex flex-col items-center justify-center text-center glass-pane p-6">
                                <SparklesIcon className="h-20 w-20 text-pink-400" />
                                <h3 className="mt-4 text-3xl font-bold text-white">Quiz Awaits!</h3>
                                <p className="mt-2 max-w-sm text-gray-400">
                                    Your generated questions will appear here. Just paste some text or upload a file and let the AI do the magic.
                                </p>
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