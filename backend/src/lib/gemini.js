import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// We use the Gemini 2.5 Flash model for fast, conversational responses
const MODEL_NAME = 'gemini-2.5-flash';

let aiClient = null;

// Initialize the client strictly with process.env.GEMINI_API_KEY as per guidelines
// In a real app, this initializes once. Here we ensure it's ready.
const getClient = () => {
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
};

export const generateAIResponse = async (history, newMessage) => {
    try {
        const client = getClient();

        // Transforming history for the chat API
        // history entries are objects { role: string, parts: { text: string }[] }
        const historyForGemini = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: h.parts
        }));

        const result = await client.models.generateContent({
            model: MODEL_NAME,
            contents: [
                ...historyForGemini,
                { role: 'user', parts: [{ text: newMessage }] }
            ],
            config: {
                systemInstruction: "You are Nova, a helpful, witty, and friendly AI assistant inside a chat application. Keep your responses concise and conversational, like a real text message friend. Do not use markdown formatting often, keep it plain text mostly unless code is requested.,You are created by Vinoth",
            }
        });

        return result?.text || result?.response?.text() || "I'm having trouble thinking right now.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I am currently offline. Please check your connection.";
    }
};
