
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryDay, TripPreferences } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const ITINERARY_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      dayNumber: { type: Type.NUMBER },
      date: { type: Type.STRING },
      title: { type: Type.STRING },
      activities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            location: { type: Type.STRING },
            costEstimate: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['sightseeing', 'food', 'rest', 'transport', 'activity'] }
          },
          required: ['time', 'title', 'description', 'location', 'type']
        }
      },
      notes: { type: Type.STRING }
    },
    required: ['dayNumber', 'date', 'title', 'activities']
  }
};

export const generateItinerary = async (
  destination: string,
  startDate: string,
  endDate: string,
  preferences: TripPreferences
): Promise<ItineraryDay[]> => {
  const ai = getAIClient();
  const prompt = `
    Generate a day-by-day itinerary for a trip to ${destination}.
    Dates: ${startDate} to ${endDate}.
    Travel Style: ${preferences.travelType}.
    Budget: ${preferences.budget}.
    Interests: ${preferences.interests.join(', ')}.
    Return a detailed JSON array of objects following the defined schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ITINERARY_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export const refineItinerary = async (
  currentItinerary: ItineraryDay[],
  userRequest: string,
  preferences: TripPreferences
): Promise<ItineraryDay[]> => {
  const ai = getAIClient();
  const prompt = `
    User wishes to update the current itinerary.
    Current Itinerary: ${JSON.stringify(currentItinerary)}
    User Request: "${userRequest}"
    Preferences Context: Budget ${preferences.budget}, Style ${preferences.travelType}.
    Return ONLY the updated itinerary as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ITINERARY_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error refining itinerary:", error);
    throw error;
  }
};
