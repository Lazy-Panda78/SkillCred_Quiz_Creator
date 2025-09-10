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
         <div className={`group relative p-4 rounded-xl transition-all duration-300 transform ${isEditing ? 'bg-black/30 border-teal-500 ring-4 ring-teal-500/20' : 'bg-black/20 border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/10'}`}>
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
                        <label className="block text-sm font-medium text-gray-300">Question</label>
                        <input
                            type="text"
                            value={editedQuestion.question}
                            onChange={(e) => setEditedQuestion(prev => ({ ...prev, question: e.target.value }))}
                            className="mt-1 block w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-200"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Correct Answer</label>
                         <select
                            value={editedQuestion.answer.toString()}
                            onChange={(e) => setEditedQuestion(prev => ({...prev, answer: e.target.value === 'true'}))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-black/20 border-white/10 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md text-gray-200"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={handleCancel} className="px-3 py-1.5 border border-white/20 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">Save</button>
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
            <div className="flex items-center justify-between pr-16">
                <p className="font-semibold text-gray-100">{question.question}</p>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${question.answer ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {question.answer ? 'True' : 'False'}
                </span>
            </div>
        </QuestionCard>
    );
};