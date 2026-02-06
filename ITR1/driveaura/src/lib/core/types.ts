export type ModuleCategory = "EV" | "Safety" | "RoadRules" | "General";

export interface User {
  id: string;
  name: string;
  auraPoints: number;
  completedModuleIds: string[];
  moduleProgress: Record<string, number>; 
}

export interface Module {
  id: string;
  title: string;
  category: ModuleCategory;
  requiredPointsToUnlock: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}

export const DEFAULT_USERS: User[] = [
  { id: "u1", name: "Mobeen", auraPoints: 0, completedModuleIds: [], moduleProgress: {} }
];

export const DEFAULT_MODULES: Module[] = [
  { id: "m1", title: "Safety 101", category: "Safety", requiredPointsToUnlock: 0 },
  { id: "m2", title: "EV Basics", category: "EV", requiredPointsToUnlock: 20 }
];