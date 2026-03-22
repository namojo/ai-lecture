export type ChapterType = "concept" | "demo" | "hands-on" | "workshop";

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  type: ChapterType;
  contentPath: string;
  estimatedMinutes: number;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  chapters: Chapter[];
  estimatedMinutes: number;
}

export interface ProgressEntry {
  chapterId: string;
  completed: boolean;
  completedAt: string | null;
  lastVisitedAt: string;
}

export type ProgressMap = Record<string, ProgressEntry>;
