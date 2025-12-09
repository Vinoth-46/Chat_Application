import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// We use the Gemini 1.5 Flash model for fast, conversational responses
const MODEL_NAME = 'gemini-1.5-flash';

let aiClient = null;

// Initialize the client strictly with process.env.GEMINI_API_KEY as per guidelines
// In a real app, this initializes once. Here we ensure it's ready.
const getClient = () => {
    if (!aiClient) {
        aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

        const model = client.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: "You are Nova, a helpful, witty, and friendly AI assistant inside a chat application. Keep your responses concise and conversational, like a real text message friend. Do not use markdown formatting often, keep it plain text mostly unless code is requested. You are created by Vinoth"
        });

        const chat = model.startChat({
            history: historyForGemini,
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();

        return result?.text || result?.response?.text() || "I'm having trouble thinking right now.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I am currently offline. Please check your connection.";
    }
};
