import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 15px rgba(255, 0, 127, 0.5), 0 0 30px rgba(127, 0, 255, 0.5)' }}>
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Advanced AI Quiz Creator
                </span>
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-gray-400">
                Instantly generate, edit, and export engaging quizzes from any text or document.
            </p>
        </header>
    );
};