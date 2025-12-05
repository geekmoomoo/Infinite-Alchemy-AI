import { GoogleGenAI, Type } from "@google/genai";
import { Element, CombinationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the engine of an "Infinite Alchemy" game where the player evolves through eras.
Your goal is to combine two elements to create something new.

**Core Philosophy:**
- Creative, Witty, and Surprise-focused.
- If the combination allows, reflect the current ERA of the player (e.g., in Primitive Age, "Communication" -> "Smoke Signal", in Modern Age -> "Smartphone").
- Rarity based on coolness/weirdness.

**Rarity Guide:**
- "COMMON": Predictable
- "RARE": Specialized tools/jobs
- "EPIC": Advanced tech/Fantasy
- "LEGENDARY": Gods, Universe, Era-defining inventions
- "CURSED": Weird/Scary/Gross
- "MEME": Funny/Internet culture

**Rules:**
1. Result Name: KOREAN (Max 10 chars).
2. Description: Short, witty, KOREAN (Max 15 words).
3. Emoji: Pick the most fitting single emoji.
4. Color: Hex code.
`;

export const combineElements = async (
  element1: Element,
  element2: Element,
  eraName: string // Added era context
): Promise<CombinationResult> => {
  try {
    const prompt = `
    Current Era: ${eraName}
    Combine: [${element1.emoji} ${element1.name}] + [${element2.emoji} ${element2.name}]
    
    Determine the result name, emoji, color, witty description, and RARITY.
    `;

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