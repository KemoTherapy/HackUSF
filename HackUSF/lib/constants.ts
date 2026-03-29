import type { RegionOption, LevelInfo, ScenarioInfo, CefrLevel, VoiceOption, Region } from "./types"

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
  { id: "restaurant",   name: "Restaurant Ordering",     icon: "🍽️", estimatedTime: "~8 min",  minLevel: "A1" },
  { id: "directions",   name: "Asking for Directions",   icon: "🗺️", estimatedTime: "~6 min",  minLevel: "A1" },
  { id: "coffee_shop",  name: "Coffee Shop",             icon: "☕",  estimatedTime: "~5 min",  minLevel: "A1" },
  { id: "hotel",        name: "Hotel Check-In",          icon: "🏨", estimatedTime: "~7 min",  minLevel: "A1" },
  { id: "job_interview",name: "Job Interview",           icon: "💼", estimatedTime: "~10 min", minLevel: "B2" },
  { id: "doctor",       name: "Doctor's Appointment",    icon: "🏥", estimatedTime: "~8 min",  minLevel: "B2" },
  { id: "apartment",    name: "Apartment Viewing",       icon: "🏠", estimatedTime: "~8 min",  minLevel: "C1" },
  { id: "negotiation",  name: "Resolving a Complaint",   icon: "🤝", estimatedTime: "~8 min",  minLevel: "C1" },
  { id: "debate",       name: "Opinion Debate",          icon: "🗣️", estimatedTime: "~12 min", minLevel: "C2" },
  { id: "storytelling", name: "Storytelling",            icon: "📖", estimatedTime: "~10 min", minLevel: "C2" },
]

export const LEVEL_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"]

export function scenariosForLevel(level: CefrLevel): ScenarioInfo[] {
  const idx = LEVEL_ORDER.indexOf(level)
  return SCENARIOS.filter((s) => LEVEL_ORDER.indexOf(s.minLevel) <= idx)
}

export const PRACTICE_TOPICS = [
  { id: "introduce", label: "Introduce yourself" },
  { id: "hobbies", label: "Your hobbies" },
  { id: "travel", label: "Travel" },
  { id: "daily_life", label: "Daily life" },
  { id: "free", label: "Free topic" },
] as const

export const SCENARIO_CONTEXTS: Record<string, { context: string; goal: string }> = {
  restaurant: {
    context: "You're at a restaurant. Millions of people face this same moment in a new country.",
    goal: "Greet the waiter, order food, and ask for the check.",
  },
  directions: {
    context: "You're lost in an unfamiliar city and need to ask someone for help.",
    goal: "Ask a local for directions and understand their response.",
  },
  coffee_shop: {
    context: "A simple everyday errand. Not so simple when you're still learning the language.",
    goal: "Order a coffee and a pastry, and ask about Wi-Fi.",
  },
  hotel: {
    context: "You've just arrived somewhere new. Practice making yourself understood from the start.",
    goal: "Check in, ask about amenities, and request a room upgrade.",
  },
  job_interview: {
    context: "One of the highest-stakes conversations you can have. Practice it before the real thing.",
    goal: "Introduce yourself, answer questions about your experience, and ask about the role.",
  },
  doctor: {
    context: "Describing how you feel to a doctor is already hard. In another language, it's even harder.",
    goal: "Describe your symptoms clearly, answer the doctor's questions, and understand the advice given.",
  },
  apartment: {
    context: "Finding a place to live in a new country means having tough conversations under pressure.",
    goal: "Ask about rent, terms, and key features, and express your interest or concerns.",
  },
  negotiation: {
    context: "Standing up for yourself takes more than vocabulary. It takes confidence.",
    goal: "Explain the problem clearly, negotiate a refund or replacement, and reach an agreement.",
  },
  debate: {
    context: "Real fluency means saying what you actually think, not just what's easy to say.",
    goal: "Express your opinion on a topic, respond to counter-arguments, and defend your position.",
  },
  storytelling: {
    context: "Connection happens through stories. Start sharing yours.",
    goal: "Tell a complete story with a clear beginning, middle, and end.",
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
    job_interview: [
      { phrase: "Tengo experiencia en...", translation: "I have experience in..." },
      { phrase: "Me considero una persona...", translation: "I consider myself a..." },
      { phrase: "¿Cuáles son las responsabilidades del puesto?", translation: "What are the responsibilities of the position?" },
      { phrase: "Estoy muy interesado/a en este puesto", translation: "I am very interested in this position" },
    ],
    doctor: [
      { phrase: "Me duele...", translation: "My ... hurts" },
      { phrase: "Tengo fiebre desde hace...", translation: "I've had a fever for..." },
      { phrase: "¿Qué medicamento me recomienda?", translation: "What medication do you recommend?" },
      { phrase: "No tengo alergia a ningún medicamento", translation: "I have no medication allergies" },
    ],
    apartment: [],
    negotiation: [],
    debate: [],
    storytelling: [],
  },
  C1: {
    restaurant: [],
    directions: [],
    coffee_shop: [],
    hotel: [],
    job_interview: [
      { phrase: "Mi mayor fortaleza es...", translation: "My greatest strength is..." },
      { phrase: "He liderado equipos de...", translation: "I have led teams of..." },
    ],
    doctor: [
      { phrase: "El dolor es intermitente", translation: "The pain is intermittent" },
      { phrase: "Empeora cuando...", translation: "It gets worse when..." },
    ],
    apartment: [
      { phrase: "¿Está incluido en el alquiler?", translation: "Is it included in the rent?" },
      { phrase: "¿Cuál es la duración mínima del contrato?", translation: "What is the minimum contract length?" },
      { phrase: "¿Se permiten mascotas?", translation: "Are pets allowed?" },
      { phrase: "¿Cuándo estaría disponible el piso?", translation: "When would the apartment be available?" },
    ],
    negotiation: [
      { phrase: "El producto llegó defectuoso", translation: "The product arrived defective" },
      { phrase: "Me gustaría solicitar un reembolso", translation: "I would like to request a refund" },
      { phrase: "Esto no corresponde a lo que pedí", translation: "This does not match what I ordered" },
      { phrase: "¿Cuál es su política de devoluciones?", translation: "What is your return policy?" },
    ],
    debate: [],
    storytelling: [],
  },
  C2: {
    restaurant: [],
    directions: [],
    coffee_shop: [],
    hotel: [],
    job_interview: [],
    doctor: [],
    apartment: [],
    negotiation: [],
    debate: [
      { phrase: "Desde mi punto de vista...", translation: "From my point of view..." },
      { phrase: "Habría que matizar que...", translation: "One should nuance that..." },
      { phrase: "No estoy del todo de acuerdo porque...", translation: "I don't entirely agree because..." },
      { phrase: "Si bien es cierto que..., también es verdad que...", translation: "While it is true that..., it is also true that..." },
    ],
    storytelling: [
      { phrase: "Resulta que...", translation: "It turned out that..." },
      { phrase: "En aquel entonces...", translation: "Back then..." },
      { phrase: "De repente, sin esperarlo...", translation: "Suddenly, out of nowhere..." },
      { phrase: "Al final de cuentas...", translation: "When all was said and done..." },
    ],
  },
}

// macOS Enhanced voices available per region
export const VOICES_BY_REGION: Record<Region, VoiceOption[]> = {
  mexico: [
    { id: "Mónica", name: "Mónica", gender: "female" },
    { id: "Reed (Spanish (Mexico))", name: "Reed", gender: "male" },
    { id: "Eddy (Spanish (Mexico))", name: "Eddy", gender: "male" },
  ],
  spain: [
    { id: "Mónica", name: "Mónica", gender: "female" },
    { id: "Eddy (Spanish (Spain))", name: "Eddy", gender: "male" },
  ],
  latin_america: [
    { id: "Mónica", name: "Mónica", gender: "female" },
    { id: "Reed (Spanish (Mexico))", name: "Reed", gender: "male" },
  ],
  france: [
    { id: "Amélie", name: "Amélie", gender: "female" },
    { id: "Thomas", name: "Thomas", gender: "male" },
    { id: "Jacques", name: "Jacques", gender: "male" },
  ],
  quebec: [
    { id: "Amélie", name: "Amélie", gender: "female" },
    { id: "Eddy (French (Canada))", name: "Eddy", gender: "male" },
  ],
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
  voice: null,
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
