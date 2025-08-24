
import React, { useState, useEffect } from 'react';
import type { TrueFalseQuestion } from '../types';
import { EditIcon, TrashIcon } from './icons';

interface TrueFalseQuestionItemProps {
    question: TrueFalseQuestion;
    onDelete: () => void;
    onSave: (question: TrueFalseQuestion) => void;
    isEditing: boolean;
    onEditToggle: () => void;
}

const QuestionCard: React.FC<{ isEditing: boolean, children: React.ReactNode }> = ({ isEditing, children }) => {
    return (
         <div className={`group relative p-4 border rounded-lg transition-all duration-200 ${isEditing ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 bg-gray-50'}`}>
            {children}
        </div>
    );
};


export const TrueFalseQuestionItem: React.FC<TrueFalseQuestionItemProps> = ({ question, onDelete, onSave, isEditing, onEditToggle }) => {
    const [editedQuestion, setEditedQuestion] = useState<TrueFalseQuestion>(question);
    
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

    if (isEditing) {
        return (
            <QuestionCard isEditing={true}>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Question</label>
                        <input
                            type="text"
                            value={editedQuestion.question}
                            onChange={(e) => setEditedQuestion(prev => ({ ...prev, question: e.target.value }))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                         <select
                            value={editedQuestion.answer.toString()}
                            onChange={(e) => setEditedQuestion(prev => ({...prev, answer: e.target.value === 'true'}))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={handleCancel} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">Save</button>
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
            <div className="flex items-center justify-between pr-16">
                <p className="font-medium text-gray-800">{question.question}</p>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${question.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {question.answer ? 'True' : 'False'}
                </span>
            </div>
        </QuestionCard>
    );
};
