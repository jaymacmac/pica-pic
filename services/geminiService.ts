import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert URL to Base64 (for analysis of remote images)
export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const analyzeImage = async (base64Data: string, prompt: string = "Describe this image in detail."): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from context
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '3:4' | '4:3' | '16:9' | '9:16' = '1:1'): Promise<{ base64: string, mimeType: string }> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // Gemini 2.5 flash image doesn't support imageSize currently in the same way 3-pro does, 
          // keeping it simple to defaults or just aspect ratio.
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png'
        };
      }
    }
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};
