import { GoogleGenAI } from "@google/genai";
import { text } from "express";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const generateEmbedding = async (text) => {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return result.embeddings[0].values;
};
export const generateAnswer = async (prompt) => {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return result.text;
};
