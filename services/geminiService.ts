import { GoogleGenAI, Type } from "@google/genai";
import { Element, CombinationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the engine of an "Infinite Alchemy" game where the player evolves through eras.
Your goal is to combine two elements to create something new.

**Core Philosophy:**
- Creative, Witty, and Surprise-focused.
- **VARY THE RESULTS:** If the user retries a combination, NEVER output the same result twice.
- **MISSION PRIORITY:** If the inputs logically match a "Mission Target" the user is looking for, YOU MUST GENERATE THAT TARGET.

**Rarity Guide:**
- "COMMON": Predictable
- "RARE": Specialized tools/jobs
- "EPIC": Advanced tech/Fantasy
- "LEGENDARY": Gods, Universe, Era-defining inventions
- "CURSED": Weird/Scary/Gross
- "MEME": Funny/Internet culture/Puns

**Rules:**
1. Result Name: KOREAN (Max 10 chars).
2. Description: Short, witty, KOREAN (Max 15 words).
3. Emoji: Pick the most fitting single emoji.
4. Color: Hex code.
`;

export const combineElements = async (
  element1: Element,
  element2: Element,
  eraName: string,
  missionTargets: string[] = [], 
  previousResult?: string,
  forceMeme: boolean = false // New parameter to force MEME rarity
): Promise<CombinationResult> => {
  try {
    let prompt = `
    Current Era: ${eraName}
    Combine: [${element1.emoji} ${element1.name}] + [${element2.emoji} ${element2.name}]
    `;

    if (forceMeme) {
      prompt += `\n**SPECIAL EVENT**: The universe is glitching! You MUST create a "MEME" rarity result. 
      Make it funny, absurd, or a famous internet reference.`;
    }

    if (missionTargets.length > 0) {
      prompt += `\n**PRIORITY MISSION TARGETS**: ${missionTargets.join(", ")}
      (If the combination logically leads to any of these, generate it! Mission targets usually override memes unless forced.)`;
    }

    if (previousResult) {
      prompt += `\n**AVOID THIS RESULT**: "${previousResult}"
      (The user already found this. Create something DIFFERENT and CREATIVE.)`;
    }

    prompt += `\nDetermine the result name, emoji, color, witty description, and RARITY.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Result name in Korean" },
            emoji: { type: Type.STRING, description: "Representative emoji" },
            color: { type: Type.STRING, description: "Hex color code" },
            description: { type: Type.STRING, description: "Funny/Witty description in Korean" },
            rarity: { 
              type: Type.STRING, 
              enum: ["COMMON", "RARE", "EPIC", "LEGENDARY", "CURSED", "MEME"],
              description: "The rarity/vibe of the result"
            },
          },
          required: ["name", "emoji", "color", "description", "rarity"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as CombinationResult;
    return result;
  } catch (error) {
    console.error("Gemini combination failed:", error);
    return {
      name: "???",
      emoji: "❓",
      color: "#64748b",
      description: "알 수 없는 물질이 생성되었습니다.",
      rarity: "COMMON"
    };
  }
};

export const generateElementImage = async (name: string, description: string): Promise<string | undefined> => {
  try {
    // Generate an image for MEME rarity items
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a funny, high-quality sticker-style illustration for an item named "${name}". 
            Context: ${description}. 
            Style: Digital art, vibrant colors, sticker outline, white background.`
          },
        ],
      },
      config: {
        // Nano Banana models don't support responseMimeType or responseSchema
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Image generation failed:", error);
    return undefined;
  }
};