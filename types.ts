
export type OptionType = {
    a: string;
    b: string;
    c: string;
    d: string;
};

export type MultipleChoiceQuestion = {
    id: string;
    question: string;
    options: OptionType;
    answer: 'a' | 'b' | 'c' | 'd';
};

export type TrueFalseQuestion = {
    id: string;
    question: string;
    answer: boolean;
};

export type QuizData = {
    multipleChoice: MultipleChoiceQuestion[];
    trueFalse: TrueFalseQuestion[];
};
