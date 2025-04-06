import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult, ImageAnalysisError } from "./types";

// const FOOD_ANALYSIS_PROMPT = `Analyze this food image and determine its freshness and expected expiry date.
// Return your response in this exact JSON format:
// {
//   "qualityState": "<one of: expired, close to expiry, fresh>",
//   "predictedExpiryDate": "<YYYY-MM-DD>"
// }`;

const FOOD_ANALYSIS_PROMPT = `Today's date is ${new Date().toLocaleDateString()}. Analyze this food image and determine its freshness and expected expiry date. The date should be realistic, so if it's not expired, the date must be today or in the future.`;

const RECIPE_GENERATION_PROMPT = `Come up with a recipe idea using the following food item:
Food Name: {foodName}
Return the response in this exact JSON format:
{
  "recipe": "<recipe>"
}`;


const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is missing');
}
const ai = new GoogleGenAI({ apiKey });

export async function analyzeFoodImage(imageFile: File): Promise<FoodAnalysisResult> {
  try {

    
    const imageData = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [FOOD_ANALYSIS_PROMPT, imageData],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            qualityState: {
              type: Type.STRING,
              enum: ["expired", "close to expiry", "fresh"]
            },
            predictedExpiryDate: {
              type: Type.STRING,
              format: "date-time"
            }
          },
          required: ["qualityState", "predictedExpiryDate"]
        },
      },
    })
    const text = response.text;
    console.log("Response from AI:", text);
    return JSON.parse(text) as FoodAnalysisResult;
  } catch (error) {
    console.log(error);
    throw {
      message: "Failed to analyze food image",
      code: "ANALYSIS_ERROR",
      originalError: error
    } as ImageAnalysisError;
  }
}

export async function generateRecipes(foodName: string): Promise<string> {
  try {
    const prompt = RECIPE_GENERATION_PROMPT.replace("{foodName}", foodName);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [prompt],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipe: { type: Type.STRING },
          },
          required: ["recipe"],
        },
      },
    });

    const text = response.text;
    console.log("Response from AI:", text);
    const result = JSON.parse(text);
    return result.recipe;
  } catch (error) {
    console.log(error);
    throw {
      message: "Failed to generate recipe",
      code: "RECIPE_GENERATION_ERROR",
      originalError: error,
    }
  }
}

async function fileToGenerativePart(file: File) {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData.split(",")[1],
      mimeType: file.type
    }
  };
}
