export type Language = "spanish" | "french"

export type Region = "mexico" | "spain" | "latin_america" | "france" | "quebec"

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export type Scenario = "restaurant" | "directions" | "coffee_shop" | "hotel"

export type PracticeMode = "speaking" | "writing"

export type PracticeTopic = "introduce" | "hobbies" | "travel" | "daily_life" | "free"

export interface RegionOption {
  id: Region
  language: Language
  name: string
  dialect: string
  flag: string
  imageSrc: string
}

export interface LevelInfo {
  level: CefrLevel
  name: string
  description: string
}

export interface ScenarioInfo {
  id: Scenario
  name: string
  icon: string
  estimatedTime: string
}

export interface Phrase {
  phrase: string
  translation: string
  phonetic?: string
}

export interface LevelProgress {
  starsEarned: number
  completed: boolean
  scenariosCompleted: Scenario[]
  bestScore: number
}

export interface GuestSession {
  id: string
  language: Language | null
  region: Region | null
  currentLevel: CefrLevel
  levelProgress: Record<CefrLevel, LevelProgress>
  sessions: PracticeSession[]
  createdAt: string
}

export interface PracticeSession {
  id: string
  mode: "lesson" | "speaking" | "writing"
  language: Language
  region: Region
  cefrLevel: CefrLevel
  scenario?: Scenario
  topic?: string
  startTime: string
  endTime?: string
  transcript?: Turn[]
  analysis?: AnalysisReport
  starsEarned?: number
  score?: number
}

export interface Turn {
  id: string
  speaker: "user" | "ai"
  text: string
  translation?: string
  timestamp: string
}

export interface AnalysisReport {
  overallScore: number
  starsEarned: number
  categories: {
    pronunciation: CategoryScore
    grammar: CategoryScore
    vocabulary: CategoryScore
    fluency: CategoryScore
    naturalness: CategoryScore
    confidence: CategoryScore
  }
  strengths: string[]
  weaknesses: string[]
  corrections: Correction[]
  nextSteps: string[]
}

export interface CategoryScore {
  score: number
  notes: string[]
}

export interface Correction {
  original: string
  corrected: string
  explanation: string
  type: "grammar" | "vocabulary" | "pronunciation" | "naturalness"
}

export interface WritingExercise {
  id: string
  type: "comprehension" | "fill_blank" | "translation"
  prompt: string
  passage?: string
  options?: string[]
  answer: string
  explanation: string
}
