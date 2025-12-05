export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "CURSED" | "MEME";

export interface Element {
  id: string;
  name: string;
  emoji: string;
  color: string;
  discoveredAt: number;
  isNew?: boolean;
  description?: string;
  rarity?: Rarity;
  imageUrl?: string; // New: Stores the base64 image data
}

export interface CombinationResult {
  name: string;
  emoji: string;
  color: string;
  description: string;
  rarity: Rarity;
  imageUrl?: string;
}

export interface GameState {
  inventory: Element[];
  recipes: Record<string, string>;
  isGameClear?: boolean;
  currentEraIndex: number; // 0: Primitive, 1: Industrial, etc.
  completedMissions: string[];
}

export interface Mission {
  id: string;
  targetName: string;
  description: string;
  hint: string;
  isEraClimax?: boolean; // If true, this is the final mission to advance era
}

export interface Era {
  id: string;
  name: string;
  description: string;
  color: string;
  missions: Mission[];
}