
import { GoogleGenAI, Type } from "@google/genai";
import { generateUUID } from '../utils/uuid';
import type { QuizData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        multipleChoice: {
            type: Type.ARRAY,
            description: "An array of multiple-choice questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The question text.",
                    },
                    options: {
                        type: Type.OBJECT,
                        description: "The four possible options.",
                        properties: {
                            a: { type: Type.STRING },
                            b: { type: Type.STRING },
                            c: { type: Type.STRING },
                            d: { type: Type.STRING },
                        },
                        required: ["a", "b", "c", "d"]
                    },
                    answer: {
                        type: Type.STRING,
                        description: "The correct option key (e.g., 'c').",
                        enum: ['a', 'b', 'c', 'd']
                    },
                },
                required: ["question", "options", "answer"],
            },
        },
        trueFalse: {
            type: Type.ARRAY,
            description: "An array of true/false questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The statement for the true/false question.",
                    },
                    answer: {
                        type: Type.BOOLEAN,
                        description: "The correct answer, true or false.",
                    },
                },
                required: ["question", "answer"],
            },
        },
    },
    required: ["multipleChoice", "trueFalse"],
};


export const generateQuizFromText = async (text: string): Promise<QuizData> => {
    try {
        const prompt = `You are an AI assistant for educators. Based on the provided text, generate exactly 5 multiple-choice and 5 true/false questions. Ensure your response adheres strictly to the provided JSON schema.

        Text content:
        ---
        ${text}
        ---
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText) as QuizData;

        // Add unique IDs to each question for state management
        if (parsedData.multipleChoice) {
            parsedData.multipleChoice = parsedData.multipleChoice.map(q => ({...q, id: generateUUID()}));
        }
        if (parsedData.trueFalse) {
            parsedData.trueFalse = parsedData.trueFalse.map(q => ({...q, id: generateUUID()}));
        }

        return parsedData;

    } catch (error) {
        console.error("Error generating quiz with Gemini API:", error);
        throw new Error("Failed to parse quiz data from AI response.");
    }
};
