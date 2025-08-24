
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Advanced AI Quiz Creator
                </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
                Generate, edit, and export quizzes from any document.
            </p>
        </header>
    );
};
