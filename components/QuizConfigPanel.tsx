import React from 'react';

interface QuizConfigPanelProps {
    numMultipleChoice: number;
    setNumMultipleChoice: (num: number) => void;
    numTrueFalse: number;
    setNumTrueFalse: (num: number) => void;
    quizFocus: string;
    setQuizFocus: (focus: string) => void;
    isLoading: boolean;
}

export const QuizConfigPanel: React.FC<QuizConfigPanelProps> = ({
    numMultipleChoice,
    setNumMultipleChoice,
    numTrueFalse,
    setNumTrueFalse,
    quizFocus,
    setQuizFocus,
    isLoading,
}) => {
    
    const handleNumberChange = (setter: (num: number) => void, value: string) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0) {
            setter(num);
        }
    };

    return (
        <div className="mt-6 p-4 bg-black/20 border border-white/10 rounded-lg">
            <h3 className="text-base font-semibold text-gray-200 mb-4">Quiz Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="mcq-count" className="block text-sm font-medium text-gray-400">
                        # of Multiple-Choice
                    </label>
                    <input
                        type="number"
                        id="mcq-count"
                        value={numMultipleChoice}
                        onChange={(e) => handleNumberChange(setNumMultipleChoice, e.target.value)}
                        min="0"
                        className="mt-1 w-full p-2 bg-black/20 border border-white/10 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-200"
                        disabled={isLoading}
                        aria-label="Number of multiple-choice questions"
                    />
                </div>
                 <div>
                    <label htmlFor="tf-count" className="block text-sm font-medium text-gray-400">
                        # of True/False
                    </label>
                    <input
                        type="number"
                        id="tf-count"
                        value={numTrueFalse}
                        onChange={(e) => handleNumberChange(setNumTrueFalse, e.target.value)}
                        min="0"
                        className="mt-1 w-full p-2 bg-black/20 border border-white/10 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-200"
                        disabled={isLoading}
                        aria-label="Number of true/false questions"
                    />
                </div>
            </div>
            <div className="mt-4">
                 <label htmlFor="quiz-focus" className="block text-sm font-medium text-gray-400">
                    Quiz Focus (Optional)
                </label>
                <input
                    type="text"
                    id="quiz-focus"
                    value={quizFocus}
                    onChange={(e) => setQuizFocus(e.target.value)}
                    placeholder="e.g., Chapter 3, Photosynthesis, The Cold War"
                    className="mt-1 w-full p-2 bg-black/20 border border-white/10 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-200 placeholder-gray-500"
                    disabled={isLoading}
                    aria-label="Quiz focus area"
                />
            </div>
        </div>
    );
};