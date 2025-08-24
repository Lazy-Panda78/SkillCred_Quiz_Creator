
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
         <div className={`group relative p-4 border rounded-lg transition-all duration-200 ${isEditing ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 bg-gray-50'}`}>
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
                        <label className="block text-sm font-medium text-gray-700">Question</label>
                        <input
                            type="text"
                            value={editedQuestion.question}
                            onChange={handleQuestionTextChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {(['a', 'b', 'c', 'd'] as const).map(key => (
                         <div key={key}>
                            <label className="block text-sm font-medium text-gray-700">Option {key.toUpperCase()}</label>
                            <input
                                type="text"
                                value={editedQuestion.options[key]}
                                onChange={(e) => handleOptionChange(key, e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    ))}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                        <select
                            value={editedQuestion.answer}
                            onChange={handleAnswerChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="a">Option A</option>
                            <option value="b">Option B</option>
                            <option value="c">Option C</option>
                            <option value="d">Option D</option>
                        </select>
                    </div>
                     <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={handleCancel} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save</button>
                    </div>
                </div>
            </QuestionCard>
        );
    }
    
    return (
        <QuestionCard isEditing={false}>
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEditToggle} className="p-1.5 text-gray-500 hover:text-indigo-600 bg-gray-100 rounded-full"><EditIcon className="h-4 w-4" /></button>
                <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-600 bg-gray-100 rounded-full"><TrashIcon className="h-4 w-4" /></button>
            </div>
            <p className="font-medium text-gray-800 pr-16">{question.question}</p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                {(['a', 'b', 'c', 'd'] as const).map(key => (
                     <p key={key} className={question.answer === key ? 'font-bold text-green-700' : ''}>
                        {key.toUpperCase()}) {question.options[key]}
                    </p>
                ))}
            </div>
        </QuestionCard>
    );
};
