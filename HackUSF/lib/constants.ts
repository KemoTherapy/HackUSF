import type { RegionOption, LevelInfo, ScenarioInfo, CefrLevel } from "./types"

export const REGIONS: RegionOption[] = [
  {
    id: "mexico",
    language: "spanish",
    name: "Mexico",
    dialect: "Mexican Spanish",
    flag: "🇲🇽",
    imageSrc: "/regions/mexico.jpg",
  },
  {
    id: "spain",
    language: "spanish",
    name: "Spain",
    dialect: "Castilian Spanish",
    flag: "🇪🇸",
    imageSrc: "/regions/spain.jpg",
  },
  {
    id: "latin_america",
    language: "spanish",
    name: "Latin America",
    dialect: "General Latin American",
    flag: "🌎",
    imageSrc: "/regions/latin-america.jpg",
  },
  {
    id: "france",
    language: "french",
    name: "France",
    dialect: "Parisian French",
    flag: "🇫🇷",
    imageSrc: "/regions/france.jpg",
  },
  {
    id: "quebec",
    language: "french",
    name: "Quebec",
    dialect: "Québécois French",
    flag: "🍁",
    imageSrc: "/regions/quebec.jpg",
  },
]

export const LEVELS: LevelInfo[] = [
  {
    level: "A1",
    name: "Absolute Beginner",
    description: "Basic greetings, numbers, simple phrases",
  },
  {
    level: "A2",
    name: "Elementary",
    description: "Everyday topics, simple questions and answers",
  },
  {
    level: "B1",
    name: "Intermediate",
    description: "Travel, preferences, past and future tense",
  },
  {
    level: "B2",
    name: "Upper Intermediate",
    description: "Opinions, complex sentences, wider vocabulary",
  },
  {
    level: "C1",
    name: "Advanced",
    description: "Nuanced conversation, near-fluent expression",
  },
  {
    level: "C2",
    name: "Mastery",
    description: "Native-like fluency, idiomatic expression",
  },
]

export const SCENARIOS: ScenarioInfo[] = [
  {
    id: "restaurant",
    name: "Restaurant Ordering",
    icon: "🍽️",
    estimatedTime: "~8 min",
  },
  {
    id: "directions",
    name: "Asking for Directions",
    icon: "🗺️",
    estimatedTime: "~6 min",
  },
  {
    id: "coffee_shop",
    name: "Coffee Shop",
    icon: "☕",
    estimatedTime: "~5 min",
  },
  {
    id: "hotel",
    name: "Hotel Check-In",
    icon: "🏨",
    estimatedTime: "~7 min",
  },
]

export const PRACTICE_TOPICS = [
  { id: "introduce", label: "Introduce yourself" },
  { id: "hobbies", label: "Your hobbies" },
  { id: "travel", label: "Travel" },
  { id: "daily_life", label: "Daily life" },
  { id: "free", label: "Free topic" },
] as const

export const SCENARIO_CONTEXTS: Record<string, { context: string; goal: string }> = {
  restaurant: {
    context: "You are at a restaurant in Mexico City",
    goal: "Greet the waiter, order food, and ask for the check.",
  },
  directions: {
    context: "You are lost in the city center",
    goal: "Ask for directions to the nearest metro station.",
  },
  coffee_shop: {
    context: "You are at a local coffee shop",
    goal: "Order a coffee and a pastry, and ask about Wi-Fi.",
  },
  hotel: {
    context: "You have just arrived at your hotel",
    goal: "Check in, ask about amenities, and request a room upgrade.",
  },
}

export const KEY_PHRASES: Record<CefrLevel, Record<string, { phrase: string; translation: string; phonetic?: string }[]>> = {
  A1: {
    restaurant: [
      { phrase: "Hola, buenas tardes", translation: "Hello, good afternoon", phonetic: "OH-lah, BWEH-nahs TAR-dehs" },
      { phrase: "Una mesa para dos, por favor", translation: "A table for two, please", phonetic: "OO-nah MEH-sah PAH-rah dohs, por fah-VOR" },
      { phrase: "¿Puedo ver el menú?", translation: "Can I see the menu?", phonetic: "PWEH-doh vehr ehl meh-NOO" },
      { phrase: "La cuenta, por favor", translation: "The check, please", phonetic: "lah KWEHN-tah, por fah-VOR" },
    ],
    directions: [
      { phrase: "Disculpe", translation: "Excuse me", phonetic: "dees-KOOL-peh" },
      { phrase: "¿Dónde está...?", translation: "Where is...?", phonetic: "DOHN-deh ehs-TAH" },
      { phrase: "A la derecha", translation: "To the right", phonetic: "ah lah deh-REH-chah" },
      { phrase: "A la izquierda", translation: "To the left", phonetic: "ah lah ees-KYEHR-dah" },
    ],
    coffee_shop: [
      { phrase: "Un café, por favor", translation: "A coffee, please", phonetic: "oon kah-FEH, por fah-VOR" },
      { phrase: "¿Tienen Wi-Fi?", translation: "Do you have Wi-Fi?", phonetic: "TYEH-nehn WEE-fee" },
      { phrase: "¿Cuánto cuesta?", translation: "How much is it?", phonetic: "KWAHN-toh KWEHS-tah" },
    ],
    hotel: [
      { phrase: "Tengo una reservación", translation: "I have a reservation", phonetic: "TEHN-goh OO-nah reh-sehr-vah-SYOHN" },
      { phrase: "Mi nombre es...", translation: "My name is...", phonetic: "mee NOHM-breh ehs" },
      { phrase: "¿A qué hora es el desayuno?", translation: "What time is breakfast?", phonetic: "ah keh OH-rah ehs ehl deh-sah-YOO-noh" },
    ],
  },
  A2: {
    restaurant: [
      { phrase: "Me gustaría pedir...", translation: "I would like to order..." },
      { phrase: "¿Qué me recomienda?", translation: "What do you recommend?" },
      { phrase: "¿Tienen opciones vegetarianas?", translation: "Do you have vegetarian options?" },
    ],
    directions: [
      { phrase: "¿Está lejos de aquí?", translation: "Is it far from here?" },
      { phrase: "¿Puedo ir caminando?", translation: "Can I walk there?" },
      { phrase: "Siga recto", translation: "Go straight" },
    ],
    coffee_shop: [
      { phrase: "¿Puedo sentarme aquí?", translation: "Can I sit here?" },
      { phrase: "Un café con leche", translation: "A coffee with milk" },
    ],
    hotel: [
      { phrase: "¿Hay habitaciones disponibles?", translation: "Are there rooms available?" },
      { phrase: "¿Tiene vista al mar?", translation: "Does it have a sea view?" },
    ],
  },
  B1: {
    restaurant: [
      { phrase: "¿Podría traerme la carta de vinos?", translation: "Could you bring me the wine list?" },
      { phrase: "¿Cuál es el plato del día?", translation: "What is the dish of the day?" },
    ],
    directions: [
      { phrase: "¿Cuánto tiempo se tarda en llegar?", translation: "How long does it take to get there?" },
    ],
    coffee_shop: [
      { phrase: "¿Tienen algún postre casero?", translation: "Do you have any homemade desserts?" },
    ],
    hotel: [
      { phrase: "Me gustaría extender mi estancia", translation: "I would like to extend my stay" },
    ],
  },
  B2: {
    restaurant: [
      { phrase: "¿El plato lleva algún ingrediente que pueda causar alergia?", translation: "Does the dish contain any allergens?" },
    ],
    directions: [],
    coffee_shop: [],
    hotel: [],
  },
  C1: {
    restaurant: [],
    directions: [],
    coffee_shop: [],
    hotel: [],
  },
  C2: {
    restaurant: [],
    directions: [],
    coffee_shop: [],
    hotel: [],
  },
}

export const DEFAULT_LEVEL_PROGRESS = {
  starsEarned: 0,
  completed: false,
  scenariosCompleted: [],
  bestScore: 0,
}

export const createInitialGuestSession = (): import("./types").GuestSession => ({
  id: crypto.randomUUID(),
  language: null,
  region: null,
  currentLevel: "A1",
  levelProgress: {
    A1: { ...DEFAULT_LEVEL_PROGRESS },
    A2: { ...DEFAULT_LEVEL_PROGRESS },
    B1: { ...DEFAULT_LEVEL_PROGRESS },
    B2: { ...DEFAULT_LEVEL_PROGRESS },
    C1: { ...DEFAULT_LEVEL_PROGRESS },
    C2: { ...DEFAULT_LEVEL_PROGRESS },
  },
  sessions: [],
  createdAt: new Date().toISOString(),
})
