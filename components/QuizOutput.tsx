import React, { useState } from 'react';
import type { MultipleChoiceQuestion, TrueFalseQuestion } from '../types';
import { MultipleChoiceQuestionItem } from './MultipleChoiceQuestion';
import { TrueFalseQuestionItem } from './TrueFalseQuestion';
import { DownloadIcon, PlusIcon, FilePdfIcon, FileWordIcon } from './icons';
import { exportToPdf, exportToDocx } from '../services/exportService';

interface QuizOutputProps {
    multipleChoiceQuestions: MultipleChoiceQuestion[];
    trueFalseQuestions: TrueFalseQuestion[];
    onAddQuestion: (type: 'mcq' | 'tf') => void;
    onDeleteQuestion: (id: string, type: 'mcq' | 'tf') => void;
    onSaveQuestion: (question: MultipleChoiceQuestion | TrueFalseQuestion, type: 'mcq' | 'tf') => void;
    editingQuestionId: string | null;
    setEditingQuestionId: (id: string | null) => void;
}

export const QuizOutput: React.FC<QuizOutputProps> = ({
    multipleChoiceQuestions,
    trueFalseQuestions,
    onAddQuestion,
    onDeleteQuestion,
    onSaveQuestion,
    editingQuestionId,
    setEditingQuestionId
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleExportPdf = () => {
        exportToPdf({ multipleChoice: multipleChoiceQuestions, trueFalse: trueFalseQuestions });
        setIsDropdownOpen(false);
    };

    const handleExportDocx = () => {
        exportToDocx({ multipleChoice: multipleChoiceQuestions, trueFalse: trueFalseQuestions });
        setIsDropdownOpen(false);
    };

    return (
        <div className="glass-pane p-6 sm:p-8 space-y-6">
            <div id="quiz-to-export" className="hidden">
                 {/* This content is only for html2canvas export */}
                 <div className="p-8 font-serif bg-white text-black">
                    <h1 className="text-3xl font-bold mb-8 text-center">Quiz</h1>
                    {multipleChoiceQuestions.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Multiple-Choice Questions</h2>
                            <ol className="list-decimal list-inside space-y-6">
                                {multipleChoiceQuestions.map((q) => (
                                    <li key={q.id}>
                                        <p className="font-medium">{q.question}</p>
                                        <ul className="list-none pl-6 mt-2 space-y-1 text-gray-700">
                                            <li>A) {q.options.a}</li>
                                            <li>B) {q.options.b}</li>
                                            <li>C) {q.options.c}</li>
                                            <li>D) {q.options.d}</li>
                                        </ul>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                    {trueFalseQuestions.length > 0 && (
                         <div>
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">True/False Questions</h2>
                             <ol className="list-decimal list-inside space-y-4">
                                {trueFalseQuestions.map((q) => (
                                    <li key={q.id}>{q.question}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                 </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-white">Your Generated Quiz</h2>
                <div className="relative inline-block text-left">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-white/20 rounded-full shadow-lg text-sm font-medium text-gray-200 bg-black/20 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 transition-all">
                        <DownloadIcon className="h-5 w-5" />
                        Download
                    </button>
                    {isDropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg glass-pane ring-1 ring-black ring-opacity-5 z-10"
                            role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                            <div className="py-1" role="none">
                                <button onClick={handleExportPdf} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10" role="menuitem" tabIndex={-1}>
                                    <FilePdfIcon className="h-5 w-5 text-red-400" />
                                    Export as PDF
                                </button>
                                <button onClick={handleExportDocx} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10" role="menuitem" tabIndex={-1}>
                                    <FileWordIcon className="h-5 w-5 text-blue-400" />
                                    Export as Word (.docx)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                 <span className="text-sm font-medium text-gray-400">Add new question:</span>
                <button onClick={() => onAddQuestion('mcq')} className="inline-flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    Multiple Choice
                </button>
                 <button onClick={() => onAddQuestion('tf')} className="inline-flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    Add True/False
                </button>
            </div>

            {multipleChoiceQuestions.length > 0 && (
                <section>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Multiple-Choice Questions ({multipleChoiceQuestions.length})</h3>
                    <div className="space-y-4">
                        {multipleChoiceQuestions.map(q => (
                            <MultipleChoiceQuestionItem
                                key={q.id}
                                question={q}
                                onDelete={() => onDeleteQuestion(q.id, 'mcq')}
                                onSave={(updated) => onSaveQuestion(updated, 'mcq')}
                                isEditing={editingQuestionId === q.id}
                                onEditToggle={() => setEditingQuestionId(editingQuestionId === q.id ? null : q.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {trueFalseQuestions.length > 0 && (
                <section>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">True/False Questions ({trueFalseQuestions.length})</h3>
                    <div className="space-y-4">
                        {trueFalseQuestions.map(q => (
                            <TrueFalseQuestionItem
                                key={q.id}
                                question={q}
                                onDelete={() => onDeleteQuestion(q.id, 'tf')}
                                onSave={(updated) => onSaveQuestion(updated, 'tf')}
                                isEditing={editingQuestionId === q.id}
                                onEditToggle={() => setEditingQuestionId(editingQuestionId === q.id ? null : q.id)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};