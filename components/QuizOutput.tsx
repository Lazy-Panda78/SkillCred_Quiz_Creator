
import React, { useState } from 'react';
import type { MultipleChoiceQuestion, TrueFalseQuestion } from '../types';
import { MultipleChoiceQuestionItem } from './MultipleChoiceQuestion';
import { TrueFalseQuestionItem } from './TrueFalseQuestion';
import { DownloadIcon, PlusIcon } from './icons';
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
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
            <div id="quiz-to-export" className="hidden">
                 {/* This content is only for html2canvas export */}
                 <div className="p-8 font-serif">
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

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Generated Quiz</h2>
                <div className="flex items-center gap-2">
                    <div className="relative inline-block text-left">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <DownloadIcon className="h-5 w-5" />
                            Download
                        </button>
                        {isDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                    <button onClick={handleExportPdf} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as PDF</button>
                                    <button onClick={handleExportDocx} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as Word (.docx)</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => onAddQuestion('mcq')} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="h-4 w-4" />
                    Add Multiple Choice
                </button>
                 <button onClick={() => onAddQuestion('tf')} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                    <PlusIcon className="h-4 w-4" />
                    Add True/False
                </button>
            </div>

            {multipleChoiceQuestions.length > 0 && (
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Multiple-Choice Questions ({multipleChoiceQuestions.length})</h3>
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
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">True/False Questions ({trueFalseQuestions.length})</h3>
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
