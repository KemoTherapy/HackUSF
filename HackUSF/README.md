# Lingua

> AI-powered language learning for high-stakes, real-world conversations.

Lingua is a speech-first web application built for people who need to communicate in a second language before they are ready — first responders, healthcare workers, soldiers, humanitarian aid workers, and anyone navigating a new country. Rather than teaching vocabulary in isolation, Lingua places the learner inside realistic roleplay scenarios and adapts in real time to their proficiency level.

Built at HackUSF.

---

## The Problem

Language barriers are not just inconvenient — in certain contexts, they can be life-threatening. A doctor who cannot communicate with a patient. A soldier who cannot coordinate with local civilians. A relief worker who cannot give instructions in an emergency. Traditional language apps teach grammar and vocabulary but do not prepare people for the pressure of real conversation. Lingua does.

---

## Core Concept

Every session in Lingua is a conversation, not a quiz. The AI plays a character. The user plays a role. The system adapts vocabulary, sentence complexity, and pacing to the learner's CEFR level in real time — so an A1 beginner and a C1 advanced speaker can both practice the same scenario and get an appropriately challenging experience.

---

## Features

### Learn Path
Structured CEFR-level lessons with role-play scenarios. The AI stays fully in character, adapts dynamically to how the learner is performing, and signals lesson completion naturally rather than with a button.

**Scenarios available at all levels (A1–C2):**
- Restaurant Ordering
- Asking for Directions
- Coffee Shop
- Hotel Check-In
- **Physician Consultation** — The learner plays the doctor. The AI plays a patient presenting with realistic, varying complaints. Built for healthcare workers who need to communicate with patients in the field.
- **Military Fieldwork** — Both parties are soldiers. The learner makes callouts, describes terrain, and coordinates under simulated pressure. Vocabulary scales from basic directional commands at A1 to full tactical communication at C2.
- **Emergency Assistance** — The AI plays someone in distress. The learner practices assessing the situation, taking action, and communicating under stress.

**Scenarios unlocked at higher levels:**
- Job Interview (B2+)
- Doctor's Appointment (B2+)
- Apartment Viewing (C1+)
- Resolving a Complaint (C1+)
- Opinion Debate (C2)
- Storytelling (C2)

### Practice Path
Freeform conversation and exercises with no lesson structure.

- **Speaking** — Open-ended AI conversation on any topic at the learner's chosen level. Real-time pronunciation feedback via speech recognition confidence scoring.
- **Writing & Reading** — AI-generated exercises (reading comprehension, fill-in-the-blank, translation) at the selected CEFR level.
- **Medical Vocabulary** — A dedicated exercise track for healthcare workers. Exercises focus on clinical language: body parts, symptoms, patient history, triage, treatment instructions, and informed consent — calibrated per CEFR level.

### Live Transcript Panel (Lessons only)
A toggleable side panel that shows the AI's current message in the target language alongside a live English translation. Intended for moments when the learner cannot parse what was said — they can glance at the panel and continue the conversation without stopping.

### Adaptive AI Behavior
The AI monitors learner performance turn-by-turn and adjusts without announcing it:
- Short replies, English slipping in, or repeated words → simplify sentences, slow down, offer embedded hints
- Long confident replies, varied vocabulary → raise complexity naturally, push for nuance

### Post-Session Analysis
At the end of every speaking session, Claude evaluates the full transcript and returns a structured report covering pronunciation, grammar, vocabulary, fluency, naturalness, and confidence — with specific corrections and next steps.

### Resources
Curated external resources organized by region, including healthcare-specific vocabulary guides, medical films, podcasts on doctor visits, and emergency language references for French and Spanish learners.

### Region & Dialect Support
| Region | Language | Voice |
|---|---|---|
| Mexico | Mexican Spanish | Mónica, Reed, Eddy |
| Spain | Castilian Spanish | Mónica, Eddy |
| Latin America | General Latin American | Mónica, Reed |
| France | Parisian French | Amélie, Thomas, Jacques |
| Quebec | Québécois French | Amélie, Eddy |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| AI | Claude API (`claude-sonnet-4-6`, `claude-haiku-4-5`) via `@anthropic-ai/sdk` |
| Speech-to-Text | Web Speech API (browser native) |
| Text-to-Speech | Web SpeechSynthesis API (browser native) |
| State | Zustand + localStorage |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
- Chrome or Edge (required for the Web Speech API)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd HackUSF/HackUSF

# 2. Install dependencies
npm install

# 3. Add your API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```
ANTHROPIC_API_KEY=your_api_key_here
```

The `.env.local` file is gitignored. Never commit your API key.

---

## Project Structure

```
app/
├── page.tsx                        # Home
├── learn/
│   ├── language/page.tsx           # Language + region selection
│   ├── level/page.tsx              # CEFR level selection
│   ├── scenarios/page.tsx          # Scenario grid
│   ├── lesson/page.tsx             # Live lesson session
│   ├── summary/page.tsx            # Post-lesson analysis
│   └── resources/[region]/         # Region-specific resource pages
├── practice/
│   ├── page.tsx                    # Practice home (difficulty + mode)
│   ├── speaking/page.tsx           # Free AI conversation
│   ├── writing/page.tsx            # Writing & reading exercises (supports ?topic=medical)
│   └── summary/page.tsx            # Post-practice summary
├── dashboard/page.tsx              # Progress dashboard
├── history/page.tsx                # Session history
└── api/
    ├── chat/route.ts               # Claude conversation (streaming)
    ├── analyze/route.ts            # Post-session analysis
    ├── exercises/route.ts          # Exercise generation (general + medical)
    ├── translate/route.ts          # Live translation for transcript panel
    ├── check-answer/route.ts       # Answer validation
    └── tts/route.ts                # Text-to-speech proxy

components/
├── cards/                          # ScenarioCard, RegionCard, LevelCard, SessionHistoryCard
├── layout/                         # AppShell, PageHeader
├── lesson/                         # HintPanel, PhraseBank, SuggestionChips, TranscriptPanel
├── practice/                       # DifficultyPicker, ModePicker, WritingExercise
├── analysis/                       # AnalysisSummary, FeedbackCategory, TranscriptView
├── conversation/                   # ConversationOrb, ConversationTranscript
└── ui/                             # MicButton, StarRating, CefrBadge, ScoreBar, VoiceSelector, etc.

hooks/
├── use-speech-recognition.ts       # Web Speech API — continuous recording with silence detection
└── use-tts.ts                      # SpeechSynthesis wrapper with voice selection

lib/
├── api.ts                          # Client-side fetch wrappers for all API routes
├── store.ts                        # Zustand store + localStorage persistence
├── types.ts                        # TypeScript interfaces (Scenario, CefrLevel, Turn, etc.)
├── constants.ts                    # Regions, levels, all 13 scenarios, key phrases per level
└── utils.ts                        # Helpers
```

---

## API Routes

All Claude calls are server-side. The API key is never exposed to the client.

| Route | Purpose |
|---|---|
| `POST /api/chat` | Conversational AI. Accepts message history, language, region, CEFR level, mode, scenario/topic. Returns streamed text with an `X-Lesson-Complete` header when the scenario goal is achieved. |
| `POST /api/analyze` | End-of-session analysis. Accepts full transcript + confidence scores. Returns structured `AnalysisReport` with scores across 6 categories, corrections, and next steps. |
| `POST /api/exercises` | Generate 5 exercises for a given level and dialect. Accepts an optional `topic=medical` parameter to generate healthcare-focused content. |
| `POST /api/translate` | Translate a target-language string to English. Used by the live transcript panel. |
| `POST /api/check-answer` | Validate exercise answers. Multiple choice uses exact match; translations use Claude. |
| `POST /api/tts` | Text-to-speech proxy. |

---

## Key User Flows

### Learn
```
/ → /learn/language → /learn/level → /learn/scenarios → /learn/lesson?scenario=X → /learn/summary
```

### Practice
```
/ → /practice → /practice/speaking?level=X          → /practice/summary
              → /practice/writing?level=X            → /practice/summary
              → /practice/writing?level=X&topic=medical → /practice/summary
```

### Resources
```
/ → /learn/language → /learn/resources/[region]
```

---

## How Lesson Completion Works

The system prompt for each scenario includes a `LESSON GOAL` — a specific set of conditions that must be met for the conversation to be considered complete. When Claude determines the goal has been achieved, it appends the token `[LESSON_COMPLETE]` at the end of its farewell message. The server strips this token before streaming the response to the client, but sets the HTTP response header `X-Lesson-Complete: true`. The client reads this header and, after TTS finishes playing the farewell, triggers the end-of-session analysis flow automatically.

---

## Notes

- **Browser support** — Speech recognition requires Chrome or Edge. Safari does not support the Web Speech API.
- **Microphone** — The browser will prompt for microphone permission on first use.
- **Guest mode** — All progress is stored in `localStorage` under `lingua_guest_session`. Clearing browser storage resets it.
- **Silence detection** — The speech recognition hook auto-submits after 2.5 seconds of silence following the last detected word.
- **AI model selection** — Conversations and analysis use `claude-sonnet-4-6`. Live translation uses `claude-haiku-4-5` for lower latency.

---

## Scripts

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
