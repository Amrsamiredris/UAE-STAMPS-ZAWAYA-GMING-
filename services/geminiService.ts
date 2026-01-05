import { GoogleGenAI } from "@google/genai";
import { STAMP_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStampImage = async (theme: string): Promise<string> => {
  try {
    const fullPrompt = `${STAMP_SYSTEM_PROMPT}\n\nUSER THEME INPUT: ${theme}\n\nGenerate ONE IMAGE of a postage stamp based on this theme.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: fullPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", 
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating stamp:", error);
    throw error;
  }
};

export const editStampImage = async (base64DataUrl: string, editPrompt: string): Promise<string> => {
  try {
    const base64Content = base64DataUrl.split(',')[1];
    const mimeType = base64DataUrl.split(',')[0].split(':')[1].split(';')[0];

    const fullPrompt = `${STAMP_SYSTEM_PROMPT}\n\nINSTRUCTION: ${editPrompt}\n\nEdit the provided postage stamp image according to the instruction while maintaining the stamp format and style.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Content,
              mimeType: mimeType,
            },
          },
          { text: fullPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", 
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image data found in edited response");
  } catch (error) {
    console.error("Error editing stamp:", error);
    throw error;
  }
};
