
import { GoogleGenAI } from "@google/genai";
import { ApiSettings, ApiService } from '../types';

async function getGeminiExplanation(prompt: string, apiKey: string): Promise<string> {
    if (!apiKey) {
        throw new Error("Gemini API key is not set.");
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert Machine Learning tutor. Explain the following concept or result to a university student in a clear, concise, and helpful way. Use Markdown for formatting if it helps clarity.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Error from Gemini API: ${error.message}`;
        }
        return "An unknown error occurred with the Gemini API.";
    }
}

async function getOpenRouterExplanation(prompt: string, apiKey: string, model: string): Promise<string> {
    if (!apiKey) {
        throw new Error("OpenRouter API key is not set.");
    }
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://interactive-ml-lab",
                "X-Title": "Interactive ML Lab"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: "You are an expert Machine Learning tutor. Explain the following concept or result to a university student in a clear, concise, and helpful way. Use Markdown for formatting if it helps clarity." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenRouter API:", error);
        if (error instanceof Error) {
            return `Error from OpenRouter API: ${error.message}`;
        }
        return "An unknown error occurred with the OpenRouter API.";
    }
}

export const generateExplanation = async (prompt: string, settings: ApiSettings): Promise<string> => {
    if (settings.service === 'gemini') {
        return getGeminiExplanation(prompt, settings.geminiApiKey);
    } else {
        return getOpenRouterExplanation(prompt, settings.openRouterApiKey, settings.openRouterModel);
    }
};
