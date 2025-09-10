import type { MultipleChoiceQuestion, TrueFalseQuestion } from '../types';

// Raw data without IDs, which will be added dynamically.
const sampleMultipleChoice: Omit<MultipleChoiceQuestion, 'id'>[] = [
    {
        question: "The hard outer layer of a pollen grain, which is made of one of the most resistant organic materials known, is called the:",
        options: { a: "Intine", b: "Exine", c: "Tapetum", d: "Micropyle" },
        answer: 'b',
    },
    {
        question: 'In flowering plants, the phenomenon of "double fertilization" involves:',
        options: {
            a: "Two male gametes fertilizing two different egg cells.",
            b: "One male gamete fusing with the egg, and the other fusing with the synergids.",
            c: "One male gamete fusing with the egg, and the other fusing with the central cell's two polar nuclei.",
            d: "Two pollen tubes entering the same ovule.",
        },
        answer: 'c',
    },
    {
        question: "After successful fertilization, the ovary of the flower develops into the ______, and the ovules develop into the ______.",
        options: { a: "Seed, Fruit", b: "Fruit, Seed", c: "Endosperm, Embryo", d: "Embryo, Seed coat" },
        answer: 'b',
    },
    {
        question: "The transfer of pollen from the anther to the stigma of a different flower on the *same plant* is known as:",
        options: { a: "Xenogamy", b: "Autogamy", c: "Geitonogamy", d: "Apomixis" },
        answer: 'c',
    },
    {
        question: "The female reproductive part of the flower, collectively known as the gynoecium, is composed of which three parts?",
        options: {
            a: "Anther, Filament, and Pollen",
            b: "Petal, Sepal, and Thalamus",
            c: "Stigma, Style, and Ovary",
            d: "Radicle, Plumule, and Cotyledon",
        },
        answer: 'c',
    },
];

const sampleTrueFalse: Omit<TrueFalseQuestion, 'id'>[] = [
    {
        question: "A mature, typical angiosperm embryo sac is 7-celled and 8-nucleate.",
        answer: true,
    },
    {
        question: "The primary endosperm nucleus (PEN) is diploid (2n) in nature.",
        answer: false,
    },
    {
        question: "Cleistogamous flowers are flowers that remain open to encourage cross-pollination.",
        answer: false,
    },
    {
        question: "An apple is considered a \"false fruit\" because a significant portion of it develops from the thalamus, not just the ovary.",
        answer: true,
    },
    {
        question: "Wind and water are the most common examples of biotic agents for pollination.",
        answer: false,
    }
];

export const sampleQuiz = {
    multipleChoice: sampleMultipleChoice,
    trueFalse: sampleTrueFalse,
};
