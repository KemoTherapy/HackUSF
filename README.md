# LinguaAI

> **Speak it. Learn it. Live it.**
> AI-powered language learning for English speakers learning Spanish or French.

Built for HackUSF. A speech-first web app that combines structured CEFR-level lessons, free AI conversation practice, and text-based writing exercises — with real-time feedback and post-session analysis powered by Claude.

---

## Features

- **Learn path** — Choose language + region → CEFR level (A1–C2) → scenario lesson → earn up to 5 stars → practice
- **Practice path** — Jump straight into speaking (AI conversation) or writing/reading exercises at any level
- **4 lesson scenarios** — Restaurant, Directions, Coffee Shop, Hotel Check-In (each adapted per CEFR level)
- **5 regions** — Mexican Spanish, Castilian Spanish, Latin American Spanish, Parisian French, Québécois French
- **Real speech input** — Web Speech API with regional language codes (es-MX, fr-CA, etc.)
- **Streaming AI responses** — Claude claude-sonnet-4-6 streams replies in real time
- **TTS playback** — Every AI message can be replayed aloud via SpeechSynthesis
- **Post-session analysis** — Claude evaluates pronunciation, grammar, vocabulary, fluency, naturalness, confidence
- **Guest mode** — No login required, progress stored in localStorage

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| AI | Claude API (`claude-sonnet-4-6`) via `@anthropic-ai/sdk` |
| Speech-to-Text | Web Speech API (browser native) |
| Text-to-Speech | Web SpeechSynthesis API (browser native) |
| State | React Context + localStorage |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
- Chrome or Edge (required for Web Speech API / microphone input)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd HackUSF

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.local.example .env.local
# Then open .env.local and paste your Anthropic API key

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your_api_key_here
```

> Each teammate needs their own API key in their local `.env.local`. This file is gitignored and should never be committed.

---

## Project Structure

```
app/
├── page.tsx                    # Home (Learn vs Practice)
├── learn/
│   ├── language/page.tsx       # Language + region selection
│   ├── level/page.tsx          # CEFR level selection
│   ├── scenarios/page.tsx      # Scenario cards
│   ├── lesson/page.tsx         # Live lesson session
│   └── summary/page.tsx        # Post-lesson analysis
├── practice/
│   ├── page.tsx                # Practice home (difficulty + mode)
│   ├── speaking/page.tsx       # Free AI conversation
│   ├── writing/page.tsx        # Writing & reading exercises
│   └── summary/page.tsx        # Post-practice summary
├── dashboard/page.tsx          # Progress dashboard
├── history/page.tsx            # Session history
└── api/
    ├── chat/route.ts           # Claude streaming conversation
    ├── analyze/route.ts        # Post-session analysis
    ├── exercises/route.ts      # Writing exercise generation
    └── check-answer/route.ts   # Answer validation

components/
├── cards/                      # RegionCard, LevelCard, ScenarioCard, SessionHistoryCard
├── layout/                     # AppShell, PageHeader
├── lesson/                     # ChatBubble, PhraseBank, ScenarioIntro, HintPanel
├── practice/                   # DifficultyPicker, ModePicker, WritingExercise
├── analysis/                   # AnalysisSummary, TranscriptView, FeedbackCategory
└── ui/                         # MicButton, StarRating, CefrBadge, AudioWaveform, ScoreBar, etc.

hooks/
├── use-speech-recognition.ts   # Web Speech API wrapper
└── use-tts.ts                  # SpeechSynthesis wrapper

lib/
├── api.ts                      # All fetch calls to API routes
├── store.tsx                   # React Context + localStorage state
├── types.ts                    # All TypeScript interfaces
├── constants.ts                # Regions, levels, scenarios, key phrases
└── utils.ts                    # Helpers (scoreToStars, formatTime, etc.)
```

---

## API Routes

All Claude calls go through Next.js API routes so the API key stays server-side.

| Route | Purpose |
|---|---|
| `POST /api/chat` | Streaming conversation. Accepts message history, language, region, CEFR level, mode, scenario/topic. Returns streamed text. |
| `POST /api/analyze` | End-of-session analysis. Accepts full transcript. Returns `AnalysisReport` JSON. |
| `POST /api/exercises` | Generate 5 writing exercises (comprehension, fill-in, translation) for a level + dialect. |
| `POST /api/check-answer` | Validate exercise answers. Exact match for multiple choice, Claude for translations. |

---

## Key User Flows

### Learn Flow
```
Home → /learn/language → /learn/level → /learn/scenarios → /learn/lesson?scenario=X → /learn/summary?sessionId=X
```

### Practice Flow
```
Home → /practice → /practice/speaking?level=X  →  /practice/summary?sessionId=X&mode=speaking
                 → /practice/writing?level=X   →  /practice/summary?sessionId=X&mode=writing
```

---

## Notes for Teammates

- **Speech only works in Chrome/Edge** — Safari does not support the Web Speech API
- **Microphone permission** — browser will prompt on first use, must be allowed
- **Guest mode** — all progress is stored in `localStorage` under the key `lingua_guest_session`. Clearing browser data resets it.
- **CEFR levels C1/C2** — key phrases are not populated yet in `lib/constants.ts`, but lessons still work via Claude
- **`.env.local` is gitignored** — never commit your API key

---

## Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
