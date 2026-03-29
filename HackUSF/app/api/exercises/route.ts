import Anthropic from "@anthropic-ai/sdk"
import type { Language, Region, CefrLevel, WritingExercise } from "@/lib/types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DIALECT_MAP: Record<Region, string> = {
  mexico: "Mexican Spanish",
  spain: "Castilian Spanish",
  latin_america: "General Latin American Spanish",
  france: "Parisian French",
  quebec: "Québécois French",
}

const CEFR_DIFFICULTY: Record<CefrLevel, string> = {
  A1: "very simple — single words, basic greetings, numbers 1-20, colors, family members",
  A2: "simple — everyday phrases, present tense, basic questions",
  B1: "intermediate — past tense, preferences, travel vocabulary, giving opinions",
  B2: "upper intermediate — complex sentences, conditional, subjunctive, nuanced vocabulary",
  C1: "advanced — idiomatic expressions, complex grammar, abstract topics",
  C2: "mastery — native-level idioms, cultural references, literary vocabulary",
}

const MEDICAL_CEFR_FOCUS: Record<CefrLevel, string> = {
  A1: "basic body parts (head, arm, leg, stomach), simple symptoms (pain, fever, cough, nausea), numbers for vital signs, yes/no questions a patient might answer",
  A2: "common symptoms and injuries, asking where it hurts, describing duration ('since yesterday', 'for two days'), basic medications, telling the patient to open their mouth or breathe",
  B1: "describing pain type (sharp, dull, throbbing, burning), taking a brief patient history, asking about allergies and current medications, explaining what you are going to do, basic diagnoses",
  B2: "clinical history taking, discussing treatment plans, explaining dosage and instructions, describing procedures, discussing risk factors and family history, emergency triage vocabulary",
  C1: "specialist consultations, interpreting patient-reported symptoms precisely, informed consent language, differential diagnoses, referral and discharge instructions, trauma and emergency vocabulary",
  C2: "full medical consultation register, rare conditions and complex pharmacology, nuanced patient communication, documentation and clinical note phrasing, ethical conversations about prognosis",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { language, region, cefrLevel, topic }: { language: Language; region: Region; cefrLevel: CefrLevel; topic?: string } = body

    const langName = language === "spanish" ? "Spanish" : "French"
    const dialect = DIALECT_MAP[region]
    const difficulty = CEFR_DIFFICULTY[cefrLevel]
    const isMedical = topic === "medical"

    const topicInstruction = isMedical
      ? `TOPIC FOCUS: Medical and healthcare vocabulary for a frontline healthcare worker (e.g. a doctor, nurse, or medic) who needs to communicate with patients in ${langName}. Focus on: ${MEDICAL_CEFR_FOCUS[cefrLevel]}. All passages and sentences must be set in a clinical or field medical context — patient consultations, triage, giving instructions, describing symptoms or treatments.`
      : `Make exercises practical and useful for real-life everyday situations.`

    const prompt = `Generate 5 language learning exercises for a ${langName} learner.

DIALECT: ${dialect}
LEVEL: ${cefrLevel} — ${difficulty}
${topicInstruction}

Create a mix of exercise types. Return a JSON array of exactly 5 exercises matching this structure:

[
  {
    "id": "1",
    "type": "comprehension",
    "prompt": <question about the passage>,
    "passage": <short ${langName} text 2-4 sentences>,
    "options": [<3 answer options in English>],
    "answer": <correct option, must exactly match one of the options>,
    "explanation": <brief English explanation of why it's correct>
  },
  {
    "id": "2",
    "type": "fill_blank",
    "prompt": <sentence with ___ where the blank goes, in ${langName}>,
    "options": [<3 ${langName} word/phrase options>],
    "answer": <correct option, must exactly match one of the options>,
    "explanation": <brief English explanation>
  },
  {
    "id": "3",
    "type": "translation",
    "prompt": <English phrase to translate to ${langName}>,
    "answer": <correct ${langName} translation>,
    "explanation": <brief note on grammar or vocabulary>
  },
  {
    "id": "4",
    "type": "comprehension",
    ...
  },
  {
    "id": "5",
    "type": "fill_blank",
    ...
  }
]

Rules:
- All ${langName} content must use ${dialect}
- Difficulty must match ${cefrLevel} level: ${difficulty}
- Keep passages SHORT and clear
- Return ONLY the JSON array, no other text`

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    })

    const rawText = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)

    if (!jsonMatch) {
      return Response.json(getFallbackExercises(language))
    }

    const exercises = JSON.parse(jsonMatch[0]) as WritingExercise[]
    return Response.json(exercises)
  } catch (error) {
    console.error("Exercises API error:", error)
    return Response.json(getFallbackExercises("spanish"))
  }
}

function getFallbackExercises(language: Language): WritingExercise[] {
  if (language === "french") {
    return [
      {
        id: "1",
        type: "comprehension",
        prompt: "Where does Marie live?",
        passage: "Bonjour, je m'appelle Marie. J'habite à Paris et je travaille dans un café.",
        options: ["London", "Paris", "Lyon"],
        answer: "Paris",
        explanation: "Marie says 'J'habite à Paris' — 'j'habite' means 'I live'",
      },
      {
        id: "2",
        type: "fill_blank",
        prompt: "Je ___ un café, s'il vous plaît.",
        options: ["voudrais", "voudrait", "voulez"],
        answer: "voudrais",
        explanation: "'Je voudrais' means 'I would like' — polite first person form",
      },
      {
        id: "3",
        type: "translation",
        prompt: "Where is the train station?",
        answer: "Où est la gare?",
        explanation: "'Où est' means 'where is', 'la gare' means 'train station'",
      },
      {
        id: "4",
        type: "comprehension",
        prompt: "What does Pierre do for work?",
        passage: "Je m'appelle Pierre. Je suis professeur. J'enseigne le français à l'école.",
        options: ["Doctor", "Teacher", "Chef"],
        answer: "Teacher",
        explanation: "'Je suis professeur' means 'I am a teacher', 'j'enseigne' means 'I teach'",
      },
      {
        id: "5",
        type: "fill_blank",
        prompt: "¿___ es la bibliothèque?",
        options: ["Où", "Quand", "Qui"],
        answer: "Où",
        explanation: "'Où' means 'where' — used to ask about location",
      },
    ]
  }

  return [
    {
      id: "1",
      type: "comprehension",
      prompt: "Where is Carlos from?",
      passage: "Hola, me llamo Carlos. Soy de México y trabajo como ingeniero. Me gusta mucho el fútbol.",
      options: ["Spain", "Mexico", "Argentina"],
      answer: "Mexico",
      explanation: "Carlos says 'Soy de México' — 'soy de' means 'I am from'",
    },
    {
      id: "2",
      type: "fill_blank",
      prompt: "Yo ___ un café, por favor.",
      options: ["quiero", "quieres", "queremos"],
      answer: "quiero",
      explanation: "'Quiero' is first person singular of 'querer' — 'I want'",
    },
    {
      id: "3",
      type: "translation",
      prompt: "I would like to reserve a table.",
      answer: "Me gustaría reservar una mesa.",
      explanation: "'Me gustaría' is the polite form of 'I would like'",
    },
    {
      id: "4",
      type: "comprehension",
      prompt: "What does María love doing?",
      passage: "Me llamo María. Vivo en Barcelona y me encanta leer libros. También me gusta cocinar.",
      options: ["Reading books", "Cooking", "Playing soccer"],
      answer: "Reading books",
      explanation: "'Me encanta' (I love) is stronger than 'me gusta' (I like) — reading is her favorite",
    },
    {
      id: "5",
      type: "fill_blank",
      prompt: "¿Dónde ___ el baño?",
      options: ["está", "es", "son"],
      answer: "está",
      explanation: "Use 'está' (not 'es') for temporary location of objects",
    },
  ]
}
