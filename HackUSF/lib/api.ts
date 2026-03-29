import type {
  Language,
  Region,
  CefrLevel,
  Scenario,
  Phrase,
  AnalysisReport,
  WritingExercise,
  Turn,
} from "./types"
import { KEY_PHRASES } from "./constants"

// ─── Lesson / Speaking ───────────────────────────────────────────────────────

export async function startLesson(params: {
  language: Language
  region: Region
  cefrLevel: CefrLevel
  scenario: Scenario
}): Promise<{ sessionId: string; aiMessage: string; keyPhrases: Phrase[] }> {
  const { language, region, cefrLevel, scenario } = params

  // Build the opening AI message via the chat API
  const openingPrompt = getOpeningPrompt(language, scenario)
  const { text: aiMessage } = await streamChatMessage({
    messages: [{ role: "user", content: openingPrompt }],
    language,
    region,
    cefrLevel,
    mode: "lesson",
    scenario,
  })

  const phrases = KEY_PHRASES[cefrLevel]?.[scenario] || []

  return {
    sessionId: crypto.randomUUID(),
    aiMessage,
    keyPhrases: phrases,
  }
}

// Send a message and stream back the full reply as a string
export async function sendMessage(params: {
  sessionId: string
  messages: { role: "user" | "assistant"; content: string }[]
  language: Language
  region: Region
  cefrLevel: CefrLevel
  mode: "lesson" | "speaking"
  scenario?: Scenario
  topic?: string
  onChunk?: (chunk: string) => void
}): Promise<{ aiReply: string; lessonComplete: boolean }> {
  const { messages, language, region, cefrLevel, mode, scenario, topic, onChunk } = params

  const { text, lessonComplete } = await streamChatMessage({
    messages,
    language,
    region,
    cefrLevel,
    mode,
    scenario,
    topic,
    onChunk,
  })

  return { aiReply: text, lessonComplete }
}

async function streamChatMessage(params: {
  messages: { role: "user" | "assistant"; content: string }[]
  language: Language
  region: Region
  cefrLevel: CefrLevel
  mode: "lesson" | "speaking"
  scenario?: Scenario
  topic?: string
  onChunk?: (chunk: string) => void
}): Promise<{ text: string; lessonComplete: boolean }> {
  const { messages, language, region, cefrLevel, mode, scenario, topic, onChunk } = params

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, language, region, cefrLevel, mode, scenario, topic }),
  })

  if (!response.ok) throw new Error("Chat API failed")
  if (!response.body) throw new Error("No response body")

  const lessonComplete = response.headers.get("X-Lesson-Complete") === "true"

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    fullText += chunk
    onChunk?.(chunk)
  }

  return { text: fullText, lessonComplete }
}

// ─── End of session analysis ─────────────────────────────────────────────────

export async function endSession(params: {
  sessionId: string
  transcript: Turn[]
  language: Language
  cefrLevel: CefrLevel
  scenario?: Scenario
  mode: "lesson" | "speaking"
}): Promise<AnalysisReport> {
  const { transcript, language, cefrLevel, scenario, mode } = params

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, language, cefrLevel, scenario, mode }),
  })

  if (!response.ok) throw new Error("Analysis API failed")
  return response.json() as Promise<AnalysisReport>
}

// ─── Writing exercises ────────────────────────────────────────────────────────

export async function getWritingExercises(params: {
  language: Language
  region: Region
  cefrLevel: CefrLevel
  topic?: string
}): Promise<WritingExercise[]> {
  const response = await fetch("/api/exercises", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })

  if (!response.ok) throw new Error("Exercises API failed")
  return response.json() as Promise<WritingExercise[]>
}

export async function checkAnswer(params: {
  exerciseType: "comprehension" | "fill_blank" | "translation"
  userAnswer: string
  correctAnswer: string
  prompt: string
  language: Language
}): Promise<{ correct: boolean; correctAnswer: string; explanation: string }> {
  const response = await fetch("/api/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })

  if (!response.ok) throw new Error("Check answer API failed")
  return response.json()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOpeningPrompt(language: Language, scenario: Scenario): string {
  // We send a user "start" message to trigger the AI's opening line in character
  const isFrench = language === "french"
  const prompts: Record<Scenario, string> = {
    restaurant:    isFrench ? "Bonjour, je voudrais une table." : "Hola, buenas tardes.",
    directions:    isFrench ? "Excusez-moi." : "Disculpe.",
    coffee_shop:   isFrench ? "Bonjour." : "Buenos días.",
    hotel:         isFrench ? "Bonjour, j'ai une réservation." : "Buenas tardes, tengo una reservación.",
    physician:     isFrench ? "Bonjour docteur, j'ai un rendez-vous." : "Buenos días, doctor. Tengo una cita.",
    soldier:       isFrench ? "Soldat, j'ai besoin d'un rapport de situation." : "Soldado, necesito un informe de la situación.",
    emergency_help:isFrench ? "Excusez-moi, j'ai besoin d'aide s'il vous plaît." : "Disculpe, necesito ayuda, por favor.",
    job_interview: isFrench ? "Bonjour, je suis ici pour l'entretien." : "Buenos días, vengo para la entrevista.",
    doctor:        isFrench ? "Bonjour, j'ai rendez-vous." : "Buenos días, tengo una cita.",
    apartment:     isFrench ? "Bonjour, je viens voir l'appartement." : "Hola, vengo a ver el apartamento.",
    negotiation:   isFrench ? "Bonjour, j'ai un problème avec un achat récent." : "Hola, tengo un problema con una compra reciente.",
    debate:        isFrench ? "Bonjour, je voudrais discuter d'un sujet qui m'intéresse." : "Hola, me gustaría hablar sobre algo que me parece interesante.",
    storytelling:  isFrench ? "Bonjour, je voulais vous raconter quelque chose qui m'est arrivé." : "Hola, quería contarte algo que me pasó.",
  }
  return prompts[scenario]
}
