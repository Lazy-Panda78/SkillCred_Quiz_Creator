import React, { useState, useEffect } from 'react';
import type { MultipleChoiceQuestion, OptionType } from '../types';
import { EditIcon, TrashIcon } from './icons';

interface MultipleChoiceQuestionItemProps {
    question: MultipleChoiceQuestion;
    onDelete: () => void;
    onSave: (question: MultipleChoiceQuestion) => void;
    isEditing: boolean;
    onEditToggle: () => void;
}

const QuestionCard: React.FC<{ isEditing: boolean, children: React.ReactNode }> = ({ isEditing, children }) => {
    return (
         <div className={`group relative p-4 rounded-xl transition-all duration-300 transform ${isEditing ? 'bg-black/30 border-purple-500 ring-4 ring-purple-500/20' : 'bg-black/20 border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10'}`}>
            {children}
        </div>
    );
};

export const MultipleChoiceQuestionItem: React.FC<MultipleChoiceQuestionItemProps> = ({ question, onDelete, onSave, isEditing, onEditToggle }) => {
    const [editedQuestion, setEditedQuestion] = useState<MultipleChoiceQuestion>(question);

    useEffect(() => {
        setEditedQuestion(question);
    }, [question]);

    const handleSave = () => {
        onSave(editedQuestion);
    };

    const handleCancel = () => {
        setEditedQuestion(question);
        onEditToggle();
    };

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedQuestion(prev => ({ ...prev, question: e.target.value }));
    };

    const handleOptionChange = (optionKey: keyof OptionType, value: string) => {
        setEditedQuestion(prev => ({
            ...prev,
            options: { ...prev.options, [optionKey]: value }
        }));
    };

    const handleAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditedQuestion(prev => ({ ...prev, answer: e.target.value as 'a' | 'b' | 'c' | 'd' }));
    };

    if (isEditing) {
        return (
            <QuestionCard isEditing={true}>
                 <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Question</label>
                        <input
                            type="text"
                            value={editedQuestion.question}
                            onChange={handleQuestionTextChange}
                            className="mt-1 block w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-200"
                        />
                    </div>
                    {(['a', 'b', 'c', 'd'] as const).map(key => (
                         <div key={key}>
                            <label className="block text-sm font-medium text-gray-300">Option {key.toUpperCase()}</label>
                            <input
                                type="text"
                                value={editedQuestion.options[key]}
                                onChange={(e) => handleOptionChange(key, e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-gray-200"
                            />
                        </div>
                    ))}
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Correct Answer</label>
                        <select
                            value={editedQuestion.answer}
                            onChange={handleAnswerChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-black/20 border-white/10 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md text-gray-200"
                        >
                            <option value="a">Option A</option>
                            <option value="b">Option B</option>
                            <option value="c">Option C</option>
                            <option value="d">Option D</option>
                        </select>
                    </div>
                     <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={handleCancel} className="px-3 py-1.5 border border-white/20 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700">Save</button>
                    </div>
                </div>
            </QuestionCard>
        );
    }
    
    return (
        <QuestionCard isEditing={false}>
            <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={onEditToggle} aria-label="Edit question" className="p-2 text-gray-400 hover:text-purple-400 bg-black/20 hover:bg-black/40 rounded-full"><EditIcon className="h-5 w-5" /></button>
                <button onClick={onDelete} aria-label="Delete question" className="p-2 text-gray-400 hover:text-red-500 bg-black/20 hover:bg-black/40 rounded-full"><TrashIcon className="h-5 w-5" /></button>
            </div>
            <p className="font-semibold text-gray-100 pr-16">{question.question}</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {(['a', 'b', 'c', 'd'] as const).map(key => (
                     <p key={key} className={`flex items-center gap-2 ${question.answer === key ? 'font-semibold text-green-300' : 'text-gray-400'}`}>
                        <span className={`flex-shrink-0 h-5 w-5 text-xs flex items-center justify-center rounded-full ${question.answer === key ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/50 text-gray-300'}`}>
                            {key.toUpperCase()}
                        </span>
                        <span>{question.options[key]}</span>
                    </p>
                ))}
            </div>
        </QuestionCard>
    );
};