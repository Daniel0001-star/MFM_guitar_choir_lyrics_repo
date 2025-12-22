import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the client. 
// Note: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the "Guitar Choir Maestro", an expert AI assistant for a guitar ensemble repository. 
Your knowledge spans music theory, classical guitar techniques, ensemble arrangement, and guitar history.
You help users analyze pieces, suggest practice routines, and understand harmonic structures.
Keep your tone encouraging, professional, and musical.
If asked about the repository content, assume you have access to a standard library of classical and contemporary guitar ensemble music.`;

/**
 * Creates a new chat session with the specific system instruction.
 */
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

/**
 * Sends a message to the chat session and returns the response text.
 */
export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I played a rest... (No response generated)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The Maestro is currently tuning. Please try again later.");
  }
};

/**
 * Generates Lyrics for a song title using the Gemini API.
 */
export const generateLyrics = async (songTitle: string): Promise<string> => {
  try {
    const prompt = `Generate full, worship-style lyrics for a song titled "${songTitle}". 
    The structure should include at least two verses, a chorus, and a bridge. 
    The tone must be uplifting, spiritual, and suitable for a large choir ensemble. 
    Format the output clearly with headings for [Verse 1], [Chorus], etc.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    return response.text || `Could not compose lyrics for "${songTitle}". Please try another title.`;
  } catch (error) {
    console.error("Gemini Lyrics Generation Error:", error);
    throw new Error("The Maestro is facing writer's block. Please try again later.");
  }
};