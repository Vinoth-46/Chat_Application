import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const listModels = async () => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing.");
            return;
        }
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await client.models.list();

        console.log("Available Models:");
        for (const model of response.models) {
            console.log(`- ${model.name} (Supported methods: ${model.supportedGenerationMethods})`);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
};

listModels();
